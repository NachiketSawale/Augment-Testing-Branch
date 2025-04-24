/**
 * Created by lsi on 7/4/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.pes';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementPesSelfBillingValidationService',
		['$http','$timeout','$translate','platformDataValidationService', 'platformRuntimeDataService',
			function ($http,$timeout,$translate,platformDataValidationService, platformRuntimeDataService) {
				return function (dataService) {
					var service = {};
					service.validateCode = function (currentItem, value, field) {
						var result = true;
						if(!value){
							result = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage',{fieldName : field.toLowerCase()},true);
						}
						platformRuntimeDataService.applyValidationResult(result, currentItem, 'Code');
						platformDataValidationService.finishValidation(result, currentItem, value, field, service, dataService);
						return result;
					};
					service.validateDeliveredFromDate = function (entity, value, model) {
						return platformDataValidationService.validatePeriod(value, entity.DeliveredDate, entity, model, service, dataService, 'DeliveredDate');
					};
					service.validateDeliveredDate = function (entity, value, model) {
						return platformDataValidationService.validatePeriod(entity.DeliveredFromDate, value, entity, model, service, dataService, 'DeliveredFromDate');
					};
					return service;
				};
			}
		]);
})(angular);

