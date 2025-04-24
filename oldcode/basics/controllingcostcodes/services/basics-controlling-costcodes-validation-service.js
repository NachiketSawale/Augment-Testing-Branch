/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.controllingcostcodes';

	angular.module(moduleName).factory('basicsControllingCostCodesValidationService', ['platformDataValidationService', 'basicsControllingCostCodesMainService',
		function (platformDataValidationService, basicsControllingCostCodesMainService) {
			let service = {};


			service.validateCode = function validateCode(entity, value) {
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'Code', basicsControllingCostCodesMainService.getList(), service, basicsControllingCostCodesMainService);
			};

			service.validateUomFK = function validateCode(entity, value) {
				return platformDataValidationService.validateMandatory(entity, value, 'UomFK', service, basicsControllingCostCodesMainService);
			};

			service.asyncValidateCode = function asyncValidateCode(entity, value, model) {
				return platformDataValidationService.asyncValidateIsUnique(globals.webApiBaseUrl + 'basics/controllingcostcodes/isuniquecode', entity, model, value, service, basicsControllingCostCodesMainService);
			};

			return service;
		}]);
})(angular);