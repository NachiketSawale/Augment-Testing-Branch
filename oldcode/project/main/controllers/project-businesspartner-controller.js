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
	angular.module(moduleName).controller('projectPrj2BPListController', ProjectPrj2BPListController);

	ProjectPrj2BPListController.$inject = ['$scope', 'platformContainerControllerService'];
	function ProjectPrj2BPListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'B15A05E067094D3988F4626281C88E24');
	}

})();