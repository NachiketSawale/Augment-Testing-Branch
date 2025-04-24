(function (angular) {
	'use strict';
	var moduleName = 'basics.country';

	angular.module(moduleName).controller('basicsCountryListController', BasicsCountryListController);

	BasicsCountryListController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsCountryListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '84ac7a2a178e4ea6b6dba23ab5f04aa9');
	}
})(angular);