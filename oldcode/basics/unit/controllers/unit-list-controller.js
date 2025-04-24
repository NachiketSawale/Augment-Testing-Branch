(function () {

	'use strict';
	var moduleName = 'basics.unit';


	angular.module(moduleName).controller('basicsUnitListController', BasicsUnitListController);

	BasicsUnitListController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsUnitListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '438973C14EAD47D3A651742BBC9B5696');
	}
})();