/**
 * Created by anl on 4/3/2019.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).factory('productionpalnningAccountingRuleValidationService', RuleValidationService);

	RuleValidationService.$inject = ['platformDataValidationService',
		'productionplanningAccountingRuleDataService'];

	function RuleValidationService(platformDataValidationService, ruleDataService) {

		function createService(dataService) {

			dataService = dataService || ruleDataService;
			var service = {};

			service.validateRuleTypeFk = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.validateImportFormatFk = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.validateMatchFieldFk = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			return service;
		}

		var serviceCache = {};

		function getService(dataService) {
			var key = dataService.getServiceName();
			if (!serviceCache[key]) {
				serviceCache[key] = createService(dataService);
			}
			return serviceCache[key];
		}

		var service = createService();
		service.getService = getService;
		return service;
	}

})(angular);