(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	angular.module(moduleName).factory('productionplanningEngineeringHeaderWizardService', wizardService);

	wizardService.$inject = ['platformSidebarWizardConfigService',
		'platformSidebarWizardCommonTasksService',
		'basicsCommonChangeStatusService',
		'productionplanningEngineeringHeaderDataService',
		'projectMainService'];

	function wizardService(platformSidebarWizardConfigService,
						   platformSidebarWizardCommonTasksService,
						   basicsCommonChangeStatusService,
						   dataService,
						   projectMainService) {

		var service = {};
		var wizardID = 'productionplanningEngineeringSidebarWizards';


		function changeEngineeringHeaderStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					mainService: projectMainService,
					dataService: dataService,
					refreshMainService: false,
					statusField: 'EngStatusFk',
					title: 'productionplanning.engineering.wizard.changeHeaderStatusTitle',
					statusName: 'engHeader',
					updateUrl: 'productionplanning/engineering/header/changestatus',
					id: 11
				}
			);
		}

		service.changeEngineeringHeaderStatus = changeEngineeringHeaderStatus().fn;
		var wizardConfig = {
			showImages: true,
			showTitles: true,
			showSelected: true,
			cssClass: 'sidebarWizard',
			items: [{
				id: 1,
				text: 'Groupname',
				text$tr$: 'productionplanning.engineering.wizard.wizardGroupName',
				groupIconClass: 'sidebar-icons ico-wiz-change-status',
				visible: true,
				subitems: [
					changeEngineeringHeaderStatus()
				]
			}]
		};

		service.activate = function activate() {
			platformSidebarWizardConfigService.activateConfig(wizardID, wizardConfig);
		};

		service.deactivate = function deactivate() {
			platformSidebarWizardConfigService.deactivateConfig(wizardID);
		};

		function enableHeader() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(dataService, 'enableHeaderTitle', 'productionplanning.engineering.wizard.enableHeaderTitle', 'Code',
				'productionplanning.engineering.wizard.enableDisableHeaderDone', 'productionplanning.engineering.wizard.headerAlreadyEnabled', 'header', 17);
		}

		service.enableHeader = enableHeader().fn;

		function disableHeader() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(dataService, 'disableHeaderTitle', 'productionplanning.engineering.wizard.disableHeaderTitle', 'Code',
				'productionplanning.engineering.wizard.enableDisableHeaderDone', 'productionplanning.engineering.wizard.headerAlreadyDisabled', 'header', 18);
		}

		service.disableHeader = disableHeader().fn;

		return service;
	}

})(angular);

