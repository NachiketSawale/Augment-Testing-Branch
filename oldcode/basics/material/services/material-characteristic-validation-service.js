/**
 * Created on 19/9/2014.
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsMaterialCharacteristicValidationService
	 * @description provides validation methods for materialCharacteristic
	 */
	angular.module('basics.material').factory('basicsMaterialCharacteristicValidationService',
		['validationService', 'basicsMaterialCharacteristicService', 'platformDataValidationService','platformRuntimeDataService',
			function (validationService, dataService, platformDataValidationService,platformRuntimeDataService) {
				var service = validationService.create('materialCharacteristicItem', 'basics/material/characteristic/schema');

				service.validatePropertyDescription = function (entity, value) {
					var itemList=angular.copy(dataService.getList());
					var result = platformDataValidationService.isGroupUnique(itemList,
						{
							PropertyDescription:value,
							CharacteristicDescription:  entity.CharacteristicDescription
						},
						entity.Id,
						'cloud.common.towFiledUniqueValueErrorMessage',
						{field1: 'propertydescription', field2: 'characteristicdescription'}
					);
					if (result.valid) {
						service.removeError(entity);
					}
					platformRuntimeDataService.applyValidationResult(result, entity, 'PropertyDescription');
					platformDataValidationService.finishValidation(result, entity, value,'PropertyDescription', service, dataService);
					return result;
				};

				service.validateCharacteristicDescription = function (entity, value) {
					var itemList=angular.copy(dataService.getList());
					var result = platformDataValidationService.isGroupUnique(itemList,
						{
							PropertyDescription:entity.PropertyDescription,
							CharacteristicDescription: value
						},
						entity.Id,
						'cloud.common.towFiledUniqueValueErrorMessage',
						{field1: 'propertydescription', field2: 'characteristicdescription'}
					);
					if (result.valid) {
						service.removeError(entity);
					}
					platformRuntimeDataService.applyValidationResult(result, entity, 'CharacteristicDescription');
					platformDataValidationService.finishValidation(result, entity, value,'CharacteristicDescription', service, dataService);
					return result;
				};

				return service;
			}
		]);
})(angular);
