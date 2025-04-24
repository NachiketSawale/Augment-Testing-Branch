(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('ppsItemLookupService', LookupService);

	LookupService.$inject = ['platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'productionplanningItemUIStandardService', 'ppsItemLookupDataService', 'productionplanningCommonLayoutHelperService'];

	function LookupService(platformLayoutHelperService, basicsLookupdataConfigGenerator,
		uiStandardService, lookupDataService, ppsCommonLayoutHelperService) {
		var serveice = {};

		serveice.getLookupOptions = function () {
			var gridColumns = _.cloneDeep(uiStandardService.getStandardConfigForListView().columns);
			_.forEach(gridColumns, function (o) {
				o.editor = null;
				o.navigator = null;
			});

			return {
				lookupType: 'PPSItem',
				valueMember: 'Id',
				displayMember: 'Code',
				filterOptions: {
					serverSide: true,
					serverKey: 'pps-item-filter',
					fn: function (item) {
						return lookupDataService.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				title: 'productionplanning.item.entityItem',
				uuid: '04e1b8ad4720491a8452a9fb104d4c00',
				detailConfig: {
					fid: 'productionplanning.item.selectionfilter',
					version: '1.0.0',
					showGrouping: false,
					groups: [{
						gid: 'selectionFilter',
						isOpen: true,
						visible: true,
						sortOrder: 1,
						attributes: ['ProjectId', 'PrjLocationId', 'JobId', 'DrawingId', 'MaterialGroupId', 'MaterialId', 'OnlyShowLeaves']
					}],
					rows: [
						_.assign(platformLayoutHelperService.provideProjectLookupOverload().detail, {
							gid: 'selectionFilter',
							rid: 'project',
							label: '*Project',
							label$tr$: 'productionplanning.common.prjProjectFk',
							model: 'ProjectId',
							sortOrder: 1
						}),
						_.assign(basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectLocationLookupDataService',
							cacheEnable: true,
							additionalColumns: true,
							filter: function (item) {
								var projectId = -1;
								if(item && item.ProjectId) {
									projectId = item.ProjectId;
								}
								return projectId;
							},
							showClearButton: true
						}).detail, {
							gid: 'selectionFilter',
							rid: 'prjLocation',
							label: '*Project Location',
							label$tr$: 'productionplanning.common.prjLocationFk',
							model: 'PrjLocationId',
							sortOrder: 2
						}),
						_.assign(ppsCommonLayoutHelperService.provideJobExtensionLookupOverload({projectFk: 'ProjectId'}).detail, {
							gid: 'selectionFilter',
							rid: 'job',
							label: '*Job',
							label$tr$: 'logistic.job.titleLogisticJob',
							model: 'JobId',
							sortOrder: 3
						}), {
							gid: 'selectionFilter',
							rid: 'drawing',
							label: '*Drawing',
							label$tr$: 'productionplanning.producttemplate.entityEngDrawingFk',
							model: 'DrawingId',
							sortOrder: 4,
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
						}, {
							gid: 'selectionFilter',
							rid: 'materialGroup',
							label: '*Material Group',
							label$tr$: 'productionplanning.item.materialGroupFk',
							model: 'MaterialGroupId',
							sortOrder: 5,
							type: 'directive',
							directive: 'basics-material-material-group-lookup',
							options: {
								initValueField: 'Code',
								showClearButton: true,
								lookupOptions: {
									showClearButton: true
								}
							}
						}, {
							gid: 'selectionFilter',
							rid: 'material',
							label: '*Material',
							label$tr$: 'productionplanning.common.mdcMaterialFk',
							model: 'MaterialId',
							sortOrder: 6,
							type: 'directive',
							directive: 'basics-material-material-lookup',
							options: {
								initValueField: 'Code',
								showClearButton: true,
								lookupOptions: {
									showClearButton: true,
									gridOptions: {
										disableCreateSimilarBtn: true
									}
								}
							}
						}, {
							gid: 'selectionFilter',
							rid: 'child',
							label: '*Only show leaves',
							label$tr$: 'productionplanning.item.onlyShowLeaf',
							model: 'OnlyShowLeaves',
							sortOrder: 7,
							type: 'boolean'
						}, {
							gid: 'selectionFilter',
							rid: 'child',
							label: '*Only show has task and not link to any drawing',
							model: 'OnlyShowHasEngTaskEventAndNotLinkAnyDrawing',
							sortOrder: 8,
							type: 'boolean',
							visible: false
						}]
				},
				gridSettings: {
					columns: gridColumns,
					inputSearchMembers: ['Code', 'DescriptionInfo']
				}
			};
		};

		return serveice;
	}
})(angular);