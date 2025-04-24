/**
 * Created by cakiral on 30.07.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectPlantCostCodeLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource project plantCostCode entity.
	 **/
	angular.module(moduleName).service('resourceProjectPlantCostCodeLayoutService', ResourceProjectPlantCostCodeLayoutService);

	ResourceProjectPlantCostCodeLayoutService.$inject = ['platformUIConfigInitService', 'resourceProjectContainerInformationService', 'resourceProjectConstantValues', 'resourceProjectTranslationService'];

	function ResourceProjectPlantCostCodeLayoutService(platformUIConfigInitService, resourceProjectContainerInformationService, resourceProjectConstantValues, resourceProjectTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceProjectContainerInformationService.getPlantCostCodeLayout(),
			dtoSchemeId: resourceProjectConstantValues.schemes.plantCostCode,
			translator: resourceProjectTranslationService
		});
	}
})(angular);