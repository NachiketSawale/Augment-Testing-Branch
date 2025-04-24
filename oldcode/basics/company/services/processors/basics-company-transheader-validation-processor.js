/**
 * Created by henkel .
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.company';	
	
	angular.module(moduleName).factory('basicsCompanyTransheaderValidationProcessor', basicsCompanyTransheaderValidationProcessor);
	basicsCompanyTransheaderValidationProcessor.$inject = [];
	function basicsCompanyTransheaderValidationProcessor() {
		var service = {};
		// service.validate = function validate(items) {
		// 	// if (items.Version === 0) {
		// 	// 	$injector.invoke(['basicsCompanyTransheaderValidationService', function () {
		// 	//
		// 	// 	}]);
		// 	// }
		// };
		return service;
	}
})(angular);