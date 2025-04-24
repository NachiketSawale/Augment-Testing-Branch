/**
 * Created by pel on 7/11/2019.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.inventory';
	/* jshint -W072 */
	angular.module(moduleName).factory('inventoryHeaderWizardService',
		['platformTranslateService','platformSidebarWizardConfigService','procurementInventoryHeaderDataService','platformSidebarWizardCommonTasksService',
			'$translate','platformModalService','$http','cloudDesktopSidebarService',

			function (platformTranslateService,platformSidebarWizardConfigService,procurementInventoryHeaderDataService,platformSidebarWizardCommonTasksService,
				$translate,platformModalService,$http,cloudDesktopSidebarService) {

				var service = {};

				function disableRecord() {
					return platformSidebarWizardCommonTasksService.provideDisableInstance(procurementInventoryHeaderDataService, 'Disable Record', 'cloud.common.disableRecord', 'Description',
						'procurement.inventory.header.disableDone', 'procurement.inventory.header.alreadyDisabled', 'description', 1);
				}

				function enableRecord() {
					return platformSidebarWizardCommonTasksService.provideEnableInstance(procurementInventoryHeaderDataService, 'Enable Record', 'cloud.common.enableRecord', 'Description',
						'procurement.inventory.header.enableDone', 'procurement.inventory.header.alreadyEnabled', 'description', 2);
				}

				service.generateInventory = function generateInventory() {

					var selectedHeader = procurementInventoryHeaderDataService.getSelected();
					if(!selectedHeader || selectedHeader.Id <= 0) {
						platformModalService.showMsgBox($translate.instant('procurement.inventory.header.selectedHeader'), $translate.instant('procurement.inventory.header.generateInventory'));
						return;
					}
					if(selectedHeader.Version === 0){
						platformModalService.showMsgBox($translate.instant('procurement.inventory.savefirst'));
						return;
					}
					if(selectedHeader.IsPosted){
						platformModalService.showMsgBox($translate.instant('procurement.inventory.cannotexecutewizard'));
						return;
					}

					var modalOptions = {
						headerTextKey: 'procurement.inventory.wizard.generate.caption',
						bodyTextKey: '',
						templateUrl: globals.appBaseUrl + 'procurement.inventory/partials/generate-inventory-wizard-partial.html',
						// iconClass: 'ico-question',
						showCancelButton: true
					};

					platformModalService.showDialog(modalOptions).then(function (result) {
						if (result) {
							generateData(selectedHeader.Id,result.clearActualQuantity);
						}
					});
				};

				function generateData(selectedHeaderId,clearActualQuantity){
					$http.get(globals.webApiBaseUrl +'procurement/inventory/header/generateinventory?mainItemFk='+selectedHeaderId + '&clearActualQuantity=' + clearActualQuantity ).then(function (response) {
						if(response){
							var data = response.data;
							if(data){
								if(data.isSuccess && !data.hasStockTotal){
									platformModalService.showMsgBox($translate.instant('procurement.inventory.noinventorycreated'));
								}
								if(!data.isSuccess){
									platformModalService.showMsgBox(data.message);
								}
							}

						}
						var filterRequest = angular.copy(cloudDesktopSidebarService.filterRequest);
						cloudDesktopSidebarService.filterRequest.pKeys = _.map(procurementInventoryHeaderDataService.getList(), 'Id');
						procurementInventoryHeaderDataService.refresh().then(function () {
							cloudDesktopSidebarService.filterRequest = filterRequest;
						});
					});
				}
				service.processInventory = function processInventory() {

					var selectedHeader = procurementInventoryHeaderDataService.getSelected();
					if(!selectedHeader || selectedHeader.Id <= 0) {
						platformModalService.showMsgBox($translate.instant('procurement.inventory.header.selectedHeader'), $translate.instant('procurement.inventory.header.processInventory'));
						return;
					}
					if(selectedHeader.IsPosted){
						platformModalService.showMsgBox($translate.instant('procurement.inventory.cannotexecutewizard'));
						return;
					}
					if(!selectedHeader.IsCurrentCompany){
						platformModalService.showMsgBox($translate.instant('procurement.inventory.notBelongToLoginCompanyMessage'));
						return;
					}

					procurementInventoryHeaderDataService.updateAndExecute(function () {
						$http.get(globals.webApiBaseUrl + 'procurement/inventory/header/processInventory?mainItemFk=' + selectedHeader.Id).then(function () {
							var filterRequest = angular.copy(cloudDesktopSidebarService.filterRequest);
							cloudDesktopSidebarService.filterRequest.pKeys = _.map(procurementInventoryHeaderDataService.getList(), 'Id');
							procurementInventoryHeaderDataService.refresh().then(function () {
								cloudDesktopSidebarService.filterRequest = filterRequest;
							});
						});
					});

				};
				service.disableRecord = disableRecord().fn;

				service.enableRecord = enableRecord().fn;
				var wizardID = 'inventoryHeaderSidebarWizards';

				var wizards = {
					showImages: true,
					showTitles: true,
					showSelected: true,
					items: [

					]
				};

				service.active = function activate() {
					platformSidebarWizardConfigService.activateConfig(wizardID, wizards);
				};

				service.deactive = function deactivate() {
					platformSidebarWizardConfigService.deactivateConfig(wizardID);
				};
				// loads or updates translated strings
				var loadTranslations = function () {
					platformTranslateService.translateObject(wizards, ['text']);

				};
				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule(moduleName)) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}
				return service;
			}]);
})(angular);
