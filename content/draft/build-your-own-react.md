```js
let nextUnitOfWork = null

function workLoop(deadline){
    let shouldYield = false
    while(nextUnitOfWork && !shouldYield){
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        )
        shouldYield = deadline.timeRemaining() < 1
    }
    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

// 执行一个工作单元，并且返回下一个工作单元
function performUnitOfWork(nextUnitOfWork){

}
```
为了组织工作单元，需要一个数据结构：一个 fiber 节点  

每个元素都有一个 fiber，每个 fiber 都是一个工作单元。  

performUnitOfWork 函数做三件事  

1. 添加元素到 DOM。

2. create fiber for element's children

3. select next unit of work

fiber 数据结构的一个目的就是让能够更容易找到下一个工作单元

return: parent

child: first child

sibling: next sibling

```js
// 创建一个工作单元
function render(element, container){
    wipRoot = {
        dom: container,
        props: {
            children: [element],
        }
    }
    deletions= []
    nextUnitOfWork = wipRoot
}

let nextUnitOfWork = null
let wipRoot = null
let deletions = null
```

```js
function performUnitOfWork(fiber){
    // 组织 DOM 结构
    // 如果 fiber 还没有 dom 节点，则为其创建一个新的 dom 节点，并且绑定到 fiber.dom 属性
    if(!fiber.dom){
        fiber.dom = createDom(fiber)
    }

    // 如果有 parent fiber，则将当前的 fiber.dom 添加到父 fiber 的 dom 中
    if(fiber.parent){
        fiber.parent.dom.appendChild(fiber.dom)
    }
    
    // 为每个 child 创建 fiber
    const elements = fiber.props.children
    let index = 0
    let prevSibling = null

    while(index < elements.length>){
        const element = elements[index]

        // 连接 parent 与 child
        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null
        }

        // 连接当前 fiber 的 child 指针到第一个 child fiber
        if(index === 0){
            fiber.child = newFiber
        } else {
            // 连接上一个相邻 fiber 的 sibling 指针到当前 child fiber
            prevSibling.sibling = newFiber
        }

        // 迭代
        prevSibling = newFiber
        index++
    }

    // 返回下一个工作单元
    // 优先选择当前 fiber 的 child
    if(fiber.child){
        return fiber.child
    }

    // 其次再搜寻当前 fiber 的 sibing
    // 并且向上查找 parent.sibling
    let nextFiber = fiber
    while(nextFiber){
        if(nextFiber.sibling){
            return nextFiber.sibling
        } else {
            nextFiber = nextFiber.parent
        }
    }
}
```

### 提交
如果每次处理一个工作单元都创建并添加一个 DOM 节点到 DOM 树中，那么用于会看到未完成的界面，这样不好。  

我们使用一个 working in process root 追踪 fiber tree root。  

一旦完成了所有的 render 工作（并非下一个工作单元），我们将整个 fiber 树提交到 DOM 中。

```js
function commitRoot(){
    commitWork(wipRoot.child)
    deletions.forEach(commitWork)
    wipRoot = null   
}

function commitWork(fiber){
    if(!fiber) {
        return 
    }

    const domParent = fiber.parent.dom
    domParent.appendChild(fiber.dom)
    commitWork(fiber.child)
    commitWork(fiber.sibing)
}
```

递归地添加所有 fiber 的 DOM 节点到 DOM 树中。  

### 协调

到目前位置我们只是添加东西到 DOM 中，但是更新或者删除节点是怎么样的呢。  

我们需要将我们从 `render` 函数中收到的元素和提交到 DOM 的最后一个 fiber tree 做比较。  

因此，我们需要在完成提交后保存对“我们提交给 DOM 的最后一个 fiber tree”的引用。我们称之为 currentRoot。  

我们还为每个 fiber 添加了 `alternate ` 属性。这个属性是一个指向旧 fiber 的链接，即我们在上一个提交阶段提交到 DOM 的 fiber。  

```js
// 协调子元素
function reconcileChildren(wipFiber, elements) {
    let index = 0
    let oldFiber = wipFiber.alternate || wipFiber.alternate.child
    let prevSibling = null


    while(index < elements.length> || oldFiber !== null){
        const element = elements[index]
        const newFiber = null

        const sameType = 
        oldFiber &&
        element &&
        oldFiber.type === element.type

        if(sameType){
            // 更新节点
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom: oldFiber.dom,
                parent: wipFiber,
                alternate: oldFiber,
                effectTag: "UPDATE"
            }
        } else if(element && !sameType){
            // 添加节点
            newFiber = {
                type: element.type,
                props: element.props,
                dom: null,
                parent: wipFiber,
                alternate: null,
                effectTag: "PLACEMENT"
            }
        } else if(oldFiber && !sameType) {
            // 移除节点
            oldFiber.effectTag = "DELETION"
            deletions.push(oldFiber)
        }
    }
}
```
比较旧 fiber 和新的元素  
1. 比较 oldFiber.type === element.type，如果相等，则可以直接保留 DOM 节点，只需更新 props 即可。
2. 如果 `type` 不同，就说明这是一个新的元素，我们就需要创建新的 DOM 节点。  

这里 React 也使用了键，这可以更好地协调。例如，它检测子元素何时更改元素数组中的位置。  

会添加 `effectTag`，再后续的提交阶段会用到。  

因为新的 workInProcess 树中，不会有被删除的节点，但是这些节点需要在提交到 DOM 阶段被删除，所以需要追踪这些要删除的 fiber 节点。


