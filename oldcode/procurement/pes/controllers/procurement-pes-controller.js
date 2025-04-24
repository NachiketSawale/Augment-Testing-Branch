(function (angular) {
	'use strict';
	var moduleName = 'procurement.pes';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	/* jshint -W072 */
	angular.module(moduleName).controller('procurementPesController',
		['$scope', 'procurementPesHeaderService', 'procurementPesItemService', 'procurementPesShipmentInfoService',
			'procurementPesBoqService', 'cloudDesktopInfoService',
			'$translate', 'procurementContextService', 'platformMainControllerService',
			'procurementPesTranslationService', 'procurementCommonTabConfigService',
			'cloudDesktopSidebarService', 'documentsProjectDocumentDataService',
			'procurementPesWizardService', 'prcBoqMainService', 'basicsCharacteristicDataServiceFactory',
			'modelViewerStandardFilterService', 'procurementPesNumberGenerationSettingsService', 'platformNavBarService',
			'documentsProjectDocumentModuleContext', '$injector','documentsProjectDocumentFileUploadDataService','$rootScope',
			function ($scope, procurementPesHeaderService, itemService, procurementPesShipmentInfoService,
				procurementPesBoqService, cloudDesktopInfoService,
				$translate, moduleContext, mainControllerService,
				translateService, procurementCommonTabConfigService,
				cloudDesktopSidebarService, documentsProjectDocumentDataService,
				procurementPesWizardService, prcBoqMainService, basicsCharacteristicDataServiceFactory,
				modelViewerStandardFilterService, procurementPesNumberGenerationSettingsService, platformNavBarService,
				documentsProjectDocumentModuleContext, $injector,fileUploadDataService, $rootScope) {

				var opt = {search: true, reports: false, wizards: true, auditTrail: '55a85627025049ee992f5c99e655c82b'};
				var result = mainControllerService.registerCompletely($scope, procurementPesHeaderService, {}, translateService, moduleName, opt);
				basicsCharacteristicDataServiceFactory.getService(procurementPesHeaderService, procurementPesHeaderService.targetSectionId);
				// cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNamePerformanceEntrySheet');
				procurementPesHeaderService.registerLookupFilter();

				// set module context variables
				moduleContext.setLeadingService(procurementPesHeaderService);
				moduleContext.setMainService(procurementPesBoqService);
				moduleContext.setItemDataService(procurementPesShipmentInfoService);
				moduleContext.setItemDataService(itemService);
				moduleContext.setModuleReadOnly(false);
				procurementPesWizardService.active();
				procurementPesNumberGenerationSettingsService.assertLoaded();

				procurementCommonTabConfigService.registerTabConfig(moduleName, procurementPesHeaderService);

				var sidebarInfo = {
					name: cloudDesktopSidebarService.getSidebarIds().info,
					title: 'info',
					type: 'template',
					templateUrl: globals.appBaseUrl + 'procurement.pes/templates/sidebar-info.html'
				};
				// noinspection JSCheckFunctionSignatures
				cloudDesktopSidebarService.registerSidebarContainer(sidebarInfo, true);

				documentsProjectDocumentDataService.register({
					moduleName: moduleName,
					title: $translate.instant('procurement.pes.headerContainerTitle'),
					parentService: procurementPesHeaderService,
					columnConfig: [
						{documentField: 'PesHeaderFk', dataField: 'Id', readOnly: false},
						{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
						{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
						{documentField: 'PrcStructureFk', dataField: 'PrcStructureFk', readOnly: false},
						{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
						{documentField: 'ConHeaderFk', dataField: 'ConHeaderFk', readOnly: false},
						{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false},
						{documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
						{documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false},
						{documentField: 'BpdSubsidiaryFk', dataField: 'SubsidiaryFk', readOnly: false}
					]
				});

				procurementPesBoqService.upServiceAboutBoq();

				var boqMainService = prcBoqMainService.getService(procurementPesBoqService);

				function onPesStatusChanged(pesStatus) {
					if (pesStatus) {
						boqMainService.setReadOnly(pesStatus.IsReadOnly);
					}
				}

				procurementPesHeaderService.selectedPesStatusChanged.register(onPesStatusChanged);

				modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('procurementPesModelFilterService');

				// add export capability
				var exportOptions = {
					ModuleName: moduleName,
					// permission: '40af135e208349168b8ac5f330a09500#e',
					MainContainer: {
						Id: '1',
						Label: 'procurement.pes.headerContainerTitle'
					},
					SubContainers: [
						{
							Id: '2',
							Qualifier: 'items',
							Label: 'procurement.pes.itemContainerTitle',
							Selected: false
						}
					]
				};
				mainControllerService.registerExport(exportOptions);  // add export feature to the main-controller

				var originDiscard = platformNavBarService.getActionByKey('discard').fn;
				platformNavBarService.getActionByKey('discard').fn = function () {
					originDiscard();
					var config = documentsProjectDocumentModuleContext.getConfig();
					var documentService = documentsProjectDocumentDataService.getService(config);
					documentService.clear();
				};

				var boqMainLookupFilterService = $injector.get('boqMainLookupFilterService');
				var procurementContractHeaderDataService = $injector.get('procurementContractHeaderDataService');

				function onCopySourceBoqContainerCreated() {
					var currentPesHeader = procurementPesHeaderService.getSelected();
					var basicsLookupdataLookupDataService = $injector.get('basicsLookupdataLookupDataService');

					if (_.isObject(currentPesHeader)) {
						basicsLookupdataLookupDataService.getItemByKey('conheader', currentPesHeader.ConHeaderFk).then(function (correspondingContractHeader) {
							procurementContractHeaderDataService.maintainBoqMainLookupFilter(correspondingContractHeader);
						});
					}
				}

				boqMainLookupFilterService.copySourceBoqContainerCreated.register(onCopySourceBoqContainerCreated);
				boqMainLookupFilterService.setTargetBoqMainService(boqMainService);
				const unregisterReportPrepare = $rootScope.$on('reporting:postPreparePrint', function(dummy, reportValue) {
					reportValue.processed = true;
					fileUploadDataService.storeReportAsProjectDocument(reportValue);
				});

				$scope.$on('$destroy', function () {
					unregisterReportPrepare();
					procurementPesHeaderService.unRegisterLookupFilter();
					mainControllerService.unregisterCompletely(procurementPesHeaderService, result, translateService, opt);
					// noinspection JSCheckFunctionSignatures
					cloudDesktopSidebarService.unRegisterSidebarContainer(sidebarInfo.name, true);
					// remove context values

					procurementPesHeaderService.unregisterSelectionChanged(procurementPesHeaderService.onSelectionChanged);

					procurementPesHeaderService.selectedPesStatusChanged.unregister(onPesStatusChanged);

					moduleContext.removeModuleValue(moduleContext.leadingServiceKey);
					moduleContext.removeModuleValue(moduleContext.prcCommonMainService);
					moduleContext.removeModuleValue(moduleContext.itemDataServiceKey);
					moduleContext.removeModuleValue(moduleContext.moduleReadOnlyKey);

					procurementCommonTabConfigService.unregisterTabConfig();

					procurementPesWizardService.deactive();
					boqMainLookupFilterService.copySourceBoqContainerCreated.unregister(onCopySourceBoqContainerCreated);
					boqMainLookupFilterService.setTargetBoqMainService(boqMainService);
				});
			}
		]);
})(angular);