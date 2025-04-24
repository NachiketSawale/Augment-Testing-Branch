/**
 * Created by leo on 18.12.2017.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name logisticSundryServiceLookupDialog
	 * @requires
	 * @description ComboBox to select a activity template
	 */

	angular.module('logistic.sundryservice').directive('logisticSundryServiceLookupDialog', LogisticSundryServiceLookupDialog);

	LogisticSundryServiceLookupDialog.$inject = ['platformLayoutHelperService', 'LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator'];

	function LogisticSundryServiceLookupDialog(platformLayoutHelperService, LookupFilterDialogDefinition, basicsLookupdataConfigGenerator) {
		var formSettings = {
			fid: 'logistic.sundryservice.selectionfilter',
			version: '1.0.0',
			showGrouping: false,
			groups: [
				{
					gid: 'selectionfilter',
					isOpen: true,
					visible: true,
					sortOrder: 1
				}
			],
			rows: [basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
				dataServiceName: 'logisticSundryServiceGroupLookupDataService'
			},
			{
				gid: 'selectionfilter',
				rid: 'group',
				label: 'Group',
				label$tr$: 'cloud.common.entityGroup',
				type: 'integer',
				model: 'groupFk',
				sortOrder: 1
			})]
		};
		var gridSettings = {
			columns: [
				{
					id: 'code',
					field: 'Code',
					name: 'Code',
					name$tr$: 'cloud.common.entityCode',
					readonly: true,
					formatter: 'code'
				},
				{
					id: 'description',
					field: 'DescriptionInfo',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					formatter: 'translation',
					readonly: true,
					width: 270
				}
			],
			inputSearchMembers: ['Code', 'DescriptionInfo', 'Specification']
		};
		var lookupOptions = {
			lookupType: 'logisticSundryServiceFk',
			valueMember: 'Id',
			displayMember: 'Code',
			title: 'logistic.sundryservice.entitySundryService',
			version: 3,
			uuid: 'b9647dd65f9847c7a1085e7e28390474'
		};
		return new LookupFilterDialogDefinition(lookupOptions, 'logisticSundryServiceFilterLookupDataService', formSettings, gridSettings);
	}
})(angular);
