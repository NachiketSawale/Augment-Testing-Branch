/**
 * Created by chin-han.lai on 10/07/2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.plantpricing';

	/**
	 * @ngdoc controller
	 * @name resourcePlantpricingPricelistLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource plantpricing pricelist entity.
	 **/
	angular.module(moduleName).service('resourcePlantpricingPricelistLayoutService', ResourcePlantpricingPricelistLayoutService);

	ResourcePlantpricingPricelistLayoutService.$inject = ['platformUIConfigInitService', 'resourcePlantpricingContainerInformationService', 'resourcePlantpricingConstantValues', 'resourcePlantpricingTranslationService'];

	function ResourcePlantpricingPricelistLayoutService(platformUIConfigInitService, resourcePlantpricingContainerInformationService, resourcePlantpricingConstantValues, resourcePlantpricingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourcePlantpricingContainerInformationService.getPricelistLayout(),
			dtoSchemeId: resourcePlantpricingConstantValues.schemes.pricelist,
			translator: resourcePlantpricingTranslationService
		});
	}
})(angular);