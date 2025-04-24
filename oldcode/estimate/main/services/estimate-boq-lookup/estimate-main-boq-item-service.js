
(function(angular) {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainBoqItemService', [
		'$http', '$q','platformGridAPI', '$injector','cloudCommonGridService', 'PlatformMessenger',
		'platformDataServiceFactory', 'estimateMainBoqHeaderService', 'basicsLookupdataLookupDescriptorService','boqMainImageProcessor','ServiceDataProcessArraysExtension','projectMainService','$translate',
		function ($http, $q,platformGridAPI, $injector,cloudCommonGridService, PlatformMessenger,
			platformDataServiceFactory, estimateMainBoqHeaderService, basicsLookupdataLookupDescriptorService,boqMainImageProcessor,ServiceDataProcessArraysExtension,projectMainService ,$translate) {

			let gridId = null;
			let boqItemPromise = {};
			let allowanceBoqItemLookupGridId = 'D7A8681E1086403A92B2910BB879ED68';
			let serviceOptions = {
				hierarchicalLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'estimateMainBoqItemService',
					httpRead: {
						useLocalResource: true,
						resourceFunction: function(){
							let boqHeaderId =  estimateMainBoqHeaderService.getSelected().BoqHeaderFk;
							let boqItemCacheTree = basicsLookupdataLookupDescriptorService.getData('estBoqItemTree');
							let result = _.filter(boqItemCacheTree, function (item) {
								return item.BoqHeaderFk  === boqHeaderId;
							});

							if(result.length ===0 ){
								return service.getSearchList('',boqHeaderId).then(function(list){
									let flattenList = [];
									cloudCommonGridService.flatten(list, flattenList, 'BoqItems');
									service.setBoqItemsImage(flattenList);

									data.itemTree = list;
									data.listLoaded.fire(list);
									return $q.when(list);
								});
							}else{
								return result;
							}

						},
						route: globals.webApiBaseUrl + 'boq/project/',
						endRead: 'getboqsearchlist',
						usePostForRead: false,
						initReadData: function initReadData(readData) {
							let projectId = getProjectId();
							let filterValue='';
							let boqHeaderId =  estimateMainBoqHeaderService.getSelected().BoqHeaderFk;
							readData.filter = '?projectId='+ projectId + '&filterValue='+filterValue+'&boqHeaderId='+boqHeaderId;
						}
					},
					actions: {},
					dataProcessor: [new ServiceDataProcessArraysExtension(['BoqItems']), boqMainImageProcessor],
					presenter: {
						tree: {
							parentProp: 'BoqItemFk', childProp: 'BoqItems'
						}

					},
					entityRole: {
						leaf: {
							itemName: 'BoqItem',
							moduleName: 'BoQ',
							codeField: 'Reference',
							descField: 'BriefInfo.Translated',
							parentService: estimateMainBoqHeaderService,
							parentFilter: 'BoqHeaderFk'
						}
					},
					useItemFilter: true
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			let service = serviceContainer.service;
			let data = serviceContainer.data;
			let highlightBoqItem = null;
			let cacheBoQItems = [];
			let cacheBoqHeaderItems = [];
			data.clearContent = function clearContent(){};

			service.IsSearch =true;
			service.isCollapse =true;

			let getProjectId = function getProjectId(){
				return $injector.get('estimateMainService').getProjectId();
			};

			angular.extend(service, {
				getItemByIdAsync: getItemByIdAsync,
				getBoqItemTreeByIdAsync:getBoqItemTreeByIdAsync,
				getSearchBoqItemList:getSearchBoqItemList,
				init: init,
				clearBoqCache :clearBoqCache,
				getItemById: getItemById,
				setOptions: setOptions,
				getOptions:getOptions,
				search: search,
				getSearchList: getSearchList,
				reset: new PlatformMessenger(),
				getGridId:getGridId,
				setGridId:setGridId,
				updateBoqItemsCache:updateBoqItemsCache,
				setBoqItemsImage:setBoqItemsImage,
				setBoqItemIsCollapse:setBoqItemIsCollapse,
				getBoqItemIsCollapse:getBoqItemIsCollapse,
				setHighlightBoqItem:setHighlightBoqItem,
				getHighlightBoqItem:getHighlightBoqItem,
				isAllowanceBoqItemLookup:isAllowanceBoqItemLookup
			});
			service.resolveStringValueCallback = (options, entity, columnDef) => {
				return async (value,options, entity,) => {
					if (!value) {
						return { apply: true, valid: true, value: null };
					}
					if(value.indexOf('#') === -1){
						return {
							apply: true,
							valid: false,
							value: value,
							error: $translate.instant('Must include #')
						};
					}
					const [headerReference, itemReference] = value.split('#');
					let prjId = getProjectId();
					if (cacheBoqHeaderItems && cacheBoqHeaderItems.length === 0) {
						await GetBoQHeaderByProjectId(prjId);
					}
					const rootItem = cacheBoqHeaderItems?.find(item => item.BoqRootItem?.Reference === headerReference);
					if (rootItem) {
						try {
							if (cacheBoQItems[itemReference]) {
								updateLineItemFromboqItemLookupItem(entity, cacheBoQItems[itemReference]);
								return { apply: true, valid: true, value: cacheBoQItems[itemReference].Id };
							}

							const response = await $http.get(`${globals.webApiBaseUrl}boq/project/getboqsearchlist?filterValue=${itemReference}&projectId=${prjId}&boqHeaderId=${rootItem.Boq?.BoqHeaderFk}`);
							const item = searchForReferenceItem(response.data, itemReference);
							if (item) {
								updateLineItemFromboqItemLookupItem(entity, item);
								return { apply: true, valid: true, value: item.Id };
							}
						} catch (error) {
							console.error('Error fetching BoQ items:', error);
						}
					}
					return {
						apply: true,
						valid: false,
						value: value,
						error: $translate.instant('Not Found')
					};
				};
			};

			async function GetBoQHeaderByProjectId(prjId) {
				if (!cacheBoqHeaderItems || cacheBoqHeaderItems.length === 0) {
					const response = await $http.get(`${globals.webApiBaseUrl}boq/project/list?projectId=${prjId}`);
					cacheBoqHeaderItems = response.data;
				}
				return cacheBoqHeaderItems;
			}

			function searchForReferenceItem(data, reference) {
				const boqLineTypes = [0, 11, 200, 201, 202, 203];
				function recurse(items) {
					for (const item of items) {
						if (item.Reference === reference && boqLineTypes.includes(item.BoqLineTypeFk)) {
							cacheBoQItems[reference] = item;
							return item;
						}
						if (item.BoqItems) {
							const boqItem = recurse(item.BoqItems);
							if (boqItem) {
								return boqItem;
							}
						}
					}
					return null;
				}
				if(data){
					return recurse(data);
				}
				return null;
			}

			function updateLineItemFromboqItemLookupItem(lineItem, boqItemLookupItem) {
				lineItem.OldBoqHeaderFk = angular.copy(lineItem.BoqHeaderFk);
				Object.assign(lineItem, {
					BoqHeaderFk: boqItemLookupItem.BoqHeaderFk,
					BoqHeaderItemFk: boqItemLookupItem.BoqHeaderFk,
					IsIncluded: boqItemLookupItem.Included,
					IsFixedPrice: boqItemLookupItem.IsFixedPrice,
					IsDaywork: boqItemLookupItem.IsDaywork
				});
			}
			return service;


			function setHighlightBoqItem(value) {
				highlightBoqItem = value;
			}

			function getHighlightBoqItem() {
				return highlightBoqItem;
			}

			function setBoqItemIsCollapse(status) {
				service.isCollapse =status;
			}
			function getBoqItemIsCollapse() {
				return  service.isCollapse;
			}
			function updateBoqItemsCache(data) {
				let flattenResult=[];
				cloudCommonGridService.flatten(data,flattenResult,'BoqItems');
				basicsLookupdataLookupDescriptorService.updateData('boqItemFk', flattenResult);
				basicsLookupdataLookupDescriptorService.updateData('estBoqItemTree', data);
			}

			function clearBoqCache() {
				basicsLookupdataLookupDescriptorService.removeData('boqItemFk');
				basicsLookupdataLookupDescriptorService.removeData('estBoqItemTree');
			}

			function getGridId() {
				return gridId;
			}

			function setGridId(id) {
				gridId = id;
			}

			function init(){
				gridId = null;
				data.itemTree = [];
				data.selectedItem = null;

				data.itemFilter = null;
				data.itemFilterEnabled = false;
			}

			function setOptions(options){
				data.gridOptionsFilter = options;
			}
			function getOptions(){
				return data.gridOptionsFilter;
			}
			function search(searchString, parentScope,isOnRefresh){
				searchString = searchString && searchString.length > 0 ? searchString.toLowerCase() : '';

				// do not use getSelected ,coz sometimes getSelected return null
				let boqHeaderFiltered = platformGridAPI.items.data('43F1D3B81BAB49FFB8E00BF131B52419');
				let selectedItem = platformGridAPI.rows.selection({gridId: '43F1D3B81BAB49FFB8E00BF131B52419'});

				let prjBoqRootItem  = selectedItem ? selectedItem : ((angular.isArray(boqHeaderFiltered) && boqHeaderFiltered.length > 0) ? boqHeaderFiltered[0] : null);
				if (prjBoqRootItem && prjBoqRootItem.BoqHeaderFk){
					estimateMainBoqHeaderService.setItemFilter(function (item) {
						return item.Id === prjBoqRootItem.BoqHeaderFk;
					});
				}

				data.itemTree = [];
				data.setList([]);

				if(angular.isArray(boqHeaderFiltered) && boqHeaderFiltered.length > 0){
					let boqHeaderId = isOnRefresh && prjBoqRootItem && prjBoqRootItem.BoqHeaderFk ? prjBoqRootItem.BoqHeaderFk:null;
					return getSearchList(searchString, boqHeaderId).then(function(list){

						let flattenList = [];
						cloudCommonGridService.flatten(list, flattenList, 'BoqItems');
						service.setBoqItemsImage(flattenList);

						data.itemTree = list;
						data.listLoaded.fire(list);

						parentScope.isLoading = false;
						return $q.when(list);
					});
				}else{
					data.listLoaded.fire([]);

					parentScope.isLoading = false;
					return $q.when([]);
				}
			}

			function getSearchList(value,boqHeaderId, isGcBoq){
				return getSearchBoqItemList(boqHeaderId, value, isGcBoq).then(function (list) {
					return list;
				});
			}

			// return one boq Item Tree,not boq Items List
			function getBoqItemTreeByIdAsync(id){
				return $http.post(globals.webApiBaseUrl+'boq/main/GetBoqItemTreeByIds',[id]).then(function(response){
					let flattenResult =[];
					cloudCommonGridService.flatten(response.data,flattenResult,'BoqItems');
					basicsLookupdataLookupDescriptorService.updateData('boqItemFk', flattenResult);
					return response.data;
				});
			}

			// only return boq Item
			function  getItemByIdAsync(id,formatterOptions) {
				let containerServiceName = formatterOptions.mainServiceName;
				if (!boqItemPromise[containerServiceName]) {
					boqItemPromise[containerServiceName] = getBoQLookUpList(formatterOptions);
				}
				
				return boqItemPromise[containerServiceName].then(function () {
					boqItemPromise = {};
					return  service.getItemById(id);
				});
			}

			function getItemById(value) {
				let itemCache = basicsLookupdataLookupDescriptorService.getLookupItem('boqItemFk', value);
				return itemCache;
			}

			function getBoQLookUpList(formatterOptions) {
				
				let boqItemFks = [];
				if (formatterOptions.mainServiceName && $injector.get(formatterOptions.mainServiceName)) {
					let dataServiceList = $injector.get(formatterOptions.mainServiceName).getList();
					
					if(formatterOptions.mainServiceName ==='estimateMainLineItemSelStatementListService') {
						dataServiceList = dataServiceList.concat($injector.get('estimateProjectEstimateLineItemSelStatementListService').getList());
					}
					
					_.forEach(dataServiceList, function (d) {
						if (d.BoqItemFk) {
							boqItemFks.push(d.BoqItemFk);
						}
						if(d.ToBoqItemFk){
							boqItemFks.push(d.ToBoqItemFk);
						}
						
						if(d.FromBoqItemFk){
							boqItemFks.push(d.FromBoqItemFk);
						}
					});
					boqItemFks = _.uniq(boqItemFks);
				}
				boqItemFks = _.filter(boqItemFks, function (d) {
					let item = basicsLookupdataLookupDescriptorService.getLookupItem('boqItemFk', d);
					if (!item) {
						return d;
					}
				});
				
				if (!boqItemFks.length) {
					return $q.when(true);
				}
				
				let deferred = $q.defer();
				$http.post(globals.webApiBaseUrl + 'boq/main/GetBoqItemTreeByIds', boqItemFks).then(
					function (response) {
						let result = response && response.data ? response.data : [];
						let flattenResult = [];
						cloudCommonGridService.flatten(response.data, flattenResult, 'BoqItems');
						basicsLookupdataLookupDescriptorService.updateData('boqItemFk', flattenResult);
						deferred.resolve(result);
					});
				return deferred.promise;
			}

			function  setBoqItemsImage(boqItemTree) {
				_.each(boqItemTree, function(item){
					boqMainImageProcessor.processItem(item);
				});
			}

			function getSearchBoqItemList(boqHeaderId,filterValue,isGcBoq){
				let prjId = getProjectId();
				if(prjId && prjId === -1){
					let project = projectMainService.getSelected();
					if(project){
						prjId = project.Id;
					}
				}
				const baseRequestUrl = globals.webApiBaseUrl+'boq/project/getboqsearchlist?projectId='+ prjId + '&filterValue='+filterValue;
				let requestUrl = boqHeaderId ? baseRequestUrl +'&boqHeaderId='+boqHeaderId : baseRequestUrl;
				if(angular.isDefined(isGcBoq)){
					requestUrl += ('&isGcBoq=' + isGcBoq);
				}
				return $http.get(requestUrl).then(function(response){
					let flattenResult = [];
					cloudCommonGridService.flatten(response.data, flattenResult, 'BoqItems');
					basicsLookupdataLookupDescriptorService.updateData('boqItemFk', flattenResult);
					if(!filterValue) {
						basicsLookupdataLookupDescriptorService.updateData('estBoqItemTree', response.data);
					}
					return response.data;
				});
			}
			function isAllowanceBoqItemLookup() {
				return service.getGridId() === allowanceBoqItemLookupGridId;
			}
		}
	]);
})(angular);
