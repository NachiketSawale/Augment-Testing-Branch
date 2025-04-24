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
	angular.module(moduleName).controller('projectMainClerkListController', ProjectMainClerkListController);

	ProjectMainClerkListController.$inject = ['$scope','platformContainerControllerService'];
	function ProjectMainClerkListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '975AEC379E4E4B02BE76CCB7A0059F65');
	}
})();