(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.timecontrolling';

	/**
	 * @ngdoc controller
	 * @name timekeepingTimeControllingBreakLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping time controlling break entity.
	 **/
	angular.module(moduleName).service('timekeepingTimeControllingBreakLayoutService', TimekeepingTimeControllingBreakLayoutService);

	TimekeepingTimeControllingBreakLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingTimecontrollingContainerInformationService', 'timekeepingTimeControllingConstantValues', 'timekeepingRecordingTranslationService'];

	function TimekeepingTimeControllingBreakLayoutService(platformUIConfigInitService, timekeepingTimecontrollingContainerInformationService, timekeepingTimeControllingConstantValues, timekeepingRecordingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingTimecontrollingContainerInformationService.getTimekeepingControllingBreakLayout(),
			dtoSchemeId: timekeepingTimeControllingConstantValues.schemes.break,
			translator: timekeepingRecordingTranslationService
		});
	}
})(angular);