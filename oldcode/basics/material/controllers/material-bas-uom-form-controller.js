/**
 * Created by yew on 9/25/2019.[#102256]
 */
(function(){

	'use strict';
	var moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterial2basUomFormController', basicsMaterial2basUomFormController);
	basicsMaterial2basUomFormController.$inject = ['$scope', 'platformDetailControllerService', 'basicsMaterial2basUomUIStandardService',
		'basicsMaterial2basUomDataService', 'basicsMaterial2basUomValidationService', 'platformTranslateService'];
	function basicsMaterial2basUomFormController( $scope, platformDetailControllerService, UIStandardService,
		dataService, validationService, platformTranslateService){

		platformDetailControllerService.initDetailController($scope,dataService, validationService, UIStandardService, platformTranslateService);
	}
})(angular);