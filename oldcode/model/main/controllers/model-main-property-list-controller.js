(function () {

	'use strict';
	var moduleName = 'model.main';

	/**
	 * @ngdoc controller
	 * @name modelMainPropertyListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of projects
	 **/
	angular.module(moduleName).controller('modelMainPropertyListController', ModelMainPropertyListController);

	ModelMainPropertyListController.$inject = ['$scope','platformContainerControllerService', 'modelMainPropertyDataService'];
	function ModelMainPropertyListController($scope, platformContainerControllerService, modelMainPropertyDataService) {
		platformContainerControllerService.initController($scope, moduleName, 'EC7F4AFAE0D24E5296F594A65C8D176E');
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: modelMainPropertyDataService.toolBarHandler($scope.getContainerUUID())
		});
	}
})();