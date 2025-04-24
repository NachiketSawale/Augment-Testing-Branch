(angular => {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('PpsCommonCharacteristic2ColumnEventsHelper', helperFn);

	helperFn.$inject = ['$injector', '$timeout', 'platformGridAPI', 'basicsCharacteristicDataServiceFactory', 'basicsCharacteristicColumnServiceFactory'];

	function helperFn($injector, $timeout, platformGridAPI, characteristicDataServiceFactory, characteristicColumnServiceFactory) {
		const cache = {};

		/* template
		// extend characteristic2
		const characteristic2Config = {
			sectionId: -1,
			gridContainerId: '',
			gridConfig: null,
			dataService: null,
			containerInfoService: '',
			additionalCellChangeCallBackFn: null,
		};
		const characteristic2ColumnEventsHelper = $injector.get('PpsCommonCharacteristic2ColumnEventsHelper');
		characteristic2ColumnEventsHelper.register(characteristic2Config);

		$scope.$on('$destroy', function () {
			characteristic2ColumnEventsHelper.unregister(characteristic2Config.gridContainerId, characteristic2Config.sectionId);
		}
		*/

		function register(config) {
			if (!config.sectionId || !config.gridContainerId || !config.gridConfig ||
				!_.isObject(config.dataService) || !config.containerInfoService) {
				throw new Error('Please set the characteristic2 column configuration.');
			}

			const gridContainerId = config.gridContainerId;
			const sectionId = config.sectionId;
			const gridConfig = config.gridConfig;
			const dataService = config.dataService;
			const containerInfoService = _.isString(config.containerInfoService) ? $injector.get(config.containerInfoService) : config.containerInfoService;
			const characteristicDataService = characteristicDataServiceFactory.getService(dataService, sectionId);
			const characterColumnService = characteristicColumnServiceFactory.getService(dataService, sectionId, gridContainerId, containerInfoService);

			// extend cell change call back event
			const originalCellChangeCallBack = gridConfig.cellChangeCallBack;
			gridConfig.cellChangeCallBack = function(arg) {
				if (_.isFunction(originalCellChangeCallBack)) {
					originalCellChangeCallBack(arg);
				}
				const column = arg.grid.getColumns()[arg.cell];
				const field = arg.grid.getColumns()[arg.cell].field;
				if (characterColumnService && characterColumnService.isCharacteristicColumn(column)) {
					if(characteristicDataService.getUnfilteredList().length === 0){
						characteristicDataService.load().then(function () {
							characteristicDataService.setFilter('mainItemId='+arg.item.Id);
							characterColumnService.fieldChange(arg.item, field, column);
							if (_.isFunction(config.additionalCellChangeCallBackFn)) {
								config.additionalCellChangeCallBackFn(arg, field, column);
							}
						});
					}else{
						characterColumnService.fieldChange(arg.item, field, column);
						if (_.isFunction(config.additionalCellChangeCallBackFn)) {
							config.additionalCellChangeCallBackFn(arg, field, column);
						}
					}
				}
			};

			// register events
			characteristicDataService.registerItemValueUpdate(onItemUpdate);
			characteristicDataService.registerItemDelete(onItemDelete);
			platformGridAPI.events.register(gridContainerId, 'onActiveCellChanged', onActiveCellChanged);

			function onItemUpdate(e, item) {
				characteristicDataService.getItemByCharacteristicFk(item.CharacteristicFk).then(function (data) {
					if (item.CharacteristicEntity === null) {
						item.CharacteristicEntity = data;
					}
					characterColumnService.checkColumn(item);
				});
			}
			function onItemDelete(e, items) {
				characterColumnService.deleteColumns(items);
			}
			function onActiveCellChanged(e, arg) {
				const column = arg.grid.getColumns()[arg.cell];
				if (column) {
					const characteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
					const isCharacteristic = characterColumnService.isCharacteristicColumn(column);
					if (isCharacteristic) {
						const selectItem = dataService.getSelected();
						if (selectItem !== null) {
							const col = column.field;
							const colArray = _.split(col, '_');
							if (colArray && colArray.length > 1) {
								const characteristicType = colArray[_.lastIndexOf(colArray) - 2];
								const value = parseInt(characteristicType);
								const isLookup = characteristicTypeService.isLookupType(value);
								const updateColumn = isLookup ? col : undefined;
								dataService.setCharacteristicColumn(updateColumn);
							}
						}
					}
				}
			}

			function unregisterEvents() {
				characteristicDataService.unregisterItemValueUpdate(onItemUpdate);
				characteristicDataService.unregisterItemDelete(onItemDelete);
				platformGridAPI.events.unregister(gridContainerId, 'onActiveCellChanged', onActiveCellChanged);
			}

			cache[getKey(gridContainerId, sectionId)] = unregisterEvents;

			$timeout(function () {
				if (platformGridAPI.grids.exist(gridContainerId)) {
					characterColumnService.refresh();
				}
			});
		}

		function unregister(gridId, sectionId) {
			if (!gridId || !sectionId) {
				throw new Error('Argument missing');
			}
			if (hasKey(gridId, sectionId)) {
				cache[getKey(gridId, sectionId)]();
			}
		}

		function getKey(gridId, sectionId) {
			return gridId + '_' + sectionId;
		}

		function hasKey(gridId, sectionId) {
			return !!cache[getKey(gridId, sectionId)];
		}

		return {
			register: register,
			unregister: unregister
		};
	}
})(angular);