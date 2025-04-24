/**
 * Created by mohit on 30.04.2024
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.timecontrolling';

	/**
	 * @ngdoc controller
	 * @name TimekeepingTimeControllingReportVerificationLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping recording sheet entity.
	 **/
	angular.module(moduleName).service('timekeepingTimeControllingReportVerificationLayoutService', TimekeepingTimeControllingReportVerificationLayoutService);

	TimekeepingTimeControllingReportVerificationLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingTimecontrollingContainerInformationService', 'timekeepingTimeControllingConstantValues', 'timekeepingRecordingTranslationService'];

	function TimekeepingTimeControllingReportVerificationLayoutService(platformUIConfigInitService, timekeepingTimecontrollingContainerInformationService, timekeepingTimeControllingConstantValues, timekeepingRecordingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingTimecontrollingContainerInformationService.getTimekeepingControllingVerificationLayout(),
			dtoSchemeId: timekeepingTimeControllingConstantValues.schemes.verification,
			translator: timekeepingRecordingTranslationService
		});
	}
})(angular);