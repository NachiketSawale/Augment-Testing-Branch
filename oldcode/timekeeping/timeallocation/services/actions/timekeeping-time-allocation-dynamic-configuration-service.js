(function (angular) {

	'use strict';
	let moduleName = 'timekeeping.timeallocation';

	angular.module(moduleName).factory('timekeepingTimeallocationDynamicConfigurationService', [
		'PlatformMessenger', 'platformGridAPI', 'platformGridControllerService', 'platformTranslateService', 'basicsCommonChangeColumnConfigService',
		'timekeepingTimeallocationItemLayoutService', 'timekeepingTimeallocationItemValidationService', '_',
		function (PlatformMessenger, platformGridAPI, platformGridControllerService, platformTranslateService, basicsCommonChangeColumnConfigService,
			timekeepingTimeallocationItemLayoutService, timekeepingTimeallocationItemValidationService, _) {

			let data = {
				parentScope: {},
				isInitialized: false,

				// Unique identifier for current container
				uuid: 'a3b5c55c64f74de89c84f8265b8cef42',

				groupName: 'actions',

				onConfigLayoutChange: new PlatformMessenger(),

				allColumns: [],

				// dynamic columns dictionary for list
				dynamicColDictionaryForList: {},

				dynamicColDictionaryForDetail: {}
			};

			const baseConfigurationService = timekeepingTimeallocationItemLayoutService;

			const baseValidationService = timekeepingTimeallocationItemValidationService;

			const service = {isExtendService: true};

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

				getGroupName: getGroupName,

				clearDetail: clearDetail,
				clearList: clearList
			});

			function clearDetail() {
				data.dynamicColDictionaryForDetail = {};
			}

			function clearList() {
				data.dynamicColDictionaryForList = {};
			}

			// Attach column as object
			function attachData(dataDictionary, dataObject) {
				if (!angular.isObject(dataObject)) {
					return;
				}

				for (let prop in dataObject) {
					if (dataObject.hasOwnProperty(prop)) {
						dataDictionary[prop] = dataObject[prop];
						if (!baseValidationService.hasOwnProperty('validate' + dataDictionary[prop].id)){
							baseValidationService['asyncValidate' + dataDictionary[prop].id] = dataDictionary[prop].asyncValidator;
						}
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
				let pos = _.findKey(dataDictionary, function (col) {
					return col.id === dataObjectKey.id;
				});
				if (pos >= 0) {
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
				let columnsToAttachForList = [];

				for (let prop in dataDictionary) {
					if (dataDictionary.hasOwnProperty(prop)) {
						columnsToAttachForList = columnsToAttachForList.concat(dataDictionary[prop]);
					}
				}

				return columnsToAttachForList;
			}

			function getDtoScheme() {
				let baseDtoScheme = baseConfigurationService.getDtoScheme();

				return baseDtoScheme;
			}

			function getStandardConfigForListView() {
				// add the extend columns to config for list
				let columnsToAttachForList = getExtendColumns(data.dynamicColDictionaryForList);

				let configForListCopy = angular.copy(baseConfigurationService.getStandardConfigForListView());

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
				let rowsToAttachForDetail = getExtendColumns(data.dynamicColDictionaryForDetail);

				let configForDetailCopy = angular.copy(baseConfigurationService.getStandardConfigForDetailView());

				if (rowsToAttachForDetail && rowsToAttachForDetail.length > 0) {
					let index = -1;
					if (configForDetailCopy && configForDetailCopy.groups) {
						index = _.findIndex(configForDetailCopy.groups, {'gid': data.groupName});
					}
					if (index < 0) {
						let group = {
							gid: data.groupName,
							header: platformTranslateService.instant('timekeeping.timeallocation.groupNameActions', undefined, true),
							header$tr$: 'timekeeping.timeallocation.groupNameActions',
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
							_.forEach(configForDetailCopy.groups[index].rows, function (row) {
								_.remove(configForDetailCopy.rows, function (row) {
									return row.gid === data.groupName;
								});
								delete configForDetailCopy.rowsDict[row.rid];
							});
							configForDetailCopy.groups[index].rows = [];
						}
					}
					let count = configForDetailCopy.groups[index].rows.length;

					_.forEach(rowsToAttachForDetail, function (row) {
						row.sortOrder = ++count;
						configForDetailCopy.rows.push(row);
						configForDetailCopy.groups[index].rows.push(row);
						if (configForDetailCopy.rowsDict) {
							configForDetailCopy.rowsDict[row.rid] = row;
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
						let gridId = data.uuid;
						let grid = platformGridAPI.grids.element('id', gridId);
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
				let columns = dynamicColumns ? dynamicColumns : service.getStandardConfigForListView().columns; // grid.columns.current;

				return basicsCommonChangeColumnConfigService.mergeWithViewConfig(gridId, columns);
			}

			function getGroupName() {
				return data.groupName;
			}

			return service;
		}]);
})(angular);
