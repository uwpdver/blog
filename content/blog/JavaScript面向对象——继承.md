---
title: JavaScript面向对象——继承
date: 2021-11-07 00:45
description: 本文是阅读《JavaScript 高级程序设计》面向对象的程序设计一章的笔记，记录了一些知识要点和示例代码。主要内容是 JavaScript 中的继承相关的知识。其中包括：原型链，借用构造函数方式实现继承，原型式继承，寄生式继承等等。
category: 笔记
tags:
- "笔记"
- "JavaScript"
- "面向对象"
---
## 继承

ECMAScript 继承实现继承主要是依赖原型链来实现的。  

### 基本思想  

利用原型让一个引用类型继承另一个引用类型的**属性**和**方法**。每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。如果让**原型对象等于另一个类型的实例**，此时的原型对象将包含一个指向另一个原型的指针，相对应地，另一个原型中也包含着指向另一个构造函数的指针。假如另一个原型又是另一个类型的实例，那么上诉关系依然成立，如此层层递进，就构成了**实例**与**原型**的链条。这就是所谓原型链的基本概念。  


### 原型链的基本模式  

```js
function SuperType(){
  this.property = true;
}

SuperType.prototype.getSuperValue = function(){
  return this.property;
};

function SubType(){
  this.subproperty = false;
}

// 继承了 SuperType
SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function(){
  return this.subproperty;
};

var instance = new SubType();
console.log(instance.getSuperValue()) // true
```  

`SubType` 将原型替换成了 `SuperType` 的实例，原先存在于 SuperType 的实例中的所有属性和方法，现在也存在于 `SubType.prototype` 中了。  

### 默认原型  

所有引用类型默认都继承于 Object 类，这个继承也是通过原型链实现的。所有函数的默认原型都是 Object 的实例，因此默认原型都会包含一个内部指针，指向 Object.prototype。  

### 确认原型与实例的关系  

1. instanceof 运算 

2. isPrototypeOf() 方法 

### 需要注意  

给原型添加方法的代码一定要放在替换原型的语句之后，不然替换原型后创建的实例无法访问到添加的方法。因为方法被添加到了替换之前的原型对象中，而实例的内部指针指向了一个新的原型对象。  

在通过原型链实现继承时，不能使用对象字面量创建原型方法。因为这样做就会重写原型链。  

#### 问题  

* 原型链上的所有属性都会被同类型的实例所共享。所以一个实例对原型链上的属性做的修改会反映到所有该类型实例上。  

* 没有办法在不影响其他实例的情况，向超类构造函数传递参数。  

### 借用构造函数
在子类中调用超类的构造函数，这样在超类的实例中添加的属性的操作也会在子类创建实例时在子类实例上执行。这样子类就拥有了超类的属性和方法。  


```js
function SuperType(){
  this.colors = ["red", "blue", "green"];
}

function SubType(){
  SuperType.call(this);
}

var instance1 = new SubType();
instance1.colors.push("black");
console.log(instance1.colors) // "red,blue,green,black"

var instance2 = new SubType();
console.log(instance1.colors) // "red,blue,green"
```

通过这种方式创建的实例，属性都在对象实例中，不同的实例的属性互不影响。  

#### 向父组件的构造函数传递参数  

```js
function SuperType(name){
  this.name = name;
}

function SubType(){
  SuperType.call(this, 'jojo');

  this.age = 17;
}

var instance = new SubType();
console.log(instance.name); // "jojo"
console.log(instance.age); // 17
```

#### 问题  

* 无法复用函数。  

* 无法继承到超类的原型。  

### 组合继承  

组合原型链模式和构造函数模式，利用原型链实现对原型属性和方法的继承，通过借用构造函数实现对实例属性的继承，既可以继承原型链，保证共享属性和函数复用，又能保证每个实例有自己的属性。  

```js
function SuperType(name='', age=18){
  this.name = name;
  this.age = age;
}

SuperType.prototype.sayName = function(){
  console.log(this.name);
}

function SubType(name, age, stand){
  SuperType.call(this, name, age);
  this.stand = stand;
  this.friends = ["Kakyoin"];
}

SubType.prototype = new SuperType();

SuperType.prototype.callStand = function(){
  console.log(this.callStand);
}

var person1 = new SubType('jojo', 18, 'Star Platinum');

person1.friends.push("Polnareff");
console.log(person1.friends) // "Kakyoin,Polnareff"; 
person1.sayName() // "jojo"
person1.callStand() // "Star Platinum"

var person2 = new SubType('dio', 120, 'The World');
console.log(person2.friends) // "Kakyoin"; 
person2.sayName() // "dio"
person2.callStand() // "The World"
```

### 原型式继承  

不用写新的构造函数，通过已有的对象，构建新对象。  

```js
var baseObj = {
  name: 'jojo',
  age: 17,
  sayName: function(){
    console.log(this.name);
  }
};

function object(o){
  function F(){
  }
  F.prototype = o;
  return new F();
}

var person1 = object(baseObj);
person1.friends = ['dio'];
person1.callFriends = function(){
  console.log(this.frirends);
}

person1.sayName() // "jojo"
person1.callFriends() // "dio"
```  

#### 改进  

* 不用创建新的构造函数。  

* 可以用原型对象的属性和方法。

* 可以不影响其他对象的情况下，添加新的属性和方法。  

* 适用 `instance` 和 `isPrototypeOf()`。  

### Object.create()  

第一个参数用作新对象原型，第二个参数用于定义额外的属性。第二个参数与 `Object.defineProperties()` 方法的第二个参数格式相同。  

### 寄生式继承  

就是把上面的原型模式的修改原型，创建对象，和添加实例属性封装在一个工厂函数中。

```js
function createAnother(original){
  var clone = Object.create(original);
  clone.stand = "Star Platinum'";
  return clone;
}
```

#### 改进  

* 将逻辑封装在了一起。  

#### 问题  

* 无法复用函数。

### 寄生组合式继承  

使用组合式继承至少调用两次超类的构造函数，一次是创建超类的实例作为原型对象的时候，一次是调用本类的构造函数的时候。  

```js
function inheritPrototype(subType, superType){
  var prototype = Object.create(superType.prototype);
  prototype.constructor = subType;
  subType.prototype = prototype;
}

function SuperType(name){
  this.name = name;
  this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function(){
  console.log(this.name);
}

function SubType(name, age){
  SuperType.call(this, name);
  this.age = age;
}

inheritPrototype(SubType, SuperType);

SubType.prototype.sayAge = function(){
  console.log(this.age);
}

var instance1 = new SubType('jojo', 17);
instance1.colors.push('black');
console.log(instance1.colors) // "red,blue,green";
instance1.sayName(); // "jojo"
instance1.sayAge(); // 17

var instance2 = new SubType('dio', 120);
console.log(instance1.colors) // "red,blue";
instance1.sayName(); // "dio"
instance1.sayAge(); // 120
```

#### 改进  

* 不必为了指定子类型的原型而调用超类型的构造函数。  

* 指定子类型原型的方式变成：通过超类的原型创建一个以该对象为原型的空实例，将该实例作为子类的原型。  

* 这样就不会调用两次超类的构造函数，子类的原型链与组合式保持不变，子类的原型中还没有了超类重复定义的多余的属性。  

* 集寄生继承和组合继承的优点与一身，是实现基于类型继承的最有效方式。  
