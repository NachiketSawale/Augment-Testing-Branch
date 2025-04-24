/**
 * Created by baf on 24.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.wot';

	/**
	 * @ngdoc controller
	 * @name resourceWotOperationPlantTypeLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource wot operationPlantType entity.
	 **/
	angular.module(moduleName).service('resourceWotOperationPlantTypeLayoutService', ResourceWotOperationPlantTypeLayoutService);

	ResourceWotOperationPlantTypeLayoutService.$inject = ['platformUIConfigInitService', 'resourceWotContainerInformationService', 'resourceWotConstantValues', 'resourceWotTranslationService'];

	function ResourceWotOperationPlantTypeLayoutService(platformUIConfigInitService, resourceWotContainerInformationService, resourceWotConstantValues, resourceWotTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceWotContainerInformationService.getOperationPlantTypeLayout(),
			dtoSchemeId: resourceWotConstantValues.schemes.operationPlantType,
			translator: resourceWotTranslationService
		});
	}
})(angular);