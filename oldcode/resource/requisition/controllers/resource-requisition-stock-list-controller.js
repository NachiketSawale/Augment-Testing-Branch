(function () {

    'use strict';
    var moduleName = 'resource.requisition';

    /**
     * @ngdoc controller
     * @name resourceRequisitionStockListController
     * @function
     *
     * @description
     * Controller for the list view of any kind of entity causing a change in a project
     **/
    angular.module(moduleName).controller('resourceRequisitionStockListController', ResourceRequisitionStockListController);

    ResourceRequisitionStockListController.$inject = ['$scope', 'resourceRequisitionConstantValues', 'platformContainerControllerService'];

    function ResourceRequisitionStockListController($scope, resourceRequisitionConstantValues, platformContainerControllerService) {
        platformContainerControllerService.initController($scope, moduleName, resourceRequisitionConstantValues.uuid.container.stockList);
    }
})(angular);