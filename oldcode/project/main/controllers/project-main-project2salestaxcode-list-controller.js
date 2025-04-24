/**
 * Created by shen on 1/3/2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name project2SalesTaxCodeListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of project project2salestaxcode  entities.
	 **/

	angular.module(moduleName).controller('project2SalesTaxCodeListController', Project2SalesTaxCodeListController);

	Project2SalesTaxCodeListController.$inject = ['$scope', 'platformContainerControllerService'];

	function Project2SalesTaxCodeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '323812e8f71549019915dbb494a65142');
	}
})(angular);
