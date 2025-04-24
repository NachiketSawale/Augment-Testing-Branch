/**
 * Created by zwz on 9/29/2018.
 */

(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name transportplanning-transport-logistic-job-lookup
	 * @requires
	 * @description Dialog to select a logistic job
	 */
	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).directive('transportplanningTransportLogisticJobLookup', ['LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',
		function (LookupFilterDialogDefinition, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService) {

			basicsLookupdataLookupFilterService.registerFilter([{
				key: 'trs-logistic-job-controlling-unit-filter',
				serverSide: true,
				serverKey: 'basics.masterdata.controllingunit.filterkey',
				fn: function (item) {
					return {
						ProjectFk: item.projectFk
					};
				}
			}]);
			var formSettings = {
				fid: 'scheduling.main.selectionfilter',
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
				rows: [{
					gid: 'selectionfilter',
					rid: 'project',
					label: 'Project',
					label$tr$: 'cloud.common.entityProject',
					type: 'directive',
					directive: 'basics-lookup-data-project-project-dialog',
					options: {
						showClearButton: true
					},
					model: 'projectFk',
					required: true,
					sortOrder: 1
				},
					{
						gid: 'selectionfilter',
						rid: 'controllingunir',
						label: 'Controlling',
						label$tr$: 'cloud.common.entityControllingUnit',
						type: 'directive',
						directive: 'basics-master-data-context-controlling-unit-lookup',
						options: {
							eagerLoad: true,
							filterKey: 'trs-logistic-job-controlling-unit-filter',
							showClearButton: true
						},
						model: 'controllingUnitFk',
						sortOrder: 2,
						required: true
					}]
			};
			var gridSettings = {
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true
					},
					{
						id: 'address',
						field: 'Address.Address',
						name: 'Address',
						name$tr$: 'basics.common.entityAddress',
						width: 150
					},
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						readonly: true,
						width: 270
					}
				],
				inputSearchMembers: ['Code', 'Description']
			};
			var lookupOptions = {
				lookupType: 'logisticJob',
				valueMember: 'Id',
				displayMember: 'Code',
				title: 'logistic.job.assignJob',
				uuid: '5a279077b2c749dab8f6301547efded6'
			};
			return  new LookupFilterDialogDefinition(lookupOptions, 'logisticJobDialogLookupDataService', formSettings, gridSettings);
		}
	]);
})(angular);