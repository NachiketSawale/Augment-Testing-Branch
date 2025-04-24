/**
 * Created by shen on 10.01.2025
 */

(function (angular) {
	'use strict';
	let equipmentGroupModule = angular.module('resource.equipmentgroup');

	equipmentGroupModule.service('resourceEquipmentCompMaintSchemaTemplReadOnlyProcessor', ResourceEquipmentCompMaintSchemaTemplReadOnlyProcessor);

	ResourceEquipmentCompMaintSchemaTemplReadOnlyProcessor.$inject = ['platformRuntimeDataService'];

	function ResourceEquipmentCompMaintSchemaTemplReadOnlyProcessor(platformRuntimeDataService) {
		this.processItem = function processCompMaintSchemaTempl(item) {
			const fieldsToSetReadOnly = ['SubSchema1', 'SubSchema2', 'SubSchema3', 'SubSchema4', 'SubSchema5'];
			const readonlyConfig = fieldsToSetReadOnly.map(field => ({
				field: field,
				readonly: item.MaintSchemaFk == null,
			}));

			platformRuntimeDataService.readonly(item, readonlyConfig);
		};
	}
})(angular);
