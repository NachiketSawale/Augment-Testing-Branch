(function () {
	/*global angular*/
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
	angular.module(moduleName).controller('projectMainGeneralListController', ProjectMainGeneralListController);

	ProjectMainGeneralListController.$inject = ['$scope','platformContainerControllerService'];
	function ProjectMainGeneralListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '8d00d49507ea490f8f256518e84a98e8');
	}
})();