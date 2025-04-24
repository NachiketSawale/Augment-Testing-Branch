(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.shiftmodel';

	/**
	 * @ngdoc controller
	 * @name timekeepingShiftModelBreakLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping shiftModel2group entity.
	 **/
	angular.module(moduleName).service('timekeepingShiftModelBreakLayoutService', TimekeepingShiftModelBreakLayoutService);

	TimekeepingShiftModelBreakLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingShiftmodelContainerInformationService', 'timekeepingShiftModelConstantValues', 'timekeepingShiftModelTranslationService'];

	function TimekeepingShiftModelBreakLayoutService(platformUIConfigInitService, timekeepingShiftmodelContainerInformationService, timekeepingShiftModelConstantValues, timekeepingShiftModelTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingShiftmodelContainerInformationService.getShiftBreakLayout(),
			dtoSchemeId: timekeepingShiftModelConstantValues.schemes.break,
			translator: timekeepingShiftModelTranslationService
		});
	}
})(angular);