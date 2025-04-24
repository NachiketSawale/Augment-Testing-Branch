(function (angular) {
	/*global angular*/
	'use strict';

	var moduleName = 'productionplanning.common';

	/**
	 * @ngdoc service
	 * @name ppsCommonEmployeeAssignmentValidationService
	 * @description provides validation methods for ppsCommonEmployeeAssignment entities
	 */
	angular.module(moduleName).service('ppsCommonEmployeeAssignmentValidationService', ['$injector', '$q', '$http',
		'platformDataValidationService','ppsCommonEmployeeAssignmentDataService',

		function ($injector, $q, $http,
			platformDataValidationService, dataService) {

			var service = {};

			service.validatePpsCostCodeFk = function (entity, value, model) {
				return service.validateForeignKeyFieldMandatory(entity, value, model, service, dataService);
			};

			service.validateBasSiteProdAreaFk = function (entity, value, model) {
				return service.validateForeignKeyFieldMandatory(entity, value, model, service, dataService);
			};
			service.validateTksEmployeeFk = function (entity, value, model) {
				return service.validateForeignKeyFieldMandatory(entity, value, model, service, dataService);
			};

			service.validatePercentage = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.validateForeignKeyFieldMandatory = function (entity, value, model, service, dataService) {
				value = value === 0? null : value;
				//validate mandatory of value
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			return service;
		}
	]);

})(angular);
