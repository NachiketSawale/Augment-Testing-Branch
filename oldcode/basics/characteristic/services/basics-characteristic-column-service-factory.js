/**
 * Created by pel on 02.09.2020.
 */
(function(angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W061 */ // eval can be harmful

	var moduleName = 'basics.characteristic';

	angular.module(moduleName).factory('basicsCharacteristicColumnServiceFactory', [
		'$http', '$q', '$injector', 'globals', 'platformGridAPI', 'platformTranslateService',
		'basicsLookupdataLookupDescriptorService', 'mainViewService',
		'_',
		function ($http, $q, $injector, globals, platformGridAPI, platformTranslateService,
			basicsLookupdataLookupDescriptorService,mainViewService,
			_) {
			var serviceCache = [];
			function createService(parentService, sectionId, gridId,containerInfoService) {
				var service = {};
				var containerGridConfig = containerInfoService.getContainerInfoByGuid(gridId);
				if(_.isNil(containerGridConfig.standardConfigurationService)){
					containerGridConfig = containerInfoService.getContainerInfoByGuid(gridId.toUpperCase());
				}
				var dynamicConfigurationService = containerGridConfig.standardConfigurationService;
				service.containerInfoService = containerInfoService;
				var selectedColumn;
				var data = {dynamicColumns: [], dynamicRows: []};
				var groupName = dynamicConfigurationService.getGroupName();
				// check column; new? delete? modified?
				service.checkColumn = function checkColumn(item, disableRefresh) {
					var characteristicCol = generateColField(item);
					var characteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
					if (characteristicTypeService.isLookupType(item.CharacteristicTypeFk)) {
						parentService.setCharacteristicColumn(characteristicCol);
						var characteristicListService = $injector.get('basicsCharacteristicCharacteristicService');
						characteristicListService.setSelected(item.CharacteristicEntity);
					}

					if (isExistColumn(characteristicCol)) {
						service.modifyValue(item, disableRefresh);
					} else {
						service.createColumn(item, disableRefresh);
					}
				};
				// create column
				service.createColumn = function createColumn(item, disableRefresh) {
					var col = generateColConfig(item);
					data.dynamicColumns.push(col);
					dynamicConfigurationService.attachData(data.dynamicColumns);
					appendCharacterValues([item]);
					if(!disableRefresh) {
						service.refresh();
					}
				};

				function isRemoveColunm(selectItem, idorField, items) {
					return !_.some(items, function (item) {
						if (item.Id !== selectItem.Id && (item[idorField] !== null && item[idorField])) {
							return true;
						} else {
							return false;
						}
					});
				}

				// delete column
				service.deleteColumns = function deleteColumns(items) {
					var selected = parentService.getSelected();
					angular.forEach(items, function (item) {
						if (item.CharacteristicEntity !== null) {
							var field = generateColField(item);
							if (isExistColumn(field)) {
								var list = parentService.getList();
								angular.forEach(list, function (item) {
									if (selected && getMainItemIdOfItem(item) === getMainItemIdOfItem(selected)) {
										item[field] = null;
									}
								});
								var toRemove = isRemoveColunm(selected, field, list);
								if (toRemove) {
									var column = _.find(data.dynamicColumns, function (col) {
										return col.id === field;
									});
									if (!_.isNil(column)) {
										dynamicConfigurationService.detachData(column);
									}

									data.dynamicColumns = _.filter(data.dynamicColumns, function (col) {
										var newList = _.filter(list, function (item) {
											return item[field] !== null;
										});
										return col.id !== field || (newList && newList.length > 0);
									});
								}
							}
						}

					});
					service.refresh();
				};

				service.checkRow = function checkColumn(item, disableRefresh, hidden) {
					if (isExistRow(generateColField(item))) {
						service.modifyValue(item, disableRefresh);
					} else {
						service.createRow(item, disableRefresh, hidden);
					}
				};

				// create row
				service.createRow = function createRow(item, disableRefresh, hidden) {
					if (!isExistRow(generateColField(item))) {
						var row = generateRowConfig(item);
						row.gid = groupName;
						row.enterStop = true;
						row.visible = !hidden;
						row.tabStop = true;
						data.dynamicRows.push(row);
						dynamicConfigurationService.attachDataForDetail(data.dynamicRows);
					}
					refreshCharacteristicCodeLookup();
					appendCharacterValues([item]);
					if(!disableRefresh) {
						service.refresh();
					}
				};

				// delete row
				service.deleteRows = function deleteRows(items) {
					angular.forEach(items, function (item) {
						var selected = parentService.getSelected();
						var field = generateColField(item);
						if (data.dynamicRows && data.dynamicRows.length > 0) {
							if (isExistRow(field)) {
								var list = parentService.getList();
								angular.forEach(list, function (item) {
									if (selected && getMainItemIdOfItem(item) === getMainItemIdOfItem(selected)) {
										item[field] = null;
									}
								});
								data.dynamicRows = _.filter(data.dynamicRows, function (row) {
									var newList = _.filter(list, function (item) {
										return item[field] !== null;
									});
									return row.rid !== field || (newList && newList.length > 0);
								});
							}
							dynamicConfigurationService.attachDataForDetail(data.dynamicRows);
						}
					});
				};

				function generateColField(item) {
					// var characteristicCode = _.findLast(item.CharacteristicEntity.Code) === '.' ? _.trimEnd(item.CharacteristicEntity.Code, '.') : item.CharacteristicEntity.Code;
					// var columnIdorField = characteristicCode.replace(/ /g,'');

					return 'charactercolumn' + '_' /* + columnIdorField + '_' */ + item.CharacteristicGroupFk.toString() + '_' + item.CharacteristicTypeFk.toString() + '_' + item.CharacteristicFk.toString();
				}

				function generateColConfig(item) {
					var colOptions = getColOptions(item);
					var characteristicColumnField = generateColField(item);
					// Characteristic column name
					var characteristicColumnName = item.CharacteristicEntity.Code;
					characteristicColumnName = _.isEmpty(item.CharacteristicEntity.DescriptionInfo.Description) ? characteristicColumnName : item.CharacteristicEntity.DescriptionInfo.Description;

					return platformTranslateService.translateGridConfig({
						domain: colOptions.formatter,
						type: colOptions.formatter,
						id: characteristicColumnField,
						editor: colOptions.formatter,
						field: characteristicColumnField,
						model: characteristicColumnField,
						name: characteristicColumnName,
						name$tr$: undefined,
						label: characteristicColumnName,
						label$tr$: undefined,
						formatter: colOptions.formatter,
						editorOptions: colOptions.editorOptions,
						formatterOptions: colOptions.formatterOptions,
						hidden: false,
						required: false,
						grouping: {
							title: characteristicColumnName,
							getter: characteristicColumnField,
							aggregators: [],
							aggregateCollapsed: true
						},
						isCharacteristic: true,
						isCharacteristicExpired: item.IsReadonly,
						characteristicSection: sectionId,
						sortable: true,
						validator: function validator(entity, value, model) {
							if (item.IsReadonly) {
								entity[model + '__revert'] = entity[model];
							}
							return true;
						}
					});
				}

				// get the formatter for characteristic
				function getColOptions(item) {
					var colOptions = {
						formatter: null,
						editorOptions: null,
						formatterOptions: null
					};
					switch (item.CharacteristicTypeFk) {
						case 10:
							const characteristicFk = item.CharacteristicFk;
							var basicsLookupdataConfigGenerator = $injector.get('basicsLookupdataConfigGenerator');
							colOptions = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
								dataServiceName: 'basicsCharacteristicDiscreteValueLookupForProjectService',
								filter: function () {
									// should filter by characteristicFk
									return characteristicFk;
								},
								moduleQualifier: 'CharacteristicValue',
								additionalColumns: false
							});
							colOptions.formatterOptions = {
								lookupType: 'CharacteristicValue',
								displayMember: 'DescriptionInfo.Translated'
							};
							break;
						default:
							var characteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
							colOptions.formatter = characteristicTypeService.characteristicType2Domain(item.CharacteristicTypeFk);
							colOptions.editorOptions = null;
							colOptions.formatterOptions = null;
							break;
					}
					return colOptions;
				}

				function generateRowConfig(item) {
					var rowOptions = getRowOptions(item);
					var characteristicColumnField = generateColField(item);
					// Characteristic column name
					var characteristicColumnName = item.CharacteristicEntity.Code;
					characteristicColumnName = _.isEmpty(item.CharacteristicEntity.DescriptionInfo.Description) ? characteristicColumnName : item.CharacteristicEntity.DescriptionInfo.Description;
					var row = {
						domain: rowOptions.type,
						rid: characteristicColumnField,
						model: characteristicColumnField,
						label: characteristicColumnName,
						label$tr$: undefined,
						required: false,
						readonly: false,
						isCharacteristic: true,
						isCharacteristicExpired: item.IsReadonly,
						characteristicSection: sectionId,
						validator: function validator(entity, value, model) {
							if (item.IsReadonly) {
								entity[model + '__revert'] = entity[model];
							}
							return true;
						},
						onPropertyChanged: function (entity, model) {
							selectedColumn = model;
						},
						change: function(entity, field, column){
							service.fieldChange(entity, field, column);
						}
					};
					return $.extend(row, rowOptions);
				}

				// get the formatter for characteristic
				function getRowOptions(item) {
					var rowOptions = {};
					switch (item.CharacteristicTypeFk) {
						case 10:
							const characteristicFk = item.CharacteristicFk;
							var basicsLookupdataConfigGenerator = $injector.get('basicsLookupdataConfigGenerator');
							rowOptions = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'basicsCharacteristicDiscreteValueLookupForProjectService',
								moduleQualifier: 'CharacteristicValue',
								filter: function () {
									// should filter by characteristicFk
									return characteristicFk;
								}
							});
							rowOptions.formatterOptions = {
								lookupType: 'CharacteristicValue',
								displayMember: 'DescriptionInfo.Translated'
							};
							break;
						default:
							var characteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
							rowOptions.type = characteristicTypeService.characteristicType2Domain(item.CharacteristicTypeFk);
							break;
					}
					return rowOptions;
				}


				function refreshCharacteristicCodeLookup() {
					var basicsCharacteristicCodeLookupService = $injector.get('basicsCharacteristicCodeLookupService');
					basicsCharacteristicCodeLookupService.refresh(sectionId);
				}

				service.appendDefaultCharacteristicCols = function (item) {

					$http.get(globals.webApiBaseUrl + 'basics/characteristic/data/defaultlistbysection?sectionId=' + sectionId).then(function (response) {
						if (response.data && response.data.length > 0) {
							angular.forEach(response.data, function (item) {
								if (!isExistColumn(generateColField(item))) {
									data.dynamicColumns.push(generateColConfig(item));
								}
							});
							dynamicConfigurationService.attachData(data.dynamicColumns);
							if (platformGridAPI.grids.exist(gridId)) {
								var grid = platformGridAPI.grids.element('id', gridId).instance;
								if (grid && grid.getSelectedRows().length === 0) {
									var gridData = grid.getData();
									var selectedItem = parentService.getSelected();
									var selectedRow = gridData.getRowById(selectedItem ? selectedItem.Id : -1);
									if (selectedRow > -1) {
										grid.setSelectedRows([selectedRow]);
									}
								}
							}
							appendCharacterValues(response.data, [item]);
							refreshCharacteristicCodeLookup();

							service.appendCharacteristicRows(response.data);
							service.refresh();
						}
					});
				};

				// append all characteristics from characteristic2
				service.appendCharacteristicCols = function (itemList) {
					var characteristicDataService = getCharacteristicDataService();
					characteristicDataService.getAllItemBySectionId(true).then(function (response) {
						if (response && response.length > 0) {
							angular.forEach(response, function (item) {
								if (!isExistColumn(generateColField(item))) {
									data.dynamicColumns.push(generateColConfig(item));
								}
							});
							dynamicConfigurationService.attachData(data.dynamicColumns);

							if (platformGridAPI.grids.exist(gridId)) {
								var grid = platformGridAPI.grids.element('id', gridId).instance;
								if (grid && grid.getSelectedRows().length === 0) {
									var gridData = grid.getData();
									var selectedItem = parentService.getSelected();
									var selectedRow = gridData.getRowById(selectedItem ? selectedItem.Id : -1);
									if (selectedRow > -1) {
										grid.setSelectedRows([selectedRow]);
									}
								}
							}
							appendCharacterValues(response, itemList);
							refreshCharacteristicCodeLookup();
							service.appendCharacteristicRows(response);
							service.refresh();
						}
					});
				};

				service.setReadOnlyByMainEntity = function (mainEntity){
					var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
					var characteristicDataService = getCharacteristicDataService();
					characteristicDataService.getAllItemBySectionId().then(function (response) {
						if (response && response.length > 0) {
							var isReadOnly = setReadonly(mainEntity);
							var fields = [];
							angular.forEach(response, function (item) {
								var characteristicCol = generateColField(item);
								if (mainEntity.hasOwnProperty(characteristicCol)) {
									fields.push({field: characteristicCol, readonly: !isReadOnly});
								}
							});
							platformRuntimeDataService.readonly(mainEntity, fields);
						}
					});
				};

				function getCharacteristicDataService() {
					return $injector.get('basicsCharacteristicDataServiceFactory').getService(parentService, sectionId);
				}

				function getMainItemIdOfItem(item) {
					return getCharacteristicDataService().getMainItemIdOfItem(item);
				}

				function appendCharacterValues(data, items) {
					var platformRuntimeDataService = $injector.get('platformRuntimeDataService');
					var prjItems = items ? items : parentService.getList() || [];
					var characteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
					angular.forEach(prjItems, function (prjItem) {
						var fields = [];
						var isReadOnly = setReadonly(prjItem);
						angular.forEach(data, function (item) {
							var idorField = _.findLast(item.CharacteristicEntity.Code) === '.' ? _.trimEnd(item.CharacteristicEntity.Code, '.') : item.CharacteristicEntity.Code;
							idorField = _.replace(idorField, ' ', '');
							var characteristicCol = generateColField(item);
							var type = characteristicTypeService.characteristicType2Domain(item.CharacteristicTypeFk);
							var value = characteristicTypeService.convertValue(item.ValueText, item.CharacteristicTypeFk);
							if (item.ObjectFk === getMainItemIdOfItem(prjItem)) {
								prjItem[characteristicCol] = value;
							} else if (prjItem[characteristicCol] === undefined) {
								prjItem[characteristicCol] = null;
								// prjItem[characteristicCol] = type === 'boolean' ? false : null;
							}
							if (prjItem.hasOwnProperty(characteristicCol)) {
								fields.push({field: characteristicCol, readonly: !isReadOnly});
							}

						});
						platformRuntimeDataService.readonly(prjItem, fields);
					});

				}

				var setReadonly = function (prjItem) {
					var name = parentService.getModule().name;
					if (_.startsWith(name, 'procurement') || name === 'businesspartner.main') {
						var getModuleStatusFn = parentService.getItemStatus || parentService.getModuleState;
						if (getModuleStatusFn) {
							var status = getModuleStatusFn(prjItem);
							return !(status.IsReadOnly || status.IsReadonly);
						}
						return false;
					}
					else if (_.isFunction(parentService.isCharacteristicCellReadonly)) {
						let parentField = getCharacteristicDataService().getParentField();
						return !parentService.isCharacteristicCellReadonly(prjItem, parentField);
					}
					return true;
				};

				function isExistColumn(colField) {
					var colData = _.filter(data.dynamicColumns, {'id': colField});
					return !(!colData || (colData && colData.length === 0));
				}

				// modifiy value
				service.modifyValue = function (item, disableRefresh) {
					appendCharacterValues([item]);
					if(!disableRefresh) {
						service.refresh();
					}
				};

				// refresh grid and form
				service.refresh = function (columns) {
					dynamicConfigurationService.fireRefreshConfigLayout();
				};

				// refresh grid
				service.refreshGrid = function () {
					dynamicConfigurationService.refreshGridLayout();
				};

				service.isCharacteristicColumn = function isCharacteristicColumn(col) {
					return !!(col && col.isCharacteristic && col.characteristicSection === sectionId);
				};

				function isCharacteristicColumnExpired(col) {
					return (col && col.isCharacteristicExpired);
				}

				service.getCharacteristicColValue = function getCharacteristicColValue(lineItem, colArray) {
					var itemValue = lineItem;
					angular.forEach(colArray, function (col) {
						if (itemValue[col]) {
							itemValue = itemValue[col];
						}
					});

					return itemValue;
				};

				service.fieldChange = function fieldChange(item, field, column) {
					if (service.isCharacteristicColumn(column)) { // characteristic column
						if (isCharacteristicColumnExpired(column)) {
							var platformModalService = $injector.get('platformModalService');
							platformModalService.showErrorBox('cloud.common.currentCharacteristicIsExpired', 'cloud.common.errorMessage').then(function () {
								if (item.hasOwnProperty(field)) {
									item[field] = item[field + '__revert'];
									delete item[field + '__revert'];
									parentService.gridRefresh();
								}
							});
						} else {
							var prjItem = item;
							var colArray = _.split(field, '.');
							if (prjItem[field] === undefined) {
								prjItem[field] = service.getCharacteristicColValue(angular.copy(prjItem), colArray);
							}
							var characteristicDataService = getCharacteristicDataService();
							characteristicDataService.SetColumnReadonly(field, true);
							characteristicDataService.syncUpdateCharacteristic(field, prjItem);
						}
					}
				};

				function isExistRow(rowName) {
					if (data.dynamicRows) {
						var rowData = _.filter(data.dynamicRows, {'rid': rowName});
						return !(!rowData || (rowData && rowData.length === 0));
					}
					return false;
				}

				service.appendCharacteristicRows = function appendDefaultCharacteristicRows(response) {

					if (response && response.length > 0) {
						angular.forEach(response, function (item) {
							if (!isExistRow(generateColField(item))) {
								var row = generateRowConfig(item);
								row.gid = groupName;
								row.enterStop = true;
								row.visible = true;
								row.tabStop = true;
								data.dynamicRows.push(row);
							}
						});
						dynamicConfigurationService.attachDataForDetail(data.dynamicRows);
					}
				};
				service.getStandardConfigForDetailView = function () {
					return dynamicConfigurationService.getStandardConfigForDetailView();
				};
				service.registerSetConfigLayout = function (callBackFn) {
					return dynamicConfigurationService.registerSetConfigLayout(callBackFn);
				};
				service.unregisterSetConfigLayout = function (callBackFn) {
					return dynamicConfigurationService.unregisterSetConfigLayout(callBackFn);
				};
				return service;
			}

			function getService (parentService, sectionId, gridId, containerInfoService) {
				var cacheKey = sectionId;
				var serviceName = parentService.getServiceName();
				if(serviceName) {
					cacheKey = serviceName + gridId + sectionId;
				}
				if (!serviceCache[cacheKey]) {
					serviceCache[cacheKey] = createService(parentService, sectionId, gridId, containerInfoService);
				}
				return serviceCache[cacheKey];
			}

			return {
				getService: getService
			};
		}]);
})(angular);