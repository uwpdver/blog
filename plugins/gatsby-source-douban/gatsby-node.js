const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const downloadImage = async (url, imageDirPath) => {
  const name = url.split('/').pop();
  const savePath = path.resolve(imageDirPath, name)
  if (fs.existsSync(savePath)) return name;
  try {
    const res = await axios.get(url, { responseType: 'stream' });
    res.data.pipe(fs.createWriteStream(savePath))
    return new Promise((resolve, reject) => {
      res.data.on('end', () => resolve(name))
      res.data.on('error', (error) => reject(error))
    })
  } catch (error) {
    console.log('image download fail:', error)
  }
}

const parseHTML = (document) => {
  const $ = cheerio.load(document);
  const itemSelector = 'ul.doulist-items li > a';
  console.log('ul text', $('ul.doulist-items').html());
  let results = [];
  try {
    $(itemSelector).each((index, item) => {
      const link = item.attribs['href'];
      const id = link?.split('/')?.pop();
      if (!id) {
        throw new Error('link element not find:');
      }
      const coverImageSrc = item.find('.cover img').attr('src') ?? null;
      const title = item.find('.title').text() ?? '';
      results.push({
        id,
        cover: coverImageSrc,
        title: title,
      })
    });
  } catch (error) {
    console.log('parse html document error:', error)
  }
  console.log('results', results)
  return results;
}

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const processItem = item => {
    const { type, ...rest } = item;
    const nodeIdPrefix = type === 'music' ? 'douban-favorite-album-' : 'douban-favorite-film-'
    const nodeId = createNodeId(`${nodeIdPrefix}${rest.id}`)
    const nodeContent = JSON.stringify(rest)
    const nodeData = Object.assign({}, rest, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: type,
        content: nodeContent,
        contentDigest: createContentDigest(rest),
      },
    })
    actions.createNode(nodeData);
  }

  const createItemHandler = (type) => (url) =>
    axios.get(url)
      .then((res) => {
        console.log("status", res.status);
        return res.data;
      })
      .then(parseHTML)
      .then((items) =>
        Promise.all(
          items.map(item =>
            downloadImage(item.cover, configOptions.path)
              .then((imageName) => ({ ...item, cover: imageName, type }))
          )
        )
      )
      .then(items => items.forEach(processItem))
      .catch(error => {
        console.log(error);
      })

  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins
  // plugin code goes here...
  const handleMusic = createItemHandler('DoubanFavoriteMusic');
  const handleFilm = createItemHandler('DoubanFavoriteFilm');
  const { musiclistId, filmlistId } = configOptions;
  const baseUrl = 'https://m.douban.com/doulist';
  await Promise.all([
    handleMusic(`${baseUrl}/${musiclistId}`),
    handleFilm(`${baseUrl}/${filmlistId}`),
  ]);
}