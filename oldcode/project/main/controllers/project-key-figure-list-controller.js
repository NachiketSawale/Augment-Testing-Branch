(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainKeyFigureListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the project
	 **/

	angular.module(moduleName).controller('projectMainKeyFigureListController', ProjectMainKeyFigureListController);

	ProjectMainKeyFigureListController.$inject = ['$scope','platformContainerControllerService'];
	function ProjectMainKeyFigureListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e755a4d373c44fb7a19339d238685dac');
	}
})();