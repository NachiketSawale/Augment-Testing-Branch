/**
 * Created by wui on 10/18/2018.
 */

(function(angular){
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialScopeDetailController', [
		'$scope',
		'platformTranslateService',
		'platformDetailControllerService',
		'basicsMaterialScopeUIStandardService',
		'basicsMaterialScopeDataService',
		'basicsMaterialScopeValidationService',
		function ($scope,
			platformTranslateService,
			platformDetailControllerService,
			basicsMaterialScopeUIStandardService,
			basicsMaterialScopeDataService,
			basicsMaterialScopeValidationService) {

			platformDetailControllerService.initDetailController($scope, basicsMaterialScopeDataService, basicsMaterialScopeValidationService, basicsMaterialScopeUIStandardService, platformTranslateService);
		}
	]);

})(angular);