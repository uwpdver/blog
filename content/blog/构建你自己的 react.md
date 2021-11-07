---
title: 构建你自己的 react
date: 2021-11-07 21:49
description: 本文是对文章 Build your own React 内容的一些摘录以及一些个人的理解，文章主要介绍了如何从零开始一步一步实现 react 的核心功能。包括简化的 react 的渲染函数和协调算法，函数组件以及 hooks 的简单实现。
category: 笔记
tags:
- "笔记"
- "react"
- "react 原理"
---
原文：[Build your own React](https://pomb.us/build-your-own-react/)  
作者：[Rodrigo Pombo](https://twitter.com/pomber)  

## createElement 函数  

###  元素

元素是对要显示在屏幕上的东西的描述。在内部表示其实就是一个普通的 JavaScript 对象。包含三个重要的属性：  

* type：标识元素的类型。  

* props：元素的一些属性，如果是 HTML 标签则与 HTML 元素的 `attribute` 对应。  

* children：元素的子元素列表。代表当前元素所包含的所有元素。

```js
const element = {
    type: "h1",
    props: {
        title: "foo",  
        children: "Hello",
    }
}
```

### 创建元素  

为了避免每次创建函数都手写一个对象字面量。我们可以通过函数来创建元素对象。  

```js
function createElement(type, props, ...children){
    return ({
        type,
        props: {
            ...props,
            children: children.map(child => createElement(child))
        }
    })
}
```

还需要创建不包括子元素的文本元素。  

```js  
function createTextElement(text){
    return ({
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: []
        }
    })
}
```
## render 函数   

将元素所描述的内容显示在屏幕上。

## 并发模式  

递归地渲染元素可能导致 JavaScript 运行时间过长，主线程被阻塞过久导致无法即使响应用户输入或者导致动画丢帧。  

因为递归渲染过程中采用栈结构（调用栈）追踪每一个子渲染过程，渲染到某个子渲染过程中时，无法在保留当前渲染所需的状态的同时切换到另一个任务。  

我们需要将渲染过程拆分成多个小的独立的工作单元，让每个工作单元完成后都可以中断，去做其他的更紧急的任务。当主线程空闲时再从之前工作中断处继续执行渲染工作。  



## Fibers  

为了组织工作单元，需要一个数据结构：一个 fiber 节点。  

每个元素都有一个 fiber，每个 fiber 都是一个工作单元。  

fiber 数据结构的一个目的就是让能够更容易找到下一个工作单元。fiber 内有三个指针，分别指向三个不同关系的 fiber 节点。  

* return: 当前节点的父节点。  
* child: 当前节点的第一个子节点。
* sibling: 与当前节点相邻的下一个节点。  

fiber 之间彼此通过这些指针相连接，类似链表的结构。这样相当于把遍历元素的过程从之前递归拍平成了循环。好处是这个循环过程可以被中断，我们可以保存下当前循环的状态，以供将来恢复。

## 渲染（Render）和提交（Commit）阶段  

如果每次处理一个工作单元都创建并添加一个 DOM 节点到 DOM 树中，那么用户就会看到未完成的界面，这样会影响用户体验。  

为了避免这种情况，我们可以将整个更新 UI 的过程分成渲染和提交两个阶段。渲染阶段专注于根据元素的描述构建和当前的一些状态计算下一阶段对一些节点要做的 DOM 操作，而提交阶段则专注于根据渲染阶段所得的结果来操作 DOM。

渲染阶段的工作可以分成多个工作单元，并且可以被其他更高优先级的任务中断的。而提交阶段则是不可中断的。  

在实现中，我们使用一个 `wipRoot` 指向的 fiber 树来追踪渲染工作的进度。    

### 渲染阶段  

根据 `render` 函数的参数中提供的的元素完成 fiber 树的构建。构建 fiber 树的工作分为很多个工作单元，每个工作单元都是由  `performUnitOfWork` 函数执行。render 函数主要的工作是设置第一个工作单元，之后工作循环会调用 `performUnitOfWork`，直到所有的工作单元完成。  

也是

`performUnitOfWork` 函数做三件事。  

1. 为每个 fiber 创建对应的 DOM，并将创建的 DOM 节点的引用保存在该 fiber 中。  

2. 为元素的所有子元素创建 fiber。  

3. 选择下一个要执行的工作单元。  

`performUnitOfWork` 确定下一个工作单元的规则：
1. 如果当前 fiber 有 `child` 则选择 `child`。  

2. 否则如果当前 fiber 有 `sibling`，则选择 `sibling`。  

3. 否则如果当前 fiber 的 `parent` 有 `sibling`，则选择 `parent.sibling`。  

4. 否则继续向上寻找存在的 `parent.sibling`，直到抵达 root。  

![Fiber Tree](https://bl3301files.storage.live.com/y4mJKlDU-vvMps2OdoWf_CcL7F49teQDXllZM8R7nLaUf1GwyK4Ll-egrcJdt0iwr16CaiV383e3HIax1Y3joiZBBt4FeOJNRFFBxsMyX1NuEBUnrZlTuOhz_RKxS9hTJQSjIhlpXNIRh2EpX-HSqCe_RNfbbuNG1hJp-VgAB7XJ4FMQMkgNp2C_s5vyqZ-7eaU?width=274&height=318&cropmode=none)  



### 提交阶段  

一旦完成了所有的 render 工作（并非下一个工作单元），我们将整个 fiber 树提交到 DOM 中。  

递归地添加所有 fiber 的 DOM 节点到 DOM 树中。  

## 协调（Reconciliation）  

到目前为止，我们只是添加了元素到 DOM 中，但是还没有涉及更新或者删除节点。  

对于更新和删除，我们需要将从 `render` 函数中收到的元素构建新的的 fiber 树，并和提交到 DOM 的最后一个 fiber 树做比较。  

因此，我们需要在完成提交后保存对“我们提交给 DOM 的最后一个 fiber 树”的引用。我们称之为 `currentRoot`。`currentRoot` 的作用是用来和下一个版本的 fiber 树作比较，以得出从上一个版本的 fiber 树更新到下一个版本的 fiber 树所需的操作。  

我们还为每个 fiber 添加了 `alternate ` 属性。这个属性是一个指向旧 fiber 的链接，也就是我们在上一个提交阶段提交到 DOM 所用的 fiber，这个属性的作用是为了方便比较相应的 fiber 节点，以及尽可能复用已有的对象。  

在上文我们提到过，在执行每个工作单元时，也就是 `processUnitOfWork` 函数执行时，我们要为当前处理的 fiber 的每个子元素创建 fiber。但是对于一次更新，没必要再为每个元素都创建一个新的 fiber，因为我们可能已经通过 `alternate` 保留了上次渲染所创建的 fiber，我们称之为 `oldFiber`。我们需要比较 `oldFiber` 和新的元素所对应的 fiber 是否相同。  

这里的判断是否相同需要检测三个条件。  

1. oldFiber 是否不为 null。  

2. element 是否不为 null。  

3. oldFiber.type 是否等于 element.type。

只有这三个条件的判断结果全都为 true，才能确定新旧两个 fiber 是否相同。（这里所说的相同并不是严格意义上的相等，只是用于判断从上一个版本的 fiber 变成下一个版本的 fiber 所需要做的操作）。  

如果相同，则可以直接保留 DOM 节点，只需更新 props 即可。  

如果不相同但是 `element` 存在，要么这个位置之前没有 fiber，要么就是之前的fiber 和当前元素对应的 `type` 不相同，已经无法复用之前的了。这些情况都需要创建一个新的 fiber。  

如果不相同但是 `oldFiber` 存在，要么这个位置之前的 fiber 在当前版本被移除了，要么就是之前的 fiber 和当前元素对应的 `type` 不相同，已经无法复用之前的了，对于第一种情况我们需要删除之前的旧 fiber，对于第二种情况，我们需要将之前的旧 fiber 删除，然后替换成新的元素创建的 fiber。  

这里 React 也使用了 key，这可以更好地协调。例如，它检测子元素何时更改元素数组中的位置。  

在对比时会添加的 `effectTag`，再后续的提交阶段会用到，用于标记需要对这些 fiber 做的操作。  

因为新的 workInProcess 树中，不会有被删除的节点，但是这些节点需要在提交到 DOM 阶段被删除，所以需要追踪这些要删除的 fiber 节点。  

在提交阶段我们根据提交的每个 fiber 节点标签，对 DOM 采取新增，更新，或则删除操作。在执行跟新操作时，我们需要为 DOM 节点添加新的属性，并且移除已经不存在的属性。除此之外，我们还需要处理事件监听器的订阅和取消。

## 函数组件  

// TODO  

## Hooks  

// TODO

## 相关阅读
* [Build your own React](https://pomb.us/build-your-own-react/)