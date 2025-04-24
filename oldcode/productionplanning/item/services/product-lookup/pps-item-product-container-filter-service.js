(function () {
	'use strict';

	/* globals angular, _ */

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('productionplanningItemProductContainerFilterService', [
		'$injector',
		'platformContainerControllerService',
		'platformGridAPI',
		'platformLayoutHelperService',
		'platformTranslateService',
		function ($injector,
			platformContainerControllerService,
			platformGridAPI,
			platformLayoutHelperService,
			platformTranslateService) {

			// stupid and harmful solution, can't support multi-filter container in same page, but for some reasons it's the only solution
			var entity = {};
			let service = {};
			service.createFilterFormConfig = function (filterArray) {
				var rows = [
					// re-show project filter and make it editable(HP-ALM #118062)
					_.assign(platformLayoutHelperService.provideProjectLookupOverload().detail, {
						gid: 'selectionfilter',
						rid: 'project',
						label: '*Project',
						label$tr$: 'cloud.common.entityProject',
						model: 'projectId',
						sortOrder: 1
					}),
					{
						gid: 'selectionfilter',
						rid: 'job',
						type: 'directive',
						label: '*Job',
						label$tr$: 'transportplanning.bundle.entityTargetJob',
						model: 'jobId',
						directive: 'logistic-job-paging-extension-lookup',
						options: {
							lookupDirective: 'logistic-job-paging-extension-lookup',
							displayMember: 'Code',
							descriptionMember: 'DescriptionInfo.Translated',
							additionalFilters: [{
								getAdditionalEntity: function () {
									var selected = $injector.get('productionplanningItemProductLookupDataService').parentService().getSelected();
									if (selected) {
										return selected;
									} else {
										return {ProjectFk: null};
									}
								},
								projectFk: 'ProjectFk'
							}],
							lookupOptions: {
								defaultFilter: _.extend({projectFk: 'ProjectFk'}, {activeJob: true})
							},
							showClearButton: true
						},
						sortOrder: 2
					},
					{
						gid: 'selectionfilter',
						rid: 'drawing',
						type: 'directive',
						label: '*Drawing',
						label$tr$: 'productionplanning.drawing.entityDrawing',
						model: 'drawingId',
						directive: 'productionplanning-drawing-dialog-all-lookup',
						options: {
							lookupDirective: 'productionplanning-drawing-dialog-all-lookup',
							displayMember: 'Code',
							descriptionMember: 'Description',
							additionalFilters: [{
								getAdditionalEntity: function () {
									var selected = $injector.get('productionplanningItemProductLookupDataService').parentService().getSelected();
									if (selected) {
										return selected;
									} else {
										return {ProjectFk: null};
									}
								},
								projectId: 'ProjectFk'
							}],
							lookupOptions: {
								defaultFilter: _.extend({projectId: 'ProjectFk'})
							},
							showClearButton: true
						},
						sortOrder: 4
					},
				];

				return {
					fid: 'productionplanning.item.selectionfilter',
					version: '1.0.0',
					showGrouping: false,
					groups: [{
						gid: 'selectionfilter',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}],
					rows: rows
				};
			};

			service.createFilterParams = function createFilterParams(filter, uuid) {
				entity = {};
				return {
					config: platformTranslateService.translateFormConfig(service.createFilterFormConfig(filter, uuid)),
					entity: entity
				};
			};

			service.generateFilterRequest = function (filters, searchString) {
				filters = filters ? filters : entity;
				var request = {
					Pattern: searchString,
					FurtherFilters: [],
				};
				generateFurtherFilter(filters.projectId, 'ProjectId', request.FurtherFilters);
				generateFurtherFilter(filters.jobId, 'JobId', request.FurtherFilters);
				generateFurtherFilter(filters.drawingId, 'DrawingId', request.FurtherFilters);

				return request;
			};

			service.setFilter = function (filter) {
				_.assign(entity, filter);
			};

			service.isSameFilter = function (filter) {
				// check if filter and entity is same
				let fields = ['projectId', 'jobId', 'drawingId'];
				for (var i = 0; i < fields.length; i++) {
					/* jshint -W116 */
					if (entity[fields[i]] === filter[fields[i]] || (_.isNil(entity[fields[i]]) && _.isNil(filter[fields[i]]))) {
						continue;
					} else {
						return false;
					}
				}
			};

			function generateFurtherFilter(filterValue, filterToken, furtherFilters) {
				let filterValStr = !_.isNil(filterValue) ? filterValue.toString() : '';
				if (filterValStr.length > 0) {
					furtherFilters.push({
						Token: filterToken,
						Value: filterValStr
					});
				}
			}
			return service;

		}
	]);
})();
