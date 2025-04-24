(function (angular) {
    'use strict';

    const moduleName = 'basics.common';

    /**
     * @ngdoc directive
     * @name basicsCommomChangeStatusNext
     * @restrict A
     * @description Status history grid in status change dialog
     */
    angular.module(moduleName).directive('basicsCommomChangeStatusNext',
        ['$translate', 'basicsCommonChangeStatusService', 'platformGridAPI', '$timeout', '$q', 'platformDataProcessExtensionHistoryCreator', 'platformObjectHelper', '_',
            function ($translate, basicsCommonChangeStatusService, platformGridAPI, $timeout, $q, platformDataProcessExtensionHistoryCreator, platformObjectHelper, _) {
                function changeStatusNextController($scope) {
                    $scope.getNextGridUUID = function () {
                        return '302777ae5d5a4ae398fd8c7db3003a17';
                    };

                    const gridColumns = [
                        {
                            id: 'Selected',
                            field: 'Selected',
                            name: 'Selected',
                            name$tr$: 'SELECTED',
                            editor: 'boolean',
                            formatter: 'boolean',
                            width: 80
                        },
                        {
                            id: 'ProjectNo',
                            field: 'ProjectNo',
                            name: 'Project Number',
                            editor: null,
                            readonly: true,
                            width: 180,
                            domain: 'description',
                            formatter: 'description'
                        },
                        {
                            id: 'ProjectIndex',
                            field: 'ProjectIndex',
                            name: 'Index',
                            editor: null,
                            readonly: true,
                            width: 100,
                            formatter: 'description'
                           
                        },
                        {
                            id: 'ProjectName',
                            field: 'ProjectName',
                            name: 'Project Name',
                            editor: null,
                            readonly: true,
                            width: 180,
                            domain: 'description',
                            formatter: 'description'
                        },
                    ];

                    if (platformGridAPI.grids.exist($scope.getNextGridUUID())) {
                        platformGridAPI.grids.unregister($scope.getNextGridUUID());
                    }

                    const gridConfig = {
                        data: [], // todo aus instance data
                        columns: angular.copy(gridColumns),
                        id: $scope.getNextGridUUID(),
                        lazyInit: true,
                        options: {
                            tree: false, indicator: true, allowRowDrag: false,
                            editable: true,
                            asyncEditorLoading: true,
                            autoEdit: false,
                            enableCellNavigation: true,
                            enableColumnReorder: false,
                            showItemCount: false
                        }
                    };

                    platformGridAPI.grids.config(gridConfig);

                    $q.all([
                        basicsCommonChangeStatusService.getAllProjectAlternatives($scope.options),
                    ]).then(function (res) {
                        console.log(res);
                        let counter = 1;
                        const info = [];
                        res.forEach(function (array) {
                            array.forEach(function (item) {
                                if (item && item.ProjectNo !== undefined) {
                                    info.push({
                                        Selected:false,
                                        Id: item.Id, // Generate unique identifier
                                        ProjectNo: item.ProjectNo,
                                        ProjectIndex: item.ProjectIndex,
                                        ProjectName: item.ProjectName,

                                    });
                                }
                            });
                        });
                        console.log('Data:', info);
                        platformGridAPI.items.data($scope.getNextGridUUID(), info);
                    }).catch(function (error) {
                        console.error('Error occurred while fetching data:', error);
                    });

                    $scope.gridData = {
                        state: $scope.getNextGridUUID()
                    };

                    $scope.$on('Selected', function (event, data) {
                        // Update the grid data with the new checkbox state
                        $scope.gridData = data;
                    });

                }

                return {
                    restrict: 'A',
                    scope: {
                        options: '='
                    },
                    template: '<div data-platform-grid style="border: 1px solid #ABABAB;" data-data="gridData"></div>',
                    controller: ['$scope', changeStatusNextController]
                };

            }]);
})(angular);
