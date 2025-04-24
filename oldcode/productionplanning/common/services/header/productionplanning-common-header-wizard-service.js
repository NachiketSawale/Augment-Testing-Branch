
(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.common';
    angular.module(moduleName).factory('productionplanningCommonHeaderWizardService', ProductionplanningCommonHeaderWizardService);

    ProductionplanningCommonHeaderWizardService.$inject = ['platformSidebarWizardConfigService', 'productionplanningCommonHeaderMainServiceFactory',
        'platformSidebarWizardCommonTasksService', 'basicsCommonChangeStatusService','projectMainService'];

    function ProductionplanningCommonHeaderWizardService(platformSidebarWizardConfigService, itemDataServiceFactory,
                                                 platformSidebarWizardCommonTasksService, basicsCommonChangeStatusService,projectMainService) {

        var service = {};
        var wizardID = 'productionplanningCommonHeaderSidebarWizards';
        var itemDataService=itemDataServiceFactory.getService('PrjProjectFk','productionplanning.common.project.header',projectMainService);
        function disablePPSHeader() {
            return platformSidebarWizardCommonTasksService.provideDisableInstance(itemDataService, 'Disable Item',
                'productionplanning.common.header.wizard.disableHeaderTitle', 'Code',
                'productionplanning.common.header.wizard.enableDisableHeaderDone', 'productionplanning.common.header.wizard.headerAlreadyDisabled',
                'header', 11);
        }

        service.disablePPSHeader = disablePPSHeader().fn;

        function enablePPSHeader() {
            return platformSidebarWizardCommonTasksService.provideEnableInstance(itemDataService, 'Enable Item',
                'productionplanning.common.header.wizard.enableHeaderTitle', 'Code',
                'productionplanning.common.header.wizard.enableDisableHeaderDone', 'productionplanning.common.header.wizard.headerAlreadyEnabled',
                'header', 12);
        }

        service.enablePPSHeader = enablePPSHeader().fn;

        function changePPSHeaderStatus() {
            return basicsCommonChangeStatusService.provideStatusChangeInstance(
                {
                    mainService: projectMainService,
                    refreshMainService : false,
                    dataService: itemDataService,
                    statusField: 'HeaderStatusFk',
                    title: 'productionplanning.common.header.wizard.changeHeaderStatus',
                    statusName: 'productionplanningheader',
                    projectField:'PrjProjectFk',
					descField: 'DescriptionInfo.Translated',
                    updateUrl: 'productionplanning/common/wizard/changeheaderstatus',
                    id: 13
                }
            );
        }

        service.changePPSHeaderStatus = changePPSHeaderStatus().fn;
        var wizardConfig = {
            showImages: true,
            showTitles: true,
            showSelected: true,
            cssClass: 'sidebarWizard',
            items: [{
                id: 1,
                text: 'Groupname',
                text$tr$: 'productionplanning.common.header.wizard.headerWizardGroupname',
                groupIconClass: 'sidebar-icons ico-wiz-change-status',
                visible: true,
                subitems: [
                    disablePPSHeader(),
                    enablePPSHeader()
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

