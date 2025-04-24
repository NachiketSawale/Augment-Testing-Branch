/**
 * Created by anl on 1/9/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.mounting';
	angular.module(moduleName).directive('productionplanningMountingReportLookup', MntReportLookup);

	MntReportLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataConfigGenerator'];

	function MntReportLookup(BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataConfigGenerator) {

		var defaults = {
			lookupType: 'MntReport',
			valueMember: 'Id',
			displayMember: 'Code',
			//editable: 'false'
			uuid: 'aa85a06f2e5346bca603da759526c851',
			columns: [
				{id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
				{
					id: 'desc',
					field: 'DescriptionInfo.Translated',
					name: 'DescriptionInfo',
					name$tr$: 'cloud.common.entityDescription'
				},
				{
					id: 'ReportStatus',
					field: 'RepStatusFk',
					name: 'RepStatusFk',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.mountingreportstatus', null, {
						showIcon: true
					}).grid.formatterOptions,
					name$tr$: 'cloud.common.entityState'
				}
			],
			width: 500,
			height: 200,
			title: {
				name: '*Assign Mounting Report',
				name$tr$: 'productionplanning.report.report.dialogTitle'
			}
		};
		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
	}
})(angular);