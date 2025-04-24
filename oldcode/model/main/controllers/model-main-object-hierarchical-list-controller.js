(function () {

	'use strict';
	var moduleName = 'model.main';

	/**
	 * @ngdoc controller
	 * @name modelMainObjectHierarchicalListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of projects
	 **/
	angular.module(moduleName).controller('modelMainObjectHierarchicalListController', ModelMainContainerListController);

	ModelMainContainerListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelMainContainerListController($scope, platformContainerControllerService) {

		platformContainerControllerService.initController($scope, moduleName, 'b4a5c54943ca4209ab746fddedd4a00e');
	}
})();