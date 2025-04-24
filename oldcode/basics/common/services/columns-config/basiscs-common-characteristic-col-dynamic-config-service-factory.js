/**
 * Created by pel on 09/15/2021.
 */
((angular) => {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonCharacteristicColDynamicConfigServiceFactory', basicsCommonCharacteristicColDynamicConfigServiceFactory);

	basicsCommonCharacteristicColDynamicConfigServiceFactory.$inject = ['PlatformMessenger', 'platformGridAPI', 'platformGridControllerService', 'platformTranslateService', 'basicsCommonChangeColumnConfigService', '_'];

	function basicsCommonCharacteristicColDynamicConfigServiceFactory(PlatformMessenger, platformGridAPI, platformGridControllerService, platformTranslateService, basicsCommonChangeColumnConfigService, _) {
		const serviceCache = [];

		function createService(uIConfigurationService, validationService, gridId) {
			const data = {
				parentScope: {},
				isInitialized: false,

				// Unique identifier for current container
				uuid: gridId,

				groupName: 'characteristics',

				onConfigLayoutChange: new PlatformMessenger(),

				allColumns: [],

				// dynamic columns dictionary for list
				dynamicColDictionaryForList: {},

				dynamicColDictionaryForDetail: {}
			};
			const baseConfigurationService = uIConfigurationService;
			const baseValidationService = validationService;

			// var service = { isExtendService : true, isDynamicReadonlyConfig: true };
			let service = {isExtendService: true};
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
					if (_.has(dataObject, prop)) {
						const id = dataObject[prop].id || dataObject[prop].rid;
						dataDictionary[id] = dataObject[prop];
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
				const pos = _.findKey(dataDictionary, function (col) {
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
					if (_.has(dataDictionary, prop)) {
						columnsToAttachForList = columnsToAttachForList.concat(dataDictionary[prop]);
					}
				}

				return columnsToAttachForList;
			}

			function getDtoScheme() {
				return baseConfigurationService.getDtoScheme();
			}

			function getStandardConfigForListView(gridId) {
				// add the extend columns to config for list
				const columnsToAttachForList = getExtendColumns(data.dynamicColDictionaryForList);

				let configForListCopy = {};
				if (gridId) {
					configForListCopy = baseConfigurationService.getStandardConfigForListView();
				} else {
					if (angular.isFunction(baseConfigurationService.extendExtraColumns)) {
						baseConfigurationService.extendExtraColumns();
					}
					if (angular.isFunction(baseConfigurationService.extendExtraRows)) {
						baseConfigurationService.extendExtraRows();
					}
					configForListCopy = angular.copy(baseConfigurationService.getStandardConfigForListView());
				}

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

			function getGroupIndex(configForDetailCopy, gid) {
				return _.findIndex(configForDetailCopy.groups, {'gid': gid});
			}

			function removeCharacteristicsItemsFormOptions(rowsToAttachForDetail, configForDetailCopy, index) {
				_.forEach(rowsToAttachForDetail, function (charRow) {
					_.remove(configForDetailCopy.rows, function (row) {
						return row.rid === charRow.rid;
					});

					let groupIndex = getGroupIndex(configForDetailCopy, charRow.gid);
					if (groupIndex > -1) {
						_.remove(configForDetailCopy.groups[groupIndex].rows, function (row) {
							return row.rid === charRow.rid;
						});
					}

					delete configForDetailCopy.rowsDict[charRow.rid];
				});
				configForDetailCopy.groups[index].rows = [];
			}

			function addCharacteristicsItemsFormOptions(configForDetailCopy, row) {
				configForDetailCopy.rows.push(row);

				let groupIndex = getGroupIndex(configForDetailCopy, row.gid);
				if (groupIndex > -1) {
					configForDetailCopy.groups[groupIndex].rows.push(row);
				}

				if (configForDetailCopy.rowsDict) {
					configForDetailCopy.rowsDict[row.rid] = row;
				}
			}

			function getStandardConfigForDetailView() {
				// add the extend columns to config for detail
				const rowsToAttachForDetail = getExtendColumns(data.dynamicColDictionaryForDetail);
				// var configForDetailCopy = angular.copy(baseConfigurationService.getStandardConfigForDetailView());
				const configForDetailCopy = baseConfigurationService.getStandardConfigForDetailView();

				if (rowsToAttachForDetail && rowsToAttachForDetail.length > 0) {
					let index = -1;

					if (configForDetailCopy && configForDetailCopy.groups) {
						index = _.findIndex(configForDetailCopy.groups, {'gid': data.groupName});
					}
					if (index < 0) {
						const group = {
							gid: data.groupName,
							header: platformTranslateService.instant('basics.common.characteristics', undefined, true),
							header$tr$: 'basics.common.characteristics',
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
						removeCharacteristicsItemsFormOptions(rowsToAttachForDetail, configForDetailCopy, index);
					}

					let count = configForDetailCopy.groups[index].rows.length;

					_.forEach(rowsToAttachForDetail, function (row) {
						if (configForDetailCopy.rowsDict && _.isNil(configForDetailCopy.rowsDict[row.rid])) {
							row.sortOrder = ++count;

							addCharacteristicsItemsFormOptions(configForDetailCopy, row);
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
						const grid = platformGridAPI.grids.element('id', gridId);
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
				const currentColumns = dynamicColumns ? dynamicColumns : platformGridAPI.grids.element('id', gridId).columns.current; // grid.columns.current;
				const allColumns = dynamicColumns ? dynamicColumns : service.getStandardConfigForListView(gridId).columns;
				_.forEach(allColumns, function (col) {
					let configuredCol = _.find(platformGridAPI.grids.element('id', gridId).columns.current, {id:col.id});
					if(_.isNil(configuredCol)){
						currentColumns.push(col);
					}
				});

				return basicsCommonChangeColumnConfigService.mergeWithViewConfig(gridId, currentColumns);
			}

			function getGroupName() {
				return data.groupName;
			}

			return service;
		}

		function getService(parentService, uIConfigurationService, validationService, gridId) {
			let cacheKey = gridId;
			const serviceName = parentService.getServiceName();
			if (serviceName) {
				cacheKey = serviceName + gridId;
			}
			if (!serviceCache[cacheKey]) {
				serviceCache[cacheKey] = createService(uIConfigurationService, validationService, gridId);
			}
			return serviceCache[cacheKey];
		}

		return {
			getService: getService
		};
	}
})(angular);
