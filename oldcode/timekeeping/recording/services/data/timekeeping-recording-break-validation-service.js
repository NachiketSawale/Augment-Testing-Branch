/**
 * Created by Sudarshan on 27.06.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc service
	 * @name timekeepingRecordingBreakValidationService
	 * @description provides validation methods for timekeeping recording break entities
	 */
	angular.module(moduleName).service('timekeepingRecordingBreakValidationService', TimekeepingRecordingBreakValidationService);

	TimekeepingRecordingBreakValidationService.$inject = ['timekeepingRecordingBreakValidationServiceFactory','platformValidationServiceFactory', 'timekeepingRecordingConstantValues', 'timekeepingRecordingBreakDataService'];

	function TimekeepingRecordingBreakValidationService(timekeepingRecordingBreakValidationServiceFactory,platformValidationServiceFactory, timekeepingRecordingConstantValues, timekeepingRecordingBreakDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingRecordingConstantValues.schemes.break, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingRecordingConstantValues.schemes.break),
			//periods: [ { from: 'FromTimeBreakDate', to: 'ToTimeBreakDate'} ]
		},
		self,
		timekeepingRecordingBreakDataService);

		timekeepingRecordingBreakValidationServiceFactory.createTimekeepingBreakValidationService(this, timekeepingRecordingBreakDataService);

	}
})(angular);
