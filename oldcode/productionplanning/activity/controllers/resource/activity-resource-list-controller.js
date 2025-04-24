/**
 * Created by anl on 3/7/2018.
 */

(function (angular) {
    'use strict';


    var moduleName = 'productionplanning.activity';

    angular.module(moduleName).controller('productionplanningActivityResourceForActivityListController', ResourceListController);
    ResourceListController.$inject = ['$scope',
        'platformGridControllerService',
        'resourceMasterUIStandardService',
        'resourceMasterValidationService',
        'productionplanningActivityResourceForActivityDataService',
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