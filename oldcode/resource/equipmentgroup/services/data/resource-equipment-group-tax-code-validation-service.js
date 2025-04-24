/**
 * Created by cakiral on 03.02.2022
 */

(function (angular) {
	'use strict';
	let myModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupTaxCodeValidationService
	 * @description provides validation methods for resource equipment TaxCode entities
	 */
	myModule.service('resourceEquipmentGroupTaxCodeValidationService', ResourceEquipmentGroupTaxCodeValidationService);

	ResourceEquipmentGroupTaxCodeValidationService.$inject = ['platformValidationServiceFactory', 'resourceEquipmentGroupConstantValues', 'resourceEquipmentGroupTaxCodeDataService'];

	function ResourceEquipmentGroupTaxCodeValidationService(platformValidationServiceFactory, resourceEquipmentGroupConstantValues, resourceEquipmentGroupTaxCodeDataService) {
		let self = this;
		platformValidationServiceFactory.addValidationServiceInterface(
			resourceEquipmentGroupConstantValues.schemes.taxCode,
			{
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceEquipmentGroupConstantValues.schemes.taxCode)
			},
			self,
			resourceEquipmentGroupTaxCodeDataService);
	}
})(angular);