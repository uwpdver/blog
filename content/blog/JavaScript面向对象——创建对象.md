---
title: JavaScript面向对象——创建对象和原型
date: 2021-11-05 23:59
description: 本文是阅读《JavaScript 高级程序设计》面向对象的程序设计一章的笔记，记录了一些知识要点和示例代码。主要内容是 JavaScript 中的创建对象相关的知识。其中包括：对象的属性，创建单个对象的方式，创建多个对象的方式，理解原型对象，等等。
category: 笔记
tags:
- "笔记"
- "JavaScript"
- "面向对象"
---
## 对象的属性  
属性两种类型  
1. 数据属性  
2. 访问器属性  

四个属性特征
* `[[Configurable]]`：可配置性，能否用 delete 删除，以及能否修改属性的特征值
* `[[Enumerable]]`：可枚举型性，能否用 for in 枚举
* `[[Writable]]`：可写性，能否修改该属性的值
* `[[Value]]`：保存属性的值，属性从这里读取，新的值替代这个位置的值

Object.defineProperty() 设置属性的特性

访问器属性
* `[[Set]]`
* `[[Get]]`  

Object.getOwnPropertyDescriptor() 获取属性的特性

## 创建对象的方式  
方式 1——new Object  

```js
var obj1 = new Object();
obj1.a = 'to';
obj1.b = 'be';
obj1.c = 'or';
console.log(obj1);
```

方式 2——字面量  

```js
var obj2 = {
  a: 'to',
  b: 'be',
  c: 'or',
}

console.log(obj2);
```

## 创建多个对象的方式
### 工厂模式

```js
function createPerson(name, age){
  var obj = new Object();
  obj.name = name;
  obj.age = age;
  return obj;
}

var jojo = createPerson('jojo', 17);
console.log(jojo);
```

通过工厂函数，创建对象，为对象添加属性，然后返回对象。

#### 改进

可以方便地创建多个有相同属性的对象。

#### 问题

无法辨识类型，方法无法复用，没有共享属性。

### 构造函数模式

```js
function Person(name, age) {
  this.name = name;
  this.age = agel
  this.sayName = function(){
    console.log(this.name);
  }
}

var jojo = new Person('jojo', 17);
var dio = new Person('dio', 120);

jojo.sayName(); // 'jojo'
dio.sayName(); // 'dio'
console.log(jojo instance Person) // true
console.log(dio instance Person) // true
```

要创建 Person 的新实例，必须使用 new 操作符。以这种方式调用构造函数实际上会经历以下 4 个步骤：  

1. 创建一个新对象；  

2. 将构造函数的作用域赋给新对象（因此this就指向了这个新对象）；
   
3. 执行构造函数中的代码（为这个新对象添加属性）；
   
4. 返回新对象。  

#### 问题
相同类的实例**没有共享方法**，每个实例都会创建一个新的函数，即使所有的实例的函数的作用都是一样的。

```js
console.log(dio.sayName === jojo.sayName) // false
```
#### 解决方法
将方法提取到外部定义，构造函数内只将外部的函数赋值给 this 的属性。
```js
function sayName(){
    console.log(this.name);
}

function Person(name, age) {
  this.name = name;
  this.age = agel
  this.sayName = sayName
}
```

#### 问题
定义在全局的方法只能由实例内部调用，不够内聚。

### 原型模式
我们创建的每个函数都有一个prototype（原型）属性，这个属性是一个指针，指向一个对象，而这个对象的用途是包含可以**由特定类型的所有实例共享**的属性和方法。

```js
function Person(name, age){
}

Person.prototype.name = 'jojo';
Person.prototype.age = 17;
Person.prototype.friends = ['dio', 'Bob']
Person.prototype.sayName = function(){
  console.log(this.name);
}

var person1 = new Person();
var person2 = new Person();
person1.sayName(); // jojo
person2.sayName(); // jojo
```

### 理解原型对象
#### 构造函数与其原型对象之间的联系  

无论什么时候，只要创建了一个新函数，就会根据一组特定的规则为该函数创建一个 ```prototype``` 属性，这个属性指向函数的原型对象。在默认情况下，所有原型对象都会都会自动获得一个 ```constructor```（构造函数）属性，这个属性包含一个指向 ```prototype``` 属性所在函数的指针。就拿前面的例子来说，```Person.prototype.constructor``` 指向 ```Person```。而通过这个构造函数，我们还可继续为原型对象添加其他属性和方法。  

#### 实例与构造函数的原型对象之间的的联系  

当调用构造函数创建一个新实例后，该实例的内部将包含一个指针（内部属性）```[[Prototype]]```，指向构造函数的原型对象。这个连接存在于**实例**与**构造函数的原型对象**之间，而不是存在于实例与构造函数之间。  

#### 对象属性的查找过程  

