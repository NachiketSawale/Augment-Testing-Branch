/**
 * Created by sprotte on 15/09/21
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.timeallocation';
	
	/**
	 * @ngdoc controller
	 * @name timekeepingTimeallocationLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping timeallocation timeallocationheader entity.
	 **/
	angular.module(moduleName).service('timekeepingTimeallocationHeaderLayoutService', TimekeepingTimeallocationHeaderLayoutService);

	TimekeepingTimeallocationHeaderLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingTimeallocationContainerInformationService', 'timekeepingTimeallocationConstantValues', 'timekeepingTimeallocationTranslationService'];

	function TimekeepingTimeallocationHeaderLayoutService(platformUIConfigInitService, timekeepingTimeallocationContainerInformationService, timekeepingTimeallocationConstantValues, timekeepingTimeallocationTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingTimeallocationContainerInformationService.getTimekeepingTimeallocationHeaderLayout(),
			dtoSchemeId: timekeepingTimeallocationConstantValues.schemes.timeallocationheader,
			translator: timekeepingTimeallocationTranslationService
		});
	}
})(angular);