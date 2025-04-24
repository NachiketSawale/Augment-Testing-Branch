/**
 * Created by anl on 9/30/2018.
 */

/**
 * Created by waz on 8/23/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).directive('transportplanningRequisitionForPackageLookup', TrsRequisitionLookup);

	TrsRequisitionLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupDescriptorService'];

	function TrsRequisitionLookup(BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataConfigGenerator,
								  basicsLookupdataLookupDescriptorService) {

		var defaults = {
			lookupType: 'TrsRequisition',
			valueMember: 'Id',
			displayMember: 'Code',
			editable: 'false',
			columns: [
				{id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
				{
					id: 'Description',
					field: 'DescriptionInfo.Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription'
				},
				{
					id: 'Date',
					field: 'Date',
					name: 'Date',
					name$tr$: 'cloud.common.entityDate',
					formatter: 'datetime'
				},
				{
					id: 'RequisitionStatus',
					field: 'TrsReqStatusFk',
					name: 'Requisition Status',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.transportrequisitionstatus', null, {
						showIcon: true
					}).grid.formatterOptions,
					name$tr$: 'cloud.common.entityState'
				}
			],
			version: 3
		};

		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
			processData: function (dataList) {
				var trsReqStatus = basicsLookupdataLookupDescriptorService.getData('TrsRequisitionStatus');
				var acceptedStatusList = _.filter(trsReqStatus, function (status) {
					return status.IsAccepted;
				});
				return _.filter(dataList, function (requisition) {
					return _.find(acceptedStatusList, function (status) {
						return status.Id === requisition.TrsReqStatusFk;
					});
				});
			}
		});
	}
})(angular);