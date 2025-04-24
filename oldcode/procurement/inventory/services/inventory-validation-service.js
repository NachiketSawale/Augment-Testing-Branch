/**
 * Created by pel on 7/5/2019.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName='procurement.inventory';

	/**
	 * @ngdoc service
	 * @name invenHeaderElementValidationService
	 * @description provides validation methods for a InventoryHeader
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('inventoryElementValidationService',
		['$translate', '$q', '$http', '$timeout', 'procurementInventoryDataService',
			'platformDataValidationService', 'basicsLookupdataLookupDataService',
			'platformRuntimeDataService', '_', 'platformModalService', 'procurementInventoryHeaderDataService',
			function ($translate, $q, $http, $timeout, inventoryDataService, platformDataValidationService,
				basicsLookupdataLookupDataService, platformRuntimeDataService, _, platformModalService, procurementInventoryHeaderDataService) {
				var service = {};
				service.validateActualQuantity = validateActualQuantity;
				service.validatePrice= validatePrice;

				service.validateRecordedQuantity = validateRecordedQuantity;
				service.validateRecordedUomFk = validateRecordedUomFk;
				service.validateClerkFk1 = validateClerkFk1;
				service.validateClerkFk2 = validateClerkFk2;
				service.validateQuantity1 = validateQuantity1;
				service.validateQuantity2 = validateQuantity2;

				service.validateMdcMaterialFk = function validateMdcMaterialFk(entity, value, model) {
					var fieldName = model === 'MdcMaterialFk' ? $translate.instant('procurement.inventory.mdcmaterialfk'):'Material';
					var result = platformDataValidationService.isMandatory(value, model, {fieldName: fieldName});
					if(result.valid === true && value === 0){
						entity.Material2Uoms = null;
						result = createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {fieldName: fieldName} );
						platformDataValidationService.finishValidation(result, entity, value, model, service, inventoryDataService);
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						return result;
					}else{
						platformDataValidationService.finishValidation(result, entity, value, model, service, inventoryDataService);
						platformRuntimeDataService.applyValidationResult(result, entity, model);
					}

					var items = _.filter(inventoryDataService.getList(), function (item) {
						return item.Id !== entity.Id;
					});
					var existItems = _.find(items, {'MdcMaterialFk':value});  // item filter item by material
					if(existItems)
					{
						result = createErrorObject('procurement.inventory.duplicatematerailmsg', {fieldName: fieldName} );
						platformDataValidationService.finishValidation(result, entity, value, model, service, inventoryDataService);
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						return result;
					}
					basicsLookupdataLookupDataService.getItemByKey('MaterialCommodity', value).then(function (response) {
						var selectedHeader = procurementInventoryHeaderDataService.getSelected();
						var material = response;
						entity.MdcMaterialFk = value;
						entity.CatalogFk = response.MdcMaterialCatalogFk;
						entity.BasUomFk = entity.RecordedUomFk =response.BasUomFk;
						entity.Material2Uoms = response.Material2Uoms;

						service.validateBasUomFk(entity, entity.BasUomFk, 'BasUomFk');
						service.validateRecordedUomFk(entity, entity.RecordedUomFk, 'RecordedUomFk');

						$http.get(globals.webApiBaseUrl +'procurement/inventory/generatebymaterial?prjStockFk='+selectedHeader.PrjStockFk+'&materialFk=' + value).then(function (response) {
							if(response){
								var data = response.data;
								if(data){
									entity.PrjStockLocationFk = data.PrjStockLocationFk;
									entity.LotNo = data.LotNo;
									entity.ExpirationDate = data.ExpirationDate;
									entity.PpsProductFk = data.PpsProductFk;
									entity.StockQuantity = data.StockQuantity;
									entity.StockTotal = data.StockTotal;
									entity.StockProvisionTotal = data.StockProvisionTotal;
									entity.RecordedQuantity = entity.ActualQuantity = data.ActualQuantity;
									entity.ActualTotal = data.ActualTotal;
									entity.ActualProvisionTotal = data.ActualProvisionTotal;
									inventoryDataService.markItemAsModified(entity);
									inventoryDataService.fireItemModified(entity);
								}else{
									// entity.ActualProvisionTotal = data.ActualProvisionTotal;
									getForeignToDocExchangeRate(selectedHeader.StockCurrencyFk, material.BasCurrencyFk, selectedHeader.StockProjectFk).then(function (res) {
										var rate = res.data;
										if(material !== null && material !== undefined){
											var price = material.Cost/(material.PriceUnit*material.FactorPriceUnit)/rate;
											entity.Price = price;
											entity.ActualTotal = price * entity.ActualQuantity;
											inventoryDataService.markItemAsModified(entity);
											inventoryDataService.fireItemModified(entity);
										}
									});
								}

							}

						});

					});
				};

				service.validateBasUomFk = function validateBasUomFk(entity, value, model) {
					var result = {apply: true, valid: true};
					if (angular.isUndefined(value) || value === null || value === -1) {
						result.valid = false;
						var uom = $translate.instant('cloud.common.entityUoM');
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: uom});
					}

					var readonly = !!entity.MdcMaterialFk;
					platformRuntimeDataService.readonly(entity, [{field: model, readonly: readonly}]);

					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, inventoryDataService);
					$timeout(inventoryDataService.gridRefresh, 0, false);
					return result;
				};

				function getForeignToDocExchangeRate(documentCurrencyFk, currencyForeignFk, projectFk) {
					if (currencyForeignFk === documentCurrencyFk) {
						return $q.when({data: 1});
					}

					return $http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'procurement/common/exchangerate/ocrate',
						params: {
							CurrencyForeignFk: currencyForeignFk,
							DocumentCurrencyFk: documentCurrencyFk,
							ProjectFk: projectFk
						}
					});
				}


				function validateActualQuantity(entity, value, model) {
					let result = {apply: true, valid: true};
					if (value < 0) {
						result.valid = false;
						result.error = $translate.instant('procurement.inventory.quantityNoNegative');
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, inventoryDataService);
					platformRuntimeDataService.applyValidationResult(result, entity, model);


					let result1 = {apply: true, valid: true};
					if (entity.IsFromExistStock) {
						result1.valid = false;
						result1.error = $translate.instant('procurement.inventory.updateactualwarnning');
						platformRuntimeDataService.applyValidationResult(result1, entity, 'ActualTotal');
					} else {
						entity.ActualTotal = entity.Price * value;
						if (value === 0) {
							entity.ActualProvisionTotal = 0;
						}
						inventoryDataService.markItemAsModified(entity);
						inventoryDataService.fireItemModified(entity);
					}
					conversionQuantity(entity, entity.RecordedUomFk, value, null);
					return result;
				}

				function validatePrice(entity,value)
				{
					if(!entity.IsFromExistStock){
						entity.ActualTotal = value * entity.ActualQuantity;
						inventoryDataService.markItemAsModified(entity);
						inventoryDataService.fireItemModified(entity);
					}
				}
				function createErrorObject(transMsg, errorParam) {
					return {
						apply: true,
						valid: false,
						error: '...',
						error$tr$: transMsg,
						error$tr$param$: errorParam
					};
				}

				function validateRecordedQuantity(entity, value) {
					conversionQuantity(entity, entity.RecordedUomFk, null, value);
					return true;
				}

				function validateRecordedUomFk(entity, value, model) {
					var readonly = (!!entity.MdcMaterialFk && !entity.Material2Uoms);
					platformRuntimeDataService.readonly(entity, [{field: model, readonly: readonly}]);
					platformRuntimeDataService.readonly(entity, [{field: 'RecordedQuantity', readonly: readonly}]);

					conversionQuantity(entity, value, entity.ActualQuantity, null);
					return true;
				}
				function validateClerkFk1(entity, value, model) {
					var readonly = value === null;
					if(readonly){
						entity.Quantity1 = null;
						entity.ClerkFk1 = null;
						validateQuantity1(entity, entity.Quantity1);
					}
					platformRuntimeDataService.readonly(entity, [{field: 'Quantity1', readonly: readonly}]);
					return true;
				}

				function validateClerkFk2(entity, value) {
					var readonly = value === null;
					if(readonly){
						entity.Quantity2 = null;
						entity.ClerkFk2 = null;
						validateQuantity2(entity, entity.Quantity2);
					}
					platformRuntimeDataService.readonly(entity, [{field: 'Quantity2', readonly: readonly}]);
					return true;
				}

				function validateQuantity1(entity, value) {
					if(entity.ClerkFk2 === null){
						if(entity.ClerkFk1 !== null){
							entity.ActualQuantity = value;
						}
					}else{
						if(value !== null){
							if(entity.Quantity2 !== null && value !== entity.Quantity2){
								entity.ActualQuantity = null;
							}else{
								entity.ActualQuantity = value;
							}
						}else{
							if(value !== entity.Quantity2){
								entity.ActualQuantity = entity.Quantity2;
							}
						}

					}
					entity.Quantity1 = value;
					checkDifferenceClerkQuantity(entity);
					inventoryDataService.markItemAsModified(entity);
					inventoryDataService.fireItemModified(entity);
					return true;
				}

				function validateQuantity2(entity, value) {
					if(entity.ClerkFk1 === null){
						if(entity.ClerkFk2 !== null){
							entity.ActualQuantity = value;
						}
					}else{
						if(value !== null){
							if(entity.Quantity1 !== null && value !== entity.Quantity1){
								entity.ActualQuantity = null;
							}else{
								entity.ActualQuantity = value;
							}
						}else{
							if(value !== entity.Quantity1){
								entity.ActualQuantity = entity.Quantity1;
							}
						}
					}
					entity.Quantity2 = value;
					checkDifferenceClerkQuantity(entity);
					inventoryDataService.markItemAsModified(entity);
					inventoryDataService.fireItemModified(entity);
					return true;
				}

				function checkDifferenceClerkQuantity(entity){
					if (entity.Quantity1 !== null || entity.Quantity2 !== null)
					{
						if(entity.Quantity1 !== null && entity.Quantity2 !== null)
						{
							entity.DifferenceClerkQuantity = entity.Quantity1 - entity.Quantity2;
						}
						else
						{
							if(entity.Quantity1 !== null)
							{
								entity.DifferenceClerkQuantity = entity.Quantity1;
							}
							else
							{
								entity.DifferenceClerkQuantity = entity.Quantity2;
							}
						}
					}else{
						entity.DifferenceClerkQuantity = null;
					}
				}

				function conversionQuantity(entity, uom, quantity, recordedQuantity) {
					var uomItem = _.find(entity.Material2Uoms, {UomFk: uom}), value = 1;
					if (uomItem) {
						value = uomItem.Quantity;
					}
					if (quantity) {
						entity.RecordedQuantity = quantity * value;
					}
					if (recordedQuantity) {
						entity.ActualQuantity = value === 0 ? 0 : recordedQuantity / value;
					}
				}

				return service;
			}
		]);

})(angular);
