/**
 * Created by baf on 19.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.layout';

	/**
	 * @ngdoc controller
	 * @name timekeepingLayoutInputPhaseTimeSymbolLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping layout inputPhaseTimeSymbol entity.
	 **/
	angular.module(moduleName).service('timekeepingLayoutInputPhaseTimeSymbolLayoutService', TimekeepingLayoutInputPhaseTimeSymbolLayoutService);

	TimekeepingLayoutInputPhaseTimeSymbolLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingLayoutContainerInformationService', 'timekeepingLayoutConstantValues', 'timekeepingLayoutTranslationService'];

	function TimekeepingLayoutInputPhaseTimeSymbolLayoutService(platformUIConfigInitService, timekeepingLayoutContainerInformationService, timekeepingLayoutConstantValues, timekeepingLayoutTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingLayoutContainerInformationService.getTimeSymbolLayout(),
			dtoSchemeId: timekeepingLayoutConstantValues.schemes.inputPhaseTimeSymbol,
			translator: timekeepingLayoutTranslationService
		});
	}
})(angular);