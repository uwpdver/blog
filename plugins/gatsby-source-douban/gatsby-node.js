const axios = require('axios').default;
const parseHTML = require('./utils').parseHTML;
const saveAllPictures = require('./utils').saveAllPictures;

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const createDoubanItemNode = (item, type) => {
    const nodeIdPrefix = type === 'music' ? 'douban-favorite-album-' : 'douban-favorite-film-'
    const nodeId = createNodeId(`${nodeIdPrefix}${item.id}`)
    const nodeContent = JSON.stringify(item)
    actions.createNode({
      ...item,
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: type,
        content: nodeContent,
        contentDigest: createContentDigest(item),
      },
    });
  }

  const process = async (type, pageUrl, { pathImageSaved }) => {
    try {
      const { data: document } = await axios.get(pageUrl);
      const items = parseHTML(document);
      const pictureFileNames = await saveAllPictures(
        items.map(item => item.cover),
        pathImageSaved
      );
      items
        .map((item, index) => ({ ...item, cover: pictureFileNames[index] }))
        .forEach((item) => {
          createDoubanItemNode(item, type)
        });
    } catch (error) {
      console.error('process douban favorite list failed:', error, type, pageUrl, pathImageSaved)
      throw Error('process douban favorite list failed', error)
    }
  }

  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins
  const { musiclistId, filmlistId } = configOptions;
  const pathImageSaved = configOptions.path;
  const baseUrl = 'https://www.douban.com/doulist';
  try {
    await Promise.all([
      process('DoubanFavoriteMusic', `${baseUrl}/${musiclistId}`, { pathImageSaved }),
      process('DoubanFavoriteFilm', `${baseUrl}/${filmlistId}`, { pathImageSaved }),
    ]);
  } catch (error) {
    console.error(error)
  }
}