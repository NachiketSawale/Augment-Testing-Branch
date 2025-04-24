/**
 * Created by baf on 2023-08-11.
 */
(function () {
	'use strict';
	var moduleName = 'resource.plantestimate';

	/**
	 * @ngdoc controller
	 * @name resourcePlantEstimateSourceWindowController
	 * @function
	 *
	 * @description
	 **/
	angular.module(moduleName).controller('resourcePlantEstimateSourceWindowController', ResourcePlantEstimateSourceWindowController);

	ResourcePlantEstimateSourceWindowController.$inject = ['$scope', 'resourceEquipmentSourceWindowControllerService'];

	function ResourcePlantEstimateSourceWindowController($scope, resourceEquipmentSourceWindowControllerService) {

		var uuid = $scope.getContainerUUID();
		resourceEquipmentSourceWindowControllerService.initSourceFilterController($scope, uuid);
	}
})();