/**
 * Created by shen on 1/3/2022
 */

(function (angular) {

	'use strict';
	let moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name project2SalesTaxCodeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of project project2salestaxcode  entities.
	 **/

	angular.module(moduleName).controller('project2SalesTaxCodeDetailController', Project2SalesTaxCodeDetailController);

	Project2SalesTaxCodeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function Project2SalesTaxCodeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '7cb4984e06ba46a4bb64ff72d169d23b');
	}
})(angular);
