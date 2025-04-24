/**
 * Created by anl on 2/18/2020.
 */


(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).service('transportplanningRequisitionLookupDialogService', TrsRequisitionLookupDialogService);

	TrsRequisitionLookupDialogService.$inject = ['_', 'platformLayoutHelperService',
		'transportplanningRequisitionLookupDataService',
		'basicsLookupdataConfigGenerator',
		'productionplanningCommonActivityDateshiftService'];

	function TrsRequisitionLookupDialogService(_, platformLayoutHelperService,
											   trsRequisitionLookupDataService,
											   basicsLookupdataConfigGenerator,
											   ppsCommonActivityDateshiftService) {
		var service = {};
		// var statusCriterias = [{Id: 1, Description: 'In'}, {Id: 2, Description: 'Not In'}];

		service.getFormSettings = function () {
			var formSettings = {
				fid: 'transport.requisition.selectionfilter',
				version: '1.0.0',
				showGrouping: false,
				groups: [{
					gid: 'selectionfilter',
					isOpen: true,
					visible: true,
					sortOrder: 1,
					attributes: ['ProjectId', 'SiteId',  'ResTypeId', 'plannedStart', 'plannedFinish']// 'StatusCriteria', 'Status']
				}],
				rows: [
					_.assign(
						platformLayoutHelperService.provideProjectLookupOverload().detail,
						{
							gid: 'selectionfilter',
							rid: 'project',
							label: 'Project',
							label$tr$: 'productionplanning.common.prjProjectFk',
							model: 'ProjectId',
							sortOrder: 1
						}),
					{
						gid: 'selectionfilter',
						rid: 'sitefk',
						model: 'SiteId',
						sortOrder: 2,
						label: 'Site',
						label$tr$: 'basics.site.entitySite',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {
								showClearButton: true
							},
							lookupDirective: 'basics-site-site-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					},
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'resourceTypeLookupDataService',
						showClearButton: true
					}, {
						gid: 'selectionfilter',
						rid: 'resourcetypefk',
						model: 'ResTypeId',
						sortOrder: 3,
						label$tr$: 'productionplanning.common.event.resTypeFk'
					}),
					{
						gid: 'selectionfilter',
						rid: 'plannedStart',
						label: 'Planned Start',
						label$tr$: 'productionplanning.common.event.plannedStart',
						type: 'dateutc',
						model: 'plannedStart',
						sortOrder: 4
					},
					{
						gid: 'selectionfilter',
						rid: 'plannedFinish',
						label: 'Planned Finish',
						label$tr$: 'productionplanning.common.event.plannedFinish',
						type: 'dateutc',
						model: 'plannedFinish',
						sortOrder: 5
					}
					// {
					// 	gid: 'selectionfilter',
					// 	rid: 'statusCriteria',
					// 	label: '*Status Criteria',
					// 	label$tr$: 'productionplanning.common.product.statusCriteria',
					// 	model: 'StatusCriteria',
					// 	sortOrder: 5,
					// 	type: 'select',
					// 	options: {
					// 		valueMember: 'Id',
					// 		displayMember: 'Description',
					// 		items: statusCriterias
					// 	}
					// }
					// {
					// 	gid: 'selectionfilter',
					// 	rid: 'status',
					// 	label: '*Status',
					// 	label$tr$: 'cloud.common.entityStatus',
					// 	model: 'Status',
					// 	sortOrder: 6,
					// 	type: 'directive',
					// 	directive: 'productionplanning-common-custom-filter-value-list',
					// 	dropboxOptions: {
					// 		items: productStatusService.getList(),
					// 		valueMember: 'Id',
					// 		displayMember: 'Description'
					// 	}
					// }
				]
			};
			return formSettings;
		};

		service.getGridSettings = function () {
			//var gridColumns = _.cloneDeep(trsRequisitionUIStandardService.getStandardConfigForListView().columns);

			var columns = [
				{
					id: 'Code',
					field: 'Code',
					name: 'Code',
					formatter: 'code',
					width: 50,
					name$tr$: 'cloud.common.entityCode'
				},
				{
					id: 'Description',
					field: 'DescriptionInfo',
					name: 'Description',
					formatter: 'translation',
					width: 300,
					name$tr$: 'cloud.common.entityDescription'
				},
				{
					id: 'Status', field: 'TrsReqStatusFk', name: 'Status', name$tr$: 'cloud.common.entityStatus',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.transportrequisitionstatus', null, {
						showIcon: true
					}).grid.formatterOptions
				},
				{
					id: 'projectName',
					field: 'ProjectFk',
					name: 'Project Name',
					name$tr$: 'cloud.common.entityProjectName',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'project',
						displayMember: 'ProjectName'
					},
					readonly: true
				},
				{
					id: 'site',
					type: 'lookup',
					field: 'SiteFk',
					name: 'Site',
					name$tr$: 'basics.site.entitySite',
					width: 120,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'SiteNew',
						displayMember: 'Code',
						version: 3
					}
				},
				{
					id: 'ResType', field: 'ResTypeFk', name: 'Resource Type', name$tr$: 'resource.master.TypeFk',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourcegroup', null, {
						showIcon: true
					}).grid.formatterOptions
				},{
					id: 'plannedStart',
					name: 'Planned Start',
					name$tr$: 'productionplanning.common.event.plannedStart',
					formatter: 'datetimeutc',
					field: 'PlannedStart',
					sortOrder: 5
				},
				{
					id: 'plannedFinish',
					name: 'Planned Finish',
					name$tr$: 'productionplanning.common.event.plannedFinish',
					formatter: 'datetimeutc',
					field: 'PlannedFinish',
					sortOrder: 6
				}
			];

			_.forEach(columns, function (o) {
				o.editor = null;
				o.navigator = null;
			});

			var gridSettings = {
				columns: columns,
				inputSearchMembers: ['Code', 'DescriptionInfo']
			};
			return gridSettings;
		};

		service.getLookupOptions = function () {
			var lookupOptions = {
				lookupType: 'TrsRequisition',
				valueMember: 'Id',
				displayMember: 'Code',
				// defaultFilter: function (request) {
				// 	request.StatusCriteria = statusCriterias[0];
				// 	return request;
				// },
				filterOptions: {
					serverSide: true,
					serverKey: 'transport-requisition-filter',
					fn: function (item) {
						var params = trsRequisitionLookupDataService.getFilterParams(item);
						// if (params && params.StatusCriteria) {
						// 	var statusRow = _.find(lookupOptions.detailConfig.rows, {model: 'Status'});
						// 	if (statusRow) {
						// 		params.Status = productStatusLookupService.updateFilterStatus(statusRow.dropboxOptions.items, params.StatusCriteria, params.Status);
						// 		params.StatusCriteria = statusCriterias[0];//always use 'in Criteria' after updateFilterStatus, because just part of the status will be filtered sometime
						// 	}
						// }
						return params;
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				title: 'transportplanning.requisition.lookupDialog',
				uuid: '9d4074c72edf411a8edfd14a4294f9da',
				//additional properties
				detailConfig: service.getFormSettings(),
				gridSettings: service.getGridSettings()
			};

			//dateshift implementation
			function processChangedRequisition(args) {
				args.entity = {
					PpsEventFk: args.entity.TrsReq_EventFk,
					DateshiftMode: args.entity.TrsReq_DateshiftMode
				};
			}
			ppsCommonActivityDateshiftService.extendSuperEventLookupOptions(lookupOptions, false, 'productionplanning.common', processChangedRequisition);

			return lookupOptions;
		};

		return service;
	}

})(angular);