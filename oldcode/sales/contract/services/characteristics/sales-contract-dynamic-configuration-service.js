/**
 * Created by postic on 28.11.2022.
 */

(function (angular) {

	'use strict';
	var moduleName = 'sales.contract';

	angular.module(moduleName).factory('salesContractDynamicConfigurationService', [
		'_', 'PlatformMessenger', 'platformGridAPI', 'platformGridControllerService', 'platformTranslateService', 'basicsCommonChangeColumnConfigService',
		'salesContractConfigurationService', 'salesContractValidationService',
		function (_, PlatformMessenger, platformGridAPI, platformGridControllerService, platformTranslateService, basicsCommonChangeColumnConfigService,
			salesContractConfigurationService, salesContractValidationService) {

			var data = {
				parentScope: {},
				isInitialized: false,

				// Unique identifier for current container
				uuid: '34d0a7ece4f34f2091f7ba6c622ff04d',

				groupName: 'characteristics',

				onConfigLayoutChange: new PlatformMessenger(),

				allColumns: [],

				// dynamic columns dictionary for list
				dynamicColDictionaryForList: {},

				dynamicColDictionaryForDetail: {}
			};

			var baseCongigurationService = salesContractConfigurationService;

			var baseValidationService = salesContractValidationService;

			// var service = { isExtendService : true, isDynamicReadonlyConfig: true };
			var service = { isExtendService : true };

			angular.extend(service, {
				registerSetConfigLayout: registerSetConfigLayout,
				unregisterSetConfigLayout: unregisterSetConfigLayout,
				fireRefreshConfigLayout: fireRefreshConfigLayout,

				refreshGridLayout: refreshGridLayout,

				applyToScope: applyToGridId,

				attachData: attachDataForList,
				detachData: detachDataForList,

				// for detail form
				attachDataForDetail: attachDataForDetail,
				detachDataForDetail: detachDataForDetail,

				getDtoScheme: getDtoScheme,
				getStandardConfigForListView: getStandardConfigForListView,
				getStandardConfigForDetailView: getStandardConfigForDetailView,
				resolveColumns: resolveColumns,

				getGroupName: getGroupName
			});

			// Attach column as object
			function attachData(dataDictionary, dataObject) {
				if (!angular.isObject(dataObject)) {
					return;
				}

				for (var prop in dataObject) {
					if (Object.prototype.hasOwnProperty.call(dataObject,prop)) {
						dataDictionary[prop] = dataObject[prop];
					}
				}
			}

			function attachDataForList(dataObject) {
				attachData(data.dynamicColDictionaryForList, dataObject);
			}

			function attachDataForDetail(dataObject) {
				attachData(data.dynamicColDictionaryForDetail, dataObject);
			}

			// detach columns
			function detachData(dataDictionary, dataObjectKey) {
				var pos = _.findKey(dataDictionary, function (col) {
					return col.id === dataObjectKey.id;
				});
				if(pos >= 0) {
					delete dataDictionary[pos];
				}
			}

			function detachDataForList(dataObjectKey) {
				detachData(data.dynamicColDictionaryForList, dataObjectKey);
			}

			function detachDataForDetail(dataObjectKey) {
				detachData(data.dynamicColDictionaryForDetail, dataObjectKey);
			}

			function getExtendColumns(dataDictionary) {
				var columnsToAttachForList = [];

				for (var prop in dataDictionary) {
					if (Object.prototype.hasOwnProperty.call(dataDictionary,prop)) {
						columnsToAttachForList = columnsToAttachForList.concat(dataDictionary[prop]);
					}
				}

				return columnsToAttachForList;
			}

			function getDtoScheme() {
				var baseDtoScheme = baseCongigurationService.getDtoScheme();

				return baseDtoScheme;
			}

			function getStandardConfigForListView() {
				// add the extend columns to config for list
				var columnsToAttachForList = getExtendColumns(data.dynamicColDictionaryForList);

				var configForListCopy = angular.copy(baseCongigurationService.getStandardConfigForListView());

				configForListCopy.columns = configForListCopy.columns.concat(columnsToAttachForList);

				if (configForListCopy.addValidationAutomatically && baseValidationService) {
					platformGridControllerService.addValidationAutomatically(configForListCopy.columns, baseValidationService);
				}

				if (!configForListCopy.isTranslated) {
					platformTranslateService.translateGridConfig(configForListCopy.columns);
					configForListCopy.isTranslated = true;
				}

				return configForListCopy;
			}


			function getStandardConfigForDetailView() {
				// add the extend columns to config for detail
				var rowsToAttachForDetail = getExtendColumns(data.dynamicColDictionaryForDetail);

				// var configForDetailCopy = angular.copy(baseCongigurationService.getStandardConfigForDetailView());
				var configForDetailCopy = baseCongigurationService.getStandardConfigForDetailView();

				if (rowsToAttachForDetail && rowsToAttachForDetail.length > 0) {
					var index = -1;
					if (configForDetailCopy && configForDetailCopy.groups) {
						index = _.findIndex(configForDetailCopy.groups, {'gid': data.groupName});
					}
					if (index < 0) {
						var group = {
							gid: data.groupName,
							header: platformTranslateService.instant('project.main.characteristics', undefined, true),
							header$tr$: 'project.main.characteristics',
							sortOrder: configForDetailCopy.groups.length + 1,
							isOpen: true,
							showHeader: true,
							visible: true,
							rows: []
						};
						index = configForDetailCopy.groups.length;
						configForDetailCopy.groups.push(group);
						if (configForDetailCopy.groupsDict) {
							configForDetailCopy.groupsDict[group.gid] = group;
						}

					} else {
						if (configForDetailCopy.groups[index].rows.length > 0) {
							_.forEach(configForDetailCopy.groups[index].rows, function(row){
								_.remove(configForDetailCopy.rows, function(row){
									return row.gid === data.groupName;
								});
								delete configForDetailCopy.rowsDict[row.rid];
							});
							configForDetailCopy.groups[index].rows = [];
						}
					}
					var count = configForDetailCopy.groups[index].rows.length;

					_.forEach(rowsToAttachForDetail, function (row) {
						if (configForDetailCopy.rowsDict && _.isNil(configForDetailCopy.rowsDict[row.rid])) {
							row.sortOrder = ++count;
							configForDetailCopy.rows.push(row);
							configForDetailCopy.groups[index].rows.push(row);
							if (configForDetailCopy.rowsDict) {
								configForDetailCopy.rowsDict[row.rid] = row;
							}
						}
					});
					// configForDetailCopy.rows = configForDetailCopy.rows.concat(rowsToAttachForDetail);
				}

				return configForDetailCopy;
			}

			function registerSetConfigLayout(callBackFn) {
				data.onConfigLayoutChange.register(callBackFn);
			}

			function unregisterSetConfigLayout(callBackFn) {
				data.onConfigLayoutChange.unregister(callBackFn);
			}

			function fireRefreshConfigLayout() {
				// data.onConfigLayoutChange.fire(arguments);
				data.onConfigLayoutChange.fire();

				refreshGridLayout();
			}

			function applyToGridId(scope) {
				data.parentScope = scope;
				data.uuid = scope.gridId;
			}

			function refreshGridLayout() {
				if (data) {
					if (data.uuid) {
						var gridId = data.uuid;
						var grid = platformGridAPI.grids.element('id', gridId);
						if (grid) {
							data.allColumns = resolveColumns(gridId);

							platformGridAPI.columns.configuration(gridId, angular.copy(data.allColumns));
							platformGridAPI.grids.resize(gridId); // persist scroll bars
						}
					}
				}
			}

			// Resolve column order, visible, hidden status
			function resolveColumns(gridId, dynamicColumns) {
				// Take all columns again and map it with the cached grid's column configuration for sorting and hide/show status
				var columns = dynamicColumns ? dynamicColumns : service.getStandardConfigForListView().columns; // grid.columns.current;

				return basicsCommonChangeColumnConfigService.mergeWithViewConfig(gridId, columns);
			}

			function getGroupName(){
				return data.groupName;
			}

			return service;
		}]);
})(angular);