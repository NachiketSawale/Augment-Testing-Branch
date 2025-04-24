/**
 * Created by baf on 03.12.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc controller
	 * @name resourceMasterResourcePartLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource master resourcePart entity.
	 **/
	angular.module(moduleName).service('resourceMasterResourcePartLayoutService', ResourceMasterResourcePartLayoutService);

	ResourceMasterResourcePartLayoutService.$inject = ['platformUIConfigInitService', 'resourceMasterContainerInformationService', 'resourceMasterConstantValues', 'resourceMasterTranslationService'];

	function ResourceMasterResourcePartLayoutService(platformUIConfigInitService, resourceMasterContainerInformationService, resourceMasterConstantValues, resourceMasterTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceMasterContainerInformationService.getResourcePartLayout(),
			dtoSchemeId: resourceMasterConstantValues.schemes.resourcePart,
			translator: resourceMasterTranslationService
		});
	}
})(angular);