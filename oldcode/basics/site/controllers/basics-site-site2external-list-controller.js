(function () {

	'use strict';

	var moduleName = 'basics.site';
	angular.module(moduleName).controller('basicsSite2ExternalListController', Site2ExternalListController);

	Site2ExternalListController.$inject = ['$scope', 'platformContainerControllerService'];

	function Site2ExternalListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e3ddd810665a48598ba6fc70f6f10c6c');
	}
})();
