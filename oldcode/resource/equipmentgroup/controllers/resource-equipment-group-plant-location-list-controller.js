/**
 * Created by nitsche on 04.05.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupPlantLocationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipment  entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentGroupPlantLocationListController', ResourceEquipmentGroupPlantLocationListController);

	ResourceEquipmentGroupPlantLocationListController.$inject = ['$scope', 'logisticJobPlantLocationListControllerBase', 'resourceEquipmentGroupPlantLocationDataService', 'resourceEquipmentGroupConstantValues'];

	function ResourceEquipmentGroupPlantLocationListController($scope, logisticJobPlantLocationListControllerBase, resourceEquipmentGroupPlantLocationDataService, resourceEquipmentGroupConstantValues) {
		logisticJobPlantLocationListControllerBase.initController($scope, moduleName, resourceEquipmentGroupConstantValues.uuid.container.plantLocationList, undefined, resourceEquipmentGroupPlantLocationDataService);
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				resourceEquipmentGroupPlantLocationDataService.getDeadlineButtonConfig(),
				resourceEquipmentGroupPlantLocationDataService.configureFilterSettings(resourceEquipmentGroupConstantValues.uuid.container.plantLocationList),
				resourceEquipmentGroupPlantLocationDataService.getDetailsButtonConfig()
			]
		});

		resourceEquipmentGroupPlantLocationDataService.loadFilterSettings(resourceEquipmentGroupConstantValues.uuid.container.plantLocationList);
	}
})(angular);