(function (angular) {
	'use strict';

	angular.module('estimate.main').factory('estimateMainEstimateByMarkupLineItemCalculationService', ['_', 'estimateMainGraCalculationService', 'estimateMainCompleteCalculationService',
		function (_, estimateMainGraCalculationService, estimateMainCompleteCalculationService) {
			function EstimateByMarkupCalculator(stdAllowanceCalcOption) {
				this.stdAllowanceCalcOption = stdAllowanceCalcOption || {};

				this.estGraCalculator = estimateMainGraCalculationService.createGraCalculator(this.stdAllowanceCalcOption.AllowanceEntity);

				this.assertParamerIsNull = function (lineItem, resource, markup2CostCodeEntity) {
					return !lineItem || !resource || !markup2CostCodeEntity;
				};

				this.isNotApplyAllowance = function (lineItem) {
					return lineItem.IsGc || lineItem.IsNoMarkup || estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem);
				};

				this.getAAGraPrec = function (lineItem) {
					if (!this.stdAllowanceCalcOption.AllowanceEntity || this.stdAllowanceCalcOption.AllowanceEntity.IsOneStep || lineItem.AdvancedAll === 0 || _.isArray(this.stdAllowanceCalcOption.Markup2CostCodes)) {
						return 0;
					}

					/* markup two step */
					if (!_.some(this.stdAllowanceCalcOption.Markup2CostCodes, function (e) {
						return _.isNumber(e.DefMGcPerc);
					})) {
						return 0;
					}

					let graTotal = 0;

					let gcTotal = 0;

					_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item) {
						if (_.isNumber(item.DefMGcPerc)) {
							let gc = item.DefMGcPerc * item.DjcTotal * 0.01;

							graTotal += (gc * item.FinMGra * 0.01);

							gcTotal += gc;
						}
					});

					return gcTotal === 0 ? 0 : graTotal / gcTotal;
				};

				this.calculateFm = function (lineItem) {
					return lineItem.Ga + lineItem.Am + lineItem.Rp;
				};

				this.calculateAllowance = function (lineItem) {
					return lineItem.IsGc ? -1 * lineItem.CostTotal : lineItem.Gc + lineItem.Fm + lineItem.AdvancedAll + lineItem.ManualMarkup;// + lineItem.URD;
				};

				this.calculateFmUnit = function (lineItem) {
					return lineItem.GaUnit + lineItem.AmUnit + lineItem.RpUnit;
				};

				this.calculateAllowanceUnit = function (lineItem, resources) {
					return lineItem.IsGc ? -1 * lineItem.CostUnit : lineItem.GcUnit + this.calculateFmUnit(lineItem, resources) + lineItem.AdvancedAllUnit + lineItem.ManualMarkupUnit;
				};

				this.calculate = function (lineItem, resource, markup2CostCodeEntity) {
					if (!this.stdAllowanceCalcOption.AllowanceEntity || this.assertParamerIsNull(lineItem, resource, markup2CostCodeEntity)) {
						return;
					}

					let finGC = estimateMainCompleteCalculationService.isOptionItemWithIT(lineItem) && !this.stdAllowanceCalcOption.AllowanceEntity.IsOneStep ? markup2CostCodeEntity.FinMOp : markup2CostCodeEntity.FinMGc;

					resource.GcUnitLineItem = finGC * resource.CostUnitLineItem * 0.01;

					resource.Gc = this.isNotApplyAllowance(lineItem) ? 0 : finGC * resource.CostTotal * 0.01;

					resource.GarUnitLineItem = markup2CostCodeEntity.FinMGra * (resource.CostUnitLineItem + resource.GcUnitLineItem) * 0.01;

					resource.Gar = this.isNotApplyAllowance(lineItem) ? 0 : markup2CostCodeEntity.FinMGra * (resource.CostTotal + resource.Gc) * 0.01;

					if (markup2CostCodeEntity.GraPerc === 0 || lineItem.IsGc) {
						resource.FmUnitLineItem = resource.GaUnitLineItem = resource.AmUnitLineItem = resource.RpUnitLineItem = 0;
						resource.Fm = resource.Ga = resource.Am = resource.Rp = 0;
					} else {
						let finM = this.calculateFinM(lineItem, resource, markup2CostCodeEntity);

						resource.FmUnitLineItem = (resource.CostUnitLineItem * finM * 0.01) - resource.GcUnitLineItem;
						resource.GaUnitLineItem = resource.FmUnitLineItem * this.estGraCalculator.generateFinGa(markup2CostCodeEntity) / markup2CostCodeEntity.GraPerc * 100;
						resource.AmUnitLineItem = resource.FmUnitLineItem * this.estGraCalculator.generateFinAm(markup2CostCodeEntity) / markup2CostCodeEntity.GraPerc * 100;
						resource.RpUnitLineItem = resource.FmUnitLineItem * this.estGraCalculator.generateFinRp(markup2CostCodeEntity) / markup2CostCodeEntity.GraPerc * 100;

						resource.Fm = this.isNotApplyAllowance(lineItem) ? 0 : (resource.CostTotal * finM * 0.01) - resource.Gc;
						resource.Ga = this.isNotApplyAllowance(lineItem) ? 0 : resource.Fm * this.estGraCalculator.generateFinGa(markup2CostCodeEntity) / markup2CostCodeEntity.GraPerc * 100;
						resource.Am = this.isNotApplyAllowance(lineItem) ? 0 : resource.Fm * this.estGraCalculator.generateFinAm(markup2CostCodeEntity) / markup2CostCodeEntity.GraPerc * 100;
						resource.Rp = this.isNotApplyAllowance(lineItem) ? 0 : resource.Fm * this.estGraCalculator.generateFinRp(markup2CostCodeEntity) / markup2CostCodeEntity.GraPerc * 100;
					}
				};

				this.calculateFinM = function (lineItem, resource, markup2CostCodeEntity) {
					if (estimateMainCompleteCalculationService.isOptionItemWithIT(lineItem)) {
						if (this.stdAllowanceCalcOption.AllowanceEntity.IsOneStep) {
							return markup2CostCodeEntity.FinMOp;
						} else {
							if (this.stdAllowanceCalcOption.AllowanceEntity.IsBalanceFp) {
								return markup2CostCodeEntity.FinMOp + markup2CostCodeEntity.FinM + markup2CostCodeEntity.FinMOp * markup2CostCodeEntity.FinM * 0.01;
							} else {
								return markup2CostCodeEntity.FinMOp + markup2CostCodeEntity.GraPerc + markup2CostCodeEntity.FinMOp * markup2CostCodeEntity.GraPerc * 0.01;
							}

						}
					} else {
						return markup2CostCodeEntity.FinM;
					}
				};
			}

			let service = {};

			service.createAllowanceCalculator = function(stdAllowanceCalcOption){
				return new EstimateByMarkupCalculator(stdAllowanceCalcOption);
			};

			return service;
		}]);
})(angular);