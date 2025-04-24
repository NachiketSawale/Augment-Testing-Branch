/**
 * Created by Mohit on 29.04.2024
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc service
	 * @name timekeepingRecordingReportVerificationValidationService
	 * @description provides validation methods for timekeeping time symbol account entities
	 */
	angular.module(moduleName).service('timekeepingRecordingReportVerificationValidationService', TimekeepingRecordingReportVerificationValidationService);

	TimekeepingRecordingReportVerificationValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingRecordingConstantValues', 'timekeepingReportVerificationDataService'];


	function TimekeepingRecordingReportVerificationValidationService(platformValidationServiceFactory, timekeepingRecordingConstantValues, timekeepingReportVerificationDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingRecordingConstantValues.schemes.verification, {
			},
			self,
			timekeepingReportVerificationDataService);
	}

})(angular);
