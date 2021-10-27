---
title: 怎么用 OneDrive 做图床
date: 2021-08-28 16:00
description: 这篇文章记录使用 OneDrive 作为图床的方法
category: 教程
tags:
- "教程"
- "技巧"
- "博客"
---

博客文章大部分都是用 markdown 写作，文章中除了文字内容通常也有图片。   

可以将图片文件和网页代码放在一起，但是随着图片文件的增加会使得博客代码库体积变得越来越大，部署也越来越慢，也会增加托管服务器的流量和负担。   

还有一种选择是使用图床，图床是专门用来托管图片的，通过图床将图片文件上传到网络上，任何人只需要一个 uri 就可以访问这个图片。图床有一些已有的服务，比如微博图床，要么感觉不好管理，要么感觉不可靠，指不定什么时候就停止服务了。

我日常使用的网盘是 OneDrive，OneDrive 是微软推出的网络存储服务，它直接内置于 Windows 系统中，除了常规的文件同步之外，照片的备份，管理也都可以完成。如果可以直接用 OneDrive 作为图床的话，就可以直接引用自己 OneDrive 中已有的图片，也方便管理。OneDrive 的文件可以共享，但是打开分享链接却是是通过网页版的 OneDrive 打开分享的文件，包括图片也是。再加上国内网络情况特殊，网页版的 OneDrive 是无法访问的。我去网上搜索了怎么用 OneDrive 做图床，结果还真有。具体操作就是使用 OneDrive 的文件嵌入功能。   

鼠标右键单击图片文件弹出的上下文菜单中鼠标单击单机“嵌入”   

![OneDrive 的嵌入功能的入口](https://bl3301files.storage.live.com/y4mP3CIubQk_IdR-GwjCAfB912mLQIk0dnxIQlG7uNJNLq9wZFOC51t_w86V9-OCFlEwwc-dw_KDCxnwv6J6V-nOMUiWnSsWu45K0vsrjcwGu6WT_0aXexUjI4_gORCnD-lAO3NSUmUTjjW6Rae076nFZe_mGp0ZR1gJUinXNjPrixvrbrajPbFZzwF8UXDnmJL?width=660&height=493&cropmode=none "OneDrive 的嵌入功能的入口")   

网页右侧会弹出嵌入面板，可以直接生成图片 uri 链接，直接复制到要使用该图片的地方。还可以选择图片的尺寸。非常方便。

![OneDrive 的嵌入功能的入口](https://bl3301files.storage.live.com/y4mX2VZpn5axL580EB_9Pqt8G7pELdVoTcn9rebc1iHDxf4_FWpa2burq3LL7vS5qTtOlqCATDIZ-n7Dt1lukOmwKsZGLKWSjnHqeL8tCdxq2gD6PRg1xmrH4P5GMuncs_VXaBRCQZJicHn8-OE1l39giGt9ipBSRnMLHji6A8yBH24s180vkqgvldAWzWcJf7r?width=660&height=359&cropmode=none "OneDrive 的嵌入功能的入口")