/**
 * Created by baf on 28.12.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingRecordingResultLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping recording result entity.
	 **/
	angular.module(moduleName).service('timekeepingRecordingResultLayoutService', TimekeepingRecordingResultLayoutService);

	TimekeepingRecordingResultLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingRecordingContainerInformationService', 'timekeepingRecordingConstantValues', 'timekeepingRecordingTranslationService'];

	function TimekeepingRecordingResultLayoutService(platformUIConfigInitService, timekeepingRecordingContainerInformationService, timekeepingRecordingConstantValues, timekeepingRecordingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingRecordingContainerInformationService.getResultLayout(),
			dtoSchemeId: timekeepingRecordingConstantValues.schemes.result,
			translator: timekeepingRecordingTranslationService
		});
	}
})(angular);