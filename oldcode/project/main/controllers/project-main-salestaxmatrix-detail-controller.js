/**
 * Created by shen on 1/4/2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name salesTaxMatrixDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of project sales tax matrix  entities.
	 **/

	angular.module(moduleName).controller('salesTaxMatrixDetailController', SalesTaxMatrixDetailController);

	SalesTaxMatrixDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SalesTaxMatrixDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'fc8217925f694f2296112740a1aa8b1b');
	}
})(angular);
