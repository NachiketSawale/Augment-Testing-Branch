(function (angular) {
    'use strict';

    const moduleName = 'basics.characteristic';

    /**
     * dev-10043: fix general performance issue, refreshing form can be very heavy
     */
    angular.module(moduleName).factory('basicsCharacteristicColumnUpdateService', [
        '$q',
        '$timeout',
        '$injector',
        'platformGridAPI',
        'platformFormConfigService',
        function ($q,
                  $timeout,
                  $injector,
                  platformGridAPI,
                  platformFormConfigService) {
            const service = {};

            service.loadCharacteristicEntity = function (characteristicDataService, item) {
                if (item.CharacteristicEntity) {
                    return $q.when(item.CharacteristicEntity);
                }

                if (!item.$$loadingCharacteristicEntityPromise) {
                    item.$$loadingCharacteristicEntityPromise = characteristicDataService.getItemByCharacteristicFk(item.CharacteristicFk).then(function (data) {
                        item.CharacteristicEntity = data;
                        return data;
                    }).finally(function () {
                        item.$$loadingCharacteristicEntityPromise = null;
                    });
                }

                return item.$$loadingCharacteristicEntityPromise;
            };

            service.attachToForm = function ($scope, characterColumnService, characteristicDataService) {
                const uuid = $scope.getContainerUUID();

                function updateLayoutConfig() {
                    $scope.formOptions.configure = characterColumnService.getStandardConfigForDetailView();

                    if (_.isNil($scope.formOptions.configure.uuid)) {
                        $scope.formOptions.configure.uuid = uuid;
                    }
                }

                function updateLayout() {
                    updateLayoutConfig();

                    platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);

                    $timeout(function () {
                        $scope.$broadcast('form-config-updated');
                    });
                }

                function onItemUpdate(e, item) {
                    service.loadCharacteristicEntity(characteristicDataService, item).then(function (data) {
                        characterColumnService.checkRow(item, true, true);
                        characterColumnService.checkColumn(item, true);

                        updateLayoutConfig();
                    });
                }

                function onItemDelete(e, items) {
                    characterColumnService.deleteRows(items);
                    characterColumnService.deleteColumns(items);

                    updateLayoutConfig();
                }

                updateLayoutConfig();

                characterColumnService.registerSetConfigLayout(updateLayout);
                characteristicDataService.registerItemValueUpdate(onItemUpdate);
                characteristicDataService.registerItemDelete(onItemDelete);

                $scope.$on('$destroy', function () {
                    characteristicDataService.unregisterItemDelete(onItemDelete);
                    characteristicDataService.unregisterItemValueUpdate(onItemUpdate);
                    characterColumnService.unregisterSetConfigLayout(updateLayout);
                });
            };

            service.attachToGrid = function ($scope, characterColumnService, characteristicDataService, dataService) {
                function updateLayout() {
                    characterColumnService.refreshGrid();
                }

                function onItemUpdate(e, item) {
                    service.loadCharacteristicEntity(characteristicDataService, item).then(function (data) {
                        characterColumnService.checkRow(item, true, true);
                        characterColumnService.checkColumn(item, true);

                        characterColumnService.refreshGrid();
                    });
                }

                function onItemDelete(e, items) {
                    characterColumnService.deleteRows(items);
                    characterColumnService.deleteColumns(items);

                    characterColumnService.refreshGrid();
                }

                $timeout(function () {
                    updateLayout();
                });

                characterColumnService.registerSetConfigLayout(updateLayout);
                characteristicDataService.registerItemValueUpdate(onItemUpdate);
                characteristicDataService.registerItemDelete(onItemDelete);
                platformGridAPI.events.register($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);

                function onActiveCellChanged(e, arg) {
                    var column = arg.grid.getColumns()[arg.cell];
                    if (column) {
                        var characteristicTypeService = $injector.get('basicsCharacteristicTypeHelperService');
                        var isCharacteristic = characterColumnService.isCharacteristicColumn(column);
                        if (isCharacteristic) {
                            var lineItem = dataService.getSelected();
                            if (lineItem !== null) {
                                var col = column.field;
                                var colArray = _.split(col, '_');
                                if (colArray && colArray.length > 1) {
                                    var characteristicType = colArray[_.lastIndexOf(colArray) - 2];
                                    var value = parseInt(characteristicType);
                                    var isLookup = characteristicTypeService.isLookupType(value);
                                    var updateColumn = isLookup ? col : undefined;
                                    dataService.setCharacteristicColumn(updateColumn);
                                }
                            }
                        }
                    }
                }

                $scope.$on('$destroy', function () {
                    characteristicDataService.unregisterItemDelete(onItemDelete);
                    characteristicDataService.unregisterItemValueUpdate(onItemUpdate);
                    characterColumnService.unregisterSetConfigLayout(updateLayout);
                    platformGridAPI.events.unregister($scope.gridId, 'onActiveCellChanged', onActiveCellChanged);
                });
            };

            return service;
        }
    ]);
})(angular);