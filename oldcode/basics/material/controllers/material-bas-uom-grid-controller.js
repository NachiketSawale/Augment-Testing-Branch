/**
 * Created by yew on 9/25/2019.[#102256]
 */
(function(angular){

	'use strict';
	var moduleName = 'basics.material';
	angular.module(moduleName).controller('basicsMaterial2basUomGridController', basicsMaterial2basUomGridController);
	basicsMaterial2basUomGridController.$inject = ['$scope', 'platformGridControllerService', 'basicsMaterial2basUomUIStandardService',
		'basicsMaterial2basUomDataService', 'basicsMaterial2basUomValidationService'];
	function basicsMaterial2basUomGridController($scope, platformGridControllerService, UIStandardService, dataService, validationService){

		platformGridControllerService.initListController($scope, UIStandardService, dataService, validationService, {});
	}
})(angular);
