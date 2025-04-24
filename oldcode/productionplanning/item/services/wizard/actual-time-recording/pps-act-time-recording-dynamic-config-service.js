(function (angular) {
	'use strict';
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsActualTimeRecordingDynamicConfigurationServiceFactory', [
		'PlatformMessenger', 'platformGridAPI', 'platformGridControllerService', 'platformTranslateService',
		'basicsCommonChangeColumnConfigService',
		function (PlatformMessenger, platformGridAPI, platformGridControllerService, platformTranslateService,
			basicsCommonChangeColumnConfigService) {

			const map = new Map();

			function createService(gridId, uiService) {
				const service = {};

				const data = {
					parentScope: {},
					isInitialized: false,
					uuid: gridId,
					onConfigLayoutChange: new PlatformMessenger(),
					allColumns: [],
					dynamicColDictionaryForList: {},
				};

				const baseConfigurationService = uiService;
				const baseValidationService = null;

				service.clearList = () => {
					data.dynamicColDictionaryForList = {};
				};

				service.attachDataForList = dataObject => {
					attachData(data.dynamicColDictionaryForList, dataObject);
				};

				// Attach column as object
				function attachData(dataDictionary, dataObject) {
					if (!angular.isObject(dataObject)) {
						return;
					}

					for (let prop in dataObject) {
						if (Object.prototype.hasOwnProperty.call(dataObject, prop)) {
							dataDictionary[prop] = dataObject[prop];
						}
					}
				}

				function getExtendColumns(dataDictionary) {
					let columnsToAttachForList = [];

					for (let prop in dataDictionary) {
						if (Object.prototype.hasOwnProperty.call(dataDictionary, prop)) {
							columnsToAttachForList = columnsToAttachForList.concat(dataDictionary[prop]);
						}
					}

					return columnsToAttachForList;
				}

				service.getStandardConfigForListView = () => {
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
				};

				service.fireRefreshConfigLayout = () => {
					data.onConfigLayoutChange.fire();
					refreshGridLayout();
				};

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
					let columns = dynamicColumns ? dynamicColumns : service.getStandardConfigForListView().columns;
					columns = basicsCommonChangeColumnConfigService.mergeWithModuleConfig(gridId, columns);
					return columns;
				}

				return service;
			}

			function getService(gridId, uiService) {
				let service = null;
				if (map.has(gridId)) {
					service = map.get(gridId);
				} else {
					service = createService(gridId, uiService);
					map.set(gridId, service);
				}
				return service;
			}

			return {
				getService: getService
			};
		}]);
})(angular);
