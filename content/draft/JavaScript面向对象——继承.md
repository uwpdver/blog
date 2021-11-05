title: JavaScript面向对象——继承
date: 2021-11-06 23:59
description: 本文是阅读《JavaScript 高级程序设计》面向对象的程序设计一章的笔记，记录了一些知识要点和示例代码。主要内容是 JavaScript 中的继承相关的知识。其中包括：，等等。

### 继承
#### 原型链的基本模式
原型链实现的本质是重写原型对象，代之一个新类型的实例。是用父类的实例替换子类的原型对象
默认的原型
所有函数默认的原型都是 Object 类型的实例
如何确定实例和原型的关系
关键字：instanceOf
原型的方法：prototype.isPrototypeOf
谨慎添加方法
必须在替换原型之后再添加方法，不然会失去与之前原型的链接，同理，也不能通过对象字面量创建原型方法。

##### 问题
共享原型链的属性
没有办法在不影响其他实例的情况，向超类构造函数传递参数

#### 借用构造函数
在子类中调用超类的构造函数  

##### 问题
无法复用，无法向上查找到超类原型中的方法

#### 组合继承
利用原型链实现对原型属性和方法的继承，通过借用构造函数实现对实例属性的继承
，原型链要继承，实例方法要内部保留。
```js
function SuperType(name='', age=18, stand=null){
  this.name = name;
  this.age = age;
  this.stand = stand
}


function StandType(name='', atk=0, speed=0, ang=0){
  this.name = name;
  this.atk = atk;
  this.speed = speed;
  this.ang = ang;
}

SuperType.prototype.callStand = function(){console.log(`Let's go! ${this.stand?.name}!`)}

function SubType(name, age, stand, job){
  SuperType.call(this, name, age, stand)
  this.job = job
}

SubType.prototype = new SuperType();

var jojo = new SubType(
  'jojo', 
  18,
  new StandType(
    'Star Platinum',
    100,
    100,
    100,
  ),
  'student'
)

console.log(jojo.name)
console.log(jojo.age)
jojo.callStand()
```

#### 原型式继承
不用写新的构造函数，通过已有的对象，构建新对象
```js
console.log(obj2)

function object(baseObject){
  function F(){
  }
  F.prototype = baseObject;
  return new F();
}

obj2.sayA = function(){
  console.log(this.a);
}

obj2.friends = ['dio']

obj2.callMyFriends = function(){
  console.log(this.friends)
}

var obj4 = Object.create(obj2, {
  stand: {
    value: 'star'
  }
});

var obj5 = Object.create(obj2, {});
obj4.callMyFriends();
console.log(obj4.stand);
console.log(obj5.stand);
obj5.callMyFriends();
obj4.friends.push('alex');
obj4.callMyFriends();
obj5.callMyFriends();
```
可以用原型对象的属性和方法，也可以不影响其他对象的情况下，添加新的属性和方法
##### 优点
不用创建新的构造函数，一个对象和另一个对象保持类似

#### Object.create()

#### 寄生式继承
就是把上面的原型模式的修改原型，创建对象，和添加实例属性封装在一个工厂函数中
##### 问题  
无法复用函数

#### 寄生组合式继承
组合式继承的问题：至少调用两次超类的构造函数，一次是创建超类的实例作为原型对象的时候，一次是调用本类的构造函数的时候。  

##### 进步之处
不必为了指定子类型的原型而调用超类型的构造函数。  

指定子类型原型的方式变成：通过超类的原型创建一个以该对象为原型的空实例，将该实例作为子类的原型。  

这样就不会调用两次超类的构造函数，子类的原型链与组合式保持不变，子类的原型中还没有了超类重复定义的多余的属性。

```js
function inheritPrototype(subType, superType){
  var prototype = object(superType.prototype);

}
```