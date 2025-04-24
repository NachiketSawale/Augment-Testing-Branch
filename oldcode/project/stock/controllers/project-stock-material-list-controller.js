/**
 * Created by baf on Created by baf on 2017/08/24.
 */
(function () {

	'use strict';
	var moduleName = 'project.stock';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name projectStockMaterialListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of project stock material entities.
	 **/
	angModule.controller('projectStockMaterialListController', ProjectStockMaterialListController);

	ProjectStockMaterialListController.$inject = ['$scope','platformContainerControllerService'];

	function ProjectStockMaterialListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '562132b3f18e470f8eef6b9dbe5dc9d4');
	}
})();