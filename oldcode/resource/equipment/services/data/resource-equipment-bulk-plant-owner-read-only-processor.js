/**
 * Created by nitsche on 05.02.2025
 */

(function (angular) {
	'use strict';
	var equipmentModule = angular.module('resource.equipment');

	equipmentModule.service('resourceEquipmentBulkPlantOwnerReadOnlyProcessor', ResourceEquipmentBulkPlantOwnerReadOnlyProcessor);

	ResourceEquipmentBulkPlantOwnerReadOnlyProcessor.$inject = ['platformRuntimeDataService'];

	function ResourceEquipmentBulkPlantOwnerReadOnlyProcessor(platformRuntimeDataService) {
		this.processItem = function processItem(dropPoint) {
			platformRuntimeDataService.readonly(dropPoint, [
				{ field: 'PlantFk', readonly: true },
				{ field: 'CompanyFk', readonly: true },
				{ field: 'ProjectFk', readonly: true },
				{ field: 'DropPointFk', readonly: true },
				{ field: 'TotalQuantity', readonly: true },
				{ field: 'YardQuantity', readonly: true },
				{ field: 'ConstructionProjectFk', readonly: true },
				{ field: 'ConstructionDropPointFk', readonly: true },
				{ field: 'ProjectQuantity', readonly: true }
			]);
		};
	}
})(angular);