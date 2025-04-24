/**
 * Created by chin-han.lai on 10/07/2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.plantpricing';

	/**
	 * @ngdoc controller
	 * @name resourcePlantpricingEstPricelistLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource plantpricing estPricelist entity.
	 **/
	angular.module(moduleName).service('resourcePlantpricingEstPricelistLayoutService', ResourcePlantpricingEstPricelistLayoutService);

	ResourcePlantpricingEstPricelistLayoutService.$inject = ['platformUIConfigInitService', 'resourcePlantpricingContainerInformationService', 'resourcePlantpricingConstantValues', 'resourcePlantpricingTranslationService'];

	function ResourcePlantpricingEstPricelistLayoutService(platformUIConfigInitService, resourcePlantpricingContainerInformationService, resourcePlantpricingConstantValues, resourcePlantpricingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourcePlantpricingContainerInformationService.getEstPricelistLayout(),
			dtoSchemeId: resourcePlantpricingConstantValues.schemes.estPricelist,
			translator: resourcePlantpricingTranslationService
		});
	}
})(angular);