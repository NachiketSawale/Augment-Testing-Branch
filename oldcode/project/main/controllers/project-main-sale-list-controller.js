(function () {

	'use strict';
	let moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainSaleListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of projects
	 **/
	angular.module(moduleName).controller('projectMainSaleListController', ProjectMainSaleListController);

	ProjectMainSaleListController.$inject = ['$scope','platformContainerControllerService'];
	function ProjectMainSaleListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '011b0cf9e74e4e5094995de0ec1e9217');
	}
})();
