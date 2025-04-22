/**
 * Created by postic on 23.11.2022.
 */
(function(angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W061 */ // eval can be harmful

	var moduleName = 'sales.bid';

	angular.module(moduleName).factory('salesBidCharacteristicColumnService', [
		'$', '$http', '$q', '$injector', 'globals', 'platformGridAPI', 'platformTranslateService', 'salesBidService',
		'basicsLookupdataLookupDescriptorService', 'mainViewService', 'salesBidDynamicConfigurationService',
		'_',
		function ($, $http, $q, $injector, globals, platformGridAPI, platformTranslateService, salesBidService,
			basicsLookupdataLookupDescriptorService, mainViewService, salesBidDynamicConfigurationService,
			_) {
			var service = {};
			// var colConfig = [];
			// var detailConfig = {};
			var sectionId = 65;
			var gridId = '7001204d7fb04cf48d8771c8971cc1e5';
			var data = {dynamicColumns: [], dynamicRows: []};
			var groupName = salesBidDynamicConfigurationService.getGroupName();

			// check column; new? delete? modified?
			service.checkColumn = function checkColumn(item){
				var characteristicCol = generateColField(item);
				var characteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
				if (characteristicTypeService.isLookupType(item.CharacteristicTypeFk)) {
					salesBidService.setCharacteristicColumn(characteristicCol);
					var characteristicListService = $injector.get('basicsCharacteristicCharacteristicService');
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
				var col = generateColConfig(item);
				// colConfig.push(col);
				data.dynamicColumns.push(col);
				salesBidDynamicConfigurationService.attachData(data.dynamicColumns);
				appendCharacterValues([item]);
				service.refresh();
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
			service.deleteColumns = function deleteColumns(items){
				var selected = salesBidService.getSelected();
				angular.forEach(items, function (item) {
					var field = generateColField(item);
					if(isExistColumn(field)) {
						var list = salesBidService.getList();
						angular.forEach(list, function (item) {
							if (selected && item.Id === selected.Id) {
								item[field] = null;
							}
						});

						var toRemove = isRemoveColunm(selected, field, list);
						if (toRemove) {
							var column = _.find(data.dynamicColumns, function (col) {
								return col.id === field;
							});
							if (!_.isNil(column)) {
								salesBidDynamicConfigurationService.detachData(column);
							}

							data.dynamicColumns = _.filter(data.dynamicColumns, function (col) {
								var newList = _.filter(list, function (item) {
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
				if(isExistRow(generateColField(item))){
					service.modifyValue(item);
				} else {
					service.createRow(item);
				}
				// return detailConfig;
			};

			// create row
			service.createRow = function createRow(item){
				if(!isExistRow(generateColField(item))) {
					var row = generateRowConfig(item);
					row.gid = groupName;
					row.enterStop = true;
					row.visible = true;
					row.tabStop = true;
					data.dynamicRows.push(row);
					salesBidDynamicConfigurationService.attachDataForDetail(data.dynamicRows);
				}
				refreshCharacteristicCodeLookup();

				appendCharacterValues([item]);
			};

			// delete column
			service.deleteRows = function deleteRows(items){
				angular.forEach(items, function (item) {
					var selected = salesBidService.getSelected();
					var field = generateColField(item);
					if(data.dynamicRows && data.dynamicRows.length > 0) {
						if (isExistRow(field)) {
							var list = salesBidService.getList();
							angular.forEach(list, function (item) {
								if (selected && item.Id === selected.Id) {
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
						salesBidDynamicConfigurationService.attachDataForDetail(data.dynamicRows);
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
				var colOptions = getColOptions(item);
				var characteristicColumnField = generateColField(item);
				// Characteristic column name
				var characteristicColumnName = item.CharacteristicEntity.Code;
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
				var colOptions = {
					formatter: null,
					editorOptions: null,
					formatterOptions: null
				};
				switch (item.CharacteristicTypeFk) {
					case 10:
						var basicsLookupdataConfigGenerator = $injector.get('basicsLookupdataConfigGenerator');
						colOptions = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForProjectService',
							filter: function(){
								var id = null;
								var col = salesBidService.getCharacteristicColumn();
								if(col) {
									var colArray = _.split(col, '_');
									if(colArray && colArray.length > 0){
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
					default:
						var characteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
						colOptions.formatter = characteristicTypeService.characteristicType2Domain(item.CharacteristicTypeFk);
						colOptions.editorOptions = null;
						colOptions.formatterOptions = null;
						break;
				}
				return colOptions;
			}

			function generateRowConfig(item){
				var rowOptions = getRowOptions(item);
				var characteristicColumnField = generateColField(item);
				// Characteristic column name
				var characteristicColumnName = item.CharacteristicEntity.Code;
				characteristicColumnName = _.isEmpty(item.CharacteristicEntity.DescriptionInfo.Description) ? characteristicColumnName: item.CharacteristicEntity.DescriptionInfo.Description;
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
					validator: function validator(entity, value, model) {
						if (item.IsReadonly) {
							entity[model + '__revert'] = entity[model];
						}
						return true;
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
				var id = item.CharacteristicFk.toString();
				switch (item.CharacteristicTypeFk) {
					case 10:
						var basicsLookupdataConfigGenerator = $injector.get('basicsLookupdataConfigGenerator');
						rowOptions = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'basicsCharacteristicDiscreteValueLookupForProjectService',
							moduleQualifier: 'CharacteristicValue',
							filter: function(){
								return id;
							}
						});
						break;
					default:
						var characteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
						rowOptions.type = characteristicTypeService.characteristicType2Domain(item.CharacteristicTypeFk);
						break;
				}
				return rowOptions;
			}

			function refreshCharacteristicCodeLookup(){
				var basicsCharacteristicCodeLookupService = $injector.get('basicsCharacteristicCodeLookupService');
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
						salesBidDynamicConfigurationService.attachData(data.dynamicColumns);
						if (platformGridAPI.grids.exist(gridId)) {
							var grid = platformGridAPI.grids.element('id', gridId).instance;
							if (grid && grid.getSelectedRows().length === 0) {
								var gridData = grid.getData();
								var selectedItem = salesBidService.getSelected();
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
			service.appendCharacteristicCols = function(itemList){
				var CharacteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory');
				var charaDataService = CharacteristicDataService.getService(salesBidService, sectionId);

				charaDataService.getAllItemBySectionId(true).then( function(response){
					if(response && response.length > 0) {
						angular.forEach(response, function (item) {
							if (!isExistColumn(generateColField(item))) {
								data.dynamicColumns.push(generateColConfig(item));
							}
						});
						salesBidDynamicConfigurationService.attachData(data.dynamicColumns);

						if (platformGridAPI.grids.exist(gridId)) {
							var grid = platformGridAPI.grids.element('id', gridId).instance;
							if (grid && grid.getSelectedRows().length === 0) {
								var gridData = grid.getData();
								var selectedItem = salesBidService.getSelected();
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

			function appendCharacterValues(data, items){
				var prjItems = items ? items : salesBidService.getList() || [];
				var characteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
				angular.forEach(prjItems, function (prjItem) {
					angular.forEach(data, function (item) {
						var characteristicCol = generateColField(item);
						var type = characteristicTypeService.characteristicType2Domain(item.CharacteristicTypeFk);
						var value = characteristicTypeService.convertValue(item.ValueText ,item.CharacteristicTypeFk);
						if (item.ObjectFk === prjItem.Id) {
							prjItem[characteristicCol] = value;
						}
						else if(prjItem[characteristicCol] === undefined){
							prjItem[characteristicCol] = type === 'boolean' ? false : null;
						}
					});
				});

			}
			function isExistColumn(colField){
				var colData = _.filter(data.dynamicColumns, {'id': colField});
				return !(!colData || (colData && colData.length === 0));
			}

			// modifiy value
			service.modifyValue = function(item){
				appendCharacterValues([item]);
				service.refresh();
			};

			// refresh grid
			service.refresh = function(){
				salesBidDynamicConfigurationService.fireRefreshConfigLayout();
				// projectMainDynamicConfigurationService.refreshGridLayout();

			};

			service.isCharacteristicColumn = function isCharacteristicColumn(col) {
				return !!(col && col.isCharacteristic);
			};

			function isCharacteristicColumnExpired(col) {
				return (col && col.isCharacteristicExpired);
			}

			service.getCharacteristicColValue = function getCharacteristicColValue(lineItem, colArray){
				var itemValue = lineItem;
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
						var platformModalService = $injector.get('platformModalService');
						platformModalService.showErrorBox('cloud.common.currentCharacteristicIsExpired', 'cloud.common.errorMessage').then(function () {
							if (Object.prototype.hasOwnProperty.call(item,field)) {
								item[field] = item[field + '__revert'];
								delete item[field + '__revert'];
								salesBidService.gridRefresh();
							}
						});
					} else {
						var prjItem = item;
						var colArray = _.split(field, '.');
						if (prjItem[field] === undefined) {
							prjItem[field] = service.getCharacteristicColValue(angular.copy(prjItem), colArray);
						}

						var characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(salesBidService, sectionId);
						var contextId = parseInt(_.replace(characteristicDataService.getFilter(), 'mainItemId=', ''));
						var currentContextId = item.Id;
						if (contextId === currentContextId) {
							characteristicDataService.syncUpdateCharacteristic(field, prjItem);
						} else {
							characteristicDataService.setUpdateCharOnListLoaded(field, prjItem);
						}
					}
				}
			};

			function isExistRow(rowName){
				if (data.dynamicRows) {
					var rowData = _.filter(data.dynamicRows, {'rid': rowName});
					return !(!rowData || (rowData && rowData.length === 0));
				}
				return false;
			}

			service.appendCharacteristicRows = function appendDefaultCharacteristicRows(response){

				if(response && response.length > 0) {
					angular.forEach(response, function (item) {
						if(!isExistRow(generateColField(item))) {
							var row = generateRowConfig(item);
							row.gid = groupName;
							row.enterStop = true;
							row.visible = true;
							row.tabStop = true;
							data.dynamicRows.push(row);
						}
					});
					salesBidDynamicConfigurationService.attachDataForDetail(data.dynamicRows);
					// refreshCharacteristicCodeLookup();
				}
			};

			service.getStandardConfigForDetailView = function(){
				return salesBidDynamicConfigurationService.getStandardConfigForDetailView();
			};

			service.registerSetConfigLayout = function( callBackFn){
				return salesBidDynamicConfigurationService.registerSetConfigLayout(callBackFn);
			};
			service.unregisterSetConfigLayout = function( callBackFn){
				return salesBidDynamicConfigurationService.unregisterSetConfigLayout(callBackFn);
			};
			return service;
		}]);
})(angular);