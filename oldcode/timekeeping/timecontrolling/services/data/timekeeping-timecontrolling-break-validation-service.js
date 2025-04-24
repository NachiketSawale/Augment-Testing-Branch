(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.timecontrolling';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeControllingBreakValidationService
	 * @description provides validation methods for timekeeping timecontrolling break entities
	 */
	angular.module(moduleName).service('timekeepingTimeControllingBreakValidationService', TimekeepingTimeControllingBreakValidationService);

	TimekeepingTimeControllingBreakValidationService.$inject = ['timekeepingRecordingBreakValidationServiceFactory','platformValidationServiceFactory', 'timekeepingTimeControllingConstantValues', 'timekeepingTimeControllingBreakDataService'];

	function TimekeepingTimeControllingBreakValidationService(timekeepingRecordingBreakValidationServiceFactory,platformValidationServiceFactory, timekeepingTimeControllingConstantValues, timekeepingTimeControllingBreakDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingTimeControllingConstantValues.schemes.break, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingTimeControllingConstantValues.schemes.break),
			periods: [ { from: 'FromTimeBreakDate', to: 'ToTimeBreakDate'} ]
		},
		self,
		timekeepingTimeControllingBreakDataService);

		timekeepingRecordingBreakValidationServiceFactory.createTimekeepingBreakValidationService(self, timekeepingTimeControllingBreakDataService);
	}
})(angular);
