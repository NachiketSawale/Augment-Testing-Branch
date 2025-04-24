(function () {
	'use strict';

	/* globals angular, _ */
	let moduleName = 'basics.material';
	angular.module(moduleName).factory('basicsMaterialPortionValidationService', [
		'$translate',
		'$q',
		'$injector',
		'$http',
		'basicsMaterialPortionDataService',
		'platformDataValidationService',
		'platformRuntimeDataService',
		function (
			$translate,
			$q,
			$injector,
			$http,
			dataService,
			platformDataValidationService,
			platformRuntimeDataService
		) {
			let service = {};
			let asyncPromise = null;

			service.asyncValidatePrcPriceConditionFk = function asyncValidatePrcPriceConditionFk(entity, value, model,isFromBulkEditor) {
				let defer = $q.defer();
				let basicsMaterialPriceConditionDataServiceNew =  $injector.get('basicsMaterialPriceConditionDataServiceNew');
				let priceConditionList = basicsMaterialPriceConditionDataServiceNew.getList();
				let  loadedData ={
					ErrorMessages :[],
					ExchangeRate: 0,
					HeaderId: 0,
					HeaderName: null,
					IsSuccess: true,
					PriceConditions:priceConditionList
				};

				let url = globals.webApiBaseUrl + 'basics/material/pricecondition/reload';
				let selectedMaterial = $injector.get('basicsMaterialRecordService').getSelected();

				if(value){
					let param = {
						PrcPriceConditionId: value,
						MainItem: selectedMaterial,
						ExchangeRate: 1,
						IsFromMaterial: false,
						IsCopyFromPrcItem: false,
						MaterialPriceListId: null,
						HeaderId: 0,
						HeaderName: 'basicsMaterialRecordService',
						ProjectFk: 0,
						IsCopyFromBoqDivision: false,
						BasicPrcItemId: null
					};

					if(asyncPromise === null){
						asyncPromise = $http.post(url, param);
					}
					asyncPromise.then(function (result) { // PriceCondition of the Material Portion  Container
						asyncPromise = null;
						defer.resolve(true);
						let priceConditions = result.data.PriceConditions;
						if (priceConditions && priceConditions.length) {
							entity.PriceExtra = _.sumBy (priceConditions, function (item) {
								return item.PriceConditionType && item.PriceConditionType.IsPriceComponent && item.IsActivated ? item.Total : 0;
							});
						}

						let col = 'PrcPriceConditionFk';
						if(entity.IsEstimatePrice && !entity.IsDayworkRate){
							col ='IsEstimatePrice';
						}else if(!entity.IsEstimatePrice && entity.IsDayworkRate) {
							col = 'IsDayworkRate';
						}
						if(entity.IsEstimatePrice || entity.IsDayworkRate) {
							basicsMaterialPriceConditionDataServiceNew.handleRecalcuateDone (selectedMaterial, loadedData, selectedMaterial.PrcPriceConditionFk, col);
						}
					});
				}else{
					defer.resolve(true);
					entity.PriceExtra = 0;
					dataService.markItemAsModified(entity);

					let col = 'PrcPriceConditionFk';
					if(entity.IsEstimatePrice && !entity.IsDayworkRate){
						col ='IsEstimatePrice';
					}else if(!entity.IsEstimatePrice && entity.IsDayworkRate) {
						col = 'IsDayworkRate';
					}
					if(entity.IsEstimatePrice || entity.IsDayworkRate) {
						basicsMaterialPriceConditionDataServiceNew.handleRecalcuateDone (selectedMaterial, loadedData, selectedMaterial.PrcPriceConditionFk, col);
					}
				}
				return defer.promise;
			};

			service.validateCode = function validateCode(entity, value, model) {
				let validateResult = {
					apply: true,
					valid: true
				};
				if (!value) {
					validateResult.apply = true;
					validateResult.valid = false;
					validateResult.error = $translate.instant ('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model.toLowerCase ()});
					platformDataValidationService.finishValidation (validateResult, entity, value, model, service, dataService);
					return validateResult;
				}
				var list = dataService.getList ();
				list = _.filter (list, function (e) {
					return e.Id !== entity.Id;
				});
				var sameCodeItem = null;
				if (list.length) {
					sameCodeItem = _.find (list, {Code: value});
				}
				if (sameCodeItem) {
					validateResult.apply = true;
					validateResult.valid = false;
					validateResult.error = $translate.instant ('cloud.common.uniqueValueErrorMessage', {object: model.toLowerCase ()});
					platformDataValidationService.finishValidation (validateResult, entity, value, model, service, dataService);
					return validateResult;
				} else {
					if (list.length && entity[model]) {
						var sameOldCodeItem = _.find (list, {Code: entity[model]});
						if (sameOldCodeItem && _.has (sameOldCodeItem, '__rt$data.errors.Code')) {
							sameOldCodeItem.__rt$data.errors.Code = null;
							platformDataValidationService.finishValidation (true, sameOldCodeItem, entity[model], model, service, dataService);
							platformRuntimeDataService.applyValidationResult (true, sameOldCodeItem, model);
							dataService.markItemAsModified (sameOldCodeItem);
						}
					}
					platformDataValidationService.finishValidation (validateResult, entity, value, model, service, dataService);
					return validateResult;
				}
			};

			service.validateMdcCostCodeFk = function asyncValidateMdcCostCodeFk(entity, value, model) {
				dataService.fieldChanged(model,entity);
				return true;
			};

			service.validateCostPerUnit = function asyncValidateCostPerUnit(entity, value, model) {
				entity.CostPerUnit = value;
				dataService.fieldChanged(model,entity);
				return true;
			};

			service.validateQuantity = function asyncValidateQuantity(entity, value, model) {
				entity.Quantity = value;
				dataService.fieldChanged(model,entity);
				return true;
			};
			service.validateIsEstimatePrice = function asyncValidateIsEstimatePrice(entity, value, model,isFromBulkEditor) {
				entity.IsEstimatePrice = value;
				if(!isFromBulkEditor) {
					let entities = dataService.getSelectedEntities();
					_.forEach (entities, function (d) {
						d.IsEstimatePrice = value;
					});
					dataService.markEntitiesAsModified(entities);
				}
				dataService.fieldChanged(model,entity);
				return true;
			};

			service.validateIsDayworkRate = function asyncValidateIsDayworkRate(entity, value, model,isFromBulkEditor) {
				entity.IsDayworkRate = value;
				if(!isFromBulkEditor) {
					let entities = dataService.getSelectedEntities();
					_.forEach (entities, function (d) {
						d.IsDayworkRate = value;
					});
					dataService.markEntitiesAsModified(entities);
				}
				dataService.fieldChanged(model,entity);
				return true;
			};

			return service;
		}
	]);
})();
