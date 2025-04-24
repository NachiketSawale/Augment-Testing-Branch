/**
 * Created by baf on 01.02.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc controller
	 * @name resourceMasterDataContextLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource master dataContext entity.
	 **/
	angular.module(moduleName).service('resourceMasterDataContextLayoutService', ResourceMasterDataContextLayoutService);

	ResourceMasterDataContextLayoutService.$inject = ['platformUIConfigInitService', 'resourceMasterContainerInformationService', 'resourceMasterConstantValues', 'resourceMasterTranslationService'];

	function ResourceMasterDataContextLayoutService(platformUIConfigInitService, resourceMasterContainerInformationService, resourceMasterConstantValues, resourceMasterTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceMasterContainerInformationService.getMasterDataContextLayout(),
			dtoSchemeId: resourceMasterConstantValues.schemes.dataContext,
			translator: resourceMasterTranslationService
		});
	}
})(angular);