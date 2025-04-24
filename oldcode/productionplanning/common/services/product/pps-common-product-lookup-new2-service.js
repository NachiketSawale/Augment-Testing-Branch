/**
 * Created by anl on 10/16/2023.
 */

(function (angular) {
	'use strict';
	/* global _ */
	let moduleName = 'productionplanning.common';

	angular.module(moduleName).service('productionPlanningCommonProductLookupNew2Service', ProductLookupService);

	ProductLookupService.$inject = [
		'$http',
		'$injector',
		'platformLayoutHelperService',
		'productionplanningCommonProductUIStandardService',
		'productionplanningCommonProductStatusLookupService',
		'productionplanningCommonProductLookupNewDataService',
		'transportplanningBundleTrsProjectConfigService'];

	function ProductLookupService(
		$http,
		$injector,
		platformLayoutHelperService,
		productUIiService,
		productStatusLookupService,
		productLookupNewDataService,
		trsProjectConfigService) {
		let service = {};

		let boolParameters = {
			HideDeliveredBool: true
		};

		service.getFormSettings = function () {
			let formSettings = {
				fid: 'productionplanning.product.filter',
				version: '1.0.0',
				showGrouping: false,
				groups: [{
					gid: 'productFilter',
					isOpen: true,
					visible: true
				}],
				rows: [
					_.assign(platformLayoutHelperService.provideProjectLookupOverload().detail, {
						gid: 'productFilter',
						rid: 'project',
						label: '*Project',
						label$tr$: 'cloud.common.entityProject',
						model: 'ProjectId',
						sortOrder: 1
					}),
					{
						gid: 'productFilter',
						rid: 'job',
						type: 'directive',
						label: '*Job',
						label$tr$: 'transportplanning.bundle.entityTargetJob',
						model: 'JobId',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'logistic-job-paging-extension-lookup',
							displayMember: 'Code',
							descriptionMember: 'DescriptionInfo.Translated',
							additionalFilters:[{
								getAdditionalEntity: function (entity) {
									return {ProjectId: entity.ProjectId};
								},
								projectFk: 'ProjectId'
							}, {
								getAdditionalEntity: function (entity) {
									return {DrawingId: entity.DrawingId};
								},
								drawingFk: 'DrawingId'
							}],
							lookupOptions: {
								defaultFilter: {projectFk: 'ProjectId', drawingFk: 'DrawingId',activeJob: true}
							},
							showClearButton: true
						},
						sortOrder: 2
					},
					{
						gid: 'productFilter',
						rid: 'jobFromHistory',
						label: '*Current Location Job',
						label$tr$: 'transportplanning.bundle.entityJobFromHistory',
						model: 'JobIdFromHistory',
						sortOrder: 3,
						type: 'directive',
						directive: 'current-location-job-lookup',
						options: {
							multipleSelection: true,
							showClearButton: true,
						},
					},
					{
						gid: 'productFilter',
						rid: 'drawing',
						type: 'directive',
						label: '*Drawing',
						label$tr$: 'productionplanning.drawing.entityDrawing',
						model: 'DrawingId',
						directive: 'productionplanning-drawing-dialog-all-lookup',
						options: {
							lookupDirective: 'productionplanning-drawing-dialog-all-lookup',
							displayMember: 'Code',
							descriptionMember: 'Description',
							additionalFilters:[{
								getAdditionalEntity: function (entity) {
									return {ProjectId: entity.ProjectId};
								},
								projectId: 'ProjectId'
							}],
							lookupOptions: {
								defaultFilter: {projectId: 'ProjectId'}
							},
							showClearButton: true
						},
						sortOrder: 4
					},
					{
						gid: 'productFilter',
						rid: 'pu',
						type: 'directive',
						label: '*Planning Unit',
						label$tr$: 'productionplanning.common.event.itemFk',
						model: 'PuId',
						directive: 'pps-item-complex-lookup',
						options: {
							lookupDirective: 'pps-item-complex-lookup',
							displayMember: 'Code',
							descriptionMember: 'Description',
							showClearButton: true
						},
						sortOrder: 5
					},
					{
						gid: 'productFilter',
						type: 'composite',
						rid: 'boolFilter',
						model: 'BoolFilter',
						label: '',
						sortOrder: 6,
						composite: [
							{
								model: 'HideDeliveredBool',
								type: 'boolean',
								label: '*Hide goods at target',
								label$tr$: 'transportplanning.bundle.hideDeliveredBool',
								change: (entity) => {
									boolParameters.HideDeliveredBool = entity.BoolFilter.HideDeliveredBool;
								}
							},{
								model: 'onlyBeforeDelivery',
								type: 'boolean',
								label: '*Show Only Available',
								label$tr$: 'transportplanning.bundle.onlyBeforeDelivery',
							}]
					}
				]
			};
			return formSettings;
		};

		service.getGridSettings = function () {
			let gridColumns = _.cloneDeep(productUIiService.getStandardConfigForListView().columns);
			_.forEach(gridColumns, function (o) {
				o.editor = null;
				o.navigator = null;
			});

			let gridSettings = {
				columns: gridColumns,
				inputSearchMembers: ['Code', 'DescriptionInfo']
			};
			return gridSettings;
		};

		service.getLookupOptions = function (scope) {

			let lookupOptions = {
				lookupType: 'CommonProduct',
				valueMember: 'Id',
				displayMember: 'Code',
				defaultFilter: function (request) {
					return request;
				},
				filterOptions: {
					serverSide: true,
					serverKey: 'pps-common-unassign-product-filter',
					fn: function (item) {
						let params = productLookupNewDataService.getFilterParams(item);
						_.extend(params, boolParameters);
						if (!_.isNil(params.JobIdFromHistory) && params.JobIdFromHistory.length > 0) {
							params.JobIdFromHistory = trsProjectConfigService.resolveJobIds(params.JobIdFromHistory);
						} else {
							delete params.JobIdFromHistory;
						}

						if(params.BoolFilter && params.BoolFilter.onlyBeforeDelivery){
							params.PlannedDeliveryTime = scope.request.plannedDeliveryTime;
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
					if (status.BackgroundColor) {
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