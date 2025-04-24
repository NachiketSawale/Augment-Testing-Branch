(angular => {
	'use strict';
	/* global _ */

	const moduleName = 'transportplanning.requisition';
	angular.module(moduleName).service('trsReqDocumentSourceWindowFilterService', service);
	service.$inject = ['platformLayoutHelperService', 'platformTranslateService'];

	function service(platformLayoutHelperService, platformTranslateService) {
		const filter = {};

		function createFromConfig() {
			return {
				fid: moduleName + '.document.sourcewindow',
				version: '1.0.0',
				showGrouping: false,
				groups: [{
					gid: 'selectionfilter',
					isOpen: true,
					visible: true,
					sortOrder: 1
				}],
				rows: [
					_.assign(platformLayoutHelperService.provideProjectLookupOverload().detail, {
						gid: 'selectionfilter',
						rid: 'project',
						label: '*Project',
						label$tr$: 'cloud.common.entityProject',
						model: 'ProjectFk',
						sortOrder: 1
					}), {
						gid: 'selectionfilter',
						rid: 'job',
						type: 'directive',
						label: '*Job',
						label$tr$: 'transportplanning.bundle.entityTargetJob',
						model: 'LgmJobFk',
						directive: 'logistic-job-paging-extension-lookup',
						options: {
							lookupDirective: 'logistic-job-paging-extension-lookup',
							displayMember: 'Code',
							descriptionMember: 'DescriptionInfo.Translated',
							additionalFilters: [{
								getAdditionalEntity: getAdditionalEntityForDrawingLookup,
								projectFk: 'ProjectFk'
							}],
							lookupOptions: {
								defaultFilter: _.extend({projectFk: 'ProjectFk'}, {activeJob: true})
							},
							showClearButton: true
						},
						sortOrder: 2
					}, {
						gid: 'selectionfilter',
						rid: 'drawing',
						type: 'directive',
						label: '*Drawing',
						label$tr$: 'productionplanning.drawing.entityDrawing',
						model: 'EngDrawingFk',
						directive: 'productionplanning-drawing-dialog-all-lookup',
						options: {
							lookupDirective: 'productionplanning-drawing-dialog-all-lookup',
							displayMember: 'Code',
							descriptionMember: 'Description',
							additionalFilters: [{
								getAdditionalEntity: getAdditionalEntityForDrawingLookup,
								projectId: 'ProjectFk',
								ppsItemId: 'PpsItemFk',
							}],
							lookupOptions: {
								defaultFilter: _.extend({projectId: 'ProjectFk'})
							},
							showClearButton: true
						},
						sortOrder: 3
					}, {
						gid: 'selectionfilter',
						rid: 'pu',
						type: 'directive',
						label: '*Planning Unit',
						label$tr$: 'productionplanning.common.event.itemFk',
						model: 'PpsItemFk',
						directive: 'pps-item-complex-lookup',
						options: {
							lookupDirective: 'pps-item-complex-lookup',
							displayMember: 'Code',
							descriptionMember: 'Description',
							additionalFilters: [{
								getAdditionalEntity: getAdditionalEntityForPULookup,
								ProjectId: 'ProjectFk',
								JobId: 'LgmJobFk',
								DrawingId: 'EngDrawingFk',
							}],
							lookupOptions: {
								defaultFilter: _.extend({ProjectId: 'ProjectFk'}, {JobId: 'LgmJobFk'})
							},
							showClearButton: true
						},
						sortOrder: 4
					},
				]
			};
		}

		function getAdditionalEntityForDrawingLookup() {
			return {
				ProjectFk: filter.ProjectFk,
				PpsItemFk: filter.PpsItemFk,
			};
		}

		function getAdditionalEntityForPULookup() {
			return {
				ProjectFk: filter.ProjectFk,
				LgmJobFk: filter.LgmJobFk,
				EngDrawingFk: filter.EngDrawingFk,
			};
		}

		const config = platformTranslateService.translateFormConfig(createFromConfig());

		this.createFilterParams = (filterParams) => {
			initFilter(filterParams);
			return {
				entity: filter,
				config: config,
			};
		};

		function initFilter(filterParam) {
			for (const param of filterParam) {
				if (!Object.prototype.hasOwnProperty.call(filter, param)) {
					filter[param] = null;
				}
			}
		}

		this.setFilter = (filterParam, value = null) => {
			filter[filterParam] = value;
		};

		this.getFilter = () => {
			return filter;
		};
	}
})(angular);