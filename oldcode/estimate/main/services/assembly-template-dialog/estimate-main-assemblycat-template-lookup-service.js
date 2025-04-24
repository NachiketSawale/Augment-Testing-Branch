/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals, _ */
(function(angular) {
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainAssemblycatTemplateService
	 * @function
	 * @description
	 * estimateMainAssemblycatTemplateService is the data service for estimate assembly category lookup controller..
	 */
	angular.module(moduleName).factory('estimateMainAssemblycatTemplateService', [
		'$q', '$injector', '$translate', 'PlatformMessenger', 'platformDataServiceFactory', 'estimateAssembliesStructureImageProcessor', 'ServiceDataProcessArraysExtension', 'basicsLookupdataLookupFilterService', 'mainViewService',
		function ($q, $injector, $translate, PlatformMessenger, platformDataServiceFactory, estimateAssembliesStructureImageProcessor, ServiceDataProcessArraysExtension, basicsLookupdataLookupFilterService, mainViewService) {

			let serviceOptions = {
				hierarchicalRootItem: {
					module: angular.module(moduleName),
					serviceName: 'estimateMainAssemblycatTemplateService',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/assemblies/structure/',
						endRead: 'treeForLookup',
						usePostForRead: true,
						initReadData: function initReadData(filterRequest) {
							if (mainViewService.getCurrentModuleName() === moduleName){
								filterRequest.ProjectId = $injector.get('estimateMainService').getSelectedProjectId();
							} else if (mainViewService.getCurrentModuleName() === 'project.main'){
								filterRequest.ProjectId = $injector.get('projectMainService').getSelected().Id;
							} else{
								filterRequest.ProjectId = null;
							}
							return filterRequest;
						}
					},
					actions: {},
					presenter: {
						tree: {
							parentProp: 'EstAssemblyCatFk',
							childProp: 'AssemblyCatChildren',
							childSort : true, isDynamicModified : true,
							incorporateDataRead: incorporateDataRead
						}
					},
					useItemFilter: true,
					entityRole: {
						root: {
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							codeField: 'EstAssemblyCatFk',
							itemName: 'AssemblyCategory',
							moduleName: moduleName
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			let service = serviceContainer.service;
			let data = serviceContainer.data;
			let allCategoryList = [];

			service.setShowHeaderAfterSelectionChanged(null);
			data.updateOnSelectionChanging = null;

			angular.extend(service, {
				loadAllAssemblyCategories: loadAllAssemblyCategories,
				filterAssemblyCategories: filterAssemblyCategories,

				getFilteredList: getFilteredList,
				expandNodeParent: expandNodeParent,
				getFlattenByTree: getFlattenByTree,

				init: init,
				resetSelectedItem: resetSelectedItem,

				getAssemblyCategoryIds: getAssemblyCategoryIds,
				getFilteredCategoryIds: getFilteredCategoryIds,

				filterAssemblyByCats: filterAssemblyByCats,

				clearCategoriesCache: clearCategoriesCache,

				reset: new PlatformMessenger(),

				filterCategories: new PlatformMessenger(),

				setIsLoadCat: setIsLoadCat,
			});

			service.setItemFilter = function setItemFilter(predicate) {
				// overwritten method
				data.itemFilter = predicate;
				if (predicate === null) {
					data.itemFilterEnabled = false;
				}
			};

			return service;

			function init(){
				data.itemList = data.itemTree = [];
				data.selectedItem = null;
				data.selectedEntities = [];

				data.itemFilter = null;
				data.itemFilterEnabled = false;
			}

			function resetSelectedItem(){
				data.selectedItem = null;
			}

			function processTreeData(node, level, parent){
				// Assembly type assignment
				parent = parent || {};
				node.EstAssemblyTypeFk = node.EstAssemblyTypeFk || parent.EstAssemblyTypeFk;

				// Node assignment
				node.nodeInfo = node.nodeInfo || {};
				node.nodeInfo = {
					collapsed: true,
					level: level,
					children: node.HasChildren
				};
				if (node.HasChildren){
					_.forEach(node.AssemblyCatChildren, function(catChild){
						processTreeData(catChild, level + 1, node);
					});
				}
			}

			function getAssemblyCategoryIds(isPopup) {
				let resultArr = [];
				let category = isPopup ? null : service.getSelected();
				if (!_.isEmpty(category)){
					collectAssemblyCatIds(category, resultArr);
				}
				return resultArr;
			}

			function getFilteredCategoryIds(options, entity, isPopup){
				// attempt 1: get from selected category
				let  catArrayResult = getAssemblyCategoryIds(isPopup) || [];

				if (_.size(catArrayResult) === 0){
					// attempt 2: get from user defined categories in master data filter along with filtered(composite assembly types) categories.
					// catArrayResult = getFilteredList(options, entity);

					let catArrayItems = [];
					_.forEach(catArrayResult, function(assemblyCat){
						collectAssemblyCatIds(assemblyCat, catArrayItems);
					});

					return _.map(catArrayItems);
				}else{
					return catArrayResult;
				}
			}

			function collectAssemblyCatIds(assemblyCatItem, resultArr){
				// eslint-disable-next-line no-prototype-builtins
				if (!assemblyCatItem.hasOwnProperty('IsTemp')){
					resultArr.push(assemblyCatItem.Id);

					if (assemblyCatItem.EstAssemblyCatSourceFk > 0){
						resultArr.push(assemblyCatItem.EstAssemblyCatSourceFk);
					}
				}
				_.each(assemblyCatItem.AssemblyCatChildren, function (item) {
					collectAssemblyCatIds(item, resultArr);
				});
			}

			function processData(node){
				processTreeData(node, 0);
			}

			// // filter by master data filter Ids
			// function filterTreeByMasterDataFilterIds(_treeList, filterIds) {
			// _.each(_treeList, function (item) {
			// if(item.AssemblyCatChildren && item.AssemblyCatChildren.length > 0 && item.HasChildren){
			// _.remove(item.AssemblyCatChildren, function(n) {
			// return filterIds.indexOf(n.Id) === -1;
			// });
			// }
			// item.hasChildren = (item.AssemblyCatChildren && item.AssemblyCatChildren.length > 0);
			// });
			// }

			function filterAssemblyCategories(options, entity, treeList){ // basic filter of composite types for category parents.
				let lookupOptions = options.lookupOptions;

				// filter by master data filter
				// let prjCategoriesList = $injector.get('estimateProjectRateBookConfigDataService').getFilterIds(1);

				// var noAssignmentFiltered = _.filter(treeList, function(treeItem){return treeItem.Id === -2;});

				// treeList = _.filter(treeList, function(item){
				// return !(prjCategoriesList.length > 0 && prjCategoriesList.indexOf(item.Id) === -1);
				// });
				// if(prjCategoriesList && prjCategoriesList.length > 0) {
				// filterTreeByMasterDataFilterIds(treeList, prjCategoriesList);
				// }

				if (lookupOptions && lookupOptions.filterKey) {
					let filter = basicsLookupdataLookupFilterService.getFilterByKey(lookupOptions.filterKey);
					let filterFn = function (item) {
						return filter.fn(item, entity || {});
					};
					if (_.isEmpty(filter)){
						return treeList;
					}else{
						let itemList = angular.copy(data.itemList);
						let itemListFiltered = itemList.filter(filterFn);
						let itemListFilteredParents = _.filter(itemListFiltered, function(item){
							return item.nodeInfo.level === 0;
						});

						return itemListFilteredParents;
					}
				}else{
					return treeList;
				}
			}

			function getFilteredList(options, entity){
				let lookupOptions = options.lookupOptions;
				// let list = service.getUnfilteredList();

				let treeList = angular.copy(service.getTree());
				let treeListFiltered = filterAssemblyCategories(options, entity, treeList);
				let list = getFlattenByTree(treeListFiltered);

				// filter by master data filter
				// let prjCategoriesList = $injector.get('estimateProjectRateBookConfigDataService').getFilterIds(1);
				// if (_.size(prjCategoriesList) > 0 && prjCategoriesList.indexOf(-1) > -1){
				// prjCategoriesList.push(-2); // No assignment is -2 in client side, and -1 in server PrjRateBook
				// }
				// list = _.filter(list, function(item){
				// return !(prjCategoriesList.length > 0 && prjCategoriesList.indexOf(item.Id) === -1);
				// });

				if (lookupOptions && lookupOptions.filterKey) {
					let filter = basicsLookupdataLookupFilterService.getFilterByKey(lookupOptions.filterKey);
					let filterFn = function (item) {
						return filter.fn(item, entity || {});
					};
					list = _.isEmpty(filter) ? list : _.filter(list, filterFn);
				}

				if (list.length === 0){ // } && prjCategoriesList.length > 0){
					list.push({Id: 0}); // It was filtered by master data filter, but result of filters was 0, we mock category temp data to filter, otherwise it will show all assemblies from all catalogs
				}

				// Do not include Temp categories
				list = _.filter(list, function(item){
					// eslint-disable-next-line no-prototype-builtins
					return !item.hasOwnProperty('IsTemp');
				});

				return list;
			}

			function loadAllAssemblyCategories() {
				let defer = $q.defer();
				// TODO: cause have project assembly, should reload the data. - lnt
				let readFilterRequestSettings = {};
				serviceOptions.hierarchicalRootItem.httpRead.initReadData(readFilterRequestSettings);
				data.doCallHTTPRead(readFilterRequestSettings, data, function (categories) {

					// ALWAYS display in lookup, filter in BACKEND based on Project Assembly Or Master Assembly
					// add blank category to handle assemblies without category.
					categories.push({
						Id: -2,
						Code: $translate.instant('estimate.main.noAssemblyCategory'),
						EstAssemblyCatFk: null
					});
					setDataItems(categories);
					defer.resolve(data.itemTree);
					service.setIsLoadCat(true);
				});
				return defer.promise;
			}

			function setIsLoadCat(value) {
				service.isLoadCat = value;
			}

			function clearCategoriesCache(){
				allCategoryList = [];
			}

			function setDataItems(categories){
				data.itemTree = categories || [];
				_.each(data.itemTree, function(item){
					processData(item);
				});

				data.itemList = getFlattenByTree(data.itemTree);
				allCategoryList = data.itemList;

				_.each(data.itemList, function(item){
					estimateAssembliesStructureImageProcessor.processItem(item);
					// All assembly catalogues are cleared from temp flag
					// eslint-disable-next-line no-prototype-builtins
					if (item.hasOwnProperty('IsTemp')){
						delete item.IsTemp;
					}
				});
			}

			function getFlattenByTree(treeList){
				let itemList = [];
				data.flatten(treeList, itemList, data.treePresOpt.childProp);
				return itemList;
			}

			function expandNodeParent(node){
				if(node) {
					node.nodeInfo.collapsed = false;
					if (node.nodeInfo.level !== 0) {
						let parent = _.find(service.getUnfilteredList(), {'Id': node.EstAssemblyCatFk});
						return expandNodeParent(parent);
					} else {
						return node;
					}
				}
			}

			function incorporateDataRead(readData){
				return service.setList(readData);
			}

			function filterAssemblyByCats(assemblies){
				let prjAssemblies = _.filter(assemblies, {'IsProject': true});
				_.each(prjAssemblies, function (item){
					let matchItems = _.filter(assemblies, {'IsProject': false, 'Code': item.Code});
					_.each(matchItems, function (matchItem){
						if(isRevome(matchItem, item)){
							_.remove(assemblies, {'Id': matchItem.Id});
						}
					});
				});
			}

			function isRevome(item, prjItem){
				let prjCatItem = _.find(allCategoryList, {'Id': prjItem.EstAssemblyCatFk});
				let catItem = _.find(allCategoryList, {'Id': item.EstAssemblyCatFk});

				if (!prjCatItem && !catItem){
					return true;
				}
				else if (prjCatItem && catItem)
				{
					while (prjCatItem.EstAssemblyCatFk !== null) {
						prjCatItem = _.find(allCategoryList, {'Id': prjCatItem.EstAssemblyCatFk});
					}

					while (catItem.EstAssemblyCatFk !== null) {
						catItem = _.find(allCategoryList, {'Id': catItem.EstAssemblyCatFk});
					}

					if (prjCatItem && catItem) {
						return prjCatItem.Code === catItem.Code;
					} else {
						return  false;
					}
				}
				else if(!prjCatItem && catItem){
					return false;
				}
				else {
					return true;
				}

			}

		}
	]);
})(angular);
