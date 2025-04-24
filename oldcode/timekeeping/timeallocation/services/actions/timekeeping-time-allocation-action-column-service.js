/**
 * Created by leo on 06.10.2021.
 */
(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.timeallocation';

	angular.module(moduleName).factory('timekeepingTimeallocationActionColumnService', [
		'$http', '$q', '$injector', 'globals', 'platformGridAPI', 'platformTranslateService',
		'basicsLookupdataLookupDescriptorService', 'mainViewService', 'timekeepingTimeallocationDynamicConfigurationService',
		'_', '$', 'timekeepingTimeallocationActionDataService','timekeepingTimeallocationItemDataService',
		function ($http, $q, $injector, globals, platformGridAPI, platformTranslateService,
			basicsLookupdataLookupDescriptorService, mainViewService, dynamicConfigurationService, _, $, timekeepingTimeallocationActionDataService,timekeepingTimeallocationItemDataService) {
			let service = {};
			// var colConfig = [];
			// var detailConfig = {};
			let data = {dynamicColumns: [], dynamicRows: []};
			let groupName = dynamicConfigurationService.getGroupName();
			let projectId = 0;
			let jobId = 0;
			let selectedColumn;
			// check column; new? delete? modified?
			service.checkColumn = function checkColumn(item) {
				let actionCol = generateColField(item);

				if (isExistColumn(actionCol)) {
					service.modifyValue(item);
				} else {
					service.createColumn(item);
				}
			};

			// create column
			service.createColumn = function createColumn(item) {
				let col = generateColConfig(item);
				// colConfig.push(col);
				data.dynamicColumns.push(col);
				dynamicConfigurationService.attachData(data.dynamicColumns);
				service.appendActionValues([item]);
				service.refresh();
			};

			service.checkRow = function checkRow(item) {
				if (isExistRow(generateColField(item))) {
					service.modifyValue(item);
				} else {
					service.createRow(item);
				}
				// return detailConfig;
			};

			// create row
			service.createRow = function createRow(item) {
				if (!isExistRow(generateColField(item))) {
					let row = generateRowConfig(item);
					row.gid = groupName;
					row.enterStop = true;
					row.visible = true;
					row.tabStop = true;
					data.dynamicRows.push(row);
					dynamicConfigurationService.attachDataForDetail(data.dynamicRows);
				}
				service.appendActionValues([item]);
			};

			function generateColField(item) {
				return 'actioncolumn' + '_' + item.Id.toString();
			}

			function validateActions(entity, value, model) {
				if (entity[model]) {
					entity.DistributedHours -= entity[model];
					entity.DistributedHoursCurrentHeader -= entity[model];
					entity.DistributedHoursTotal  -= entity[model];
				}
				entity.DistributedHours += value;
				entity.DistributedHoursCurrentHeader += value;
				entity.DistributedHoursTotal += value;

				entity.ToDistribute = entity.TotalProductiveHours - entity.DistributedHoursCurrentHeader;
				// if(entity.RecordType === 2){ // #131872 [Time Allocation] Distibuted hours are not deducted for plant [ICW-4827] --> i think the task was missunderstood
				// entity.TotalProductiveHours -= entity.DistributedHours;
				// }  --> reverted because of Task 134691 - [Time Allocation] Reported hours are reduced by distributed hours for plants ......
				return true;
			}

			function asyncValidateActions(entity, value, model) {
				validateActions(entity, value, model);
				entity[model] = value;
				return timekeepingTimeallocationActionDataService.updateAction(entity, model);
			}

			function generateColConfig(item) {
				let colOptions = getColOptions(item);
				let actionColumnField = generateColField(item);
				// Action column name
				let actionColumnName = item.Code;
				actionColumnName = _.isEmpty(item.Description) ? actionColumnName : item.Description;

				return platformTranslateService.translateGridConfig({
					domain: 'quantity',
					type: colOptions.formatter,
					id: actionColumnField,
					editor: colOptions.formatter,
					field: actionColumnField,
					model: actionColumnField,
					name: actionColumnName,
					name$tr$: undefined,
					label: actionColumnName,
					label$tr$: undefined,
					formatter: colOptions.formatter,
					editorOptions: colOptions.editorOptions,
					formatterOptions: colOptions.formatterOptions,
					hidden: false,
					forceVisible: true,
					required: false,
					grouping: {
						title: actionColumnName,
						getter: actionColumnField,
						aggregators: [],
						aggregateCollapsed: true
					},
					isAction: true,
					asyncValidator: asyncValidateActions,
					bulkSupport: true
				});
			}

			// get the formatter for actions
			function getColOptions() {
				let colOptions = {
					formatter: 'quantity',
					editorOptions: {allownull: true},
					formatterOptions: null
				};
				return colOptions;
			}

			function generateRowConfig(item) {
				let rowOptions = getRowOptions(item);
				let actionColumnField = generateColField(item);
				let actionColumnName = item.Code;
				actionColumnName = _.isEmpty(item.Description) ? actionColumnName : item.Description;
				let row = {
					domain: rowOptions.type,
					rid: actionColumnField,
					model: actionColumnField,
					label: actionColumnName,
					label$tr$: undefined,
					required: false,
					readonly: false,
					isAction: true,
					validator: validateActions,
					onPropertyChanged: function (entity, model) {
						selectedColumn = model;
					},
					change: function (entity, field, column) {
						service.fieldChange(entity, field, column);
					}
				};
				return $.extend(row, rowOptions);
			}

			// get the formatter for action
			function getRowOptions(item) {
				let rowOptions = {
					type: 'quantity'
				};
				return rowOptions;
			}

			// append all action from alloction
			service.appendActionCols = function (projectActions, newProjectId, newJobId) {
				if (projectId !== newProjectId || newJobId !== jobId) {
					projectId = newProjectId;
					jobId = newJobId;
					data.dynamicColumns = [];
					dynamicConfigurationService.clearList();
					if (projectActions && projectActions.length > 0) {
						angular.forEach(projectActions, function (item) {
							if (!isExistColumn(generateColField(item)) && item.IsActive &&
								(!jobId && !item.LogisticJobFk || jobId && item.LogisticJobFk && item.LogisticJobFk === jobId)) {
								data.dynamicColumns.push(generateColConfig(item));
							}
						});
						dynamicConfigurationService.attachData(data.dynamicColumns);
					}
					service.appendActionRows(projectActions);
					timekeepingTimeallocationItemDataService.gridRefresh();
					service.refresh();
				}
			};

			service.appendActionValues = function appendActionValues(items, projectActions) {
				let allocItems = items;
				angular.forEach(allocItems, function (allocItem) {
					// let assignedHours = 0;
					angular.forEach(projectActions, function (item) {
						let actionCol = generateColField(item);
						let mapItem = _.filter(allocItem.TimeAllocations2ProjectActions, {PrjActionFk: item.Id});
						if (mapItem.length > 0) {
							allocItem[actionCol] = mapItem[0].AssignedHours;
							// assignedHours += mapItem[0].AssignedHours;
						}
					});
					allocItem.ToDistribute = allocItem.TotalProductiveHours - allocItem.DistributedHoursCurrentHeader;
				});
				service.refresh();
			};

			function isExistColumn(colField) {
				let colData = _.filter(data.dynamicColumns, {'id': colField});
				return !(!colData || (colData && colData.length === 0));
			}

			// modifiy value
			service.modifyValue = function (item) {
				service.appendActionValues([item]);
				service.refresh();
			};

			// refresh grid
			service.refresh = function () {
				dynamicConfigurationService.fireRefreshConfigLayout();

			};

			service.isActionColumn = function isActionColumn(col) {
				return !!(col && col.isAction);
			};

			service.fieldChange = function fieldChange(item, field, column) {
				if (service.isActionColumn(column)) { // action column
					timekeepingTimeallocationActionDataService.updateAction(item, field);
				}
			};

			function isExistRow(rowName) {
				if (data.dynamicRows) {
					let rowData = _.filter(data.dynamicRows, {'rid': rowName});
					return !(!rowData || (rowData && rowData.length === 0));
				}
				return false;
			}

			service.appendActionRows = function appendActionRows(projectAction) {
				data.dynamicRows = [];
				dynamicConfigurationService.clearDetail();
				if (projectAction && projectAction.length > 0) {
					angular.forEach(projectAction, function (item) {
						if (!isExistRow(generateColField(item))&& item.IsActive &&
							(!jobId && !item.LogisticJobFk || jobId && item.LogisticJobFk && item.LogisticJobFk === jobId)) {
							let row = generateRowConfig(item);
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
		}]);
})(angular);