(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'productionplanning.item';
	var module = angular.module(moduleName);
	module.factory('productionplanningItemProductLookupDataService', DataService);

	DataService.$inject = [
		'_',
		'$injector',
		'PlatformMessenger',
		'platformDataServiceFactory',
		'productionplanningItemDataService',
		'basicsLookupdataLookupDescriptorService',
		'cloudCommonGridService',
		'ppsItemTransportableProcessor',
		'productionplanningCommonProductProcessor',
		'productionplanningItemProductContainerFilterService',
		'productionplanningCommonProductDataServiceFactory',
		'platformGridAPI',
		'platformModuleStateService',
		'$rootScope'
	];
	function DataService(
		_,
		$injector,
		PlatformMessenger,
		platformDataServiceFactory,
		parentService,
		basicsLookupdataLookupDescriptorService,
		cloudCommonGridService,
		ppsItemTransportableProcessor,
		productionplanningCommonProductProcessor,
		productionplanningItemProductContainerFilterService,
		productionplanningCommonProductDataServiceFactory,
		platformGridAPI,
		platformModuleStateService,
		$rootScope
	) {
		var MINUM_PAGE_SIZE = 100;
		var MAX_PAGE_SIZE = 999999;
		var DEFAULT_PAGE_NUMBER = 0;
		const gridId = '131ad1f9e074488abe78703eec0245ab';

		var defaultServiceOptions = {
			flatNodeItem: {
				serviceName: 'productionplanningItemProductLookupDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/lookupdata/masternew/',
					endRead: 'getsearchlist?lookup=commonproduct',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						readData.TreeState = {StartId: null, Depth: null};
						readData.PageState = {
							PageNumber : DEFAULT_PAGE_NUMBER,
							PageSize :serviceContainer.data.filterRequest.pageSize
						};
						readData.RequirePaging = true;
						const request = productionplanningItemProductContainerFilterService.generateFilterRequest();
						readData.AdditionalParameters = {};
						_.forEach(request.FurtherFilters,(filter) => {
							readData.AdditionalParameters[filter.Token] = filter.Value;
						});
						readData.AdditionalParameters.notStacked = true;
					}
				},
				setCellFocus:false,
				useItemFilter: true,
				entityRole: {
					node: {
						itemName: 'Product',
						parentService: parentService,
					}
				},
				entitySelection: {supportsMultiSelection: true},
				dataProcessor: [{processItem: productionplanningCommonProductProcessor.processItemSvg},
					{processItem: productionplanningCommonProductProcessor.processProdPlaceFk},
					{processItem: productionplanningCommonProductProcessor.processReadonlyOfFabricationUnitDateSlotColumnsThatValueIsEmpty},
					{processItem: productionplanningCommonProductProcessor.processReadonlyInPUModule},
					{processItem: productionplanningCommonProductProcessor.processAnnotationSatus}],
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							let result = {
								FilterResult: readData.FilterResult,
								dtos: readData.SearchList || []
							};
							basicsLookupdataLookupDescriptorService.attachData(readData);
							serviceContainer.service.processTransportInfo(result.dtos);
							return  serviceContainer.data.handleReadSucceeded(result, data);
						},
					}
				},
				actions: {
				}
			},
			isNotRoot: true,
		};

		const serviceContainer = productionplanningCommonProductDataServiceFactory.createService(defaultServiceOptions);
		serviceContainer.service.getNeedAssignedDataService = function () {
			return serviceContainer.service;
		};

		serviceContainer.data.supportUpdateOnSelectionChanging = false;

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

			serviceContainer.service.needShowLoadAllButton = readData.RecordsFound > readData.RecordsRetrieved;

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

		serviceContainer.service.doSetFilter = function setFilter() {
			var parentSelected = parentService.getSelected();

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
				if (serviceContainer.service.filterFields) {
					_.each(serviceContainer.service.filterFields,function (f) {
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

				var filterService = productionplanningItemProductContainerFilterService;
				if (!filterService.isSameFilter(filterObj)) {
					serviceContainer.service.oldFilter = _.clone(serviceContainer.service.latestFilter);
					filterService.setFilter(filterObj);
				}

				serviceContainer.service.latestFilter = filterObj;
			}
		};


		serviceContainer.service.recoverFilter = function () {
			var filterService = productionplanningItemProductContainerFilterService;
			if (!filterService.isSameFilter(serviceContainer.service.latestFilter)) {
				filterService.setFilter(serviceContainer.service.latestFilter);
			}
		};

		var fieldsMappingObj = {
			'projectId':['ProjectFk','PrjProjectFk'],
			'jobId':['JobFk','LgmJobFk'],
		};

		function getValueForFilter(item, field) {
			var mappingfields = fieldsMappingObj[field];
			for (var i in mappingfields) {
				if (Object.prototype.hasOwnProperty.call(item,mappingfields[i])) {
					return item[mappingfields[i]];
				}
			}
		}
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

		serviceContainer.service.updateDataAfterAssignDone = function (response){

			$rootScope.$emit('before-save-entity-data');
			if(response.JobBundleToSave?.length > 0){
				const products = response.JobBundleToSave[0].ProductToSave;

				let dataStorage = serviceContainer.data.itemList;

				_.forEach(products, (affectedItem) => {
					const productToUpdate = _.find(dataStorage, {'Id': affectedItem.MainItemId});
					_.extend(productToUpdate, affectedItem.Product);
				});
				serviceContainer.service.gridRefresh();
			}
			$rootScope.$emit('after-save-entity-data');
		};


		serviceContainer.service.addBackItems = function (entities) {
			const dataStorage = serviceContainer.data.itemList;
			entities.forEach((v) => {
				v.TrsProductBundleFk = null;
				v.UpdateSequence = true;
				v.Sequence = null;
				dataStorage.unshift(v);
			});

			refreshForInteraction();
		};

		serviceContainer.service.assignByButton = () => {
			let selectedArray = serviceContainer.service.getSelectedEntities();
			$injector.get('productionplanningItemJobBundleProductDataService').addBackItems(selectedArray);
			_.remove(serviceContainer.data.itemList, (item) => {
				return _.indexOf(_.map(selectedArray, 'Id'), item.Id) > -1;
			});
			refreshForInteraction();
		};

		serviceContainer.service.clearGridByUnSavedProducts = () => {
			const modifications = platformModuleStateService.state(serviceContainer.service.getModule()).modifications;
			let dataStorage = serviceContainer.data.itemList;
			if(modifications.JobBundleToSave && modifications.JobBundleToSave.length > 0){

				const productUnsaved = modifications.JobBundleToSave[0].ProductToSave;
				productUnsaved.forEach((item) => {
					if(_.has(item.Product, 'PreviousTrsProductBundleFk')){
						item.Product.TrsProductBundleFk = item.Product.PreviousTrsProductBundleFk;
						item.Product.Sequence = null;
						item.Product.UpdateSequence = true;
						delete item.Product.PreviousTrsProductBundleFk;
						dataStorage.unshift(item.Product);
						_.remove(modifications.JobBundleToSave[0].ProductToSave, {'MainItemId': item.MainItemId});
					}
				});

				_.remove(dataStorage, (item) => {
					return _.indexOf(_.map(productUnsaved, 'MainItemId'), item.Id) > -1;
				});
				refreshForInteraction();
			}
		};

		function refreshForInteraction() {
			let dataStorage = serviceContainer.data.itemList;
			serviceContainer.service.deselect();
			const grid = platformGridAPI.grids.element('id', gridId);
			if(grid && grid.instance){
				platformGridAPI.items.data(gridId, dataStorage);
				platformGridAPI.grids.refresh(gridId, true);
			}
			serviceContainer.service.gridRefresh();
		}

		return serviceContainer.service;
	}
})(angular);