/**
 * Created by nitsche on 2023-02-23.
 */
(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	angular.module(moduleName).service('resourceEquipmentSourceWindowControllerService', ResourceEquipmentSourceWindowControllerService);

	ResourceEquipmentSourceWindowControllerService.$inject = ['platformSourceWindowControllerService'];

	function ResourceEquipmentSourceWindowControllerService(platformSourceWindowControllerService) {
		this.initSourceFilterController = function ($scope, uuid) {
			platformSourceWindowControllerService.initSourceFilterController($scope, uuid, 'resourceEquipmentContainerInformationService', 'resourceEquipmentSourceFilterService');
		};
	}
})(angular);