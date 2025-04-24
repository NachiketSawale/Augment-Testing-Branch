/**
 * Created by zwz on 9/16/2022.
 */
(function () {
	'use strict';
	/* global angular */
	let moduleName = 'productionplanning.common';
	angular.module(moduleName).constant('ppsCommonLogFilterRequestConstant', {
		filterFields: ['ParentItemType', 'RecordId', 'PpsEntityFk', 'RecordType', 'ColumnName', 'Date', 'PpsLogReasonFk'], // Remark: Filters 'ParentItemType', 'RecordId' won't be shown in the UI.
		parentItemTypes: {
			PPSItem: 'PpsItem',
			PPSProductionSet: 'PpsProductionSet',
			MountingRequisition: 'MntRequisition',
			EngineeringTask: 'EngTask',
			TransportRequisition: 'TrsRequisition',
		}
	});
})();
