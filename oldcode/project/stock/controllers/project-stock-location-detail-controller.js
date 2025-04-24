/**
 * Created by baf on 2017/08/24.
 */
(function () {

	'use strict';
	var moduleName = 'project.stock';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name projectStockLocationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of project stock location entities.
	 **/
	angModule.controller('projectStockLocationDetailController', ProjectStockLocationDetailController);

	ProjectStockLocationDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ProjectStockLocationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '90b9dd6abb7c40c1b4f8f17d8919ac88');
	}
})();