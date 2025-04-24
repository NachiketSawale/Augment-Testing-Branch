(function (angular) {
    'use strict';

    var moduleName = 'resource.master';
    /**
     * @ngdoc controller
     * @name resourceMasterDetailController
     * @function
     *
     * @description
     * Controller for the  detail view of Master entities.
     **/
    /* jshint -W072 */ // many parameters because of dependency injection
    angular.module(moduleName).controller('resourceMasterDetailController', ResourceMasterDetailController);

    ResourceMasterDetailController.$inject = ['$scope', 'platformContainerControllerService'];

    function ResourceMasterDetailController($scope, platformContainerControllerService) {
        platformContainerControllerService.initController($scope, moduleName, 'd9391c21eaac4fb7b5db3178af56bdaa', 'resourceMasterTranslationService');
    }
})(angular);