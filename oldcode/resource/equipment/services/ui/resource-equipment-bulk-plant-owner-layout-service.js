/**
 * Created by nitsche on 04.02.2025
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let module = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentBulkPlantOwnerLayoutService
	 * @description This service provides standard layout for grid / form of  resource equipment BulkPlantOwner entity.
	 */
	module.service('resourceEquipmentBulkPlantOwnerLayoutService', ResourceEquipmentBulkPlantOwnerLayoutService);

	ResourceEquipmentBulkPlantOwnerLayoutService.$inject = ['resourceEquipmentConstantValues', 'resourceEquipmentTranslationService', 'platformUIConfigInitService', 'resourceEquipmentContainerInformationService'];

	function ResourceEquipmentBulkPlantOwnerLayoutService(resourceEquipmentConstantValues, resourceEquipmentTranslationService, platformUIConfigInitService, resourceEquipmentContainerInformationService) {
		let self = this;
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentContainerInformationService.getBulkPlantOwnerLayout(),
			dtoSchemeId: resourceEquipmentConstantValues.schemes.bulkPlantOwner,
			translator: resourceEquipmentTranslationService
		});
	}
})(angular);