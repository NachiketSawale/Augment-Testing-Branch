(function (angular) {
	'use strict';

	angular.module('estimate.main').factory('estimateMainGraCalculationService', [
		function () {

			// GA + AM + RP:8 + 3 + 2 = 8.0 + 3.0 + 2.0 = 13
			function EstGraCalculator1() {

				this.generateFinMGra = function generateFinMGra(item) {
					return item.GaPerc + item.AmPerc + item.RpPerc;
				};

				this.generateFinGa = function generateFinGa(markup2CostCodeEntity) {
					return markup2CostCodeEntity.GaPercConverted;
				};

				this.generateFinAm = function generateFinAm(markup2CostCodeEntity) {
					return markup2CostCodeEntity.AmPercConverted;
				};

				this.generateFinRp = function generateFinRp(markup2CostCodeEntity) {
					return markup2CostCodeEntity.RpPercConverted;
				};
			}


			// GA + AM + RP:8 + 3 + 2 = 8.0 + 3.0 + 2.22 = 13.22
			function EstGraCalculator2() {

				this.generateFinMGra = function generateFinMGra(item) {
					return ((1 + item.GaPercConverted + item.AmPercConverted) * (1 + item.RpPercConverted) - 1) * 100;
				};

				this.generateFinGa = function generateFinGa(markup2CostCodeEntity) {
					return markup2CostCodeEntity.GaPercConverted;
				};

				this.generateFinAm = function generateFinAm(markup2CostCodeEntity) {
					return markup2CostCodeEntity.AmPercConverted;
				};

				this.generateFinRp = function generateFinRp(markup2CostCodeEntity) {
					return (1 + markup2CostCodeEntity.GaPercConverted + markup2CostCodeEntity.AmPercConverted) * markup2CostCodeEntity.RpPercConverted;
				};
			}


			// GA + AM + RP:8 + 3 + 2 = 8.70 + 3.09 + 2.04 = 13.83
			function EstGraCalculator3() {

				this.generateFinMGra = function generateFinMGra(item) {
					if(item.GaPercConverted === 1 || item.AmPercConverted === 1 || item.RpPercConverted === 1){
						return  0;
					}
					return (item.GaPercConverted / (1 - item.GaPercConverted) + item.AmPercConverted / (1 - item.AmPercConverted) + item.RpPercConverted / (1 - item.RpPercConverted)) * 100;
				};

				this.generateFinGa = function generateFinGa(markup2CostCodeEntity) {
					return markup2CostCodeEntity.GaPercConverted === 1 ? 0 : markup2CostCodeEntity.GaPercConverted / (1 - markup2CostCodeEntity.GaPercConverted);
				};

				this.generateFinAm = function generateFinAm(markup2CostCodeEntity) {
					return markup2CostCodeEntity.AmPercConverted === 1 ? 0 : markup2CostCodeEntity.AmPercConverted / (1 - markup2CostCodeEntity.AmPercConverted);
				};

				this.generateFinRp = function generateFinRp(markup2CostCodeEntity) {
					return markup2CostCodeEntity.RpPercConverted === 1 ? 0 : markup2CostCodeEntity.RpPercConverted / (1 - markup2CostCodeEntity.RpPercConverted);
				};
			}

			// GA + AM + RP:8 + 3 + 2 = 13.00 / (100 - 13.00) = 14.94
			function EstGraCalculator4() {

				this.factor = function factor(markup2CostCodeEntity)
				{
					if ((markup2CostCodeEntity.GaPercConverted + markup2CostCodeEntity.AmPercConverted + markup2CostCodeEntity.RpPercConverted) === 1)
					{
						return 0;
					}

					return 1 / (1 - (markup2CostCodeEntity.GaPercConverted + markup2CostCodeEntity.AmPercConverted + markup2CostCodeEntity.RpPercConverted));
				};

				this.generateFinMGra = function generateFinMGra(item) {
					if ((item.GaPercConverted + item.AmPercConverted + item.RpPercConverted) === 1) {
						return 0;
					}

					return (item.GaPercConverted + item.AmPercConverted + item.RpPercConverted) / (1 - (item.GaPercConverted + item.AmPercConverted + item.RpPercConverted)) * 100;
				};

				this.generateFinGa = function generateFinGa(markup2CostCodeEntity) {
					return markup2CostCodeEntity.GaPercConverted * this.factor(markup2CostCodeEntity);
				};

				this.generateFinAm = function generateFinAm(markup2CostCodeEntity) {
					return markup2CostCodeEntity.AmPercConverted * this.factor(markup2CostCodeEntity);
				};

				this.generateFinRp = function generateFinRp(markup2CostCodeEntity) {
					return markup2CostCodeEntity.RpPercConverted * this.factor(markup2CostCodeEntity);
				};
			}


			// GA + AM + RP:8 + 3 + 2 = 11.11 + 3.00 + 0.33 = 14.44
			function EstGraCalculator5() {

				this.generateFinMGra = function generateFinMGra(item) {
					return item.GaPercConverted + item.RpPercConverted === 1 ? 0 : ((1 + (item.GaPercConverted + item.RpPercConverted) / (1 - (item.GaPercConverted + item.RpPercConverted))) * (1 + item.AmPercConverted) - 1) * 100;
				};

				this.generateFinGa = function generateFinGa(markup2CostCodeEntity) {
					return (markup2CostCodeEntity.GaPercConverted + markup2CostCodeEntity.RpPercConverted) === 1 ? 0 : markup2CostCodeEntity.GaPercConverted / (1 - (markup2CostCodeEntity.GaPercConverted + markup2CostCodeEntity.RpPercConverted));
				};

				this.generateFinAm = function generateFinAm(markup2CostCodeEntity) {
					let finGa = this.generateFinGa(markup2CostCodeEntity);

					let finRp = this.generateFinRp(markup2CostCodeEntity);

					return (1 + finGa + finRp) * markup2CostCodeEntity.AmPercConverted;
				};

				this.generateFinRp = function generateFinRp(markup2CostCodeEntity) {
					return (markup2CostCodeEntity.GaPercConverted + markup2CostCodeEntity.RpPercConverted) === 1 ? 0 : markup2CostCodeEntity.RpPercConverted / (1 - (markup2CostCodeEntity.GaPercConverted + markup2CostCodeEntity.RpPercConverted));
				};
			}


			// GA + AM + RP:8 + 3 + 2 = 11.11 + 3.00 + 2.27 = 13.27
			function EstGraCalculator6() {

				this.generateFinMGra = function generateFinMGra(item) {
					return item.RpPercConverted === 1 ? 0 : ((1 + item.GaPercConverted + item.AmPercConverted) * (1 + item.RpPercConverted / (1 - item.RpPercConverted)) - 1) * 100;
				};

				this.generateFinGa = function generateFinGa(markup2CostCodeEntity) {
					return markup2CostCodeEntity.GaPercConverted;
				};

				this.generateFinAm = function generateFinAm(markup2CostCodeEntity) {
					return markup2CostCodeEntity.AmPercConverted;
				};

				this.generateFinRp = function generateFinRp(markup2CostCodeEntity) {
					let finGa = this.generateFinGa(markup2CostCodeEntity);

					let finAm = this.generateFinAm(markup2CostCodeEntity);

					return markup2CostCodeEntity.RpPercConverted === 1 ? 0 : (1 + finGa + finAm) * (markup2CostCodeEntity.RpPercConverted / (1 - markup2CostCodeEntity.RpPercConverted));
				};
			}


			// GA + AM + RP:8 + 3 + 2 = 8.00 + 3.24 + 2.27 = 13.51
			function EstGraCalculator7() {

				this.generateFinMGra = function generateFinMGra(item) {
					return item.RpPercConverted === 1 ? 0 : ((1 + item.GaPercConverted) * (1 + item.AmPercConverted) * (1 + item.RpPercConverted / (1 - item.RpPercConverted)) - 1) * 100;
				};

				this.generateFinGa = function generateFinGa(markup2CostCodeEntity) {
					return markup2CostCodeEntity.GaPercConverted;
				};

				this.generateFinAm = function generateFinAm(markup2CostCodeEntity) {
					let finGa = this.generateFinGa(markup2CostCodeEntity);

					return (1 + finGa) * markup2CostCodeEntity.AmPercConverted;
				};

				this.generateFinRp = function generateFinRp(markup2CostCodeEntity) {
					let finGa = this.generateFinGa(markup2CostCodeEntity);

					let finAm = this.generateFinAm(markup2CostCodeEntity);

					return markup2CostCodeEntity.RpPercConverted === 1 ? 0 : (1 + finGa + finAm) * (markup2CostCodeEntity.RpPercConverted / (1 - markup2CostCodeEntity.RpPercConverted));
				};
			}

			// GA + AM + RP:8 + 3 + 2 = 8.00 + 3.34 + 2.27 = 13.61
			function EstGraCalculator8() {

				this.generateFinMGra = function generateFinMGra(item) {
					return item.AmPercConverted === 1 || item.RpPercConverted === 1 ? 0 : ((1 + item.GaPercConverted) * (1 + item.AmPercConverted / (1 - item.AmPercConverted)) * (1 + item.RpPercConverted / (1 - item.RpPercConverted)) - 1) * 100;
				};

				this.generateFinGa = function generateFinGa(markup2CostCodeEntity) {
					return markup2CostCodeEntity.GaPercConverted;
				};

				this.generateFinAm = function generateFinAm(markup2CostCodeEntity) {
					let finGa = this.generateFinGa(markup2CostCodeEntity);

					return markup2CostCodeEntity.AmPercConverted === 1 ? 0 : (1 + finGa) * (markup2CostCodeEntity.AmPercConverted / (1 - markup2CostCodeEntity.AmPercConverted));
				};

				this.generateFinRp = function generateFinRp(markup2CostCodeEntity) {
					let finGa = this.generateFinGa(markup2CostCodeEntity);

					let finAm = this.generateFinAm(markup2CostCodeEntity);

					return markup2CostCodeEntity.RpPercConverted === 1 ? 0 : (1 + finGa + finAm) * (markup2CostCodeEntity.RpPercConverted / (1 - markup2CostCodeEntity.RpPercConverted));
				};
			}


			// GA + AM + RP:8 + 3 + 2 = 8.00 + 3.24 + 2.22 = 13.46
			function EstGraCalculator9() {

				this.generateFinMGra = function generateFinMGra(item) {
					return ((1 + item.GaPercConverted) * (1 + item.AmPercConverted) * (1 + item.RpPercConverted) - 1) * 100;
				};

				this.generateFinGa = function generateFinGa(markup2CostCodeEntity) {
					return markup2CostCodeEntity.GaPercConverted;
				};

				this.generateFinAm = function generateFinAm(markup2CostCodeEntity) {
					let finGa = this.generateFinGa(markup2CostCodeEntity);

					return (1 + finGa) * markup2CostCodeEntity.AmPercConverted;
				};

				this.generateFinRp = function generateFinRp(markup2CostCodeEntity) {
					let finGa = this.generateFinGa(markup2CostCodeEntity);

					let finAm = this.generateFinAm(markup2CostCodeEntity);

					return (1 + finGa + finAm) * markup2CostCodeEntity.RpPercConverted;
				};
			}

			let service = {};

			service.createGraCalculator = function(allowanceEntity){
				if (!allowanceEntity) {
					return null;
				}

				switch (allowanceEntity.MdcMarkUpCalcTypeFk) {
					case 1: {
						return new EstGraCalculator1();
					}
					case 2: {
						return new EstGraCalculator2();
					}
					case 3: {
						return new EstGraCalculator3();
					}
					case 4: {
						return new EstGraCalculator4();
					}
					case 5: {
						return new EstGraCalculator5();
					}
					case 6: {
						return new EstGraCalculator6();
					}
					case 7: {
						return new EstGraCalculator7();
					}
					case 8: {
						return new EstGraCalculator8();
					}
					case 9: {
						return new EstGraCalculator9();
					}
					default:
						return new EstGraCalculator1();
				}
			};

			return service;
		}
	]);

})(angular);