(function () {
    'use strict';

    var moduleName = 'resource.master';

    angular.module(moduleName).controller('resourceMasterController', resourceMasterController);

    resourceMasterController.$inject = ['$scope', 'platformMainControllerService', 'resourceMasterMainService',
        'resourceMasterTranslationService', 'resourceMasterSideBarWizardService'];

    function resourceMasterController($scope, platformMainControllerService, resourceMasterMainService,
                                      resourceMasterTranslationService, resourceMasterSideBarWizardService) {
        var options = {search: true, reports: false};
        var sidebarReports = platformMainControllerService.registerCompletely($scope, resourceMasterMainService,
            {}, resourceMasterTranslationService, moduleName, options);

        resourceMasterSideBarWizardService.activate();

        // un-register on destroy
        $scope.$on('$destroy', function () {
            resourceMasterSideBarWizardService.deactivate();
            platformMainControllerService.unregisterCompletely(resourceMasterMainService, sidebarReports,
                resourceMasterTranslationService, options);
        });
    }
})();
