/**
 * Created by baf on 02.10.2020
 */

(function (angular) {

    'use strict';
    var moduleName = 'resource.requisition';

    /**
     * @ngdoc controller
     * @name resourceRequisitionItemDetailController
     * @function
     *
     * @description
     * Controller for the detail view of resource requisition item entities.
     **/
    angular.module(moduleName).controller('resourceRequisitionItemDetailController', ResourceRequisitionItemDetailController);

    ResourceRequisitionItemDetailController.$inject = ['$scope', 'resourceRequisitionConstantValues', 'platformContainerControllerService'];

    function ResourceRequisitionItemDetailController($scope, resourceRequisitionConstantValues, platformContainerControllerService) {
        platformContainerControllerService.initController($scope, moduleName, 'a0db7de7ef924b25bebfabae05c68fe1');
    }

})(angular);