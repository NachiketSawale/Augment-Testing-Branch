(function () {

	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroup2pricelistDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of any kind of entity belonging to a job
	 **/
	angular.module(moduleName).controller('resourceEquipmentGroup2pricelistDetailController', ResourceEquipmentGroup2pricelistDetailController);

	ResourceEquipmentGroup2pricelistDetailController.$inject = [
		'$scope', 'platformContainerControllerService','resourceEquipmentContainerInformationService', 'resourceEquipmentGroup2pricelistContainerService'
	];

	function ResourceEquipmentGroup2pricelistDetailController(
		$scope, platformContainerControllerService, resourceEquipmentContainerInformationService, resourceEquipmentGroup2pricelistContainerService
	) {
		var containerUid = $scope.getContentValue('uuid');

		if(!resourceEquipmentContainerInformationService.hasDynamic(containerUid)) {
			resourceEquipmentGroup2pricelistContainerService.prepareDetailConfig(containerUid, $scope, resourceEquipmentContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();