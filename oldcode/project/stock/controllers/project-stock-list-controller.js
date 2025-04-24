/**
 * Created by baf on 2017/08/23.
 */
(function () {

	'use strict';
	var moduleName = 'project.stock';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name projectStockListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of project stock entities.
	 **/
	angModule.controller('projectStockListController', ProjectStockListController);

	ProjectStockListController.$inject = ['$scope','platformContainerControllerService'];

	function ProjectStockListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '84f41825c88a463286c9502f983b4e90');
	}
})();