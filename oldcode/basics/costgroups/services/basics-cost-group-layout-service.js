/**
 * Created by lnt on 7/31/2019.
 */

(function (angular) {
	/*global angular*/
	'use strict';
	var moduleName = 'basics.costgroups';

	/**
	 * @ngdoc controller
	 * @name basicsCostGroupLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  basics costGroup entity.
	 **/
	angular.module(moduleName).service('basicsCostGroupLayoutService', BasicsCostGroupLayoutService);

	BasicsCostGroupLayoutService.$inject = ['platformUIConfigInitService', 'basicsCostgroupsContainerInformationService', 'basicsCostGroupsConstantValues', 'basicsCostgroupsTranslationService'];

	function BasicsCostGroupLayoutService(platformUIConfigInitService, basicsCostgroupsContainerInformationService, basicsCostGroupsConstantValues, basicsCostgroupsTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: basicsCostgroupsContainerInformationService.getCostGroupLayout(),
			dtoSchemeId: basicsCostGroupsConstantValues.schemes.costGroup,
			translator: basicsCostgroupsTranslationService
		});
	}
})(angular);