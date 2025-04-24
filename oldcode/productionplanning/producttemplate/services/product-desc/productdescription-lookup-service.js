(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.producttemplate';
	angular.module(moduleName).factory('ppsProductDescriptionLookupService', LookupService);

	LookupService.$inject = ['platformLayoutHelperService',
		'productionplanningProducttemplateProductDescriptionUIStandardService',
		'ppsProductDescriptionLookupDataService'];

	function LookupService(platformLayoutHelperService, uiStandardService, lookupDataService) {
		var serveice = {};

		serveice.getLookupOptions = function () {
			var gridColumns = _.cloneDeep(uiStandardService.getStandardConfigForListView().columns);
			_.forEach(gridColumns, function (o) {
				o.editor = null;
				o.navigator = null;
			});
			var selectedItem = null;

			return {
				lookupType: 'PPSProductDescription',
				valueMember: 'Id',
				displayMember: 'Code',
				defaultFilter: function (request) {
					if (!_.isNil(selectedItem)) {
						if (_.has(selectedItem, 'ProjectFk')) {
							request.ProjectId = _.get(selectedItem, 'ProjectFk');
						}
						if (_.has(selectedItem, 'EngDrawingFk')) {
							request.DrawingId = _.get(selectedItem, 'EngDrawingFk');
						}
						if (_.has(selectedItem, 'MaterialFk')) {
							request.MaterialId = _.get(selectedItem, 'MaterialFk');
						}
						if (_.has(selectedItem, 'MdcMaterialFk')) {
							request.MaterialId = _.get(selectedItem, 'MdcMaterialFk');
						}
					}
					return request;
				},
				filterOptions: {
					serverSide: true,
					serverKey: 'pps-product-description-filter',
					fn: function (item) {
						selectedItem = item;
						return lookupDataService.getFilterParams(item);
					}
				},
				pageOptions: {
					enabled: true,
					size: 100
				},
				version: 3,
				title: 'productionplanning.producttemplate.productDescriptionListTitle',
				uuid: '1755911412d942b28101fdc775bc775c',
				detailConfig: {
					fid: 'productionplanning.productdescription.selectionfilter',
					version: '1.0.0',
					showGrouping: false,
					groups: [{
						gid: 'selectionFilter',
						isOpen: true,
						visible: true,
						sortOrder: 1,
						attributes: ['ProjectId', 'DrawingId', 'MaterialId']
					}],
					rows: [
						_.assign(
							platformLayoutHelperService.provideProjectLookupOverload().detail, {
								gid: 'selectionFilter',
								rid: 'project',
								label: 'Project',
								label$tr$: 'productionplanning.common.prjProjectFk',
								model: 'ProjectId',
								sortOrder: 1
							}), {
							gid: 'selectionFilter',
							rid: 'drawing',
							label: '*Drawing',
							label$tr$: 'productionplanning.producttemplate.entityEngDrawingFk',
							model: 'DrawingId',
							sortOrder: 2,
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
							rid: 'material',
							label: '*Material',
							label$tr$: 'productionplanning.common.mdcMaterialFk',
							model: 'MaterialId',
							sortOrder: 1,
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