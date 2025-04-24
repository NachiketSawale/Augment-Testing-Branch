/**
 * Created by shen on 12/15/2021
 */

(function (angular) {
	'use strict';
	let moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPoolJobPlantLocationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipment  entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentPoolJobPlantLocationListController', ResourceEquipmentPoolJobPlantLocationListController);

	ResourceEquipmentPoolJobPlantLocationListController.$inject = ['$scope', 'logisticJobPlantLocationListControllerBase', 'resourceEquipmentPoolJobPlantLocationDataService', 'resourceEquipmentConstantValues'];

	function ResourceEquipmentPoolJobPlantLocationListController($scope, logisticJobPlantLocationListControllerBase, resourceEquipmentPoolJobPlantLocationDataService, resourceEquipmentConstantValues) {
		logisticJobPlantLocationListControllerBase.initController(
			$scope,
			moduleName,
			resourceEquipmentConstantValues.uuid.container.plantPoolJobPlantLocationList,
			undefined,
			resourceEquipmentPoolJobPlantLocationDataService
		);
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				resourceEquipmentPoolJobPlantLocationDataService.getDeadlineButtonConfig(),
				resourceEquipmentPoolJobPlantLocationDataService.getDetailsButtonConfig()
			]
		});
	}
})(angular);
