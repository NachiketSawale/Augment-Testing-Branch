/**
 * Created by cakiral on 03.02.2022
 */

(function (angular) {
	'use strict';
	let myModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupTaxCodeLayoutService
	 * @description This service provides standard layout for grid / form of  resource equipment TaxCode entity.
	 */
	myModule.service('resourceEquipmentGroupTaxCodeLayoutService', ResourceEquipmentGroupTaxCodeLayoutService);

	ResourceEquipmentGroupTaxCodeLayoutService.$inject = ['platformUIConfigInitService','resourceEquipmentGroupConstantValues', 'resourceEquipmentGroupTranslationService', 'resourceEquipmentgroupContainerInformationService'];

	function ResourceEquipmentGroupTaxCodeLayoutService(platformUIConfigInitService, resourceEquipmentGroupConstantValues, resourceEquipmentGroupTranslationService, resourceEquipmentgroupContainerInformationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentgroupContainerInformationService.getTaxCodeLayout(),
			dtoSchemeId: resourceEquipmentGroupConstantValues.schemes.taxCode,
			translator: resourceEquipmentGroupTranslationService
		});
	}

})(angular);