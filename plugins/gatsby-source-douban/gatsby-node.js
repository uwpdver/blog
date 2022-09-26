const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const downloadImage = async (url, imageDirPath) => {
  const name = url.split('/').pop();
  const savePath = path.resolve(imageDirPath, name)
  if (fs.existsSync(savePath)) return name;
  const res = await axios.get(url, { responseType: 'stream' });
  res.data.pipe(fs.createWriteStream(savePath))
  return new Promise((resolve, reject) => {
    res.data.on('end', () => resolve(name))
    res.data.on('error', () => reject())
  })
}

const parseHTML = (document) => {
  const $ = cheerio.load(document);
  const itemSelector = 'ul.doulist-items li';
  let results = [];
  $(itemSelector).each((index, item) => {
    const elParsed = $(item);
    const id = elParsed.find('a').attr('href').split('/').pop();
    const cover = elParsed.find('.cover img').attr('src');
    results.push({
      id: id,
      cover: cover,
      title: elParsed.find('.title').text(),
    })
  });
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
      .then((res) => res.data)
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