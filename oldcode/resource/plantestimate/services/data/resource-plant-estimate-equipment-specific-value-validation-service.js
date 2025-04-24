/**
 * Created by Nikhil on 18.08.2023
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.plantestimate';

	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateEquipmentSpecificValueValidationService
	 * @description provides validation methods for resource equipment specificValue entities
	 */
	angular.module(moduleName).service('resourcePlantEstimateEquipmentSpecificValueValidationService', ResourcePlantEstimateEquipmentSpecificValueValidationService);

	ResourcePlantEstimateEquipmentSpecificValueValidationService.$inject = ['platformValidationServiceFactory', 'basicsLookupdataSimpleLookupService',
		'resourcePlantEstimateConstantValues', 'resourcePlantEstimateEquipmentSpecificValueDataService'];

	function ResourcePlantEstimateEquipmentSpecificValueValidationService(platformValidationServiceFactory, basicsLookupdataSimpleLookupService,
	  resourcePlantEstimateConstantValues, resourcePlantEstimateEquipmentSpecificValueDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourcePlantEstimateConstantValues.schemes.specificValue, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourcePlantEstimateConstantValues.schemes.specificValue)
			},
			self,
			resourcePlantEstimateEquipmentSpecificValueDataService);


		this.validateAdditionalSpecificValueTypefkFk = function validateAdditionalSpecificValueTypefkFk(entity, value) {
			let valueType = basicsLookupdataSimpleLookupService.getItemById(value, { lookupModuleQualifier: 'basics.customize.specificvaluetype' });
			if(valueType) {
				entity.UomFromTypeFK = valueType.UomFk;
			}

			return true;
		};
	}
})(angular);
