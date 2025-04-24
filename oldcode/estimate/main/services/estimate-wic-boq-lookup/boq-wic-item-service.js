/**
 * Created by janas on 17.06.2015.
 */

/* global globals, _ */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('boqWicItemService', [
		'$http', '$q','platformGridAPI', '$injector','cloudCommonGridService', 'PlatformMessenger',
		'platformDataServiceFactory', 'boqWicGroupService', 'basicsLookupdataLookupDescriptorService','boqMainImageProcessor','ServiceDataProcessArraysExtension', 'estimateProjectRateBookConfigDataService','$translate',
		function ($http, $q,platformGridAPI, $injector,cloudCommonGridService, PlatformMessenger,
			platformDataServiceFactory, boqWicGroupService, basicsLookupdataLookupDescriptorService,boqMainImageProcessor,ServiceDataProcessArraysExtension, estimateProjectRateBookConfigDataService,$translate) {

			let lookupData = {
				wicBoqItems:[]
			};
			let serviceOptions = {
				hierarchicalLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'boqWicItemService',
					httpRead: {
						useLocalResource: true,
						resourceFunction: function(){
							let wicGroupId =  boqWicGroupService.getWicGroupId();
							let retulst =[];
							let wicBoqItemCacheTree = basicsLookupdataLookupDescriptorService.getData('boqWicBoqItemTree');
							retulst = _.filter(wicBoqItemCacheTree, function (item) {
								return item.BoqWicCatFk  ===wicGroupId;
							});

							if(retulst.length ===0 ){
								return service.getSearchList('',wicGroupId).then(function(list){

									let flattenList = [];
									cloudCommonGridService.flatten(list, flattenList, 'BoqItems');
									service.setBoqItemsImage(flattenList);

									data.itemTree = list;
									data.listLoaded.fire(list);

									return $q.when(list);
								});
							}else{
								return retulst;
							}

						},
						route: globals.webApiBaseUrl + 'boq/wic/boq/',
						endRead: 'getwicboqbywicgroupid',
						usePostForRead: false,
						initReadData: function initReadData(readData) {
							let wicGroupId =  boqWicGroupService.getWicGroupId();
							let prjId = getProjectId();
							let requestData = {
								WicGroupIds: [wicGroupId],
								FilterValue: null,
								ProjectId: prjId
							};
							readData.filter = requestData;
						}
					},
					actions: {},
					dataProcessor: [new ServiceDataProcessArraysExtension(['BoqItems']), boqMainImageProcessor],
					presenter: {
						tree: {
							parentProp: 'BoqItemFk', childProp: 'BoqItems'
						},
						incorporateDataRead: incorporateDataRead
					},
					entityRole: {
						leaf: {
							itemName: 'BoqItem',
							moduleName: 'BoQ',
							codeField: 'Reference',
							descField: 'BriefInfo.Translated',
							parentService: boqWicGroupService,
							parentFilter: 'WicGroupFk'
						}
					},
					useItemFilter: true
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			let service = serviceContainer.service;
			let data = serviceContainer.data;
			let cacheGroupWicBoQItems = [];
			let cacheWicBoQItems = [];
			data.clearContent = function clearContent(){};

			service.IsSearch =true;
			service.isCollapse =true;

			let getProjectId = function getProjectId(){
				if(platformGridAPI.grids.exist('021c5211c099469bb35dcf68e6aebec7')){
					let projectMainForCOStructureService = $injector.get('projectMainForCOStructureService');
					if(projectMainForCOStructureService) {
						return projectMainForCOStructureService.getSelected() ? projectMainForCOStructureService.getSelected().Id : -1;
					}
				}else{
					return $injector.get('estimateMainService').getSelectedProjectId();
				}
			};

			angular.extend(service, {
				getItemByIdAsync: getItemByIdAsync,
				getWicBoqItemTreeByIdAsync:getWicBoqItemTreeByIdAsync,
				getSearchWicBoqItemList:getSearchWicBoqItemList,
				init: init,
				clearBoqCache :clearBoqCache,
				getWicItemListAsync: getWicItemListAsync,
				getItemById: getItemById,
				setOptions: setOptions,
				getOptions:getOptions,
				search: search,
				getSearchList: getSearchList,
				reset: new PlatformMessenger(),
				getGridId:getGridId,
				updateWicBoqItemsCache:updateWicBoqItemsCache,
				setBoqItemsImage:setBoqItemsImage,
				setBoqItemIsCollapse:setBoqItemIsCollapse,
				getBoqItemIsCollapse:getBoqItemIsCollapse
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
					const [wicGroupCode, wicItemReference] = value.split('#');
					let prjId = getProjectId();
					if (cacheGroupWicBoQItems && cacheGroupWicBoQItems.length === 0) {
						await GetWicBoQGroup();
					}
					const rootItem = searchForGroupCodeItem(cacheGroupWicBoQItems, wicGroupCode);
					if (rootItem) {
						try {
							if (cacheWicBoQItems[wicItemReference]) {
								updateLineItemFromboqItemLookupItem(entity, cacheWicBoQItems[wicItemReference]);
								return { apply: true, valid: true, value: cacheWicBoQItems[wicItemReference].Id };
							}
							const postParams={
								ProjectId: prjId,
								WicGroupIds: [rootItem.Id],
								FilterValue: wicItemReference
							};
							const response = await $http.post(`${globals.webApiBaseUrl}boq/wic/boq/getwicboqbywicgroupid`,postParams);
							cacheWicBoQItems[value] = response.data;
							const item = searchForReferenceItem(response.data, wicItemReference);
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
				async function GetWicBoQGroup() {
					if (!cacheGroupWicBoQItems || cacheGroupWicBoQItems.length === 0) {
						const response = await $http.get(`${globals.webApiBaseUrl}boq/wic/group/tree?asMap=true`);
						cacheGroupWicBoQItems = response.data.dtos;
					}
					return cacheBoqHeaderItems;
				}
				function searchForGroupCodeItem(data, code) {
					function recurse(items) {
						for (const item of items) {
							if (item.Code === code) {
								return item;
							}
							if (item.HasChildren) {
								const boqItem = recurse(item.WicGroups);
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
				function searchForReferenceItem(data, reference) {
					const boqLineTypes = [0, 11, 200, 201, 202, 203];
					function recurse(items) {
						for (const item of items) {
							if (item.Reference === reference && boqLineTypes.includes(item.BoqLineTypeFk)) {
								cacheWicBoQItems[reference] = item;
								return item;
							}
							if (item.HasChildren) {
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
			};
			function updateLineItemFromboqItemLookupItem(lineItem, wicItem) {
				lineItem.BoqWicCatFk = wicItem.BoqWicCatFk;
				lineItem.WicBoqHeaderFk = wicItem.BoqHeaderFk;
			}
			return service;

			function setBoqItemIsCollapse(status) {
				service.isCollapse =status;
			}
			function getBoqItemIsCollapse() {
				return  service.isCollapse;
			}
			function updateWicBoqItemsCache(data) {
				let flattenResult=[];
				cloudCommonGridService.flatten(data,flattenResult,'BoqItems');
				basicsLookupdataLookupDescriptorService.updateData('boqWicBoqItemFk', flattenResult);
				basicsLookupdataLookupDescriptorService.updateData('boqWicBoqItemTree', data);
			}

			function clearBoqCache() {
				basicsLookupdataLookupDescriptorService.removeData('boqWicBoqItemFk');
				basicsLookupdataLookupDescriptorService.removeData('boqWicBoqItemTree');
			}

			function getGridId() {
				return '7EC94AD09A914EBBB5DA1DDC49515991';
			}

			function init(){
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
			function search(searchString, parentScope, wicGroupId) {
				searchString = searchString && searchString.length > 0 ? searchString.toLowerCase() : '';

				// do not use getSelected ,coz sometimes getSelected return null
				let wicGroup  = boqWicGroupService.getSelectedEntities() ? boqWicGroupService.getSelectedEntities()[0]: null;
				if (wicGroup && wicGroup.Id){
					boqWicGroupService.setItemFilter(function (wicGroupItem) {
						return wicGroupItem.Id === wicGroup.Id;
					});
				}

				data.itemTree = [];
				data.setList([]);

				let allGroups = boqWicGroupService.getList();
				// using master data filter
				let filterIds = estimateProjectRateBookConfigDataService.getFilterIds(3);
				if (filterIds && filterIds.length > 0) {
					let filterSet = new Set(filterIds);
					allGroups = allGroups.filter(group => filterSet.has(group.Id));
				}

				// Determine the list of target group ids (wicGroupId first, wicGroup.Id second, and all group ids last)
				let wicGroupIds = wicGroupId || wicGroup ? [wicGroupId ? wicGroupId : wicGroup.Id] : allGroups.map(group => group.Id);
				// Ensure that the resulting array is non-empty (default is [0])
				const newWicGroupId = wicGroupIds.length > 0 ? wicGroupIds : [0];

				return getSearchList(searchString, newWicGroupId).then(function (list) {

					let flattenList = [];
					cloudCommonGridService.flatten(list, flattenList, 'BoqItems');
					service.setBoqItemsImage(flattenList);

					data.itemTree = list;
					data.listLoaded.fire(list);

					parentScope.isLoading = false;
					return $q.when(list);
				});
			}

			function getSearchList(value,wicGroupId){
				let wicGroupIds = wicGroupId ? (_.isArray(wicGroupId) ? wicGroupId : [wicGroupId]) : [0];
				return getSearchWicBoqItemList(wicGroupIds, value).then(function (list) {
					let flattenResult=[];
					cloudCommonGridService.flatten(list,flattenResult,'BoqItems');
					basicsLookupdataLookupDescriptorService.updateData('boqWicBoqItemFk', flattenResult);
					basicsLookupdataLookupDescriptorService.updateData('boqWicBoqItemTree', list);
					return list;
				});
			}

			// return one boq Item Tree,not boq Items List
			function getWicBoqItemTreeByIdAsync(id){
				let boqWicBoqItemFk = 'boqWicBoqItemFk';
				// get the boqItemTree ,not only boqItems,so no need take data from Cache

				let postData = {
					wicBoqItemFks: [id]
				};
				return $http.post(globals.webApiBaseUrl+'boq/wic/boq/getBoqItemTreeById',postData).then(function(response){
					let flattenResult =[];
					cloudCommonGridService.flatten(response.data,flattenResult,'BoqItems');
					basicsLookupdataLookupDescriptorService.updateData(boqWicBoqItemFk, flattenResult);
					basicsLookupdataLookupDescriptorService.updateData('boqWicBoqItemTree', response.data);
					return response.data;
				});
			}

			// only return boq Item
			function  getItemByIdAsync(id) {
				let boqWicBoqItemFk = 'boqWicBoqItemFk';
				if (basicsLookupdataLookupDescriptorService.hasLookupItem(boqWicBoqItemFk, id)){
					return $q.when(basicsLookupdataLookupDescriptorService.getLookupItem(boqWicBoqItemFk, id));
				}else{
					if(!lookupData.wicBoqItemsPromise){
						lookupData.wicBoqItemsPromise = getWicItemListAsync();
					}

					return lookupData.wicBoqItemsPromise.then(function(){
						lookupData.wicBoqItemsPromise = null;
						return service.getItemById(id);
					});
				}
			}

			function getItemById(value) {
				let itemCache = basicsLookupdataLookupDescriptorService.getLookupItem('boqWicBoqItemFk', value);
				return itemCache;
			}


			// return boq items
			function getWicItemListAsync() {

				// lineItemContainer
				let lineItems =  getLineItem();

				let lineItemWicBoqItemFks =  [];
				if(lineItems && lineItems.length){
					_.forEach(lineItems, function (item) {
						if(item.WicBoqItemFk !== null){
							lineItemWicBoqItemFks.push(item.WicBoqItemFk);
						}
					});
				}

				// lineItem Selection statement container
				let selStatements = $injector.get('estimateMainLineItemSelStatementListService').getList() || [];
				let selStatementWicBoqItemFk = _.map(selStatements, 'WicItemFk');

				// Project selection statement container
				let projSelStatements = $injector.get('estimateProjectEstimateLineItemSelStatementListService').getList() || [];
				let projSelStatementWicBoqItemFk = _.map(projSelStatements, 'WicItemFk');

				let wicBoqItemFks = lineItemWicBoqItemFks.concat(selStatementWicBoqItemFk).concat(projSelStatementWicBoqItemFk);
				wicBoqItemFks = _.filter(wicBoqItemFks, function(wicBoqItemFk){ return wicBoqItemFk > 0; });
				wicBoqItemFks = _.uniq(wicBoqItemFks);


				let wicBoqItemCache = basicsLookupdataLookupDescriptorService.getData('boqWicBoqItemFk');

				// if wicItemFk not exists in cache. need update the cache
				let matchWicItemFk =[];
				if(wicBoqItemCache) {
					_.forEach(wicBoqItemFks, function (wicItemId) {
						_.filter(wicBoqItemCache, function (wicItem) {
							if (wicItem.Id === wicItemId) {
								matchWicItemFk.push(wicItemId);
							}
						});
					});
				}

				function getLineItem() {
					if (platformGridAPI.grids.exist('021c5211c099469bb35dcf68e6aebec7')) {
						return $injector.get('controllingStructureLineItemDataService').getList();
					} else {
						return $injector.get('estimateMainService').getList();
					}
				}

				if (matchWicItemFk.length === wicBoqItemFks.length) {
					return $q.when(wicBoqItemCache);
				} else {
					let postData = {
						wicBoqItemFks: wicBoqItemFks
					};
					if (!lookupData.wicBoqListAsyncPromise) {
						lookupData.wicBoqListAsyncPromise = $http.post(globals.webApiBaseUrl + 'boq/wic/boq/getBoqItemTreeById', postData).then(function (response) {
							let flattenResult = [];
							cloudCommonGridService.flatten(response.data, flattenResult, 'BoqItems');
							basicsLookupdataLookupDescriptorService.updateData('boqWicBoqItemFk', flattenResult);
							return flattenResult;
						});
					}

					return lookupData.wicBoqListAsyncPromise.then(function (data) {
						lookupData.wicBoqListAsyncPromise = null;
						let flattenList = [];
						cloudCommonGridService.flatten(data, flattenList, 'BoqItems');
						basicsLookupdataLookupDescriptorService.updateData('boqWicBoqItemFk', flattenList);
						return flattenList;
					});
				}
			}


			function  setBoqItemsImage(boqItemTree) {
				_.each(boqItemTree, function(item){
					boqMainImageProcessor.processItem(item);
				});
			}


			function getSearchWicBoqItemList(wicGroupIds, filterValue){
				let prjId = getProjectId();
				let requestData = {
					WicGroupIds: wicGroupIds,
					FilterValue: filterValue,
					ProjectId: prjId
				};
				return $http.post(globals.webApiBaseUrl+'boq/wic/boq/getwicboqbywicgroupid', requestData).then(function(response){
					let flattenResult= [];
					cloudCommonGridService.flatten(response.data,flattenResult ,'BoqItems');
					basicsLookupdataLookupDescriptorService.updateData('boqWicBoqItemFk', flattenResult);
					basicsLookupdataLookupDescriptorService.updateData('boqWicBoqItemTree', response.data);
					return response.data;
				});
			}

			function incorporateDataRead(readData, data) {
				let flattenResult= [];
				cloudCommonGridService.flatten(readData,flattenResult ,'BoqItems');
				basicsLookupdataLookupDescriptorService.updateData('boqWicBoqItemFk', flattenResult);
				basicsLookupdataLookupDescriptorService.updateData('boqWicBoqItemTree', readData);
				let items = readData.Main ? readData.Main : readData;
				return serviceContainer.data.handleReadSucceeded(items, data);
			}

			/* function loadLookupData (){
                if(lookupData.wicBoqItems === null || (lookupData.wicBoqItems && lookupData.wicBoqItems.length === 0)){
                    lookupData.wicBoqItemsPromise = getEstBoqItems();
                    if(!lookupData.wicBoqItemsPromise){return;}
                    lookupData.wicBoqItemsPromise.then(function(response){
                        lookupData.wicBoqItemsPromise = null;

                        lookupData.wicBoqItems = response.data;
                        let output = [];
                        if(lookupData.wicBoqItems){
                            cloudCommonGridService.flatten(lookupData.wicBoqItems, output, 'BoqItems');
                        }
                        basicsLookupdataLookupDescriptorService.updateData('wicBoqItems', output);
                    });
                }
            };

            function loadData () {
                if (!lookupData.estBoqListAsyncPromise) {
                    lookupData.estBoqListAsyncPromise = getEstBoqItems();
                }
                return lookupData.estBoqListAsyncPromise.then(function (response) {
                    lookupData.estBoqListAsyncPromise = null;

                    lookupData.wicBoqItems = _.uniq(response.data, 'Id');
                    return lookupData.wicBoqItems;
                });
            }; */
		}
	]);
})(angular);
