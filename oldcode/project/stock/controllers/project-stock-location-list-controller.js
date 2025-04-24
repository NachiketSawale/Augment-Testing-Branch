/**
 * Created by baf on 2017/08/24.
 */
(function () {

	'use strict';
	var moduleName = 'project.stock';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name projectStockLocationListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of project stock location entities.
	 **/
	angModule.controller('projectStockLocationListController', ProjectStockLocationListController);

	ProjectStockLocationListController.$inject = ['$scope','platformContainerControllerService'];

	function ProjectStockLocationListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '55f6ac464f67460882c719f035091290');
	}
})();