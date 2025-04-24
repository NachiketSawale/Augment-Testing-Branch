/**
 * Created by jie on 04.03.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc controller
	 * @name ProcurementContractAddressLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  project main  entity.
	 **/
	angular.module(moduleName).service('procurementContractAddressService', ProcurementContractAddressLayoutService);

	ProcurementContractAddressLayoutService.$inject = ['platformUIConfigInitService', 'procurementContractAddressConfigurationService', 'projectMainTranslationService'];

	function ProcurementContractAddressLayoutService(platformUIConfigInitService, procurementContractAddressConfigurationService, projectMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: procurementContractAddressConfigurationService.getConfig(),
			dtoSchemeId: {
				moduleSubModule: 'Procurement.Common',
				typeName: 'BasicsAddressDto'
			},
			translator: projectMainTranslationService
		});
	}
})(angular);