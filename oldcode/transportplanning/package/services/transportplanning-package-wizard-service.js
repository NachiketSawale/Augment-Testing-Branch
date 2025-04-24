/**
 * Created by las on 8/4/2017.
 */

(function (angular) {
    'use strict';

    var moduleName = 'transportplanning.package';
    var packageModule = angular.module(moduleName);

    packageModule.factory('transportplanningPackageWizardService', PackageWizardService);
    PackageWizardService.$inject = ['platformSidebarWizardConfigService', 'basicsCommonChangeStatusService', 'transportplanningPackageMainService'];

    function PackageWizardService(platformSidebarWizardConfigService, basicsCommonChangeStatusService, transportplanningPackageMainService) {

        var service = {};
        var wizardID = 'transportplanningPackageSidebarWizards';

        function changePackageStatus() {
            return basicsCommonChangeStatusService.provideStatusChangeInstance(
                {
	                 refreshMainService: false,
                    mainService: transportplanningPackageMainService,
                    statusField: 'TrsPkgStatusFk',
                    title: 'transportplanning.package.wizard.changePackageStatus',
                    statusName: 'trsPackage',
                    updateUrl: 'transportplanning/package/wizard/changepackagestatus',
                    id: 13,
                    supportMultiChange: true
                }
            );
        }

        service.changePackageStatus = changePackageStatus().fn;

        var wizardConfig = {
            showImages: true,
            showTitles: true,
            showSelected: true,
            cssClass: 'sidebarWizard',
            items: [{
                id: 1,
                text: 'Groupname',
                text$tr$: 'transportplanning.package.wizard.wizardGroupname1',
                groupIconClass: 'sidebar-icons ico-wiz-change-status',
                visible: true,
                subitems: [
                    changePackageStatus()
                ]
            }]
        };

        service.activate = function activate() {
            platformSidebarWizardConfigService.activateConfig(wizardID, wizardConfig);
        };

        service.deactivate = function deactivate() {
            platformSidebarWizardConfigService.deactivateConfig(wizardID);
        };

        return service;
    }
})(angular);