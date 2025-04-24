/**
 * Created by chin-han.lai on 10/07/2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.plantpricing';

	/**
	 * @ngdoc service
	 * @name resourcePlantpricingPricelistValidationService
	 * @description provides validation methods for resource plantpricing pricelist entities
	 */
	angular.module(moduleName).service('resourcePlantpricingPricelistValidationService', ResourcePlantpricingPricelistValidationService);

	ResourcePlantpricingPricelistValidationService.$inject = ['platformValidationServiceFactory', 'resourcePlantpricingConstantValues', 'resourcePlantpricingPricelistDataService'];

	function ResourcePlantpricingPricelistValidationService(platformValidationServiceFactory, resourcePlantpricingConstantValues, resourcePlantpricingPricelistDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourcePlantpricingConstantValues.schemes.pricelist, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourcePlantpricingConstantValues.schemes.pricelist)
			},
			self,
			resourcePlantpricingPricelistDataService);
	}
})(angular);
