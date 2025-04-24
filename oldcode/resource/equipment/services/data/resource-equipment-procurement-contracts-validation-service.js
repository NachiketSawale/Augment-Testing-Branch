(function (angular) {
	/* global globals */
	'use strict';

	const equipmentName = 'resource.equipment';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentProcurementContractsValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(equipmentName).service('resourceEquipmentProcurementContractsValidationService', ResourceEquipmentProcurementContractsValidationService);

	ResourceEquipmentProcurementContractsValidationService.$inject = ['_', '$q', 'platformRuntimeDataService', 'platformDataValidationService','resourceEquipmentProcurementContractsDataService'];

	function ResourceEquipmentProcurementContractsValidationService(_, $q, platformRuntimeDataService, platformDataValidationService, resourceEquipmentProcurementContractsDataService) {

		let self = this;

	}
})(angular);