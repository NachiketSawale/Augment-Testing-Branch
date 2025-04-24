/**
 * Created by Mohit on 29.04.2024
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.timecontrolling';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeControllingReportVerificationValidationService
	 * @description provides validation methods for timekeeping time symbol account entities
	 */
	angular.module(moduleName).service('timekeepingTimeControllingReportVerificationValidationService', TimekeepingTimeControllingReportVerificationValidationService);

	TimekeepingTimeControllingReportVerificationValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingTimeControllingConstantValues', 'timekeepingTimeControllingReportVerificationDataService'];


	function TimekeepingTimeControllingReportVerificationValidationService(platformValidationServiceFactory, timekeepingTimeControllingConstantValues, timekeepingTimeControllingReportVerificationDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingTimeControllingConstantValues.schemes.verification, {
			},
			self,
			timekeepingTimeControllingReportVerificationDataService);
	}

})(angular);
