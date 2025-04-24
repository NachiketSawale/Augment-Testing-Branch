(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.common';
    /**
     * @ngdoc controller
     * @name productionplanningCommonHeaderDetailController
     * @function
     *
     * @description
     * Controller for the  detail view of Master entities.
     **/
    /* jshint -W072 */ // many parameters because of dependency injection
    angular.module(moduleName).controller('productionplanningCommonHeaderDetailController', ProductionplanningCommonHeaderDetailController);

    ProductionplanningCommonHeaderDetailController.$inject = ['$scope','$injector', 'platformDetailControllerService', 'productionplanningCommonHeaderMainServiceFactory',
        'productionplanningCommonHeaderUIStandardService', 'productionplanningCommonHeaderValidationService'];

    function ProductionplanningCommonHeaderDetailController($scope,$injector, detailControllerService, dataServiceFactory, uiStandardService, validationService) {

        // get environment variable from the module-container.json file
        var currentModuleName = $scope.getContentValue('currentModule');
        var parentServiceName = $scope.getContentValue('parentService');
        // this property used to handle the product and header cases.
        //var extendedParentServiceName = $scope.getContentValue('extendedParentService');
        var foreignKey = $scope.getContentValue('foreignKey');

        var parentService =$injector.get(parentServiceName);

        var dataService = dataServiceFactory.getService(foreignKey,currentModuleName, parentService);

        validationService = validationService.getValidationService(dataService,currentModuleName);
        detailControllerService.initDetailController($scope, dataService, validationService, uiStandardService, 'productionplanningCommonTranslationService');
    }
})(angular);