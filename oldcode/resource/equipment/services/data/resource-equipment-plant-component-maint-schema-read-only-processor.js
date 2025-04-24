/**
 * Created by cakiral on 23.04.2020
 */

(function (angular) {
	'use strict';
	var cardModule = angular.module('resource.equipment');

	cardModule.service('resourceEquipmentPlantComponentMaintSchemaReadOnlyProcessor', ResourceEquipmentPlantComponentMaintSchemaReadOnlyProcessor);

	ResourceEquipmentPlantComponentMaintSchemaReadOnlyProcessor.$inject = ['platformRuntimeDataService'];

	function ResourceEquipmentPlantComponentMaintSchemaReadOnlyProcessor(platformRuntimeDataService) {
		this.processItem = function processCardEntity(componentMaintSchema) {
			platformRuntimeDataService.readonly(componentMaintSchema, [
				{ field: 'MaintSchemaFk', readonly: componentMaintSchema.HasGeneratedMaintenance },
				{ field: 'NextMaintPerf', readonly: true },
				{ field: 'HasAllMaintenanceGenerated', readonly: true },
				{ field: 'NextMaintDate', readonly: true },
				{ field: 'NextMaintDays', readonly: true },
				{ field: 'IsRecalcDates', readonly: !componentMaintSchema.MaintenanceSchemaFk }



			]);
		};
	}
})(angular);
