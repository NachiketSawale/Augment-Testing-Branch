(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'basics.company';


	angular.module(moduleName).controller('basicsCompanyUrlListController', BasicsCompanyUrlListController);

	BasicsCompanyUrlListController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsCompanyUrlListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'd61ab24bcd2b4985a86d129e1a172747');
	}
})();