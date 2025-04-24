/**
 * Created by shen on 12/15/2021
 */

(function (angular) {

	'use strict';
	let moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPoolJobPlantLocationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipment  entities.
	 **/
	angular.module(moduleName).controller('resourceEquipmentPoolJobPlantLocationDetailController', ResourceEquipmentPoolJobPlantLocationDetailController);

	ResourceEquipmentPoolJobPlantLocationDetailController.$inject = ['$scope', 'platformContainerControllerService', 'resourceEquipmentPoolJobPlantLocationDataService', 'resourceEquipmentConstantValues'];

	function ResourceEquipmentPoolJobPlantLocationDetailController($scope, platformContainerControllerService, resourceEquipmentPoolJobPlantLocationDataService, resourceEquipmentConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, resourceEquipmentConstantValues.uuid.container.plantPoolJobPlantLocationDetail);
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				resourceEquipmentPoolJobPlantLocationDataService.getDeadlineButtonConfig()
			]
		});

	}

})(angular);
