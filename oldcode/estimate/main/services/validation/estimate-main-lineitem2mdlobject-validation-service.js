/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';

	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainLineItem2MdlObjectValidationService
	 * @description provides validation methods for relationship instances
	 */
	estimateMainModule.factory('estimateMainLineItem2MdlObjectValidationService',
		['$q', '$http', '$injector', 'platformDataValidationService', 'platformRuntimeDataService', 'estimateMainLineItem2MdlObjectService',
			function ($q, $http, $injector, platformDataValidationService, platformRuntimeDataService, estimateMainLineItem2MdlObjectService) {

				let service = {};

				let mandatoryFields = [
					'Quantity', 'QuantityTarget', 'WqQuantityTarget'
				];

				let generateMandatory = function (field) {
					return function (entity, value) {
					// return platformDataValidationService.isMandatory(value, field);
					// sai.zhou, here add apply validation here
					// one problem found when used isMandatory, user delete the value and save it directly, the quantity seems turn wrong
						return platformDataValidationService.validateMandatory(entity, value, field, service, estimateMainLineItem2MdlObjectService);
					};
				};

				function valueChangeCalculation (entity, field){
					let serv = $injector.get('estimateMainLineitem2MdlObjectDetailService');
					return serv.valueChangeCallBack(entity, field);
				}

				let generateAsyncValidation = function (field) {
					return function generateAsyncValidation(entity, value) {
						let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, estimateMainLineItem2MdlObjectService);
						entity[field] = value;
						asyncMarker.myPromise = valueChangeCalculation(entity, field).then(function () {
						// Call the platformDataValidationService that everything is finished. Any error is handled before an update call is allowed
							return platformDataValidationService.finishAsyncValidation({valid:true}, entity, value, field, asyncMarker, service, estimateMainLineItem2MdlObjectService);
						});
						return asyncMarker.myPromise;
					};
				};

				service.validateQuantityDetail = function validateQuantityDetail(entity, value, field){
					let item = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateMainLineItem2MdlObjectService, true);
					if(item && item.valid){
						platformRuntimeDataService.applyValidationResult(item, entity, 'QuantityDetail');
						platformDataValidationService.finishAsyncValidation(item, entity, entity.QuantityDetail, 'QuantityDetail', null, service, estimateMainLineItem2MdlObjectService);
					}
					return item;
				};

				service.validateQuantityTargetDetail = function validateQuantityTargetDetail(entity, value, field){
					let item =  $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, estimateMainLineItem2MdlObjectService, true);
					if(item && item.valid){
						platformRuntimeDataService.applyValidationResult(item, entity, 'QuantityTargetDetail');
						platformDataValidationService.finishAsyncValidation(item, entity, entity.QuantityTargetDetail, 'QuantityTargetDetail', null, service, estimateMainLineItem2MdlObjectService);
					}
					return item;
				};

				_.each(mandatoryFields, function (field) {
					service['validate' + field] = generateMandatory(field);
					service['asyncValidate' + field] = generateAsyncValidation(field);
				});

				let commonValserv = $injector.get('estimateMainCommonFeaturesService');
				let asyncVal = commonValserv.getAsyncDetailValidation(estimateMainLineItem2MdlObjectService);
				angular.extend(service, asyncVal);

				return service;
			}
		]);

})(angular);
