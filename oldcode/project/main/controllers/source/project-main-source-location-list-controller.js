/**
 * Created by leo on 16.01.2017.
 */
(function () {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainSourceLocationListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the project cost group 1 entities
	 **/
	angular.module(moduleName).controller('projectMainSourceLocationListController', ProjectMainSourceLocationListController);

	ProjectMainSourceLocationListController.$inject = ['$scope', 'platformContainerControllerService'];
	function ProjectMainSourceLocationListController($scope, platformContainerControllerService) {

		platformContainerControllerService.initController($scope, moduleName, '1db4b61556414ef7893837ae7af004b0');
	}
})();