(function () {
	'use strict';

	/* global globals, _ */
	let moduleName = 'estimate.main';
	angular.module (moduleName).factory ('estimateMainMaterialPortionValidationService', [
		'$translate', '$q', '$injector', '$http', 'estimateMainMaterialPortionService','platformDataValidationService',
		function ( $translate, $q, $injector, $http, dataService,platformDataValidationService) {
			let service = {};

			service.asyncValidatePriceConditionFk = function asyncValidatePriceConditionFk(entity, value) {

				let projectMaterialPriceConditionServiceNew = $injector.get ('projectMaterialPriceConditionServiceNew');
				let priceConditionList = projectMaterialPriceConditionServiceNew.getList ();
				let loadedData = {
					ErrorMessages: [],
					ExchangeRate: 0,
					HeaderId: 0,
					HeaderName: null,
					IsSuccess: true,
					PriceConditions: priceConditionList
				};
				let defer = $q.defer ();

				let url = globals.webApiBaseUrl + 'project/material/pricecondition/reload';
				let selectedMaterial = $injector.get ('estimateMainMaterialPortionService').getParentSelected();

				if (value) {
					let param = {
						PrcPriceConditionId: value,
						MainItem: selectedMaterial,
						ExchangeRate: 1,
						IsFromMaterial: false,
						IsCopyFromPrcItem: false,
						MaterialPriceListId: null,
						HeaderId: selectedMaterial.ProjectFk,
						HeaderName: 'PrjMatPrcConditions',
						ProjectFk: selectedMaterial.ProjectFk,
						IsCopyFromBoqDivision:false,
						BasicPrcItemId : null
					};

					$http.post (url, param).then (function (result) { // PriceCondition of the Material Portion  Container
						let priceConditions = result.data.PriceConditions;
						if (priceConditions && priceConditions.length) {
							entity.PriceExtra = _.sumBy (priceConditions, function (item) {
								return item.PriceConditionType && item.PriceConditionType.IsPriceComponent && item.IsActivated ? item.Total : 0;
							});
							dataService.markItemAsModified (entity);
						}

						let col = '';
						if (entity.IsEstimatePrice && !entity.IsDayWorkRate) {
							col = 'IsEstimatePrice';
						} else if (!entity.IsEstimatePrice && entity.IsDayWorkRate) {
							col = 'IsDayWorkRate';
						}
						if (entity.IsEstimatePrice || entity.IsDayWorkRate) {
							projectMaterialPriceConditionServiceNew.handleRecalcuateDone (selectedMaterial, loadedData, selectedMaterial.PrcPriceConditionFk, col,'estimate');
							dataService.getParentService().gridRefresh();
						}
					});
				} else {
					entity.PriceExtra = 0;
					dataService.markItemAsModified (entity);

					let col = '';
					if (entity.IsEstimatePrice && !entity.IsDayWorkRate) {
						col = 'IsEstimatePrice';
					} else if (!entity.IsEstimatePrice && entity.IsDayWorkRate) {
						col = 'IsDayWorkRate';
					}
					if (entity.IsEstimatePrice || entity.IsDayWorkRate) {
						projectMaterialPriceConditionServiceNew.handleRecalcuateDone (selectedMaterial, loadedData, selectedMaterial.PrcPriceConditionFk, col,'estimate');
						dataService.getParentService().gridRefresh();
					}
				}
				defer.resolve (true);
				return defer.promise;
			};

			function setResourceInfoFromLookup(entity, lookupType, model) {
				entity.CostCode = _.toUpper (entity.CostCode);
				let asyncMarker = platformDataValidationService.registerAsyncCall (entity, entity.CostCode, model, dataService);
				asyncMarker.myPromise = $injector.get ('projectCostCodeLookupDataService').getEstCCByCodeAsync (entity).then (function (costCodeByCode) {
					if (_.isEmpty (costCodeByCode)) {

						let errorMessage = 'estimate.main.errors.codeNotFound';
						let errorObject = platformDataValidationService.createErrorObject(errorMessage);
						errorObject.valid = false;
						return $q.when (errorObject);

					} else {
						// Set to cache
						entity.CostPerUnit = costCodeByCode.Rate;
						entity.IsRefereToProjectCostCode = costCodeByCode.IsRefereToProjectCostCode;
						if(costCodeByCode.IsRefereToProjectCostCode){
							entity.Project2MdcCostCodeFk = costCodeByCode.OriginalPrjCostCodeId;
						}else{
							entity.MdcCostCodeFk = costCodeByCode.OriginalId;
						}
						return $q.when (true);
					}
				});
				return asyncMarker.myPromise;
			}

			service.validateCostCode = function validateCostCode(entity, value) {
				if(!value){
					entity.MdcCostCodeFk = null;
					entity.IsRefereToProjectCostCode = false;
					entity.Project2MdcCostCodeFk = null;
				}
				return true;
			};

			service.asyncValidateCostCode = function asyncValidateCostCode(entity, value, model) {
				entity[model] = value;

				let defer = $q.defer();
				let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);

				if(!value){
					asyncMarker.myPromise = $q.when(true);
				}else {
					dataService.fieldChanged(model,entity);
					defer.promise = setResourceInfoFromLookup(entity, 'estmdccostcodes',  model);
					asyncMarker.myPromise = defer.promise.then (function (result) {
						return platformDataValidationService.finishAsyncValidation (result, entity, value, model, asyncMarker, service, dataService);
					});
				}
				return asyncMarker.myPromise;
			};

			return service;
		}
	]);
})();
