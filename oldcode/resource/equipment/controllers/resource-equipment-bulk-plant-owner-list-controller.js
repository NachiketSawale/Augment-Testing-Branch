/**
 * Created by nitsche on 04.02.2025
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentBulkPlantOwnerListController
	 * @function
	 * 
	 * @description
	 * Controller for the list view of bulkplantowner entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentBulkPlantOwnerListController', ResourceEquipmentBulkPlantOwnerListController);

	ResourceEquipmentBulkPlantOwnerListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentBulkPlantOwnerListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5a0fe583fb6d477cb60ac090fd742e9b');
	}
})(angular);