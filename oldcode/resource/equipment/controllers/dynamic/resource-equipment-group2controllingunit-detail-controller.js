(function () {

	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroup2controllingunitDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of any kind of entity belonging to a job
	 **/
	angular.module(moduleName).controller('resourceEquipmentGroup2controllingunitDetailController', ResourceEquipmentGroup2controllingunitDetailController);

	ResourceEquipmentGroup2controllingunitDetailController.$inject = ['$scope', 'platformContainerControllerService','resourceEquipmentContainerInformationService', 'resourceEquipmentGroup2controllingunitContainerService'];

	function ResourceEquipmentGroup2controllingunitDetailController($scope, platformContainerControllerService, resourceEquipmentContainerInformationService, resourceEquipmentGroup2controllingunitContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!resourceEquipmentContainerInformationService.hasDynamic(containerUid)) {
			resourceEquipmentGroup2controllingunitContainerService.prepareDetailConfig(containerUid, $scope, resourceEquipmentContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();