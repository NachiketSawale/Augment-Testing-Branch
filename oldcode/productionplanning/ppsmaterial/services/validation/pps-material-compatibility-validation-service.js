(function (angular) {
	'use strict';
	/* global angular */
	/**
     * @ngdoc service
     * @name ppsMaterialCompatibilityValidationService
     * @description provides validation methods for master instances
     */
	var moduleName = 'productionplanning.ppsmaterial';
	angular.module(moduleName).factory('ppsMaterialCompatibilityValidationService', ppsMaterialCompatibilityValidationService);

	ppsMaterialCompatibilityValidationService.$inject = [
		'platformDataValidationService', 'ppsMaterialCompatibilityDataService'];

	function ppsMaterialCompatibilityValidationService(platformDataValidationService, dataService) {
		var service = {};
		service.validateMdcMaterialItemFk = function (entity, value, model) {
			value = value === 0 ? null : value;
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};
		return service;
	}
})(angular);
