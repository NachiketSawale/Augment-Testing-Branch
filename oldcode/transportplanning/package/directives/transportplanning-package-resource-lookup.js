/**
 * Created by zwz on 12/19/2018.
 */

//remark: this file is copied from resource-master-resource-lookup-dialog-new.js,for filter feature of resource lookup in dynamic control(good field) of Package container
//Of course, it's redundant.It is just a temp solution for the resource lookup in package container.(by zwz 12/19/2018)

(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name transportplanningPackageResourceLookup
	 * @requires LookupFilterDialogDefinition, basicsLookupdataConfigGenerator
	 */
	var moduleName = 'transportplanning.package';
	angular.module(moduleName).directive('transportplanningPackageResourceLookup', ['LookupFilterDialogDefinition', 'basicsLookupdataConfigGenerator',
		'resourceMasterResourceFilterLookupDataService','productionplanningCommonLookupParamStorage',
		function (LookupFilterDialogDefinition, basicsLookupdataConfigGenerator,
				  resourceMasterResourceFilterLookupDataService,lookupParamStorage) {
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
				rows: [{
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
					basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.resourcekind','',
						{
							gid: 'selectionfilter',
							rid: 'kind',
							label: 'Kind',
							label$tr$: 'resource.master.KindFk',
							type: 'integer',
							model: 'kindFk',
							sortOrder: 2
						}, false, {required: false}),
					basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.resourcegroup','',
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
					{
						gid: 'selectionfilter',
						rid: 'validFrom',
						label: 'Valid From',
						label$tr$: 'cloud.common.entityValidFrom',
						type: 'dateutc',
						model: 'validFrom',
						sortOrder: 5
					},
					{
						gid: 'selectionfilter',
						rid: 'validTo',
						label: 'Valid To',
						label$tr$: 'cloud.common.entityValidTo',
						type: 'dateutc',
						model: 'validTo',
						sortOrder: 6
					}]
			};
			var gridSettings = { columns: [
				{
					id:'code',
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
					id:'kind',
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
					id:'group',
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
					id:'type',
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
			]};
			var lookupOptions = {
				defaultFilter: function (request) {
					request.siteFk = lookupParamStorage.get('transportplanning.package.resource', 'siteId');
					return request;
				},
				lookupType: 'ResourceMasterResource',
				valueMember: 'Id',
				displayMember: 'Code',
				filterOptions: {
					serverSide: true,
					serverKey: 'resource-master-filter',
					fn: function (item){
						return resourceMasterResourceFilterLookupDataService.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				title: 'resource.master.lookupAssignResource',
				uuid: '24cde6f72a3249ef99b8115191419be5'
			};
			return new LookupFilterDialogDefinition(lookupOptions, 'resourceMasterResourceFilterLookupDataService', formSettings, gridSettings);
		}
	]);
})(angular);