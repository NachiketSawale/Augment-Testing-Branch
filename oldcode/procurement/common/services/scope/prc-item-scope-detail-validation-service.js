/**
 * Created by wui on 10/16/2018.
 */

(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcItemScopeDetailValidationService', [
		'$q',
		'$http',
		'basicsMaterialScopeServiceFactory',
		'prcItemScopeDetailPriceConditionDataService',
		'procurementCommonServiceCache',
		'procurementContextService',
		'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupDataService',
		'platformRuntimeDataService',
		'basicsMaterialPriceListLookupDataService',
		'prcCommonItemCalculationHelperService',
		function ($q,
			$http,
			basicsMaterialScopeServiceFactory,
			prcItemScopeDetailPriceConditionDataService,
			procurementCommonServiceCache,
			procurementContextService,
			lookupDescriptorService,
			basicsLookupdataLookupDataService,
			platformRuntimeDataService,
			basicsMaterialPriceListLookupDataService,
			prcCommonItemCalculationHelper) {
			function constructor(dataService) {
				let roundingType = prcCommonItemCalculationHelper.roundingType;
				var priceConditionService = prcItemScopeDetailPriceConditionDataService.getService();
				var service = basicsMaterialScopeServiceFactory.createScopeDetailValidationService(priceConditionService, {
					getExchangeRate: function () {
						return service.getSelectedPrcHeader().ExchangeRate;
					},
					dataService: dataService
				});

				service.validateScopeOfSupplyTypeFk = function () {
					service.onTotalChanged.fire();
				};

				// #92164, use async validator to wait async logic done before update data on bulk edit feature.
				// override
				service.asyncValidateMaterialFk = function (entity, value) {
					// if user click clear button, no need to clear other data
					if (!value) {
						platformRuntimeDataService.readonly(entity, [{field: 'PrcStructureFk', readonly: false}]);
						platformRuntimeDataService.readonly(entity, [{field: 'UomFk', readonly: false}]);
						return $q.when(true);
					}

					var defer = $q.defer();
					var headerItem = service.getSelectedPrcHeader();

					platformRuntimeDataService.readonly(entity, [{field: 'UomFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PrcStructureFk', readonly: true}]);

					basicsLookupdataLookupDataService.getItemByKey('MaterialCommodity', value).then(function (response) {
						if (!angular.isObject(response)) {
							defer.resolve(true);
							return;
						}

						lookupDescriptorService.updateData('MaterialCommodity', [response]);

						var materialItem = response;
						var priceList = basicsMaterialPriceListLookupDataService.getPriceList(materialItem);

						entity.MdcMaterialFk = value;
						entity.PriceUnit = materialItem.PriceUnit;
						entity.UomFk = materialItem.BasUomFk;
						entity.UomPriceUnitFk = materialItem.BasUomPriceUnitFk;
						entity.FactorPriceUnit = materialItem.FactorPriceUnit;
						entity.PrcStructureFk = materialItem.PrcStructureFk;
						service.validatePrcStructureFk(entity, entity.PrcStructureFk);
						platformRuntimeDataService.applyValidationResult(true, entity, 'PrcStructureFk');
						service.setTranslationInfo(entity.Description1Info, materialItem.DescriptionInfo);
						service.setTranslationInfo(entity.Description2Info, materialItem.DescriptionInfo2);
						service.setTranslationInfo(entity.SpecificationInfo, materialItem.SpecificationInfo);

						reloadPriceCondition(entity, priceList.PrcPriceConditionFk, true, priceList.Id).then(function () {
							var docCurrencyFk = headerItem.CurrencyFk || headerItem.BasCurrencyFk, exchangeRate = headerItem.ExchangeRate;

							// if home currency(A) equal as material currency(C)
							// price list currency may be null, if null operate just like equal
							if (procurementContextService.companyCurrencyId === priceList.BasCurrencyFk || !priceList.BasCurrencyFk) {
								entity.Price = prcCommonItemCalculationHelper.getPriceByMdcCost(priceList.Cost, priceList.PriceExtra);
								entity.PriceOc = prcCommonItemCalculationHelper.getPriceOcByExchangeRate(entity, exchangeRate);
								dataService.fireItemModified(entity);
								calculateTotal(entity);
							} else {
								getForeignToDocExchangeRate(docCurrencyFk, priceList.BasCurrencyFk, headerItem.ProjectFk).then(function (res) {
									var rate = res.data;
									entity.PriceOc = rate === 0 ? 0 : prcCommonItemCalculationHelper.getPriceByMdcCost(priceList.Cost, priceList.PriceExtra, rate);
									entity.Price = exchangeRate === 0 ? 0 : prcCommonItemCalculationHelper.getPriceByPriceOc(entity, exchangeRate);
									dataService.fireItemModified(entity);
									calculateTotal(entity);
								});
							}

							if (angular.isFunction(dataService.updateReadOnly)) {
								dataService.updateReadOnly(entity, 'PrcStructureFk');
							}
						}).finally(function () {
							defer.resolve();
						});
					}, function () {
						defer.resolve();
					});

					return defer.promise;
				};

				function reloadPriceCondition(entity, value, isFromMaterial, materialPriceListId) {
					entity.PrcPriceConditionFk = value;
					return priceConditionService.reload(entity, entity.PrcPriceConditionFk, isFromMaterial, false, materialPriceListId);
				}

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

				service.onTotalChanged.register(function () {
					var prcItemScopeService = dataService.parentService();
					var prcItemService = procurementContextService.getItemDataService();
					var prcItemScope = prcItemScopeService.getSelected();
					var prcItem = prcItemService.getSelected();
					var scopeDetail = dataService.getSelected();
					if(scopeDetail!==null){
						scopeDetail.TotalQuantity = prcCommonItemCalculationHelper.round(roundingType.TotalQuantity, scopeDetail.Quantity * prcItem.Quantity);
					}
					dataService.sumTotal(prcItem, prcItemScope);
				});

				service.getSelectedPrcHeader = function () {
					var leadingService = procurementContextService.getMainService();
					return leadingService.getSelected();
				};

				function calculateTotal(entity) {
					return priceConditionService.recalculate(entity, entity.PrcPriceConditionFk).then(function () {
						service.processTotal(entity);
					});
				}

				function exchangeUpdated(e, args) {
					var materials = lookupDescriptorService.getData('MaterialCommodity'), headerItem = service.getSelectedPrcHeader();
					var exchangeRate = args.ExchangeRate;

					if(!headerItem){
						return false;
					}

					if(args && args.IsCurrencyChanged){// need re get price from material
						var docCurrencyFk =  headerItem.CurrencyFk || headerItem.BasCurrencyFk;

						_.forEach(dataService.getList(), function (item) {
							if(docCurrencyFk === procurementContextService.companyCurrencyId){
								item.Price = item.PriceOc;
							}else{
								item.Price = prcCommonItemCalculationHelper.getPriceByPriceOc(item, exchangeRate);
							}
							dataService.fireItemModified(item);
							calculateTotal(item);
						});
					}else{
						_.forEach(dataService.getList(), function (item) {
							var materialItem = _.find(materials, {Id: item.MdcMaterialFk});
							if(materialItem && materialItem.Id && procurementContextService.companyCurrencyId === materialItem.BasCurrencyFk  ){
								item.PriceOc = prcCommonItemCalculationHelper.getPriceOcByExchangeRate(item, exchangeRate);
							}else{
								item.Price = exchangeRate === 0 ? 0 : prcCommonItemCalculationHelper.getPriceByPriceOc(item, exchangeRate);
							}
							dataService.fireItemModified(item);
							calculateTotal(item);
						});
					}
				}

				if (procurementContextService.getMainService().exchangeRateChanged) {
					procurementContextService.getMainService().exchangeRateChanged.register(exchangeUpdated);
				}

				return service;
			}

			return procurementCommonServiceCache.registerService(constructor, 'prcItemScopeDetailValidationService');
		}
	]);

})(angular);