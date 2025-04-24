/**
 * Created by las on 7/10/2017.
 */

(function (angular) {
    'use strict';

    var moduleName = 'transportplanning.package';
    var packageModule = angular.module(moduleName);

    packageModule.controller('transportplanningPackageController', TrsPackageController);
    TrsPackageController.$inject = ['$scope', 'platformMainControllerService', 'transportplanningPackageMainService', 'transportplanningPackageTranslationService',
    'transportplanningPackageWizardService',
    'ppsDocumentReportService'];

    function TrsPackageController($scope, platformMainControllerService, TrsPackageMainService, TrsPackageTranslationService, packageWizardService, ppsDocumentReportService) {
        var options = {search: true, reports: false};
        var sidebarReports = platformMainControllerService.registerCompletely($scope, TrsPackageMainService,
            {}, TrsPackageTranslationService, moduleName, options);

        packageWizardService.activate();

        //unregister on destroy
        $scope.$on('$destroy', function () {
            ppsDocumentReportService.unregisterReportPrepare();
            packageWizardService.deactivate();
            platformMainControllerService.unregisterCompletely(TrsPackageMainService, sidebarReports, TrsPackageTranslationService, options);
        });
    }

})(angular);