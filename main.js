// В одном городе есть электрическая сеть. К ней могут быть подключены:

// электростанции, вырабатывают мощность от 1 до 100 мегаватт.
// жилые дома, в них от 1 до 400 квартир, потребляют 4 кВт на квартиру днем и 1 кВт ночью.
// солнечные панели, генерируют от 1 до 5 мегаватт днем (в зависимости от вида панели, то есть некоторые панели генерируют 1 мегаватт, некоторые 2 и так далее) и 0 ночью
// линии электропередач, ведущие в другие города, по ним может подаваться недостающая или отдаваться лишняя энергия. У линий есть свойство «мощность», которая определяет, сколько мегаватт можно передать по ней, а также «цена мегаватта», которое показывает сколько можно получить или придется заплатить за переданный/полученный мегаватт. На разных линиях может быть разная цена.
// Список всех элементов электросети:

// let electricalnetwork = new ElectricalNetwork([
//     new Electrostation(1 * Math.pow(10, 6)),
//     new House(400),
//     new House(300),
//     new House(100),
//     new SolarPanele(1 * Math.pow(10, 6)),
//     new SolarPanele(3 * Math.pow(10, 6)),
//     new SolarPanele(5 * Math.pow(10, 6)),
//     new PowerLine(6.5 * Math.pow(10, 6), 1000),
//     new PowerLine(6.6 * Math.pow(10, 6), 3000),
//     new PowerLine(6.6 * Math.pow(10, 6), 7000)
// ]);
// Напиши программу, рассчитывющую, сколько электричества необходимо закупить (или можно продать) днем и ночью для обеспечения баланса и сколько это будет стоить (или принесет прибыли).


const CONSUMPTION_FLAT_DAY=4;
const CONSUMPTION_FLAT_NIGHT=1;

class ElectricalNetwork {
	constructor(networkArr){
		this.networkArr=networkArr
	}
	get networkNewArr(){
		return this.networkArr;
	}
	set networkNewArrSet(value){
		this.networkArr=value;
	}
// общее потребление энергии квартирами днем
	totalEnergyConsumptionOfHouseDay(){
		return this.networkArr.reduce((sum,elem)=>{
			if(elem instanceof House){
				sum+=elem.consumptionElectricOfHouseDay();
			}
			return sum
		},0)
	}
	// общее подтребление энергии квартирами ночью
	totalEnergyConsumptionOfHouseNight(){
		return this.networkArr.reduce((sum,elem)=>{
			if(elem instanceof House){
				sum+=elem.consumptionElectricOfHouseNight();
			}
			return sum
		},0)
	}
// Общее количество энергии выработанное солнечными панелями днем
	totalGenEnergySolarPaneleDay(){
		// console.log(this);
		return this.networkArr.reduce((sum,elem)=>{
			if(elem instanceof SolarPanele){
				sum+=elem.productionSolarPanelEnergyDay();
			}
			// console.log(sum);
			return sum 
		},0)
	}
// Общее количество вырабатываемой энергии электростанциями (На случай,если добавятся еще несколько электростанций )
	totalGenEnergyElectrostation(){
		
		return this.networkArr.reduce((sum,elem)=>{
			if( elem instanceof Electrostation){
				sum+=elem.productionElectrostationEnergy();
			}
			// console.log(sum);
			return sum;
		},0)
	}
	// Суммарное количество энергии вырабатываемое за весь день
	summQuantityGenEnergyOfDay(){
		return this.totalGenEnergySolarPaneleDay()+this.totalGenEnergyElectrostation();
	}
	// Разница в потребляемой и вырабатываемой энергии днем ( если -, то недостаточно)
	differenceDayEnergy(){
		return this.summQuantityGenEnergyOfDay()-this.totalEnergyConsumptionOfHouseDay()
	}
	// Разница в потребляемой и вырабатываемой энергии ночью ( если -, то недостаточно)
	differenceNightEnergy(){
		return this.totalGenEnergyElectrostation()-this.totalEnergyConsumptionOfHouseNight()
	}
	// Сортируем линии электропередач по убыванию цены
	sortPowerLineDown(){
		let sortedPoverLineDownArr=[];
		this.networkArr.forEach(function(elem){
			if(elem instanceof PowerLine){
				sortedPoverLineDownArr.push(elem);
			}
		})
// сортировочка массива обьектов по убыванию
		function sortdown(field){
			return (a,b)=>b[field]>a[field]?1:-1
		}
		sortedPoverLineDownArr.sort(sortdown('costPowerLine'));
		// console.log('sortedPoverLineArr: ', sortedPoverLineArr);
		return sortedPoverLineDownArr
	}

