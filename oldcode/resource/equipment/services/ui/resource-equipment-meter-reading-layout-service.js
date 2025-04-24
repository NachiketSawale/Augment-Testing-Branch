/**
 * Created by baf on 20.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentMeterReadingLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource equipment meterReading entity.
	 **/
	angular.module(moduleName).service('resourceEquipmentMeterReadingLayoutService', ResourceEquipmentMeterReadingLayoutService);

	ResourceEquipmentMeterReadingLayoutService.$inject = ['platformUIConfigInitService', 'resourceEquipmentContainerInformationService', 'resourceEquipmentConstantValues', 'resourceEquipmentTranslationService'];

	function ResourceEquipmentMeterReadingLayoutService(platformUIConfigInitService, resourceEquipmentContainerInformationService, resourceEquipmentConstantValues, resourceEquipmentTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEquipmentContainerInformationService.getMeterReadingLayout(),
			dtoSchemeId: resourceEquipmentConstantValues.schemes.meterReading,
			translator: resourceEquipmentTranslationService
		});
	}
})(angular);