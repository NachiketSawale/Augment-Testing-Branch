/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainLiSelStatementListValidationService
	 * @description provides validation methods for relationship instances
	 */
	estimateMainModule.factory('estimateMainLiSelStatementListValidationService',
		['$q','$translate', '$http', '$injector', 'platformDataValidationService', 'estimateMainLineItemSelStatementListService','estimateMainTranslationService','platformRuntimeDataService',
			function ($q,$translate, $http, $injector, platformDataValidationService, estimateMainLineItemSelStatementListService,estimateMainTranslationService,platformRuntimeDataService) {

				let service = {};
				let boqLineTypes = [0,11, 200, 201, 202, 203]; // boq position(0) and surcharge(200, 201, 202, 203) can assign to line item.

				angular.extend(service, {
					validateCode: validateCode,
					asyncValidateCode: asyncValidateCode,
					validateWicItemFk: validateWicItemFk,
					validateBoqItemFk: validateBoqItemFk,
					getValidBoqLineTypes: getValidBoqLineTypes
				});

				return service;

				// gvj modified this on 9/17/2018, so developers can call boqLineTypes at other places.
				function getValidBoqLineTypes() {
					return boqLineTypes;
				}
				
				function validateBoqItemFk(entity, value, model){
					let estimateMainBoqItemService = $injector.get('estimateMainBoqItemService');
					let item = estimateMainBoqItemService.getItemById(value);
					
					let result = {apply: true, valid: true, error: ''};
					
					if (value === 0 || value === null){
						value = null;
						entity.BoqItemFk = null;
						entity.BoqHeaderItemFk = null;
					}
					
					if (item && boqLineTypes.indexOf(item.BoqLineTypeFk) === -1) {
						value = null;
						let translation = estimateMainTranslationService.getTranslationInformation('SelectItemRefError');
						result.valid = false;
						result.error = $translate.instant(translation.location + '.' + translation.identifier);
					}
					
					if (item && item.Id && item.BoqLineTypeFk === 0) {
						if (_.isArray(item.BoqItems) && item.BoqItems.length > 0) {
							let crbChildrens = _.filter(item.BoqItems,{'BoqLineTypeFk':11});
							if(crbChildrens && crbChildrens.length){
								let translation = estimateMainTranslationService.getTranslationInformation('subQuantityBoQItemsErrormsg');
								result.valid = false;
								result.error = $translate.instant(translation.location + '.' + translation.identifier);
							}
						}
					}
					
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, estimateMainLineItemSelStatementListService);
					return result;
					
				}

				function validateWicItemFk (entity, value, model) {
					let boqWicItemService = $injector.get('boqWicItemService');
					let response = boqWicItemService.getItemByIdAsync(value);
					let item = response.$$state.value ? response.$$state.value : null;
					let result = { apply: true, valid: true, error: '' };

					if (value === 0 || value === null){
						value = null;
						entity.WicCatFk = null;
						entity.WicHeaderItemFk = null;
					}

					if (item && boqLineTypes.indexOf(item.BoqLineTypeFk) === -1) {
						value = null;
						let translation = estimateMainTranslationService.getTranslationInformation('SelectBoqItemError');
						result.valid = false;
						result.error = $translate.instant(translation.location + '.' + translation.identifier);
					}
					
					if (item && item.Id && item.BoqLineTypeFk === 0) {
						// if position boq contains sub quantity, can not assign lineItem to BoqItem which contains sub quantity items.
						if (_.isArray(item.BoqItems) && item.BoqItems.length > 0) {
							
							let crbChildrens = _.filter(item.BoqItems,{'BoqLineTypeFk':11});
							if(crbChildrens && crbChildrens.length){
								let translation = estimateMainTranslationService.getTranslationInformation('subQuantityBoQItemsErrormsg');
								result.valid = false;
								result.error = $translate.instant(translation.location + '.' + translation.identifier);
							}
						}
					}
					
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, estimateMainLineItemSelStatementListService);
					return result;
				}

				function validateCode(entity, value, field) {
					let result= platformDataValidationService.validateMandatoryUniqEntity(entity, value, field, estimateMainLineItemSelStatementListService.getList(), service, estimateMainLineItemSelStatementListService);
					return platformDataValidationService.finishValidation(result, entity, value, field, service, estimateMainLineItemSelStatementListService);
				}

				function asyncValidateCode(entity, value, model) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, estimateMainLineItemSelStatementListService);

					let projectId = null;
					let mainViewService = $injector.get('mainViewService');

					if (mainViewService.getCurrentModuleName() === moduleName){
						projectId = $injector.get('estimateMainService').getSelectedProjectId();
					}else{
						projectId = $injector.get('projectMainService').getSelected().Id;
					}

					let postData = {
						PrjProjectFk: projectId,
						Id: entity.Id,
						Code: value
					};

					asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'estimate/main/selstatement/isuniquecode', postData).then(function (response) {
						let res = {};
						if (response.data) {
							res.valid = true;
						} else {
							res.valid = false;
							res.apply = true;
							res.error$tr$ = moduleName + '.errors.uniqCode';
						}

						platformDataValidationService.finishAsyncValidation(res, entity, value, model, asyncMarker, service, estimateMainLineItemSelStatementListService);
						return res;
					});

					return asyncMarker.myPromise;
				}
			}
		]);

})(angular);
