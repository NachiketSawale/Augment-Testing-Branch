/**
 * Created by baf on 29.07.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectEstimateHeaderLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource project estimateHeader entity.
	 **/
	angular.module(moduleName).service('resourceProjectEstimateHeaderLayoutService', ResourceProjectEstimateHeaderLayoutService);

	ResourceProjectEstimateHeaderLayoutService.$inject = ['platformUIConfigInitService', 'resourceProjectContainerInformationService', 'resourceProjectConstantValues', 'estimateMainTranslationService'];

	function ResourceProjectEstimateHeaderLayoutService(platformUIConfigInitService, resourceProjectContainerInformationService, resourceProjectConstantValues, estimateMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceProjectContainerInformationService.getEstimateHeaderLayout(),
			dtoSchemeId: resourceProjectConstantValues.schemes.estimateHeader,
			translator: estimateMainTranslationService
		});
	}
})(angular);