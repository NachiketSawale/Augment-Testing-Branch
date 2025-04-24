/**
 * Created by anl on 2/1/2018.
 */



(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.report';
    angular.module(moduleName).factory('productionplanningReportWizardService', MountingWizardService);

    MountingWizardService.$inject = ['platformSidebarWizardConfigService',
        'platformSidebarWizardCommonTasksService',
        'basicsCommonChangeStatusService',
        'productionplanningReportReportDataService'];

    function MountingWizardService(platformSidebarWizardConfigService,
                                   platformSidebarWizardCommonTasksService,
                                   basicsCommonChangeStatusService,
                                   reportDataService) {

        var service = {};
        var wizardID = 'productionplanningReportSidebarWizards';

        var changeReportStatus = function changeReportStatus() {
            return basicsCommonChangeStatusService.provideStatusChangeInstance(
                {
                    id: 11,
                    mainService: reportDataService,
                    refreshMainService: true,
                    statusField: 'RepStatusFk',
                    statusName: 'mntreport',
                    statusDisplayField: 'DescriptionInfo.Translated',
                    title: 'productionplanning.report.wizard.changeReportStatus',
                    updateUrl: 'productionplanning/report/wizard/changereportstatus',
                    supportMultiChange: true
                }
            );
        };
        service.changeReportStatus = changeReportStatus().fn;


        var wizardConfig = {
            showImages: true,
            showTitles: true,
            showSelected: true,
            cssClass: 'sidebarWizard',
            items: [{
                id: 1,
                text: 'Groupname',
                text$tr$: 'productionplanning.mounting.wizard.wizardGroup',
                groupIconClass: 'sidebar-icons ico-wiz-change-status',
                visible: true,
                subitems: [
                    changeReportStatus()
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