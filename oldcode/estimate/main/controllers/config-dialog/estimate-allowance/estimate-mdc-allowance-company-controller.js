/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

    'use strict';

    let moduleName = 'estimate.main';

    /**
     * @ngdoc controller
     * @name estimateMdcAllowanceCompanyController
     * @function
     *
     * @description
     * Controller for the  detail view of Used In Company.
     **/
    angular.module(moduleName).controller('estimateMdcAllowanceCompanyController',
        ['_','$scope', '$timeout', 'platformGridAPI', 'estimateMdcAllowanceCompanyService', 'platformGridControllerService', 'estimateMdcAllowanceCompanyUIConfigurationService', 'platformCreateUuid',
            function (_, $scope, $timeout, platformGridAPI, estimateMdcAllowanceCompanyService, platformGridControllerService, estimateMdcAllowanceCompanyUIConfigurationService, platformCreateUuid) {

                let myGridConfig = {
                    initCalled: false,
                    columns: [],
                    parentProp: 'CompanyFk',
                    childProp: 'Companies',
                    addValidationAutomatically: false,
                    cellChangeCallBack: function cellChangeCallBack(arg) {
                        estimateMdcAllowanceCompanyService.fieldChangeCallBack(arg);
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
                    platformGridControllerService.initListController($scope, estimateMdcAllowanceCompanyUIConfigurationService, estimateMdcAllowanceCompanyService, null, myGridConfig);

                    $timeout(function () {
                        if(estimateMdcAllowanceCompanyService.getIsLoadData()){
                            estimateMdcAllowanceCompanyService.load();
                        }
                    });
                }

                let defaultTools = [
                    {
                        id: 't10',
                        caption: 'cloud.common.toolbarExpandAll',
                        type: 'item',
                        iconClass: 'tlb-icons ico-tree-expand-all',
                        fn: function expandAll() {
                            platformGridAPI.rows.expandAllSubNodes($scope.gridId);
                        }
                    },
                    {
                        id: 't9',
                        caption: 'cloud.common.toolbarCollapseAll',
                        type: 'item',
                        iconClass: 'tlb-icons ico-tree-collapse-all',
                        fn: function collapseAll() {
                            platformGridAPI.rows.collapseAllSubNodes($scope.gridId);
                        }},
                    {
                        id: 't8',
                        caption: 'cloud.common.toolbarExpand',
                        type: 'item',
                        iconClass: 'tlb-icons ico-tree-expand',
                        fn: function expandSelected() {
                            platformGridAPI.rows.expandNode($scope.gridId);
                        }},
                    {
                        id: 't7',
                        caption: 'cloud.common.toolbarCollapse',
                        type: 'item',
                        iconClass: 'tlb-icons ico-tree-collapse',
                        fn: function collapseSelected() {
                            platformGridAPI.rows.collapseNode($scope.gridId);
                        }}
                ];

                $scope.setTools = function (tools) {
                    tools.items = _.filter(tools.items, function (item) {
                       return item.id !== 't199' && item.id !== 't200';
                    });
                    _.forEach(defaultTools, function (tool) {
                        tools.items.unshift(tool);
                    })
                    $scope.tools = tools;
                    tools.update = function () {
                        tools.version += 1;
                    };
                };
                init();

                $scope.$on('$destroy', function () {
                    if (platformGridAPI.grids.exist($scope.gridId)) {
                        platformGridAPI.grids.unregister($scope.gridId);
                    }
                    estimateMdcAllowanceCompanyService.clearData();
                });
            }
        ]);
})(angular);