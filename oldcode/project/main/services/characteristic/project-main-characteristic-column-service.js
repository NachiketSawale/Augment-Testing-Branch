/**
 * Created by leo on 12.06.2018.
 */
(function(angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W061 */ // eval can be harmful

	var moduleName = 'project.main';

	angular.module(moduleName).factory('projectMainCharacteristicColumnService', [
		'$http', '$q', '$injector', 'globals', 'platformGridAPI', 'platformTranslateService', 'projectMainService',
		'basicsLookupdataLookupDescriptorService', 'mainViewService', 'projectMainDynamicConfigurationService',
		'_', '$',
		function ($http, $q, $injector, globals, platformGridAPI, platformTranslateService, projectMainService,
			basicsLookupdataLookupDescriptorService, mainViewService, projectMainDynamicConfigurationService, _, $) {
			var service = {};
			// var colConfig = [];
			// var detailConfig = {};
			const sectionId = 40;
			const gridId = '713b7d2a532b43948197621ba89ad67a';
			let data = {dynamicColumns: [], dynamicRows: []};
			let selectedColumn;
			let groupName = projectMainDynamicConfigurationService.getGroupName();

			// check column; new? delete? modified?
			service.checkColumn = function checkColumn(item){
				let characteristicCol = generateColField(item);
				let characteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
				if (characteristicTypeService.isLookupType(item.CharacteristicTypeFk)) {
					projectMainService.setCharacteristicColumn(characteristicCol);
					const characteristicListService = $injector.get('basicsCharacteristicCharacteristicService');
					characteristicListService.setSelected(item.CharacteristicEntity);
				}

				if(isExistColumn(characteristicCol)){
					service.modifyValue(item);
				} else {
					service.createColumn(item);
				}
			};

			// create column
			service.createColumn = function createColumn(item){
				let col = generateColConfig(item);
				// colConfig.push(col);
				data.dynamicColumns.push(col);
				projectMainDynamicConfigurationService.attachData(data.dynamicColumns);
				appendCharacterValues([item]);
				service.refresh();
			};

			function isRemoveColunm(selectItem, idorField, items) {
				return !_.some(items, function (item) {
					return item.Id !== selectItem.Id && (item[idorField] !== null && item[idorField]);
				});
			}

			// delete column
			service.deleteColumns = function deleteColumns(items){
				let selected = projectMainService.getSelected();
				let list = projectMainService.getList();
				angular.forEach(items, function (item) {
					let field = generateColField(item);
					if(isExistColumn(field)) {
						angular.forEach(list, function (item) {
							if (selected && item.Id === selected.Id) {
								item[field] = null;
							}
						});

						let toRemove = isRemoveColunm(selected, field, list);
						if (toRemove) {
							let column = _.find(data.dynamicColumns, function (col) {
								return col.id === field;
							});
							if (!_.isNil(column)) {
								projectMainDynamicConfigurationService.detachData(column);
							}

							data.dynamicColumns = _.filter(data.dynamicColumns, function (col) {
								let newList = _.filter(list, function (item) {
									return item[field] !== null;
								});
								return col.id !== field || (newList && newList.length > 0);
							});
						}
					}
				});
				service.refresh();
			};

			service.checkRow = function checkColumn(item){
				if (isExistRow(generateColField(item))){
					service.modifyValue(item);
				} else {
					service.createRow(item);
				}
				// return detailConfig;
			};

			// create row
			service.createRow = function createRow(item){
				if (!isExistRow(generateColField(item))) {
					let row = generateRowConfig(item);
					row.gid = groupName;
					row.enterStop = true;
					row.visible = true;
					row.tabStop = true;
					data.dynamicRows.push(row);
					projectMainDynamicConfigurationService.attachDataForDetail(data.dynamicRows);
				}
				refreshCharacteristicCodeLookup();

				appendCharacterValues([item]);
			};

			// delete column
			service.deleteRows = function deleteRows(items){
				let selected = projectMainService.getSelected();
				let list = projectMainService.getList();
				angular.forEach(items, function (item) {
					let field = generateColField(item);
					if(data.dynamicRows && data.dynamicRows.length > 0) {
						if (isExistRow(field)) {
							angular.forEach(list, function (item) {
								if (selected && item.Id === selected.Id) {
									item[field] = null;
								}
							});
							let toRemove = isRemoveColunm(selected, field, list);
							if (toRemove) {
								let rowexist = _.find(data.dynamicRows, function (row) {
									return row.rid === field;
								});
								if (!_.isNil(rowexist)) {
									projectMainDynamicConfigurationService.detachDataForDetail(rowexist);
								}

								data.dynamicRows = _.filter(data.dynamicRows, function (row) {
									let newList = _.filter(list, function (item) {
										return item[field] !== null;
									});
									return row.rid !== field || (newList && newList.length > 0);
								});
							}
						}
						// projectMainDynamicConfigurationService.attachDataForDetail(data.dynamicRows);
					}
				});
			};

			function generateColField(item) {
				// var characteristicCode = _.findLast(item.CharacteristicEntity.Code) === '.' ? _.trimEnd(item.CharacteristicEntity.Code, '.') : item.CharacteristicEntity.Code;
				// var columnIdorField = characteristicCode.replace(/_ /g,'');

				// return 'charactercolumn' + '_' + columnIdorField + '_' + item.CharacteristicGroupFk.toString() + '_' + item.CharacteristicTypeFk.toString() + '_' + item.CharacteristicFk.toString();
				return 'charactercolumn' + '_' + item.CharacteristicGroupFk.toString() + '_' + item.CharacteristicTypeFk.toString() + '_' + item.CharacteristicFk.toString();
			}

			function generateColConfig(item){
				let colOptions = getColOptions(item);
				let characteristicColumnField = generateColField(item);
				// Characteristic column name
				let characteristicColumnName = item.CharacteristicEntity.Code;
				characteristicColumnName = _.isEmpty(item.CharacteristicEntity.DescriptionInfo.Description) ? characteristicColumnName: item.CharacteristicEntity.DescriptionInfo.Description;

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
				let colOptions = {
					formatter: null,
					editorOptions: null,
					formatterOptions: null
				};
				switch (item.CharacteristicTypeFk) {
					case 10: {
						let basicsLookupdataConfigGenerator = $injector.get('basicsLookupdataConfigGenerator');
						colOptions = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForProjectService',
							filter: function () {
								let id = null;
								let col = projectMainService.getCharacteristicColumn();
								if (col) {
									let colArray = _.split(col, '_');
									if (colArray && colArray.length > 0) {
										id = colArray[_.lastIndexOf(colArray) - 1];
										return id;
									}
								}
								return id;
							},
							moduleQualifier: 'CharacteristicValue',
							additionalColumns: false
						});
						colOptions.formatterOptions = {
							lookupType: 'CharacteristicValue',
							displayMember: 'DescriptionInfo.Translated'
						};
						break;
					}
					default: {
						let characteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
						colOptions.formatter = characteristicTypeService.characteristicType2Domain(item.CharacteristicTypeFk);
						colOptions.editorOptions = null;
						colOptions.formatterOptions = null;
						break;
					}
				}
				return colOptions;
			}

			function generateRowConfig(item){
				let rowOptions = getRowOptions(item);
				let characteristicColumnField = generateColField(item);
				// Characteristic column name
				let characteristicColumnName = item.CharacteristicEntity.Code;
				characteristicColumnName = _.isEmpty(item.CharacteristicEntity.DescriptionInfo.Description) ? characteristicColumnName: item.CharacteristicEntity.DescriptionInfo.Description;
				let row = {
					domain: rowOptions.type,
					rid: characteristicColumnField,
					model: characteristicColumnField,
					label: characteristicColumnName,
					label$tr$: undefined,
					required: false,
					readonly: false,
					isCharacteristic: true,
					isCharacteristicExpired: item.IsReadonly,
					validator: function validator(entity, value, model) {
						if (item.IsReadonly) {
							entity[model + '__revert'] = entity[model];
						}
						return true;
					},
					onPropertyChanged: function(entity, model){
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
				let rowOptions = {};
				let id = item.CharacteristicFk.toString();
				switch (item.CharacteristicTypeFk) {
					case 10: {
						const basicsLookupdataConfigGenerator = $injector.get('basicsLookupdataConfigGenerator');
						rowOptions = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForProjectService',
							moduleQualifier: 'CharacteristicValue',
							filter: function () {
								return id;
							}
						});
						break;
					}
					default: {
						const characteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
						rowOptions.type = characteristicTypeService.characteristicType2Domain(item.CharacteristicTypeFk);
						break;
					}
				}
				return rowOptions;
			}

			function refreshCharacteristicCodeLookup(){
				const basicsCharacteristicCodeLookupService = $injector.get('basicsCharacteristicCodeLookupService');
				basicsCharacteristicCodeLookupService.refresh(sectionId);
			}

			service.appendDefaultCharacteristicCols = function(item) {

				$http.get(globals.webApiBaseUrl + 'basics/characteristic/data/defaultlistbysection?sectionId=' + sectionId).then(function(response) {
					if(response.data && response.data.length > 0) {
						angular.forEach(response.data, function (item) {
							if (!isExistColumn(generateColField(item))) {
								data.dynamicColumns.push(generateColConfig(item));
							}
						});
						projectMainDynamicConfigurationService.attachData(data.dynamicColumns);
						if (platformGridAPI.grids.exist(gridId)) {
							let grid = platformGridAPI.grids.element('id', gridId).instance;
							if (grid && grid.getSelectedRows().length === 0) {
								let gridData = grid.getData();
								let selectedItem = projectMainService.getSelected();
								let selectedRow = gridData.getRowById(selectedItem ? selectedItem.Id : -1);
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
			service.appendCharacteristicCols = function(itemList){
				const CharacteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory');
				let charaDataService = CharacteristicDataService.getService(projectMainService, sectionId);

				charaDataService.getAllItemBySectionId(true).then( function(response){
					if(response && response.length > 0) {
						angular.forEach(response, function (item) {
							if (!isExistColumn(generateColField(item))) {
								data.dynamicColumns.push(generateColConfig(item));
							}
						});
						projectMainDynamicConfigurationService.attachData(data.dynamicColumns);

						if (platformGridAPI.grids.exist(gridId)) {
							let grid = platformGridAPI.grids.element('id', gridId).instance;
							if (grid && grid.getSelectedRows().length === 0) {
								let gridData = grid.getData();
								let selectedItem = projectMainService.getSelected();
								let selectedRow = gridData.getRowById(selectedItem ? selectedItem.Id : -1);
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

			function appendCharacterValues(data, items){
				let prjItems = items ? items : projectMainService.getList() || [];
				const characteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
				angular.forEach(prjItems, function (prjItem) {
					angular.forEach(data, function (item) {
						let characteristicCol = generateColField(item);
						let type = characteristicTypeService.characteristicType2Domain(item.CharacteristicTypeFk);
						let value = characteristicTypeService.convertValue(item.ValueText ,item.CharacteristicTypeFk);
						if (item.ObjectFk === prjItem.Id) {
							prjItem[characteristicCol] = value;
						}
						else if(prjItem[characteristicCol] === undefined){
							prjItem[characteristicCol] = null;
							// prjItem[characteristicCol] = type === 'boolean' ? false : null;
						}
					});
				});

			}
			function isExistColumn(colField){
				let colData = _.filter(data.dynamicColumns, {'id': colField});
				return !(!colData || (colData && colData.length === 0));
			}

			// modifiy value
			service.modifyValue = function(item){
				appendCharacterValues([item]);
				service.refresh();
			};

			// refresh grid
			service.refresh = function(){
				projectMainDynamicConfigurationService.fireRefreshConfigLayout();
				// projectMainDynamicConfigurationService.refreshGridLayout();

			};

			service.isCharacteristicColumn = function isCharacteristicColumn(col) {
				return !!(col && col.isCharacteristic);
			};

			function isCharacteristicColumnExpired(col) {
				return (col && col.isCharacteristicExpired);
			}

			service.getCharacteristicColValue = function getCharacteristicColValue(lineItem, colArray){
				let itemValue = lineItem;
				angular.forEach(colArray, function(col){
					if(itemValue[col]){
						itemValue = itemValue[col];
					}
				});

				return itemValue;
			};

			service.fieldChange = function fieldChange(item, field, column) {
				if(service.isCharacteristicColumn(column)) { // characteristic column
					if (isCharacteristicColumnExpired(column)) {
						const platformModalService = $injector.get('platformModalService');
						platformModalService.showErrorBox('cloud.common.currentCharacteristicIsExpired', 'cloud.common.errorMessage').then(function () {
							if (item.hasOwnProperty(field)) {
								item[field] = item[field + '__revert'];
								delete item[field + '__revert'];
								projectMainService.gridRefresh();
							}
						});
					} else {
						let prjItem = item;
						let colArray = _.split(field, '.');
						if (prjItem[field] === undefined) {
							prjItem[field] = service.getCharacteristicColValue(angular.copy(prjItem), colArray);
						}

						const characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(projectMainService, sectionId);
						characteristicDataService.load().then(function () {
							characteristicDataService.syncUpdateCharacteristic(field, prjItem);
						});
						/*
						var contextId = parseInt(_.replace(characteristicDataService.getFilter(), 'mainItemId=', ''));
						var currentContextId = item.Id;
						if (contextId === currentContextId) {
							characteristicDataService.syncUpdateCharacteristic(field, prjItem);
						} else {
							characteristicDataService.setUpdateCharOnListLoaded(field, prjItem);
						}
*/
					}
				}
			};

			function isExistRow(rowName){
				if (data.dynamicRows) {
					let rowData = _.filter(data.dynamicRows, {'rid': rowName});
					return !(!rowData || (rowData && rowData.length === 0));
				}
				return false;
			}

			service.appendCharacteristicRows = function appendDefaultCharacteristicRows(response){

				if(response && response.length > 0) {
					angular.forEach(response, function (item) {
						if (!isExistRow(generateColField(item))) {
							let row = generateRowConfig(item);
							row.gid = groupName;
							row.enterStop = true;
							row.visible = true;
							row.tabStop = true;
							data.dynamicRows.push(row);
						}
					});
					projectMainDynamicConfigurationService.attachDataForDetail(data.dynamicRows);
					// refreshCharacteristicCodeLookup();
				}
			};

			service.getStandardConfigForDetailView = function(){
				return projectMainDynamicConfigurationService.getStandardConfigForDetailView();
			};

			service.registerSetConfigLayout = function( callBackFn){
				return projectMainDynamicConfigurationService.registerSetConfigLayout(callBackFn);
			};
			service.unregisterSetConfigLayout = function( callBackFn){
				return projectMainDynamicConfigurationService.unregisterSetConfigLayout(callBackFn);
			};
			return service;
		}]);
})(angular);
