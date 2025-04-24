/**
 * Created by baf on 07.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.catalog';

	/**
	 * @ngdoc controller
	 * @name resourceCatalogPriceIndexLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource catalog priceIndex entity.
	 **/
	angular.module(moduleName).service('resourceCatalogPriceIndexLayoutService', ResourceCatalogPriceIndexLayoutService);

	ResourceCatalogPriceIndexLayoutService.$inject = ['platformUIConfigInitService', 'resourceCatalogContainerInformationService', 'resourceCatalogConstantValues', 'resourceCatalogTranslationService'];

	function ResourceCatalogPriceIndexLayoutService(platformUIConfigInitService, resourceCatalogContainerInformationService, resourceCatalogConstantValues, resourceCatalogTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceCatalogContainerInformationService.getPriceIndexLayout(),
			dtoSchemeId: resourceCatalogConstantValues.schemes.priceIndex,
			translator: resourceCatalogTranslationService
		});
	}
})(angular);