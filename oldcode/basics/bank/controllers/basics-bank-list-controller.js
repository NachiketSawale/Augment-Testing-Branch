(function (angular) {
	'use strict';

	var moduleName = 'basics.bank';
	var angModule = angular.module(moduleName);


	angModule.controller('basicsBankListController', BasicsBankListController);

	BasicsBankListController.$inject = ['$scope','platformContainerControllerService','platformTranslateService', 'basicsBankUIStandardService'];
	function BasicsBankListController($scope, platformContainerControllerService, platformTranslateService, basicsBankUIStandardService) {

		platformTranslateService.translateGridConfig(basicsBankUIStandardService.getStandardConfigForListView().columns);

		platformContainerControllerService.initController($scope, moduleName, 'C33E512FEE614BDA84485F33093472F7');
	}
})(angular);