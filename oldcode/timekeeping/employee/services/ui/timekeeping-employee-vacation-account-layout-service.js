(function () {
	'use strict';
	var modName = 'timekeeping.employee';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeVacationAccountLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of timekeeping shift model entity
	 */
	module.service('timekeepingEmployeeVacationAccountLayoutService', TimekeepingEmployeeVacationAccountLayoutService);

	TimekeepingEmployeeVacationAccountLayoutService.$inject = ['platformSchemaService', 'platformUIConfigInitService', 'timekeepingEmployeeContainerInformationService',
		'timekeepingEmployeeConstantValues', 'timekeepingEmployeeTranslationService'];

	function TimekeepingEmployeeVacationAccountLayoutService(platformSchemaService, platformUIConfigInitService, timekeepingEmployeeContainerInformationService,
		timekeepingEmployeeConstantValues, timekeepingEmployeeTranslationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingEmployeeContainerInformationService.getEmployeeVacationAccountLayout(),
			dtoSchemeId: timekeepingEmployeeConstantValues.schemes.vacationAccount,
			translator: timekeepingEmployeeTranslationService
		});
	}
})();
