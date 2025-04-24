/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	/* global globals, _ */
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainPlantDialogService
	 * @function
	 * @description
	 * estimateMainPlantDialogService is the data service for estimate plant group and plant master dialog lookup controller..
	 */
	angular.module(moduleName).factory('estimateMainPlantDialogService', [
		'$q', '$injector', '$translate','PlatformMessenger', 'platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataLookupFilterService', 'mainViewService', 'estimateMainPlantStructureImageProcessor',
		function ($q, $injector, $translate,PlatformMessenger, platformDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataLookupFilterService, mainViewService, estimateMainPlantStructureImageProcessor) {

			let serviceOptions = {
				hierarchicalRootItem: {
					module: angular.module(moduleName),
					serviceName: 'estimateMainPlantDialogService',
					httpRead: {
						route: globals.webApiBaseUrl + 'project/plantassembly/',
						endRead: 'getplantlist',
						usePostForRead: true,
						initReadData: function initReadData(filterRequest) {
							filterRequest.LgmJobFk = null;
							if (mainViewService.getCurrentModuleName() === moduleName){
								let estMainServ = $injector.get('estimateMainService');
								filterRequest.ProjectId = estMainServ.getSelectedProjectId();
								let options = $injector.get('estimateMainPlantAssemblyDialogService').getOptions();
								filterRequest.LgmJobFk = options.usageContext === 'estimateMainService' ? estMainServ.getLineItemJobId(estMainServ.getSelected()) : estMainServ.getLgmJobId($injector.get('estimateMainResourceService').getSelected());
							}
							else if (mainViewService.getCurrentModuleName() === 'project.main'){
								filterRequest.ProjectId = $injector.get('projectMainService').getSelected().Id;
							}
							else if (mainViewService.getCurrentModuleName() === 'resource.equipment'){
								let plant2EstPriceListItem = $injector.get('resourceEquipmentPlant2EstimatePriceListDataService').getSelected();
								filterRequest.ProjectId = null;
								filterRequest.PlantEstimatePriceListFk = plant2EstPriceListItem ? plant2EstPriceListItem.EstimatePricelistFk : -1;
							}
							else if (mainViewService.getCurrentModuleName() === 'resource.equipmentgroup'){
								let plantGrp2EstPriceListItem = $injector.get('resourceEquipmentGroupPlantGroup2EstimatePriceListDataService').getSelected();
								filterRequest.ProjectId = null;
								filterRequest.PlantEstimatePriceListFk = plantGrp2EstPriceListItem ? plantGrp2EstPriceListItem.EstimatePricelistFk : -1;
							}
							else if (mainViewService.getCurrentModuleName() === 'estimate.assemblies'){
								filterRequest.ProjectId = null;
								filterRequest.LgmJobFk = null;
							}
							else{
								filterRequest.ProjectId = null;
							}
							return filterRequest;
						}
					},
					actions: {},
					presenter: {
						tree: {
							parentProp: 'EquipmentGroupFk',
							childProp: 'SubGroups',
							childSort: true,
							isDynamicModified : true,
							incorporateDataRead: incorporateDataRead
						}
					},
					useItemFilter: true,
					dataProcessor: [new ServiceDataProcessArraysExtension(['SubGroups'])],
					entityRole: {
						root: {
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							// codeField: 'EstPlantAssemblyGroupFk',
							codeField: 'Code',
							itemName: 'EstPlantGroup',
							moduleName: moduleName
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			let service = serviceContainer.service;
			let data = serviceContainer.data;
			let allGroups = [];

			service.setShowHeaderAfterSelectionChanged(null);
			data.updateOnSelectionChanging = null;

			angular.extend(service, {
				loadAllPlantGroup: loadAllPlantGroup,
				filterPlantAssemblyGroup: filterPlantAssemblyGroup,
				getFilteredList: getFilteredList,
				getFlattenByTree: getFlattenByTree,
				getByPlantAssembly: getByPlantAssembly,
				getByPlantAssemblies: getByPlantAssemblies,
				expandNodeParent: expandNodeParent,
				init: init,
				resetSelectedItem: resetSelectedItem,
				getPlantGroupIds: getPlantGroupIds,
				getFilteredGroupIds: getFilteredGroupIds,
				clearGroupsCache: clearGroupsCache,
				reset: new PlatformMessenger(),
				filterGroups: new PlatformMessenger(),
				filterAssemblyByPlantGroup:filterAssemblyByPlantGroup
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

			function processTreeData(node, level){
				// Node assignment
				node.nodeInfo = node.nodeInfo || {};
				let hasChildren = node.SubGroups && node.SubGroups.length > 0;
				node.nodeInfo = {
					collapsed: true,
					level: level,
					children: hasChildren
				};
				if (hasChildren){
					_.forEach(node.SubGroups, function(catChild){
						processTreeData(catChild, level + 1);
					});
				}
			}

			function getFilteredListIds(list) {

				let resultGroupArr = [];
				let resultPlantArr = [];
				_.forEach(list, function(item){
					if (!_.isEmpty(item)){
						if(item.IsPlantGroup){
							collectPlantGroupIds(item, resultGroupArr);
						}else{
							collectPlantIds(item, resultPlantArr);
						}
					}
				});

				return [{Key: 1, Value: resultGroupArr}, {Key: 0, Value: resultPlantArr}];
			}

			function getPlantGroupIds(isPopup) {

				let resultGroupArr = [];
				let resultPlantArr = [];
				let groupItem = isPopup ? null : service.getSelected();
				if (!_.isEmpty(groupItem)){
					if(groupItem.IsPlantGroup){
						collectPlantGroupIds(groupItem, resultGroupArr);
					}else{
						collectPlantIds(groupItem, resultPlantArr);
					}
				}
				return [{Key: 1, Value: resultGroupArr}, {Key: 0, Value: resultPlantArr}];
			}

			function getFilteredGroupIds(options, entity, isPopup){
				// attempt 1: get from selected category
				let  groupArrayResult = getPlantGroupIds(isPopup) || [];

				if (_.size(groupArrayResult) === 0){
					// attempt 2: get from user defined categories in master data filter along with filtered(composite assembly types) categories.
					groupArrayResult = getFilteredList(options, entity);
					return getFilteredListIds(groupArrayResult);

				}else{
					return groupArrayResult;
				}
			}

			function collectPlantGroupIds(groupItem, resultArr){
				if (!Object.hasOwnProperty.call(groupItem, 'IsTemp')){
					resultArr.push(groupItem.Id);
				}
				_.each(groupItem.SubGroups, function (item) {
					collectPlantGroupIds(item, resultArr);
				});
			}

			function collectPlantIds(plantItem, resultArr){
				if (!Object.hasOwnProperty.call(plantItem, 'IsTemp')){
					resultArr.push(plantItem.Id);
				}
			}

			function processData(node){
				processTreeData(node, 0);
			}

			function filterPlantAssemblyGroup(options, entity, treeList){ // basic filter of composite types for category parents.
				let lookupOptions = options.lookupOptions;

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
						_.forEach(itemListFilteredParents, function(item){
							if (item.HasChildren){
								item.SubGroups= _.filter(itemListFiltered, { EquipmentGroupFk: item.Id });
							}
						});

						return itemListFilteredParents;
					}
				}else{
					return treeList;
				}
			}

			function getFilteredList(options, entity){
				// todo test this fn
				let lookupOptions = options.lookupOptions;
				// let list = service.getUnfilteredList();

				let treeList = angular.copy(service.getTree());
				let treeListFiltered = filterPlantAssemblyGroup(options, entity, treeList);
				let list = getFlattenByTree(treeListFiltered);

				if (lookupOptions && lookupOptions.filterKey) {
					let filter = basicsLookupdataLookupFilterService.getFilterByKey(lookupOptions.filterKey);
					let filterFn = function (item) {
						return filter.fn(item, entity || {});
					};
					list = _.isEmpty(filter) ? list : _.filter(list, filterFn);
				}
				return list;
			}

			function loadAllPlantGroup(){
				let defer = $q.defer();
				if (_.isEmpty(allGroups)){
					let readFilterRequestSettings = {};
					serviceOptions.hierarchicalRootItem.httpRead.initReadData(readFilterRequestSettings);
					data.doCallHTTPRead(readFilterRequestSettings, data, function(response){
						let groups = buildTreeStructure(response.data);
						//add blank plant to handle assemblies without plant in estimate and project module.
						groups.push({
							Id: -2,
							Code: $translate.instant('estimate.main.noPlantAssigned'),
							PlantFk: null
						});

						allGroups = groups;
						setDataItems(groups);
						defer.resolve(data.itemTree);
					});
				}else{
					setDataItems(allGroups);
					defer.resolve(data.itemTree);
				}
				return defer.promise;
			}

			function clearGroupsCache(){
				allGroups = [];
			}

			function setDataItems(groups){
				data.itemTree = groups || [];

				if (mainViewService.getCurrentModuleName() === 'estimate.assemblies'){
					data.itemTree = data.itemTree.filter(item => item.Id !== -2);
				}				
				_.each(data.itemTree, function(item){
					processData(item);
				});

				data.itemList = getFlattenByTree(data.itemTree);
				_.each(data.itemList, function(item){
					estimateMainPlantStructureImageProcessor.processItem(item);
					// All plant assembly groups are cleared from temp flag
					if (Object.hasOwnProperty.call(item, 'IsTemp')){
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
				if(node && node.nodeInfo) {
					node.nodeInfo.collapsed = false;
					if (node.nodeInfo.level !== 0) {
						let parent = _.find(service.getUnfilteredList(), {'Id': node.EquipmentGroupFk});
						return expandNodeParent(parent);
					} else {
						return node;
					}
				}
			}

			function getByPlantAssembly(plantAssembly){
				let item = {};
				// plantAssembly
				if(!plantAssembly){
					return item;
				}
				if(plantAssembly.PlantFk){
					item = _.find(data.itemList, {'Id': plantAssembly.PlantFk});
					item = item ? item : {};
				}
				return item;
			}

			function getByPlantAssemblies(plantAssemblies){
				let items = [];
				angular.forEach(plantAssemblies, function (plantAssembly){
					let item = getByPlantAssembly(plantAssembly);
					if(item && item.Id){
						items.push(item);
					}
				});
				return items;
			}

			function filterAssemblyByPlantGroup(plantAssemblies){
				let prjPlantAssemblies = _.filter(plantAssemblies, {'IsProject': true});
				_.each(prjPlantAssemblies, function (item){
					let matchItems = _.filter(prjPlantAssemblies, {'IsProject': false, 'Code': item.Code});
					_.each(matchItems, function (matchItem){
						/*if(isRevome(matchItem, item)){
							_.remove(prjPlantAssemblies, {'Id': matchItem.Id});
						}*/
					});
				});
			}

			function incorporateDataRead(readData){
				return service.setList(buildTreeStructure(readData));
			}

			function buildTreeStructure(list) {
				let context = {
					treeOptions:{
						parentProp: 'EquipmentGroupFk',
						childProp: 'SubGroups'
					},
					IdProperty: 'Id'
				};

				angular.forEach(list, function (item) {
					item.IsChecked= false;
				});

				return list && list.length ? $injector.get('basicsLookupdataTreeHelper').buildTree(list, context) : [];
			}
		}
	]);
})(angular);
