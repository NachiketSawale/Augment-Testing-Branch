/**
 * Created by cakiral on 23.04.2020
 */

(function (angular) {
	'use strict';
	var cardModule = angular.module('resource.equipment');

	cardModule.service('resourceEquipmentPlantComponentReadOnlyProcessor', ResourceEquipmentPlantComponentReadOnlyProcessor);

	ResourceEquipmentPlantComponentReadOnlyProcessor.$inject = ['platformRuntimeDataService'];

	function ResourceEquipmentPlantComponentReadOnlyProcessor(platformRuntimeDataService) {
		this.processItem = function processCardEntity(component) {
			platformRuntimeDataService.readonly(component, [
				{ field: 'MaintenanceSchemaFk', readonly: component.HasGeneratedMaintenance },
				{ field: 'NextMaintPerf', readonly: true },
				{ field: 'HasAllMaintenanceGenerated', readonly: true },
				{ field: 'NextMaintDate', readonly: true },
				{ field: 'NextMaintDays', readonly: true },
				{ field: 'ProjectLocationFk', readonly: !component.HomeProjectFk }
			]);
		};
	}
})(angular);