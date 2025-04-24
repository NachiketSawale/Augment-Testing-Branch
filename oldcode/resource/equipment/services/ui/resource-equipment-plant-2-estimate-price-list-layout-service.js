/**
 * Created by nitsche on 15.11.2021
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let myModule = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlant2EstimatePriceListLayoutService
	 * @description This service provides standard layout for grid / form of  resource equipment Plant2EstimatePriceList entity.
	 */
	myModule.service('resourceEquipmentPlant2EstimatePriceListLayoutService', ResourceEquipmentPlant2EstimatePriceListLayoutService);

	ResourceEquipmentPlant2EstimatePriceListLayoutService.$inject = ['resourceEquipmentConstantValues', 'resourceEquipmentTranslationService', 'platformUIConfigInitService', 'resourceEquipmentContainerInformationService'];

	function ResourceEquipmentPlant2EstimatePriceListLayoutService(resourceEquipmentConstantValues, resourceEquipmentTranslationService, platformUIConfigInitService, resourceEquipmentContainerInformationService) {
		let self = this;
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentContainerInformationService.getPlant2EstimatePriceListLayout(),
			dtoSchemeId: resourceEquipmentConstantValues.schemes.plant2EstimatePriceList,
			translator: resourceEquipmentTranslationService
		});
	}
})(angular);