/**
 * Created by baf on 27.10.2017
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.catalog';

	/**
	 * @ngdoc controller
	 * @name resourceCatalogLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource catalog  entity.
	 **/
	angular.module(moduleName).service('resourceCatalogLayoutService', ResourceCatalogLayoutService);

	ResourceCatalogLayoutService.$inject = ['platformUIConfigInitService', 'resourceCatalogContainerInformationService', 'resourceCatalogTranslationService'];

	function ResourceCatalogLayoutService(platformUIConfigInitService, resourceCatalogContainerInformationService, resourceCatalogTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceCatalogContainerInformationService.getResourceCatalogLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Resource.Catalog',
				typeName: 'CatalogDto'
			},
			translator: resourceCatalogTranslationService
		});
	}

})(angular);