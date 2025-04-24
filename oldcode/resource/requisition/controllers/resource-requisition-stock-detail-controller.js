(function () {

    'use strict';
    var moduleName = 'resource.requisition';

    /**
     * @ngdoc controller
     * @name resourceRequisitionStockDetailController
     * @function
     *
     * @description
     * Controller for the list view of any kind of entity causing a change in a project
     **/
    angular.module(moduleName).controller('resourceRequisitionStockDetailController', ResourceRequisitionStockDetailController);

    ResourceRequisitionStockDetailController.$inject = ['$scope', 'resourceRequisitionConstantValues', 'platformContainerControllerService'];

    function ResourceRequisitionStockDetailController($scope, resourceRequisitionConstantValues, platformContainerControllerService) {
        platformContainerControllerService.initController($scope, moduleName, resourceRequisitionConstantValues.uuid.container.stockDetail);
    }

})(angular);