(function (angular) {
	'use strict';

	angular.module('estimate.main').factory('estimateMainSimpleAllowanceCalculationService', ['_', 'estimateMainGraCalculationService',
		function (_, estimateMainGraCalculationService) {

			function SimpleAllowanceDCMCalculator(stdAllowanceCalcOption) {
				this.stdAllowanceCalcOption = stdAllowanceCalcOption;

				this.estGraCalculator = estimateMainGraCalculationService.createGraCalculator(this.stdAllowanceCalcOption.AllowanceEntity);

				this.assertMarkupItemsIsNullOrEmpty = function () {
					return !this.stdAllowanceCalcOption || !this.stdAllowanceCalcOption.AllowanceEntity || !_.isArray(this.stdAllowanceCalcOption.Markup2CostCodes);
				};

				this.getGCTotal = function () {
					return _.sumBy(this.stdAllowanceCalcOption.Markup2CostCodes, 'GcTotal');
				};

				this.getDJCTotal = function () {
					return _.sumBy(this.stdAllowanceCalcOption.Markup2CostCodes, 'DjcTotal');
				};

				this.getGCRemain = function () {
					return this.getGCTotal() - this.stdAllowanceCalcOption.getAdvanceAll();
				};

				this.calculateGcValue = function (item) {
					/* formula: M(GC)%_SELF * DJC_SELF = Total(GC)_SELF */
					return item.FinMGc * item.DjcTotal * 0.01;
				};

				this.calculateFinGaAmRp = function () {
					let self = this;

					if (_.isArray(this.stdAllowanceCalcOption.Markup2CostCodes)){
						_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function(item){
							item.GaPercConverted = item.GaPerc * 0.01;
							item.RpPercConverted = item.RpPerc * 0.01;
							item.AmPercConverted = item.AmPerc * 0.01;
						});
					}

					if (_.isArray(this.stdAllowanceCalcOption.Markup2CostCodes) && this.estGraCalculator) {
						_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item) {
							item.FinGa = self.estGraCalculator.generateFinGa(item) * 100;

							item.FinAm = self.estGraCalculator.generateFinAm(item) * 100;

							item.FinRp = self.estGraCalculator.generateFinRp(item) * 100;
						});
					}
				};

				this.calculateMarkupItems = function () {
					if (this.assertMarkupItemsIsNullOrEmpty()) {
						return;
					}

					if (this.getGCTotal() === 0 || this.getDJCTotal() === 0) {
						/* clear */
						_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item) {
							item.FinMGc = 0;
							item.FinMGra = 0;
							item.FinM = 0;
							item.FinMOp = 0;
						});
					}

					this.calculateFinGaAmRp();

					this.calculateMarkupItemsInternal();
				};

				this.calculateFinMOpInOneStep = function () {
					_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item) {
						item.FinMOp = item.DefMOp ? item.DefMOp : item.FinM;
					});
				};

				this.calculateFinMOpInTwoStep = function () {
					_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item) {
						item.FinMOp = item.DefMOp ? item.DefMOp : item.FinMGc;
					});
				};

				this.calculateValueOfMarkup2CostCode = function (markup2CostCodeEntity, tJCOfMarkupItem) {
					if (!this.stdAllowanceCalcOption.AllowanceEntity || !this.estGraCalculator) {
						return;
					}

					markup2CostCodeEntity.GaValue = tJCOfMarkupItem * this.estGraCalculator.generateFinGa(markup2CostCodeEntity);

					markup2CostCodeEntity.AmValue = tJCOfMarkupItem * this.estGraCalculator.generateFinAm(markup2CostCodeEntity);

					markup2CostCodeEntity.RpValue = tJCOfMarkupItem * this.estGraCalculator.generateFinRp(markup2CostCodeEntity);
				};

				this.calculateAllowanceOfLineItem = function (lineItem) {
					return (lineItem.GrandCostUnit - lineItem.CostUnit - lineItem.MarkupCostUnit - (lineItem.EscalationCostUnit ? lineItem.EscalationCostUnit : 0) - (lineItem.RiskCostUnit ? lineItem.RiskCostUnit : 0)) * lineItem.QuantityTotal;
				};

				this.calculateMarkupItemsInternal = function () {
					let self = this;

					if (this.assertMarkupItemsIsNullOrEmpty()) {
						return;
					}

					if (this.stdAllowanceCalcOption.AllowanceEntity.IsOneStep) {
						this.calculateFinMGcInOneStep();

						this.generateGraPerc();

						this.calculateFinMInOneStep();

						this.calculateFinMOpInOneStep();
					} else {
						this.calculateFinMGcInTwoStep();

						this.generateGraPerc();

						this.calculateFinGraInTwoStep();

						this.calculateFinMInTwoStep();

						this.calculateFinMOpInTwoStep();
					}

					_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item) {
						if (self.stdAllowanceCalcOption.AllowanceEntity.IsOneStep) {
							self.calculateValueOfMarkup2CostCode(item, item.DjcTotal + item.GcTotal);

							item.FmValue = item.DjcTotal * item.FinM * 0.01;

							item.AllowanceValue = item.FmValue;

							item.GcValue = item.FmValue - item.GaValue - item.AmValue - item.RpValue;
						} else {
							item.GcValue = self.calculateGcValue(item);

							let convertFactor = item.GraPerc === 0 ? 1 : item.FinMGra / item.GraPerc;

							self.calculateValueOfMarkup2CostCode(item, (item.DjcTotal + item.GcValue) * convertFactor);

							item.FmValue = item.GaValue + item.AmValue + item.RpValue;

							item.AllowanceValue = item.FmValue + item.GcValue;
						}
					});
				};

				this.generateGraPerc = function () {
					let self = this;

					let items = this.stdAllowanceCalcOption.Markup2CostCodes;

					if (!_.isArray(items) || !this.estGraCalculator) {
						return;
					}

					_.forEach(items, function (item) {
						item.GraPerc = self.estGraCalculator.generateFinMGra(item);

						item.FinMGra = item.GraPerc;
					});
				};

				this.calculateFinMGcInOneStep = function () {
					let djcTotal = this.getDJCTotal();

					let defMGcPerc = djcTotal === 0 ? 0 : this.getGCRemain() / djcTotal * 100;

					_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item) {
						item.FinMGc = defMGcPerc;
					});
				};

				this.calculateFinMGcInTwoStep = function () {
					let defMGCPrecItems = _.filter(this.stdAllowanceCalcOption.Markup2CostCodes, function (e) {
						return _.isNumber(e.DefMGcPerc);
					});

					let gcRemain = this.getGCRemain() - _.sumBy(defMGCPrecItems, function (e) {
						return e.DefMGcPerc * e.DjcTotal * 0.01;
					});

					let djcRemain = this.getDJCTotal() - _.sumBy(defMGCPrecItems, 'DjcTotal');

					let finMGc = djcRemain === 0 ? 0 : gcRemain / djcRemain * 100;

					_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item) {
						item.FinMGc = item.DefMGcPerc ? item.DefMGcPerc : finMGc;
					});
				};

				this.calculateFinMInOneStep = function () {
					let self = this;

					if (!this.stdAllowanceCalcOption.FixedLineItems) {
						return;
					}

					let remainingDjc = this.getDJCTotal();

					let remainingAllowance = _.sumBy(this.stdAllowanceCalcOption.Markup2CostCodes, function (item) {
						return item.GraPerc * (item.DjcTotal + item.GcTotal) * 0.01 + item.GcTotal;
					});

					/* fixed price, must calculate FinMGc first */
					if (this.stdAllowanceCalcOption.AllowanceEntity.IsBalanceFp && _.isArray(this.stdAllowanceCalcOption.FixedLineItems)) {
						_.forEach(this.stdAllowanceCalcOption.FixedLineItems, function (item) {
							remainingDjc -= (item.CostTotal + item.MarkupCostTotal);

							remainingAllowance -= self.calculateAllowanceOfLineItem(item);
						});
					}

					/* advanced allowance(AA), igonre the IsFixedPrice LineItem */
					if (_.isArray(this.stdAllowanceCalcOption.LineItemsWithAA)) {
						_.forEach(this.stdAllowanceCalcOption.LineItemsWithAA, function (item) {
							/* consider AQ/WQ */
							let activeQuantityTarget = self.stdAllowanceCalcOption.AllowanceEntity.QuantityTypeFk === 3 ? item.WqQuantityTarget : item.QuantityTarget;

							let advanceAll = item.AdvancedAllUnitItem * activeQuantityTarget;

							if (self.stdAllowanceCalcOption.AllowanceEntity.IsBalanceFp && item.IsFixedPrice) {
								advanceAll = 0;
							}

							remainingAllowance -= advanceAll;

							remainingDjc += advanceAll;
						});
					}

					/* Def M */
					let defMItems = _.filter(this.stdAllowanceCalcOption.Markup2CostCodes, function (e) {
						return _.isNumber(e.DefMPerc);
					});

					if (_.isArray(defMItems)) {
						_.forEach(defMItems, function (item) {
							item.FinM = item.DefMPerc;

							let currentAllowance = item.DjcTotal * item.FinM * 0.01;

							let currentDjc = item.DjcTotal;

							if (self.stdAllowanceCalcOption.AllowanceEntity.IsBalanceFp && item.FixedPriceDjcTotal !== 0) {
								currentAllowance -= (item.FixedPriceDjcTotal * item.FinM * 0.01);

								currentDjc -= item.FixedPriceDjcTotal;
							}

							remainingAllowance -= currentAllowance;

							remainingDjc -= currentDjc;
						});

						let remainingFinM = remainingDjc === 0 ? 0 : remainingAllowance / remainingDjc * 100;

						_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item) {
							item.FinM = item.DefMPerc ? item.DefMPerc : remainingFinM;
						});
					} else {
						let remainingFinM = remainingDjc === 0 ? 0 : remainingAllowance / remainingDjc * 100;

						_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item) {
							item.FinM = remainingFinM;
						});
					}
				};

				this.calculateFinGraInTwoStep = function () {
					let self = this;

					if (!_.isArray(this.stdAllowanceCalcOption.FixedLineItems)) {
						return;
					}

					let remainingDjc = this.getDJCTotal();

					let remainGC = this.getGCTotal();

					let remainingFM = _.sumBy(this.stdAllowanceCalcOption.Markup2CostCodes, function (item) {
						return item.GraPerc * (item.DjcTotal + item.GcTotal) * 0.01;
					});

					/* fixed price, must calculate FinMGc first */
					if (this.stdAllowanceCalcOption.AllowanceEntity.IsBalanceFp && _.isArray(this.stdAllowanceCalcOption.FixedLineItems)) {
						_.forEach(this.stdAllowanceCalcOption.FixedLineItems, function (item) {

							remainingDjc -= (item.CostTotal + item.MarkupCostTotal);

							/* consider AQ/WQ */
							let activeQuantityTarget = self.stdAllowanceCalcOption.AllowanceEntity.QuantityTypeFk === 3 ? item.WqQuantityTarget : item.QuantityTarget;

							let fixedPriceAA = item.AdvancedAllUnitItem * activeQuantityTarget;

							let actualFm = self.calculateAllowanceOfLineItem(item) - fixedPriceAA;

							remainingFM -= actualFm;

							remainGC -= fixedPriceAA;
						});

						_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item){
							let actualGc = (item.FixedPriceDjcTotal * item.FinMGc * 0.01);

							remainGC -= actualGc;

							remainingFM += actualGc;
						});
					}

					/* Def M */
					let defMGRAItems = _.filter(this.stdAllowanceCalcOption.Markup2CostCodes, function (e) {
						return _.isNumber(e.DefMGraPerc);
					});

					if (_.isArray(defMGRAItems)) {
						_.forEach(defMGRAItems, function (item) {
							let actualDjc = self.stdAllowanceCalcOption.AllowanceEntity.IsBalanceFp ? item.DjcTotal - item.FixedPriceDjcTotal : item.DjcTotal;

							let actualFm = item.DefMGraPerc * actualDjc * (1 + item.FinMGc * 0.01) * 0.01;

							remainingFM -= actualFm;

							remainingDjc -= actualDjc;

							remainGC -= (actualDjc * item.FinMGc * 0.01);
						});

						let finGra = (remainingDjc + remainGC) === 0 ? 0 : remainingFM / (remainingDjc + remainGC);

						_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item) {
							item.FinMGra = item.DefMGraPerc ? item.DefMGraPerc : finGra * 100;
						});
					} else {
						if (this.stdAllowanceCalcOption.AllowanceEntity.IsBalanceFp) {
							let finGra = (remainingDjc + remainGC) === 0 ? 0 : remainingFM / (remainingDjc + remainGC);

							_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item) {
								item.FinMGra = finGra * 100;
							});
						} else {
							let factor = this.calculateGraConvertFactor();

							_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item) {
								item.FinMGra = item.GraPerc * factor;
							});
						}
					}
				};

				this.calculateFinMInTwoStep = function () {
					_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item) {
						item.FinM = item.FinMGc + item.FinMGra + item.FinMGc * item.FinMGra * 0.01;
					});
				};

				this.calculateGraConvertFactor = function () {
					let factor = 1;

					if (!_.isArray(this.stdAllowanceCalcOption.Markup2CostCodes)) {
						return factor;
					}

					let graPrecItems = _.uniqBy(_.filter(this.stdAllowanceCalcOption.Markup2CostCodes, function (e) {
						return e.GraPerc !== 0;
					}), 'GraPerc');

					if (graPrecItems.length > 1) {
						let originalGraTotal = _.sumBy(this.stdAllowanceCalcOption.Markup2CostCodes, function (e) {
							return (e.DjcTotal + e.GcTotal) * e.GraPerc * 0.01;
						});

						let adjustedGraTotal = _.sumBy(this.stdAllowanceCalcOption.Markup2CostCodes, function (e) {
							return e.DjcTotal * (1 + e.FinMGc * 0.01) * e.GraPerc * 0.01;
						}) + this.stdAllowanceCalcOption.getAdvanceAll() * this.calculateAverageDJCgcCore();

						factor = adjustedGraTotal === 0 ? 1 : originalGraTotal / adjustedGraTotal;
					}

					return factor;
				};

				this.calculateAverageDJCgcCore = function () {
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
			}

			let service = {};

			service.calculateMarkup = function (stdAllowanceCalcOption) {
				new SimpleAllowanceDCMCalculator(stdAllowanceCalcOption).calculateMarkupItems();
			};

			return service;
		}]);
})(angular);