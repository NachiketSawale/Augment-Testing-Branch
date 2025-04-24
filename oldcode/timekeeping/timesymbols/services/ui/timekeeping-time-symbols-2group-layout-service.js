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
	module.service('timekeepingTimeSymbols2GroupLayoutService', TimekeepingTimeSymbols2GroupLayoutService);

	TimekeepingTimeSymbols2GroupLayoutService.$inject = ['platformSchemaService', 'platformUIConfigInitService', 'timekeepingTimesymbolsContainerInformationService',
		'timekeepingTimeSymbolsConstantValues', 'timekeepingTimeSymbolsTranslationService'];

	function TimekeepingTimeSymbols2GroupLayoutService(platformSchemaService, platformUIConfigInitService, timekeepingTimesymbolsContainerInformationService,
		timekeepingTimeSymbolsConstantValues, timekeepingTimeSymbolsTranslationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingTimesymbolsContainerInformationService.gettimeSymbol2GroupLayout(),
			dtoSchemeId: timekeepingTimeSymbolsConstantValues.schemes.timeSymbol2Group,
			translator: timekeepingTimeSymbolsTranslationService
		});
	}
})();
