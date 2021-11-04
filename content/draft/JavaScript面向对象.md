### 对象的属性  
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

### 创建对象的方式  
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
### 创建多个对象的方式
#### 工厂模式

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

##### 改进

可以方便地创建多个有相同属性的对象。

##### 问题

无法辨识类型，方法无法复用，没有共享属性。

#### 构造函数模式

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

构造函数会创建对象，并且在创建的对象上执行构造函数。并将该对象返回。需要用 new 关键字调用构造函数。可以使用标识类型。

##### 问题
相同类的实例**没有共享方法**，每个实例都会创建一个新的函数，即使所有的实例的函数的作用都是一样的。
```js
console.log(dio.sayName === jojo.sayName) // false
```
##### 解决方法
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

##### 问题
定义在全局的方法只能由实例内部调用，不够内聚。

#### 原型模式
我们创建的每个函数都有一个prototype（原型）属性，这个属性是一个指针，指向一个对象，而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法。
关键词：共享

```js
function Person(name, age){
  this.name = name;
  this.age = age;
}

Person.prototype.friends = ['Jim', 'Bob', 'Kim']
Person.prototype.sayName = function(){
  console.log(this.name);
}

var person1 = new Person('luna', 21);
var person2 = new Person('james', 18);
person1.sayName();
person2.sayName();
console.log(person1.sayName === person2.sayName);
console.log(person1.name === person2.name);
console.log(person1.job === person2.job);
```

### 理解原型对象
```js
let person3 = new Person('july', 20)
Person.prototype.sex = 'F';
console.log(Object.keys(person3));

for(let key in person3){
  if(person3.hasOwnProperty(key)){
    console.log('own:', key)
  } else {
    console.log('prototype:', key)
  }
}

console.log(Object.getOwnPropertyNames(Person.prototype))
```
原型对象上的属性也会被 for in 遍历出来  

#### 介绍方法
* isPrototypeOf 检测实例是否是原型的实例  
* hasOwnProperty 检测一个属性是实例属性还是原型对象的属性
* Object.getPrototypeOf 获取一个对象的原型
* Object.keys 获取对象所有可枚举的的实例属性
* Object.getOwnPropertyNames 获取当前对象的所有属实例中的属性名，无论是否可枚举

通过对象字面量重写原型，会失去 constructor
由于在原型中查找值的过程是一次搜索，因此我们对原型对象所做的任何修改都能够立即从实例上反映出来——即使是先创建了实例后修改原型也照样如此。
把原型修改为另外一个对象就等于切断了构造函数与最初原型之间的联系。
原型模式的问题：举例——共享的引用类型，对原型上的一个引用类型修改，会反应在所有实例上

```js
console.log(person1.friends)
console.log(person2.friends)
person1.friends.push('Tom')
console.log(person1.friends)
console.log(person2.friends)
console.log(''.replace (/\s+/g,""))
```

#### 组合构造模式和原型模式
非共享的属性添加在实例的 this 中,实例中有副本。共享的属性或方法添加在原型对象中  

#### 动态原型模式
在构造函数中初始化原型  

#### 寄生构造函数
类似工厂模式。寄生构造函数返回的对象与构造函数以及构造函数的原型对象之间没有关系，所以可以使用其他模式的情况下，不要使用寄生构造函数模式。  

####稳妥构造函数模式
不使用 new 和 this，在安全性要求高的时候用到。

*继承和创建对象要分开*

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