(function (angular) {
	'use strict';

	var moduleName = 'basics.country';
	var angModule = angular.module(moduleName);

	angModule.controller('basicsCountryStateListController', BasicsCountryStateListController);

	BasicsCountryStateListController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCountryStateListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '8a1744845b1c4107b6a16559df69bdab');
	}
})(angular);