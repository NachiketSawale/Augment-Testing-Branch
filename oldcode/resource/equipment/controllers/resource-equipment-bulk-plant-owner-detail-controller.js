/**
 * Created by nitsche on 04.02.2025
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentBulkPlantOwnerDetailController
	 * @function
	 * 
	 * @description
	 * Controller for the detail view of bulkplantowner entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentBulkPlantOwnerDetailController', ResourceEquipmentBulkPlantOwnerDetailController);

	ResourceEquipmentBulkPlantOwnerDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentBulkPlantOwnerDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f1b17cf6415e4d4e91a1038e27053f1c');
	}
})(angular);