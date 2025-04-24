/**
 * Created by baf on 04.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingRecordingReportLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping recording report entity.
	 **/
	angular.module(moduleName).service('timekeepingRecordingReportLayoutService', TimekeepingRecordingReportLayoutService);

	TimekeepingRecordingReportLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingRecordingContainerInformationService', 'timekeepingRecordingConstantValues', 'timekeepingRecordingTranslationService'];

	function TimekeepingRecordingReportLayoutService(platformUIConfigInitService, timekeepingRecordingContainerInformationService, timekeepingRecordingConstantValues, timekeepingRecordingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingRecordingContainerInformationService.getReportLayout(),
			dtoSchemeId: timekeepingRecordingConstantValues.schemes.report,
			translator: timekeepingRecordingTranslationService
		});
	}
})(angular);