/**
 * Created by leo on 18.12.2017.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name resourceMasterResourceLookupDialogNew2
	 * @requires LookupFilterDialogDefinition, basicsLookupdataConfigGenerator
	 * @description ComboBox to select a activity template
	 */

	angular.module('resource.master').directive('resourceMasterResourceLookupDialogNew2', ['LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator',
		'resourceMasterResourceFilterLookupDataService', '_',
		function (LookupFilterDialogDefinition, basicsLookupdataConfigGenerator,
				  resourceMasterResourceFilterLookupDataService, _) {
			var formSettings = {
				fid: 'resource.master.selectionfilter',
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
				rows: [
					{
						gid: 'selectionfilter',
						rid: 'site',
						label: 'Site',
						label$tr$: 'resource.master.SiteFk',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {showClearButton: true},
							lookupDirective: 'basics-site-site-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						},
						model: 'siteFk',
						sortOrder: 1
					},
					basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.resourcekind', '',
						{
							gid: 'selectionfilter',
							rid: 'kind',
							label: 'Kind',
							label$tr$: 'resource.master.KindFk',
							type: 'integer',
							model: 'kindFk',
							sortOrder: 2
						}, false, {required: false}),
					basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.resourcegroup', '',
						{
							gid: 'selectionfilter',
							rid: 'group',
							label: 'Group',
							label$tr$: 'resource.master.GroupFk',
							type: 'integer',
							model: 'groupFk',
							sortOrder: 3
						}, false, {required: false}),
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'resourceTypeLookupDataService',
							cacheEnable: true,
							additionalColumns: false,
							showClearButton: true
						},
						{
							gid: 'selectionfilter',
							rid: 'type',
							label: 'Type',
							label$tr$: 'resource.master.TypeFk',
							type: 'integer',
							model: 'typeFk',
							sortOrder: 4
						}),
					basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.logisticsdispatchergroup', '',
						{
							gid: 'selectionfilter',
							rid: 'dispatchGroup',
							label: 'Dispatch Group',
							label$tr$: 'basics.customize.logisticsdispatchergroup',
							type: 'integer',
							model: 'dispatchGroupFk',
							sortOrder: 5
						}, false, {required: false}),
						{
							gid: 'selectionfilter',
							rid: 'validFrom',
							label: 'Valid From',
							label$tr$: 'cloud.common.entityValidFrom',
							type: 'dateutc',
							model: 'validFrom',
							sortOrder: 6
						},
						{
							gid: 'selectionfilter',
							rid: 'validTo',
							label: 'Valid To',
							label$tr$: 'cloud.common.entityValidTo',
							type: 'dateutc',
							model: 'validTo',
							sortOrder: 7
						}
				]
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
					},
					{
						id: 'kind',
						field: 'KindFk',
						name: 'Kind',
						name$tr$: 'resource.master.KindFk',
						readonly: true,
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
							lookupName: 'basics.customize.resourcekind'
						}).formatterOptions
					},
					{
						id: 'group',
						field: 'GroupFk',
						name: 'Group',
						name$tr$: 'resource.master.GroupFk',
						readonly: true,
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
							lookupName: 'basics.customize.resourcegroup'
						}).formatterOptions
					},
					{
						id: 'type',
						field: 'TypeFk',
						name: 'Type',
						name$tr$: 'resource.master.TypeFk',
						readonly: true,
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
							dataServiceName: 'resourceTypeLookupDataService'
						}).formatterOptions
					},
					{
						id: 'dispatchgroup',
						field: 'DispatcherGroupFk',
						name: 'Dispatch Group',
						name$tr$: 'basics.customize.logisticsdispatchergroup',
						readonly: true,
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
							lookupName: 'basics.customize.logisticsdispatchergroup'
						}).formatterOptions
					},
					{
						id: 'validFrom',
						field: 'Validfrom',
						name: 'Valid From',
						name$tr$: 'cloud.common.entityValidFrom',
						formatter: 'dateutc',
						readonly: true
					},
					{
						id: 'validTo',
						field: 'Validto',
						name: 'Valid To',
						name$tr$: 'cloud.common.entityValidTo',
						formatter: 'dateutc',
						readonly: true
					}
				]
			};
			var lookupOptions = {
				lookupType: 'ResourceMasterResource',
				valueMember: 'Id',
				displayMember: 'Code',
				filterOptions: {
					serverSide: true,
					serverKey: 'resource-master-filter2',
					fn: function (item) {
						return _.assign({}, resourceMasterResourceFilterLookupDataService.getFilterParams(item), { requisitionFk: item.dataItem.RequisitionFk });
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				title: 'resource.master.lookupAssignResource',
				uuid: '84df11a330d04d3380dbca48da765101'
			};
			return new LookupFilterDialogDefinition(lookupOptions, 'resourceMasterResourceFilterLookupDataService', formSettings, gridSettings);
		}
	]);
})(angular);
