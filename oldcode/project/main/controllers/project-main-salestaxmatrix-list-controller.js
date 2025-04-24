/**
 * Created by shen on 1/4/2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name salesTaxMatrixListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of project sales tax matrix  entities.
	 **/

	angular.module(moduleName).controller('salesTaxMatrixListController', SalesTaxMatrixListController);

	SalesTaxMatrixListController.$inject = ['$scope', 'platformContainerControllerService'];

	function SalesTaxMatrixListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '08a1a648b75547dda3fa06bb151a1eee');
	}
})(angular);