	// Сортируем линии электропередач по возрастанию цены
	sortPowerLineUp(){
		let sortedPoverLineUpArr=[];
		this.networkArr.forEach(function(elem){
			if(elem instanceof PowerLine){
				sortedPoverLineUpArr.push(elem);
			}
		})
// сортировочка массива обьектов по убыванию цены
		function sortdown(field){
			return (a,b)=>a[field]>b[field]?1:-1
		}
		sortedPoverLineUpArr.sort(sortdown('costPowerLine'));
		return sortedPoverLineUpArr
	}


	calculateCostDayEnergy(){
		let powlineDown=this.sortPowerLineDown();
		console.log('powline: ', powlineDown);
		let powlineUp=this.sortPowerLineUp();
		console.log('powlineUp: ', powlineUp);

		let energy=this.differenceDayEnergy();
		console.log('energy: ', energy)
		let costE;
		// Если энергия в плюсе(лишняя)
			if(energy>0){
				costE=powlineDown.reduce(function (cost,item) {
					console.log('item: ', item);
					// если энергии больше,чем можно передать по одной линии
					if(energy>item.powerLine){
						cost+=item.costPowerLine;
						energy-=item.powerLine;
						// мы ее передаем по второй
						if(energy>0&&energy<item.powerLine){
							cost+=(item.costPowerLine/item.powerLine)*energy;
							energy=0;
					}
					// если всю энергию можно передать по одной линии
				}else if(energy>0&&energy<item.powerLine){
					cost+=(item.costPowerLine/item.powerLine)*energy;
					energy=0;
				}
				return cost
		},0)
		} 
		// если энергии недостаточно (нужно закупить)                        можно было как-то сократить, но,если работает,лучше не буду трогать
		if(energy<0){
			energy=Math.abs(energy)
			// Возвращаем отрицательное значение
			costE=-powlineUp.reduce(function (cost,item) {
				console.log('item: ', item);
				// если энергии больше,чем можно передать по одной линии
				if(energy>item.powerLine){
					cost+=item.costPowerLine;
					energy-=item.powerLine;
					// мы ее передаем по второй
					if(energy>0&&energy<item.powerLine){
						cost+=(item.costPowerLine/item.powerLine)*energy;
						energy=0;
				}
				// если всю энергию можно передать по одной линии
			}else if(energy>0&&energy<=item.powerLine){
				cost+=(item.costPowerLine/item.powerLine)*energy;
				energy=0
			}
			return cost
	},0)
		}
		// если не срослось
		if(energy=0){
			console.log("Лишней или недостатка Энергии нет ");
		}	
			
	console.log('costE: ', costE);
	return  costE
}

}

class Electrostation {
	
	constructor(powerElectrostation){
		this.powerElectrostation=powerElectrostation;
	}
	productionElectrostationEnergy(){
		return this.powerElectrostation
	}
	

};

class House {
	constructor(countFlat){
		this.countFlat=countFlat
	};

	// в зависимости от времени суток ,считаем расход энергии квартир
	consumptionElectricOfHouseDay(){
		return this.countFlat*CONSUMPTION_FLAT_DAY;
	}
	consumptionElectricOfHouseNight(){
		return this.countFlat*CONSUMPTION_FLAT_NIGHT;
	}
	

	
};

class SolarPanele {
	constructor(powerSolarPanel){
		this.powerSolarPanel=powerSolarPanel
	}

	productionSolarPanelEnergyDay(){
		return this.powerSolarPanel;
	}
	productionSolarPanelEnergyNight(){
		return 0;
	}
};

class PowerLine {
	constructor(powerLine,costPowerLine){
		this.powerLine=powerLine;
		this.costPowerLine=costPowerLine;
	}
	
};





let electricalnetwork = new ElectricalNetwork([
	
	    new Electrostation(1 * 1000),
	    new House(400),
	    new House(300),
	    new House(100),
	    new SolarPanele(1 * 1000),
	    new SolarPanele(3 * 1000),
	    new SolarPanele(5 * 1000),
	    new PowerLine(6.5 * 1000, 3000),
	    new PowerLine(6.6 * 1000, 5000),
		 new PowerLine(6.6 * 1000, 1000),
	]);

	console.log('electricalnetwork:', electricalnetwork.calculateCostDayEnergy());
	// console.log('day',electricalnetwork.differenceDayEnergy());

	
//  и где-то тут есть ошибка (в calculateCostDayEnergy()),если лишней энергии очень много ,странная ошибка (анонимная функция какая-то), но могу понять из-за чего
	
	
