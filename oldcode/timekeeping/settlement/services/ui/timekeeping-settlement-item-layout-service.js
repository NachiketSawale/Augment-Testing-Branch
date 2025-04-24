/**
 * Created by Sudarshan on 30.08.2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.settlement';

	/**
	 * @ngdoc controller
	 * @name timekeepingSettlementItemLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping settlement entity.
	 **/
	angular.module(moduleName).service('timekeepingSettlementItemLayoutService', TimekeepingSettlementItemLayoutService);

	TimekeepingSettlementItemLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingSettlementContainerInformationService', 'timekeepingSettlementConstantValues', 'timekeepingSettlementTranslationService'];

	function TimekeepingSettlementItemLayoutService(platformUIConfigInitService, timekeepingSettlementContainerInformationService, timekeepingSettlementConstantValues, timekeepingSettlementTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingSettlementContainerInformationService.getItemLayout(),
			dtoSchemeId: timekeepingSettlementConstantValues.schemes.item,
			translator: timekeepingSettlementTranslationService
		});
	}
})(angular);