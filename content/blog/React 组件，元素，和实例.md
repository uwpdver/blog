---
title: React 组件，元素，和实例
date: 2021-09-28 13:30
description: 对 React 官方文档 React Components Elements, and Instances 的翻译
category: 翻译
tags:
- "翻译"
- "react"
- "react 原理"
---
原文：[React Components, Elements, and Instances – React Blog (reactjs.org)](https://reactjs.org/blog/2015/12/18/react-components-elements-and-instances.html)  
作者：[Dan Abramov](https://twitter.com/dan_abramov)  

>组件（components），实例（instances），和元素（elements）之间的不同使得很多 React 新手困惑不已，为什么会有三种不同的术语来指代画在屏幕上的东西。  
## 管理实例（Managinng the Instances）  
如果你刚接触到React，你可能之前只用过组件类和实例。例如你可能要通过创建一个类来声明一个 Button 组件。当这个应用运行时，可能有几个这些组件的实例在屏幕上，它们每个实例都有他们自己的属性（properties）和局部状态（local state）。这就是传统的面向对象用户界面编程。那为什么要引入元素（elements）呢？  

在传统的用户界面模型中，是由你（开发者）负责创建和销毁子组件实例。如果一个 Form 组件想要渲染一个 Button 组件，它（Form 组件）需要创建它的实例，并且手动保持它与任何新信息一致。  
```javascript
class Form extends TraditionalObjectOrientedView {
  render() {
    // Read some data passed to the view
    const { isSubmitted, buttonText } = this.attrs;

    if (!isSubmitted && !this.button) {
      // Form is not yet submitted. Create the button!
      this.button = new Button({
        children: buttonText,
        color: 'blue'
      });
      this.el.appendChild(this.button.el);
    }

    if (this.button) {
      // The button is visible. Update its text!
      this.button.attrs.children = buttonText;
      this.button.render();
    }

    if (isSubmitted && this.button) {
      // Form was submitted. Destroy the button!
      this.el.removeChild(this.button.el);
      this.button.destroy();
    }

    if (isSubmitted && !this.message) {
      // Form was submitted. Show the success message!
      this.message = new Message({ text: 'Success!' });
      this.el.appendChild(this.message.el);
    }
  }
}
```  
以上是伪代码，但是当您使用像 Backbone 这样的库编写以面向对象的方式一致行为的复合 UI 代码时，这大致就是您的代码最终的样子。  

每个组件实例都必须保存对它的 DOM 节点的引用，和对子组件实例的引用。并且要在正确的时机创建，更新，和销毁它们。代码行数随着组件可能状态数的平方增长。而且这些父组件能够访问到它们的子组件的实例，这使得这些代码以后很难解耦。  

那么，React 有什么不同呢？  
## 元素描述树（Elements Describe the Tree）  
在 React 中，这就是元素（elements）来拯救的地方。一个元素是一个描述组件实例或DOM节点及其所需属性的普通对象。它仅包含有关组件类型（例如，按钮），其属性（例如，其颜色），以及其中任何子元素的信息。  

元素不是一个实际的的实例。他相当于是一个告诉 React 你想要在屏幕上看到什么东西的方式。你不能在元素上以调用任何方法。元素只是一个不可变的描述对象，其中有两个字段：类型（type:(string | ReactClass)） 和属性（props:Object）。  
## DOM 元素
当元素的 type 字段是一个字符串时，它代表一个标签名字为 type 的 DOM 节点，并且 它的 props 对应着它的 attributes。这就是 React 要渲染的东西，例如：  
```javascript
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```  
这个元素就是把以下的 HTML 表示为普通对象的一种方式：  
```javascript
<button class='button button-blue'>
  <b>
    OK!
  </b>
</button>
```  
注意元素是可以被嵌套的。按照惯例，当我们想要创建一个元素树时，我们指定一个或多个子元素作为其包含元素的 children 属性。  

重点是子元素和父元素都只是描述而不是实际的实例。当你创建他们的时候他们不涉及任何在屏幕上的东西。你可以创造它们然后扔掉它们，这没什么大不了的。  

React 元素是容易遍历的，它不需要被解析，同时也比远比实际的 DOM 元素轻量得多——它们只是对象（object）！
## 组件元素（Component Elements）  
然而，元素的类型也可以是对应于 React 组件的函数或类：  
```javascript
{
  type: Button,
  props: {
    color: 'blue',
    children: 'OK!'
  }
}
```  
这是 React 的核心思想  

**描述组件的元素也是一个元素，就像描述 DOM 节点的元素一样。它们可以相互嵌套和混合。**  

此功能允许您将 DangerButton 组件定义为具有特定颜色属性值的 Button，而无需担心 Button 是否呈现为 DOM <button\>、<div\> 或其他完全不同的东西：  
```javascript
const DangerButton = ({ children }) => ({
  type: Button,
  props: {
    color: 'red',
    children: children
  }
});
```  
你可以在一个元素树中混合和匹配 DOM 和组件元素:  
```javascript
const DeleteAccount = () => ({
  type: 'div',
  props: {
    children: [{
      type: 'p',
      props: {
        children: 'Are you sure?'
      }
    }, {
      type: DangerButton,
      props: {
        children: 'Yep'
      }
    }, {
      type: Button,
      props: {
        color: 'blue',
        children: 'Cancel'
      }
   }]
});
```  
或者，如果你更喜欢 JSX：  
```javascript
const DeleteAccount = () => (
  <div>
    <p>Are you sure?</p>
    <DangerButton>Yep</DangerButton>
    <Button color='blue'>Cancel</Button>
  </div>
);
```  
这些混合和匹配帮助你保持组件之间相互解耦，因为它们可以完全通过组合来表达 is-a 和 has-a 关系：  
- Button是（is-a）有特定属性的 DOM <button\>。
- DangerButton 是（is-a）有特定属性的 Button。
- DeleteAccount 在 <div\> 中包含一个 Button 和一个DangerButton。  
## 组件封装元素树（Components Encapsulate Element Trees）  
当 React 看到一个 type 为函数或者类的元素时，它知道询问该组件它渲染出（renders）什么元素，给定相应的 props。  

当它看到这个元素  
```javascript
{
  type: Button,
  props: {
    color: 'blue',
    children: 'OK!'
  }
}
```  
React 将会“询问” （我的理解是调用 type）Button 它渲染什么元素，Button 将会返回这些元素：  
```javascript
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```  
React 将会重复这个过程知道他知道在这个页面上的每一个元素的底层的DOM 标签元素。  

React 就像一个孩子问“Y 是什么”，你向他们解释每一个“X 是 Y”，直到他们弄清楚世界上的每一件小事。  

还记得上面那个 Form 例子吗？他可以用 React 写成下面这样。  
```javascript
const Form = ({ isSubmitted, buttonText }) => {
  if (isSubmitted) {
    // Form submitted! Return a message element.
    return {
      type: Message,
      props: {
        text: 'Success!'
      }
    };
  }

  // Form is still visible! Return a button element.
  return {
    type: Button,
    props: {
      children: buttonText,
      color: 'blue'
    }
  };
};
```  
就是这样！对于一个 React 组件（component），props 是输入，元素树（element tree）则是输出。  

**被返回的元素树可以包含描述 DOM 节点的元素和描述其他组件的元素。它让你可以在不依赖于其内部 DOM 结构的情况下组合 UI 的独立部分。**  

我们让 React 创造，更新，和销毁实例，我们用从组件返回的元素*描述*它们，React 负责管理这些实例。  
## 组件可以是类或者函数（Compoents Can Be Classes or Functions）  
在上面的代码中，Form，Message，和 Button 是 React 组件，它们可以既可以写成函数，就像上面那样，也可以写成从 React.Component 继承的类。这三种声明组件的方式大多数情况下都是等价的。  
```javascript
// 1) As a function of props
const Button = ({ children, color }) => ({
  type: 'button',
  props: {
    className: 'button button-' + color,
    children: {
      type: 'b',
      props: {
        children: children
      }
    }
  }
});

// 2) Using the React.createClass() factory
const Button = React.createClass({
  render() {
    const { children, color } = this.props;
    return {
      type: 'button',
      props: {
        className: 'button button-' + color,
        children: {
          type: 'b',
          props: {
            children: children
          }
        }
      }
    };
  }
});

// 3) As an ES6 class descending from React.Component
class Button extends React.Component {
  render() {
    const { children, color } = this.props;
    return {
      type: 'button',
      props: {
        className: 'button button-' + color,
        children: {
          type: 'b',
          props: {
            children: children
          }
        }
      }
    };
  }
}
```  
当用类的方式定义一个组件时，它会比函数组件更强大一点。它可以存储局部状态并且可以在对应的 DOM 节点被创建或者被销毁时执行自定义的逻辑。  

一个函数组件虽然没有那么强大但是它更简单，而且表现得就像只有一个 render 方法的类组件一样。除非你需要只有在类组件中才有的功能，否则我们鼓励你使用函数组件。  

**然而，函数组件还是类组件，从根本上它们都是 React 的组件。它们将 props 作为它们的输入，而且返回元素（React 语境下的 elements，对要出现在屏幕上的 UI 的描述）作为它们的输出。**  
## 自顶向下的协调（Top Down Reconciliation）  
当你调用：  
```javascript
ReactDOM.render({
  type: Form,
  props: {
    isSubmitted: false,
    buttonText: 'OK!'
  }
}, document.getElementById('root'));
```  
React 将会问 Form 组件对于被给定的 Props 它会返回什么元素树。它将根据更简单的原语逐渐“完善”对组件树的理解：  
```javascript
// React: You told me this...
{
  type: Form,
  props: {
    isSubmitted: false,
    buttonText: 'OK!'
  }
}

// React: ...And Form told me this...
{
  type: Button,
  props: {
    children: 'OK!',
    color: 'blue'
  }
}

// React: ...and Button told me this! I guess I'm done.
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```  
这是 React 调用协调器（reconciliation）的一部分过程，该过程在你调用 ReactDOM.render() 或者 setState() 时开始。在协调结束时，React 知道生成的 DOM 树，然后像 react-dom 或者 react-native 这样的渲染器  
（renderer）应用更新 DOM 节点（或者是特定平台的视图（view），在 React Native 的情况下）所需的最小更改集合。  

这种渐进式的提炼的过程也是 React 应用容易优化的原因。如果你的组件树中的一些部分对 React 有效地访问而言变得太大了的话，你可以告诉它：如果相关的 props 没有改变，请跳过这个提炼（refining）和差异（diffing）树的某些部分。如果 props 是不可变的话，计算 props 是否变化是非常快的。所以 React 和 不可变性（immutability）可以很好地协同工作，并且可以以最少的努力提供出色的优化。  

你可能已经注意到了这个博客文章讨论很多关于组件和元素的内容，却对实例（instances）谈论得不多。事实上，实例在 React 中的重要性要远低于大多数其他面向对象的 UI 框架。  

只有用类声明的组件才有实例，而且你绝对不会直接地创建它们：React 已经为你做了这些事情了。虽然父组件实例访问子组件实例的机制存在，但它们仅被用于紧急的动作（例如在一个字段上设置焦点），而且通常应该避免使用。  

React负责为每个类组件创建一个实例，所以你可以用面向对象的方法和本地状态来编写组件，但除此之外，实例在React的编程模型中并不十分重要，而是由React自己管理。  
## 总结  
一个元素（element）是一个普通对象，描述你想在屏幕上出现的 DOM 节点或其他组件。元素可以在它们的 props 中包含其他的元素。创建一个 React 元素是廉价的，一旦一个元素被创建，它就永远不会被突变（mutated）。  

一个组件可以用几种不同的方式被声明，它可能是一个有 render() 方法的类，或者，简单情况下，它可以以函数的方式被定义。无论是以哪种方式被定义，它都以 props 做为输入，并且返回一个元素树作为输出。  

当一个组件接收到一些 props 作为输入时，这是英文一个特定的父组件返回一个带有其类型（type 字段）和这些属性（props）的元素。这就是为什么人们说 props 在 React 单向流动：从父组件到子组件。  

一个实例（instance）就是你在编写类组件中被称之为 this 的东西，它对于存储局部状态和对声明周期时间做出反应很有用。  

函数组件完全没有实例。类组件有实例，但是你绝不需要直接创建一个组件的实例——React 负责这个。  

最后，要创建元素，使用 React.createElement()，JSX, 或则一个元素工厂帮助器。不要在真实的代码中以普通对象的形式写元素——你只需要知它们实际上是一个普通对象就行了。  
## 延伸阅读  
- [Introducing React Elements](https://reactjs.org/blog/2014/10/14/introducing-react-elements.html)
- [Streamling React Elemenets](https://reactjs.org/blog/2015/02/24/streamlining-react-elements.html)
- [React (Virtual) DOM Terminology](https://reactjs.org/docs/glossary.html)