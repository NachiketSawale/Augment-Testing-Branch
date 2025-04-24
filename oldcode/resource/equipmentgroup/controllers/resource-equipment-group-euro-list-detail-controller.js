/**
 * Created by baf on 26.09.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupEuroListDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipmentGroup euroList entities.
	 **/
	angular.module(moduleName).controller('resourceEquipmentGroupEuroListDetailController', ResourceEquipmentGroupEuroListDetailController);

	ResourceEquipmentGroupEuroListDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentGroupEuroListDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9c0779eb4dc7426988ca468f8bde4daa');
	}

})(angular);