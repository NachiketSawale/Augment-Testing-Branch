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
	angular.module(moduleName).controller('projectMainChangeListController', ProjectMainChangeListController);

	ProjectMainChangeListController.$inject = ['$scope','platformContainerControllerService'];
	function ProjectMainChangeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6937C94AA27A405EAD0DCB703133E03F');
	}
})();