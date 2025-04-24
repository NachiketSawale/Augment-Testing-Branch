(function () {

	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroup2pricelistListController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of any kind of entity belonging to a job
	 **/
	angular.module(moduleName).controller('resourceEquipmentGroup2pricelistListController', resourceEquipmentGroup2pricelistListController);

	resourceEquipmentGroup2pricelistListController.$inject = [
		'$scope', 'platformContainerControllerService','resourceEquipmentContainerInformationService', 'resourceEquipmentGroup2pricelistContainerService'
	];

	function resourceEquipmentGroup2pricelistListController(
		$scope, platformContainerControllerService, resourceEquipmentContainerInformationService, resourceEquipmentGroup2pricelistContainerService
	) {
		var containerUid = $scope.getContentValue('uuid');

		if(!resourceEquipmentContainerInformationService.hasDynamic(containerUid)) {
			resourceEquipmentGroup2pricelistContainerService.prepareGridConfig(containerUid, $scope, resourceEquipmentContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();