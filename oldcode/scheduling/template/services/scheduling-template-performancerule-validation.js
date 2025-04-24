/**
 * Created by leo on 23.03.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingTemplatePerformanceRuleValidationService
	 * @description provides validation methods for performance rule instances
	 */
	angular.module('scheduling.template').factory('schedulingTemplatePerformanceRuleValidationService', ['$injector', 'platformDataValidationService',

		function ($injector, platformDataValidationService) {

			var service = {};

			service.validateCode = function (entity, value, model) {
				var dataService = $injector.get('schedulingTemplatePerformanceRuleService');
				var items = dataService.getList();

				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, service, dataService);
			};

			service.validatePerformanceSheetFk = function (entity, value, model) {
				var dataService = $injector.get('schedulingTemplatePerformanceRuleService');
				var items = dataService.getList();

				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, service, dataService);
			};

			return service;
		}

	]);

})(angular);
