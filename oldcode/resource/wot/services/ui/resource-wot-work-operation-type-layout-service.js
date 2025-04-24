/**
 * Created by baf on 24.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.wot';

	/**
	 * @ngdoc controller
	 * @name resourceWotWorkOperationTypeLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource wot workOperationType entity.
	 **/
	angular.module(moduleName).service('resourceWotWorkOperationTypeLayoutService', ResourceWotWorkOperationTypeLayoutService);

	ResourceWotWorkOperationTypeLayoutService.$inject = ['platformUIConfigInitService', 'resourceWotContainerInformationService', 'resourceWotConstantValues', 'resourceWotTranslationService'];

	function ResourceWotWorkOperationTypeLayoutService(platformUIConfigInitService, resourceWotContainerInformationService, resourceWotConstantValues, resourceWotTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceWotContainerInformationService.getWorkOperationTypeLayout(),
			dtoSchemeId: resourceWotConstantValues.schemes.workOperationType,
			translator: resourceWotTranslationService
		});
	}
})(angular);