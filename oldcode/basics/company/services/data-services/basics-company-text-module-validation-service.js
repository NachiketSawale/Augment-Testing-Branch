/**
 * Created by henkel on 11.11.2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyTextModuleValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('basicsCompanyTextModuleValidationService', BasicsCompanyTextModuleValidationService);

	BasicsCompanyTextModuleValidationService.$inject = ['basicsCompanyTextModuleService'];

	function BasicsCompanyTextModuleValidationService() {
	}


})(angular);