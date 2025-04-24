(function() {
	'use strict';
	/* global _, math */

	var moduleName = 'procurement.common';
	angular.module(moduleName).service('overDiscountValidationService', [
		'$translate',
		'platformContextService',
		'basicsLookupdataLookupDescriptorService',
		'prcCommonCalculationHelper',
		'platformRuntimeDataService',
		'platformDataValidationService',
		'procurementContextService',
		'platformModuleStateService',
		'procurementModuleName',
		'prcGetIsCalculateOverGrossService',
		function (
			$translate,
			platformContextService,
			lookupDescriptorService,
			prcCommonCalculationHelper,
			platformRuntimeDataService,
			platformDataValidationService,
			procurementContextService,
			platformModuleStateService,
			procurementModuleName,
			prcGetIsCalculateOverGrossService
		) {
			var self = this;

			self.validateOverallDiscount = function (entity, value, model, service, dataService, totalService) {
				var validateResult = {
					apply: true,
					valid: true
				};
				if (value === null || value === undefined) {
					return true;
				}
				else if (value === 0) {
					entity.OverallDiscountOc = 0;
					entity.OverallDiscountPercent = 0;
				}
				else {
					var isDirectiveFromItemAndBoq = ifGetNetTotalFromItemsAndBoqs(dataService);
					var netTotalNoDiscountSplitItem = totalService.getNetTotalNoDiscountSplitItem(isDirectiveFromItemAndBoq);
					var isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					var sumTotalNoDiscoutSplit = isOverGross ? netTotalNoDiscountSplitItem.Gross : netTotalNoDiscountSplitItem.ValueNet;
					if (value > sumTotalNoDiscoutSplit) {
						validateResult.apply = true;
						validateResult.valid = false;
						validateResult.error = $translate.instant('procurement.common.NotMoreThanNetTotalNoDiscount');
						platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
						platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
						return validateResult;
					}
					if (value || value === 0) {
						entity.OverallDiscountOc = prcCommonCalculationHelper.round(math.bignumber(value).mul(entity.ExchangeRate));
					}
					if (sumTotalNoDiscoutSplit === 0) {
						entity.OverallDiscountPercent = 0;
					}
					else {
						entity.OverallDiscountPercent = prcCommonCalculationHelper.round(math.bignumber(value).div(sumTotalNoDiscoutSplit).mul(100));
					}
				}
				platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
				platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
				platformRuntimeDataService.applyValidationResult(true, entity, 'OverallDiscountOc');
				platformDataValidationService.finishValidation(true, entity, entity.OverallDiscountOc, 'OverallDiscountOc', service, dataService);
				platformRuntimeDataService.applyValidationResult(true, entity, 'OverallDiscountPercent');
				platformDataValidationService.finishValidation(true, entity, entity.OverallDiscountPercent, 'OverallDiscountPercent', service, dataService);
				return validateResult;
			};
			self.validateOverallDiscountOc = function (entity, value, model, service, dataService, totalService) {
				var validateResult = {
					apply: true,
					valid: true
				};
				if(value === null || value === undefined) {
					return true;
				}
				else if (value === 0) {
					entity.OverallDiscount = 0;
					entity.OverallDiscountPercent = 0;
				}
				else {
					var isDirectiveFromItemAndBoq = ifGetNetTotalFromItemsAndBoqs(dataService);
					var netTotalNoDiscountSplitItem = totalService.getNetTotalNoDiscountSplitItem(isDirectiveFromItemAndBoq);
					var isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					var sumTotalNoDiscoutSplitOc = isOverGross ? netTotalNoDiscountSplitItem.GrossOc : netTotalNoDiscountSplitItem.ValueNetOc;
					if (value > sumTotalNoDiscoutSplitOc) {
						validateResult.apply = true;
						validateResult.valid = false;
						validateResult.error = $translate.instant('procurement.common.NotMoreThanNetTotalOcNoDiscount');
						platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
						platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
						return validateResult;
					}
					if (value || value === 0) {
						entity.OverallDiscount = entity.ExchangeRate ? prcCommonCalculationHelper.round(math.bignumber(value).div(entity.ExchangeRate)) : 0;
					}
					if (sumTotalNoDiscoutSplitOc === 0) {
						entity.OverallDiscountPercent = 0;
					}
					else {
						entity.OverallDiscountPercent = prcCommonCalculationHelper.round(math.bignumber(value).div(sumTotalNoDiscoutSplitOc).mul(100));
					}
				}
				platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
				platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
				platformRuntimeDataService.applyValidationResult(true, entity, 'OverallDiscount');
				platformDataValidationService.finishValidation(true, entity, entity.OverallDiscount, 'OverallDiscount', service, dataService);
				platformRuntimeDataService.applyValidationResult(true, entity, 'OverallDiscountPercent');
				platformDataValidationService.finishValidation(true, entity, entity.OverallDiscountPercent, 'OverallDiscountPercent', service, dataService);
				return validateResult;
			};
			self.validateOverallDiscountPercent = function (entity, value, model, service, dataService, totalService) {
				var validateResult = {
					apply: true,
					valid: true
				};

				if(value === null || value === undefined) {
					return true;
				}
				else if (value < 0 || value > 100) {
					validateResult.apply = true;
					validateResult.valid = false;
					validateResult.error = $translate.instant('procurement.common.OverallDiscountPercentRangeErr');
					platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					return validateResult;
				}
				else if (value === 0) {
					entity.OverallDiscount = 0;
					entity.OverallDiscountOc = 0;
				}
				else {
					var isOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
					var isDirectiveFromItemAndBoq = ifGetNetTotalFromItemsAndBoqs(dataService);
					var netTotalNoDiscountSplitItem = totalService.getNetTotalNoDiscountSplitItem(isDirectiveFromItemAndBoq);
					if (isOverGross) {
						if (netTotalNoDiscountSplitItem) {
							if (netTotalNoDiscountSplitItem.Gross || netTotalNoDiscountSplitItem.Gross === 0) {
								entity.OverallDiscount = prcCommonCalculationHelper.round(math.bignumber(netTotalNoDiscountSplitItem.Gross).mul(value).div(100));
							}
							if (netTotalNoDiscountSplitItem.GrossOc || netTotalNoDiscountSplitItem.GrossOc === 0) {
								entity.OverallDiscountOc = prcCommonCalculationHelper.round(math.bignumber(netTotalNoDiscountSplitItem.GrossOc).mul(value).div(100));
							}
						}
					}
					else {
						if (netTotalNoDiscountSplitItem.ValueNet || netTotalNoDiscountSplitItem.ValueNet === 0) {
							entity.OverallDiscount = prcCommonCalculationHelper.round(math.bignumber(netTotalNoDiscountSplitItem.ValueNet).mul(value).div(100));
						}
						if (netTotalNoDiscountSplitItem.ValueNetOc || netTotalNoDiscountSplitItem.ValueNetOc === 0) {
							entity.OverallDiscountOc = prcCommonCalculationHelper.round(math.bignumber(netTotalNoDiscountSplitItem.ValueNetOc).mul(value).div(100));
						}
					}
				}
				platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
				platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
				platformRuntimeDataService.applyValidationResult(true, entity, 'OverallDiscount');
				platformDataValidationService.finishValidation(true, entity, entity.OverallDiscount, 'OverallDiscount', service, dataService);
				platformRuntimeDataService.applyValidationResult(true, entity, 'OverallDiscountOc');
				platformDataValidationService.finishValidation(true, entity, entity.OverallDiscountOc, 'OverallDiscountOc', service, dataService);
				return validateResult;
			};

			self.exchangeUpdatedOverallDiscount = function(options) {
				if (options.HeaderItem) {
					var entity = options.HeaderItem;
					if (_.has(entity, 'OverallDiscount') && _.has(entity, 'OverallDiscountOc')) {
						var remainNet = options.RemainNet;
						var rate = entity.ExchangeRate;
						var docCurrencyFk = _.has(entity, 'CurrencyFk') ? entity.CurrencyFk : entity.BasCurrencyFk;
						if (docCurrencyFk === procurementContextService.companyCurrencyId) {
							entity.OverallDiscount = remainNet ? entity.OverallDiscount : entity.OverallDiscountOc;
							entity.OverallDiscountOc = remainNet ? entity.OverallDiscount : entity.OverallDiscountOc;
						} else {
							entity.OverallDiscount = remainNet ? entity.OverallDiscount : prcCommonCalculationHelper.round(math.bignumber(entity.OverallDiscountOc).div(rate));
							entity.OverallDiscountOc = remainNet ? prcCommonCalculationHelper.round(math.bignumber(entity.OverallDiscount).mul(rate)) : entity.OverallDiscountOc;
						}
					}
				}
			};

			function ifGetNetTotalFromItemsAndBoqs(dataService) {
				var module = dataService.getModule();
				var modName = module ? module.name : null;
				if (modName) {
					var modState = platformModuleStateService.state(modName);
					var modiKeys = _.keys(modState.modifications);
					if (modiKeys && modiKeys.length > 1) {
						var modifs = modState.modifications;
						if (modName === procurementModuleName.packageModule) {
							return false;
						}
						if (modName === procurementModuleName.requisitionModule || modName === procurementModuleName.contractModule) {
							if ((modifs.PrcItemToSave && modifs.PrcItemToSave.length) ||
								(modifs.PrcItemToDelete && modifs.PrcItemToDelete.length) ||
								(_.has(modifs, 'PrcBoqCompleteToSave.BoqItemCompleteToSave') && modifs.PrcBoqCompleteToSave.BoqItemCompleteToSave.length) ||
								(_.has(modifs, 'PrcBoqCompleteToSave.BoqItemCompleteToDelete') && modifs.PrcBoqCompleteToSave.BoqItemCompleteToDelete.length)) {
								return true;
							}
						}
						if (modName === procurementModuleName.quoteModule) {
							if (modifs.QtnRequisitionToSave && modifs.QtnRequisitionToSave.length) {
								var qtnModItemsOrBoq = _.find(modifs.QtnRequisitionToSave, function(p) {
									return (p.PrcItemToSave && p.PrcItemToSave.length) ||
										(p.PrcItemToDelete && p.PrcItemToDelete.length) ||
										(_.has(p, 'PrcBoqCompleteToSave.BoqItemCompleteToSave') && p.PrcBoqCompleteToSave.BoqItemCompleteToSave.length) ||
										(_.has(p, 'PrcBoqCompleteToSave.BoqItemCompleteToDelete') && p.PrcBoqCompleteToSave.BoqItemCompleteToDelete.length);
								});
								if (qtnModItemsOrBoq) {
									return true;
								}
							}
						}
					}
				}
				return false;
			}
		}
	]);
})();
