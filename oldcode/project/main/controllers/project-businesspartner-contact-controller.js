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
	angular.module(moduleName).controller('projectPrj2BPContactListController', ProjectPrj2BPContactListController);
	ProjectPrj2BPContactListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProjectPrj2BPContactListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '09B099CDD4BF4AAFB4BC7D28DD8BF1C9');
	}

})();