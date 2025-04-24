
(function () {
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	estimateMainModule.factory('estimateMdcAllowanceAreaService', ['_','$http','globals','$injector','platformDataServiceFactory',
		'platformRuntimeDataService','platformGridAPI','$translate','platformModalService',
		function (_,$http,globals,$injector,platformDataServiceFactory,
			platformRuntimeDataService,platformGridAPI,$translate,platformModalService) {

			let service = {};
			let container = {};
			let gridId = null;
			let normalAreaType = 1;
			let normalAreaRestType = 2;
			let gcAreaType = 3;
			let gcAreaRestType = 4;
			let normalAreaParentFk = -3;
			let gcAreaParentFk = -5;
			let mdcAllArea2GcAreaValues = [];
			let initColumnConfiguration = [];
			let itemsToDelete = [],
				itemsToSave = [],
				valuesToSave= [],
				valuesToDelete =[];


			let serviceOption;
			serviceOption = {
				hierarchicalRootItem: {
					module: moduleName,
					serviceName: 'estimateMdcAllowanceAreaService',
					entityNameTranslationID: 'estimate.main.mdcAllowanceArea',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/mdcAllowanceArea/', // adapt to web API controller
						endRead: 'getList',
						usePostForRead: true,
						initReadData: function (readData) {
							let allowance = $injector.get('estimateAllowanceDialogDataService').getCurrentAllowance();
							readData.MdcAllowanceFk = allowance.Id;
							readData.IsExistAllowance = allowance.Version > 0;
							return readData;
						}
					},
					dataProcessor: [],
					presenter: {
						tree: {
							parentProp: 'AreaParentFk',
							childProp: 'Areas',
							isInitialSorted: true,
							incorporateDataRead: function (readData, data) {
								return service.incorporateDataRead(readData, data);
							}
						}
					},
					entityRole: {
						root: {
							itemName: 'MdcAllowanceArea',
							moduleName: 'estimate.main'
						}},
					entitySelection: {supportsMultiSelection: true},
					modification: {multi: {}},
					actions: {delete:true}
				}
			};

			container = platformDataServiceFactory.createNewComplete(serviceOption);
			angular.extend(service, container.service);

			angular.extend(service, {
				setGridId:setGridId,
				getGridId:getGridId,
				addItem: addItem,
				getItemsToSave : getItemsToSave,
				getValuesToSave: getValuesToSave,
				getItemsToDelete : getItemsToDelete,
				getValuesToDelete: getValuesToDelete,
				hasError: hasError
			});

			function setGridId(value) {
				gridId = value;
			}
			function getGridId() {
				return gridId;
			}

			service.incorporateDataRead = function incorporateDataRead(readData, data) {
				let mdcAllowanceAreas = readData.MdcAllowanceAreaDtos;
				let mdcAllowanceGcAreas = readData.MdcAllowanceGcAreaDtos;
				mdcAllArea2GcAreaValues = readData.MdcAllArea2GcAreaValueDtos;
				let dataItems = readData.DefaultLevel;
				processDefaultLevel(dataItems);
				processData(mdcAllowanceAreas,mdcAllowanceGcAreas,mdcAllArea2GcAreaValues,dataItems);

				processColumnReadOnly(dataItems, mdcAllowanceAreas[0]);
				let dtos = updateTree(dataItems,true);
				service.refreshColumns(service.getGridId(),true,dataItems);

				if(!readData.IsExistAllowance){
					let areaRest = _.find(itemsToSave,function (item) {
						return item.AreaType === 2;
					});

					let gcRest = _.find(itemsToSave,function (item) {
						return item.AreaType === 4;
					});

					if(areaRest && gcRest){
						valuesToSave = _.filter(valuesToSave,function (item) {
							return item.MdcAllowanceAreaFk !== areaRest.Id && item.MdcAllowanceGcAreaFk !== gcRest.Id;
						});

						itemsToSave = _.filter(itemsToSave,function (item) {
							return item.Id !== areaRest.Id && item.Id !== gcRest.Id;
						});
					}

					_.forEach(mdcAllowanceAreas,function (item) {
						setItemToSave(item);
					});

					_.forEach(mdcAllowanceGcAreas,function (item) {
						setItemToSave(item);
					});

					_.forEach(readData.MdcAllArea2GcAreaValueDtos,function (item) {
						setValueToSave(item);
					});
				}
				let result = container.data.handleReadSucceeded(dtos, data);
				// service.setSelected(dataItems[1]);
				return result;
			};

			function processDefaultLevel(DefaultLevel) {
				_.forEach(DefaultLevel,function (item) {
					if(item.Id === -2){
						item.Code = $translate.instant('estimate.main.root');
					}else if(item.Id === -3){
						item.Code = $translate.instant('estimate.main.areaCode.allowanceAreaCode');
					}else if(item.Id === -5){
						item.Code = $translate.instant('estimate.main.areaCode.gcAreaCode');
					}
					item.AreaParentFk = item.Id === -2 ? null : -2;
				});
			}

			function processData(mdcAllowanceAreas, mdcAllowanceGcAreas, mdcAllArea2GcAreaValues, dataItems) {
				_.forEach(mdcAllowanceGcAreas,function (gcItem) {
					if(gcItem.AreaType === gcAreaRestType){
						gcItem.Code = $translate.instant('estimate.main.areaCode.restCode');
					}
					gcItem.AreaParentFk = gcAreaParentFk;
					dataItems.push(gcItem);
					_.forEach(mdcAllowanceAreas, function (item) {
						if(item.AreaType === normalAreaRestType){
							item.Code = $translate.instant('estimate.main.areaCode.restCode');
						}
						item.AreaParentFk = normalAreaParentFk;
						let data = _.find(mdcAllArea2GcAreaValues, function (allowanceValue) {
							return allowanceValue.MdcAllowanceAreaFk === item.Id && allowanceValue.MdcAllowanceGcAreaFk === gcItem.Id;
						});
						if(data){
							if(gcItem.AreaType === gcAreaRestType){
								item.Rest = data.Value;
								item.GcRestId = gcItem.Id;
							}else {
								let column = 'Col_'+gcItem.Id;
								item[column] = data.Value;
							}
						}
						dataItems.push(item);
					});
				});
				_.sortBy (dataItems, ['AreaType', 'Id']);
			}

			function processColumnReadOnly(data, normalArea){
				let allFieldsReadOnly = [];
				let gcFieldsReadOnly = [];
				_.forOwn(normalArea, function (value, key) {
					if (key !== 'IsReadonly') {
						let field = {field: key, readonly: true};
						allFieldsReadOnly.push(field);
						if(key !== 'Code'){
							gcFieldsReadOnly.push(field);
						}
					}
				});

				_.forEach(data,function (item) {
					item.oldCode = item.Code;
					if(item.Id < 0 || item.AreaType === gcAreaRestType || item.AreaType === normalAreaRestType){
						platformRuntimeDataService.readonly(item, allFieldsReadOnly);
					} else if(item.AreaType === gcAreaType){
						platformRuntimeDataService.readonly(item, gcFieldsReadOnly);
					}
				});
			}

			function addItem() {
				let selected = service.getSelected();
				let areaFks;
				if(selected.Id === normalAreaParentFk || selected.AreaType < 3){
					areaFks = getAreasFk(gcAreaParentFk);
				}else {
					areaFks = getAreasFk(normalAreaParentFk);
				}
				getCreateEntities(areaFks, selected.AreaType,selected.MdcAllowanceFk);
			}

			function getAreasFk(subTreeId) {
				let tree = _.find(service.getTree(),function (item) {
					return  item.Id === -2;
				});
				if(!tree){
					return;
				}
				let gcTree = _.find(tree.Areas,function (item) {
					return item.Id === subTreeId;
				});
				let gcAreas = gcTree.Areas;
				let gcAreasFks = [];
				_.forEach(gcAreas,function (item) {
					gcAreasFks.push(item.Id);
				});
				return gcAreasFks;
			}

			function getCreateEntities(mdcAllowanceAreaFks, areaType, MdcAllowanceFk) {
				areaType = areaType < 3 ? normalAreaType : gcAreaType;
				let rest = areaType < 3 ? {Id : -1} : _.find(service.getList(),{AreaType: 2});
				let creationData = {
					MdcAllowanceFk: MdcAllowanceFk,
					mdcAllowanceAreaFks: mdcAllowanceAreaFks,
					AreaType: areaType,
					NormalAllowanceAreaRestFk: areaType === gcAreaType ? rest.Id : -1
				};
				$http.post(globals.webApiBaseUrl + 'estimate/main/mdcAllowanceArea/create', creationData)
					.then(function (response) {
						let mdcAllowanceAreas = response.data.MdcAllowanceAreaDtos;
						let mdcAllowanceGcAreas = response.data.MdcAllowanceGcAreaDtos;

						let allArea2GcAreaValues = response.data.MdcAllArea2GcAreaValueDtos;
						_.forEach(allArea2GcAreaValues,function (item) {
							mdcAllArea2GcAreaValues.push(item);
							setValueToSave(item);
						});

						let data = service.getList();
						let isCreateNormalData = areaType < 3;

						let areaItems = _.filter(data,function (item) {
							return isCreateNormalData ? (item.AreaType > 2 && item.Id > 0) : (item.AreaType < 3 && item.Id > 0);
						});
						let createAllowanceArea = isCreateNormalData ? mdcAllowanceAreas : mdcAllowanceGcAreas;
						_.forEach(createAllowanceArea,function (item) {
							item.AreaParentFk = isCreateNormalData ? normalAreaParentFk : gcAreaParentFk;
							data.push(item);
							_.forEach(areaItems,function (areaItem) {
								if(isCreateNormalData){
									if(areaItem.AreaType === gcAreaRestType){
										item.Rest = 0;
										item.GcRestId = areaItem.Id;
									}else {
										let column = 'Col_'+areaItem.Id;
										item[column] = 0;
									}
								}else {
									let column = 'Col_'+item.Id;
									if(areaItem.AreaType === normalAreaRestType){
										areaItem[column] = 100;
									}else {
										areaItem[column] = 0;
									}
								}
							});
						});

						let createData = !isCreateNormalData ? mdcAllowanceGcAreas[0] : mdcAllowanceAreas[0];
						if(!isCreateNormalData){
							let normalAreaData = _.find(data,function (item) {
								return item.Id > 0 && item.AreaType === normalAreaType;
							});
							processColumnReadOnly(data, normalAreaData);
						}

						updateTree(data);
						let validataResult = service.validateCode(createData,createData.Code,'Code');
						if(!isCreateNormalData && validataResult){
							let grid = service.getGridId();
							service.refreshColumns(grid);
						}else {
							platformGridAPI.grids.refresh(service.getGridId());
						}
						createData.oldCode = createData.Code;
						setItemToSave(createData);
						service.setSelected(createData);
					});
			}

			function updateTree(data, isRead) {
				let context = {
					treeOptions:{
						parentProp: 'AreaParentFk',
						childProp: 'Areas',
					},
					IdProperty: 'Id'
				};
				let result = [];
				result =  $injector.get('basicsLookupdataTreeHelper').buildTree(data, context);
				_.forEach(result[0].Areas,function (item) {
					item.Areas = _.sortBy (item.Areas, ['AreaType', 'Id']);
				});
				if(!isRead){
					container.data.itemTree = [];
					container.data.itemTree = result;
					container.data.listLoaded.fire(null, container.data.itemList);
				}

				return result;
			}

			service.showHeaderAfterSelectionChanged = null;

			service.clearData = function clearData() {
				service.setList([]);
				// service.setSelected(null);
				mdcAllArea2GcAreaValues = [];
				initColumnConfiguration = [];
				itemsToDelete = [];
				itemsToSave = [];
				valuesToSave = [];
				valuesToDelete = [];
				container.data.itemTree = [];
			};

			function getItemsToSave(){
				return itemsToSave.length ? itemsToSave : null;
			}

			function getItemsToDelete(){
				return itemsToDelete.length ? itemsToDelete : null;
			}

			function getValuesToSave(){
				return valuesToSave.length ? valuesToSave : null;
			}

			function getValuesToDelete() {
				return valuesToDelete.length ? valuesToDelete : null;
			}

			function setItemToSave(item) {
				itemsToSave.push(item);
			}

			function setValueToSave(items) {
				valuesToSave.push(items);
			}

			service.refreshColumns = function refreshColumns(grid, isRead, dataItems) {
				let gridItem =platformGridAPI.grids.element('id', grid);
				if(!gridItem){
					return;
				}

				if(!gridItem.instance){
					return;
				}
				let data = isRead ?  dataItems : service.getList();
				let gcItems = _.filter(data,function (item) {
					return item.AreaType === 3 && item.Id > 0;
				});
				if(!initColumnConfiguration.length){
					let configurationColumn = platformGridAPI.columns.configuration(gridId);
					initColumnConfiguration = angular.copy(configurationColumn.current);
				}
				let newConfigurationColumn = {
					current: [],
					hidden: [],
					visible: []
				};
				let valueConfiguration = angular.copy(initColumnConfiguration[3]);
				if(gcItems.length){
					_.forEach(initColumnConfiguration,function (item) {
						if(item.field !== valueConfiguration.field){
							newConfigurationColumn.current.push(item);
						}
					});
					let percentStr = '[%]';
					_.forEach(gcItems,function (item) {
						let newColumnConfig = angular.copy(valueConfiguration);
						newColumnConfig.displayMember = item.Code;
						newColumnConfig.field = 'Col_'+item.Id;
						newColumnConfig.id = 'Col_'+item.Id;
						newColumnConfig.name = item.Code+percentStr;
						newColumnConfig.name$tr$ = undefined;
						newColumnConfig.toolTip = item.Code+percentStr;
						newColumnConfig.toolTip$tr$ = undefined;
						newConfigurationColumn.current.push(newColumnConfig);
					});
					newConfigurationColumn.current.push(valueConfiguration);
				}else {
					newConfigurationColumn.current = angular.copy(initColumnConfiguration);
				}
				platformGridAPI.columns.configuration(grid, newConfigurationColumn.current);
				if(!isRead){
					platformGridAPI.grids.refresh(grid);
					platformGridAPI.grids.onColumnStateChanged(grid);
					platformGridAPI.grids.invalidate(grid);
				}
			};

			service.validateCode = function validateCode(entity, value, model) {
				let result = false;
				if (value) {
					let dataList =service.getList();
					if(dataList){
						let data = _.filter(dataList,function (item) {
							return entity.AreaType < 3 ? item.AreaType < 3 : item.AreaType > 2;
						});
						let find = _.filter(data,function (item) {
							return item.Code === value;
						});
						if(find.length > 1){
							entity.__rt$data = entity.__rt$data || {};
							entity.__rt$data.errors = entity.__rt$data.errors || {};
							entity.__rt$data.errors.Code = {error: $translate.instant('cloud.common.uniqueValueErrorMessage', {fieldName: model})};
						}else {
							result = true;
						}
					}
				}else {
					entity.__rt$data = entity.__rt$data || {};
					entity.__rt$data.errors = entity.__rt$data.errors || {};
					entity.__rt$data.errors.Code = {error: $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {object: 'Code'})};
				}

				if(result){
					removeError(entity, model);
				}

				return result;
			};

			function removeError(item, model){
				if(item.__rt$data && item.__rt$data.errors && item.__rt$data.errors[model]){
					delete  item.__rt$data.errors[model];
				}
			}

			function hasError(allowanceType) {
				if(allowanceType !== 3){
					return false;
				}

				let data = service.getList();
				let findErrorData = _.find(data,function (item) {
					return item.__rt$data && item.__rt$data.errors && item.__rt$data.errors.Code;
				});
				return !!findErrorData;
			}

			let baseSetSelected = service.setSelected;
			service.setSelected = function setSelected(entity) {
				if(entity){
					container.data.doClearModifications(entity,container.data);
				}
				baseSetSelected(entity);
			};

			service.deleteEntities = function () {
				let items = service.getSelectedEntities();
				let toDeletes = [];

				_.forEach(items,function (d) {
					toDeletes.push(d);
				});
				$injector.get('estimateAllowanceMarkUp2CostCodeAssignmentGridService').refreshTreeAfterDeleteArea();
				setItemsToDelete(items);
			};

			function setItemsToDelete(items) {
				let data = service.getList();

				let isDeleteGcItem = false;
				let deleteGcAreaColumn = [];
				let deleteGcArea = _.filter(items,function (item) {
					if(item.AreaType === gcAreaType){
						let column = 'Col_'+item.Id;
						deleteGcAreaColumn.push(column);
					}
					return item.AreaType === gcAreaType;
				});
				isDeleteGcItem = deleteGcArea.length > 0;

				_.forEach(items,function (d1) {
					itemsToDelete.push(d1);
					itemsToSave = _.filter(itemsToSave,function (d2) {
						return d2.Id !== d1.Id;
					});

					data = _.filter(data,function (d2) {
						if(d2.Id < 0){
							d2.Areas =[];
						}
						return d2.Id !== d1.Id;
					});

					valuesToSave = _.filter(valuesToSave,function (d2) {
						return isDeleteGcItem ? d2.MdcAllowanceGcAreaFk !== d1.Id : d2.MdcAllowanceAreaFk !== d1.Id;
					});

					let valuesItem = _.filter(mdcAllArea2GcAreaValues,function (d2) {
						return isDeleteGcItem ? d2.MdcAllowanceGcAreaFk === d1.Id : d2.MdcAllowanceAreaFk === d1.Id;
					});

					if(valuesItem.length){
						_.forEach(valuesItem,function (item) {
							let deleteValue = _.find(valuesToDelete,function (deleteItem) {
								return item.Id === deleteItem.Id;
							});
							if(!deleteValue){
								valuesToDelete.push(item);
							}
						});
					}

				});

				service.setList(data);
				let deleteNormalArea = _.filter(items,function (item) {
					return item.AreaType === normalAreaType;
				});
				if(deleteNormalArea.length){
					let normalAreaRest = _.find(data,function (item) {
						return item.AreaType === normalAreaRestType;
					});

					let markupItemsToSave = $injector.get('estimateAllowanceMarkUp2CostCodeAssignmentGridService').getItemsToSave();
					_.forEach(deleteNormalArea,function (normalArea) {
						markupItemsToSave = _.filter(markupItemsToSave,function (item) {
							return item.MdcAllowanceAreaFk !== normalArea.Id;
						});
					});
					$injector.get('estimateAllowanceMarkUp2CostCodeAssignmentGridService').updateItemToSave(markupItemsToSave);

					let allValueFields = [];
					_.forOwn(deleteNormalArea[0], function (value, key) {
						if (key === 'Rest' || key.indexOf('Col_') !== -1) {
							allValueFields.push(key);
							if(isDeleteGcItem && _.includes(deleteGcAreaColumn, key)){
								allValueFields.pop(key);
							}
						}
					});

					let normalAreas = _.filter(data,function (item) {
						return item.Id > 0 && item.AreaType === normalAreaType;
					});
					_.forEach(allValueFields,function (item) {
						let percent = 0;
						_.forEach(normalAreas,function (normalArea) {
							percent += normalArea[item];
						});
						normalAreaRest[item] = 100 - percent;
						if(item !== 'Rest'){
							let gcId = parseInt(item.split('_')[1]);
							let gcArea = _.find(service.getList(),function (item) {
								return item.Id === gcId;
							});
							if(gcArea){
								let restValueItem = _.find(mdcAllArea2GcAreaValues,function (value) {
									return value.MdcAllowanceAreaFk === normalAreaRest.Id && value.MdcAllowanceGcAreaFk === gcId;
								});
								restValueItem.Value = normalAreaRest[item];
								let restValueItemToSave = _.find(valuesToSave,function (value) {
									return value.Id === restValueItem.Id;
								});
								if(!restValueItemToSave){
									valuesToSave.push(restValueItem);
								}
							}
						}else {
							let gcArea = _.find(service.getList(),function (item) {
								return item.AreaType === gcAreaRestType;
							});
							let restValueItem = _.find(mdcAllArea2GcAreaValues,function (value) {
								return value.MdcAllowanceAreaFk === normalAreaRest.Id && value.MdcAllowanceGcAreaFk === gcArea.Id;
							});
							restValueItem.Value = normalAreaRest[item];
							let restValueItemToSave = _.find(valuesToSave,function (value) {
								return value.Id === restValueItem.Id;
							});
							if(!restValueItemToSave){
								valuesToSave.push(restValueItem);
							}
						}
					});
				}

				updateTree(data,false);
				if(isDeleteGcItem){
					let grid = service.getGridId();
					service.refreshColumns(grid);
				}
			}

			service.fieldChange = function (item,column,field) {
				if(field === 'Code'){
					// vaildation old Code
					let tree = service.getTree();
					let data = _.find(tree[0].Areas,function (child) {
						return item.AreaType === child.AreaType;
					});
					let oldCodeData = _.filter(data.Areas,function (d) {
						return d.Code === item.oldCode;
					});
					if(oldCodeData.length === 1){
						removeError(oldCodeData[0],'Code');
					}

					let validataResult = service.validateCode(item,item.Code,field);

					if(item.AreaType > 2 && validataResult){
						let grid = service.getGridId();
						service.refreshColumns(grid);
					}else {
						platformGridAPI.grids.refresh(service.getGridId());
					}
					item.oldCode = item.Code;
					let dataToSave = _.find(itemsToSave,function (data) {
						return data.Id === item.Id;
					});
					if(!dataToSave){
						itemsToSave.push(item);
					}else {
						dataToSave.Code = item.Code;
						dataToSave.oldCode = item.oldCode;
					}
				}else {
					processValueChange(item,field);
				}
			};

			function processValueChange(item,field) {
				let gcAreaFk = field !== 'Rest' ? field.split('_')[1] : item.GcRestId;
				let valueItem = _.find(mdcAllArea2GcAreaValues,function (value) {
					return value.MdcAllowanceAreaFk === item.Id && value.MdcAllowanceGcAreaFk === parseInt(gcAreaFk);
				});
				let isVaild = validateRest(item[field],parseInt(gcAreaFk), field);
				if(isVaild){
					valueItem.Value = item[field];
					let valueItemToSave = _.find(valuesToSave,function (value) {
						return value.MdcAllowanceAreaFk === item.Id && value.MdcAllowanceGcAreaFk === parseInt(gcAreaFk);
					});
					if(!valueItemToSave){
						valueItemToSave = _.find(mdcAllArea2GcAreaValues,function (value) {
							return value.MdcAllowanceAreaFk === item.Id && value.MdcAllowanceGcAreaFk === parseInt(gcAreaFk);
						});
						valuesToSave.push(valueItemToSave);
					}
					valueItemToSave.Value = item[field];
					updateTree(service.getList());
				}else {
					item[field] = valueItem.Value;
					platformModalService.showMsgBox($translate.instant('estimate.main.underbalance'), 'cloud.common.informationDialogHeader', 'info');
				}
			}

			function validateRest(value, gcAreaFk, field) {
				let isVaild = true;
				let percent = 0;
				let data = service.getList();
				let normalAreaRest = _.find(data,function (item) {
					return item.AreaType === normalAreaRestType;
				});
				let restValueItem = _.find(mdcAllArea2GcAreaValues,function (value) {
					return value.MdcAllowanceAreaFk === normalAreaRest.Id && value.MdcAllowanceGcAreaFk === gcAreaFk;
				});

				_.forEach(data,function (item) {
					if(item.AreaType === normalAreaType && item.Id > 0){
						percent += item[field];
					}
				});

				isVaild = percent <= 100;

				if(isVaild){
					restValueItem.Value = 100 - percent;
					normalAreaRest[field] = restValueItem.Value;

					let restValueItemToSave = _.find(valuesToSave,function (value) {
						return value.Id === restValueItem.Id;
					});
					if(!restValueItemToSave){
						valuesToSave.push(restValueItem);
					}
				}
				return isVaild;
			}

			return service;
		}]
	);
})();
