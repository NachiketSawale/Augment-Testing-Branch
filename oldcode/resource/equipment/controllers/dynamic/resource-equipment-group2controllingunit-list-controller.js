(function () {

	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroup2controllingunitListController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of any kind of entity belonging to a job
	 **/
	angular.module(moduleName).controller('resourceEquipmentGroup2controllingunitListController', ResourceEquipmentGroup2controllingunitListController);

	ResourceEquipmentGroup2controllingunitListController.$inject = [
		'$scope', 'platformContainerControllerService','resourceEquipmentContainerInformationService', 'resourceEquipmentGroup2controllingunitContainerService'
	];

	function ResourceEquipmentGroup2controllingunitListController(
		$scope, platformContainerControllerService, resourceEquipmentContainerInformationService, resourceEquipmentGroup2controllingunitContainerService
	) {
		var containerUid = $scope.getContentValue('uuid');

		if(!resourceEquipmentContainerInformationService.hasDynamic(containerUid)) {
			resourceEquipmentGroup2controllingunitContainerService.prepareGridConfig(containerUid, $scope, resourceEquipmentContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();