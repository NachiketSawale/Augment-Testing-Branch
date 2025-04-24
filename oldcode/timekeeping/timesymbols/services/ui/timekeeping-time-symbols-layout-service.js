/**
 * Created by nit on 07.05.2018.
 */
(function () {
	'use strict';
	var modName = 'timekeeping.timesymbols';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name timekeepingTimeSymbolsLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of timekeeping shift model entity
	 */
	module.service('timekeepingTimeSymbolsLayoutService', TimekeepingTimeSymbolsLayoutService);

	TimekeepingTimeSymbolsLayoutService.$inject = ['platformSchemaService', 'platformUIConfigInitService', 'timekeepingTimesymbolsContainerInformationService',
		'timekeepingTimeSymbolsConstantValues', 'timekeepingTimeSymbolsTranslationService'];

	function TimekeepingTimeSymbolsLayoutService(platformSchemaService, platformUIConfigInitService, timekeepingTimesymbolsContainerInformationService, timekeepingTimeSymbolsConstantValues, timekeepingTimeSymbolsTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingTimesymbolsContainerInformationService.getTimeSymbolsLayout(),
			dtoSchemeId: timekeepingTimeSymbolsConstantValues.schemes.timeSymbol,
			translator: timekeepingTimeSymbolsTranslationService
		});
	}
})();
