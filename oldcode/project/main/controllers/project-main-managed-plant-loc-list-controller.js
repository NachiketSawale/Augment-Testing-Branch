(function () {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectLocationReadonlyListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the project locations
	 **/
	angular.module(moduleName).controller('projectMainManagedPlantLocListController', ProjectMainManagedPlantLocListController);

	ProjectMainManagedPlantLocListController.$inject = ['$scope', 'platformContainerControllerService'];
	function ProjectMainManagedPlantLocListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'dc5f95a4f8c143a8ae0b2521a83d4e19');
	}
})();
