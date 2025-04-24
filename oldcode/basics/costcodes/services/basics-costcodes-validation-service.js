/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCostCodeskValidationService
	 * @description provides validation methods for CostCodes instances
	 */
	angular.module('basics.costcodes').factory('basicsCostCodesValidationService', ['$injector', 'platformDataValidationService', 'basicsCostCodesMainService', 'hourfactorReadonlyProcessor',

		function ($injector, platformDataValidationService, basicsCostCodesMainService, hourfactorReadonlyProcessor) {

			let service = {};

			service.validateCode = function validateCode(entity, value) {
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'Code', basicsCostCodesMainService.getList(), service, basicsCostCodesMainService);
			};

			service.validateRate = function validateRate(entity, value) {
				return platformDataValidationService.isMandatory(value, 'Rate');
			};

			service.validateFactorCosts = function validateFactorCosts(entity, value) {
				return platformDataValidationService.isMandatory(value, 'FactorCosts');
			};

			service.validateFactorQuantity = function validateFactorQuantity(entity, value) {
				return platformDataValidationService.isMandatory(value, 'FactorQuantity');
			};

			service.validateIsLabour = function validateIsLabour(entity, value, model) {
				hourfactorReadonlyProcessor.setHourfactorReadonly(entity, !value);
				hourfactorReadonlyProcessor.processIsEditable(entity, value, model);
				if(!value){
					entity.FactorHour = 1;
				}
				return platformDataValidationService.isMandatory(value, 'IsLabour');
			};

			function validateChildren(entity, value, model) {
				let cloudCommonGridService = $injector.get('cloudCommonGridService');
				let children = cloudCommonGridService.getAllChildren(entity, 'CostCodes');
				angular.forEach(children, function(ch){
					if(ch){
						ch[model] = value;
						basicsCostCodesMainService.markItemAsModified(ch);
					}
				});
				return !platformDataValidationService.isEmptyProp(value, model);
			}

			service.validateIsBudget = function validateIsBudget(entity, value, model) {
				return validateChildren(entity, value, model);
			};

			service.validateIsCost = function validateIsCost(entity, value, model) {
				return validateChildren(entity, value, model);
			};

			service.validateIsRate = function validateIsRate(entity, value, model) {
				hourfactorReadonlyProcessor.processIsEditable(entity, value, model);
				return !platformDataValidationService.isEmptyProp(value, model);
			};

			service.validateIsEditable = function validateIsEditable(entity, value, model) {
				hourfactorReadonlyProcessor.processIsEditable(entity, value, model);
				return !platformDataValidationService.isEmptyProp(value, model);
			};

			return service;
		}
	]);
})(angular);
