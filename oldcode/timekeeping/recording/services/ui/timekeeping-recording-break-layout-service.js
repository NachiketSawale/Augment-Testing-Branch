/**
 * Created by Sudarshan on 27.06.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingRecordingBreakLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping recording break entity.
	 **/
	angular.module(moduleName).service('timekeepingRecordingBreakLayoutService', TimekeepingRecordingBreakLayoutService);

	TimekeepingRecordingBreakLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingRecordingContainerInformationService', 'timekeepingRecordingConstantValues', 'timekeepingRecordingTranslationService'];

	function TimekeepingRecordingBreakLayoutService(platformUIConfigInitService, timekeepingRecordingContainerInformationService, timekeepingRecordingConstantValues, timekeepingRecordingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingRecordingContainerInformationService.getBreakLayout(),
			dtoSchemeId: timekeepingRecordingConstantValues.schemes.break,
			translator: timekeepingRecordingTranslationService
		});
	}
})(angular);