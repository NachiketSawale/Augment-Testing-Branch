(function () {
	'use strict';

	var moduleName = 'resource.equipment';
	angular.module(moduleName).controller('resourceEquipmentLocationMapController', ResourceEquipmentLocationMapController);

	ResourceEquipmentLocationMapController.$inject = ['$scope', 'platformMultiAddressControllerService', 'resourceEquipmentLocationMapService'];

	function ResourceEquipmentLocationMapController($scope, addressControllerService, resourceEquipmentLocationMapService) {
		addressControllerService.initController($scope, moduleName);

		resourceEquipmentLocationMapService.setEquipmentLocations();
	}
})();