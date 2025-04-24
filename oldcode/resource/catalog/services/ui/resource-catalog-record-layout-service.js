/**
 * Created by baf on 02.11.2017
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.catalog';

	/**
	 * @ngdoc controller
	 * @name resourceCatalogRecordLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource catalog record entity.
	 **/
	angular.module(moduleName).service('resourceCatalogRecordLayoutService', ResourceCatalogRecordLayoutService);

	ResourceCatalogRecordLayoutService.$inject = ['platformUIConfigInitService', 'resourceCatalogContainerInformationService', 'resourceCatalogTranslationService'];

	function ResourceCatalogRecordLayoutService(platformUIConfigInitService, resourceCatalogContainerInformationService, resourceCatalogTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceCatalogContainerInformationService.getResourceCatalogRecordLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Resource.Catalog',
				typeName: 'CatalogRecordDto'
			},
			translator: resourceCatalogTranslationService
		});
	}
})(angular);