/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
    'use strict';

    let moduleName = 'estimate.main';
    /**
     * @ngdoc controller
     * @name estimateMainDissolvePlantAssemblyGridController
     * @function
     *
     * @description
     * Controller to show the Plant Assembly resources in dissolve assemblies wizard
     **/
    angular.module(moduleName).controller('estimateMainDissolvePlantAssemblyGridController', ['$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid',
        'estimateMainDissolvePlantAssemblyService', 'platformGridControllerService', 'basicsCommonHeaderColumnCheckboxControllerService',
        function ($scope, $timeout, $injector, platformGridAPI, platformCreateUuid, estimateMainDissolvePlantAssemblyService, platformGridControllerService, basicsCommonHeaderColumnCheckboxControllerService) {

            let myGridConfig = {
                initCalled: false,
                skipPermissionCheck: true,
                cellChangeCallBack: function () {
                }
            };

            $scope.gridId = platformCreateUuid();

            $scope.onContentResized = function () {
                resize();
            };

            $scope.gridData = {
                state: $scope.gridId
            };

            function resize() {
                $timeout(function () {
                    platformGridAPI.grids.resize($scope.gridId);
                });
            }

            function init() {
                if (platformGridAPI.grids.exist($scope.gridId)) {
                    platformGridAPI.grids.unregister($scope.gridId);
                }

                platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
                platformGridControllerService.initListController($scope, estimateMainDissolvePlantAssemblyService, estimateMainDissolvePlantAssemblyService, null, myGridConfig);

                basicsCommonHeaderColumnCheckboxControllerService.setGridId($scope.gridId);
                basicsCommonHeaderColumnCheckboxControllerService.init($scope, estimateMainDissolvePlantAssemblyService, ['IsChecked']);
            }

            $scope.isCheckedValueChange = function isCheckedValueChange() {
                return {apply: true, valid: true, error: ''};
            };

            function onHeaderCheckboxChange(e) {
                $scope.isCheckedValueChange(null, e.target.checked);
            }

            $scope.setTools = function (tools) {
                tools.update = function () {
                    tools.version += 1;
                };
            };

            init();

            $scope.$on('$destroy', function () {
                if (platformGridAPI.grids.exist($scope.gridId)) {
                    platformGridAPI.grids.unregister($scope.gridId);
                }
                estimateMainDissolvePlantAssemblyService.setDataList(false);
                platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
            });
        }
    ]);
})();
