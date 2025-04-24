(function (angular) {
    'use strict';
    let moduleName = 'productionplanning.common';

    angular.module(moduleName).factory('ppsDocumentReportService', ['documentsProjectDocumentFileUploadDataService', '$rootScope',
    function (fileUploadDataService, $rootScope ){
        let service = {};

        service.unregisterReportPrepare = $rootScope.$on('reporting:postPreparePrint', function(dummy, reportValue) {
                reportValue.processed = true;
                fileUploadDataService.storeReportAsProjectDocument(reportValue);
            });
        return service;
    }]);

})(angular);
