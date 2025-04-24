/**
 * Created by nitsche on 2023-02-23.
 */
(function (angular) {
	'use strict';
	var moduleName = 'resource.equipmentgroup';

	angular.module(moduleName).service('resourceEquipmentGroupSourceWindowControllerService', ResourceEquipmentGroupSourceWindowControllerService);

	ResourceEquipmentGroupSourceWindowControllerService.$inject = ['platformSourceWindowControllerService'];

	function ResourceEquipmentGroupSourceWindowControllerService(platformSourceWindowControllerService) {
		this.initSourceFilterController = function ($scope, uuid) {
			platformSourceWindowControllerService.initSourceFilterController($scope, uuid, 'resourceEquipmentgroupContainerInformationService', 'resourceEquipmentGroupSourceFilterService');
		};
	}
})(angular);