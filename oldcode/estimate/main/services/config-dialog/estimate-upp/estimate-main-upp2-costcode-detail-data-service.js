/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainUpp2CostcodeDetailDataService
	 * @function
	 *
	 * @description
	 * This service provides Estimate Upp2costcode Detail Data Service for dialog.
	 */
	angular.module(moduleName).factory('estimateMainUpp2CostcodeDetailDataService',
		['$q', '$http', '$injector', '$translate', 'PlatformMessenger', 'platformGridAPI', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'cloudCommonGridService', 'estimateMainDialogProcessService', 'estimateMainLookupService',
			function ($q, $http, $injector, $translate, PlatformMessenger, platformGridAPI, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, cloudCommonGridService, estimateMainDialogProcessService, estimateMainLookupService) {

				let service = {},
					data = [],
					itemsToSave = [],
					itemsToDelete = [],
					originupp2Costcodes = [],
					upp2CostcodesDb = [],
					// estUppConfig = null,
					allPrjAndMdcCostCodes = [];

				let lookupKey = {
					contextCostCode: 'contextcostcodes'// filter by context(in customizing module)
				};

				angular.extend(service, {
					getList: getList,
					getTree: getTree,
					getFlatList: getFlatList,
					clear: clear,
					clearData: clearData,
					setDataList: setDataList,
					// getSelected: getSelected,
					// setSelected: setSelected,
					refreshGrid: refreshGrid,
					getCurrentItem: getCurrentItem,
					onItemModified: new PlatformMessenger(),
					listLoaded: new PlatformMessenger(),
					registerListLoaded: registerListLoaded,
					unregisterListLoaded: unregisterListLoaded,
					unregisterSelectionChanged: unregisterSelectionChanged,
					// markItemAsModified: markItemAsModified,
					gridRefresh: gridRefresh,
					// createItem: createItem,
					// deleteItem: deleteItem,
					getItemsToSave: getItemsToSave,
					getItemsToDelete: getItemsToDelete,
					setUppId: setUppId,
					// hasSelection: hasSelection,
					getItemsToUpdate: getItemsToUpdate,
					mdcContextIdContainer: new MdcContextIdContainer(),
					getOriginList: getOriginList,
					setDataListFromMdc: setDataListFromMdc,
					forceGridRefresh: forceGridRefresh,
					setNeedToForceGridRefresh: setNeedToForceGridRefresh,
					setIsCurrentBoqUppConfiged:setIsCurrentBoqUppConfiged,
					getIsCurrentBoqUppConfiged: getIsCurrentBoqUppConfiged,
					resetGridHeaderTitle: resetGridHeaderTitle,
					setGuid:setGuid
				});

				let serviceOption = {
					module: angular.module(moduleName),
					entitySelection: {},
					modification: {multi: {}},
					translation: {
						uid: 'estimateMainUpp2CostcodeDetailDataService',
						title: 'Title',
						columns: [
							{
								header: 'cloud.common.entityDescription',
								field: 'DescriptionInfo'
							}]
					}
				};

				let container = platformDataServiceFactory.createNewComplete(serviceOption);
				container.data.itemList = [];
				angular.extend(service, container.service);

				function getList() {
					data = _.orderBy(data, ['Sort','Code'], ['asc']);
					return data;
				}

				function getFlatList() {
					return _.filter(cloudCommonGridService.flatten(getList(), [], 'CostCodes'),function (o) {
						return o.UppId && o.UppId > 0;
					});
				}

				function getTree() {
					data = _.orderBy(data, ['Sort','Code'], ['asc']);
					return data;
				}

				function getCurrentItem() {
					let currentItem = service.getSelected();
					if (currentItem && currentItem.Id) {
						return currentItem;
					}
					return null;
				}

				function getOriginList() {
					let copyFrom = angular.copy(upp2CostcodesDb);
					// merge with list
					let flatList = cloudCommonGridService.flatten(getList(), [], 'CostCodes');
					_.each(copyFrom,function (item) {
						let currentItem = findCostCode(flatList, item);
						if(currentItem){
							item.UppId = currentItem.UppId;
						}
						else{
							item.UppId = 0;
						}
					});
					// for the new items should add in(itemsToSave)
					_.each(itemsToSave, function (toSaveItem) {
						let ifExist = findCostCode(copyFrom, toSaveItem);
						if(!ifExist){
							toSaveItem.Id = toSaveItem.MdcCostCodeFk;
							copyFrom.push(toSaveItem);
						}
					});

					// sync selected urb costCode those are checked last time (click Previous and click next again)
					_.forEach(flatList, function (item){
						if(item.UppId > 0 && !findCostCode(copyFrom, item)){
							copyFrom.push({
								Id: item.Id,
								MdcCostCodeFk: item.MdcCostCodeFk,
								Project2MdcCstCdeFk: item.Project2MdcCstCdeFk,
								UppConfigFk: item.UppConfigFk,
								LineType:item.LineType,
								UppId: item.UppId
							});
						}
					});

					return copyFrom;
				}

				// set detail table checkbox value
				function setDataList(items) {
					if (Array.isArray(items)) {
						data = items;
						// estUppConfig = angular.copy(items.estUppConfig);
						originupp2Costcodes = items;
						upp2CostcodesDb = angular.copy(items);
					} else {
						data = [];
					}
					return getUpp2CostcodeDetails(items).then(function (mergedItems) {
						data = mergedItems;
						service.onItemModified.fire();
						return data;
					});
				}

				function appendOnlyProjectCostCodes(data, forceLoad) {
					let projectId = $injector.get('estimateMainService').getProjectId();
					if(!projectId || projectId <= 0){
						return $q.when(data);
					}

					let flatMasterCostCodes = cloudCommonGridService.flatten(data, [], 'CostCodes');
					if(!!allPrjAndMdcCostCodes && allPrjAndMdcCostCodes.length > 0 && !forceLoad){
						_.forEach(allPrjAndMdcCostCodes, function (item) {
							if(item.ParentMdcCostCodeFk){
								let parent = _.find(flatMasterCostCodes, {Id:item.ParentMdcCostCodeFk});
								if(parent){
									append2Parent(parent, [item]);
								}
							}
						});

						return $q.when(data);
					}

					return $http.get(globals.webApiBaseUrl + 'project/costcodes/getonlyprjcostcodetree?projectId=' + projectId).then(function (response) {
						if(!response || !response.data){
							return data;
						}


						allPrjAndMdcCostCodes = response.data;

						_.forEach(response.data, function (item) {
							if(item.ParentMdcCostCodeFk){
								let parent = _.find(flatMasterCostCodes, {Id:item.ParentMdcCostCodeFk});
								if(parent){
									append2Parent(parent, [item]);
								}
							}
						});

						return data;
					});

					function append2Parent(parent, children) {
						if(!children || children.length <= 0){
							return;
						}

						parent.CostCodes = parent.CostCodes || [];
						_.forEach(children, function (child) {
							child.IsOnlyProjectCostCode = true;
							parent.CostCodes.push(child);

							append2Parent(child, child.ProjectCostCodes);
						});

					}

				}

				function setDataListFromMdc(datalist, forceLoad) {
					if(forceLoad) {
						basicsLookupdataLookupDescriptorService.removeData(lookupKey.contextCostCode);
					}
					let mdcCC = basicsLookupdataLookupDescriptorService.getData(lookupKey.contextCostCode);
					let contextId = service.mdcContextIdContainer.getMdcContextId();
					mdcCC = _.filter(mdcCC, function(item){
						return item.ContextFk === contextId;
					});
					if (mdcCC.length <= 0) {
						return getCostcodesAsync(forceLoad).then(function (costcodes) {
							let flatCostCodes = retriveFlatCostCodes(costcodes, datalist);
							return setDataList(flatCostCodes).then(function () {
								refreshGrid();
								return true;
							});
						});
					} else {
						let flatCostCodes = retriveFlatCostCodes(mdcCC, datalist);
						return setDataList(flatCostCodes).then(function () {
							refreshGrid();
							return true;
						});
					}
				}

				// get data list of the enterprise costcodes async(filter by context)
				function getCostcodesAsync(forceLoad) {
					let dialogConfig = estimateMainDialogProcessService.getDialogConfig();
					if(dialogConfig && dialogConfig.editType === 'customizeforupp') {
						return $http.get(globals.webApiBaseUrl + 'basics/costcodes/estcostcodetree?' + service.mdcContextIdContainer.getMdcContextIdQueryString()).then(function (response) {
							let tree = estimateMainLookupService.buildTree(response.data);
							basicsLookupdataLookupDescriptorService.updateData(lookupKey.contextCostCode, tree);
							return tree;
						});
					}
					else{
						return estimateMainLookupService.getEstCostCodesListAsync().then(function (data) {
							basicsLookupdataLookupDescriptorService.updateData(lookupKey.contextCostCode, data);
							return appendOnlyProjectCostCodes(data, forceLoad);
						});
					}
				}

				function retriveFlatCostCodes(costcodes, datalist) {
					let flatCostCodes = cloudCommonGridService.flatten(costcodes, [], 'CostCodes');
					flatCostCodes = _.map(flatCostCodes, function (item) {
						return {
							'Id': item.Id,
							'EstUppConfigFk': null,
							'UppId': null,
							'MdcCostCodeFk': item.IsOnlyProjectCostCode ? null : (item.Id > 0 ? item.Id : item.MdcCostCodeFk),
							'LineType':item.LineType,
							'Project2MdcCstCdeFk': item.IsOnlyProjectCostCode ? (item.Id > 0 ? item.Id : item.Project2MdcCstCdeFk) : null,
							'InsertedAt': item.InsertedAt,
							'InsertedBy': item.InsertedBy,
							'UpdatedAt': item.UpdatedAt,
							'UpdateBy': item.UpdateBy,
							'Version': item.Version,
							'EstUppConfigEntity': null
						};
					});
					if (datalist && _.isArray(datalist) && datalist.length > 0) {
						_.each(flatCostCodes, function (cc) {
							let realItem = findCostCode(datalist, cc);
							if (realItem) {
								cc.UppId = realItem.UppId;
							}
						});
					}

					if(datalist && datalist.length > 0){
						_.each(datalist, function (d){
							if(d.Id < 0){
								flatCostCodes.push(d);
							}
						});
					}
					return flatCostCodes;
				}

				function refreshGrid() {
					service.listLoaded.fire();
				}

				function unregisterSelectionChanged() {
				}

				function registerListLoaded(callBackFn) {
					service.listLoaded.register(callBackFn);
				}

				function unregisterListLoaded(callBackFn) {
					service.listLoaded.unregister(callBackFn);
				}

				function gridRefresh() {
					refreshGrid();
				}

				function forceGridRefresh(){
					if(needToforceGridRefresh){
						gridRefresh();
						needToforceGridRefresh = false;
					}
				}

				// eslint-disable-next-line no-unreachable
				let needToforceGridRefresh = false;
				function  setNeedToForceGridRefresh(val){
					needToforceGridRefresh = val;
				}

				/* function createNewItem(uppConfigFk) {
					return {
						'UppConfigFk': uppConfigFk
					};
				} */

				let isCreateNewEstBoqUppConfig = false;
				function setIsCurrentBoqUppConfiged(val){
					isCreateNewEstBoqUppConfig = val;
				}
				function getIsCurrentBoqUppConfiged(){
					return isCreateNewEstBoqUppConfig;
				}

				function getItemsToSave() {
					if(isCreateNewEstBoqUppConfig){
						angular.forEach(originupp2Costcodes, function (upp2CC) {
							let deleteItems = _.find(itemsToDelete, {'Id': upp2CC.Id});
							if (!deleteItems) {
								itemsToSave.push(upp2CC);
							}
						});
					}
					return itemsToSave.length ? itemsToSave : null;
				}

				function getItemsToDelete() {
					return itemsToDelete.length ? itemsToDelete : null;
				}

				function getItemsToUpdate() {
					let itemsToUpdate = [];
					angular.forEach(upp2CostcodesDb, function (upp2CC) {
						let item = _.find(originupp2Costcodes, {'Id': upp2CC.Id});
						let deleteItems = _.find(itemsToDelete, {'Id': upp2CC.Id});
						if (upp2CC.UppId !== item.UppId && !deleteItems) {
							itemsToUpdate.push(item);
						}
					});
					return itemsToUpdate;
				}

				function getMinAllowanceId(){
					return -100;
				}

				// get data list of the enterprise costcodes async
				function getUpp2CostcodeDetails(items) {
					let currentAllowanceId = getMinAllowanceId();

					function copy(item){
						return {
							'Id': item.Id,
							'Code': item.Code + ' DCM on',
							'CostCodeParentFk': item.Id,
							'MdcCostCodeFk': item.IsOnlyProjectCostCode ? null : item.Id,
							'Project2MdcCstCdeFk': item.IsOnlyProjectCostCode ? item.Id : null,
							'LineType':1,
							'IsOnlyProjectCostCode': item.IsOnlyProjectCostCode
						};
					}

					function mapChild(childcostcodes) {
						_.forEach(childcostcodes, function (item){
							if(item.Id > 0){
								item.CostCodes = item.CostCodes || [];
								let dcmOn = copy(item);
								dcmOn.Id = currentAllowanceId--;
								dcmOn.LineType = 1;
								item.CostCodes.unshift(dcmOn);
							}
						});

						if (childcostcodes) {
							childcostcodes = _.map(childcostcodes, function (item) {
								return {
									'Id': currentAllowanceId--,
									'Code': item.Code,
									'DescriptionInfo': item.DescriptionInfo,
									'Description2Info': item.Description2Info,
									'CostCodeParentFk': item.CostCodeParentFk,
									'CostCodes': mapChild(item.CostCodes),
									'MdcCostCodeFk': item.IsOnlyProjectCostCode ? null : (item.Id > 0 ? item.Id : item.MdcCostCodeFk),
									'Project2MdcCstCdeFk': item.IsOnlyProjectCostCode ? (item.Id > 0 ? item.Id : item.Project2MdcCstCdeFk) : null,
									'EstUpp2CostcodeId': null,
									'UppId': null,
									'UppId1': null,
									'UppId2': null,
									'UppId3': null,
									'UppId4': null,
									'UppId5': null,
									'UppId6': null,
									'Version': item.Version,
									'image': item.Id > 0 ? 'ico-folder-empty' : 'ico-folder-controls',
									'Sort': 0,
									'LineType': item.LineType
								};
							});
						}
						return childcostcodes;
					}

					function mergeUpp2Costcodes(costCodeList) {
						let upp2Costcodes = items;

						let costCodes = angular.copy(costCodeList);
						_.forEach(costCodes, function (item){
							item.CostCodes = item.CostCodes || [];
							let dcmOn = copy(item);
							dcmOn.Id = currentAllowanceId--;
							dcmOn.LineType = 1;
							item.CostCodes.unshift(dcmOn);
						});

						// Append allowance items
						costCodes.push({
							'Id': -2,
							'Code': 'AA',
							'Sort': 2,
							'LineType':2,
							'CostCodes':[]
						});
						costCodes.push({
							'Id': -3,
							'Code': 'AA-Surcharge',
							'Sort': 3,
							'LineType':3,
							'CostCodes':[]
						});
						costCodes.push({
							'Id': -4,
							'Code': 'MM',
							'Sort': 4,
							'LineType':4,
							'CostCodes':[]
						});
						costCodes.push({
							'Id': -5,
							'Code': 'URD',
							'Sort': 5,
							'LineType':5,
							'CostCodes':[]
						});
						costCodes.push({
							'Id': -6,
							'Code': 'Rounding Divergence',
							'Sort': 6,
							'LineType':6,
							'CostCodes':[]
						});

						// retrive only specific properties of costcodes
						if (costCodes) {
							costCodes = _.map(costCodes, function (item) {
								return {
									'Id': currentAllowanceId--,
									'Code': item.Code,
									'DescriptionInfo': item.DescriptionInfo,
									'Description2Info': item.Description2Info,
									'CostCodeParentFk': item.CostCodeParentFk,
									'CostCodes': mapChild(item.CostCodes),
									'MdcCostCodeFk': item.IsOnlyProjectCostCode ? null : (item.Id > 0 ? item.Id : item.MdcCostCodeFk),
									'Project2MdcCstCdeFk': item.IsOnlyProjectCostCode ? (item.Id > 0 ? item.Id : item.Project2MdcCstCdeFk) : null,
									'EstUpp2CostcodeId': null,
									'UppId': null,
									'UppId1': null,
									'UppId2': null,
									'UppId3': null,
									'UppId4': null,
									'UppId5': null,
									'UppId6': null,
									'Version': item.Version,
									'image': item.Id > 0 ? 'ico-folder-empty' : 'ico-folder-controls',
									'Sort': item.Sort || 0,
									'LineType': item.LineType
								};
							});
						}

						let flatCostCodes = cloudCommonGridService.flatten(costCodes, [], 'CostCodes');

						// merge upp2costcode with costcodes
						if (upp2Costcodes && upp2Costcodes.length) {
							angular.forEach(upp2Costcodes, function (upp2CC) {
								let item = findCostCode(flatCostCodes, upp2CC);
								if (item) {
									let children = [];
									if(!isCreateNewEstBoqUppConfig && item.CostCodes && item.CostCodes.length >0){
										// isCreateNewEstBoqUppConfig = false, this means current Grid is loaded from default Urp config from customize module,
										// and only project cost code would be showed in customize module,
										// so we need to set its own only project cost code urp config same as parent.
										children = item.CostCodes;
										children = _.filter(children, function (child){
											return !child.MdcCostCodeFk && child.Project2MdcCstCdeFk;
										});
										if(children && children.length > 0){
											children =  cloudCommonGridService.flatten(children, [], 'CostCodes');
										}
									}
									children.push(item);
									_.forEach(children, function (child){
										child.EstUpp2CostcodeId = upp2CC.Id;
										// item.Id = upp2CC.Id;
										child.UppId = upp2CC.UppId;
										// item['UppId'+item.UppId] = 1;
										let maxUppId = 6;
										for (let i = 1; i < maxUppId + 1; ++i) {
											child['UppId' + i.toString()] = i === child.UppId ? 1 : 0;
										}
										child.EstUppConfigFk = upp2CC.EstUppConfigFk;
									});

								}else if(upp2CC.Id < 0){
									costCodes.push(upp2CC);
								}
							});
						}

						let dialogConfig = estimateMainDialogProcessService.getDialogConfig();
						if(dialogConfig && dialogConfig.editType === 'estBoqUppConfig') {
							let currentItem = $injector.get('estimateMainDialogDataService').getCurrentItem();
							estimateMainDialogProcessService.setReadOnly(flatCostCodes, !currentItem || !currentItem.isEditUppType);
						}

						let flatupp2Costcodes = cloudCommonGridService.flatten(upp2Costcodes, [], 'CostCodes');

						function assignUppId(costcodes) {
							angular.forEach(costcodes, function (uppitem) {
								let item = _.find(flatupp2Costcodes, {'Id': uppitem.Id});
								if (item) {
									uppitem.UppId = item.UppId;
									for (let i = 1; i < 7; ++i) {
										uppitem['UppId' + i.toString()] = i === item.UppId ? 1 : 0;
									}
								}
								if(uppitem.CostCodes){
									assignUppId(uppitem.CostCodes);
								}
							});
						}

						assignUppId(costCodes);

						return costCodes;
					}

					// this will get data from cache ,when the costcode updated, this data are cache data , not the new costcodes
					let mdcCC = basicsLookupdataLookupDescriptorService.getData(lookupKey.contextCostCode);
					let contextId = service.mdcContextIdContainer.getMdcContextId();
					mdcCC = _.filter(mdcCC, function(item){
						return item.ContextFk === contextId;
					});
					if (mdcCC.length <= 0) {
						return getCostcodesAsync().then(function (data) {
							return mergeUpp2Costcodes(data);
						});
					} else {
						return $q.when(mergeUpp2Costcodes(mdcCC));
					}
				}

				// set uppId same as parent for children
				function setChildUppId(items, parentItem, childProp) {
					angular.forEach(items, function (item) {
						item.EstUpp2CostcodeId = item.EstUpp2CostcodeId ? item.EstUpp2CostcodeId : 0;
						item.UppId = parentItem.UppId;
						let maxUppId = 6;
						for (let i = 1; i < maxUppId + 1; ++i) {
							item['UppId' + i.toString()] = i === item.UppId ? 1 : 0;
						}
						item.EstUppConfigFk = parentItem.EstUppConfigFk;

						if (item[childProp] && item[childProp].length > 0) {
							setChildUppId(item[childProp], item, childProp);
						}
					});
					return items;
				}

				// set uniq UppId(1-6)
				function setUppId(arg) {
					let item = arg.item;
					if (!item) {
						return;
					}
					let column = arg.cell ? arg.grid.getColumns()[arg.cell].field : null;
					item.UppId = column && item[column] ? parseInt(column.substring(column.length - 1, column.length)) : 0;
					let maxUppId = 6;
					for (let i = 1; i < maxUppId + 1; ++i) {
						item['UppId' + i.toString()] = 0;
						if (i === item.UppId) {
							item['UppId' + item.UppId] = 1;
						}
					}
					if (item.CostCodes && item.CostCodes.length) {
						item.CostCodes = setChildUppId(item.CostCodes, item, 'CostCodes');
					}

					service.onItemModified.fire();
					service.gridRefresh();
				}

				function findCostCode(list, source) {
					if((source.MdcCostCodeFk || source.Project2MdcCstCdeFk) && !source.LineType) {
						return source.MdcCostCodeFk
							? _.find(list, function (item){return item.MdcCostCodeFk === source.MdcCostCodeFk && !item.LineType;})
							: _.find(list, function (item){return item.Project2MdcCstCdeFk === source.Project2MdcCstCdeFk && !item.LineType;});
					}else if((source.MdcCostCodeFk || source.Project2MdcCstCdeFk) && source.LineType){
						return source.MdcCostCodeFk
							? _.find(list, {'MdcCostCodeFk': source.MdcCostCodeFk, 'LineType': source.LineType})
							: _.find(list, {'Project2MdcCstCdeFk': source.Project2MdcCstCdeFk, 'LineType': source.LineType});
					}else{
						return _.find(list, {'LineType': source.LineType});
					}
				}

				function clear() {
					itemsToSave = [];
					itemsToDelete = [];
					allPrjAndMdcCostCodes = [];
					originupp2Costcodes = [];
					upp2CostcodesDb = [];
				}

				function clearData(){
					data = [];
				}

				function MdcContextIdContainer() {
					let mdcContextId;

					this.setMdcContextId = function (id) {
						if (mdcContextId !== id) {
							mdcContextId = id;
						}
					};

					this.clearMdcContextId = function () {
						mdcContextId = null;
					};

					this.getMdcContextId = function () {
						return mdcContextId;
					};

					this.getMdcContextIdQueryString = function () {
						if (_.isUndefined(mdcContextId)) {
							return '';
						}
						return 'mdcContextId=' + this.getMdcContextId();
					};
				}

				let gridGuid = '';
				function setGuid(guid){
					gridGuid = guid;
				}
				function resetGridHeaderTitle(headerEntity){
					let grid = platformGridAPI.grids.element('id', gridGuid);
					if(!grid){
						return;
					}

					let columns = grid.columns;
					_.forEach(columns.current, function (col){
						switch (col.field){
							case 'UppId1':
								col.name = headerEntity.NameUrb1 && headerEntity.NameUrb1 !== '' ? headerEntity.NameUrb1 : $translate.instant(col.name$tr$);
								break;
							case 'UppId2':
								col.name = headerEntity.NameUrb2&& headerEntity.NameUrb2 !== '' ? headerEntity.NameUrb2 : $translate.instant(col.name$tr$);
								break;
							case 'UppId3':
								col.name = headerEntity.NameUrb3 && headerEntity.NameUrb3 !== '' ? headerEntity.NameUrb3 : $translate.instant(col.name$tr$);
								break;
							case 'UppId4':
								col.name = headerEntity.NameUrb4 && headerEntity.NameUrb4 !== '' ? headerEntity.NameUrb4 : $translate.instant(col.name$tr$);
								break;
							case 'UppId5':
								col.name = headerEntity.NameUrb5 && headerEntity.NameUrb5 !== '' ? headerEntity.NameUrb5 : $translate.instant(col.name$tr$);
								break;
							case 'UppId6':
								col.name = headerEntity.NameUrb6 && headerEntity.NameUrb6 !== '' ? headerEntity.NameUrb6 : $translate.instant(col.name$tr$);
								break;
						}
					});

					platformGridAPI.columns.configuration(gridGuid, grid.columns.current);
					platformGridAPI.grids.resize(gridGuid);
				}

				return service;
			}]);
})(angular);
