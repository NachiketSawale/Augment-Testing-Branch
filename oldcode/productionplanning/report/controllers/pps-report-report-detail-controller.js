/**
 * Created by anl on 1/24/2017.
 */

(function (angular) {

    'use strict';
    var moduleName = 'productionplanning.report';

    angular.module(moduleName).controller('productionplanningReportReportDetailController', ReportDetailController);

    ReportDetailController.$inject = ['$scope', 'platformContainerControllerService', 'productionplanningReportTranslationService'];

    function ReportDetailController($scope, platformContainerControllerService, translationService) {
        platformContainerControllerService.initController($scope, moduleName, 'f32ffb6f21d34c7ab7aca13882ec61fe', translationService);
    }
})(angular);