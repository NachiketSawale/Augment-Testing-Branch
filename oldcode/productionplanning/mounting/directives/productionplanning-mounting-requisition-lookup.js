/**
 * Created by lid on 8/14/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.mounting';
	angular.module(moduleName).directive('productionplanningMountingRequisitionLookup', ProductionplanningMountingRequisitionLookup);

	ProductionplanningMountingRequisitionLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataConfigGenerator'];

	function ProductionplanningMountingRequisitionLookup(BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataConfigGenerator) {

		var defaults = {
			lookupType: 'MntRequisition',
			valueMember: 'Id',
			displayMember: 'Code',
			//editable: 'false'
			uuid: '4af6ce4e720a4a6bbff1227993908ea4',
			columns: [
				{id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
				{
					id: 'desc',
					field: 'DescriptionInfo.Translated',
					name: 'DescriptionInfo',
					name$tr$: 'cloud.common.entityDescription'
				},
				{
					id: 'RequisitionStatus',
					field: 'ReqStatusFk',
					name: 'ReqStatusFk',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.mountingrequisitionstatus', null, {
						showIcon: true
					}).grid.formatterOptions,
					name$tr$: 'cloud.common.entityState'
				}
			],
			width: 500,
			height: 200,
			title: {
				name: '*Assign Mounting Requisition',
				name$tr$: 'productionplanning.mounting.requisition.dialogTitle'
			}
		};
		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
	}
})(angular);