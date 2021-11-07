---
title: 浏览器工作原理——HTTP请求流程
date: 2021-10-17 11:14
description: 《浏览器工作原理》专栏第三节的学习笔记，学习了浏览器中发起 HTTP 请求的流程。
category: 笔记
tags:
- "笔记"
- "浏览器"
- "计算机网络"
- "HTTP"
- "浏览器工作原理"
---
## HTTP 请求流程
![HTTP 请求流程示意图](https://bl3301files.storage.live.com/y4msr6Uc6wYHTsbX_u5y-DOad3OueQXHcOqb1MGUUNZPY-VZL5DWNP1xU1HNF5rQfDPO54I-mImOk9J2Q_dJxsARjxkWQpyd9NeQDoogErqBO1UaGTZVbss1JGHOba9ENbuJX_NejYXzcBd86dQRLP7VgGDGkmRNv1U0xvhtvW19KrZLJBtsurVtmG1lA4djMLy?width=1142&height=423&cropmode=none "HTTP 请求流程示意图")  

1. 构建请求
2. 查找缓存
3. 准备 IP 地址和端口
4. 等待 TCP 队列
5. 建立 TCP 连接
6. 发起 HTTP 请求
    - 发送请求行
    - 发送请求头
7. 服务器处理请求
    - 服务器返回请求行
    - 服务器返回响应头
    - 服务器返回响应体
8. 断开 TCP 连接

## 浏览器缓存
### 强缓存
不会向服务器发送任何请求，直接从本地缓存中读取并且返回状态码：200 OK。
200 from memory cache：缓存在内存中，从内存中读取，浏览器关闭则丢失。
200 from disk cache：缓存在磁盘中，从磁盘中读取，浏览器关闭仍然存在。  
优先级：memory cache > disk cache > network

### 协商缓存
向服务器发送请求，服务器根据这个请求头部中的一些参数判断是否命中协商缓存，如果命中，则返回 304 状态码，并带上新的响应头部通知浏览器从缓存中读取资源。
![浏览协商缓存机制流程图](https://bl3301files.storage.live.com/y4mulom0HnZDweCxsXb1AGyz8wwE_5m_talDCI9hWol5x2HjRVyMVD_CeIBV7Rr_AuYegs5eW715ER9NRf5a7-SZE7LgsEHEYff99S015zMVUp2EE8TAmErXCkzGTV7xJS9sDQKg_dAUe15WJaD9JybZogDADtYJvABx8XCZDLhfGI7MNZYGrbz2hRZAD1uNvly?width=627&height=884&cropmode=none "浏览协商缓存机制流程图")  

Last-Modifed/If-Modified-Since 和 Etag/If-None-Match 是分别成对出现的，呈一一对应关系。“/”之前的字段是在响应头中的，“/”之后的字段是请求头中的。当响应被缓存时，浏览器根据缓存中对应资源的的响应头中的 Etag 和 Last-Modifed 字段判断是否在请求头中附加 If-Modified-Since 和 If-None-Match 字段。

Etag：  
Etag是属于HTTP 1.1属性，它是由服务器（Apache 或者其他工具）生成返回给前端，用来帮助服务器控制 Web 端的缓存验证。 Apache 中，Etag 的值，默认是对文件的索引节（INode），大小（Size）和最后修改时间（MTime）进行Hash后得到的。

If-None-Match:  
当资源过期时，浏览器发现响应头里有 Etag，则再次向服务器请求时带上请求头 If-None-Match(值是 Etag 的值)。服务器收到请求进行比对，决定返回 200 或 304。  

Last-Modified：
源服务器认为资源最后的修改时间  

If-Modified-Since：
当资源过期时（浏览器判断 Cache-Control 标识的 max-age 过期），发现响应头具有 Last-Modified 声明，则再次向服务器请求时带上头 If-Modified-Since，表示请求时间。服务器收到请求后发现有 If-Modified-Since 则与被请求资源的最后修改时间进行对比（Last-Modified）,若最后修改时间较新（大），说明资源又被改过，则返回最新资源，HTTP 200 OK;若最后修改时间较旧（小），说明资源无新修改，响应HTTP 304 走缓存。
- Last-Modifed/If-Modified-Since 的时间精度是秒，而 Etag 可以更精确。
- Etag优先级是高于Last-Modifed 的，所以服务器会优先验证 Etag
- Last-Modifed/If-Modified-Since 是http1.0的头字段  

## DNS  
HTTP 协议是基于 TCP/IP 的，建立 TCP 连接需要 IP 地址，对于用户而言代表网络资源的 URL 中提供的都是便于记忆的域名，所以就需要 DNS 将域名转换成 IP，浏览器提供 DNS 缓存。  

## 最大连接数
同一个域名下最多拥有 6 个已建立的 TCP 连接。多出的请求会排队等待，直至有可用的连接。  

## 请求行格式
### HTTP 请求行
| 请求方法 | 请求URL | 协议版本 |  
| --- | --- | --- |
| GET | /library?search=news | HTTP/1.1 |

### HTTP 响应行
| 协议版本 | 状态码 |  
| --- | --- |
| HTTP/1.1 | 200 OK |
	
