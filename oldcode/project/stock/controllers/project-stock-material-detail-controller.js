/**
 * Created by baf on 2017/08/24.
 */
(function () {

	'use strict';
	var moduleName = 'project.stock';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name projectStockMaterialDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of project stock material entities.
	 **/
	angModule.controller('projectStockMaterialDetailController', ProjectStockMaterialDetailController);

	ProjectStockMaterialDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ProjectStockMaterialDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ca05a162837b4e01b1416116a8a846be');
	}
})();