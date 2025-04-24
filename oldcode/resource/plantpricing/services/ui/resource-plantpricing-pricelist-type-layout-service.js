/**
 * Created by baf on 05.07.2023
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.plantpricing';

	/**
	 * @ngdoc controller
	 * @name resourcePlantpricingPricelistTypeLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource plantpricing pricelistType entity.
	 **/
	angular.module(moduleName).service('resourcePlantpricingPricelistTypeLayoutService', ResourcePlantpricingPricelistTypeLayoutService);

	ResourcePlantpricingPricelistTypeLayoutService.$inject = ['platformUIConfigInitService', 'resourcePlantpricingContainerInformationService',
		'resourcePlantpricingConstantValues', 'resourcePlantpricingTranslationService'];

	function ResourcePlantpricingPricelistTypeLayoutService(platformUIConfigInitService, resourcePlantpricingContainerInformationService,
		resourcePlantpricingConstantValues, resourcePlantpricingTranslationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourcePlantpricingContainerInformationService.getPricelistTypeLayout(),
			dtoSchemeId: resourcePlantpricingConstantValues.schemes.pricelistType,
			translator: resourcePlantpricingTranslationService
		});
	}
})(angular);