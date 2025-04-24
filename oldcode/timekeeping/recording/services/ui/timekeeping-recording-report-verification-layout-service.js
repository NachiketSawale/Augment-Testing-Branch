/**
 * Created by mohit on 30.04.2024
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingReportVerificationLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping recording sheet entity.
	 **/
	angular.module(moduleName).service('timekeepingReportVerificationLayoutService', TimekeepingReportVerificationLayoutService);

	TimekeepingReportVerificationLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingRecordingContainerInformationService', 'timekeepingRecordingConstantValues', 'timekeepingRecordingTranslationService'];

	function TimekeepingReportVerificationLayoutService(platformUIConfigInitService, timekeepingRecordingContainerInformationService, timekeepingRecordingConstantValues, timekeepingRecordingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingRecordingContainerInformationService.getEmployeeReportVerificationLayout(),
			dtoSchemeId: timekeepingRecordingConstantValues.schemes.verification,
			translator: timekeepingRecordingTranslationService
		});
	}
})(angular);