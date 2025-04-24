/**
 * Created by wui on 10/15/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialScopeValidationService', [
		'basicsMaterialScopeServiceFactory', 'basicsMaterialScopeDataService',
		function (basicsMaterialScopeServiceFactory, basicsMaterialScopeDataService) {
			return basicsMaterialScopeServiceFactory.createScopeValidationService(basicsMaterialScopeDataService);
		}
	]);

})(angular);