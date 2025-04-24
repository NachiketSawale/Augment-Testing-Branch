/**
 * Created by zov on 10/17/2019.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.configuration';
    angular.module(moduleName).controller('ppsConfigurationLogConfigListController', ppsConfigurationLogConfigListController);
    ppsConfigurationLogConfigListController.$inject = ['$scope', 'platformGridControllerService',
        'ppsConfigurationLogConfigUIStandardService', 'ppsConfigurationLogConfigDataService',
        'ppsConfigurationLogConfigValidationService', 'platformGridAPI'];
    function ppsConfigurationLogConfigListController($scope, platformGridControllerService,
                                                     uiStandardService, dataService,
                                                     validationService, platformGridAPI) {

        var gridConfig = {
            initCalled: false,
            columns: []
        };

        platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

        // field changed event for form
        uiStandardService.setFieldChangeHandler(function (item, field) {
            dataService.handleFieldChange(item, field, validationService);
        });

        // field changed event for grid
        function onCellChange(e, args) {
            var col = args.grid.getColumns()[args.cell].field;
            dataService.handleFieldChange(args.item, col, validationService);
        }

        platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
        $scope.$on('$destroy', function () {
            platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
        });
    }
})();