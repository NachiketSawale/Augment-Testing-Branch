
(function () {
    'use strict';
    /* global globals , _ */
    let moduleName = 'estimate.parameter';

    angular.module(moduleName).controller('estimateParameterValueAssignmentGridController', ['platformCreateUuid', '$scope', 'platformGridAPI', '$timeout', 'estimateParameterValueAssignmentGridUIService',
                                            'estimateParameterValueAssignmentGridService', 'platformGridControllerService', 'estimateParameterDialogDataService', 'estimateRuleParameterConstant',
                                            'estimateParameterValueAssignmentGridValidationService',
        function (platformCreateUuid, $scope, platformGridAPI, $timeout, estimateParameterValueAssignmentGridUIService, estimateParameterValueAssignmentGridService, platformGridControllerService,
                  estimateParameterDialogDataService, estimateRuleParameterConstant, estimateParameterValueAssignmentGridValidationService) {

            let myGridConfig = {
                initCalled: false,
                columns: [],
                ContainerType : 'Grid',
                childSort: true,
                enableDraggableGroupBy: false,
                skipPermissionCheck : true,
                skipToolbarCreation :true
            };

            $scope.gridId = platformCreateUuid();
            estimateParameterValueAssignmentGridService.setGridId($scope.gridId);

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

            $scope.setTools = function (tools) {
                tools.update = function () {
                    tools.version += 1;
                };
            };

            platformGridControllerService.initListController($scope, estimateParameterValueAssignmentGridUIService, estimateParameterValueAssignmentGridService, estimateParameterValueAssignmentGridValidationService, myGridConfig);

            platformGridAPI.events.register($scope.gridId, 'onCellChange', cellChangeCallBack);
            function cellChangeCallBack(e,arg) {
                let field = arg.cell ? arg.grid.getColumns()[arg.cell].field : null;
                estimateParameterValueAssignmentGridService.fieldChange(arg.item, field);
            }

            // Define standard toolbar Icons and their function on the scope
            $scope.tools = {
                showImages: true,
                showTitles: true,
                cssClass: 'tools',
                items: [
                    {
                        id: 'add',
                        sort: 2,
                        caption: 'cloud.common.taskBarNewRecord',
                        type: 'item',
                        iconClass: 'tlb-icons ico-rec-new',
                        disabled: function () {
                            let currentEstParameter = estimateParameterDialogDataService.getCurrentEstParameter();
                            if(!currentEstParameter){
                                return true;
                            }
                            return !currentEstParameter.Islookup;
                        },
                        fn: function onClick() {
                            estimateParameterValueAssignmentGridService.deselect().then(function () {
                                estimateParameterValueAssignmentGridService.addItem();
                            });
                        }
                    },
                    {
                        id: 'delete',
                        sort: 2,
                        caption: 'cloud.common.taskBarDeleteRecord',
                        type: 'item',
                        iconClass: 'tlb-icons ico-rec-delete',
                        disabled: function () {
                            if( !(estimateParameterValueAssignmentGridService.getList() && estimateParameterValueAssignmentGridService.getList().length)) {
                                return true;
                            }
                            let selItem = estimateParameterValueAssignmentGridService.getSelectedEntities();
                            return !selItem.length;
                        },
                        fn: function onDelete() {
                            estimateParameterValueAssignmentGridService.deleteEntities(estimateParameterValueAssignmentGridService.getSelectedEntities());
                        }
                    }
                ],
                update: function () {
                }
            };
            
            $scope.$on('$destroy', function () {
                if (platformGridAPI.grids.exist($scope.gridId)) {
                    platformGridAPI.grids.unregister($scope.gridId);
                }
                platformGridAPI.events.unregister($scope.gridId, 'onCellChange', cellChangeCallBack);
            });
        }
    ]);
})();
