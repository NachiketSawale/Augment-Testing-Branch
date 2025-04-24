(function () {

    /*global angular*/
    'use strict';
    var moduleName = 'resource.master';
    var angModule = angular.module(moduleName);


    /* jshint -W072*/ //many parameters because of dependency injection
    angModule.controller('resourceMasterListController', ResourceMasterListController);

    ResourceMasterListController.$inject = ['$scope', 'platformContainerControllerService', 'platformTranslateService',
        'resourceMasterUIStandardService'];
    function ResourceMasterListController($scope, platformContainerControllerService, platformTranslateService,
                                          resourceMasterUIStandardService) {
        platformTranslateService.translateGridConfig(resourceMasterUIStandardService.getStandardConfigForListView().columns);
        platformContainerControllerService.initController($scope, moduleName, '1046a3bd867147feb794bdb60a805eca');
    }
})();