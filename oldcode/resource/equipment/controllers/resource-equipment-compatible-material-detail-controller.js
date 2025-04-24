/**
 * Created by baf on 30.01.2023
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentCompatibleMaterialDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipment compatibleMaterial entities.
	 **/
	angular.module(moduleName).controller('resourceEquipmentCompatibleMaterialDetailController', ResourceEquipmentCompatibleMaterialDetailController);

	ResourceEquipmentCompatibleMaterialDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentCompatibleMaterialDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '47488ebd7e73436ab9ae9ba7acfc6cec');
	}

})(angular);