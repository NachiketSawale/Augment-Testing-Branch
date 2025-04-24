/**
 * Created by baf on 2017/08/23.
 */
(function () {

	'use strict';
	var moduleName = 'project.stock';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name projectStockDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of project stock entities.
	 **/
	angModule.controller('projectStockDetailController', ProjectStockDetailController);

	ProjectStockDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ProjectStockDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '82554e69247e442e82175ccd48147b81');
	}
})();