(function () {

    /*global angular*/
    'use strict';
    var moduleName = 'resource.master';
    var angModule = angular.module(moduleName);
    /* jshint -W072*/ //many parameters because of dependency injection
    angModule.controller('resourceMasterPoolListController', ResourceMasterPoolListController);

    ResourceMasterPoolListController.$inject = ['$scope', 'platformContainerControllerService', 'platformTranslateService', 'resourceMasterPoolUIStandardService'];
    function ResourceMasterPoolListController($scope, platformContainerControllerService, platformTranslateService, resourceMasterPoolUIStandardService) {
        platformTranslateService.translateGridConfig(resourceMasterPoolUIStandardService.getStandardConfigForListView().columns);

        platformContainerControllerService.initController($scope, moduleName, '29278b487bd2434f8781b5929d9534cf');
    }
})();
