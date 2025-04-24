
(function () {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	estimateMainModule.factory('estimateAllowanceMarkUp2CostCodeAssignmentGridService', ['_','$http','$timeout','$injector','platformTranslateService','PlatformMessenger','estimateRuleComplexLookupCommonService','platformDataServiceFactory','platformGridAPI','cloudCommonGridService','estimateMdcAllowanceAreaService',
		function (_,$http,$timeout,$injector,platformTranslateService,PlatformMessenger,estimateRuleComplexLookupCommonService,platformDataServiceFactory,platformGridAPI,cloudCommonGridService,estimateMdcAllowanceAreaService) {

			let service = {};
			let container = {};
			let allCostCodes = [];
			let estimateCCCostCodeTypes = [];
			let gridId = null,
				itemsToDelete = [],
				itemsToSave = [];

			let context = {
				treeOptions:{
					parentProp: 'CostCodeParentFk',
					childProp: 'CostCodes'
				},
				IdProperty: 'CostCodeMainId'
			};

			let serviceOption;
			serviceOption = {
				hierarchicalLeafItem: {
					module: moduleName,
					serviceName: 'estimateAllowanceMarkUp2CostCodeAssignmentGridService',
					entityNameTranslationID: 'estimate.main.advancedAllowance',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/mdcAllmarkup2costcode/', // adapt to web API controller
						endRead: 'GetMarkup2CostCodeByAllowancFk',
						usePostForRead: true,
						initReadData: function (readData) {
							let allowance = $injector.get('estimateAllowanceDialogDataService').getCurrentAllowance();
							if(allowance.AllowanceTypeFk === 3){
								let mdcAllowanceAreaFk = estimateMdcAllowanceAreaService.getSelected();
								readData.MdcAllowanceAreaFk = mdcAllowanceAreaFk ? mdcAllowanceAreaFk.Id : -1;
							}else {
								readData.MdcAllowanceAreaFk = -1;
							}
							readData.MdcAllowanceFk = allowance.Id;
							readData.MdcContextId = allowance.MasterContextFk;
							return readData;
						}
					},
					dataProcessor: [],
					presenter: {
						tree: {
							parentProp: 'CostCodeParentFk',
							childProp: 'CostCodes',
							isInitialSorted: true,
							incorporateDataRead: function (readData, data) {
								return service.incorporateDataRead(readData, data);
							}
						}
					},
					entityRole: {
						node: {
							itemName: 'mdcAllowanceMarkUp2CostCode',
							parentService: estimateMdcAllowanceAreaService
						}
					},
					entitySelection: {supportsMultiSelection: true},
					actions: {delete:true}
				}
			};

			container = platformDataServiceFactory.createNewComplete(serviceOption);
			container.data.provideUpdateData = provideUpdateData;
			angular.extend(service, container.service);

			angular.extend(service, {
				listLoaded: new PlatformMessenger(),
				// registerSelectionChanged: registerSelectionChanged,
				// unregisterSelectionChanged: unregisterSelectionChanged,
				// getTree:getTree,
				setGridId:setGridId,
				getGridId:getGridId,
				addItem:addItem,
				// setDataList:setDataList,
				getItemsToSave : getItemsToSave,
				setItemToSave: setItemToSave,
				getItemsToDelete : getItemsToDelete,
				setItemsToDelete : setItemsToDelete,
				updateMajorCostCode:updateMajorCostCode,
				provideUpdateData: provideUpdateData,
				clearData:clearData,
				getEstimateCCCostCodeTypes:getEstimateCCCostCodeTypes,
				setEstimateCCCostCodeTypes:setEstimateCCCostCodeTypes,
				filterEstimateCCCostCodes:filterEstimateCCCostCodes,
				updateItemToSave: updateItemToSave,
				refreshTreeAfterDeleteArea: refreshTreeAfterDeleteArea,
				selectionChanged : new PlatformMessenger(),
				onUpdateList: new PlatformMessenger(),
			});

			service.incorporateDataRead = function incorporateDataRead(readData, data) {
				readData.dtos = _.orderBy(readData.dtos,'CostCode', 'asc');
				let allowance = $injector.get('estimateAllowanceDialogDataService').getCurrentAllowance();
				if(allowance.AllowanceTypeFk === 3){
					let allowanceArea = estimateMdcAllowanceAreaService.getSelected();
					let allowanceAreaMarkCostCodeToDelete = _.filter(itemsToDelete,function (item) {
						return item.MdcAllowanceAreaFk === allowanceArea.Id;
					});
					_.forEach(allowanceAreaMarkCostCodeToDelete,function (toDelete) {
						readData.dtos = _.filter(readData.dtos,function (item) {
							return toDelete.Id !== item.Id;
						});
					});
					processAreaMarkCostCode(readData.dtos,allowanceArea);
				}
				// addItem(readData.dtos);
				let dtos = $injector.get('basicsLookupdataTreeHelper').buildTree(angular.copy(readData.dtos), context);
				dtos = _.orderBy(dtos,'CostCode', 'asc');
				let result = container.data.handleReadSucceeded(dtos, data);
				// if(gridId){
				//    platformGridAPI.rows.collapseAllNodes(gridId);
				// }
				return result;
			};

			function processAreaMarkCostCode(data,allowanceArea) {
				let allowanceAreaMarkCostCode = _.filter(itemsToSave,function (item) {
					return item.MdcAllowanceAreaFk === allowanceArea.Id;
				});

				_.forEach(allowanceAreaMarkCostCode,function (item) {
					let cd =_.find(data, {'Id': item.Id});
					if(!cd){
						data.push(item);
					}else {
						angular.extend(cd,item);
					}
				});
			}

			function provideUpdateData(data) {
				if(data && data.AllowanceMarkUp2CostCode){
					data.AllowanceMarkUp2CostCode =[];
					data.EntitiesCount =0;
				}
			}

			function setGridId(value) {
				gridId = value;
			}
			function getGridId() {
				return gridId;
			}

			// function registerListLoaded(callBackFn) {
			//  service.listLoaded.register(callBackFn);
			// }
			//
			// function unregisterListLoaded(callBackFn) {
			//  service.listLoaded.unregister(callBackFn);
			// }

			// function setDataList(items) {
			//  if (Array.isArray(items)) {
			//    data = items;
			//  } else {
			//    data = [];
			//  }
			//  return items;
			// }


			function clearData() {
				container.data.itemList = [];
				// data = [];
				itemsToSave =[];
				itemsToDelete =[];
				allCostCodes =[];
			}
			// function getTree(costCodes) {
			//    let context = {
			//       treeOptions:{
			//          parentProp: 'CostCodeParentFk',
			//          childProp: 'CostCodes'
			//    },
			//    IdProperty: 'CostCodeMainId'
			//    };
			//
			//    let tree = $injector.get('basicsLookupdataTreeHelper').buildTree(angular.copy(costCodes ? costCodes : data), context);
			//    tree = _.orderBy(tree,'CostCode', 'asc');
			//    return tree;
			// }

			function setItemToSave(items, isAreaItems) {
				if (!itemsToSave.length){
					_.forEach(items,function (d) {
						itemsToSave.push(d);
					});
					return;
				}

				_.forEach(items,function (d) {
					let mathCC = _.find(itemsToSave,function (item) {
						if(!isAreaItems){
							return item.MdcCostCodeFk === d.MdcCostCodeFk;
						}else {
							return item.MdcCostCodeFk === d.MdcCostCodeFk && item.MdcAllowanceAreaFk === d.MdcAllowanceAreaFk;
						}
					});
					if(!mathCC){
						itemsToSave.push(d);

						itemsToDelete = _.filter(itemsToDelete,function (de) {
							return de.Id !== d.Id;
						});
					}
				});
			}

			function findParentNode(allCostCodes,currentCostCode,markup2CostcodeFks)
			{
				if(currentCostCode && !currentCostCode.CostCodeParentFk){
					return null;
				}

				if (markup2CostcodeFks.indexOf(currentCostCode.CostCodeParentFk)>=0){
					let parentNode1 = _.find(allCostCodes,{'Id':currentCostCode.CostCodeParentFk});
					return parentNode1;
				}

				let parentNode = _.find(allCostCodes,{'Id':currentCostCode.CostCodeParentFk});
				if(!parentNode){
					return null;
				}
				return findParentNode(allCostCodes,parentNode,markup2CostcodeFks);
			}

			function addItem(newItems,fromChoose,isAreaItems){
				let data = container.data.itemList;

				let updateData = [];
				_.forEach(newItems,function (item) {
					let cd =_.find(data, {'CostCodeMainId': item.CostCodeMainId});
					if(!cd){
						container.data.itemList.push(item);
						updateData.push(item);
					}
				});

				if(!updateData.length){
					service.gridRefresh();
					if(gridId){
						platformGridAPI.rows.expandAllNodes(gridId);
					}
					service.setSelected(_.find(container.data.itemList,{CostCodeMainId:newItems[0].CostCodeMainId}));
					return;
				}

				_.forEach(data,function (d) {
					d.CostCodes = null;
				});

				if(fromChoose) {
					if(!allCostCodes.length){
						loadCostCode().then(function () {
							updateTree(data);
							refreshTree(data);
						});
					}else {
						updateTree(data);
						refreshTree(data);
					}
				}else {
					refreshTree(data);
				}
				// data = _.orderBy(data,'CostCode', 'asc');
				service.setItemToSave(updateData,isAreaItems);

				service.setSelected(_.find(container.data.itemList,{Id:newItems[0].Id}));
			}

			function updateMajorCostCode(mdcAllowanceEntity) {
				let parentCostCodes = _.filter(container.data.itemList,{'CostCodeParentFk' : null});
				let parentFks = [];
				if(parentCostCodes.length > 0){
					_.forEach(parentCostCodes,function (d) {
						parentFks.push(d.CostCodeMainId);
					});
				}

				let httpRoute = globals.webApiBaseUrl + 'estimate/main/mdcAllmarkup2costcode/updateMajorCostCode',
					postData = {
						MdcAllowanceFk: mdcAllowanceEntity.Id,
						MdcContextId: mdcAllowanceEntity.MasterContextFk,
						MarkupAm: mdcAllowanceEntity.MarkupAm,
						MarkupGa: mdcAllowanceEntity.MarkupGa,
						MarkupRp: mdcAllowanceEntity.MarkupRp,
						MdcAllowanceAreaFk: mdcAllowanceEntity.isAreaCostCode ? $injector.get('estimateMdcAllowanceAreaService').getSelected().Id : -1,
						estMarkupCostCodeIds:parentFks.length > 0 ? parentFks : null};

				return $http.post(httpRoute, postData).then(function (response) {
					let items = response.data;
					if(items && items.length){
						_.forEach(items,function (d) {
							d.CostCodeMainId = d.Id;
						});
						addItem(items,false,mdcAllowanceEntity.isAreaCostCode);
						// service.onUpdateList.fire(container.data.itemList);
					}
					return items;
				});
			}

			// function registerSelectionChanged(callBackFn) {
			//  service.selectionChanged.register(callBackFn);
			// }
			//
			// function unregisterSelectionChanged(callBackFn) {
			//  service.selectionChanged.unregister(callBackFn);
			// }

			service.getList = function getList(){
				let input = [];
				let grid = platformGridAPI.grids.element('id', gridId);
				if(grid) {
					let rows = grid.dataView.getRows();
					cloudCommonGridService.flatten(rows, input, 'CostCodes');
				}
				return input;
			};

			function getItemsToSave(){
				return itemsToSave.length ? itemsToSave : null;
			}

			function getItemsToDelete(){
				return itemsToDelete.length ? itemsToDelete : null;
			}

			function setItemsToDelete(items){
				itemsToDelete = itemsToDelete ? itemsToDelete : [];
				itemsToDelete = itemsToDelete.concat(items);

				_.forEach(items,function (d1) {
					itemsToSave = _.filter(itemsToSave,function (d2) {
						return d2.Id !== d1.Id;
					});

					container.data.itemList = _.filter(container.data.itemList,function (d2) {
						return d2.Id !== d1.Id;
					});
				});
			}

			function loadCostCode() {
				let allowance = $injector.get('estimateAllowanceDialogDataService').getCurrentAllowance();
				let url = globals.webApiBaseUrl + 'basics/costcodes/tree?mdcContextId=' +  allowance.MasterContextFk;
				return $http.get(url).then(function(result){
					cloudCommonGridService.flatten(result.data,allCostCodes,'CostCodes');
					return allCostCodes;
				});
			}

			function  updateTree(data) {
				// update the data tree
				let costCodeFks = _.map(data,'MdcCostCodeFk');
				_.forEach(data,function (d) {
					let cd = _.find(allCostCodes,{'Id':d.MdcCostCodeFk});
					if(cd) {
						d.CostCodeMainId = cd.Id;
						d.CostCode = cd.Code;

						let parentNode = findParentNode (allCostCodes, cd, costCodeFks);
						if (parentNode) {
							d.CostCodeParentFk = parentNode.Id;
						} else {
							let parentId = _.find(costCodeFks,function (item) {
								return item === d.CostCodeParentFk;
							});
							d.CostCodeParentFk = cd.CostCodeParentFk ? (parentId ? parentId : null) : null;
						}
					}
				});
			}

			function deleteEntities(entities) {

				if(!allCostCodes.length){
					$timeout(function () {
						loadCostCode().then(function () {
							_.forEach(container.data.itemList,function (d) {
								d.CostCodes = null;
							});
							setItemsToDelete(entities);
							updateTree(container.data.itemList);
							refreshTree(container.data.itemList);
						});
					}, 1000);
				}else {
					_.forEach(container.data.itemList,function (d) {
						d.CostCodes = null;
					});
					setItemsToDelete (entities);
					updateTree(container.data.itemList);
					refreshTree(container.data.itemList);
				}
			}

			// service.registerListLoaded = registerListLoaded;
			// service.unregisterListLoaded= unregisterListLoaded;
			service.deleteEntities = deleteEntities;
			// service.getTree = getTree;

			service.setAllCostCodes = function setAllCostCodes(items){
				allCostCodes = angular.copy(items);
			};
			service.getAllCostCodes = function getAllCostCodes(){
				return allCostCodes;
			};

			function refreshTree(data) {
				data = _.orderBy(data,'CostCode', 'asc');

				container.data.itemTree = [];
				container.data.itemTree =  $injector.get('basicsLookupdataTreeHelper').buildTree(data, context);
				service.prepareItems(container.data.itemTree);

				container.data.listLoaded.fire(null, container.data.itemList);
			}

			function refreshTreeAfterDeleteArea() {
				container.data.itemTree = [];
				container.data.itemList = [];
				container.data.listLoaded.fire(null, container.data.itemList);
			}
			// service.refreshGrid = function refreshGrid() {
			//    service.listLoaded.fire();
			// };

			service.updateColumns = function(columnname,value){
				let grid = platformGridAPI.grids.element('id', gridId);
				if(grid) {
					let rows = grid.dataView.getRows();

					let input = [];
					cloudCommonGridService.flatten(rows, input, 'CostCodes');
					_.forEach(input,function (d) {
						d[columnname] = value;
					});
					container.data.itemList = input;
				}
				service.refreshGrid();
			};

			service.prepareItems =  function prepareItems(nodes, parentNode, isGetList) {
				let n;
				let level = 0;
				if (parentNode) {
					level = parentNode.nodeInfo ? parentNode.nodeInfo.level + 1 : 0;
				}
				for (let i = 0; i < nodes.length; i++) {
					n = nodes[i];
					if (n.nodeInfo === undefined) {
						let nodeInfo = {
							level: level,
							collapsed: !isGetList,
							lastElement: false,
							children: !_.isNil(n['CostCodes']) && n['CostCodes'].length
						};
						n.nodeInfo = nodeInfo;
						n.HasChildren = !_.isNil(n['CostCodes']) && n['CostCodes'].length;
					}
					if (!_.isNil(n['CostCodes']) && n['CostCodes'].length > 0) {
						n.nodeInfo.lastElement = false;
						n.nodeInfo.children = true;
						n.HasChildren = true;
						service.prepareItems(n['CostCodes'], n);
					} else {
						n.nodeInfo.lastElement = true;
						n.nodeInfo.children = false;
						n.HasChildren = false;
					}
				}
			};

			function getEstimateCCCostCodeTypes() {
				return estimateCCCostCodeTypes;
			}

			function setEstimateCCCostCodeTypes(costCodeTypes) {
				estimateCCCostCodeTypes = costCodeTypes;
			}

			function filterEstimateCCCostCodes(costCodes,isGetList) {
				let allItems = [];
				let estimateCCCostCodeTypeIds = [];
				cloudCommonGridService.flatten(costCodes,allItems,'CostCodes');

				_.forEach(service.getEstimateCCCostCodeTypes(), function (item) {
					estimateCCCostCodeTypeIds.push(item.Id);
				});

				let disabledOption = {rowCss: 'disabled', grid:{mergedCells:{selectable: false}}};
				let filterItems = _.forEach(allItems,function (item) {
					item.CostCodes = null;
					item.IsEstimateCostCode = _.includes(estimateCCCostCodeTypeIds, item.CostCodeTypeFk);
					if(!item.IsEstimateCostCode){
						item.__rt$data = _.merge(item.__rt$data || {},disabledOption);
					}
				});

				angular.forEach(filterItems, function (d) {
					d.CostCodes = [];
					if(d.CostCodeParentFk !==  null){
						let parent = _.find(filterItems, {Id : d.CostCodeParentFk});
						if(!parent){
							d.CostCodeParentFk = null;
						}
					}
				});
				filterItems = service.updateTreeOnAddDialog(filterItems);

				service.prepareItems(filterItems,false,isGetList);
				return filterItems;
			}

			service.updateTreeOnAddDialog = function updateTreeOnAddDialog(costCodes) {
				let context = {
					treeOptions:{
						parentProp: 'CostCodeParentFk',
						childProp: 'CostCodes'
					},
					IdProperty: 'Id'
				};

				let tree = $injector.get('basicsLookupdataTreeHelper').buildTree(angular.copy(costCodes ? costCodes : container.data.itemList), context);
				tree = _.orderBy(tree,'CostCode', 'asc');
				return tree;
			};

			service.getIsCreateParentNode = function (mdcCostCode) {
				if(!mdcCostCode.CostCodeParentFk){
					return false;
				}

				let costCodeFks = _.map(container.data.itemList,'MdcCostCodeFk');
				let parentNode = findParentNode (allCostCodes, mdcCostCode, costCodeFks);
				return !parentNode;
			};

			function updateItemToSave(items) {
				itemsToSave = items;
			}

			return service;
		}]
	);
})();
