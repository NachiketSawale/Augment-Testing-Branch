(function (angular) {
	'use strict';

	angular.module('estimate.main').factory('estimateMainSimpleAllowanceLineItemCalculationService', ['_', 'estimateMainGraCalculationService', 'estimateMainCompleteCalculationService',
		function (_, estimateMainGraCalculationService, estimateMainCompleteCalculationService) {
			function SimpleAllowanceCalculator(stdAllowanceCalcOption) {
				this.stdAllowanceCalcOption = stdAllowanceCalcOption;

				this.estGraCalculator = estimateMainGraCalculationService.createGraCalculator(this.stdAllowanceCalcOption.AllowanceEntity);

				this.assertParameterIsNull = function (lineItem, resource, markup2CostCodeEntity) {
					return !lineItem || !resource || !markup2CostCodeEntity;
				};

				this.isNotApplyAllowance = function (lineItem) {
					return lineItem.IsGc || lineItem.IsNoMarkup || estimateMainCompleteCalculationService.isOptionItemWithoutIT(lineItem);
				};

				this.assertMarkupItemsIsNullOrEmpty = function () {
					return !this.stdAllowanceCalcOption.AllowanceEntity || !_.isArray(this.stdAllowanceCalcOption.Markup2CostCodes);
				};

				this.getGCTotal = function () {
					return _.sumBy(this.stdAllowanceCalcOption.Markup2CostCodes, 'GcTotal');
				};

				this.getFactor = function () {
					let factor = 1;

					if (!_.isArray(this.stdAllowanceCalcOption.Markup2CostCodes)) {
						return factor;
					}

					let originalGraTotal = _.sumBy(this.stdAllowanceCalcOption.Markup2CostCodes, function (e) {
						return (e.DjcTotal + e.GcTotal) * e.GraPerc * 0.01;
					});

					let adjustedGraTotal = _.sumBy(this.stdAllowanceCalcOption.Markup2CostCodes, function (e) {
						return e.DjcTotal * (1 + e.FinMGc * 0.01) * e.GraPerc * 0.01;
					}) + this.stdAllowanceCalcOption.getAdvanceAll() * this.getAverageDJCgc();

					return adjustedGraTotal === 0 ? 1 : originalGraTotal / adjustedGraTotal;
				};

				this.getMPrecAdjusted = function () {
					if (!_.isArray(this.stdAllowanceCalcOption.Markup2CostCodes)) {
						return 1;
					}

					let otherFinMItem = _.find(this.stdAllowanceCalcOption.Markup2CostCodes, function (e) {
						return !_.isNumber(e.DefMPerc);
					});

					if (!otherFinMItem) {
						return this.stdAllowanceCalcOption.Markup2CostCodes[0].FinM;
					} else {
						return otherFinMItem.FinM;
					}
				};

				this.getAverageDJCgc = function () {
					let self = this;

					let averageDJCgc = 0;

					if (_.isArray(this.stdAllowanceCalcOption.Markup2CostCodes) && (this.getGCTotal() !== 0)) {
						_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item) {
							averageDJCgc += (item.GcTotal * self.estGraCalculator.generateFinMGra(item) / 100);
						});

						averageDJCgc = averageDJCgc / this.getGCTotal();
					}

					return averageDJCgc;
				};

				this.getAAGraPrec = function (lineItem) {
					// ignore this.stdAllowanceCalcOption.AllowanceEntity.IsOneStep
					if (!this.stdAllowanceCalcOption.AllowanceEntity || lineItem.AdvancedAll === 0 || !_.isArray(this.stdAllowanceCalcOption.Markup2CostCodes)) {
						return 0;
					}

					if (this.stdAllowanceCalcOption.AllowanceEntity.IsOneStep) {
						let garMarkupItem = _.find(this.stdAllowanceCalcOption.Markup2CostCodes, function (e) {
							return !_.isNumber(e.DefMPerc);
						});

						if (garMarkupItem) {
							return garMarkupItem.FinM * 0.01;
						} else {
							return this.stdAllowanceCalcOption.Markup2CostCodes[0].FinM * 0.01;
						}
					} else {
						/* simple allowance two step */
						if (_.some(this.stdAllowanceCalcOption.Markup2CostCodes, function (e) {
							return _.isNumber(e.DefMGraPerc);
						})) {
							let otherGraMarkupItem = _.find(this.stdAllowanceCalcOption.Markup2CostCodes, function (e) {
								return !_.isNumber(e.DefMGraPerc);
							});

							return otherGraMarkupItem ? otherGraMarkupItem.FinMGra * 0.01 : this.getAverageDJCgc() * this.getFactor();
						} else {
							if (_.uniqBy(this.stdAllowanceCalcOption.Markup2CostCodes, 'FinMGra').length === 1) {
								return this.stdAllowanceCalcOption.Markup2CostCodes[0].FinMGra * 0.01;
							} else {
								return this.getAverageDJCgc() * this.getFactor();
							}
						}
					}
				};

				this.calculateFm = function (lineItem, resources) {
					if (this.stdAllowanceCalcOption.AllowanceEntity.IsOneStep) {
						if (lineItem.IsGc) {
							return 0;
						}

						return _.sumBy(resources, function (e) {
							return e.Fm ? e.Fm : 0;
						}) + (lineItem.AdvancedAll !== 0 ? lineItem.AdvancedAll * this.getMPrecAdjusted() * 0.01 : 0);
					} else {
						return lineItem.Ga + lineItem.Am + lineItem.Rp;
					}
				};

				this.calculateAllowance = function (lineItem) {
					let gc = this.stdAllowanceCalcOption.AllowanceEntity.IsOneStep ? 0 : lineItem.Gc;

					return lineItem.IsGc ? -1 * lineItem.CostTotal : gc + lineItem.Fm + lineItem.AdvancedAll + lineItem.ManualMarkup;// + lineItem.URD;
				};

				this.calculateFmUnit = function (lineItem, resources) {
					if (this.stdAllowanceCalcOption.AllowanceEntity.IsOneStep) {
						if (lineItem.IsGc) {
							return 0;
						}

						return _.sumBy(resources || [], function (e) {
							return e.FmUnitLineItem ? e.FmUnitLineItem : 0;
						}) + (lineItem.AdvancedAllUnit !== 0 ? lineItem.AdvancedAllUnit * this.getMPrecAdjusted() * 0.01 : 0);
					} else {
						return lineItem.GaUnit + lineItem.AmUnit + lineItem.RpUnit;
					}
				};

				this.calculateAllowanceUnit = function (lineItem, resources) {
					let gc = this.stdAllowanceCalcOption.AllowanceEntity.IsOneStep ? 0 : lineItem.GcUnit;

					return lineItem.IsGc ? -1 * lineItem.CostUnit : gc + this.calculateFmUnit(lineItem, resources) + lineItem.AdvancedAllUnit + lineItem.ManualMarkupUnit;
				};

				this.calculateResourceFm = function (lineItem, resource, markup2CostCodeEntity) {
					let finM = lineItem.IsNoMarkup ? 0 : (estimateMainCompleteCalculationService.isOptionItemWithIT(lineItem) ? markup2CostCodeEntity.FinMOp : markup2CostCodeEntity.FinM);

					resource.Fm = resource.CostTotal * finM * 0.01;

					resource.FmUnitLineItem = resource.CostUnitLineItem * finM * 0.01;
				};

				this.calculate = function (lineItem, resource, markup2CostCodeEntity) {
					if (!this.stdAllowanceCalcOption.AllowanceEntity) {
						return;
					}

					let finGC = estimateMainCompleteCalculationService.isOptionItemWithIT(lineItem) ? markup2CostCodeEntity.FinMOp : markup2CostCodeEntity.FinMGc;

					resource.GcUnitLineItem = finGC * resource.CostUnitLineItem * 0.01;

					resource.Gc = this.isNotApplyAllowance(lineItem) ? 0 : finGC * resource.CostTotal * 0.01;

					resource.GarUnitLineItem = markup2CostCodeEntity.FinMGra * (resource.CostUnitLineItem + resource.GcUnitLineItem) * 0.01;

					resource.Gar = this.isNotApplyAllowance(lineItem) ? 0 : markup2CostCodeEntity.FinMGra * (resource.CostTotal + resource.Gc) * 0.01;

					if (this.stdAllowanceCalcOption.AllowanceEntity.IsOneStep) {
						this.calculateResourceFm(lineItem, resource, markup2CostCodeEntity);

						if (lineItem.IsGc || !markup2CostCodeEntity || !markup2CostCodeEntity.DjcTotal) {
							resource.GaUnitLineItem = resource.AmUnitLineItem = resource.RpUnitLineItem = 0;
							resource.Ga = resource.Am = resource.Rp = 0;
						} else {
							if (!markup2CostCodeEntity.GraPerc) {
								resource.RpUnitLineItem = resource.AmUnitLineItem = resource.GaUnitLineItem = 0;
								resource.Ga = resource.Am = resource.Rp = 0;
							} else {
								resource.GaUnitLineItem = (resource.CostUnitLineItem / markup2CostCodeEntity.DjcTotal) * markup2CostCodeEntity.GaValue;
								resource.AmUnitLineItem = (resource.CostUnitLineItem / markup2CostCodeEntity.DjcTotal) * markup2CostCodeEntity.AmValue;
								resource.RpUnitLineItem = (resource.CostUnitLineItem / markup2CostCodeEntity.DjcTotal) * markup2CostCodeEntity.RpValue;

								resource.Ga = this.isNotApplyAllowance(lineItem) ? 0 : (resource.CostTotal / markup2CostCodeEntity.DjcTotal) * markup2CostCodeEntity.GaValue;
								resource.Am = this.isNotApplyAllowance(lineItem) ? 0 : (resource.CostTotal / markup2CostCodeEntity.DjcTotal) * markup2CostCodeEntity.AmValue;
								resource.Rp = this.isNotApplyAllowance(lineItem) ? 0 : (resource.CostTotal / markup2CostCodeEntity.DjcTotal) * markup2CostCodeEntity.RpValue;
							}
						}

						resource.GcUnitLineItem = lineItem.IsGc || lineItem.IsNoMarkup ? 0 : resource.FmUnitLineItem - resource.GaUnitLineItem - resource.AmUnitLineItem - resource.RpUnitLineItem;

						resource.Gc = lineItem.IsGc || lineItem.IsNoMarkup ? 0 : resource.Fm - resource.Ga - resource.Am - resource.Rp;
					} else {
						if (this.assertMarkupItemsIsNullOrEmpty() || this.assertParameterIsNull(lineItem, resource, markup2CostCodeEntity) || !this.estGraCalculator) {
							return;
						}

						if (!markup2CostCodeEntity.GraPerc) {
							resource.GaUnitLineItem = resource.AmUnitLineItem = 0;
							resource.RpUnitLineItem = (resource.CostUnitLineItem + resource.GcUnitLineItem) * markup2CostCodeEntity.FinMGra * 0.01;

							resource.Ga = resource.Am = 0;
							resource.Rp = this.isNotApplyAllowance(lineItem) ? 0 : (resource.CostTotal + resource.Gc) * markup2CostCodeEntity.FinMGra * 0.01;
						} else {
							let resourceTJCUnitLineItem = (resource.CostUnitLineItem + resource.GcUnitLineItem) * markup2CostCodeEntity.FinMGra / markup2CostCodeEntity.GraPerc;
							resource.GaUnitLineItem = resourceTJCUnitLineItem * this.estGraCalculator.generateFinGa(markup2CostCodeEntity);
							resource.AmUnitLineItem = resourceTJCUnitLineItem * this.estGraCalculator.generateFinAm(markup2CostCodeEntity);
							resource.RpUnitLineItem = resourceTJCUnitLineItem * this.estGraCalculator.generateFinRp(markup2CostCodeEntity);

							let resourceTJCValue = (resource.CostTotal + resource.Gc) * markup2CostCodeEntity.FinMGra / markup2CostCodeEntity.GraPerc;
							resource.Ga = this.isNotApplyAllowance(lineItem) ? 0 : resourceTJCValue * this.estGraCalculator.generateFinGa(markup2CostCodeEntity);
							resource.Am = this.isNotApplyAllowance(lineItem) ? 0 : resourceTJCValue * this.estGraCalculator.generateFinAm(markup2CostCodeEntity);
							resource.Rp = this.isNotApplyAllowance(lineItem) ? 0 : resourceTJCValue * this.estGraCalculator.generateFinRp(markup2CostCodeEntity);
						}

						this.calculateResourceFm(lineItem, resource, markup2CostCodeEntity);
					}
				};
			}

			let service = {};

			service.createAllowanceCalculator = function (stdAllowanceCalcOption) {
				return new SimpleAllowanceCalculator(stdAllowanceCalcOption || {});
			};

			return service;
		}]);
})(angular);