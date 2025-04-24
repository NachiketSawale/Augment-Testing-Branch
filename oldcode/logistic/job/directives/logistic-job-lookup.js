/**
 * Created by leo on 18.12.2017.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name logistic-job-lookup
	 * @requires basicsLookupdataConfigGenerator
	 * @description ComboBox to select a activity template
	 */

	angular.module('logistic.job').directive('logisticJobLookup', ['LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService',
		function (LookupFilterDialogDefinition, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService) {

			basicsLookupdataLookupFilterService.registerFilter([{
				key: 'logistic-job-controlling-unit-filter',
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
						filterKey: 'logistic-job-controlling-unit-filter',
						showClearButton: true
					},
					model: 'controllingUnitFk',
					sortOrder: 2
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
				uuid: '7dfb1bd5626446b6bef6681b2f0b1005'
			};
			return  new LookupFilterDialogDefinition(lookupOptions, 'logisticJobDialogLookupDataService', formSettings, gridSettings);
		}
	]);
})(angular);
