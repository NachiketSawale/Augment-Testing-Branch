(function (angular) {
    'use strict';

    var moduleName = 'resource.master';
    /**
     * @ngdoc controller
     * @name resourceMasterPoolDetailController
     * @function
     *
     * @description
     * Controller for the  detail view of Master Pool entities.
     **/
    /* jshint -W072 */ // many parameters because of dependency injection
    angular.module(moduleName).controller('resourceMasterPoolDetailController', ResourceMasterPoolDetailController);

    ResourceMasterPoolDetailController.$inject = ['$scope', 'platformContainerControllerService'];

    function ResourceMasterPoolDetailController($scope, platformContainerControllerService) {
        platformContainerControllerService.initController($scope, moduleName, 'dde848354d474e529b937de53400357f', 'resourceMasterTranslationService');
    }
})(angular);