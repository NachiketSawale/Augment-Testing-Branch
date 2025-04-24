/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc service
	 * @name basicsClerkForScheduleValidationService
	 * @description provides validation methods for basics clerk forSchedule entities
	 */
	angular.module(moduleName).service('basicsClerkForScheduleValidationService', BasicsClerkForScheduleValidationService);

	BasicsClerkForScheduleValidationService.$inject = ['platformDataValidationService', 'basicsClerkForScheduleDataService'];

	function BasicsClerkForScheduleValidationService() {
	}

})(angular);
