/**
 * Created by baf on 05.07.2023
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.plantpricing';

	/**
	 * @ngdoc service
	 * @name resourcePlantpricingPricelistTypeValidationService
	 * @description provides validation methods for resource plantpricing pricelistType entities
	 */
	angular.module(moduleName).service('resourcePlantpricingPricelistTypeValidationService', ResourcePlantpricingPricelistTypeValidationService);

	ResourcePlantpricingPricelistTypeValidationService.$inject = ['platformValidationServiceFactory', 'resourcePlantpricingConstantValues', 'resourcePlantpricingPricelistTypeDataService'];

	function ResourcePlantpricingPricelistTypeValidationService(platformValidationServiceFactory, resourcePlantpricingConstantValues, resourcePlantpricingPricelistTypeDataService) {
		const self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourcePlantpricingConstantValues.schemes.pricelistType, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourcePlantpricingConstantValues.schemes.pricelistType)
			},
			self,
			resourcePlantpricingPricelistTypeDataService);
	}
})(angular);
