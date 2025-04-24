/**
 * Created by anl on 1/22/2018.
 */


(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.report';

    angular.module(moduleName).factory('productionpalnningReportReportValidationService', ReportValidationService);

    ReportValidationService.$inject = ['productionpalnningReportReportValidationFactory', 'productionplanningReportReportDataService'];

    function ReportValidationService(ReportValidationFactory, reportDataService) {

       return ReportValidationFactory.createValidationService(reportDataService);
    }

})(angular);