每当代码读取某个对象的某个属性时，都会执行一次搜索，目标是具有给定名字的属性。搜索首先从对象实例本身开始。如果在实例中找到了具有给定名字的属性，则返回该属性的值；如果没有找到，则继续搜索指针指向的原型对象，在原型对象中查找具有给定名字的属性。如果在原型对象中找到了这个属性，则返回该属性的值。

由于在原型中查找值的过程是一次搜索，因此我们对原型对象所做的任何修改都能够立即从实例上反映出来——即使是先创建了实例后修改原型也照样如此。  

如果我们在实例中添加了一个属性，而该属性与实例原型中的一个属性同名，那我们就在实例中创建该属性，该属性将会屏蔽原型中的那个属性。  

不过，使用 ```delete``` 操作符则可以完全删除实例属性，从而让我们能够重新访问原型中的属性，如下所示。  

原型模式的问题：举例——共享的引用类型，对原型上的一个引用类型修改，会反应在所有实例上

```js
function Person(name, age){
  this.name = name;
}

Person.prototype.age = 17;

var person = Person('jojo')

// for in 可以遍历对象所有可枚举的属性，包括原型对象上的属性  
for(let key in person){
  console.log(key)
}
// 控制台输出: 
// name
// age

// hasOwnProperty 对存在于实例中的属性返回 true，否则返回 false
for(let key in person){
  if(person.hasOwnProperty(key)){
    console.log(key)
  }
}
// 控制台输出: 
// name

// Object.getOwnPropertyNames 可以获得所有的属性名，无论属性是否可枚举。
console.log(Object.getOwnPropertyNames(Person.prototype))
// 控制台输出：
// ['constructor']
```


#### 介绍方法
| 方法名                          | 作用                                                  |
| ------------------------------- | ----------------------------------------------------- |
| isPrototypeOf                   | 检测原型是否是存在于某个实例中。                      |
| hasOwnProperty                  | 检测一个属性是否为实例属性。                          |
| Object.getPrototypeOf           | 获取一个对象的原型。                                  |
| Object.keys                     | 获取对象所有可枚举的的实例属性。                      |
| Object.getOwnPropertyNames      | 获取当前对象的所有属 实例中的属性名，无论是否可枚举。 |
| Object.getOwnPropertyDescriptor | 获取对象实例属性的描述符。                            |

#### 通过对象字面量重写原型

通过对象字面量重写原型，会失去 ```constructor```。把原型修改为另外一个对象就等于切断了构造函数与最初原型之间的联系。  

```js
function Person(){
}
console.log(person.prototype.constructor) // function Person(){}
person.prototype = {
  name: 'jojo'
}
console.log(person.prototype.constructor) // undefined
```

把原型修改为另外一个对象就等于切断了构造函数与最初原型之间的联系。  

```js
function Person(){
}

Person.prototype.name = 'jojo';

var person1 = new Person();
console.log(person1.name) // jojo

Person.prototype = {
  name: 'dio',
  age: 120
}

var person2 = new Person()
console.log(person2.name) // dio
console.log(person1.name) // jojo

console.log(person2.age) // 120
console.log(person1.name) // undefined

console.log(Person.prototype.isPrototypeOf(person1)) // false
```

### 组合构造模式和原型模式
构造函数模式用于定义实例属性，而原型模式用于定义方法和共享的属性。  

```js
function Person(name, age){
  this.name = name;
  this.age = age;
  this.friends = ['dio'];
}

Person.prototype.sayName = function(){
  console.log(name);
}

var person1 = new Person('jojo', 17);
var person2 = new Person('dio', 120);

person1.friends.push('bob');
console.log(person1.friends) // ['dio', 'bob']
console.log(person2.friends) // ['dio']
console.log(person1.friends === person2.friends) // false
console.log(person1.sayName === person2.sayName) // false
```

#### 改进  

每个实例都会有自己的一份实例属性的副本，但同时又共享着对方法的引用。

#### 问题  

构造函数和原型分离，不够内聚。  

### 动态原型模式
在构造函数中初始化原型。  

```js
function Person(name, age) {
  //属性 
  this.name = name;
  this.age = age;
  //方法 
  if (typeof this.sayName != "function") {
      Person.prototype.sayName = function () {
          console.log(this.name);
      };
  }
}
```

### 寄生构造函数
类似工厂模式。寄生构造函数返回的对象与构造函数以及构造函数的原型对象之间没有关系，所以可以使用其他模式的情况下，不要使用寄生构造函数模式。

```js  
function Person( name, age){
  var o = new Object(); 
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function(){ 
    alert( this. name); 
  }; 
  return o; 
} 

var person1 = new Person(" jojo", 17, );
person1.sayName(); // jojo
```
### 稳妥构造函数模式
不使用 new 和 this，在安全性要求高的时候用到。与寄生构造函数模式类似，使用稳妥构造函数模式创建的对象与构造函数之间也没有什么关系，因此 instanceof 操作符对这种对象也没有意义。  