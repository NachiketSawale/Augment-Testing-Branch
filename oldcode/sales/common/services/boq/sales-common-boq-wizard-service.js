/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var salesCommonModule = 'sales.common';

	/**
	 * @ngdoc service
	 * @name salesCommonBoqWizardService
	 * @description provides helper functions for boq wizards
	 */
	angular.module(salesCommonModule).service('salesCommonBoqWizardService', [
		'_', '$injector', 'platformDialogService', 'boqMainGaebImportService', 'boqMainGaebExportService', 'boqMainExportOptionsService', 'basicsExportService', 'boqMainImportOptionsService', 'basicsImportService', 'boqMainElementValidationService', 'boqMainWizardService',
		function (_, $injector, platformDialogService, boqMainGaebImportService, boqMainGaebExportService, boqMainExportOptionsService, basicsExportService, boqMainImportOptionsService, basicsImportService, boqMainValidationService, boqMainWizardService) {

			// Checks if the BOQ is in the roight status to be modified, saves the latest changes and executes the wizard function.
			function checkSaveAndExecuteAsync(boqMainService, dataService, funcWhenSucceeded) {
				if (boqMainService.getReadOnly()) {
					platformDialogService.showInfoBox('boq.main.boqInReadonlyStatus');
					return;
				}

				dataService.updateAndExecute(funcWhenSucceeded);
			}

			return {

				GaebImport: function GaebImport(dataService, boqMainServiceName, wizardParameter) {
					var boqMainService = $injector.get(boqMainServiceName);

					checkSaveAndExecuteAsync(boqMainService, dataService, function() {
						var options = {};
						options.boqMainService = boqMainService;
						options.wizardParameter = wizardParameter;
						boqMainGaebImportService.showImportDialog(options);
					});
				},

				createAndImportBoqs: function createAndImportBoqs(dataService, boqStructureServiceName, wizardParameter, boqHeaderService) {

					var selecteMainItem = dataService.getSelected();
					if (selecteMainItem) {
						/* var boqStructureService = */$injector.get(boqStructureServiceName); // TODO: no-unused-vars
						var options = {};
						options.boqRootItem = null; // will be created by boqMainGaebImportService
						options.projectId = selecteMainItem.ProjectFk;
						options.boqMainService = null;   // $injector.get('boqMainService');
						options.mainService = dataService;
						options.createItemService = boqHeaderService;
						options.wizardParameter = wizardParameter;
						boqMainGaebImportService.showImportMultipleFilesDialog(options);
					}
				},

				GaebExport: function GaebExport(dataService, boqStructureServiceName, wizardParameter) {
					dataService.updateAndExecute(function () {
						var boqStructureService = $injector.get(boqStructureServiceName);
						var options = {};
						options.boqMainService = boqStructureService;
						options.wizardParameter = wizardParameter;
						boqMainGaebExportService.showDialog(options);
					});
				},

				importCrbSia: function importCrbSia(dataService, boqMainServiceName) {
					var boqMainService = $injector.get(boqMainServiceName);
					checkSaveAndExecuteAsync(boqMainService, dataService, function() {
						boqMainWizardService.importCrbSia(boqMainService);
					});
				},

				exportCrbSia: function exportCrbSia(dataService, boqStructureServiceName) {
					dataService.updateAndExecute(function() {
						boqMainWizardService.exportCrbSia($injector.get(boqStructureServiceName));
					});
				},

				importOenOnlv: function(dataService, boqMainServiceName) {
					var boqMainService = $injector.get(boqMainServiceName);
					checkSaveAndExecuteAsync(boqMainService, dataService, function() {
						boqMainWizardService.importOenOnlv(boqMainService);
					});
				},

				exportOenOnlv: function(dataService, boqStructureServiceName) {
					dataService.updateAndExecute(function() {
						boqMainWizardService.exportOenOnlv($injector.get(boqStructureServiceName));
					});
				},

				BoqExcelExport: function BoqExcelExport(dataService, boqStructureServiceName, wizardParameter) {
					dataService.updateAndExecute(function () {
						var boqMainService = $injector.get(boqStructureServiceName);
						var options = boqMainExportOptionsService.getExportOptions(boqMainService);
						options.MainContainer.Id = '4';
						options.wizardParameter = wizardParameter;
						basicsExportService.showExportDialog(options);
					});
				},

				BoqExcelImport: function BoqExcelImport(dataService, boqMainServiceName, wizardParameter) {
					var boqMainService = $injector.get(boqMainServiceName);
					checkSaveAndExecuteAsync(boqMainService, dataService, function() {
						var options = boqMainImportOptionsService.getImportOptions(boqMainService);
						options.wizardParameter = wizardParameter;
						basicsImportService.showImportDialog(options);
					});
					boqMainService.onImportSucceeded.register(function()  {
						dataService.refresh();
					});
				},

				startQuantityInspector: function(dataService, boqStructureServiceName) {
					dataService.updateAndExecute(function() {
						boqMainWizardService.startQuantityInspector($injector.get(boqStructureServiceName));
					});
				},

				scanBoq: function scanBoq(dataService, boqStructureServiceName/* , wizardParameter */) { // TODO: no-unused-vars
					dataService.updateAndExecute(function () {
						var boqMainService = $injector.get(boqStructureServiceName);
						/* var options = */boqMainImportOptionsService.getImportOptions(boqMainService); // TODO: no-unused-vars
						var params = {};
						params.ContinueButton = false;
						boqMainValidationService.scanBoqAndShowResult(boqMainService.getRootBoqItem(), null, params);
					});
				},

				selectGroups: function selectGroups(dataService, boqMainServiceName) {
					dataService.updateAndExecute(function() {
						boqMainWizardService.selectGroups($injector.get(boqMainServiceName));
					});
				},

				RenumberBoQ: function RenumberBoQ(dataService, boqMainServiceName) {
					var boqMainService = $injector.get(boqMainServiceName);
					checkSaveAndExecuteAsync(boqMainService, dataService, function() {
						var boqMainRenumberService = $injector.get('boqMainRenumberService');
						boqMainRenumberService.renumberBoqItems(boqMainService);
					});
				},

				formatBoQSpecification: function formatBoQSpecification(dataService, boqMainServiceName) {
					var boqMainService = $injector.get(boqMainServiceName);
					checkSaveAndExecuteAsync(boqMainService, dataService, function() {
						boqMainWizardService.formatBoQSpecification(boqMainService, dataService);
					});
				},

				changeBoqHeaderStatus: function changeBoqHeaderStatus(dataService, boqServiceName) {
					var basicsCommonChangeStatusService = $injector.get('basicsCommonChangeStatusService');
					var boqService = $injector.get(boqServiceName);

					return basicsCommonChangeStatusService.provideStatusChangeInstance(
						{
							statusName: 'boq',
							mainService: dataService,
							// boqService returns a composite object, entity is { BoqHeader: {...} }
							getDataService: function () {
								return {
									getSelected: function () {
										return _.get(boqService.getSelected(), 'BoqHeader');
									},
									gridRefresh: function () {
										boqService.gridRefresh();
									}
								};
							},
							statusField: 'BoqStatusFk',
							statusDisplayField: 'DescriptionInfo.Translated',
							title: 'boq.main.wizardChangeBoqStatus',
							updateUrl: 'boq/main/changeheaderstatus'
						}
					);
				},

				updateBoq: function updateBoq(dataService, boqMainServiceName, module) {
					var boqMainService = $injector.get(boqMainServiceName);
					var selectedMainItem = dataService.getSelected();

					if (selectedMainItem) {
						checkSaveAndExecuteAsync(boqMainService, dataService, function() {
							var headerData = {
								Module: module,
								HeaderId: selectedMainItem.Id,
								ExchangeRate: selectedMainItem.ExchangeRate
							};
							var projectId = selectedMainItem.ProjectFk;
							boqMainWizardService.updateBoq(boqMainService, projectId, dataService, headerData);
						});
					}
				},

				changeProjectChangeStatus: function changeProjectChangeStatus(dataService, boqMainServiceName) {
					return boqMainWizardService.changeProjectChangeStatus(dataService, $injector.get(boqMainServiceName));
				}
			};
		}
	]);

})();
