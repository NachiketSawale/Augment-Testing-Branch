/**
 * Created by anl on 5/10/2019.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	angular.module(moduleName).service('productionPlanningCommonProductLookupNewService', ProductLookupNewService);

	ProductLookupNewService.$inject = ['platformLayoutHelperService',
		'productionplanningCommonProductStatusLookupService',
		'productionplanningCommonProductUIStandardService',
		'productionplanningCommonProductLookupNewDataService',
		'productionplanningCommonProductStatusLookupService',
		'productionplanningCommonLayoutHelperService'];

	function ProductLookupNewService(platformLayoutHelperService,
									 productStatusService,
									 productUIiService,
									 productLookupNewDataService,
		productStatusLookupService,
		ppsCommonLayoutHelperService) {
		var service = {};
		var statusCriterias = [{Id: 1, Description: 'In'}, {Id: 2, Description: 'Not In'}];

		service.getFormSettings = function () {
			var formSettings = {
				fid: 'productionplanning.product.selectionfilter',
				version: '1.0.0',
				showGrouping: false,
				groups: [{
					gid: 'selectionFilter',
					isOpen: true,
					visible: true,
					sortOrder: 1,
					attributes: ['ProjectId', 'JobId', 'DrawingId', 'BundleId', 'StatusCriteria', 'Status', 'notAssignedFlags']
				}],
				rows: [
					_.assign(
						platformLayoutHelperService.provideProjectLookupOverload().detail,
						{
							gid: 'selectionFilter',
							rid: 'project',
							label: 'Project',
							label$tr$: 'productionplanning.common.prjProjectFk',
							model: 'ProjectId',
							sortOrder: 1
						}),
					_.assign(
						ppsCommonLayoutHelperService.provideJobExtensionLookupOverload().detail,
						{
							gid: 'selectionFilter',
							rid: 'job',
							label: '*Job',
							label$tr$: 'logistic.job.entityJob',
							model: 'JobId',
							sortOrder: 2
						}),
					{
						gid: 'selectionFilter',
						rid: 'engDrawing',
						label: '*Drawing',
						label$tr$: 'productionplanning.drawing.entityDrawing',
						model: 'DrawingId',
						sortOrder: 3,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'productionplanning-drawing-dialog-lookup',
							descriptionMember: 'Description',
							lookupOptions: {
								defaultFilter: {projectId: 'ProjectId'},
								showClearButton: true
							}
						}
					},
					{
						gid: 'selectionFilter',
						rid: 'trsBundle',
						label: '*Bundle',
						label$tr$: 'transportplanning.bundle.entityBundle',
						model: 'BundleId',
						sortOrder: 4,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							descriptionMember: 'DescriptionInfo.Description',
							lookupDirective: 'transportplanning-bundle-lookup',
							lookupOptions: {
								defaultFilter: {
									projectId: 'ProjectId',
									jobId: 'JobId'
								},
								showClearButton: true
							}
						}
					},
					{
						gid: 'selectionFilter',
						rid: 'notAssignedFlags',
						model: 'notAssignedFlags',
						type: 'composite',
						label: '*Not assigned to package',
						label$tr$: 'transportplanning.bundle.notAssignedToPkg',
						sortOrder: 5,
						composite: [{
							model: 'notAssignedToPkg',
							type: 'boolean',
							fill: false
						}, {
							label: '*Not assigned to requisition',
							label$tr$: 'transportplanning.bundle.notAssignedToReq',
							model: 'notAssignedToReq',
							type: 'boolean',
							fill: true
						}, {
							model: 'notShipped',
							type: 'boolean',
							label: '*Hide delivered',
							label$tr$: 'transportplanning.bundle.notShipped',
							fill: true
						}, {
							model: 'withoutBundle',
							type: 'boolean',
							label: '*Product without bundle',
							label$tr$: 'productionplanning.common.product.withoutBundle',
							fill: true
						}
						]
					},
					{
						gid: 'selectionFilter',
						rid: 'statusCriteria',
						label: '*Status Criteria',
						label$tr$: 'productionplanning.common.product.statusCriteria',
						model: 'StatusCriteria',
						sortOrder: 6,
						type: 'select',
						options: {
							valueMember: 'Id',
							displayMember: 'Description',
							items: statusCriterias
						}
					},
					{
						gid: 'selectionFilter',
						rid: 'status',
						label: '*Status',
						label$tr$: 'cloud.common.entityStatus',
						model: 'Status',
						sortOrder: 7,
						type: 'directive',
						directive: 'productionplanning-common-custom-filter-value-list',
						dropboxOptions: {
							items: productStatusService.getList(),
							valueMember: 'Id',
							displayMember: 'Description'
						}
					}
				]
			};
			return formSettings;
		};

		service.getGridSettings = function () {
			var gridColumns = _.cloneDeep(productUIiService.getStandardConfigForListView().columns);
			_.forEach(gridColumns, function (o) {
				o.editor = null;
				o.navigator = null;
			});

			var gridSettings = {
				columns: gridColumns,
				inputSearchMembers: ['Code', 'DescriptionInfo']
			};
			return gridSettings;
		};

		service.getLookupOptions = function () {
			var lookupOptions = {
				lookupType: 'CommonProduct',
				valueMember: 'Id',
				displayMember: 'Code',
				defaultFilter: function (request) {
					request.StatusCriteria = statusCriterias[0];
					request.notAssignedFlags = {
						notAssignedToPkg: false,
						notAssignedToReq: false,
						notShipped: false,
						withoutBundle: false,
					};
					return request;
				},
				filterOptions: {
					serverSide: true,
					serverKey: 'pps-common-product-filter',
					fn: function (item) {
						var params = productLookupNewDataService.getFilterParams(item);
						if (params && params.StatusCriteria) {
							var statusRow = _.find(lookupOptions.detailConfig.rows, {model: 'Status'});
							if (statusRow) {
								params.Status = productStatusLookupService.updateFilterStatus(statusRow.dropboxOptions.items, params.StatusCriteria, params.Status);
								params.StatusCriteria = statusCriterias[0];// always use 'in Criteria' after updateFilterStatus, because just part of the status will be filtered sometime
							}
						}
						params.EarliestStart = item.TrsReqEntity ? item.TrsReqEntity.PlannedStart : null;
						params.LatestFinish = item.TrsReqEntity ? item.TrsReqEntity.PlannedFinish : null;
						params.IgnoredIds = item.IgnoredIds;
						if(params.notAssignedFlags){
							params.notAssignedToPkg = params.notAssignedFlags.notAssignedToPkg;
							params.notAssignedToReq = params.notAssignedFlags.notAssignedToReq;
							params.notShipped = params.notAssignedFlags.notShipped;
							params.withoutBundle = params.notAssignedFlags.withoutBundle;

							delete params.notAssignedFlags;
						}
						return params;
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				title: 'productionplanning.common.assignProduct',
				uuid: 'd53f9f0e3af348f49e085576ded49eed',
				// additional properties
				detailConfig: service.getFormSettings(),
				gridSettings: service.getGridSettings(),
				processData: processDataForArray
			};

			function processDataForArray(items) {
				var statusList = productStatusLookupService.getList();
				_.forEach(items, function (item) {
					var status = _.find(statusList, {Id: item.ProductStatusFk});
					if(status.BackgroundColor) {
						item.BackgroundColor = status.BackgroundColor;
					}
				});
				return items;
			}

			return lookupOptions;
		};

		return service;
	}

})(angular);