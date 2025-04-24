(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'transportplanning.requisition';
	var module = angular.module(moduleName);
	module.factory('transportplanningRequisitionToBeAssignedDataService', DataService);

	DataService.$inject = [
		'_',
		'$injector',
		'PlatformMessenger',
		'platformDataServiceFactory',
		'transportplanningRequisitionMainService',
		'transportplanningBundleDocumentDataProviderFactory',
		'ppsCommonTransportInfoHelperService',
		'basicsLookupdataLookupDescriptorService',
		'cloudCommonGridService',
		'ppsItemTransportableProcessor',
		'trsGoodsTypes',
		'$rootScope',
		'$http',
		'platformGridAPI',
		'transportplanningBundleTrsProjectConfigService',
		'platformModuleStateService'
	];
	function DataService(
		_,
		$injector,
		PlatformMessenger,
		platformDataServiceFactory,
		parentService,
		documentDataProviderFactory,
		ppsCommonTransportInfoHelperService,
		basicsLookupdataLookupDescriptorService,
		cloudCommonGridService,
		ppsItemTransportableProcessor,
		trsGoodsTypes,
		$rootScope,
		$http,
		platformGridAPI,
		trsProjectConfigService,
		platformModuleStateService
	) {
		function createNewComplete(isTree = true) {
			let transportplanningRequisitionContainerFilterService = $injector.get(isTree ? 'transportplanningRequisitionContainerFilterForTreeService' : 'transportplanningRequisitionContainerFilterForListService');
			var MINUM_PAGE_SIZE = 100;
			var MAX_PAGE_SIZE = 999999;
			var DEFAULT_PAGE_NUMBER = 0;
			let gridId = isTree? '821fc90538fc4272bc14708e852670a7' : 'bfa2d3cfb15845d4812a9a305f9da51f';
			let invisibleItems = [];

			function incorporateDataRead(readData, data) {
				var result = assembleHttpResult(readData, serviceContainer.service);
				return serviceContainer.data.handleReadSucceeded(result, data);
			}

			let presentObject = isTree ?
				{
					tree: {
						parentProp: 'TrsProductBundleFk',
						childProp: 'Children',
						incorporateDataRead: incorporateDataRead
					}
				} :
				{
					list: {
						incorporateDataRead: incorporateDataRead
					}
				};

			var defaultServiceOptions = {
				hierarchicalNodeItem: {
					module: moduleName,
					serviceName: `transportplanningRequisitionToBeAssigned${isTree? 'Tree' : 'List'}DataService`,
					entityNameTranslationID: 'productionplanning.item.upstreamItem.entity',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'transportplanning/bundle/bundle/',
						endRead: 'treeToBeAssigned',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							readData.PageNumber = DEFAULT_PAGE_NUMBER;
							readData.PageSize = serviceContainer.data.filterRequest.pageSize;

							// readData.PageNumber = 0;
							// readData.PageSize = 100;
							readData.Pattern = '';
							var request = transportplanningRequisitionContainerFilterService.generateFilterRequest();
							readData.FurtherFilters = request.FurtherFilters;
						}
					},
					setCellFocus:false,
					presenter: presentObject,
					entityRole: {
						node: {
							itemName: 'ToBeAssigned',
							parentService: parentService,
						}
					},
					useItemFilter: true,
					dataProcessor: [ppsItemTransportableProcessor, {processItem: (item) => {
						if(item.UpstreamItemId){
							item.image = ppsItemTransportableProcessor.getImageOfUpstreamItem({PpsUpstreamGoodsTypeFk: $injector.get('upstreamGoodsTypes').Material});
						}
					}}],
					actions: {
						createReference: true
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(defaultServiceOptions);
			serviceContainer.service.getNeedAssignedDataService = function () {
				return serviceContainer.service;
			};

			ppsCommonTransportInfoHelperService.registerItemModified(serviceContainer, $injector.get('transportplanningBundleValidationService'));
			var documentDataProvider = documentDataProviderFactory.create(serviceContainer.service);
			_.extend(serviceContainer.service, documentDataProvider);

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
				pageSize: MINUM_PAGE_SIZE
			};

			serviceContainer.service.getSelectedFilter = () =>{};

			var serviceLoading = false;
			serviceContainer.service.setSelectedFilter = function (field, value) {

				// it may generate multi network request, but only the last one will send, others will be canceled
				setTimeout(function() {
					if((!serviceLoading || (field === 'projectId' && serviceContainer.service.oldFilter[field] !== value)) &&
					serviceContainer.service.parentService().getSelected()) {
						serviceLoading = true;
						serviceContainer.service.load().then(function () {
							serviceLoading = false;
						});
					}
				},200);

				serviceContainer.service.latestFilter[field] = value;
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

			serviceContainer.service.lastProductBool = true;
			serviceContainer.service.lastUpstreamBool = true;
			serviceContainer.service.lastBundleBool = true;
			serviceContainer.service.lasthideDeliveredBool = true;

			function getValueForFilter(item, field) {
				var mappingfields = fieldsMappingObj[field];
				for (var i in mappingfields) {
					if (Object.prototype.hasOwnProperty.call(item,mappingfields[i])) {
						return item[mappingfields[i]];
					}
				}
				const defaultFilters = {productBool: serviceContainer.service.lastProductBool,
					upstreamBool: serviceContainer.service.lastUpstreamBool,
					bundleBool: serviceContainer.service.lastBundleBool,
					hideDeliveredBool: serviceContainer.service.lasthideDeliveredBool};
				return defaultFilters[field];
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

				if(parentSelected){// remark: If parentSelected is null, it means parent container is unselected. Then we needn't set the filter.

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
							jobId: parentSelected.LgmJobFk
						};
						// remark: at the moment, only trsRequisition/mounting/mntActivity module use Unassigned bundle, all of them don't use package filter for the bundle.(by zwz 2019/4/4)
					}
					// process fields puId/drawingId of filterObj(HP-ALM #119828)
					processFilterObj(filterObj, serviceContainer.service.latestFilter);

					if (parentSelected.SiteFk) {
						filterObj.jobIdFromHistory = trsProjectConfigService.initJobFilter(parentSelected.SiteFk);
					}

					var filterService = transportplanningRequisitionContainerFilterService;
					if (!filterService.isSameFilter(filterObj)) {
						serviceContainer.service.oldFilter = _.clone(serviceContainer.service.latestFilter);
						filterService.setFilter(filterObj);
					}
					else{
						serviceContainer.service.hideItemsOfParent();
					}

					serviceContainer.service.latestFilter = filterObj;
				}
			};

			serviceContainer.service.recoverFilter = function () {
				var filterService = transportplanningRequisitionContainerFilterService;
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

			serviceContainer.service.setRequisitionFkAfterAssignDone = function setRequisitionFkAfterAssignDone(response){
				const goodService = $injector.get('transportplanningRequisitionTrsGoodDataServiceFactory').getService({parentService: serviceContainer.service.parentService()});
				goodService.deselect();
				const grid = platformGridAPI.grids.element('id', 'df5tg7b1928342c4a65cee89c4869tyg');
				if(grid && grid.instance){
					grid.instance.resetActiveCell();
					grid.instance.setSelectedRows([]);
					grid.instance.invalidate();
				}
				let affectedGoods = (response.TrsGoodsToSave || []).concat(response.TrsGoodsToDelete || []);
				affectedGoods = _.filter(affectedGoods, (affectedGood) => {
					return !!affectedGood.CorrespondingTobeAssigned;
				});
				if(affectedGoods.length <= 0){
					return;
				}

				$rootScope.$emit('before-save-entity-data');
				const tobeAssignedFromResponse = _.map(affectedGoods, 'CorrespondingTobeAssigned');

				runProcessorsForToBeAssigneds(tobeAssignedFromResponse);

				const affectedIds = _.map(tobeAssignedFromResponse, 'Id');

				let dataStorage = isTree ? serviceContainer.data.itemTree : serviceContainer.data.itemList;

				let affectedItems = _.filter(dataStorage, (item) => {
					return _.indexOf(affectedIds, item.Id) > -1;
				});

				affectedItems.push(...(_.filter(invisibleItems, (item) => {
					return _.indexOf(affectedIds, item.Id) > -1;
				})));

				_.forEach(affectedItems, (affectedItem) => {
					const tobeAssignOfItemInContainer = _.find(tobeAssignedFromResponse, (newToBeAssigned) => {return newToBeAssigned.Id === affectedItem.Id;});
					if(tobeAssignOfItemInContainer){
						affectedItem.Children = tobeAssignOfItemInContainer.Children;
						affectedItem.TrsRequisitionFk = tobeAssignOfItemInContainer.TrsRequisitionFk;
						affectedItem.CurrentLocationJobFk = tobeAssignOfItemInContainer.CurrentLocationJobFk;
						affectedItem.TimeStamp = tobeAssignOfItemInContainer.TimeStamp;
						affectedItem.LocationHistories = tobeAssignOfItemInContainer.LocationHistories;
						affectedItem.TrsOpenQuantity = tobeAssignOfItemInContainer.TrsOpenQuantity;
						affectedItem.TrsAssignedQuantity = tobeAssignOfItemInContainer.TrsAssignedQuantity;
					}
				});
				serviceContainer.service.gridRefresh();
				$rootScope.$emit('after-save-entity-data');
				serviceContainer.service.hideItemsOfParent();

				// changes in that cause on 24.2 getSelected parent element is not always correct ,so that fetch element base on response id
				if(response.TrsRequisition){
					let requisition = serviceContainer.service.parentService().getItemById(response.TrsRequisition.Id);
					if(requisition){
						requisition.BundleCollectionInfo = response.TrsRequisition.BundleCollectionInfo;
						serviceContainer.service.parentService().gridRefresh();
					}
				}
			};

			serviceContainer.service.moveItem = serviceContainer.data.moveItem;

			function assembleHttpResult(readData,service) {
				var result = {
					FilterResult: readData.FilterResult,
					dtos: readData.Main || readData.items || []
				};
				basicsLookupdataLookupDescriptorService.attachData(readData);
				let flats = [];
				flats = cloudCommonGridService.flatten(result.dtos, flats, 'Children');
				service.processTransportInfo(flats);
				return result;
			}

			serviceContainer.service.assignByButton = () => {
				let selectedArray = serviceContainer.service.getSelectedEntities();
				const goodService = $injector.get('transportplanningRequisitionTrsGoodDataServiceFactory').getService({parentService: serviceContainer.service.parentService()});
				goodService.createItemsFromToBeAssigned(selectedArray, (newItems) => {
					let dataStorage = isTree ? serviceContainer.data.itemTree : serviceContainer.data.itemList;
					let newItemsInTree = _.filter(dataStorage, (ele) => {
						return _.indexOf(_.map(newItems, 'Id'), ele.Id) > -1;
					});
					_.forEach(newItemsInTree, (newItem) => {
						if(newItem.ProductId || newItem.BundleId){
							invisibleItems.push(newItem);
							_.remove(dataStorage, {Id: newItem.Id});
						}
					});
					refreshForTobeAssigned();
					updateRequisitionGoodsInfo(newItems, false);
					$rootScope.$emit('after-save-entity-data');
				});
			};

			serviceContainer.service.hideItemsOfParent = () => {
				let selected = serviceContainer.service.parentService().getSelected();
				if(selected){
					let trsRequisitionFk = selected.Id;
					let dataStorage = isTree ? serviceContainer.data.itemTree : serviceContainer.data.itemList;
					if(invisibleItems.length > 0){
						dataStorage.unshift(...invisibleItems);
						invisibleItems = [];
					}
					invisibleItems.push(...(_.filter(dataStorage, (item) => {
						return !item.Id.includes('U')
							&& (serviceContainer.service.lasthideDeliveredBool
								? item.TrsRequisitionFk === trsRequisitionFk || item.CurrentLocationJobFk === item.TargetJobFk
								: item.TrsRequisitionFk === trsRequisitionFk);
					})));
					_.remove(dataStorage, (item) => {
						return _.indexOf(_.map(invisibleItems, 'Id'), item.Id) > -1;
					});
					refreshForTobeAssigned();
				}
			};

			serviceContainer.service.clearGridByUnSavedDeletedGoods = () => {
				const modifications = platformModuleStateService.state(serviceContainer.service.getModule()).modifications;
				let dataStorage = isTree ? serviceContainer.data.itemTree : serviceContainer.data.itemList;
				const itemsInGoods = _.map(modifications.TrsGoodsToDelete, 'CorrespondingTobeAssigned');
				_.remove(dataStorage, (item) => {
					return _.indexOf(_.map(itemsInGoods, 'Id'), item.Id) > -1;
				});
				refreshForTobeAssigned();
			};

			let basehandleReadSucceeded = serviceContainer.data.handleReadSucceeded;
			serviceContainer.data.handleReadSucceeded = function newHandleReadSucceeded(result, data){
				basehandleReadSucceeded(result, data);
				invisibleItems = [];
				serviceContainer.service.hideItemsOfParent();
			};

			function getLatestSecondHistory(locationHistories) {
				if(_.isArray(locationHistories)) {
					return locationHistories.length > 1 ? locationHistories[1] : _.first(locationHistories);
				}
				return null;
			}

			function addBackItems (entities) {
				const itemsInGoods = _.filter(_.map(entities, 'CorrespondingTobeAssigned'), (item) => {return !! item;});

				runProcessorsForToBeAssigneds(itemsInGoods);

				let dataStorage = isTree ? serviceContainer.data.itemTree : serviceContainer.data.itemList;
				itemsInGoods.forEach((v) => {
					if((v.Product && v.Id.includes('P')) || (v.Bundle && v.Id.includes('B'))){
						if((v.Id.includes('P') && serviceContainer.service.lastProductBool)
							|| (v.Id.includes('B') && serviceContainer.service.lastBundleBool)){

							if(v.Version > 0){
								v.TrsRequisitionFk = null;

								// Bundle
								if(v.Children){
									_.forEach(v.Children, (child) => {
										child.TrsRequisitionFk = null;
										let last2ndHistory = getLatestSecondHistory(child.LocationHistories);
										if(last2ndHistory){
											child.CurrentLocationJobFk = last2ndHistory.JobFk;
											child.TimeStamp = last2ndHistory.TimeStamp;
										}
									});

									let last2ndHistory = getLatestSecondHistory(v.Children[0].LocationHistories);
									if(last2ndHistory) {
										v.CurrentLocationJobFk = last2ndHistory.JobFk;
										v.TimeStamp = last2ndHistory.TimeStamp;
									}
								}

								// Product
								let last2ndHistory = getLatestSecondHistory(v.LocationHistories);
								if(last2ndHistory){
									v.CurrentLocationJobFk = last2ndHistory.JobFk;
									v.TimeStamp = last2ndHistory.TimeStamp;
								}
							}

							if((!serviceContainer.service.latestFilter['projectId'] || serviceContainer.service.latestFilter['projectId'] === v.ProjectFk)
								&& (!serviceContainer.service.latestFilter['jobId'] || serviceContainer.service.latestFilter['jobId'] === v.TargetJobFk)
								&& (!serviceContainer.service.latestFilter['jobIdFromHistory'].length || _.some(serviceContainer.service.latestFilter['jobIdFromHistory'], jobFk => jobFk === v.CurrentLocationJobFk))
								&& (!serviceContainer.service.latestFilter['puId'] || serviceContainer.service.latestFilter['puId'] === v.PPSItemFk)
								&& (!serviceContainer.service.latestFilter['drawingId'] || serviceContainer.service.latestFilter['drawingId'] === v.EngDrawingFk)
							){
								dataStorage.unshift(v);
								_.remove(invisibleItems, {'Id': v.Id});
							}
						}
					}
				});

				refreshForTobeAssigned();
			}

			function runProcessorsForToBeAssigneds(tobeAssigneds) {
				const flatItems = cloudCommonGridService.flatten(tobeAssigneds, [], 'Children');
				_.each(serviceContainer.service.getDataProcessor(), function (processor) {
					_.each(flatItems, (item) =>{
						processor.processItem(item);
					});
				});
			}

			function refreshForTobeAssigned() {
				let dataStorage = isTree ? serviceContainer.data.itemTree : serviceContainer.data.itemList;
				serviceContainer.service.deselect();
				const grid = platformGridAPI.grids.element('id', gridId);
				if(grid && grid.instance){
					platformGridAPI.items.data(gridId, dataStorage);
					platformGridAPI.grids.refresh(gridId, true);
				}
				serviceContainer.service.gridRefresh();
			}

			function updateRequisitionGoodsInfo(items, forDeleteGoods){
				let productIds = forDeleteGoods ? _.map(items.filter(item => (item.PpsProductFk !== null)), 'PpsProductFk') :
				_.map(items.filter(item => (item.ProductId !== null)), 'ProductId');
			 	let bundleIds = forDeleteGoods ? _.map(items.filter(item => (item.TrsProductBundleFk !== null)), 'TrsProductBundleFk') :
				_.map(items.filter(item => (item.BundleId !== null)), 'BundleId');

				let requisition = serviceContainer.service.parentService().getSelected();

				if(forDeleteGoods && productIds.length === 0 && bundleIds.length === 0){
					requisition.BundleCollectionInfo = null;
					serviceContainer.service.parentService().gridRefresh();
				}
				else {
					$http.post(globals.webApiBaseUrl + 'transportplanning/requisition/getgoodinfo', {
						RequisitionId: requisition.Id,
						BundleIds: bundleIds,
						ProductIds: productIds,
					}).then(function (response) {
						if (requisition.BundleCollectionInfo === null || requisition.BundleCollectionInfo.BundlesDescription === null || forDeleteGoods === true) {
							requisition.BundleCollectionInfo = response.data.BundleCollectionInfo;
						} else {
							requisition.BundleCollectionInfo.BundlesDescription += ';' + response.data.BundleCollectionInfo.BundlesDescription;
							requisition.BundleCollectionInfo.ProductsCount += response.data.BundleCollectionInfo.ProductsCount;
							requisition.BundleCollectionInfo.ProductsAreaSum.Value += response.data.BundleCollectionInfo.ProductsAreaSum.Value;
							requisition.BundleCollectionInfo.ProductsHeightSum.Value += response.data.BundleCollectionInfo.ProductsHeightSum.Value;
							requisition.BundleCollectionInfo.ProductsMaxLength.Value += response.data.BundleCollectionInfo.ProductsMaxLength.Value;
							requisition.BundleCollectionInfo.ProductsMaxWidth.Value += response.data.BundleCollectionInfo.ProductsMaxWidth.Value;
							requisition.BundleCollectionInfo.ProductsWeightSum.Value += response.data.BundleCollectionInfo.ProductsWeightSum.Value;
						}
						serviceContainer.service.parentService().gridRefresh();
					});
				}
			}

			serviceContainer.service.synDeletedGood = (goods) => {
				addBackItems(goods);
				let goodService = $injector.get('transportplanningRequisitionTrsGoodDataServiceFactory').getService({parentService: serviceContainer.service.parentService()});
				let list = goodService.getList();
				updateRequisitionGoodsInfo(list, true);
			};

			return serviceContainer.service;
		}

		let serviceCache = {};
		return {getService: (isTree = true) => {
			if (!serviceCache[isTree]) {
				serviceCache[isTree] = createNewComplete(isTree);
			}
			return serviceCache[isTree];
		}};
	}
})(angular);