(angular => {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('PpsCommonCharacteristic2RowEventsHelper', helperFn);

	helperFn.$inject = ['$injector',  '$timeout', 'platformFormConfigService', 'basicsCharacteristicDataServiceFactory', 'basicsCharacteristicColumnServiceFactory'];

	function helperFn($injector, $timeout, platformFormConfigService, characteristicDataServiceFactory, characteristicColumnServiceFactory) {
		const cache = {};

		/* template
		// extend characteristic2
		const characteristic2Config = {
			sectionId: -1,
			scope: null,
			formContainerId: '',
			dataService: null,
			containerInfoService: '',
			additionalCellChangeCallBackFn: null,
		};
		const characteristic2RowEventsHelper = $injector.get('PpsCommonCharacteristic2RowEventsHelper');
		characteristic2RowEventsHelper.register(characteristic2Config);

		$scope.$on('$destroy', function () {
			characteristic2RowEventsHelper.unregister(characteristic2Config.formContainerId, characteristic2Config.sectionId);
		});
		*/

		function register(config) {
			if (!config.formContainerId || !config.sectionId || !config.scope ||
				!_.isObject(config.dataService) || !config.containerInfoService) {
				throw new Error('Please set the characteristic2 row configuration.');
			}

			const formContainerId = config.formContainerId;
			const scope = config.scope;
			const sectionId = config.sectionId;
			const dataService = config.dataService;
			const containerInfoService = _.isString(config.containerInfoService) ? $injector.get(config.containerInfoService) : config.containerInfoService;
			const characteristicDataService = characteristicDataServiceFactory.getService(dataService, sectionId);
			const characterColumnService = characteristicColumnServiceFactory.getService(dataService, sectionId, formContainerId, containerInfoService);

			// extend change event
			const containerConfig = containerInfoService.getContainerInfoByGuid(formContainerId);
			const uiService = containerConfig.standardConfigurationService;
			const formConfig = uiService.getStandardConfigForDetailView();
			const originalChange = formConfig.change;
			formConfig.change = function(entity, field, column){
				if (_.isFunction(originalChange)) {
					originalChange(entity, field, column);
				} else if (_.isString(originalChange)) {
					scope[originalChange](entity, field, column);
				}
				characterColumnService.fieldChange(entity, field, column);
				if (_.isFunction(config.additionalCellChangeCallBackFn)) {
					config.additionalCellChangeCallBackFn(entity, field, column);
				}
			};

			// register events
			characterColumnService.registerSetConfigLayout(changeCharacRows);
			characteristicDataService.registerItemValueUpdate(onItemUpdate);
			characteristicDataService.registerItemDelete(onItemDelete);

			function changeCharacRows() {
				scope.formOptions.configure = characterColumnService.getStandardConfigForDetailView();
				if (_.isNil(scope.formOptions.configure.uuid)){
					scope.formOptions.configure.uuid = formContainerId;
				}
				platformFormConfigService.initialize(scope.formOptions, scope.formOptions.configure);

				$timeout(function () {
					scope.$broadcast('form-config-updated');
				});
			}
			function onItemUpdate(e, item) {
				characteristicDataService.getItemByCharacteristicFk(item.CharacteristicFk).then(function () {
					characterColumnService.checkRow(item);
					scope.formOptions.configure  = characterColumnService.getStandardConfigForDetailView();
					if (_.isNil(scope.formOptions.configure.uuid)){
						scope.formOptions.configure.uuid = formContainerId;
					}
					platformFormConfigService.initialize(scope.formOptions, scope.formOptions.configure);
					$timeout(function () {
						scope.$broadcast('form-config-updated');
					});
				});
			}
			function onItemDelete(e, items) {
				characterColumnService.deleteRows(items);
				scope.formOptions.configure  = characterColumnService.getStandardConfigForDetailView();
				platformFormConfigService.initialize(scope.formOptions, scope.formOptions.configure);
				$timeout(function () {
					scope.$broadcast('form-config-updated');
				});
			}

			function unregisterEvents() {
				characterColumnService.unregisterSetConfigLayout(changeCharacRows);
				characteristicDataService.unregisterItemValueUpdate(onItemUpdate);
				characteristicDataService.unregisterItemDelete(onItemDelete);
			}

			cache[getKey(formContainerId, sectionId)] = unregisterEvents;
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