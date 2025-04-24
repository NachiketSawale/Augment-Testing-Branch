/**
 * Created by baf on 20.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentMeterReadingValidationService
	 * @description provides validation methods for resource equipment meterReading entities
	 */
	angular.module(moduleName).service('resourceEquipmentMeterReadingValidationService', ResourceEquipmentMeterReadingValidationService);

	ResourceEquipmentMeterReadingValidationService.$inject = ['platformValidationServiceFactory', 'resourceEquipmentConstantValues', 'resourceEquipmentMeterReadingDataService'];

	function ResourceEquipmentMeterReadingValidationService(platformValidationServiceFactory, resourceEquipmentConstantValues, resourceEquipmentMeterReadingDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceEquipmentConstantValues.schemes.meterReading, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceEquipmentConstantValues.schemes.meterReading)
			},
			self,
			resourceEquipmentMeterReadingDataService);
	}
})(angular);
