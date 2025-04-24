(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.shiftmodel';

	/**
	 * @ngdoc controller
	 * @name timekeepingShiftModel2GroupLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping shiftModel2group entity.
	 **/
	angular.module(moduleName).service('timekeepingShiftModel2GroupLayoutService', TimekeepingShiftModel2GroupLayoutService);

	TimekeepingShiftModel2GroupLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingShiftmodelContainerInformationService', 'timekeepingShiftModelConstantValues', 'timekeepingShiftModelTranslationService'];

	function TimekeepingShiftModel2GroupLayoutService(platformUIConfigInitService, timekeepingShiftmodelContainerInformationService, timekeepingShiftModelConstantValues, timekeepingShiftModelTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingShiftmodelContainerInformationService.getShift2GroupLayout(),
			dtoSchemeId: timekeepingShiftModelConstantValues.schemes.shift2Group,
			translator: timekeepingShiftModelTranslationService
		});
	}
})(angular);