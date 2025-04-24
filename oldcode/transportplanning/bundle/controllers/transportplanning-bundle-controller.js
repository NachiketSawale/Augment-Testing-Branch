(function (angular) {
    'use strict';

    /**
     * @name transportplanningBundleController
     * @function
     *
     * */
    var moduleName = 'transportplanning.bundle';
    var bundleModul = angular.module(moduleName);

    bundleModul.controller('transportplanningBundleController', BundleController);
    BundleController.$inject = ['$scope', 'platformMainControllerService', 'transportplanningBundleMainService',
        'transportplanningBundleTranslationService', 'ppsDocumentReportService'];

    function BundleController($scope, platformMainControllerService, transportplanningBundleMainService,
                              transportplanningBundleTranslationService, ppsDocumentReportService) {

        var options = {search: true, reports: false};
        var sidebarReports = platformMainControllerService.registerCompletely($scope, transportplanningBundleMainService,
            {}, transportplanningBundleTranslationService, moduleName, options);

        //un-register on destroy
        $scope.$on('$destroy', function () {
            ppsDocumentReportService.unregisterReportPrepare();
            platformMainControllerService.unregisterCompletely(transportplanningBundleMainService, sidebarReports, transportplanningBundleTranslationService, options);
        });

    }

})(angular);