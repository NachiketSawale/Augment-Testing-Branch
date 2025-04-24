(function (angular) {
	'use strict';
	var moduleName = 'project.inforequest';

	/**
	 * @ngdoc controller
	 * @name projectInfoRequest2ExternalListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of project inforequest2external entities.
	 **/

	angular.module(moduleName).controller('projectInfoRequest2ExternalListController', projectInfoRequest2ExternalListController);

	projectInfoRequest2ExternalListController.$inject = ['$scope', 'platformContainerControllerService'];

	function projectInfoRequest2ExternalListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, 'Project.InfoRequest', '52a1f2237b1f476995cc9e78b79e9a68');
	}
})(angular);