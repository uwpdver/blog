---
title: gatsby-plugin-sharp 插件的故障排除记录
date: 2021-10-31 16:06
description: npm 的依赖问题再次困扰着我，我把它记录下来，吸取教训，希望 npm 早日被更好的工具取代。这次的问题是 gatsby 的插件版本与 gatsby4.0.2 不兼容导致的，升级插件版本就解决了。
category: 随笔
tags:
- "博客"
- "随笔"
- "Gatsby"
---

我又花费了大概 6 个小时去解决去解决 npm 的报错，我真的对 npm 深恶痛绝。

昨天我在装修我的博客，给博客的关于页面填充更多的信息，其中有一个展示技术栈的章节，我给每个技术的名字前面增加它们对应的图标。要搞清楚怎么用 Gatsby 的方式使用图片也是一件很麻烦的事情，这里就不细说，总之我弄了一个白天，终于把关于页面做好了。

提交代码等待 cloudflare page 自动部署成功。结果过了很久还没有更新好，上 cloudflare page 一看，构建过程出错了。错误信息是 `Gatsby-plugin-sharp wasn't setup correctly in gatsby-config.js. Make sure you add it to the plugins array`。字面意思就是 `Gatsby-plugin-sharp` 没有正确地设置在 `gatsby-config.js`文件中。我检查了一下发现是按照正确的方式设置的，在本地运行了构建脚本之后发现本地也有同样的问题。于是我开始用搜索寻找解决的办法，有的回答说是没有安装 `Gatsby-plugin-sharp` 这个包，但是我是安装了的。还有的回答说要清理 npm 的缓存。我也试过了，没用。中间尝试了各种方法，包括但不限于：

1. 删除 node_module 目录，重新安装依赖，无法安装成功。
2. 切换 npm 源为淘宝源，使用 npm 重新安装依赖，依然无法安装成功。
3. 使用 cnpm 安装依赖，结果找不到对应的版本的包。
4. 单独安装 `gatsby-plugin-sharp`，`gatsby-plugin-sharp` 版本更新了，但依然无法构建成功。
5. git 回滚到更新 `gatsby-plugin-sharp` 之前的版本，重新安装依赖，依然无法安装成功。

4. 使用 yarn 安装依赖，在安装 sharp 这个包时结果提示找不到 python

   1. 安装了 python，又提示需要  visual stdio。
   2. 安装了 visual stido，又提示缺少 C++ 核心组件，但是 C++ 核心组件体积太大了，而且之前也不需要安装这些东西也可以成功，于是没有在这条路上走下去。
   3. 因为是安装 sharp 这个库出现的问题，于是单独安装 sharp，每次都失败，错误信息是 `Something went wrong installing the "sharp" module`。
   4. 去 sharp 的官方文档中，看到了关于安装失败的建议，就是切换淘宝源，切换之后安装 sharp 成功了，但是 `gatsby build`还失败，并且是和上一步相同的错误信息。
   5. 继续搜索安装 sharp 的错误，看到 `gatsby-plugin-sharp` 的[官方文档](https://www.gatsbyjs.com/plugins/gatsby-plugin-sharp/#troubleshooting)中的故障排除，发现有可能是依赖 sharp 的包版本与 `Gatsby 4.x` 版本不兼容，需要更新。通过 `yarn why sharp` 命令查看有哪些包依赖 sharp，然后逐个将这些包升级到最新版本，运行 `gatsby build` 命令验证。结果还是出现和之前一样的报错。
   6. 执行 `yarn why sharp` 命令查看当前已安装的 sharp 的版本是否与依赖 sharp 的包所需的版本一致，检查之后发现差了 0.0.1 个版本号。又发现 sharp 被添加到了当前项目的依赖中，于是通过 `yarn remove sharp` 命令将当前的 sharp 移除。运行 `gatsby build` 命令验证。结果构建成功。

   ### 结论

   最终的原因就是**当前安装的 gatsby 插件版本与当前安装的 gatsby 版本不兼容**，解决方案就是**找到报错相关的插件，更新它们**。但是根据 npm 给出的报错信息，我根本找不到问题的原因，所以走了很多弯路。

   这次得到的教训就是：出了问题要思考自己在出错前做了什么改动。就像我昨天更新了一个很重要的包，它的插件没有更新，所以它们不兼容，导致了问题。而且要善用 git，每次小步改动，验证，提交。这样有助于从问题中恢复，以及定位问题。

   本来这次的踩坑记录是想写的非常规范化的，记录下每一个猜想，行动，结果，问题。按照顺序将这些内容填充。但是由于过了太久很多过程都忘记了，所以就做罢了。以后排查和解决问题的时候可以尝试用那种模式，一边记录一边排查。
