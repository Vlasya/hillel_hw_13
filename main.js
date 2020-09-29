// Сеть фастфудов предлагает несколько видов гамбургеров:
// маленький (5$, 20 калорий)
// большой (10$, 40 калорий)
// Гамбургер может быть с одним из нескольких видов начинок:
// сыром (+ 1$, + 20 калорий)
// салатом (+ 2$, + 5 калорий)
// картофелем (+ 1,5$ , + 10 калорий)
// Можно добавить добавки:
// посыпать приправой (+ 1,5$, 0 калорий)
// полить майонезом (+ 2$, + 5 калорий).
// Напишите программу, рассчитывающую стоимость и калорийность гамбургера. Используйте ООП подход (подсказка: нужен класс Гамбургер, глобальный объект HAMBURGER (с перечнем всех его ингредиентов и характеристик) и методы для выбора опций и расчета нужных величин).

let propertiesHumburger={
	burgerSize:{
		small:{
			name:'small',
			price:5,
			calories:20
		},
		big:{
			name:'big',
			price:10,
			calories:40
		}
	},
	filling:{
		cheese:{
			name:'cheese',
			price:1,
			calories:20
		},
		salad:{
			name:'salad',
			price:2,
			calories:5
		},
		potato:{
			name:'potato',
			price:1.5,
			calories:10
		}
	},
	topic:{
		seasoning:{
		name:'seasoning',
			price:1.5,
			calories:0
		},
		mayonnaise:{
		name:'mayonnaise',
			price:2,
			calories:5
		}
	}
}

class Hamburger{
	constructor(burgerSize,filling,topic){
		this._burgerSize=burgerSize;
		this._filling=filling;
		this._topic=topic;
	}
	getBurgerSize(){
		return this._burgerSize
	}
	setBurgerSize(val){
		this._burgerSize=val
	}

	getFilling(){
		return this._filling
	}
	setFilling(val){
		this._filling=val
	}

	getTopic(){
		return this._topic
	}
	setTopic(val){
		this._topic=val
	}

	considerCallories(){
		let summCalories=0;
		for(let el in this){
			summCalories+=this[el].calories
		}
		return summCalories
	}
	considerCost(){
		let summCost=0;
		for(let el in this){
			summCost+=this[el].price
		}
		return summCost
	}

	totalCount(){
		return `Общая каллорийность наборчика ${this.considerCallories()} ккал.  Сейчас вы съедите ${this.considerCost()} $. Приятного! `
	}
}


let myBurger= new Hamburger(propertiesHumburger.burgerSize.big,propertiesHumburger.filling.cheese,propertiesHumburger.topic.mayonnaise)
myBurger.setFilling(propertiesHumburger.filling.salad)
console.log(myBurger.totalCount());








