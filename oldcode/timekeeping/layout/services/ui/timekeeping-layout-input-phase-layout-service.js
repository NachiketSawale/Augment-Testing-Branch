/**
 * Created by baf on 19.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.layout';

	/**
	 * @ngdoc controller
	 * @name timekeepingLayoutInputPhaseLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping layout inputPhase entity.
	 **/
	angular.module(moduleName).service('timekeepingLayoutInputPhaseLayoutService', TimekeepingLayoutInputPhaseLayoutService);

	TimekeepingLayoutInputPhaseLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingLayoutContainerInformationService', 'timekeepingLayoutConstantValues', 'timekeepingLayoutTranslationService'];

	function TimekeepingLayoutInputPhaseLayoutService(platformUIConfigInitService, timekeepingLayoutContainerInformationService, timekeepingLayoutConstantValues, timekeepingLayoutTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingLayoutContainerInformationService.getInputPhaseLayout(),
			dtoSchemeId: timekeepingLayoutConstantValues.schemes.inputPhase,
			translator: timekeepingLayoutTranslationService
		});
	}
})(angular);