/**
 * Created by baf on 2024.03.01
 */

(function (angular) {
	'use strict';
	var equipmentGroupModule = angular.module('resource.equipmentgroup');

	equipmentGroupModule.service('resourceEquipmentGroupSpecificValueReadOnlyProcessor', ResourceEquipmentGroupSpecificValueReadOnlyProcessor);

	ResourceEquipmentGroupSpecificValueReadOnlyProcessor.$inject = ['platformRuntimeDataService'];

	function ResourceEquipmentGroupSpecificValueReadOnlyProcessor(platformRuntimeDataService) {
		this.processItem = function processSpecificValue(specificValue) {
			platformRuntimeDataService.readonly(specificValue, [
				{ field: 'PlantAssemblyTypeFk', readonly: !specificValue.IsAssignedToRoot }
			]);
		};
	}
})(angular);
