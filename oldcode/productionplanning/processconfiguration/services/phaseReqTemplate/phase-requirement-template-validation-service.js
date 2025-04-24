(function (angular) {
	'use strict';
	/* global angular */
	/**
     * @ngdoc service
     * @name phaseReqTemplateValidationService
     * @description provides validation methods for master instances
     */
	var moduleName = 'productionplanning.processconfiguration';
	angular.module(moduleName).factory('phaseReqTemplateValidationService', phaseReqTemplateValidationService);

	phaseReqTemplateValidationService.$inject = [
		'platformDataValidationService', 'phaseReqTemplateDataService'];

	function phaseReqTemplateValidationService(platformDataValidationService, dataService) {
		var service = {};
		service.validateUpstreamGoodsTypeFk = function (entity, value, model) {
			value = value === 0 ? null : value;
			return platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
		};
		service.validateUpstreamGoods = function (entity, value, model) {
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
