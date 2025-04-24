/**
 * Created by baf on 15.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc service
	 * @name basicsClerkForWicValidationService
	 * @description provides validation methods for basics clerk forWic entities
	 */
	angular.module(moduleName).service('basicsClerkForWicValidationService', BasicsClerkForWicValidationService);

	BasicsClerkForWicValidationService.$inject = ['platformDataValidationService', 'basicsClerkForWicDataService'];

	function BasicsClerkForWicValidationService() {
	}

})(angular);
