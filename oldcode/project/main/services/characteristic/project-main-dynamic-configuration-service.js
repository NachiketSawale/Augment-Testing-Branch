(function (angular) {

	'use strict';
	var moduleName = 'project.main';

	angular.module(moduleName).factory('projectMainDynamicConfigurationService', ['_',
		'PlatformMessenger', 'platformGridAPI', 'platformGridControllerService', 'platformTranslateService', 'basicsCommonChangeColumnConfigService',
		'projectMainStandardConfigurationService', 'projectMainProjectValidationService',
		function (_, PlatformMessenger, platformGridAPI, platformGridControllerService, platformTranslateService, basicsCommonChangeColumnConfigService,
			projectMainStandardConfigurationService, projectMainProjectValidationService) {

			let data = {
				parentScope: {},
				isInitialized: false,

				// Unique identifier for current container
				uuid: '713b7d2a532b43948197621ba89ad67a',

				groupName: 'characteristics',

				onConfigLayoutChange: new PlatformMessenger(),

				allColumns: [],

				// dynamic columns dictionary for list
				dynamicColDictionaryForList: {},

				dynamicColDictionaryForDetail: {}
			};

			let baseCongigurationService = projectMainStandardConfigurationService;

			let baseValidationService = projectMainProjectValidationService;

			// var service = { isExtendService : true, isDynamicReadonlyConfig: true };
			let service = { isExtendService : true };

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

				for (let prop in dataObject) {
					if (dataObject.hasOwnProperty(prop)) {
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
				let pos = _.findKey(data.dynamicColDictionaryForDetail, function (row) {
					return row.rid === dataObjectKey.rid;
				});
				if (pos >= 0) {
					delete data.dynamicColDictionaryForDetail[pos];
				}
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
				return baseCongigurationService.getDtoScheme();
			}

			function getStandardConfigForListView() {
				// add the extend columns to config for list
				let columnsToAttachForList = getExtendColumns(data.dynamicColDictionaryForList);

				let configForListCopy = angular.copy(baseCongigurationService.getStandardConfigForListView());

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

				let configForDetailCopy = baseCongigurationService.getStandardConfigForDetailView();

				if (rowsToAttachForDetail && rowsToAttachForDetail.length > 0) {
					let existingRow = null;
					let index = -1;
					if (configForDetailCopy && configForDetailCopy.groups) {
						index = _.findIndex(configForDetailCopy.groups, {'gid': data.groupName});
					}
					_.forEach(configForDetailCopy.groups, function (group) {
						_.remove(group.rows, function (row) {
							let result = false;
							if (_.startsWith(row.rid, 'charactercolumn')) {
								let found = _.find(rowsToAttachForDetail, {'rid': row.rid});
								result = _.isNil(found);
							}
							return result;
						});
					});
					_.forEach(configForDetailCopy.rowsDict, function (row) {
						if (_.startsWith(row.rid, 'charactercolumn')) {
							let found = _.find(rowsToAttachForDetail, {'rid': row.rid});
							if (_.isNil(found)) {
								delete configForDetailCopy.rowsDict[row.rid];
							}
						}
					});
					_.remove(configForDetailCopy.rows, function (row) {
						let result = false;
						if (_.startsWith(row.rid, 'charactercolumn')) {
							let found = _.find(rowsToAttachForDetail, {'rid': row.rid});
							result = _.isNil(found);
						}
						return result;
					});
					_.forEach(rowsToAttachForDetail, function (row) {
						existingRow = configForDetailCopy.rowsDict && configForDetailCopy.rowsDict[row.rid] ? configForDetailCopy.rowsDict[row.rid] : null;
						if (_.isNil(existingRow)) {
							_.forEach(configForDetailCopy.groupsDict,function(group){
								existingRow = _.find(group.rows,function(item){
									return item.rid === row.rid;
								});
							});
						}
						if (_.isNil(existingRow)) {
							if (index < 0) {
								let group = {
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
							}
							let count = configForDetailCopy.groups[index].rows.length;
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
						const gridId = data.uuid;
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

			function getGroupName(){
				return data.groupName;
			}

			return service;
		}]);
})(angular);
