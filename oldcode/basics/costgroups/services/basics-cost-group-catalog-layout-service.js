/**
 * Created by lnt on 7/31/2019.
 */

(function (angular) {
	/* global angular */
	'use strict';
	var moduleName = 'basics.costgroups';

	/**
	 * @ngdoc controller
	 * @name basiceCostGroupCatalogLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  basics costGroupCatalog entity.
	 **/
	angular.module(moduleName).service('basiceCostGroupCatalogLayoutService', BasiceCostGroupCatalogLayoutService);

	BasiceCostGroupCatalogLayoutService.$inject = ['platformUIConfigInitService', 'basicsCostgroupsContainerInformationService', 'basicsCostGroupsConstantValues', 'basicsCostgroupsTranslationService'];

	function BasiceCostGroupCatalogLayoutService(platformUIConfigInitService, basicsCostgroupsContainerInformationService, basicsCostGroupsConstantValues, basicsCostgroupsTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: basicsCostgroupsContainerInformationService.getCostGroupCatalogLayout(),
			dtoSchemeId: basicsCostGroupsConstantValues.schemes.costGroupCatalog,
			translator: basicsCostgroupsTranslationService
		});
	}
})(angular);