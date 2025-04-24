/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainSplitLineItemQuantityValidationService
     * @function
     *
     * @description
     * This is the validation service to split LineItem by Percentage and Quantity.
     */
	angular.module(moduleName).factory('estimateMainSplitLineItemQuantityValidationService',
		['$q', '$http', '$injector', '$translate', 'platformDataServiceFactory', 'platformDataValidationService', 'PlatformMessenger', 'platformRuntimeDataService', 'estimateMainSplitLineItemQuantityDialogService', 'estimateMainCompleteCalculationService',
			function ($q, $http, $injector, $translate, platformDataServiceFactory, platformDataValidationService, PlatformMessenger, platformRuntimeDataService, dataDialogService, estimateMainCompleteCalculationService) {

				let service = {
					validateQuantityPercent: validateQuantityPercent,
					validateQuantityTotal: validateQuantityTotal,
					asyncValidateBoqItemFk: asyncValidateBoqItemFk,
					asyncValidateMdcControllingUnitFk: asyncValidateMdcControllingUnitFk,
					asyncValidatePsdActivityFk: asyncValidatePsdActivityFk,
					asyncValidatePrjLocationFk: asyncValidatePrjLocationFk
				};

				function validateQuantityPercent (entity, value, model, doCreateRefItem){
					let isValid = true;
					let result = {
						apply:true, valid:true
					};
					let valid = platformDataValidationService.isAmong(entity, value, model, 0, 100);
					isValid = angular.isObject(valid) ? valid.valid : valid;
					if (isValid) {
						let mainItem = dataDialogService.getMainItem();
						entity.QuantityPercent = value;
						entity.QuantityTotal = mainItem.QuantityTotal * value / 100;
						entity.EstLineItemFk = doCreateRefItem && !entity.IsMainItemToSplit ? dataDialogService.getMainItemId(mainItem) : entity.EstLineItemFk;
						dataDialogService.createSplitLineItem(entity, doCreateRefItem);
					}
					result.apply = false;
					result.valid = isValid;
					dataDialogService.assignReference(doCreateRefItem);
					return result;
				}

				function validateQuantityTotal (entity, value, model, doCreateRefItem,applySplitResultTo){
					let isValid = true;
					let result = {
						apply:true, valid:true
					};
					let mainItem = dataDialogService.getMainItem();
					let valid = platformDataValidationService.isAmong(entity, value, model, 0, mainItem.QuantityTotal);
					isValid = angular.isObject(valid) ? valid.valid : valid;
					if (isValid) {

						entity.QuantityTotal = value;
						entity.QuantityPercent = (value / mainItem.QuantityTotal * 100).toFixed($injector.get('estimateMainRoundingService').getRoundingDigits('Quantity')) - 0;
						entity.EstLineItemFk = doCreateRefItem && !entity.IsMainItemToSplit ? dataDialogService.getMainItemId(mainItem) : entity.EstLineItemFk;
						dataDialogService.createSplitLineItem(entity, doCreateRefItem,applySplitResultTo);
					}
					result.apply = false;
					result.valid = isValid;
					dataDialogService.assignReference(doCreateRefItem);
					return result;
				}

				function updateByEstConfigSorting(result, doCreateRefItem, entity, value, model,item,sourceStructure,modelObjects) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataDialogService);
					$injector.get('estimateMainValidationService').updateQuantityUomEstConfigSorting(entity, item,sourceStructure,modelObjects);

					if(model === 'BoqItemFk'){
						entity.OldBoqHeaderFk = angular.copy(item.BoqHeaderFk);
						entity.BoqHeaderFk = item.BoqHeaderFk;
					}

					return $q.when(true).then(function () {
						entity.QuantityTarget = !entity.QuantityTarget || entity.QuantityTarget <= 0 ? 1 : entity.QuantityTarget;
						entity.WqQuantityTarget = !entity.WqQuantityTarget || entity.WqQuantityTarget <= 0 ? 1 : entity.WqQuantityTarget;
						entity.QuantityTargetDetail = entity.QuantityTarget;
						entity.WqQuantityTargetDetail = entity.WqQuantityTarget;
						entity.GrandTotal = entity.IsGc || entity.IsIncluded || estimateMainCompleteCalculationService.isOptionItemWithoutIT(entity) ? 0 : entity.GrandTotal;
						dataDialogService.assignReference(doCreateRefItem);
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataDialogService);
					});
				}

				function asyncValidateBoqItemFk (entity, value, model, doCreateRefItem){
					let estimateMainTranslationService = $injector.get('estimateMainTranslationService');
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataDialogService);

					let estMainBoqLookupService = $injector.get('estimateMainBoqLookupService');

					let response = estMainBoqLookupService.getItemByIdAsync(value);
					let item = response.$$state.value ? response.$$state.value : null;
					let result = {apply: true, valid: true, error: ''};

					let isBoqSplitQuantityLinked = entity.BoqSplitQuantityFk !== null;
					if(isBoqSplitQuantityLinked && entity.BoqItemFk !== value){
						let translationSPlitQuantity = estimateMainTranslationService.getTranslationInformation('BoqSplitQuantityFkExist');

						entity.BoqHeaderFk = entity.OldBoqHeaderFk;
						result.valid = true;
						result.apply = false;
						result.error = $translate.instant(translationSPlitQuantity.location + '.' + translationSPlitQuantity.identifier);

						let translationHeader =  estimateMainTranslationService.getTranslationInformation('BoqSplitQuantityFkExistHeaderInfo');
						let headerMessage =  $translate.instant(translationHeader.location + '.' + translationHeader.identifier);
						$injector.get('platformDialogService').showMsgBox( result.error,  headerMessage, 'info');

						asyncMarker.myPromise = $q.when().then(function () {
							dataDialogService.assignReference(doCreateRefItem);
							return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataDialogService);
						});
						return asyncMarker.myPromise;
					}

					if (value === 0) {
						value = null;
					}
					let boqLineTypes = [0, 200, 201, 202, 203]; // boq position(0) and surcharge(200, 201, 202, 203) can assign to line item.
					if (item && boqLineTypes.indexOf(item.BoqLineTypeFk) === -1 ) {
						value = null;
						let translation = estimateMainTranslationService.getTranslationInformation('SelectBoqItemError');
						result.valid = false;
						result.error = $translate.instant(translation.location + '.' + translation.identifier);
					}

					if (item && item.Id) {
						let boqHeaderList = $injector.get('estimateMainBoqService').getBoqHeaderEntities();
						let boqHeader = _.find(boqHeaderList, {'Id': item.BoqHeaderFk});
						if (boqHeader) {
							entity.IsGc = boqHeader.IsGCBoq;
						}
						let mainItemId = dataDialogService.getMainItemId(entity);
						let readData ={ 'EstHeaderFk' : entity.EstHeaderFk,
							'EstLineItemFk': mainItemId };
						readData.Data = [];
						readData.Data.push({EstHeaderFk: entity.EstHeaderFk , EstLineItemFk : mainItemId});
						asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/listbyselection', readData).then(function (response) {
							// $injector.get('estimateMainValidationService').updateQuantityUomEstConfigSorting(entity, item,$injector.get('estimateMainParamStructureConstant').BoQs,response.data);
							return updateByEstConfigSorting(result, doCreateRefItem, entity, value, model,item,$injector.get('estimateMainParamStructureConstant').BoQs,response.data);
							// entity.OldBoqHeaderFk = angular.copy(item.BoqHeaderFk);
							// entity.BoqHeaderFk = item.BoqHeaderFk;
							//
							// entity.QuantityTarget = !entity.QuantityTarget || entity.QuantityTarget <= 0 ? 1 : entity.QuantityTarget;
							// entity.WqQuantityTarget = !entity.WqQuantityTarget || entity.WqQuantityTarget <= 0 ? 1 : entity.WqQuantityTarget;
							// entity.QuantityTargetDetail = entity.QuantityTarget;
							// entity.WqQuantityTargetDetail = entity.WqQuantityTarget;
							// entity.GrandTotal = entity.IsGc || entity.IsIncluded ? 0 : entity.GrandTotal;
							// dataDialogService.assignReference(doCreateRefItem);
							// platformRuntimeDataService.applyValidationResult(result, entity, model);
							// return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataDialogService);
						});
						return asyncMarker.myPromise;
					}else{
						entity.IsGc = false;
						dataDialogService.assignReference(doCreateRefItem);
					}
					// eslint-disable-next-line no-unreachable
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, service);

				}

				function asyncValidateMdcControllingUnitFk (entity, value, model, doCreateRefItem){
					let estMainControllingUnitLookupService = $injector.get('estimateMainControllingService');
					if (value) {
						return estMainControllingUnitLookupService.getControllingUnitById(value).then(function (controllingUnit) {
							if (controllingUnit) {
								let item = controllingUnit;
								let result = {apply: true, valid: true, error: ''};
								if (item && item.Id) {
									return updateByEstConfigSorting(result, doCreateRefItem, entity, value, model,item,$injector.get('estimateMainParamStructureConstant').Controllingunits);
								}
							}
						});
					}else{
						return $q.when(true);
					}
				}

				function asyncValidatePsdActivityFk (entity, value, model, doCreateRefItem){
					let estMainActivityLookupService = $injector.get('estimateMainActivityLookupService');
					let response = estMainActivityLookupService.getItemByIdAsync(value);
					let item = response.$$state.value ? response.$$state.value : null;
					let result = {apply: true, valid: true, error: ''};
					if (value === 0) {
						value = null;
					}
					if (item && item.Id) {
						return updateByEstConfigSorting(result,doCreateRefItem, entity, value, model,item,$injector.get('estimateMainParamStructureConstant').ActivitySchedule);
					}else{
						return $q.when(true);
					}
				}

				function asyncValidatePrjLocationFk (entity, value, model, doCreateRefItem){
					let estMainLocationLookupService = $injector.get('estimateMainLocationLookupService');
					let response = estMainLocationLookupService.getItemByIdAsync(value);
					let item = response.$$state.value ? response.$$state.value : null;
					let result = {apply: true, valid: true, error: ''};

					if (value === 0) {
						value = null;
					}
					if (item && item.Id) {
						return updateByEstConfigSorting(result,doCreateRefItem, entity, value, model,item,$injector.get('estimateMainParamStructureConstant').Location);
					}else{
						return $q.when(true);
					}
				}

				return service;
			}]);
})();
