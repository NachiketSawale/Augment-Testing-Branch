/**
 * Created by baf on 20.07.2023
 */

(function (angular) {

	'use strict';
	const moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupSpecificValueDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipmentGroup specificValue entities.
	 **/
	angular.module(moduleName).controller('resourceEquipmentGroupSpecificValueDetailController', ResourceEquipmentGroupSpecificValueDetailController);

	ResourceEquipmentGroupSpecificValueDetailController.$inject = ['$scope', 'platformContainerControllerService', 'resourceEquipmentGroupConstantValues'];

	function ResourceEquipmentGroupSpecificValueDetailController($scope, platformContainerControllerService, resourceEquipmentGroupConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, resourceEquipmentGroupConstantValues.uuid.container.specificValueDetails);
	}

})(angular);