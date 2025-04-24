/**
 * Created by baf on 19.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.layout';

	/**
	 * @ngdoc controller
	 * @name timekeepingLayoutInputPhaseGroupLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping layout inputPhaseGroup entity.
	 **/
	angular.module(moduleName).service('timekeepingLayoutInputPhaseGroupLayoutService', TimekeepingLayoutInputPhaseGroupLayoutService);

	TimekeepingLayoutInputPhaseGroupLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingLayoutContainerInformationService', 'timekeepingLayoutConstantValues', 'timekeepingLayoutTranslationService'];

	function TimekeepingLayoutInputPhaseGroupLayoutService(platformUIConfigInitService, timekeepingLayoutContainerInformationService, timekeepingLayoutConstantValues, timekeepingLayoutTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingLayoutContainerInformationService.getInputPhaseGroupLayout(),
			dtoSchemeId: timekeepingLayoutConstantValues.schemes.inputPhaseGroup,
			translator: timekeepingLayoutTranslationService
		});
	}
})(angular);