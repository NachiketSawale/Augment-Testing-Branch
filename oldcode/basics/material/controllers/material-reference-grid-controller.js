/**
 * Created by alm on 12/13/2019.
 */

(function(angular){

	'use strict';
	var moduleName = 'basics.material';
	angular.module(moduleName).controller('basicsMaterialReferenceListController', basicsMaterialReferenceListController);
	basicsMaterialReferenceListController.$inject = ['$scope', 'platformGridControllerService', 'basicsMaterialReferenceUIStandardService',
		'basicsMaterialReferenceDataService', 'basicsMaterialReferenceValidationService'];
	function basicsMaterialReferenceListController($scope, platformGridControllerService, UIStandardService, dataService, validationService){
		//var myGridConfig = { initCalled: false, columns: [] };
		//platformGridControllerService.initListController($scope, UIStandardService, dataService,validationService(dataService),myGridConfig);
		// platformGridControllerService.initListController($scope, UIStandardService, dataService,validationService,myGridConfig);
		platformGridControllerService.initListController($scope, UIStandardService, dataService, validationService, {});
	}
})(angular);
