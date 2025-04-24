/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc service
	 * @name basicsClerkForProjectValidationService
	 * @description provides validation methods for basics clerk forProject entities
	 */
	angular.module(moduleName).service('basicsClerkForProjectValidationService', BasicsClerkForProjectValidationService);

	BasicsClerkForProjectValidationService.$inject = ['platformDataValidationService', 'basicsClerkForProjectDataService'];

	function BasicsClerkForProjectValidationService() {
	}

})(angular);
