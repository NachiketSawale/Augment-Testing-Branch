/**
 * Created by las on 6/13/2018.
 */

(function (angular) {
    'use strict';
    /*global angular*/


    angular.module('productionplanning.common').controller('productionplanningCommonDispatcherListController', productionplanningCommonDispatcherListController );

    productionplanningCommonDispatcherListController.$inject = ['$scope','platformGridControllerService','productionplanningCommonDispatcherDataServiceFactory','productionplanningCommonDispatcherUIStandardService'];

    function productionplanningCommonDispatcherListController($scope, platformGridControllerService, productionplanningCommonDispatcherDataServiceFactory, dispatcherUIStandardService) {

        var moduleName = $scope.getContentValue('moduleName');
        var dispatcherService = productionplanningCommonDispatcherDataServiceFactory.createDispatcherDataService(moduleName);

        var gridConfig = {
            initCalled: false,
            columns: []
        };

        platformGridControllerService.initListController($scope, dispatcherUIStandardService, dispatcherService, null, gridConfig);
    }
})(angular);
