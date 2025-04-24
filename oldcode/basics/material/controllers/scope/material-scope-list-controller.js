/**
 * Created by wui on 10/15/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialScopeListController', [
		'$scope',
		'platformGridControllerService',
		'basicsMaterialScopeUIStandardService',
		'basicsMaterialScopeDataService',
		'basicsMaterialScopeValidationService',
		function ($scope,
			platformGridControllerService,
			basicsMaterialScopeUIStandardService,
			basicsMaterialScopeDataService,
			basicsMaterialScopeValidationService) {
			var gridConfig = {
				columns: []
			};

			platformGridControllerService.initListController($scope, basicsMaterialScopeUIStandardService, basicsMaterialScopeDataService, basicsMaterialScopeValidationService, gridConfig);
		}
	]);

})(angular);