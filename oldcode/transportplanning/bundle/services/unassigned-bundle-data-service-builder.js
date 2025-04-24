/**
 * Created by waz on 3/26/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.bundle';
	var BundleModul = angular.module(moduleName);

	/**
	 * @summary
	 * The unassign-dataService-builder will build a data-service shows unassigned bundles
	 */
	BundleModul.factory('transportplanningBundleUnassignedDataServiceBuilder', UnassignedDataServiceBuilder);
	UnassignedDataServiceBuilder.$inject = [
		'$injector',
		'PlatformMessenger',
		'cloudDesktopPinningContextService',
		'platformDataServiceSidebarSearchExtension',
		'basicsCommonBaseDataServiceReferenceActionExtension',
		'transportplanningBundleDataServiceContainerBuilder',
		'transportplanningBundleContainerFilterService',
		'productionplanningCommonStructureFilterService',
		'transportplanningBundleTrsProjectConfigService'];

	function UnassignedDataServiceBuilder($injector,
	                                      PlatformMessenger,
	                                      cloudDesktopPinningContextService,
	                                      platformDataServiceSidebarSearchExtension,
	                                      basicsCommonBaseDataServiceReferenceActionExtension,
	                                      BaseDataServiceBuilder,
	                                      bundleContainerFilterService,
	                                      ppsCommonStructureFilterService,
										  trsProjectConfigService) {
		var MINUM_PAGE_SIZE = 100;
		//var MAX_PAGE_SIZE = 4294967295;
		var MAX_PAGE_SIZE = 99999;
		// remark: quickly fix issue of failure of initialization of BundleLookupRequest because max value of PageSize(int32 type) is less than 4294967295. And 99999 should be enough.(by zwz 2021/5/20)

		var DEFAULT_PAGE_NUMBER = 0;

		var Builder = function (mainOptionsType) {
			BaseDataServiceBuilder.call(this, mainOptionsType);
			initOptions(this);
		};

		Builder.prototype = Object.create(BaseDataServiceBuilder.prototype);
		var base = BaseDataServiceBuilder.prototype;

		Builder.prototype.setupServiceContainer = function (serviceContainer) {
			function updateProductInfo(items) {
				var reqsBundleIds = {};
				var requisition = serviceContainer.service.getNeedAssignedDataService().parentService().getSelected();
				var assignBundleIds = _.flatten(_.map(items, 'Id'));
				var originBundleIds = _.map(serviceContainer.service.getNeedAssignedDataService().getList(), 'Id');
				reqsBundleIds[requisition.Id] = _.filter(_.uniq(_.concat(originBundleIds, assignBundleIds)),
					function (item) {
						return item !== null;
					});
				serviceContainer.service.getNeedAssignedDataService().parentService().updateProductInfo(reqsBundleIds);
			}

			var self = this;

			base.setupServiceContainer.call(this, serviceContainer);
			basicsCommonBaseDataServiceReferenceActionExtension.addReferenceActions(serviceContainer, {createReference: true});

			// overwrite method showItems() for skipping unmatching items
			// serviceContainer.service.showItems = function (items) {
			// 	var mappingItems = _.filter(items,function (item) {
			// 		return bundleContainerFilterService.isMappingToFilter(item) === true;
			// 	});
			//
			// 	if(mappingItems && mappingItems.length >0){
			// 		basicsCommonBaseDataServiceReferenceActionExtension.showItems(serviceContainer, mappingItems);
			// 	}
			// };
			// remark: consider "FilterByNotShippedProducts" in server side, at the moment we do nothing in method showItems().(zwz 2019/6/6)
			serviceContainer.service.showItems = function () {};


			serviceContainer.service.parentService().registerRefreshRequested(function () {
				if(serviceContainer.service.parentService().getSelected()){
					serviceContainer.service.load();
				}
			});

			// for load all button
			serviceContainer.service.loadAll = function () {
				serviceContainer.data.filterRequest.pageSize = MAX_PAGE_SIZE;
				serviceContainer.service.load();
				serviceContainer.data.hasLoadAll = true;
				serviceContainer.service.needShowLoadAllButton = false;
			};
			serviceContainer.data.onEntityReadSuccessed = new PlatformMessenger();
			serviceContainer.service.registerEntityReadSuccessed = function (callbackFn) {
				serviceContainer.data.onEntityReadSuccessed.register(callbackFn);
			};
			var baseOnReadSuccessedFn = serviceContainer.data.onReadSucceeded;
			serviceContainer.data.onReadSucceeded = function (readData, data) {
				serviceContainer.data.onEntityReadSuccessed.fire(readData);
				serviceContainer.data.filterRequest.pageSize = MINUM_PAGE_SIZE;
				serviceContainer.data.hasLoadAll = false;

				serviceContainer.service.needShowLoadAllButton = readData.itemsFound > readData.itemsRetrieved;

				return baseOnReadSuccessedFn(readData, data);
			};
			serviceContainer.data.hasLoadAll = false;
			serviceContainer.service.hasLoadAll = function () {
				return serviceContainer.data.hasLoadAll;
			};
			serviceContainer.data.filterRequest = {
				pageSize: MINUM_PAGE_SIZE,
				ppsItemIds: []
			};
			serviceContainer.service.getSelectedFilter = function () {
			};

			var serviceLoading = false;
			serviceContainer.service.setSelectedFilter = function (field, value) {
				// it may generate multi network request, but only the last one will send, others will be canceled
				setTimeout(function() {
					if(!serviceLoading || (field === 'projectId' && serviceContainer.service.oldFilter[field] !== value)) {
						serviceLoading = true;
						serviceContainer.service.load().then(function () {
							serviceLoading = false;
						});
					}
				},200);

				serviceContainer.service.latestFilter[field] = value;
			};

			serviceContainer.service.isPpsItemFilterEnable = function () {
				return self.hasPpsItemFilter;
			};
			// pps item filter
			if (self.hasPpsItemFilter) {
				var serviceName = serviceContainer.service.getServiceName();
				//ppsCommonStructureFilterService.setServiceToBeFiltered(serviceContainer.service);
				ppsCommonStructureFilterService.setFilterFunction(serviceName, ppsCommonStructureFilterService.getCombinedFilterFunction);
			}

			// for assignment
			serviceContainer.service.getNeedAssignedDataService = function () {
				return getService(self.needAssignDataService);
			};
			serviceContainer.service.assignSelectedItemsToTrsRequisition = function () {
				serviceContainer.service.assignItemsToTrsRequisition(serviceContainer.service.getSelectedEntities());
			};
			serviceContainer.service.assignItemsToTrsRequisition = function (items) {
				var needAssignDataService = getService(self.needAssignDataService);
				var needAssignedItems = _.clone(items);
				var assignForeignKeyProperty = 'TrsRequisitionFk';
				var assignForeignKeyValue = needAssignDataService.parentService().getSelected().Id;
				serviceContainer.service.assignReferences(needAssignedItems, needAssignDataService, assignForeignKeyProperty, assignForeignKeyValue);
				updateProductInfo(needAssignedItems);
			};

			serviceContainer.data.setFilter = function setFilter() {
				serviceContainer.service.doSetFilter(serviceContainer.service);
			};

			var fieldsMappingObj = {
				'projectId':['ProjectFk','PrjProjectFk'],
				'siteId':['SiteFk','BasSiteFk'],
				'jobId':['JobFk','LgmJobFk'],
				'trsPackageId':['TrsPackageFk'],
				'trsRequisitionId':['TrsRequisitionFk']
			};
			function getValueForFilter(item, field) {
				// if (field === 'notAssignedToPkg' || field === 'notAssignedToReq' || field === 'notShipped') {
				// 	return true;
				// }
				if (field === 'notAssignedFlags') {
					return {
						notAssignedToReq: true,
						notAssignedToPkg: true,
						notShipped: true
					};
				}
				var mappingfields = fieldsMappingObj[field];
				for (var i in mappingfields) {
					if (Object.prototype.hasOwnProperty.call(item,mappingfields[i])) {
						return item[mappingfields[i]];
					}
				}
				return null;
			}

			serviceContainer.service.doSetFilter = function (service) {
				var parentSelected = service.parentService().getSelected();

				function processFilterObj(filterObj, oldFilterObj) {
					// if value of jobId has not been changed, keep values of puId/drawingId of oldFilterObj to filterObj(HP-ALM #119828)
					if(filterObj.jobId === oldFilterObj.jobId
						|| (_.isNil(filterObj.jobId) && _.isNil(oldFilterObj.jobId)) ){
						filterObj.puId = oldFilterObj.puId;
						filterObj.drawingId = oldFilterObj.drawingId;
					}
				}

				if(parentSelected){// remark: If parentSelected is null, it means parent container is unselected. Then we needn't to set the filter.
					if(_.isNil(parentSelected.ProjectFk) || parentSelected.ProjectFk === 0){
						return; // do not setFilter if project has not been set.(HP ALM #115338)
					}

					var filterObj = {};
					if (service.filterFields) {
						_.each(service.filterFields,function (f) {
							filterObj[f] = getValueForFilter(parentSelected,f);
						});
					}
					else {
						filterObj = {
							projectId: parentSelected.ProjectFk,
							jobId: parentSelected.LgmJobFk,
							siteId: parentSelected.SiteFk,
							notAssignedFlags:{
								notAssignedToPkg: true,
								notAssignedToReq: true,
								notShipped: true
							}
						};
						// remark: at the moment, only trsRequisition/mounting/mntActivity module use Unassigned bundle, all of them don't use package filter for the bundle.(by zwz 2019/4/4)
					}
					// process fields puId/drawingId of filterObj(HP-ALM #119828)
					processFilterObj(filterObj, serviceContainer.service.latestFilter);

					if (parentSelected) {
						filterObj.EarliestStart = parentSelected.PlannedStart;
						filterObj.LatestFinish = parentSelected.PlannedFinish;
					}

					if (parentSelected.SiteFk) {
						filterObj.siteId = trsProjectConfigService.initSiteFilter(parentSelected.SiteFk);
					}

					var filterService = $injector.get('transportplanningBundleContainerFilterService');
					if (!filterService.isSameFilter(filterObj)) {
						serviceContainer.service.oldFilter = _.clone(serviceContainer.service.latestFilter);
						filterService.setFilter(filterObj);
					}

					serviceContainer.service.latestFilter = filterObj;
				}
			};

			serviceContainer.service.recoverFilter = function () {
				var filterService = $injector.get('transportplanningBundleContainerFilterService');
				if (!filterService.isSameFilter(serviceContainer.service.latestFilter)) {
					filterService.setFilter(serviceContainer.service.latestFilter);
				}
			};

			// for unassigned-bundle container, user can only preview(not edit) document.
			serviceContainer.service.isDocumentReadOnly = true;

			// oldFilter stores the previous filter
			serviceContainer.service.oldFilter = {};
			// latestFilter uses for storing the latest filter object
			serviceContainer.service.latestFilter = {};
			// needShowLoadAllButton uses for judging if need to show loadAll-button when recovering unassigned bundles container
			serviceContainer.service.needShowLoadAllButton = false;

			// "disable" refreshing data by selectionchanged of parent container. At the moment, refreshing data of the container is triggered "manually" after setting the new filter-values.
			serviceContainer.data.doNotLoadOnSelectionChange = true;
			serviceContainer.data.clearContent = function () {};

			serviceContainer.service.updateList = function updateList(list){
				serviceContainer.data.handleReadSucceeded(list, serviceContainer.data);
			};
		};

		Builder.prototype.setParentFilter = function (filter) {
			this.parentFilter = filter;
			return this;
		};

		Builder.prototype.setNeedAssignDataService = function (dataService) {
			this.needAssignDataService = dataService;
			return this;
		};

		Builder.prototype.enablePpsItemFilter = function (flag) {
			this.hasPpsItemFilter = flag;
			return this;
		};

		function initOptions(builder) {

			function setDefaultActions() {
				builder.serviceOptions[builder.mainOptionsType].actions = {
					createReference: true
				};
				builder.serviceOptions[builder.mainOptionsType].useItemFilter = true;
			}

			setDefaultActions();
			builder.initHttpResource();
		}

		Builder.prototype.initHttpResource = function () {
			base.initHttpResource.call(this);

			var self = this;
			var httpResource = this.serviceOptions[this.mainOptionsType].httpCRUD;
			httpResource.endRead = 'lookup';
			httpResource.usePostForRead = true;
			httpResource.initReadData = function (readData) {
				if (_.isNil(self.parentFilter)) {
					return;
				}

				// var selectedItem = self.serviceContainer.service.parentService().getSelected();
				// var projectId = selectedItem ? selectedItem[self.parentFilter] : cloudDesktopPinningContextService.getPinningItem('project.main').id;

				readData.PageNumber = DEFAULT_PAGE_NUMBER;
				readData.PageSize = self.serviceContainer.data.filterRequest.pageSize;

				//readData.PageNumber = 0;
				//readData.PageSize = 100;
				readData.Pattern = '';
				var request = bundleContainerFilterService.generateFilterRequest();
				readData.FurtherFilters = request.FurtherFilters;
				readData.EarliestStart = request.EarliestStart;
				readData.LatestFinish = request.LatestFinish;
				readData.assignedToPkgBundles = request.AssignedToPkgBundles;
				readData.assignedToReqBundles = request.AssignedToReqBundles;
				if (self.isPpsItemFilterEnable) {
					var serviceName = self.serviceContainer.service.getServiceName();
					if (ppsCommonStructureFilterService.getAllFilterIds(serviceName) && ppsCommonStructureFilterService.getAllFilterIds(serviceName).PPSITEM) {
						var filterType = ppsCommonStructureFilterService.getFilterFunctionType(serviceName);
						var tokenName = '';
						var ppsItemIds = ppsCommonStructureFilterService.getAllFilterIds(serviceName).PPSITEM.join(',');
						switch (filterType) {
							case 1:
								tokenName = 'PpsItemsAll';
								break;
							case 2:
								tokenName = 'PpsItemsReverse';
								break;
							default:
								tokenName = 'PpsItemsDefault';
						}
						readData.FurtherFilters.push({
							Token: tokenName,
							Value: ppsItemIds
						});
					}
				}
			};
		};

		function getService(service) {
			return _.isObject(service) ? service : $injector.get(service);
		}


		return Builder;
	}
})(angular);