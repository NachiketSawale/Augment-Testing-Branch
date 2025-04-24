(function () {

	'use strict';
	var moduleName = 'basics.unit';

	angular.module(moduleName).controller('basicsUnitSynonymListController', BasicsUnitSynonymListController);

	BasicsUnitSynonymListController.$inject = ['$scope','platformContainerControllerService'];
	function BasicsUnitSynonymListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '92CD68EFDE7247AAB4F955C125EF8ECB');
	}
})
();