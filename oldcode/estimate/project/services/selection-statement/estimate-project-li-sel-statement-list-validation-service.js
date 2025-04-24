/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.project';
	let projectMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainLiSelStatementListValidationService
	 * @description provides validation methods for relationship instances
	 */
	projectMainModule.factory('estimateProjectLiSelStatementListValidationService',
		['$q','$translate', '$http', '$injector', 'platformDataValidationService', 'estimateProjectEstimateLineItemSelStatementListService','estimateMainTranslationService','platformRuntimeDataService',
			function ($q,$translate, $http, $injector, platformDataValidationService, estimateProjectEstimateLineItemSelStatementListService,estimateMainTranslationService,platformRuntimeDataService) {

				let service = {};
				let boqLineTypes = [0, 200, 201, 202, 203]; // boq position(0) and surcharge(200, 201, 202, 203) can assign to line item.

				angular.extend(service, {
					validateCode: validateCode,
					asyncValidateCode: asyncValidateCode,
					validateWicItemFk: validateWicItemFk,
					getValidBoqLineTypes: getValidBoqLineTypes
				});

				return service;

				// gvj modified this on 9/17/2018, so developers can call boqLineTypes at other places.
				function getValidBoqLineTypes() {
					return boqLineTypes;
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
					}else{
						entity.WicCatFk = item.BoqWicCatFk;
						entity.WicHeaderItemFk = item.BoqHeaderFk;
					}

					if (item && boqLineTypes.indexOf(item.BoqLineTypeFk) === -1) {
						value = null;
						let translation = estimateMainTranslationService.getTranslationInformation('SelectBoqItemError');
						result.valid = false;
						result.error = $translate.instant(translation.location + '.' + translation.identifier);
					}

					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, estimateProjectEstimateLineItemSelStatementListService);
					return result;
				}
 
				function validateCode(entity, value, field) {
					let result= platformDataValidationService.validateMandatoryUniqEntity(entity, value, field, estimateProjectEstimateLineItemSelStatementListService.getList(), service, estimateProjectEstimateLineItemSelStatementListService);
					return platformDataValidationService.finishValidation(result, entity, value, field, service, estimateProjectEstimateLineItemSelStatementListService);
				}

				function asyncValidateCode(entity, value, model) {
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, estimateProjectEstimateLineItemSelStatementListService);

					let projectId = $injector.get('projectMainService').getSelected().Id;

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

						platformDataValidationService.finishAsyncValidation(res, entity, value, model, asyncMarker, service, estimateProjectEstimateLineItemSelStatementListService);
						return res;
					});

					return asyncMarker.myPromise;
				}
			}
		]);

})(angular);
