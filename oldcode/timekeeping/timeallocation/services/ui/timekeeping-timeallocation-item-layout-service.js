/**
 * Created by baf on 22.09.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.timeallocation';

	/**
	 * @ngdoc controller
	 * @name timekeepingTimeallocationItemLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping timeallocation item entity.
	 **/
	angular.module(moduleName).service('timekeepingTimeallocationItemLayoutService', TimekeepingTimeallocationItemLayoutService);

	TimekeepingTimeallocationItemLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingTimeallocationContainerInformationService', 'timekeepingTimeallocationConstantValues', 'timekeepingTimeallocationTranslationService'];

	function TimekeepingTimeallocationItemLayoutService(platformUIConfigInitService, timekeepingTimeallocationContainerInformationService, timekeepingTimeallocationConstantValues, timekeepingTimeallocationTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingTimeallocationContainerInformationService.getTimekeepingTimeallocationItemLayout(),
			dtoSchemeId: timekeepingTimeallocationConstantValues.schemes.timeallocationitem,
			translator: timekeepingTimeallocationTranslationService
		});
	}
})(angular);