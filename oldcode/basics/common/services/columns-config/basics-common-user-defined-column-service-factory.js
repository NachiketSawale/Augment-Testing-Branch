/**
 * Created by myh on 08/16/2021.
 */

(function (angular) {
	'use strict';

	let moduleName = 'basics.common';

	angular.module(moduleName).constant('userDefinedColumnTableIds', {
		EstimateLineItem: 0,
		EstimateResource: 1,
		BasicsCostCode: 2,
		BasicsCostCodePriceList: 3,
		ProjectCostCode: 4,
		ProjectCostCodeJobRate: 5,
		Assembly: 6,
		AssemblyResources: 7,
		Boq: 8
	});

	angular.module(moduleName).factory('basicsCommonUserDefinedColumnServiceFactory', ['globals', '$translate', '$http', '_', '$q', '$injector', 'basicsCommonUserDefinedColumnConfigService',
		'basicsCommonUserDefinedColumnValueService', 'userDefinedColumnTableIds', 'platformRuntimeDataService', 'platformFormConfigService',
		function (globals, $translate, $http, _, $q, $injector, basicsCommonUserDefinedColumnConfigService, basicsCommonUserDefinedColumnValueService, userDefinedColumnTableIds, platformRuntimeDataService, platformFormConfigService) {

			function createService(dynamicConfigurationService, tableId, dataServiceProvider, columnOptions, serviceOptions, mainModuleName) {
				let service = {},
					data = {
						customizeConfig: [],
						allDynamicColumns: null,
						dynamicColumns: null,
						dynamicRows: [],
						detailScope: null,
						userDefinedColumnFields : [],
						allUserDefinedColumnFields : []
					},
					UserDefinedColumnValueCompleteDto = {
						ModuleName : mainModuleName,
						UserDefinedColumnValueToUpdate: [],
						UserDefinedColumnValueToCreate: [],
						UserDefinedColumnValueToDelete: []
					},
					dataService,
					dynamicColumnConfigName = 'userDefinedConfig';

				if (!dataService) {
					dataService = _.isString(dataServiceProvider) ? $injector.get(dataServiceProvider) : dataServiceProvider;
				}

				let valueService = basicsCommonUserDefinedColumnValueService.createNewComplete(UserDefinedColumnValueCompleteDto);

				function createColumn(columnConfig, configExtend) {
					let col = {};

					col.cssClass = 'text-right';
					col.editor$name = 'quantity';
					col.formatter$name = 'quantity';
					col.searchable = false;
					col.sortable = true;
					col.id = configExtend.idPreFix + 'UDP' + columnConfig.Id + configExtend.idSuffix;
					col.field = 'ColVal' + columnConfig.Id + (_.isString(configExtend.fieldSuffix) ? configExtend.fieldSuffix : '');
					col.domain = 'quantity';

					col.name = columnConfig.DescriptionInfo.Description + configExtend.nameSuffix;
					col.name$tr$ = columnConfig.DescriptionInfo.Translated + configExtend.nameSuffix;
					col.name$tr$param$ = undefined;
					col.isDynamic = true;
					col.isTotal = false;
					col.required = false;
					col.hidden = false;
					col.formatter = 'money';
					col.pinned = false;
					col.readonly = false;
					col.editor = 'money';

					col.grouping = {
						title: col.name$tr$,
						getter: col.field,
						aggregators: [],
						aggregateCollapsed: true
					};

					if (configExtend.overloads) {
						angular.extend(col, configExtend.overloads);
					}

					return col;
				}

				function createDynamicColumns(optional, config) {
					let allColumns = [],
						columns = [],
						columnConfigs = config ? config : basicsCommonUserDefinedColumnConfigService.getAllDynamicColumnConfig();

					if (!columnConfigs || columnConfigs.length === 0) {
						data.allDynamicColumns = allColumns;
						data.dynamicColumns = columns;

						return;
					}

					let userDefinedColumnFields = [],
						allUserDefinedColumnFields = [],
						createExtendColumn = false,
						createTotalColumn = false,
						costunitColumnConfigOptional = {
							idPreFix: '',
							idSuffix: 'costunit',
							nameSuffix: ' ' + $translate.instant('basics.common.userDefinedColumn.costUnitSuffix')
						},
						totalColumnConfigOptional = {
							idPreFix: '',
							idSuffix: 'total',
							fieldSuffix: 'Total',
							nameSuffix: ' ' + $translate.instant('basics.common.userDefinedColumn.totalSuffix')
						},
						additionalColumnConfigOptional = {
							idPreFix: '',
							idSuffix: '',
							fieldSuffix: '',
							nameSuffix: ''
						};

					if (optional) {
						if (optional.columns) {
							angular.extend(costunitColumnConfigOptional, optional.columns);
						}

						createExtendColumn = _.isBoolean(optional.additionalColumns) ? optional.additionalColumns : createExtendColumn;
						if (createExtendColumn && optional.additionalColumnOption) {
							angular.extend(additionalColumnConfigOptional, optional.additionalColumnOption);
						}

						createTotalColumn = _.isBoolean(optional.addTotalColumn) ? optional.addTotalColumn : createTotalColumn;
						if (createTotalColumn && optional.totalColumns) {
							angular.extend(totalColumnConfigOptional, optional.totalColumns);
						}
					}

					_.forEach(columnConfigs, function (columnConfig) {
						let column = null, totalColumn = null, extendColumn = null, isLive = columnConfig.IsLive;

						column = createColumn(columnConfig, costunitColumnConfigOptional);
						allColumns.push(column);
						if(userDefinedColumnFields.indexOf(column.field) === -1){
							userDefinedColumnFields.push(column.field);
							allUserDefinedColumnFields.push(column.field);
						}
						if (isLive) {columns.push(column);}

						if (createTotalColumn) {
							totalColumn = createColumn(columnConfig, totalColumnConfigOptional);
							totalColumn.isTotal = true;
							if(allUserDefinedColumnFields.indexOf(totalColumn.field) === -1){
								allUserDefinedColumnFields.push(totalColumn.field);
							}
							if (isLive) {columns.push(totalColumn);}
							allColumns.push(totalColumn);
						}

						if (createExtendColumn) {
							extendColumn = createColumn(columnConfig, additionalColumnConfigOptional);
							extendColumn.isExtend = true;
							if (isLive) {columns.push(extendColumn);}
							allColumns.push(extendColumn);
						}
					});

					data.allDynamicColumns = allColumns;
					data.dynamicColumns = columns;
					data.userDefinedColumnFields = userDefinedColumnFields;
					data.allUserDefinedColumnFields = allUserDefinedColumnFields;
					valueService.setUserDefinedColums(data.allDynamicColumns);

					return data.dynamicColumns;
				}

				function generateDynamicRows(){
					data.dynamicRows = [];
					if (data.dynamicColumns && data.dynamicColumns.length > 0) {
						data.dynamicColumns.forEach(function (column) {
							let row = generateRowConfig(column);
							row.gid = 'userDefinedColumns';
							row.enterStop = true;
							row.visible = true;
							row.tabStop = true;
							data.dynamicRows.push(row);
						});
					}

					return data.dynamicRows;
				}

				function getDynamicColumns() {
					return createDynamicColumns(columnOptions);
				}

				service.getAllDynamicColumns = function() {
					if (_.isNull(data.allDynamicColumns)) {
						createDynamicColumns(columnOptions);
					}

					return data.allDynamicColumns;
				};

				function getDynamicColumnsForLookUp() {
					createDynamicColumns(columnOptions);

					return data.dynamicColumns;
				}

				function getDynamicColumnsWithConfig(config) {
					createDynamicColumns(columnOptions, config);

					return data.dynamicColumns;
				}

				function getDynamicColumnsForList() {
					return data.dynamicColumns;
				}

				function getDynamicColumnsForDetail() {
					return data.dynamicRows;
				}

				function processColConfig(config){
					// for list container
					createDynamicColumns(columnOptions, config);

					// for detail Container
					generateDynamicRows();
				}

				function getDynamicColumnsAsync() {
					let defer = $q.defer();

					let dynamicColumnConfigs = basicsCommonUserDefinedColumnConfigService.getAllDynamicColumnConfig();

					if (_.isNull(dynamicColumnConfigs)) {
						basicsCommonUserDefinedColumnConfigService.load().then(function () {
							defer.resolve(getDynamicColumns());
						});
					} else {
						defer.resolve(getDynamicColumns());
					}

					return defer.promise;
				}

				function processUDPDynamicColumns(dynamicColumnService, UDPCongif, itemList, udpValueList){
					// let UDPCongif = readData.boqUserDefinedCostConfig;
					processColConfig(UDPCongif);
					service.clearValueService();

					// 1). Bind UDP data to entity
					service.attachDataToColumnFromColVal(itemList, udpValueList);

					// 2).Provide upd column config for list.
					let udpColumns = service.getDynamicColumnsForList();
					dynamicColumnService.attachDynColConfigForList({'userDefinedConfig': udpColumns});
					// 3).Provide upd column config for detail.
					let udpRows = service.getDynamicColumnsForDetail();
					dynamicColumnService.attachDynColConfigForDetail({userDefinedDetailConfig: udpRows});
				}

				service.processUDPDynamicColumns =  processUDPDynamicColumns;

				service.processColConfig = processColConfig;

				service.getDynamicColumnsAsync = getDynamicColumnsAsync;

				service.getDynamicColumns = getDynamicColumns;

				service.getDynamicColumnsForLookUp = getDynamicColumnsForLookUp;

				service.getDynamicColumnsWithConfig = getDynamicColumnsWithConfig;

				service.getDynamicColumnsForList = getDynamicColumnsForList;

				service.getDynamicColumnsForDetail = getDynamicColumnsForDetail;
				// abolish
				service.loadAndAttachUserDefinedColumn = function (items, reload) {
					return getDynamicColumnsAsync(reload).then(function (columns) {
						if (columns && columns.length > 0) {
							dynamicConfigurationService.attachData({userDefinedConfig: columns});
							dynamicConfigurationService.fireRefreshConfigLayout();

							return attachDataToColumn(items);
						}
					});
				};

				function loadDynamicColumns() {

					return getDynamicColumnsAsync().then(function (columns) {

						if (columns && columns.length > 0) {
							let data = {};
							data[dynamicColumnConfigName] = columns;
							if(_.isFunction(dynamicConfigurationService.attachData)){
								dynamicConfigurationService.attachData(data);
							}
						} else {
							if(_.isFunction(dynamicConfigurationService.detachData)){
								dynamicConfigurationService.detachData(dynamicColumnConfigName);
							}
						}

						if(_.isFunction(dynamicConfigurationService.fireRefreshConfigLayout)){
							dynamicConfigurationService.fireRefreshConfigLayout();
						}
					});
				}

				service.loadDynamicColumns = loadDynamicColumns;

				function attachDataToColumn(items, gridId) {
					let deferred = $q.defer();

					if (items && items.length > 0) {
						let requestData = {TableId: tableId};
						if (serviceOptions) {
							if (_.isFunction(serviceOptions.getMultiRequestData)) {
								angular.extend(requestData, serviceOptions.getMultiRequestData(items));
							} else if (_.isFunction(serviceOptions.getRequestData)) {
								angular.extend(requestData, serviceOptions.getRequestData(items[0]));
							}
						}

						let filterFn;
						if (serviceOptions && serviceOptions.getFilterFn && _.isFunction(serviceOptions.getFilterFn)) {
							filterFn = serviceOptions.getFilterFn(tableId);
						} else {
							filterFn = function (e) {
								return e.TableId === tableId;
							};
						}

						let isReadOnlyFn = null;
						if (serviceOptions && serviceOptions.isReadOnlyItem && _.isFunction(serviceOptions.isReadOnlyItem)) {
							isReadOnlyFn = serviceOptions.isReadOnlyItem;

							items.forEach(function (item) {
								let isReadOnly = isReadOnlyFn(item);

								service.setColumnsReadOnly(item, isReadOnly);
							});
						}

						let columns = _.filter(data.allDynamicColumns, function (column) {
							return !column.isExtend;
						});
						valueService.loadAndAttachData(requestData, items, filterFn, columns, null, isReadOnlyFn).then(function (items) {

							if (serviceOptions && serviceOptions.attachExtendDataToColumn) {
								let extendRequestData = serviceOptions.extendDataColumnOption.getRequestData(items[0]);
								let extendFilterFn = serviceOptions.extendDataColumnOption.getFilterFn(tableId);
								let extendColumns = _.filter(data.allDynamicColumns, function (column) {
									return column.isExtend;
								});
								valueService.loadAndAttachData(extendRequestData, items, extendFilterFn, extendColumns, serviceOptions.extendDataColumnOption.fieldSuffix, isReadOnlyFn).then(function (items) {
									if (dataService) {
										dataService.gridRefresh();
									}

									deferred.resolve(items);
								});
							} else {
								if (gridId) {
									$injector.get('platformGridAPI').grids.refresh(gridId);
								} else if (dataService) {
									dataService.gridRefresh();
								}

								deferred.resolve(items);
							}
						});
					}else{
						deferred.resolve();
					}

					return deferred.promise;
				}

				service.attachUpdatedValueToColumn = function(items, updatedValues, isFromUpdated){
					valueService.updateValueList(updatedValues);

					service.attachDataToColumnFromColVal(items, updatedValues, isFromUpdated);
				};

				service.attachDataToColumnFromColVal = function(items, values, isFromUpdated){
					if(_.isArray(items)){
						let columns = _.filter(data.allDynamicColumns, function (column) {
							return !column.isExtend;
						});

						let filterFn;
						if (serviceOptions && serviceOptions.getFilterFn && _.isFunction(serviceOptions.getFilterFn)) {
							filterFn = serviceOptions.getFilterFn(tableId);
						} else {
							filterFn = function (e) {
								return e.TableId === tableId;
							};
						}

						valueService.attachData2Items(columns, items, filterFn, values, null, isFromUpdated);
					}
				};

				function loadUserDefinedColumnDetail(scope) {
					data.detailScope = scope ? scope : data.detailScope;
					data.dynamicRows = [];

					return getDynamicColumnsAsync().then(function (columns) {
						if (columns && columns.length > 0) {
							columns.forEach(function (column) {
								let row = generateRowConfig(column);
								row.gid = 'userDefinedColumns';
								row.enterStop = true;
								row.visible = true;
								row.tabStop = true;
								data.dynamicRows.push(row);
							});

							dynamicConfigurationService.attachDataForDetail({userDefinedDetailConfig: data.dynamicRows});

							refreshDetailGrid();
						}
					});
				}

				function refreshDetailGrid() {
					let scope = data.detailScope;
					if (scope) {
						let configure = dynamicConfigurationService.getStandardConfigForDetailView();
						angular.extend(scope.formOptions.configure, configure);
						platformFormConfigService.initialize(scope.formOptions, scope.formOptions.configure);
						scope.$broadcast('form-config-updated');
					}
				}

				service.getDynamicColumnConfig = basicsCommonUserDefinedColumnConfigService.getDynamicColumnConfig;

				service.loadUserDefinedColumnDetail = loadUserDefinedColumnDetail;

				service.attachDataToColumn = attachDataToColumn;

				service.attachEmptyDataToColumn = function (item) {
					valueService.attachEmptyData2Column(data.allDynamicColumns, item);
				};

				function generateRowConfig(column) {
					return {
						domain: column.domain,
						rid: column.id,
						model: column.field,
						label: column.name,
						label$tr$: column.name$tr$,
						required: column.required,
						readonly: column.readonly,
						options:column.options,
						type: 'money',
						change: function (entity, field) {
							service.fieldChange(entity, field, entity[field]);
						}
					};
				}

				service.update = function () {
					return valueService.update();
				};

				service.fieldChange = function (item, field, newValue) {
					if (data.allUserDefinedColumnFields.indexOf(field) !== -1) {
						let modifiedItem = {TableId: tableId};
						if (serviceOptions && serviceOptions.getModifiedItem && _.isFunction(serviceOptions.getModifiedItem)) {
							angular.extend(modifiedItem, serviceOptions.getModifiedItem(tableId, item));
						}
						valueService.handleUserDefinedColumnValueChanged(modifiedItem, item, field, newValue);
					}
				};

				service.markUdpAsModified = function (item){
					let modifiedItem = {TableId: tableId};
					if (serviceOptions && serviceOptions.getModifiedItem && _.isFunction(serviceOptions.getModifiedItem)) {
						angular.extend(modifiedItem, serviceOptions.getModifiedItem(tableId, item));
					}
					_.each(data.allUserDefinedColumnFields, function (fied){
						modifiedItem[fied] = item[fied];
					});

					valueService.handleUserDefinedColumnValueChanged(modifiedItem, item);
				};

				service.handleEntitiesDeleted = function (entities, isDeleted) {
					if (entities && entities.length > 0) {
						entities.forEach(function (entity) {
							let deletedItem = {TableId: tableId};
							if (serviceOptions && serviceOptions.getModifiedItem && _.isFunction(serviceOptions.getModifiedItem)) {
								angular.extend(deletedItem, serviceOptions.getModifiedItem(tableId, entity));
							}

							valueService.handleUserDefinedColumnValueDeleted(deletedItem, isDeleted);
						});
					}
				};

				function setReadOnly(item, field, readonly) {
					platformRuntimeDataService.readonly(item, [{
						field: field,
						readonly: readonly
					}]);
				}

				service.setColumnsReadOnly = function (item, readonly) {
					let userDefinedColumns = service.getDynamicColumns();

					userDefinedColumns.forEach(function (column) {
						setReadOnly(item, column.field, readonly);
					});
				};

				service.getValueList = valueService.getList;

				service.getListAsync = valueService.getListAsync;

				service.getItemAsync = valueService.getItemAsync;

				service.updateValueList = valueService.updateValueList;

				service.getData = valueService.getData;

				service.getUpdateData = valueService.getUpdateData;

				service.isNeedUpdate = valueService.isNeedUpdate;

				service.handleUpdateDone = valueService.handleUpdateDone;

				service.clear = function() {};

				function onDynamicColumnsReloaded() {
					data.allDynamicColumns = null;
					data.dynamicColumns = null;
					loadUserDefinedColumnDetail();
					loadDynamicColumns();
					service.clear();
					valueService.clear();
				}

				service.initReloadFn = function () {
					basicsCommonUserDefinedColumnConfigService.onReloaded.register(onDynamicColumnsReloaded);
				};

				service.onDestroy = function () {
					service.clear();
					basicsCommonUserDefinedColumnConfigService.onReloaded.unregister(onDynamicColumnsReloaded);
				};

				service.reloadDynamicColumns = function () {
					valueService.clear();
					basicsCommonUserDefinedColumnConfigService.reLoad();
				};

				service.clearValueService = valueService.clear;

				service.clearValueComplete = valueService.clearCompleteDto;

				service.getUserDefinedColumnFields = function(){
					return data.userDefinedColumnFields;
				};

				service.isUserDefinedColumnField = function (field) {
					let userDefinedColum = _.find(data.allDynamicColumns, function (item) {
						return item.field === field;
					});

					return !_.isEmpty(userDefinedColum);
				};

				service.getModuleName = function(){
					return mainModuleName;
				};

				service.copyNewUserDefinedColumnItem = function(oldItemValue, newItemValue){
					let oldValue = {TableId: tableId};
					let newValue = {TableId: tableId};
					if (serviceOptions && serviceOptions.getModifiedItem && _.isFunction(serviceOptions.getModifiedItem)) {
						angular.extend(oldValue, serviceOptions.getModifiedItem(tableId, oldItemValue));
						angular.extend(newValue, serviceOptions.getModifiedItem(tableId, newItemValue));
						return valueService.copyNewUserDefinedColumnItem(oldValue,newValue);
					}
					return;
				};

				return service;
			}

			return {
				getService: function (dynamicConfigurationService, tableId, dataServiceProvider, columnOptions, serviceOptions, mainModuleName) {
					return createService(dynamicConfigurationService, tableId, dataServiceProvider, columnOptions, serviceOptions, mainModuleName);
				}
			};

		}]);
})(angular);
