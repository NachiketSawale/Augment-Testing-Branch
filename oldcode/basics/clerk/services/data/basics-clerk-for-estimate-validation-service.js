/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc service
	 * @name basicsClerkForEstimateValidationService
	 * @description provides validation methods for basics clerk for estimate entities
	 */
	angular.module(moduleName).service('basicsClerkForEstimateValidationService', BasicsClerkForEstimateValidationService);

	BasicsClerkForEstimateValidationService.$inject = ['platformDataValidationService', 'basicsClerkForEstimateDataService'];

	function BasicsClerkForEstimateValidationService() {
	}

})(angular);
