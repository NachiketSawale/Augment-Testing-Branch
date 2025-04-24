/**
 * Created by baf on 04.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc controller
	 * @name timekeepingRecordingSheetLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping recording sheet entity.
	 **/
	angular.module(moduleName).service('timekeepingRecordingSheetLayoutService', TimekeepingRecordingSheetLayoutService);

	TimekeepingRecordingSheetLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingRecordingContainerInformationService', 'timekeepingRecordingConstantValues', 'timekeepingRecordingTranslationService'];

	function TimekeepingRecordingSheetLayoutService(platformUIConfigInitService, timekeepingRecordingContainerInformationService, timekeepingRecordingConstantValues, timekeepingRecordingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingRecordingContainerInformationService.getSheetLayout(),
			dtoSchemeId: timekeepingRecordingConstantValues.schemes.sheet,
			translator: timekeepingRecordingTranslationService
		});
	}
})(angular);