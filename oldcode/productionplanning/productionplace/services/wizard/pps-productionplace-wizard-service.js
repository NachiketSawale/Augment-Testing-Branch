/**
 * Created by anl on 6/14/2023.
 */

(function (angular) {
	'use strict';
	/* global angular */
	let moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).factory('productionplanningProductionplaceWizardService', ProductionplaceWizardService);

	ProductionplaceWizardService.$inject = [
		'platformSidebarWizardConfigService',
		'platformWizardDialogService',
		'platformModuleStateService',
		'platformSidebarWizardCommonTasksService',
		'ppsProductionPlaceDataService'
	];

	function ProductionplaceWizardService(platformSidebarWizardConfigService,
		platformWizardDialogService,
		platformModuleStateService,
		platformSidebarWizardCommonTasksService,
		productionPlaceDataService) {

		let service = {};
		let wizardID = 'ppsProductionplaceSidebarWizards';

		function disablePlace() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(productionPlaceDataService, 'Disable Production Place',
				'productionplanning.productionplace.wizard.disableTitle', 'Code',
				'productionplanning.productionplace.wizard.enableDisableDone', 'productionplanning.productionplace.wizard.alreadyDisabled',
				'place', 1);
		}

		service.disablePlace = function () {
			let modStorage = platformModuleStateService.state(productionPlaceDataService.getModule()).modifications;
			let mainItemId = modStorage.MainItemId;
			disablePlace().fn().then(function () {
				modStorage.MainItemId = mainItemId;
			});
		};

		function enablePlace() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(productionPlaceDataService, 'Enable Production Place',
				'productionplanning.productionplace.wizard.enableTitle', 'Code',
				'productionplanning.productionplace.wizard.enableDisableDone', 'productionplanning.productionplace.wizard.alreadyEnabled',
				'place', 2);
		}

		service.enablePlace = function () {
			let modStorage = platformModuleStateService.state(productionPlaceDataService.getModule()).modifications;
			let mainItemId = modStorage.MainItemId;
			enablePlace().fn().then(function () {
				modStorage.MainItemId = mainItemId;
			});
		};

		const wizardConfig = {
			showImages: true,
			showTitles: true,
			showSelected: true,
			cssClass: 'sidebarWizard',
			items: [{
				id: 1,
				text: 'Group Name',
				text$tr$: 'productionplanning.productionplace.wizard.wizardGroupName',
				groupIconClass: 'sidebar-icons ico-wiz-change-status',
				visible: true,
				subitems: []
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

