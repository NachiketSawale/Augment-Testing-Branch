/**
 * Created by Sudarshan on 30.08.2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.settlement';

	/**
	 * @ngdoc controller
	 * @name timekeepingSettlementLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping settlement entity.
	 **/
	angular.module(moduleName).service('timekeepingSettlementLayoutService', TimekeepingSettlementLayoutService);

	TimekeepingSettlementLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingSettlementContainerInformationService', 'timekeepingSettlementConstantValues', 'timekeepingSettlementTranslationService'];

	function TimekeepingSettlementLayoutService(platformUIConfigInitService, timekeepingSettlementContainerInformationService, timekeepingSettlementConstantValues, timekeepingSettlementTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingSettlementContainerInformationService.getSettlementLayout(),
			dtoSchemeId: timekeepingSettlementConstantValues.schemes.settlement,
			translator: timekeepingSettlementTranslationService
		});
	}
})(angular);