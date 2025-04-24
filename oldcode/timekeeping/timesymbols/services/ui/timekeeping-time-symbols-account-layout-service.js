(function () {
	'use strict';
	var modName = 'timekeeping.timesymbols';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name timekeepingTimeSymbolsAccountLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of timekeeping shift model entity
	 */
	module.service('timekeepingTimeSymbolsAccountLayoutService', TimekeepingTimeSymbolsAccountLayoutService);

	TimekeepingTimeSymbolsAccountLayoutService.$inject = ['platformSchemaService', 'platformUIConfigInitService', 'timekeepingTimesymbolsContainerInformationService',
		'timekeepingTimeSymbolsConstantValues', 'timekeepingTimeSymbolsTranslationService'];

	function TimekeepingTimeSymbolsAccountLayoutService(platformSchemaService, platformUIConfigInitService, timekeepingTimesymbolsContainerInformationService,
		timekeepingTimeSymbolsConstantValues, timekeepingTimeSymbolsTranslationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingTimesymbolsContainerInformationService.getTimeSymbolAccountLayout(),
			dtoSchemeId: timekeepingTimeSymbolsConstantValues.schemes.timeSymbolAccount,
			translator: timekeepingTimeSymbolsTranslationService
		});
	}
})();
