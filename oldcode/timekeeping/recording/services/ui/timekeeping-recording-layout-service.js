/**
 * Created by baf on 04.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingRecordingLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping recording recording entity.
	 **/
	angular.module(moduleName).service('timekeepingRecordingLayoutService', TimekeepingRecordingLayoutService);

	TimekeepingRecordingLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingRecordingContainerInformationService', 'timekeepingRecordingConstantValues', 'timekeepingRecordingTranslationService'];

	function TimekeepingRecordingLayoutService(platformUIConfigInitService, timekeepingRecordingContainerInformationService, timekeepingRecordingConstantValues, timekeepingRecordingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingRecordingContainerInformationService.getRecordingLayout(),
			dtoSchemeId: timekeepingRecordingConstantValues.schemes.recording,
			translator: timekeepingRecordingTranslationService
		});
	}
})(angular);