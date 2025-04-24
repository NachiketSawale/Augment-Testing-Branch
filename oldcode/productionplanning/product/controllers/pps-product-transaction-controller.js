/**
 * Created by zov on 8/1/2019.
 */
(function () {
    'use strict';
    /*global angular, _*/
    var moduleName = 'productionplanning.product';
    angular.module(moduleName).controller('ppsProductTransactionController', ppsProductTransactionController);
    ppsProductTransactionController.$inject = ['$scope',
        'procurementStockTransactionUIStandardService',
        'procurementStockTransactionValidationServiceFactory',
        'ppsProductTransactionDataService',
        'basicsLookupdataLookupFilterService',
        'platformGridControllerService',
    'ppsCopyStandardUIService'];
    function ppsProductTransactionController($scope,
                                             procurementStockTransactionUIStandardService,
                                             procurementStockTransactionValidationServiceFactory,
                                             ppsProductTransactionDataService,
                                             basicsLookupdataLookupFilterService,
                                             platformGridControllerService,
                                             ppsCopyStandardUIService) {
        var gridConfig = {
            initCalled: false,
            columns: [],
            options: {
                editable: false,
                readonly: false
            }
        };

        // remove column PpsProductFk
        var uiSrv = ppsCopyStandardUIService.copyUISrv(procurementStockTransactionUIStandardService);
        var columns = uiSrv.getStandardConfigForListView().columns;
        var i = _.findIndex(columns, {field: 'PpsProductFk'});
        while(i > -1){
            columns.splice(i, 1);
            i = _.findIndex(columns, {field: 'PpsProductFk'});
        }


        var validationSrv = procurementStockTransactionValidationServiceFactory.getValidationService(ppsProductTransactionDataService);
        platformGridControllerService.initListController($scope, uiSrv,
            ppsProductTransactionDataService, validationSrv, gridConfig);

        var filters = [
            {
                key: 'prc-stock-transaction-transactiontype-filter',
                serverSide: true,
                fn: function () {
                    return 'IsAllowedManual='+true+' and Sorting<>0 and IsLive='+true;
                }
            },
            {
                key: 'prc-stock-location-filter',
                serverSide: true,
                fn: function () {
                    var currentItem = ppsProductTransactionDataService.getSelected();
                    if(currentItem) {
                        return 'StockFk=' +currentItem.PrjStockFk;
                    }
                }
            },
            {
                key: 'prc-stock-controlling-unit-filter',
                serverKey: 'basics.masterdata.controllingunit.filterkey',
                serverSide: true,
                fn: function () {
                    //88452 Stock management: Controlling Unit code should have the look up to all the projects
                    // var currentItem = service.getSelected();
                    // if(currentItem) {
                    //     return { ProjectFk: currentItem.ProjectFk };
                    // }
                    // var item=parentService.getParentData();
                    // if(item) {
                    //     return { ProjectFk: item.ProjectFk };
                    // }
                }
            }

        ];
        basicsLookupdataLookupFilterService.registerFilter(filters);
        $scope.$on('$destroy', function () {
            basicsLookupdataLookupFilterService.unregisterFilter(filters);
        });
    }
})();
