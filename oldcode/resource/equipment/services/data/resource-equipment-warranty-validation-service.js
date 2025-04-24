/**
 * Created by baf on 15.07.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentWarrantyValidationService
	 * @description provides validation methods for resource equipment warranty entities
	 */
	angular.module(moduleName).service('resourceEquipmentWarrantyValidationService', ResourceEquipmentWarrantyValidationService);

	ResourceEquipmentWarrantyValidationService.$inject = ['platformValidationServiceFactory', 'resourceEquipmentConstantValues', 'resourceEquipmentWarrantyDataService'];

	function ResourceEquipmentWarrantyValidationService(platformValidationServiceFactory, resourceEquipmentConstantValues, resourceEquipmentWarrantyDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceEquipmentConstantValues.schemes.plantWarranty, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceEquipmentConstantValues.schemes.plantWarranty)
		},
		self,
		resourceEquipmentWarrantyDataService);
	}
})(angular);
