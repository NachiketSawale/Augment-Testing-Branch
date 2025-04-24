/**
 * Created by lnt on 7/31/2019.
 */

(function (angular) {
	/* global angular */
	'use strict';
	var moduleName = 'basics.costgroups';

	/**
	 * @ngdoc controller
	 * @name basicsCostGroupCatalogListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of basice costGroupCatalog entities.
	 **/

	angular.module(moduleName).controller('basicsCostGroupCatalogListController', BasicsCostGroupCatalogListController);

	BasicsCostGroupCatalogListController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCostGroupCatalogListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3FEF67F4C51DAF48775E7C16841CFCA2');
	}
})(angular);