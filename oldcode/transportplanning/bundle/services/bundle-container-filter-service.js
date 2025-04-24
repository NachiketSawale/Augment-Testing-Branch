(function () {
	'use strict';

	/*globals angular, _*/

	var moduleName = 'transportplanning.bundle';
	angular.module(moduleName).service('transportplanningBundleContainerFilterService', [
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
			// stupid and harmful solution, can't support multi-filter container in same page, but for some reasons it's the only solution
			var entity = {
				notAssignedFlags: {
					notAssignedToReq: true,
					notAssignedToPkg: true,
					notShipped: true
				}
			};

			function onSubFieldChanged(entity) {
				var tmp = _.cloneDeep(entity.notAssignedFlags);
				entity.notAssignedFlags = tmp; // Set entity.notAssignedFlags, for triggering watchFn of watchFilter['notAssignedFlags'] in platformSourceWindowControllerService.
				// We do this because when entity.notAssignedFlags.notAssignedToReq, entity.notAssignedFlags.notAssignedToPkg or entity.notAssignedFlags.notShipped is changed, changed of entity.notAssignedFlags has not been triggered.
			}

			this.createFilterFormConfig = function(filterArray,uuid) {
				var rows = [
					// re-show project filter and make it editable(HP-ALM #118062)
					_.assign(
						platformLayoutHelperService.provideProjectLookupOverload().detail,
						{
							gid: 'selectionfilter',
							rid: 'project',
							label: '*Project',
							label$tr$: 'cloud.common.entityProject',
							model: 'projectId',
							sortOrder: 1
						}),

					{
						gid: 'selectionfilter',
						rid: 'Site',
						label: '*Site',
						label$tr$: 'basics.site.entitySite',
						model: 'siteId',
						sortOrder: 2,
						type: 'directive',
						directive: 'productionplanning-common-custom-filter-value-list',
						dropboxOptions: {
							items: trsProjectConfigService.getStockYardList(),
							valueMember: 'Id',
							displayMember: 'Code'
						}
					},
					basicsLookupdataConfigGenerator.provideElaboratedLookupConfigForForm(
						'transportplanning-package-lookup',
						'TrsPackage',
						'Code',
						true,
						{
							gid: 'selectionfilter',
							rid: 'package',
							label: '*Package',
							label$tr$: 'transportplanning.bundle.entityPackage',
							model: 'trsPackageId',
							sortOrder: 3
						},
						'transportplanning-bundle-lookup-dialog-package-filter'),
					{
						gid: 'selectionfilter',
						rid: 'job',
						type: 'directive',
						label: '*Job',
						label$tr$: 'transportplanning.bundle.entityJob',
						model: 'jobId',
						directive:'logistic-job-paging-extension-lookup',
						options: {
							lookupDirective: 'logistic-job-paging-extension-lookup',
							displayMember: 'Code',
							descriptionMember: 'DescriptionInfo.Translated',
							additionalFilters:[{
								getAdditionalEntity: function () {
									var containerInfoService = platformContainerControllerService.getModuleInformationService(moduleName);
									var containerInfo = containerInfoService.getContainerInfoByGuid(uuid);
									var dataService = $injector.get(containerInfo.dataServiceName);
									var selected = dataService.parentService().getSelected();
									if(selected){
										return selected;
									}
									else {
										return {ProjectFk: null};
									}
								},
								projectFk: 'ProjectFk'
							}],
							lookupOptions:{
								defaultFilter: _.extend({projectFk: 'ProjectFk'}, {activeJob: true})
							},
							showClearButton: true
						},
						sortOrder: 4
					},
					{
						gid: 'selectionfilter',
						rid: 'drawing',
						type: 'directive',
						label: '*Drawing',
						label$tr$: 'productionplanning.drawing.entityDrawing',
						model: 'drawingId',
						directive:'productionplanning-drawing-dialog-all-lookup',
						options: {
							lookupDirective: 'productionplanning-drawing-dialog-all-lookup',
							displayMember: 'Code',
							descriptionMember: 'Description',
							additionalFilters:[{
								getAdditionalEntity: function () {
									var containerInfoService = platformContainerControllerService.getModuleInformationService(moduleName);
									var containerInfo = containerInfoService.getContainerInfoByGuid(uuid);
									var dataService = $injector.get(containerInfo.dataServiceName);
									var selected = dataService.parentService().getSelected();
									if(selected){
										return selected;
									}
									else {
										return {ProjectFk: null};
									}
								},
								projectId: 'ProjectFk'
							}],
							lookupOptions:{
								defaultFilter: _.extend({projectId: 'ProjectFk'})
							},
							showClearButton: true
						},
						sortOrder: 5
					},

					{
						gid: 'selectionfilter',
						rid: 'pu',
						type: 'directive',
						label: '*Planning Unit',
						label$tr$: 'productionplanning.common.event.itemFk',
						model: 'puId',
						directive:'pps-item-complex-lookup',
						options: {
							lookupDirective: 'pps-item-complex-lookup',
							displayMember: 'Code',
							descriptionMember: 'Description',
							additionalFilters:[{
								getAdditionalEntity: function () {
									var containerInfoService = platformContainerControllerService.getModuleInformationService(moduleName);
									var containerInfo = containerInfoService.getContainerInfoByGuid(uuid);
									var dataService = $injector.get(containerInfo.dataServiceName);
									var selected = dataService.parentService().getSelected();
									if(selected){
										return selected;
									}
									else {
										return {ProjectFk: null};
									}
								},
								ProjectId: 'ProjectFk',
								JobId: 'LgmJobFk'
							}],
							lookupOptions:{
								defaultFilter: _.extend({ProjectId: 'ProjectFk'}, {JobId: 'LgmJobFk'})
							},
							showClearButton: true
						},
						sortOrder: 5
					},

					basicsLookupdataConfigGenerator.provideElaboratedLookupConfigForForm(
						'transportplanning-requisition-lookup',
						'TrsRequisition',
						'Code',
						true,
						{
							gid: 'selectionfilter',
							rid: 'trsRequisition',
							label: '*Transport Requisition',
							label$tr$: 'transportplanning.bundle.entityRequisition',
							model: 'trsRequisitionId',
							sortOrder: 6
						},
						'transportplanning-bundle-lookup-dialog-requisition-filter'),
					{
						gid: 'selectionfilter',
						rid: 'notAssignedFlags',
						model: 'notAssignedFlags',
						type: 'composite',
						label: '*Not assigned to package',
						label$tr$: 'transportplanning.bundle.notAssignedToPkg',
						sortOrder: 7,
						composite: [{
							model: 'notAssignedToPkg',
							type: 'boolean',
							fill: false,
							change: onSubFieldChanged
						}, {
							label: '*Not assigned to requisition',
							label$tr$: 'transportplanning.bundle.notAssignedToReq',
							model: 'notAssignedToReq',
							type: 'boolean',
							fill: true,
							change:onSubFieldChanged
						}, {
							model: 'notShipped',
							type: 'boolean',
							label: '*Hide delivered',
							label$tr$: 'transportplanning.bundle.notShipped',
							fill: true,
							change:onSubFieldChanged
						}
						]
					}];
				if(filterArray){
					// remove rows that won't be used.
					// e.g. 1. in Transport Requistion module, 'trsPackageId' are not used.
					//      2. in Mounting/Mounting-Activity module, 'trsPackageId' and 'trsRequisitionId' are not used.
					_.remove(rows,function (row) {
						return filterArray.indexOf(row.model) <= -1;
					});
				}

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

			this.resetEntityByFilter = function (filterArray) {
				entity = {
					notAssignedFlags: {
						notAssignedToReq: true,
						notAssignedToPkg: true,
						notShipped: true
					},
					siteId : trsProjectConfigService.initSiteFilter()
				};
			};

			this.createFilterParams = function createFilterParams(filter, uuid) {
				this.resetEntityByFilter(filter);
				return {
					config: platformTranslateService.translateFormConfig(this.createFilterFormConfig(filter,uuid)),
					entity: entity
				};
			};

			this.generateFilterRequest = function (filters, searchString) {
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
				generateFurtherFilter(filters.siteId, 'Site', request.FurtherFilters);
				generateFurtherFilter(filters.trsPackageId, 'TrsPackage', request.FurtherFilters);
				generateFurtherFilter(filters.jobId, 'Job', request.FurtherFilters);
				generateFurtherFilter(filters.trsRequisitionId, 'TrsRequisition', request.FurtherFilters);
				generateFurtherFilter(filters.drawingId, 'Drawing', request.FurtherFilters);
				generateFurtherFilter(filters.puId, 'PU', request.FurtherFilters);

				if(filters.notAssignedFlags){
					_.each(['notAssignedToPkg', 'notAssignedToReq', 'notShipped'],function (field) {
						var tokenName = field.substring(0,1).toUpperCase()+field.substring(1);
						generateFurtherFilter(filters.notAssignedFlags[field] ? 1 : 0, tokenName, request.FurtherFilters);
					});
				}

				request.EarliestStart = null; //filters.EarliestStart;
				request.LatestFinish = null; //filters.LatestFinish;

				return request;
			};

			this.setFilter = function (filter) {
				_.assign(entity, filter);
			};

			this.isSameFilter = function (filter) {
				//check if filter and entity is same
				var fields = ['projectId', 'trsPackageId', 'jobId', 'trsRequisitionId', 'drawingId', 'puId'];
				for (var i = 0; i< fields.length; i++) {
					/* jshint -W116 */
					if (entity[fields[i]] === filter[fields[i]] || (_.isNil(entity[fields[i]]) && _.isNil(filter[fields[i]])) ) {
						continue;
					}
					else {
						return false;
					}
				}
				// compare 'siteId'
				if(!isSameSite(filter)){
					return false;
				}

				// compare 'notAssignedFlags'
				if( (_.isNil(entity.notAssignedFlags) && !_.isNil(filter.notAssignedFlags)) ||
					 (!_.isNil(entity.notAssignedFlags) && _.isNil(filter.notAssignedFlags)) ){
					return false;
				}
				if( !_.isNil(entity.notAssignedFlags) && !_.isNil(filter.notAssignedFlags) &&
					 (entity.notAssignedFlags.notAssignedToPkg !== entity.notAssignedFlags.notAssignedToPkg ||
						 entity.notAssignedFlags.notAssignedToReq !== entity.notAssignedFlags.notAssignedToReq ||
						 entity.notAssignedFlags.notShipped !== entity.notAssignedFlags.notShipped) ){
					return false;
				}

				return true;
			};

			function isSameSite(filter) {
				return isSameArray(entity.siteId, filter.siteId);
			}

			function isNilOrEmpty(array) {
				return _.isNil(array) || array === '' || array.length === 0;
			}

			function isSameArray(arr1, arr2) {
				if (isNilOrEmpty(arr1) && isNilOrEmpty(arr2)) {
					return true;
				}

				if ((_.isArray(arr1) && !_.isArray(arr2))
					|| (!_.isArray(arr1) && _.isArray(arr2))) {
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

				return _.isEqual(tmpArr1,tmpArr2);
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

			// this.getFilter = function () {
			// 	return _.cloneDeep(entity);
			// };

			/* method isMappingToFilter() is not referenced any more. And in the future, if we reuse this method, we should also refactor code of it to be mapping to the latest entity/filter.
			this.isMappingToFilter = function (bundle) {
				if(entity.projectId && entity.projectId !== bundle.ProjectFk){
					return false;
				}
				if(entity.siteId && entity.siteId !== bundle.SiteFk){
					return false;
				}
				if(entity.jobId && entity.jobId !== bundle.LgmJobFk){
					return false;
				}
				if(entity.trsPackageId && entity.trsPackageId !== bundle.TrsPackageFk){
					return false;
				}
				if(entity.trsRequisitionId && entity.trsRequisitionId !== bundle.TrsRequisitionFk){
					return false;
				}

				if(entity.notAssignedToPkg && bundle.TrsPackageFk !== null){
					return false;
				}
				if(entity.notAssignedToReq && bundle.trsRequisitionId !== null){
					return false;
				}

				return true;
			};
			*/
		}
	]);
})();
