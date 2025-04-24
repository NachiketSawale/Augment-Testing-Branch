(function (angular) {
	'use strict';
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsActualTimeRecordingActionColumnServiceFactory', [
		'platformGridAPI', 'platformTranslateService', '_',
		function (platformGridAPI, platformTranslateService, _) {
			const map = new Map();

			function createService(dynamicConfigurationService, colFieldGeneratorFn) {
				const service = {};
				const data = { dynamicColumns: [] };

				if (!_.isFunction(colFieldGeneratorFn)) {
					throw Error('Please specify a function to generate field of action columns');
				}

				const generateColFieldFn = colFieldGeneratorFn; // function for generator custom column field

				service.appendActionCols = function (actionColumns) {
					data.dynamicColumns = [];
					dynamicConfigurationService.clearList();
					if (actionColumns && actionColumns.length > 0) {
						for (const col of actionColumns) {
							const config = generateColConfig(col);
							if (!isExistColumn(config)) {
								data.dynamicColumns.push(config);
							}
						}
						dynamicConfigurationService.attachDataForList(data.dynamicColumns);
					}
					refresh();
				};

				function generateColConfig(item) {
					let colOptions = getColOptions(item);
					let actionColumnField = generateColFieldFn(item);
					let actionColumnName = item.Code;

					return platformTranslateService.translateGridConfig({
						id: actionColumnName,
						domain: 'decimal',
						type: colOptions.formatter,
						field: actionColumnField,
						model: actionColumnField,
						name: actionColumnName,
						name$tr$: null,
						label: actionColumnName,
						label$tr$: null,
						formatter: colOptions.formatter,
						formatterOptions: colOptions.formatterOptions,
						editor: colOptions.formatter,
						editorOptions: colOptions.editorOptions,
						hidden: false,
						forceVisible: true,
						required: true,
						validator: null,
						sorting: item.Sorting,
						width: 75,
					});
				}

				function getColOptions() {
					return  {
						formatter: 'decimal',
						editorOptions: null,
						formatterOptions: null
					};
				}

				function isExistColumn(colField) {
					return data.dynamicColumns.filter(i => i.id === colField.id).length > 0;
				}

				function refresh() {
					dynamicConfigurationService.fireRefreshConfigLayout();
				}

				return service;
			}

			function getService(gridId, dynamicConfigurationService, colFieldGeneratorFn) {
				let service = null;
				if (map.has(gridId)) {
					service = map.get(gridId);
				} else {
					service = createService(dynamicConfigurationService, colFieldGeneratorFn);
					map.set(gridId, service);
				}
				return service;
			}

			return {
				getService
			};
		}]);
})(angular);