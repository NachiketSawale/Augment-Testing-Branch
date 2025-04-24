(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.timecontrolling';

	/**
	 * @ngdoc controller
	 * @name timekeepingTimeControllingReportLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping timecontrolling report entity.
	 **/
	angular.module(moduleName).service('timekeepingTimeControllingReportLayoutService', TimekeepingTimeControllingReportLayoutService);

	TimekeepingTimeControllingReportLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingTimecontrollingContainerInformationService', 'timekeepingTimeControllingConstantValues', 'timekeepingRecordingTranslationService'];

	function TimekeepingTimeControllingReportLayoutService(platformUIConfigInitService, timekeepingTimeControllingContainerInformationService, timekeepingTimeControllingConstantValues, timekeepingRecordingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingTimeControllingContainerInformationService.getTimekeepingControllingReportLayout(),
			dtoSchemeId: timekeepingTimeControllingConstantValues.schemes.report,
			translator: timekeepingRecordingTranslationService
		});
	}
})(angular);