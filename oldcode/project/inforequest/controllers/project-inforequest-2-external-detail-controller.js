(function (angular) {

	'use strict';
	var moduleName = 'project.inforequest';

	/**
	 * @ngdoc controller
	 * @name projectInfoRequest2ExternalDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of inforequest2external  entities.
	 **/
	angular.module(moduleName).controller('projectInfoRequest2ExternalDetailController', projectInfoRequest2ExternalDetailController);

	projectInfoRequest2ExternalDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function projectInfoRequest2ExternalDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, 'Project.InfoRequest', 'a22ab80151dc4a8f8f0914cc2e550811');
	}

})(angular);