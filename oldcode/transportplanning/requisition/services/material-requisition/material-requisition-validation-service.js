/**
 * Created by anl on 11/14/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).factory('transportplanningRequisitionMatRequisitionValidationService', MatRequisitionValidationService);

	MatRequisitionValidationService.$inject = ['platformDataValidationService'];

	function MatRequisitionValidationService(platformDataValidationService) {

		var serviceCache = {};

		function createService(dataService) {
			var service = {};

			service.validateQuantity = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.validateMdcMaterialFk = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			service.validateTrsRequisitionFk = function (entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
			};

			return service;
		}

		function getService(key, dataService) {
			if (_.isNil(serviceCache[key])) {
				serviceCache[key] = createService(dataService);
			}
			return serviceCache[key];
		}

		return {
			getService: getService
		};
	}
})(angular);

