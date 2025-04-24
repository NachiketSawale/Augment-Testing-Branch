/**
 * Created by nitsche on 04.05.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantLocation2ListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipment  entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentPlantLocation2ListController', ResourceEquipmentPlantLocation2ListController);

	ResourceEquipmentPlantLocation2ListController.$inject = [
		'$scope', 'platformContainerControllerService', 'resourceEquipmentPlantLocation2DataService', 'resourceEquipmentConstantValues',
		'logisticJobPlantLocationListControllerBase'
	];

	function ResourceEquipmentPlantLocation2ListController(
		$scope, platformContainerControllerService, resourceEquipmentPlantLocation2DataService, resourceEquipmentConstantValues,
		logisticJobPlantLocationListControllerBase
	) {
		logisticJobPlantLocationListControllerBase.initController(
			$scope,
			moduleName,
			resourceEquipmentConstantValues.uuid.container.plantPlantLocation2List,
			undefined,
			resourceEquipmentPlantLocation2DataService
		);
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				resourceEquipmentPlantLocation2DataService.getDeadlineButtonConfig(),
				resourceEquipmentPlantLocation2DataService.configureFilterSettings(resourceEquipmentConstantValues.uuid.container.plantPlantLocation2List),
				resourceEquipmentPlantLocation2DataService.getDetailsButtonConfig()
			]
		});
		resourceEquipmentPlantLocation2DataService.loadFilterSettings(resourceEquipmentConstantValues.uuid.container.plantPlantLocation2List);
	}
})(angular);