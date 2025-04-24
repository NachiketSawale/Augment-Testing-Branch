/**
 * Created by lid on 8/11/2017.
 */

(function (angular) {

    'use strict';
    var moduleName = 'productionplanning.mounting';

    angular.module(moduleName).controller('productionplanningMountingRequisitionDetailController', RequisitionDetailController);

    RequisitionDetailController.$inject = ['$scope', 'platformContainerControllerService', 'productionplanningMountingTranslationService'];

    function RequisitionDetailController($scope, platformContainerControllerService, translationService) {
        platformContainerControllerService.initController($scope, moduleName, '0ecc8ce2c72c4e99a17d38b3bb7e5ff4', translationService);
    }
})(angular);