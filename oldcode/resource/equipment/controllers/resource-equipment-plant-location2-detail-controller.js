/**
 * Created by nitsche on 04.05.2020
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantLocation2DetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipment  entities.
	 **/
	angular.module(moduleName).controller('resourceEquipmentPlantLocation2DetailController', ResourceEquipmentPlantLocation2DetailController);

	ResourceEquipmentPlantLocation2DetailController.$inject = ['$scope', 'platformContainerControllerService', 'resourceEquipmentPlantLocation2DataService', 'resourceEquipmentConstantValues'];

	function ResourceEquipmentPlantLocation2DetailController($scope, platformContainerControllerService, resourceEquipmentPlantLocation2DataService, resourceEquipmentConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, resourceEquipmentConstantValues.uuid.container.plantPlantLocation2Detail);
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				resourceEquipmentPlantLocation2DataService.getDeadlineButtonConfig()
			]
		});

	}

})(angular);