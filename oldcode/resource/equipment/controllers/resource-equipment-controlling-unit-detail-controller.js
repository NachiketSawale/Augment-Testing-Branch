/**
 * Created by baf on 03.05.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentControllingUnitDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipment controllingUnit entities.
	 **/
	angular.module(moduleName).controller('resourceEquipmentControllingUnitDetailController', ResourceEquipmentControllingUnitDetailController);

	ResourceEquipmentControllingUnitDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentControllingUnitDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ce5585bb21744dbab053f24f49c07bc2');
	}

})(angular);