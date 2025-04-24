/**
 * Created by wui on 12/22/2014.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businesspartnerMainProcurementStructureDataService',
		['platformDataServiceFactory', 'globals', '$http', 'PlatformMessenger', 'basicsProcurementstructureTreeHelper', 'businesspartnerMainHeaderDataService',
			'platformDataServiceSelectionExtension', 'basicsProcurementstructureSelectionDialog', 'businesspartnerStatusRightService', 'businesspartnerMainSubsidiaryDataService',
			/* jshint -W072 */
			function (platformDataServiceFactory, globals, $http, PlatformMessenger, basicsProcurementstructureTreeHelper, businesspartnerMainHeaderDataService,
				platformDataServiceSelectionExtension, basicsProcurementstructureSelectionDialog, businesspartnerStatusRightService, businesspartnerMainSubsidiaryDataService) {

				var treeInfo = {
					parentProp: 'PrcStructure.PrcStructureFk',
					childProp: 'ChildItems',
					idProp: 'PrcStructure.Id'
				};

				var serviceOption = {
					hierarchicalLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'businesspartnerMainProcurementStructureDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'businesspartner/main/bp2prcstructure/',
							entryRead: 'tree',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								let  requestData= service.getNoCacheBranch();
								readData.Value = requestData;
							}
						},
						presenter: {
							tree: {
								parentProp: 'PrcStructure.PrcStructureFk',
								childProp: 'ChildItems',
								incorporateDataRead: incorporateDataRead
							}
						},
						entityRole: {
							leaf: {
								itemName: 'BusinessPartner2PrcStructure',
								parentService: businesspartnerMainHeaderDataService
							}
						},
						entitySelection: {}

					}
				};
				let  DictionaryCache={};

				function incorporateDataRead(readData, data) {
					// eslint-disable-next-line no-unused-vars
					let selectedSubsidiary = businesspartnerMainSubsidiaryDataService.getSelected();
					// mix cache data and database data
					let multipleSelectBranch=service.getMultipleSelectBranch();
					if (multipleSelectBranch&&multipleSelectBranch.length>0)
					{
						for (let c=0; c<multipleSelectBranch.length; c++)
						{
							if (DictionaryCache[multipleSelectBranch[c]]) {
								for (let d=0; d<DictionaryCache[multipleSelectBranch[c]].length; d++) {
									readData.push(DictionaryCache[multipleSelectBranch[c]][d]);
								}
							}
						}
					}

					var status = businesspartnerMainHeaderDataService.getItemStatus();
					if (status.IsReadonly === true) {
						businesspartnerStatusRightService.setListDataReadonly(readData, true);
					}
					return data.handleReadSucceeded(readData, data);
				}
				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

				var service = serviceContainer.service;

				var dataEntity = serviceContainer.data;
				// MultipleSelectBranch mode not need cache
				dataEntity.usesCache = false;
				// data is add/update
				dataEntity.dataToSave = [];

				// data is delete
				dataEntity.dataToDelete = [];

				// disable create child tool.
				service.createChildItem = null;

				service.onCreateItem = new PlatformMessenger();
				// region clean cache
				businesspartnerMainHeaderDataService.updateSuccessedRegister.register(cleanCache);
				businesspartnerMainHeaderDataService.registerListLoaded(cleanCache);
				function cleanCache()
				{
					DictionaryCache={};
				}
				// endregion
				// region subsidiary select change
				businesspartnerMainSubsidiaryDataService.registerSelectionChanged(getStructureData);
				function getStructureData()
				{
					service.loadSubItemList();
				}
				// endregion
				service.createHttp = function (data) {
					return $http.post(globals.webApiBaseUrl + 'businesspartner/main/bp2prcstructure/createstructure', data);
				};

				// override.
				service.createItem = function () {
					let dialogOptions = {
						parentService: service,
						showId:false
					};
					basicsProcurementstructureSelectionDialog.showDialog(service.getPrcStructures(), dialogOptions).then(function (result) {
						service.createData(result);
					});
				};
				service.addData = function (data) {
					// region find same SubsidiaryFk
					let  dictionaryTargetTree={};
					let  dictionarySourceTree={};
					let multipleSelectBranch=service.getMultipleSelectBranch();
					for (let i=0; i<dataEntity.itemTree.length; i++)
					{
						let targetTree=dataEntity.itemTree[i];
						// target no data
						if (!dictionaryTargetTree[targetTree.BpdSubsidiaryFk]) {
							dictionaryTargetTree[targetTree.BpdSubsidiaryFk]=[];
						}
						dictionaryTargetTree[targetTree.BpdSubsidiaryFk].push(targetTree);
					}
					for (let i=0; i<data.length; i++) {
						let  sourceTree=data[i];
						if (!dictionarySourceTree[sourceTree.BpdSubsidiaryFk]) {
							dictionarySourceTree[sourceTree.BpdSubsidiaryFk]=[];
						}
						dictionarySourceTree[sourceTree.BpdSubsidiaryFk].push(sourceTree);
					}
					// endregion
					// region mix tree data
					let mixTreeData=[];
					for (let i=0; i<multipleSelectBranch.length; i++)
					{
						let subsidiaryId=multipleSelectBranch[i];
						// target have data
						if (!dictionaryTargetTree[subsidiaryId]) {
							dictionaryTargetTree[subsidiaryId]=[];
						}
						basicsProcurementstructureTreeHelper.merge(dictionaryTargetTree[subsidiaryId], dictionarySourceTree[subsidiaryId], treeInfo, function (oldItem, newItem) {
							return oldItem.PrcStructureFk === newItem.PrcStructureFk; // whether has same procurement structure or not.
						});
						mixTreeData=mixTreeData.concat(dictionaryTargetTree[subsidiaryId]);
					}
					// basicsProcurementstructureTreeHelper.merge(dataEntity.itemTree, data, treeInfo, function (oldItem, newItem) {
					// return oldItem.PrcStructureFk === newItem.PrcStructureFk && oldItem.BpdSubsidiaryFk===newItem.BpdSubsidiaryFk; // whether has same procurement structure or not.
					// });
					// endregion
					dataEntity.itemTree=mixTreeData;
					dataEntity.listLoaded.fire();
				};

				service.createData = function (result) {
					if (!angular.isArray(result.data) || result.data.length === 0) {
						return;
					}
					service.createHttp(result.data).then(function (response) {
						service.createResponeHandle(response);
					});
				};


				service.createResponeHandle=function (response){


					var mainItem = businesspartnerMainSubsidiaryDataService.getSelected();
					var selectedBpItem = businesspartnerMainHeaderDataService.getSelected();
					let multipleSelectBranch=service.getMultipleSelectBranch();
					let dictionaryFlattenTree = getFlattenTreeDictionary();
					basicsProcurementstructureTreeHelper.iterate(response.data, treeInfo, function (newItem) {

						if (multipleSelectBranch.length>1) {
							// someone have
							if (dictionaryFlattenTree[newItem.PrcStructureFk])
							{
								let data=dictionaryFlattenTree[newItem.PrcStructureFk];
								for (let i = 0; i < multipleSelectBranch.length; i++) {
									let findData=data.find(e=>e === multipleSelectBranch[i]);
									if (!findData)
									{
										newItem.BpdSubsidiaryFk = multipleSelectBranch[i];
										data.push(multipleSelectBranch[i]);
										break;
									}
								}
							}
							// all no have,first create
							else
							{
								dictionaryFlattenTree[newItem.PrcStructureFk]=[multipleSelectBranch[0]];
								newItem.BpdSubsidiaryFk = multipleSelectBranch[0];
							}
						}
						else
						{
							newItem.BpdSubsidiaryFk = mainItem.Id;
						}
						newItem.BusinessPartnerFk = selectedBpItem.Id;
						// newItem.BpdSubsidiaryFk = mainItem.Id;
						newItem.IsNew = true;

						if (!angular.isArray(newItem.ChildItems)) {
							newItem.ChildItems = [];
						}

						if(!newItem.__rt$data) {
							newItem.__rt$data = {};
						}
						dataEntity.itemList.push(newItem);
					});

					service.addData(response.data);

					// mark new item to save.
					basicsProcurementstructureTreeHelper.iterate(dataEntity.itemTree, treeInfo, function (item) {
						if (item.IsNew) {
							service.markItemAsModified(item);
							delete item.IsNew;
						}
					});
				};

				service.getPrcStructures = function () {
					var treeInfo = {
						childProp: 'ChildItems'
					};
					let arraySelectBranches = service.getMultipleSelectBranch();
					let dictionaryFlattenTree = {};
					let treeData = dataEntity.itemTree;
					let finalTreeData = [];
					if (arraySelectBranches.length > 1) {
						flattenTreeToDictionary(treeData, dictionaryFlattenTree);
						// show data don't need to clean,no show data will clean
						let showStructureIds = getShowData(arraySelectBranches, dictionaryFlattenTree);
						if (showStructureIds && showStructureIds.length > 0) {
							finalTreeData = angular.copy(treeData);
							flattenTreeToClean(finalTreeData, showStructureIds);
						} else {
							finalTreeData = treeData;
						}
					} else {
						finalTreeData = treeData;
					}
					var mapFn = function (oldItem) {
						/** @namespace oldItem.PrcStructure */
						return oldItem.PrcStructure;
					};
					return basicsProcurementstructureTreeHelper.map(finalTreeData, treeInfo, mapFn);
				};
				// region multipleSelect function
				service.saveCache=function() {
					let nowAllSelectStructure = service.getTree();
					if (nowAllSelectStructure&&nowAllSelectStructure.length>0) {
						for (let c = 0; c < nowAllSelectStructure.length; c++) {
							let dataSelectStructure=nowAllSelectStructure[c];
							DictionaryCache[dataSelectStructure.BpdSubsidiaryFk]=[];
						}
						for (let i = 0; i < nowAllSelectStructure.length; i++) {
							let dataSelectStructure=nowAllSelectStructure[i];
							if (DictionaryCache[dataSelectStructure.BpdSubsidiaryFk]) {
								DictionaryCache[dataSelectStructure.BpdSubsidiaryFk].push(dataSelectStructure);
							}
						}
					}
				};
				service.getRebuildSelectItems=function(selectItems) {
					let multipleSelectBranch = service.getMultipleSelectBranch();
					if (multipleSelectBranch.length <=1) {
						return selectItems;
					}
					let dictionaryFlattenTree = getFlattenTreeDictionary();
					// delete superfluous selectItems
					for (let b = 0; b < selectItems.length; b++) {
						let selectItem=selectItems[b];
						let deleteSwitch = false;
						// check if all  item is had been selected?
						let checkResult = checkSelect(selectItem);
						if (!checkResult) {
							deleteSwitch = true;
						}
						// check if select number  exceeds the limit
						if (dictionaryFlattenTree[selectItem.Id] && multipleSelectBranch.length <= dictionaryFlattenTree[selectItem.Id].length) {
							deleteSwitch = true;
						}
						if (deleteSwitch) {
							selectItems.splice(b, 1);
							b--;
						}
					}
					// need add count
					let needAddItems = [];
					for (let i = 0; i < selectItems.length; i++) {
						let selectItem=selectItems[i];
						// count how many selectItem need to add
						if (!dictionaryFlattenTree[selectItem.Id]) {
							needAddItems.push(selectItem.Id);
						} else if (multipleSelectBranch.length > dictionaryFlattenTree[selectItem.Id].length) {
							needAddItems.push(selectItem.Id);
						}
					}
					// push count
					let pushLimit = 0;
					for (let d = 0; d < needAddItems.length; d++) {
						let needAddItem=needAddItems[d];
						if (dictionaryFlattenTree[needAddItem]) {
							pushLimit = multipleSelectBranch.length - dictionaryFlattenTree[needAddItem].length - 1;
						} else {
							pushLimit = multipleSelectBranch.length - 1;
						}

						let data = selectItems.find(e => e.Id === needAddItem);
						for (let c = 0; c < pushLimit; c++) {
							selectItems.push(data);
						}
					}
					return selectItems;
				};
				function checkSelect(selectItem) {
					if (selectItem.HasChildren) {
						for (let i = 0; i < selectItem.ChildItems.length; i++) {
							let result = checkSelect(selectItem.ChildItems[i]);
							if (result) {
								return true;
							}
						}
					}
					if (selectItem.IsSelected!==false) {
						return true;
					}
					return false;
				}
				function flattenTreeToClean(finalTreeDatas,showStructureIds) {
					for (let i=0; i < finalTreeDatas.length; i++) {
						let finalTreeData=finalTreeDatas[i];
						if (finalTreeData.HasChildren) {
							flattenTreeToClean(finalTreeData.ChildItems, showStructureIds);
						}
						else {
							for (let c=0; c < showStructureIds.length; c++) {
								if (finalTreeData.PrcStructureFk === +showStructureIds[c]) {
									finalTreeDatas.splice(i, 1);
									i--;
									if (i<0) {
										break;
									}
								}
							}
						}
					}
				}
				function deleteCleanCache(deleteDatas,dictionaryCache) {
					for (let i = 0; i < deleteDatas.length; i++) {
						let subsidiaryFk = deleteDatas[i].BpdSubsidiaryFk;
						if (dictionaryCache[subsidiaryFk] && dictionaryCache[subsidiaryFk].length > 0) {
							for (let c = 0; c < dictionaryCache[subsidiaryFk].length; c++) {
								if (deleteDatas[i].Id === dictionaryCache[subsidiaryFk][c].Id) {
									dictionaryCache[subsidiaryFk].splice(c, 1);
									c--;
								}
							}
						}
					}
				}
				function flattenTreeToDictionary(originTreeDatas,dictionaryFlattenTree) {
					for (let i = 0; i < originTreeDatas.length; i++) {
						let originTreeData=originTreeDatas[i];
						if (originTreeData.HasChildren) {
							flattenTreeToDictionary(originTreeData.ChildItems, dictionaryFlattenTree);
						}
						// have existed
						if (dictionaryFlattenTree[originTreeData.PrcStructureFk]) {
							let index = _.indexOf(dictionaryFlattenTree[originTreeData.PrcStructureFk], originTreeData.BpdSubsidiaryFk);
							if (index < 0) {
								dictionaryFlattenTree[originTreeData.PrcStructureFk].push(originTreeData.BpdSubsidiaryFk);
							}
						} else {
							dictionaryFlattenTree[originTreeData.PrcStructureFk] = [originTreeData.BpdSubsidiaryFk];
						}
					}
				}
				service.getMultipleSelectBranch= function () {
					let  data = businesspartnerMainSubsidiaryDataService.getSelectedEntities();
					let ids=[];
					if(data) {
						_.forEach(data, function (item) {
							ids.push(item.Id);
						});
					}
					return ids;
				};
				service.getNoCacheBranch= function () {
					let multipleSelectBranchIds=service.getMultipleSelectBranch();
					for (let c=0; c<multipleSelectBranchIds.length; c++)
					{
						let multipleSelectBranchId=multipleSelectBranchIds[c];
						if (DictionaryCache[multipleSelectBranchId]){
							multipleSelectBranchIds.splice(c,1);
							c--;
						}
					}
					return multipleSelectBranchIds;
				};

				function getFlattenTreeDictionary()
				{
					let dictionaryFlattenTree = {};
					let originTreeDatas = dataEntity.itemTree;
					flattenTreeToDictionary(originTreeDatas,dictionaryFlattenTree);
					return dictionaryFlattenTree;
				}
				//endregion
				function getShowData(arraySelectBranches,dictionaryFlattenTree) {
					let showStructureIds = [];
					for (let key in dictionaryFlattenTree) {
						if (dictionaryFlattenTree[key].length !== arraySelectBranches.length) {
							showStructureIds.push(key);
						}
					}
					return showStructureIds;
				}
				function getParentNode(selectedItemId) {
					var parent = null;

					function loopToGetParentNode(node) {
						if (node.HasChildren) {
							angular.forEach(node.ChildItems, function (itemNode) {
								if (itemNode && itemNode.Id === selectedItemId) {
									parent = node;
								}

								loopToGetParentNode(itemNode, selectedItemId);
							});
						}
					}

					var tree = service.getTree();
					angular.forEach(tree, function (itemNode) {
						if (itemNode && itemNode.Id === selectedItemId) {
							return;
						}

						loopToGetParentNode(itemNode, selectedItemId);
					});

					return parent;
				}

				var oldDeleteEntities = serviceContainer.data.deleteEntities;
				serviceContainer.data.deleteEntities = function onDeleteInHierarchy(entities, data) {

					var entityList = [];
					_.forEach(entities, function (entity) {
						var parentNode = getParentNode(entity.Id);

						if (parentNode !== null && parentNode.ChildItems) {
							var childItems = [];
							angular.forEach(parentNode.ChildItems, function (itemNode) {
								if (itemNode && itemNode.Id !== entity.Id) {
									childItems.push(itemNode);
								}
							});
							if (childItems.length > 0) {
								parentNode.ChildItems = childItems;
							} else {
								parentNode.ChildItems = null;
								parentNode.HasChildren = false;
							}
						}

						deleteChildren(entity, entityList);
					});
					oldDeleteEntities(entityList, data);
					// region delete cache data
					deleteCleanCache(entityList,DictionaryCache);
					// endregion

					function deleteChildren(child, entityList) {
						entityList.push(child);
						angular.forEach(child[data.treePresOpt.childProp], function (i) {
							deleteChildren(i, entityList);
						});
					}

					// the result: data.itemIree's node's childItems did update, but node's prc-structure's childItems dit not update.
					// var treeData = dataEntity.itemTree;
				};

				var canCreate = serviceContainer.service.canCreate;
				serviceContainer.service.canCreate = function () {
					return canCreate() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
				};

				var canDelete = serviceContainer.service.canDelete;
				serviceContainer.service.canDelete = function () {
					return canDelete() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
				};

				service.reloadData = function () {
					serviceContainer.data.doClearModifications(null, serviceContainer.data);
					return serviceContainer.data.loadSubItemList.apply(this, arguments);
				};

				return service;
			}
		]);

})(angular);