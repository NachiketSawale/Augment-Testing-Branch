/**
 * Created by nitsche on 04.05.2020
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupPlantLocationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipment  entities.
	 **/
	angular.module(moduleName).controller('resourceEquipmentGroupPlantLocationDetailController', ResourceEquipmentGroupPlantLocationDetailController);

	ResourceEquipmentGroupPlantLocationDetailController.$inject = ['$scope', 'platformContainerControllerService', 'resourceEquipmentGroupConstantValues', 'resourceEquipmentGroupPlantLocationDataService'];

	function ResourceEquipmentGroupPlantLocationDetailController($scope, platformContainerControllerService, resourceEquipmentGroupConstantValues, resourceEquipmentGroupPlantLocationDataService) {
		platformContainerControllerService.initController($scope, moduleName, resourceEquipmentGroupConstantValues.uuid.container.plantLocationDetails);
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				resourceEquipmentGroupPlantLocationDataService.getDeadlineButtonConfig()
			]
		});
	}

})(angular);