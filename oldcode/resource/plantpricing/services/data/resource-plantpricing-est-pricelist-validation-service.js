/**
 * Created by chin-han.lai on 10/07/2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.plantpricing';

	/**
	 * @ngdoc service
	 * @name resourcePlantpricingEstPricelistValidationService
	 * @description provides validation methods for resource plantpricing estPricelist entities
	 */
	angular.module(moduleName).service('resourcePlantpricingEstPricelistValidationService', ResourcePlantpricingEstPricelistValidationService);

	ResourcePlantpricingEstPricelistValidationService.$inject = ['_', 'platformValidationServiceFactory', 'resourcePlantpricingConstantValues', 'resourcePlantpricingEstPricelistDataService'];

	function ResourcePlantpricingEstPricelistValidationService(_, platformValidationServiceFactory, resourcePlantpricingConstantValues, resourcePlantpricingEstPricelistDataService) {
		var self = this;

		function determineMandatoryProperties() {
			const mandatoryProperties = platformValidationServiceFactory.determineMandatoryProperties(resourcePlantpricingConstantValues.schemes.pricelist);

			if(_.findIndex(mandatoryProperties, function(m) { return m === 'EquipmentCalculationTypeFk'; }) === -1) {
				mandatoryProperties.push('EquipmentCalculationTypeFk');
			}

			if(_.findIndex(mandatoryProperties, function(m) { return m === 'EquipmentCatalogFk'; }) === -1) {
				mandatoryProperties.push('EquipmentCatalogFk');
			}

			return mandatoryProperties;
		}

		platformValidationServiceFactory.addValidationServiceInterface(resourcePlantpricingConstantValues.schemes.estPricelist, {
				mandatory: determineMandatoryProperties()
			},
			self,
			resourcePlantpricingEstPricelistDataService);
	}
})(angular);
