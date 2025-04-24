(function () {
    /* global _ */
    'use strict';

    let moduleName = 'basics.material';

    angular.module(moduleName).controller('materialRoundingConfigDetailController', [
        '$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid', 'platformContextService',
        'materialRoundingConfigDetailUIConfigService', 'materialRoundingConfigDetailDataService', 'platformGridControllerService', 'materialRoundingConfigDataService', 'materialRoundingConfigDetailValidationService',
        function ($scope, $timeout, $injector, platformGridAPI, platformCreateUuid, platformContextService,
                  configDetailUIConfigService, materialRoundingConfigDetailDataService, platformGridControllerService, materialRoundingConfigDataService, configDetailValidationService) {

            let myGridConfig = {
                initCalled: false,
                columns: [],
                enableDraggableGroupBy: false,
                skipPermissionCheck: true,
                skipToolbarCreation: true,
                toolbarItemsDisabled: true,
                cellChangeCallBack: function (arg) {
                    materialRoundingConfigDetailDataService.setItemToSave(arg.item);
                }
            };

            $scope.gridId = platformCreateUuid();
            materialRoundingConfigDetailDataService.gridId = $scope.gridId;

            function init() {
                if (platformGridAPI.grids.exist($scope.gridId)) {
                    platformGridAPI.grids.unregister($scope.gridId);
                }
                platformGridControllerService.initListController($scope, configDetailUIConfigService, materialRoundingConfigDetailDataService, configDetailValidationService, myGridConfig);

                setDataSource(materialRoundingConfigDataService.getRoundingConfigDetail());
            }

            function setDataSource(data) {
                $scope.data = data;
                materialRoundingConfigDetailDataService.setDataList(data);
                setRoundingConfigDetailReadOnly(data);
                materialRoundingConfigDetailDataService.refreshGrid();
            }

            function updateData(currentItem) {
                setDataSource(currentItem.roundingConfigDetail);
            }

            materialRoundingConfigDataService.onItemChange.register(updateData);

            function getRoundingConfigDetailFields() {
                let fields = [];

                if ($scope.gridId && platformGridAPI.grids.exist($scope.gridId)) {
                    var cols = platformGridAPI.columns.configuration($scope.gridId);

                    if (angular.isDefined(cols) && (cols !== null) && cols.current) {
                        angular.forEach(cols.current, function (col) {
                            if (!_.isEmpty(col.field) && col.field !== 'indicator') {
                                fields.push(col.field);
                            }
                        });
                    }
                }

                if (_.isEmpty(fields)) {
                    // As fallback use following static column array
                    fields = ['ColumnId', 'UiDisplayTo', 'IsWithoutRounding', 'RoundTo', 'RoundToFk', 'RoundingMethodFk'];
                }

                return fields;
            }

            function setRoundingConfigDetailReadOnly(roundingConfigDetail) {
                if (angular.isUndefined(roundingConfigDetail) || (roundingConfigDetail === null)) {
                    return;
                }

                let readOnlyFields = getRoundingConfigDetailFields();

                if (angular.isDefined(readOnlyFields) && (readOnlyFields !== null)) {
                    let readOnly = false;
                    let fields = _.map(readOnlyFields, function (field) {
                        var tmpReadonly = readOnly;
                        if (field === 'ColumnId' || field === 'RoundToFk' || field === 'RoundingMethodFk') {
                            tmpReadonly = true; // Those two fields are always readonly
                        }

                        return {field: field, readonly: tmpReadonly};
                    });

                    var roundingConfigDetails = angular.isArray(roundingConfigDetail) ? roundingConfigDetail : [roundingConfigDetail];
                    let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
                    angular.forEach(roundingConfigDetails, function (rcDetail) {
                        platformRuntimeDataService.readonly(rcDetail, fields);
                    });
                }
            }

            $scope.setTools = function (tools) {
                tools.update = function () {
                    tools.version += 1;
                };
            };

            $scope.$on('$destroy', function () {
                if (platformGridAPI.grids.exist($scope.gridId)) {
                    platformGridAPI.grids.commitAllEdits();
                    platformGridAPI.grids.unregister($scope.gridId);
                }
                materialRoundingConfigDataService.clear();
                materialRoundingConfigDataService.onItemChange.unregister(updateData);
            });

            init();
        }
    ]);
})();
