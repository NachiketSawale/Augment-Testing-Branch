/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global  globals */
	'use strict';
	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc service
	 * @name basicsCostCodeskValidationService
	 * @description provides validation methods for CostCodes instances
	 */
	angular.module(moduleName).factory('basicsCostCodesPriceVersionListRecordValidationService',
		['_','$http', 'platformDataValidationService','basicsLookupdataLookupDescriptorService', 'basicsCostCodesPriceVersionListRecordDataService',
			function (_,$http, platformDataValidationService,basicsLookupdataLookupDescriptorService, dataService) {

				let service = {};

				function getParent(entity){
					return $http.post(globals.webApiBaseUrl + 'basics/costcodes/version/list/getparent', entity).then(function(response){
						return response.data;
					});
				}

				service.validateCostcodePriceVerFk = function validateRate(entity, value, model) {
					value = value > 0 ? value : null;
					let validateResult = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model,
						dataService.getList(), service, dataService);
					platformDataValidationService.finishValidation(validateResult, entity, value, model, service, dataService);
					if (validateResult.valid) {
						let priceVersion = _.find(basicsLookupdataLookupDescriptorService.getData('CostCodePriceVersion'), {Id: value});
						if (priceVersion) {
							entity.CurrencyFk = priceVersion.PriceListCurrencyFk;
						}
					}
					return validateResult;
				};

				service.asyncValidateCostcodePriceVerFk = function asyncValidateCostcodePriceVerFk(entity, value, model) {
					entity[model] = value;
					// get parent pricelist realfactor and calculate
					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					asyncMarker.myPromise = getParent(entity).then(function (result) {
						if(result){
							entity.RealFactorCost = result.RealFactorCost ? result.RealFactorCost * entity.FactorCost : entity.FactorCost;
							entity.RealFactorQuantity = result.RealFactorQuantity ? result.RealFactorQuantity * entity.FactorQuantity : entity.FactorQuantity;
						}
						let finalResult = platformDataValidationService.finishAsyncValidation({apply: true, valid: true, error: ''}, entity, value, model, asyncMarker, service, dataService);
						dataService.markItemAsModified(entity);
						return finalResult;
					});
					return asyncMarker.myPromise;
				};

				service.validateEntity = function validateEntity(entity) {
					service.validateCostcodePriceVerFk(entity, entity.CostcodePriceVerFk, 'CostcodePriceVerFk');
				};

				dataService.registerEntityCreated(function (e, entity) {
					service.validateEntity(entity);
				});

				service.asyncValidateFactorCost = function asyncValidateFactorCost(entity, value, model) {
					let validRes = platformDataValidationService.isEmptyProp(value);
					if(!validRes && value > 0){
						// get parent pricelist realfactor and calculate
						let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
						asyncMarker.myPromise = getParent(entity).then(function (result) {
							if(result){
								entity.RealFactorCost = result.RealFactorCost ? result.RealFactorCost * value : value;
							}
							let finalResult = platformDataValidationService.finishAsyncValidation({apply: true, valid: true, error: ''}, entity, value, model, asyncMarker, service, dataService);
							dataService.markItemAsModified(entity);
							return finalResult;
						});
						return asyncMarker.myPromise;
					}else{
						return platformDataValidationService.finishValidation({
							valid: false,
							error: '...',
							error$tr$: 'cloud.common.greaterValueErrorMessage',
							error$tr$param$: { object: model, value: '0' }
						}, entity, value, model, service, dataService);
					}
				};

				service.asyncValidateFactorQuantity = function asyncValidateFactorQuantity(entity, value, model) {
					let result = platformDataValidationService.isEmptyProp(value);
					if(!result && value > 0){
						// get parent pricelist realfactor and calculate
						let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
						asyncMarker.myPromise = getParent(entity).then(function(result){
							if(result){
								entity.RealFactorQuantity = result.RealFactorQuantity ? result.RealFactorQuantity * value : value;
							}
							let finalResult = platformDataValidationService.finishAsyncValidation({apply: true, valid: true, error: ''}, entity, value, model, asyncMarker, service, dataService);
							dataService.markItemAsModified(entity);
							return finalResult;
						});
						return asyncMarker.myPromise;
					}else{
						return platformDataValidationService.finishValidation({
							valid: false,
							error: '...',
							error$tr$: 'cloud.common.greaterValueErrorMessage',
							error$tr$param$: { object: model, value: '0' }
						}, entity, value, model, service, dataService);
					}
				};

				service.validateFactorHour = function validateFactorHour(entity, value, model) {
					let result = platformDataValidationService.isEmptyProp(value);
					if(!result && value > 0){
						return platformDataValidationService.finishValidation(true, entity, value, model, service, dataService);

					}else{
						return platformDataValidationService.finishValidation({
							valid: false,
							error: '...',
							error$tr$: 'cloud.common.greaterValueErrorMessage',
							error$tr$param$: { object: 'FactorCost', value: '0' }
						}, entity, value, model, service, dataService);
					}
				};

				return service;
			}
		]);
})(angular);
