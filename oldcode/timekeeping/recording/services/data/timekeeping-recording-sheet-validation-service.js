/**
 * Created by baf on 04.06.2019
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc service
	 * @name timekeepingRecordingSheetValidationService
	 * @description provides validation methods for timekeeping recording sheet entities
	 */
	angular.module(moduleName).service('timekeepingRecordingSheetValidationService', TimekeepingRecordingSheetValidationService);

	TimekeepingRecordingSheetValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingRecordingConstantValues', 'timekeepingRecordingSheetDataService'];

	function TimekeepingRecordingSheetValidationService(platformValidationServiceFactory, timekeepingRecordingConstantValues, timekeepingRecordingSheetDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingRecordingConstantValues.schemes.sheet, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingRecordingConstantValues.schemes.sheet)
		},
		self,
		timekeepingRecordingSheetDataService);
	}
})(angular);
