/**
 * Created by leo on 02.05.2018.
 */
(function () {
	'use strict';
	const modName = 'timekeeping.shiftmodel';
	const module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name timekeepingShiftModelLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of timekeeping shift model entity
	 */
	module.service('timekeepingShiftModelLayoutService', TimekeepingShiftModelLayoutService);

	TimekeepingShiftModelLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingShiftmodelContainerInformationService',
		'timekeepingShiftModelConstantValues', 'timekeepingShiftModelTranslationService'];

	function TimekeepingShiftModelLayoutService(platformUIConfigInitService, timekeepingShiftmodelContainerInformationService, timekeepingShiftModelConstantValues, timekeepingShiftModelTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingShiftmodelContainerInformationService.getTimekeepingShiftModelLayout(),
			dtoSchemeId: timekeepingShiftModelConstantValues.schemes.shift,
			translator: timekeepingShiftModelTranslationService
		});
	}
})();