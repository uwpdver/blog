---
title: React Fiber 架构
date: 2021-09-29 14:01
description: 对文章 React Fiber Architecture 的翻译
category: 翻译
tags:
- "翻译"
- "react"
- "react 原理"
---
原文：[React Fiber Architecture](https://github.com/acdlite/react-fiber-architecture)  
作者：[acdlite](https://twitter.com/acdlite)  

React Fiber 是一个正在进行的 React 的核心算法的重新实现。  

React Fiber 的目标就是增强对动画，布局，和手势等领域的适应性。它的头号特性就是**增量渲染**：一种将渲染工作拆分成多个更小的部分并且把这些部分的工作分摊到多个帧上的能力。  

其他的关键特性包括暂停的能力，终止的能力，当新的更新到来时重用工作的能力；为不同类型的更新指定优先级的能力；还有新的并发原语（concurrency primitives）。  

## 关于这个文档  
Fiber 引入了几个新的概念，这些概念光看代码很难完全理解。这个文档开始是我在追随 Fiber 在 React 项目中的实现的过程中做的笔记的集合，随着它的增长，我意识到它可能也是一个对别人很有帮助的资源。  

我将尝试用尽可能简朴的语言，并通过解释定义关键术语来避免行话，如果可能，我也会大量连接到外部的资源。  

请注意，我并不是 React 团队的成员，而且没有任何权威的发言权。**这不是一个官方文档**。我已经要求 React 团队的成员审查过它的准确性。  

这也是一个正在施工中的工作，**Fiber 是一个正在进行中的项目，在完成之前可能会进行重大的重构**。此外，我还在尝试在这里记录它的设计。我非常欢迎提出改进和建议。  

我的目标是在读完这篇文档之后，你将对 Fiber 有足够的了解，以便在它的实现过程中进行跟进，最终能够为 React 做出贡献。  
## 阅读之前的准备
我强烈建议你在继续阅读之前熟悉下面这些资源:  
- [React 组件，元素，和实例](https://facebook.github.io/react/blog/2015/12/18/react-components-elements-and-instances.html)-“组件是一个经常被重载的术语，牢牢掌握这些术语至关重要”
- [Reconciliation](https://facebook.github.io/react/docs/reconciliation.html)-一个对 React 的协调算法的高级的描述。
- [React 基本理论概念](https://github.com/reactjs/react-basic)-对 React 的概念模型的描述，不用理解具体的实现。其中一些内容在初读时可能没有意义，没有关系，随着时间的推移，它将变得更有意义。  
## 回顾  
## 什么是协调（reconciliation）
### 协调（reconciliation）  
React 用来将一棵树和另外一棵树进行比较，以确定哪些部分需要被改变的算法。  

### 更新
用来渲染 React 应用的数据的一次改变，通常是由 ‘setState’ 引起的。最终导致重新渲染（re-render）。  

React API 的中心思想就是将更新看作是导致整个应用程序重新渲染。这允许开发者以声明的方式进行推理，而不是担心如何有效地将应用从任何一个特定的状态转换到另一个特定的状态（A 到 B，B 到 C，C 到 A，等等）。  

实际上在每次更改后都重新渲染整个应用程序仅适用于最琐碎的应用程序；在一个真正的应用程序中，这种做法的性能成本太高了。React 进行了优化，可以在保持出色性能的同时创建整个应用程序重新渲染的外观。这些优化中的大部分是一个被称之为 **reconciliation（以下称为协调）** 的过程的一部分。  

协调是通常被理解为 “虚拟 DOM（virtual DOM）”背后的算法。一个高级描述像这样：当你渲染一个 React 应用程序，就会有一棵由多个节点组成，用来描述这个应用程序的树被生成，并且被保存在内存中。然后，这棵树将被刷新到渲染环境中——例如，在浏览器应用程序的情况下，它被转换成一系列 DOM 操作。每当应用程序更新（通常是通过 ```setState```）时，就会生成一棵新的树。这棵新的树和之前的那棵树进行比较，以计算出需要哪些操作来更新被呈现在屏幕上的这个的应用程序。  

尽管 Fiber 是对 reconciler（协调器）的彻底重写，但是在 [React 文档中描述的](https://facebook.github.io/react/docs/reconciliation.html) 高级的算法大体相同。一些关键点就在于：
- 假设不同的组件类型会生成完全不同的树。React 将不会尝试去 diff(比较)它们，而是完全替换旧的树。  
- 对于列表的 diffing 是使用键（keys）执行的。键应该是“稳定，可预测，并且独一无二的。”  
## 协调与渲染  
DOM 只是 React 可以渲染的渲染环境之一，其他主要目标是通过 React Native 的原生 iOS 和 Android 视图。 （这就是为什么“虚拟 DOM”有点用词不当。）  

React 可以支持如果多的目标平台的原因就是它被设计成 reconciliation 和 rendering 为相互独立的阶段。reconciler（协调器） 用来计算虚拟 DOM 树的哪些部分被改变了；renderer（渲染器）使用协调器计算出的这些信息对被渲染到屏幕上的内容进行实际的更新。  

这种分离意味着 React DOM 和 React Native 可以用它们自己的渲染器，同时共享由 React 核心提供的相同的协调器。   

Fiber 重新实现了协调器。它主要不涉及渲染，尽管渲染器也需要为支持（并利用）这个新的架构而做出改变。  
## 调度（Scheduling）
### 调度  
判断什么时候该执行 work（这里的 work 是特定的概念，为了避免和通常概念中的工作混淆，译者选择不做翻译）的过程。  
### work
要被执行的任何计算。work 通常是一次更新的结果（例如```setState```）  

React 的[设计原则](https://facebook.github.io/react/contributing/design-principles.html#scheduling)文档在这个主题上非常好，我就直接在这里引用：  
>在其当前的实现中，React 递归地遍历虚拟 DOM 树并且在单个周期内调用整个被更新的树的 ```render``` 函数。然而在未来（React 16 及更高版本）它可能会延迟一些更新以避免掉帧。  
>
>这是一个在 React 设计中普遍的主题。一些流行的库实现了“push（推）”方法，在数据可用时执行计算。然而 React 坚持采用 “pull（拉）”方法，即计算可以延迟到必要时才进行。  
>
>React 不是一个通用的数据处理库。它是一个构建用户界面的库。我们认为，它在应用程序中的定位是独一无二的，可以知道哪些计算是相关的，哪些不是相关的。  
>
>如果某些东西在画面以外，我们延迟与它相关的一切计算。如果数据到达得比帧率还要快，我们可以合并并且批量更新。我们可以提高来自用户界面的工作（例如一个按钮点击导致的动画）的优先级高于那些不那么重要的后台工作（例如渲染刚从网络中加载好的新的内容），以避免丢帧。  

关键点在于：  
- 在一个用户界面中，不需要每一次更新都立即应用；事实上，这么做可能很浪费，导致丢帧从而降低用户体验。
- 不同类型的更新有不同的优先级——一个来自动画的更新需要比一个来自数据存储的更快地完成。
- 基于推（push-based）的方法要求应用程序（你，程序员）来决定如何调度工作，而基于拉（pull-based）的方法允许框架（React）变得智能，并且为你做这些决定。  

React 目前（React 15 及更低版本）没有以一种重要的方式利用调度的优势；更新会立即重新渲染整个子树。   
***  
现在我们已经准备深入了解 Fiber 的实现。下一节会比我们目前讨论的东西更有技术性。在继续前进之前，请确保你对前面的材料感到满意。  
## 什么是 fiber？  
我们打算讨论 React Fiber 架构的灵魂。Fibers 是比应用程序开发者们通常认为的更低级别的抽象。如果你发现你尝试去理解它时被刷下来了。不要感到失望。保持尝试并且最终会成功的。（当你最后明白了，请为如何提升这一节的内容提出建议。）  

开始吧!  
***  
我们已经确定 Fiber 的主要目标是使 React 能够充分利用调度。具体而言，我们需要能够去：  
- 暂停工作并且稍后可以返回到之前暂停的工作中。  
- 指定不同类型的工作的优先级。  
- 重用之前已完成的工作。  
- 如果不再需要，则终止工作。  

为了做到这些，我们首先需要一个将工作分解成单元的方式。从某种意义上来说，这就是 fiber。一个 fiber 代表一个工作单元。  

为了更进一步，让我们回到[React 组件作为一个数据的函数](https://github.com/reactjs/react-basic#transformation)的概念，其通常被表示为  
```
v = f(d)
```  
因此，渲染 React 应用程序类似于调用一个函数，该函数的主体包含对其他函数的调用，依此类推。这个类比在思考 fiber 时很有用。  

通常我们使用[调用栈](https://en.wikipedia.org/wiki/Call_stack)的方式来追踪程序的执行。当一个函数被执行，一个新的**栈帧**会被添加到调用栈中。该栈帧代表代表该函数执行的工作。  

在处理 UI 时，问题是如果一次性执行太多的工作，可能会导致动画丢帧并且看起来很卡顿。更重要的是，如果这些工作被最近的更新所取代，那么其中有些工作可能是不必要的。这就是 UI 组件和函数比较割裂的地方。因为组件比一般的函数有更多的特定关注点。  

现代浏览器（和 React Native）实现了一些帮助定位这些额外的问题的 API：```requestIdleCallback```调度一个低优先级的函数在空闲期间被调用，```requestAnimationFrame```调度一个高优先级的函数在下一个动画帧之前被调用。问题在于，为了使用这些 API，你需要一个方式去将渲染工作（render work）分解为增量单元（？我的理解是，一个完整的工作拆分成多个单元，单元是可以累积的，完成了一个单元，整体完成进度就往前进）。如果只依赖调用栈，它会一直工作下去，直到栈被清空。  

如果我们可以自定义调用栈的行为来优化 UI 的渲染的话，那不是很好吗？如果我们可以随意中断调用栈并且手动操作堆栈帧，那不是很好吗？  

这就是 React Fiber 的目标。Fiber 是调用栈的重新实现，专门用于 React 组件。你可以将单个 fiber 看作是一个**虚拟栈帧**。  

这个调用栈的重新实现的好处就在于你可以[保持栈帧在内存中](https://www.facebook.com/groups/2003630259862046/permalink/2054053404819731/)并根据需要（以及任何时候）执行它们。这对实现我们的调度目标至关重要。  
## 一个 fiber 的结构  
注意：随着我们对实现细节的了解越来越具体，某些事情可能会发生变化的可能性也会增加。如果您发现任何错误或过时的信息，请提交 PR。  

具体来说，一个 fiber 是一个 JavaScript 对象，它包含关于一个组件信息的，它的输入和输出。  

一个 fiber 对应着一个栈帧，同时也对应一个组件的实例。以下是属于 fiber 的一些重要字段。（这个清单并不详尽。）  

```type``` 和 ```key```  

fiber 的 type 和 key 的作用与它们对 React 元素的作用相同。（事实上，当从一个元素创建 fiber 时，这两个字段是直接复制的。）  
一个 fiber 的 type 描述了与之对应的组件。对于组合组件（composite components）而言，type 可以是一个函数或者一个类组件本身。对于宿主组件（host components）（```div```，```span``` 等）的 type 则是一个字符串。  

从概念上讲，type 是堆栈帧正在跟踪其执行的函数（如 v = f(d)）。  

与类型一起，在协调期间使用 key 来确定 fiber 是否可以重复使用。  

```child``` 和 ```sibling```  

这些字段指向其他的 fiber 节点，描述 fiber 的递归树形结构。  

child fiber 对应一个组件的 ```render``` 方法的返回值。所以在下面的例子中：  
```javascript
function Parent() {
    return <Child />
}
```
```Parent``` 的 child fiber 对应与 ```Child```。  

sibling（相邻，同辈） 字段说明了 ```render``` 方法返回多个子元素的情况（Fiber的一个新特性！）。  
```javascript
function Parent() {
    return [<Child1 />, <Child2 />]
}
```  
这些 child fiber 形成一个以第一个 child render 为首节点的单向链表。所以在这个例子中，```Parent``` 的 child 是 ```Child1```，并且 ```Child1``` 的 sibling 是 ```Child2```。  

回到我们的函数类比，你可以把 child fiber 看成是一个尾部调用的函数。  

```return```  

return fiber 是在处理完当前的 fiber 节点之后应该返回到的 fiber 节点。它相当于栈帧的返回地址。它也可以被认为是父 fiber 节点。  

如果一个 fiber 节点有多个子 fiber 节点，每个子 fiber 节点的 return fiber 是它们的父节点。所以在我们上一小节的例子中， ```Child1``` 和 ```Child2``` 的 return fiber 是 ```Parent```。  

```pendingProps``` 和 ```meoizedProps```  

从概念上而言，props 是一个函数的参数，一个 fiber 的 ```pendingProps``` 在他开始被执行时被设置，而 ```memoizedProps``` 是在执行即将结束时被设置。  

当输入的 ```pendingProps``` 和 ```memoizedProps``` 相等时，它表示 fiber 的上一个输出可能会被重用，从而防止不必要的工作。  

```pendingWorkPriority```  

一个代表 fiber 工作的优先级的数字。[ReactPriorityLevel](https://github.com/facebook/react/blob/master/src/renderers/shared/fiber/ReactPriorityLevel.js) 模块列出了不同的优先级和它们代表的含义。  

除了 ```NoWork``` 为 0之外，数字越大表示优先级越低。例如，你可以使用下面的函数来检测 fiber 的优先级是否和给定的级别一样高。  
```javascript
function matchesPriority(fiber, priority) {
    return fiber.pendingWorkPriority !== 0 &&
           fiber.pendingWorkPriority <= priority
}
```
*这个函数只是一个例子；他并非 React Fiber 代码库中的一部分*  

调度器使用 priority 字段来搜索要被执行的下一个单元。这个算法将在未来的章节讨论。  

```alternate```（备份）  

***flush***  
flush 一个 fiber 就是把它的输出渲染到屏幕上。  

***work-in-progress***  
一个还未完成的 fiber，从概念上说，可以理解为一个还没有被返回的栈帧。  

在任何时刻，以一个组件的实例最多有两个 fiber 节点与之对应；一个是 current fiber，即被渲染到屏幕的 fiber，另一个是 work-in-progress fiber。  

currnet fiber 的 alternate 是 work-in-progress，而 work-in-progress 的 alternate 则是 current fiber。  

fiber 的 alternate 是通过一个叫做 ```cloneFiber``` 的函数按需地（lazily）被创建的，如果 fiber 的 alternate 存在的话，```cloneFiber``` 会尝试重用它，而不是总是创建一个新的对象，从而最小化地分配。  

你应该把 ```alternate``` 字段看作是一个实现细节，但它在代码库中经常出现，所以在这里讨论它很有价值。  

```output```（输出）  

***宿主组件***  
React 应用程序的叶节点。它们特定于渲染环境（例如，在浏览器应用程序中，它们是 `div`、`span` 等）。在 JSX 中，它们使用小写的标签名字（tag names）表示。  

从概念上而言，一个 fiber 的 output 是一个函数的返回值。  

每个 fiber 最终都会有 output，但是 output 只会在叶节点被**宿主组件**创建。然后将 output 沿树向上传输。  

output 就是最终给到渲染器（renderre）的东西，以至于渲染器可以 flush 这些更改到渲染环境中。而定义 output 如何被创建或被更新就是渲染器的事了。  
## 未来的章节  
到目前为止，这些就是全部的内容了，但是这篇文档还远远没有完成。未来的章节将讲述在更新过程的整个生命周期中所使用的算法。要涵盖的主题包括：  
- 调度器如何找到下一个要被执行的工作单元。
- 如何通过 fiber 树跟踪和传播优先级。  
- 调度器怎样知道什么时候暂停或恢复工作。  
- 工作如何被 flushed 并标记成完成。  
- 副作用（例如生命周期方法）如何工作。  
- 什么是协程（coroutine ）以及如何使用它来实现上下文和布局等功能。  
## 相关的视频  
- [What's Next for React (ReactNext 2016)](https://youtu.be/aV1271hd9ew)  
- [Lin Clark - A Cartoon Intro to Fiber - React Conf 2017](https://www.youtube.com/watch?v=ZCuYPiUIONs&t=471s&ab_channel=FacebookDevelopers)  










