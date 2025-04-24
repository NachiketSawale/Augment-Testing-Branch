(function (angular) {
	'use strict';
	/* global angular */
	/**
     * @ngdoc service
     * @name phaseReqTemplateValidationService
     * @description provides validation methods for master instances
     */
	var moduleName = 'productionplanning.processconfiguration';
	angular.module(moduleName).factory('productPhaseRequirementValidationService', phaseRequirementValidationService);

	phaseRequirementValidationService.$inject = [
		'platformDataValidationService', 'productPhaseRequirementDataService'];

	function phaseRequirementValidationService(platformDataValidationService, dataService) {
		var service = {};
		service.validatePpsUpstreamGoodsTypeFk = function (entity, value, model) {
			value = value === 0 ? null : value;
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};
		service.validateRequirementGoods = function (entity, value, model) {
			value = value === 0 ? null : value;
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};
		service.validateBasUomFk = function (entity, value, model) {
			value = value === 0 ? null : value;
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};
		return service;
	}
})(angular);
