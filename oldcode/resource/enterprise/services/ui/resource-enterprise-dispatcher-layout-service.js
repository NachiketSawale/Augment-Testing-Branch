/**
 * Created by baf on 05.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.enterprise';

	/**
	 * @ngdoc controller
	 * @name resourceEnterpriseLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  resource enterprise  entity.
	 **/
	angular.module(moduleName).service('resourceEnterpriseDispatcherLayoutService', ResourceEnterpriseDispatcherLayoutService);

	ResourceEnterpriseDispatcherLayoutService.$inject = ['platformUIConfigInitService', 'resourceEnterpriseContainerInformationService', 'resourceEnterpriseTranslationService'];

	function ResourceEnterpriseDispatcherLayoutService(platformUIConfigInitService, resourceEnterpriseContainerInformationService, resourceEnterpriseTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: resourceEnterpriseContainerInformationService.getResourceEnterpriseDispatcherLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Basics.Customize',
				typeName: 'BasicsCustomizeLogisticsDispatcherGroupDTO'
			},
			translator: resourceEnterpriseTranslationService
		});
	}
})(angular);