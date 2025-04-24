(function(angular){
	'use strict';

	angular.module('estimate.main').factory('estimateMainEstimateByMarkupCalculationService', ['_', 'estimateMainGraCalculationService',
		function(_, estimateMainGraCalculationService){

			function EstimateByMarkupDCMCalculator(stdAllowanceCalcOption)
			{
				this.stdAllowanceCalcOption = stdAllowanceCalcOption;

				this.estGraCalculator = estimateMainGraCalculationService.createGraCalculator(this.stdAllowanceCalcOption.AllowanceEntity);

				this.assertMarkupItemsIsNullOrEmpty = function()
				{
					return !this.stdAllowanceCalcOption || !this.stdAllowanceCalcOption.AllowanceEntity || !_.isArray(this.stdAllowanceCalcOption.Markup2CostCodes);
				};

				this.getGCTotal = function (){
					return _.sumBy(this.stdAllowanceCalcOption.Markup2CostCodes, 'GcTotal');
				};

				this.getDJCTotal = function(){
					return _.sumBy(this.stdAllowanceCalcOption.Markup2CostCodes, 'DjcTotal');
				};

				this.calculateGcValue = function(item)
				{
					/* formula: M(GC)%_SELF * DJC_SELF = Total(GC)_SELF */
					return item.FinMGc * item.DjcTotal * 0.01;
				};

				this.calculateValueOfMarkup2CostCode = function(markup2CostCodeEntity, tJCOfMarkupItem)
				{
					if (!this.stdAllowanceCalcOption.AllowanceEntity || !this.estGraCalculator)
					{
						return;
					}

					markup2CostCodeEntity.GaValue = tJCOfMarkupItem * this.estGraCalculator.generateFinGa(markup2CostCodeEntity);

					markup2CostCodeEntity.AmValue = tJCOfMarkupItem * this.estGraCalculator.generateFinAm(markup2CostCodeEntity);

					markup2CostCodeEntity.RpValue = tJCOfMarkupItem * this.estGraCalculator.generateFinRp(markup2CostCodeEntity);
				};

				this.calculateAllowanceOfLineItem = function (lineItem)
				{
					return (lineItem.GrandCostUnit - lineItem.CostUnit - lineItem.MarkupCostUnit - (lineItem.EscalationCostUnit ? lineItem.EscalationCostUnit : 0) - (lineItem.RiskCostUnit ? lineItem.RiskCostUnit : 0)) * lineItem.QuantityTotal;
				};

				this.calculateFinGaAmRp = function()
				{
					let self = this;

					if(_.isArray(this.stdAllowanceCalcOption.Markup2CostCodes) && this.estGraCalculator)
					{
						_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item){
							item.FinGa = self.estGraCalculator.generateFinGa(item) * 100;

							item.FinAm = self.estGraCalculator.generateFinAm(item) * 100;

							item.FinRp = self.estGraCalculator.generateFinRp(item) * 100;
						});
					}
				};

				this.calculateMarkupItems = function()
				{
					if (this.assertMarkupItemsIsNullOrEmpty())
					{
						return;
					}

					if (_.isArray(this.stdAllowanceCalcOption.Markup2CostCodes)){
						_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function(item){
							item.GaPercConverted = item.GaPerc * 0.01;
							item.RpPercConverted = item.RpPerc * 0.01;
							item.AmPercConverted = item.AmPerc * 0.01;
						});
					}

					if (this.getGCTotal() === 0 || this.getDJCTotal() === 0)
					{
						/* clear */
						_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function(item){
							item.FinMGc = 0;
							item.FinMGra = 0;
							item.FinM = 0;
							item.FinMOp = 0;
						});
					}

					this.calculateFinGaAmRp();

					this.calculateMarkupItemsInternal();
				};

				this.calculateFinMOpInOneStep = function()
				{
					_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function(item){
						item.FinMOp = item.DefMOp ? item.DefMOp : item.FinM;
					});
				};

				this.calculateFinMOpInTwoStep = function()
				{
					_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function(item){
						item.FinMOp = item.DefMOp ? item.DefMOp : item.FinMGc;
					});
				};

				this.getAllowanceFactorForOneStep = function()
				{
					let self = this;

					let originalAllowance = _.sumBy(this.stdAllowanceCalcOption.Markup2CostCodes, function(e){
						return e.DjcTotal * e.GraPerc * 0.01 + e.DjcTotal * e.FinMGc * 0.01;
					});

					let remainingAllowance = originalAllowance;

					if (_.isArray(this.stdAllowanceCalcOption.LineItemsWithAA))
					{
						_.forEach(this.stdAllowanceCalcOption.LineItemsWithAA, function(item){
							/* consider AQ/WQ */
							let activeQuantityTarget = self.stdAllowanceCalcOption.AllowanceEntity.QuantityTypeFk === 3 ? item.WqQuantityTarget : item.QuantityTarget;

							let advanceAll = item.AdvancedAllUnitItem * activeQuantityTarget;

							if (item.IsFixedPrice && self.stdAllowanceCalcOption.AllowanceEntity.IsBalanceFp)
							{
								advanceAll = 0;
							}

							remainingAllowance -= advanceAll;
						});
					}

					if (this.stdAllowanceCalcOption.AllowanceEntity.IsBalanceFp && _.isArray(this.stdAllowanceCalcOption.FixedLineItems))
					{
						let fixedPriceAllowance = _.sumBy(this.stdAllowanceCalcOption.FixedLineItems, function(e){
							return self.calculateAllowanceOfLineItem(e);
						});

						remainingAllowance -= fixedPriceAllowance;
					}

					let newAllowance = originalAllowance;

					/* fixed price */
					if (this.stdAllowanceCalcOption.AllowanceEntity.IsBalanceFp)
					{
						_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function(markupItem){
							newAllowance -= (markupItem.FixedPriceDjcTotal * markupItem.FinMGra * 0.01);
							if (markupItem.DefMGcPerc)
							{
								newAllowance -= (markupItem.DefMGcPerc * markupItem.FixedPriceDjcTotal * 0.01);
							}
						});
					}

					return newAllowance === 0 ? 1 : remainingAllowance / newAllowance;
				};

				this.calculateMarkupItemsInternal = function()
				{
					let self = this;

					if (this.assertMarkupItemsIsNullOrEmpty())
					{
						return;
					}

					if (this.stdAllowanceCalcOption.AllowanceEntity.IsOneStep)
					{
						this.calculateInOneStep();

						this.calculateFinMOpInOneStep();
					}
					else
					{
						this.calculateInTwoStep();

						this.calculateFinMOpInTwoStep();
					}

					_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function(item){
						item.GcValue = self.calculateGcValue(item);

						self.calculateValueOfMarkup2CostCode(item, self.stdAllowanceCalcOption.AllowanceEntity.IsOneStep ? item.DjcTotal : (item.DjcTotal + item.GcValue));

						item.FmValue = item.GaValue + item.AmValue + item.RpValue;

						item.AllowanceValue = item.FmValue + item.GcValue;
					});
				};

				this.calculateInOneStep = function()
				{
					let self = this;

					_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function(item){
						item.GraPerc = self.estGraCalculator.generateFinMGra(item);

						item.FinMGra = item.GraPerc;

						item.FinMGc = item.DefMGcPerc ? item.DefMGcPerc : 0;
					});

					let factor = this.getAllowanceFactorForOneStep();

					_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function(item){
						item.FinM = (item.FinMGra + item.FinMGc) * factor;
					});
				};

				this.calculateInTwoStep = function()
				{
					let self = this;

					_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function(item){
						item.GraPerc = self.estGraCalculator.generateFinMGra(item);

						item.FinMGra = item.GraPerc;

						item.FinMGc = item.DefMGcPerc ? item.DefMGcPerc : 0;
					});

					let factor = this.stdAllowanceCalcOption.AllowanceEntity.IsBalanceFp ? this.getAllowanceFactorForTwoStep() : 1;

					_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function(item){
						let activeGcPrec = item.DefMGcPerc ? item.DefMGcPerc : 0;

						item.FinMGra = item.FinMGra * factor;

						item.FinM = activeGcPrec + item.FinMGra + activeGcPrec * item.FinMGra * 0.01;
					});
				};

				this.getAllowanceFactorForTwoStep = function()
				{
					let self = this;

					_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function(item){
						item.FixedPriceDjcTotal = 0;
					});

					let originalAllowance = 0;

					_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item){
						if (item.DefMGcPerc)
						{
							let originalFinM = item.DefMGcPerc * 0.01 + item.GraPerc * 0.01 + item.DefMGcPerc * item.GraPerc * 0.01 * 0.01;

							originalAllowance += (originalFinM * item.DjcTotal);
						}
						else
						{
							originalAllowance += (item.DjcTotal * item.GraPerc * 0.01);
						}
					});

					let averageAAGraValue = this.getAverageAAGraPrec() * this.stdAllowanceCalcOption.getAdvanceAll();

					originalAllowance += (averageAAGraValue + this.stdAllowanceCalcOption.getAdvanceAll());

					let newFM = 0;

					let remainingFm = originalAllowance - _.sumBy(this.stdAllowanceCalcOption.FixedLineItems, function(e){
						return self.calculateAllowanceOfLineItem(e);
					});

					if (_.isArray(this.stdAllowanceCalcOption.Markup2CostCodes))
					{
						_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function (item){
							let activeDjcTotal = item.DjcTotal - item.FixedPriceDjcTotal;

							let activeGc = activeDjcTotal * (item.DefMGcPerc ? item.DefMGcPerc : 0) * 0.01;

							let fm = (activeDjcTotal + activeGc) * item.GraPerc * 0.01;

							newFM += fm;

							remainingFm -= activeGc;
						});
					}

					if (this.stdAllowanceCalcOption.LineItemsWithAA)
					{
						_.forEach(this.stdAllowanceCalcOption.LineItemsWithAA, function(item){
							if (!item.IsFixedPrice)
							{
								let activeQuantityTarget = self.stdAllowanceCalcOption.AllowanceEntity.QuantityTypeFk === 3 ? item.WqQuantityTarget : item.QuantityTarget;

								let advanceAll = item.AdvancedAllUnitItem * activeQuantityTarget;

								remainingFm -= advanceAll;

								newFM += (self.getAverageAAGraPrec() * advanceAll);
							}
						});
					}

					return newFM === 0 ? 1 : remainingFm / newFM;
				};

				this.getAverageAAGraPrec = function()
				{
					if (!this.stdAllowanceCalcOption.AllowanceEntity || !this.stdAllowanceCalcOption.Markup2CostCodes)
					{
						return 0;
					}

					/* markup two step */
					if (!_.some(this.stdAllowanceCalcOption.Markup2CostCodes, function(e){
						return _.isNumber(e.DefMGcPerc);
					}))
					{
						return 0;
					}

					let graTotal = 0;

					let gcTotal = 0;

					_.forEach(this.stdAllowanceCalcOption.Markup2CostCodes, function(item){
						if (item.DefMGcPerc)
						{
							let gc = item.DefMGcPerc.Value * item.DjcTotal * 0.01;

							graTotal += (gc * item.GraPerc * 0.01);

							gcTotal += gc;
						}
					});

					return gcTotal === 0 ? 0 : graTotal / gcTotal;
				};
			}

			let  service = {};

			service.calculateMarkup = function(stdAllowanceCalcOption){
				new EstimateByMarkupDCMCalculator(stdAllowanceCalcOption).calculateMarkupItems();
			};

			return service;
		}]);
})(angular);