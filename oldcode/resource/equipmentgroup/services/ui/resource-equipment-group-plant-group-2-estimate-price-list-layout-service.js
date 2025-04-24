/**
 * Created by nitsche on 15.11.2021
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let myModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupPlantGroup2EstimatePriceListLayoutService
	 * @description This service provides standard layout for grid / form of  resource equipment PlantGroup2EstimatePriceList entity.
	 */
	myModule.service('resourceEquipmentGroupPlantGroup2EstimatePriceListLayoutService', ResourceEquipmentGroupPlantGroup2EstimatePriceListLayoutService);

	ResourceEquipmentGroupPlantGroup2EstimatePriceListLayoutService.$inject = ['resourceEquipmentGroupConstantValues', 'resourceEquipmentGroupTranslationService', 'platformUIConfigInitService', 'resourceEquipmentgroupContainerInformationService'];

	function ResourceEquipmentGroupPlantGroup2EstimatePriceListLayoutService(resourceEquipmentGroupConstantValues, resourceEquipmentGroupTranslationService, platformUIConfigInitService, resourceEquipmentgroupContainerInformationService) {
		let self = this;
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentgroupContainerInformationService.getPlantGroup2EstimatePriceListLayout(),
			dtoSchemeId: resourceEquipmentGroupConstantValues.schemes.plantGroup2EstimatePriceList,
			translator: resourceEquipmentGroupTranslationService
		});
	}
})(angular);