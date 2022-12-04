const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const downloadImage = async (url, imageDirPath) => {
  // 从 url 中截取文件名
  const name = url.split('/').pop();
  // 拼接保存路径
  const savePath = path.resolve(imageDirPath, name)
  // 如果图片文件已存在于指定保存目录，则直接返回文件名
  if (fs.existsSync(savePath)) return name;
  try {
    // 请求图片的url，指定响应为二进制流的形式
    const res = await axios.get(url, { responseType: 'stream' });
    // 将响应的数据写入到文件中
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
  const itemSelector = '.doulist-subject';
  let results = [];
  $(itemSelector).each((index, item) => {
    try {
      const el = $(item);
      const link = el.find('.title a');
      const id = link.attr('href')?.split('/')?.at(-2);
      if (!id) {
        throw new Error('link element not find:');
      }
      const reg = /([^\\n.\s].*[^\\n.\s])/gm
      const title = reg.exec(link.text())[1].trim();
      const coverImageSrc = el.find('.post img').attr('src') ?? null;
      results.push({
        id,
        cover: coverImageSrc,
        title: title,
      })
    } catch (error) {
      console.error('parse html document error:', error)
    }
  });
  return results;
}

const saveAllPictures = async (urls, path) => {
  try {
    const result = await Promise.all(urls.map(async (url) => {
      const imageFileName = downloadImage(url, path)
      return imageFileName
    }))
    return result
  } catch (error) {
    console.error('save all pictures failed:', error)
    throw Error('picture save failed', error)
  }
}

module.exports = {
  downloadImage,
  parseHTML,
  saveAllPictures,
}