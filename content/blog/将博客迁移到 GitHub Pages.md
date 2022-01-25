---
title: 将博客迁移到 GitHub Pages
date: 2021-11-25 23:28
description: 用 GitHub Pages 和 Github Action 实现博客的托管和自动化部署。
category: 笔记
tags:
- "博客"
- "Github Action"
- "Github Pages"
---

之前这个博客是托管在 Cloudflare Pages 上的，通过 GitHub Apps 让 Github 仓库和 Cloudflare Pages 关联，使得被关联的仓库在每次被 push 了新的提交，就会触发 Cloudflare Pages 的自动化部署操作，并且将构建好的 html 等静态文件托管在 Cloudflare 的服务器上。  

Github 也提供了类似的 Github Pages 服务。而且Github Action 也可以用来自动化部署，在 Action 市场里就有一个现成的自动化部署 Gatsby 项目到 Github Pages 的 Action，叫做 Gatsby Publish。  

按照 Gatsby Publish 的文档，使用起来不难，但是有一些地方要注意。  

### access token

在 Gatsby Publish 配置中，有一个 `${{secrets.ACCESS_TOKEN}}` 的写法。这里的 `secrets` 是 Action 在运行时可以访问到上下文的一个变量，这些变量在仓库的设置页面的 Secrets 菜单中添加。access token 是用来授权的，也需要在 [Github Personal Access Tokens 管理页面](https://github.com/settings/tokens) 手动生成。并且将生成的 access token 添加到仓库的 secrets 中，注意变量名是 ACCESS_TOKEN。access token 默认会过期，access token 过期了自动部署脚本的运行会发生错误，为了方便可以将其设置为永不过期。 

### deploy-repo  

这是指定要部署到的仓库，不特别指定的话默认部署到当前仓库。我的博客项目仓库和要部署的 Github Pages 仓库不是同一个，所以需要将这个值设置为我的 Github Pages 对应的仓库名。

## 相关阅读

* [Gatsby Publish](https://github.com/marketplace/actions/gatsby-publish)
* [GitHub Actions入门教程-自动部署静态博客](https://zhuanlan.zhihu.com/p/364366127)

