/**
 * Created by lnt on 7/31/2019.
 */

(function (angular) {
	/* global angular */
	'use strict';
	var moduleName = 'basics.costgroups';

	/**
	 * @ngdoc controller
	 * @name basicsCostGroupCatalogDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of basics costGroupCatalog entities.
	 **/
	angular.module(moduleName).controller('basicsCostGroupCatalogDetailController', BasicsCostGroupCatalogDetailController);

	BasicsCostGroupCatalogDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCostGroupCatalogDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '950e80bb6ef44857bec647e238598c5e');
	}

})(angular);