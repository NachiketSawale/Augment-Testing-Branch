/**
 * Created by baf on 16.11.2017
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.componenttype';

	/**
	 * @ngdoc controller
	 * @name resourceComponentTypeLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource componenttype  entity.
	 **/
	angular.module(moduleName).service('resourceComponentTypeLayoutService', ResourceComponentTypeLayoutService);

	ResourceComponentTypeLayoutService.$inject = ['platformUIConfigInitService', 'resourceComponenttypeContainerInformationService', 'resourceComponentTypeTranslationService'];

	function ResourceComponentTypeLayoutService(platformUIConfigInitService, resourceComponentTypeContainerInformationService, resourceComponentTypeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceComponentTypeContainerInformationService.getResourceComponentTypeLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Resource.ComponentType',
				typeName: 'PlantComponentTypeDto'
			},
			translator: resourceComponentTypeTranslationService
		});
	}
})(angular);