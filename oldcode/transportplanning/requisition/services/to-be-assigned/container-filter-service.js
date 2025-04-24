(function () {
	'use strict';

	/* globals angular, _ */

	var moduleName = 'transportplanning.bundle';
	angular.module(moduleName).factory('transportplanningRequisitionContainerFilterService', [
		'$injector',
		'platformContainerControllerService',
		'platformGridAPI',
		'platformLayoutHelperService',
		'platformTranslateService',
		'basicsLookupdataConfigGenerator',
		'lookupFilterDialogDataService',
		'basicsCommonBaseDataServiceReferenceActionExtension',
		'transportplanningBundleTrsProjectConfigService',
		function ($injector,
			platformContainerControllerService,
			platformGridAPI,
			platformLayoutHelperService,
			platformTranslateService,
			basicsLookupdataConfigGenerator,
			lookupDataServiceFactory,
			referenceActionExtension,
			trsProjectConfigService) {

			return {createFilterService: (isTree) => {
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
										var selected = $injector.get('transportplanningRequisitionToBeAssignedDataService').getService(isTree).parentService().getSelected();
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
							rid: 'jobFromHistory',
							label: '*Current Location Job',
							label$tr$: 'transportplanning.bundle.entityJobFromHistory',
							model: 'jobIdFromHistory',
							sortOrder: 3,
							type: 'directive',
							directive: 'current-location-job-lookup',
							options: {
								multipleSelection: true,
								showClearButton: true,
								events: [{
									name: 'onEditValueChanged',
									handler: function (e, args) {
										const selectedJobIds = args.selectedItems.map(item => item.Id);
										// handle the case that all jobs are deleted by the clear button.
										if (Array.isArray(selectedJobIds) && selectedJobIds.length === 0) {
											$injector.get('transportplanningRequisitionToBeAssignedDataService').getService(isTree)
												.setSelectedFilter('jobIdFromHistory', selectedJobIds);
										}
									}
								}]
							},
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
										var selected = $injector.get('transportplanningRequisitionToBeAssignedDataService').getService(isTree).parentService().getSelected();
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

						{
							gid: 'selectionfilter',
							rid: 'pu',
							type: 'directive',
							label: '*Planning Unit',
							label$tr$: 'productionplanning.common.event.itemFk',
							model: 'puId',
							directive: 'pps-item-complex-lookup',
							options: {
								lookupDirective: 'pps-item-complex-lookup',
								displayMember: 'Code',
								descriptionMember: 'Description',
								additionalFilters: [{
									getAdditionalEntity: function () {
										var selected = $injector.get('transportplanningRequisitionToBeAssignedDataService').getService(isTree).parentService().getSelected();
										if (selected) {
											return selected;
										} else {
											return {ProjectFk: null};
										}
									},
									ProjectId: 'ProjectFk',
									JobId: 'LgmJobFk'
								}],
								lookupOptions: {
									defaultFilter: _.extend({ProjectId: 'ProjectFk'}, {JobId: 'LgmJobFk'})
								},
								showClearButton: true
							},
							sortOrder: 5
						}, {
							gid: 'selectionfilter',
							type: 'composite',
							label: '',
							sortOrder: 7,
							composite: [{
								label: '*Bundle',
								label$tr$: 'transportplanning.bundle.bundleBool',
								model: 'bundleBool',
								type: 'boolean',
								change: (entity) => {
									$injector.get('transportplanningRequisitionToBeAssignedDataService').getService(isTree).lastBundleBool = entity.bundleBool;
								}
							}, {
								label: '*Upstream Requirement',
								label$tr$: 'transportplanning.bundle.upstreamBool',
								model: 'upstreamBool',
								type: 'boolean',
								change: (entity) => {
									$injector.get('transportplanningRequisitionToBeAssignedDataService').getService(isTree).lastUpstreamBool = entity.upstreamBool;
								}
							}, {
								model: 'productBool',
								type: 'boolean',
								label: '*Product without Bundle',
								label$tr$: 'transportplanning.bundle.productBool',
								change: (entity) => {
									$injector.get('transportplanningRequisitionToBeAssignedDataService').getService(isTree).lastProductBool = entity.productBool;
								}
							}, {
								model: 'hideDeliveredBool',
								type: 'boolean',
								label: '*Hide goods at target',
								label$tr$: 'transportplanning.bundle.hideDeliveredBool',
								change: (entity) => {
									$injector.get('transportplanningRequisitionToBeAssignedDataService').getService(isTree).lasthideDeliveredBool = entity.hideDeliveredBool;
								}
							}]
						}
					];

					return {
						fid: 'transportplanning.bundle.selectionfilter',
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
					entity = {
						jobIdFromHistory : trsProjectConfigService.initJobFilter()
					};
					return {
						config: platformTranslateService.translateFormConfig(service.createFilterFormConfig(filter, uuid)),
						entity: entity
					};
				};

				service.generateFilterRequest = function (filters, searchString) {
					filters = filters ? filters : entity;
					// those data try to handle assign bundle to package before save in db
					var assignedToPkgBundles = _.map(referenceActionExtension.getAssignedItemsRecord('transportplanningBundleToPackage'), 'Id');
					// those data try to handle assign bundle to requisition before save in db
					var assignedToReqBundles = _.map(referenceActionExtension.getAssignedItemsRecord('transportplanningBundleToRequisition'), 'Id');
					var request = {
						Pattern: searchString,
						FurtherFilters: [],
						AssignedToPkgBundles: assignedToPkgBundles,
						AssignedToReqBundles: assignedToReqBundles
					};
					generateFurtherFilter(filters.projectId, 'Project', request.FurtherFilters);
					generateFurtherFilter(filters.jobId, 'Job', request.FurtherFilters);
					generateFurtherFilter(filters.jobIdFromHistory, 'JobFromHistory', request.FurtherFilters);
					generateFurtherFilter(filters.drawingId, 'Drawing', request.FurtherFilters);
					generateFurtherFilter(filters.puId, 'PU', request.FurtherFilters);
					generateFurtherFilter(filters.bundleBool, 'IncludeBundle', request.FurtherFilters);
					generateFurtherFilter(filters.productBool, 'IncludeProduct', request.FurtherFilters);
					generateFurtherFilter(filters.upstreamBool, 'IncludeUpstream', request.FurtherFilters);
					generateFurtherFilter(filters.hideDeliveredBool, 'NotShipped', request.FurtherFilters);

					return request;
				};

				service.setFilter = function (filter) {
					_.assign(entity, filter);
				};

				service.isSameFilter = function (filter) {
					// check if filter and entity is same
					let fields = ['projectId', 'jobId',  'drawingId', 'puId', 'bundleBool', 'upstreamBool', 'productBool', 'hideDeliveredBool'];
					for (var i = 0; i < fields.length; i++) {
						/* jshint -W116 */
						if (entity[fields[i]] === filter[fields[i]] || (_.isNil(entity[fields[i]]) && _.isNil(filter[fields[i]]))) {
							continue;
						} else {
							return false;
						}
					}
					// 'jobIdFromHistory'
					return isSameJobs(filter);
				};

				function isSameJobs(filter) {
					return isSameArray(entity.jobIdFromHistory, filter.jobIdFromHistory);
				}

				function isNilOrEmpty(array) {
					return _.isNil(array) || array === '' || array.length === 0;
				}

				function isSameArray(arr1, arr2) {
					if (isNilOrEmpty(arr1) && isNilOrEmpty(arr2)) {
						return true;
					}

					if ((_.isArray(arr1) && !_.isArray(arr2)) || (!_.isArray(arr1) && _.isArray(arr2))) {
						return false;
					}

					let tmpArr1 = _.cloneDeep(arr1); // method sort() may modify the original array, so we need to do deep-copy first
					let tmpArr2 = _.cloneDeep(arr2);
					tmpArr1 = tmpArr1.filter(function (item) {
						return item !== null && item !== undefined && item !== '';
					}).sort();
					tmpArr2 = tmpArr2.filter(function (item) {
						return item !== null && item !== undefined && item !== '';
					}).sort();

					return _.isEqual(tmpArr1, tmpArr2);
				}

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
			}};
			
		}
	]);
})();
