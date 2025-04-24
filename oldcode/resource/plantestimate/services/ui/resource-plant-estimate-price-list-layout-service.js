/**
 * Created by nitsche on 15.11.2021
 */

(function (angular) {
	'use strict';
	let myModule = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourcePlantEstimatePriceListLayoutService
	 * @description This service provides standard layout for grid / form of  resource equipment Plant2EstimatePriceList entity.
	 */
	myModule.service('resourcePlantEstimatePriceListLayoutService', ResourcePlantEstimatePriceListLayoutService);

	ResourcePlantEstimatePriceListLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentTranslationService', 'resourcePlantEstimateConstantValues',
		'resourcePlantestimateContainerInformationService'];

	function ResourcePlantEstimatePriceListLayoutService(platformUIConfigInitService, resourceEquipmentTranslationService, resourcePlantEstimateConstantValues,
	  resourcePlantestimateContainerInformationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourcePlantestimateContainerInformationService.getPlantEstimatePriceListLayout(),
			dtoSchemeId: resourcePlantEstimateConstantValues.schemes.plantEstimatePriceList,
			translator: resourceEquipmentTranslationService
		});
	}
})(angular);