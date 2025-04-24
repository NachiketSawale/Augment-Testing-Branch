/**
 * Created by alm on 4/9/2022.
 */
(function() {
    'use strict';
    var moduleName = 'basics.material';

    angular.module(moduleName).controller('basicsMaterialImportMaterialRecordsResultController', basicsMaterialImportMaterialRecordsResultController);

    basicsMaterialImportMaterialRecordsResultController.$inject = ['$scope', 'platformGridAPI', 'platformTranslateService'];

    function basicsMaterialImportMaterialRecordsResultController($scope, platformGridAPI, platformTranslateService) {

	    $scope.errorGridId = '115cb922447042f8923942ec6be5ed19';
        var errorGridColumns = [
            {
                id: 'info',
                field: 'Info',
                name: 'Information',
                name$tr$: 'basics.common.taskBar.info',
                width: 400,
                formatter: 'remark',
                sortable: true
            }
        ];
        $scope.errorListData = {
            state: $scope.errorGridId
        };

        init();
        ///////////////////////////////

        function init() {
            var infoList=$scope.modalOptions.infoList;
            setupGrid(infoList);
        }

        function setupGrid(infoList) {
            var columns = angular.copy(errorGridColumns);
            if (!platformGridAPI.grids.exist($scope.errorGridId)) {
                var errorGridConfig = {
                    columns: columns,
                    data: infoList,
                    lazyInit: true,
                    id: $scope.errorGridId,
                    options: {
                        tree: false,
                        indicator: true,
                        idProperty: 'Id',
                        iconClass: ''
                    }
                };
                platformGridAPI.grids.config(errorGridConfig);
                platformTranslateService.translateGridConfig(errorGridConfig.columns);
            }
        }

        $scope.$on('$destroy', function () {
            if (platformGridAPI.grids.exist($scope.errorGridId)) {
                platformGridAPI.grids.unregister($scope.errorGridId);
            }
        });
    }
})();