/**
 * Created by baf on 07.10.2020
 */

(function (angular) {
	'use strict';
	var module = angular.module('resource.requisition');

	module.service('resourceRequisitionItemReadOnlyProcessor', ResourceRequisitionItemReadOnlyProcessor);

	ResourceRequisitionItemReadOnlyProcessor.$inject = ['platformRuntimeDataService', 'resourceRequisitionDataService', 'resourceRequisitionConstantValues'];

	function ResourceRequisitionItemReadOnlyProcessor(platformRuntimeDataService, resourceRequisitionDataService, resourceRequisitionConstantValues) {
		this.processItem = function processItem(requisitionItem) {

			var entity = resourceRequisitionDataService.getSelected();

			if (entity) {
				var options = [
					{
						field: 'UomFk',
						readonly: requisitionItem.MaterialFk !== null
					}
				];

				switch (entity.RequisitionTypeFk) {
					case resourceRequisitionConstantValues.requisitionType.resourceRequisition:
						options.push(
							{field: 'MaterialFk', readonly: true},
							{field: 'RequisitionFk', readonly: true},
							{field: 'UomFk', readonly: true},
							{field: 'StockFk', readonly: true},
							{field: 'Description', readonly: true},
							{field: 'UomFk', readonly: true},
							{field: 'Quantity', readonly: true},
							{field: 'ProjectFk', readonly: true}
						);
						break;

					case resourceRequisitionConstantValues.requisitionType.materialRequisition:
						// TODO: Set the Requisition-specific fields readonly
						break;

					default:
						break;
				}
				if (options.length > 0) {
					platformRuntimeDataService.readonly(requisitionItem, options);
				}
			}
		};
	}
})(angular);

