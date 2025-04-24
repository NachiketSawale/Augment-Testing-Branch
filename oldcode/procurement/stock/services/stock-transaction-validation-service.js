// eslint-disable-next-line no-redeclare
/* global angular,_ */
(function (angular) {
	'use strict';
	/* jshint -W072 */
	var modName = 'procurement.stock';
	angular.module(modName).factory('procurementStockTransactionValidationService',
		['platformDataValidationService', 'basicsLookupdataLookupDataService', 'procurementStockTransactionDataService', 'platformRuntimeDataService',
			'basicsLookupdataLookupDescriptorService', 'procurementStockTransactionReadOnlyProcessor', '$translate',
			function (platformDataValidationService, lookupService, dataService, platformRuntimeDataService,
				lookupDescriptorService, procurementStockTransactionReadOnlyProcessor, $translate) {

				var service = {};

				service.validatePrjStocklocationFk = function validateValue(entity, value, model, isnotvalidate) {
					var validateResult;
					if (isnotvalidate) {
						validateResult = {apply: true, valid: true};
						platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
						platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
						return validateResult;
					}

					if (value === 0) {
						value = null;

					}
					var Mandatory = lookupDescriptorService.getData('ProjectStock');
					var item = _.find(Mandatory, {Id: entity.PrjStockFk});
					if (item !== undefined && item.IsLocationMandatory) {
						validateResult = platformDataValidationService.isMandatory(value, model);
						platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
						platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
						return validateResult;
					}
				};
				service.validateLotno = function validateValue(entity, value, model) {
					if (getIsLotManagement(entity)) {
						var validateResult = platformDataValidationService.isMandatory(value, model);
						platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
						platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
						return validateResult;
					}
				};
				// service.validateBasUomFk = function validateValue(entity, value,model){
				//     var validateResult = platformDataValidationService.isMandatory(value, model);
				//     platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
				//     platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
				//     return validateResult;
				// };
				service.validatePrcStocktransactiontypeFk = function validateValue(entity, value, model) {
					var transactionType = lookupDescriptorService.getData('StockTransactionType');
					var item = _.find(transactionType, {Id: value});
					if (item !== undefined) {
						procurementStockTransactionReadOnlyProcessor.setFieldsEnabled(item, entity);
						if (item.IsReceipt) {
							setProvisionPercent(entity);
						}

						var fields = ['PrjStocklocationFk'];
						/** @namespace item.IsConsumed */
						procurementStockTransactionReadOnlyProcessor.setFieldReadOnly(entity, fields, item.IsConsumed);
						if (item.IsConsumed) {
							entity.PrjStocklocationFk = null;
							service.validatePrjStocklocationFk(entity, entity.PrjStocklocationFk, 'PrjStocklocationFk', true);
						} else {
							service.validatePrjStocklocationFk(entity, entity.PrjStocklocationFk, 'PrjStocklocationFk');
						}
					}
					if (value === 0) {
						value = null;
						procurementStockTransactionReadOnlyProcessor.setFieldReadOnly(entity, ['PrcStocktransactionFk'], true);
					} else {
						entity.PrcStocktransactiontypeFk = value;
					}
					service.validatePrcStocktransactionFk(entity, entity.PrcStocktransactionFk, 'PrcStocktransactionFk');
					var validateResult = platformDataValidationService.isMandatory(value, model);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					return validateResult;
				};
				service.validateQuantity = function validateValue(entity, value, model) {
					var transactionType = lookupDescriptorService.getData('StockTransactionType');
					var item = _.find(transactionType, {Id: entity.PrcStocktransactiontypeFk});
					if (value === null) {
						value = 0;
					}

					if (item !== undefined) {
						if (item.IsReceipt) {
							entity.Quantity = value;
							setProvisionPercent(entity);
							return true;
						}
					}
					var validateResult = platformDataValidationService.isMandatory(value, model);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					return validateResult;
				};

				service.validateTotal = function validateValue(entity, value, model) {
					var transactionType = lookupDescriptorService.getData('StockTransactionType');
					var item = _.find(transactionType, {Id: entity.PrcStocktransactiontypeFk});
					if (value === null) {
						value = 0;
					}

					if (item !== undefined) {
						if (item.IsReceipt) {
							entity.Total = value;
							setProvisionPercent(entity);
							return true;
						}
					}
					var validateResult = platformDataValidationService.isMandatory(value, model);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					return validateResult;
				};
				service.validateProvisionPercent = function validateValue(entity, value, model) {
					var transactionType = lookupDescriptorService.getData('StockTransactionType');
					var item = _.find(transactionType, {Id: entity.PrcStocktransactiontypeFk});
					if (value === null) {
						value = 0;
					}

					if (item !== undefined) {
						if (item.IsReceipt) {
							entity.ProvisionPercent = value;
							setProvisionPercent(entity);
							return true;
						}
					}
					var validateResult = platformDataValidationService.isMandatory(value, model);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					return validateResult;
				};

				service.validatePrcStocktransactionFk = function validatePrcStocktransactionFk(entity, value, model) {
					var result = {apply: true, valid: true};
					if (_.isNull(value)) {
						switch (entity.PrcStocktransactiontypeFk) {
							case 2: // Incidental Acquisition Expense
								result.valid = false;
								result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $translate.instant('procurement.common.entityPrcStockTransaction')});
								break;
							default:
								var transactionType = lookupDescriptorService.getData('StockTransactionType');
								var type = _.find(transactionType, {Id: entity.PrcStocktransactiontypeFk});
								/** @namespace type.IsDelta */
								if (type && type.IsDelta) {
									result.valid = false;
									result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: $translate.instant('procurement.common.entityPrcStockTransaction')});
								}
								break;
						}
					}
					setModelApplyValidationAndFinishValidation(result, entity, model, value);
					return result;
				};

				service.validateExpirationDate = function validateExpirationDate(entity, value, model) {
					if (getIsLotManagement(entity)) {
						var validateResult = platformDataValidationService.isMandatory(value, model);
						platformRuntimeDataService.applyValidationResult(validateResult, entity, model);
						platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
						return validateResult;
					}
				};

				function setModelApplyValidationAndFinishValidation(result, entity, model, value) {
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				}

				function setProvisionPercent(entity) {
					var Materials = lookupDescriptorService.getData('ProjectStock2Material');
					var material = _.find(Materials, {ProjectStockFk: entity.PrjStockFk, MaterialFk: entity.MdcMaterialFk});
					if (material) {
						entity.ProvisionPercent = material.ProvisionPercent;
						entity.ProvisionTotal = (entity.Quantity * material.ProvisionPeruom) + entity.ProvisionPercent / 100 * entity.Total;
					}

				}

				function getIsLotManagement(entity) {
					var Material = _.find(lookupDescriptorService.getData('ProjectStock2Material'), {
						ProjectStockFk: entity.PrjStockFk,
						MaterialFk: entity.MdcMaterialFk
					});
					return !!(Material !== undefined && Material.IsLotManagement);

				}

				return service;
			}
		]);
})(angular);