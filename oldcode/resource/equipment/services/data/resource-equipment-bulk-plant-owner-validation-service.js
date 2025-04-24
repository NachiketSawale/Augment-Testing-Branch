/**
 * Created by nitsche on 04.02.2025
 */

(function (angular) {
	/* global globals */
	'use strict';
	let module = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentBulkPlantOwnerValidationService
	 * @description provides validation methods for resource equipment BulkPlantOwner entities
	 */
	module.service('resourceEquipmentBulkPlantOwnerValidationService', ResourceEquipmentBulkPlantOwnerValidationService);

	ResourceEquipmentBulkPlantOwnerValidationService.$inject = ['platformValidationServiceFactory', 'resourceEquipmentConstantValues', 'resourceEquipmentBulkPlantOwnerDataService'];

	function ResourceEquipmentBulkPlantOwnerValidationService(platformValidationServiceFactory, resourceEquipmentConstantValues, resourceEquipmentBulkPlantOwnerDataService) {
		let self = this;
		platformValidationServiceFactory.addValidationServiceInterface(
			resourceEquipmentConstantValues.schemes.bulkPlantOwner, 
			{
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceEquipmentConstantValues.schemes.bulkPlantOwner)
			},
			self,
			resourceEquipmentBulkPlantOwnerDataService);
	}
})(angular);