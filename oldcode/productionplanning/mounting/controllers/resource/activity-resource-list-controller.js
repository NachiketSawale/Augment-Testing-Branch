/**
 * Created by anl on 9/20/2017.
 */

(function (angular) {
    'use strict';


    var moduleName = 'productionplanning.mounting';

    angular.module(moduleName).controller('resourceForActivityListController', ResourceListController);
    ResourceListController.$inject = ['$scope',
        'platformGridControllerService',
        'resourceMasterUIStandardService',
        'resourceMasterValidationService',
        'productionplanningMountingResourceForActivityDataService',
        'platformGridAPI'];

    function ResourceListController($scope, platformGridControllerService,
                                    uiStandardService,
                                    validationService,
                                    dataService,
                                    platformGridAPI) {

        var gridConfig = {initCalled: false, columns: []};

        platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

        var setCellEditable = function () {
            return false;
        };
        platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);

        // un-register on destroy
        $scope.$on('$destroy', function () {
            platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
        });
    }

})(angular);