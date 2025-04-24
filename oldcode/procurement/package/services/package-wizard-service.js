(function (angular) {
    'use strict';
    // eslint-disable-next-line no-redeclare
    /* global angular,globals,console ,_ */
    var moduleName = 'procurement.package';
    /* jshint -W072 */
    angular.module(moduleName).factory('procurementPackageWizardService', ['platformTranslateService', 'platformSidebarWizardConfigService', '$http', '$translate', '$injector', 'cloudDesktopSidebarService', 'platformSidebarWizardCommonTasksService',
        'platformModalService', 'procurementPackageDataService', 'procurementPackagePackage2HeaderService', 'basicsCommonChangeStatusService', 'procurementCommonPrcItemDataService', 'procurementPackageWizardCreateRequisitionService',
        'procurementPackageWizardCreateContractService', 'procurementPackageEventService', 'procurementPackageWizardGenerateItemsService', 'procurementCommonItemStatusChangeService', 'procurementPackageWizardEvalutionEventsService',
        'procurementPackageWizardUpdateSchedulingService', 'documentProjectDocumentsStatusChangeService', 'procurementPackageWizardChangeStructureService', 'procurementPackageWizardCreatePackageFromTemplateService', 'prcBoqMainService',
        'procurementCommonPrcBoqService', 'procurementPackageImportWizardService', 'procurementPackageWizardUpdateDateService', 'basicsCommonUpdateCashFlowProjectionService', 'procurementPackageTotalDataService', '_',
        'basicsLookupdataLookupDescriptorService', 'procurementCommonItemQuantityValidationFlagService', 'platformDataValidationService', 'procurementCommonPrcItemValidationService', 'platformRuntimeDataService',
        'boqMainGaebImportService', 'boqMainGaebExportService', 'procurementCommonCreateBusinessPartnerService', 'packageUpdateEstimateService', 'basicsProcurementConfigurationTotalKinds', 'procurementCommonReplaceNeutralMaterialService',
        'procurementCommonUpdateItemPriceService', 'boqMainExportOptionsService', 'basicsExportService', 'procurementCommonGenerateDeliverySchedulePackageService', 'procurementPackageWizardSendtoYtwoService', 'boqMainImportOptionsService',
        'basicsImportService', 'ProcurementCommonChangeConfigurationService', 'procurementContextService', 'boqMainElementValidationService', 'basicsCommonFileDownloadService', 'procurementCommonImportMaterialService', 'boqMainWizardService',
        'basicsCommonAIService', 'prcCommonItemExportOptionsService', 'basicsCommonChangeCodeService', 'prcCommonSplitOverallDiscountService', 'procurementPackageBidderSearchWizardService', 'procurementCommonCreateSuggestedBidderService',
        'platformModuleNavigationService', 'platformDialogService', 'procurementCommonSelectAlternateGroupService', 'procurementCommonTotalDataService', 'procurementCommonGeneratePaymentScheduleService', 'basicsWorkflowWizardContextService',
        '$q', 'prcCommonMaintainPaymentScheduleVersionService', 'prcCommonPaymentScheduleStatusChangeService', 'procurementCommonRenumberItemService', 'procurementItemProjectChangeService', 'procurementPackageEditBudgetWizardService',
		  'ProcurementCommonDisableEnabledService',
        function (platformTranslateService, platformSidebarWizardConfigService, $http, $translate, $injector, cloudDesktopSidebarService, platformSidebarWizardCommonTasksService, platformModalService, headerDataService,
                  procurementPackagePackage2HeaderService, basicsCommonChangeStatusService, procurementCommonPrcItemDataService, wizardCreateRequisitionService, wizardCreateContractService, procurementPackageEventService,
                  procurementPackageWizardGenerateItemsService, prcChangeStatusService, evalutionEventsService, updateSchedulingService, documentProjectDocumentsStatusChangeService, procurementPackageWizardChangeStructureService,
                  createPackageFromTemplate, prcBoqMainService, procurementCommonPrcBoqService, procurementPackageImportWizardService, procurementPackageWizardUpdateDateService, basicsCommonUpdateCashFlowProjectionService,
                  procurementPackageTotalDataService, _, basicsLookupdataLookupDescriptorService, procurementCommonItemQuantityValidationFlagService, platformDataValidationService, procurementCommonPrcItemValidationService,
                  platformRuntimeDataService, boqMainGaebImportService, boqMainGaebExportService, procurementCommonCreateBusinessPartnerService, packageUpdateEstimateService, totalKinds, procurementCommonReplaceNeutralMaterialService,
                  procurementCommonUpdateItemPriceService, boqMainExportOptionsService, basicsExportService, procurementCommonGenerateDeliverySchedulePackageService, procurementPackageWizardSendtoYtwoService, boqMainImportOptionsService,
                  basicsImportService, ProcurementCommonChangeConfigurationService, procurementContextService, boqMainValidationService, basicsCommonFileDownloadService, procurementCommonImportMaterialService, boqMainWizardService,
                  basicsCommonAIService, prcCommonItemExportOptionsService, basicsCommonChangeCodeService, prcCommonSplitOverallDiscountService, procurementPackageBidderSearchWizardService, procurementCommonCreateSuggestedBidderService,
                  navigateService, platformDialogService, procurementCommonSelectAlternateGroupService, procurementCommonTotalDataService, procurementCommonGeneratePaymentScheduleService, basicsWorkflowWizardContextService, $q,
                  prcCommonMaintainPaymentScheduleVersionService, prcCommonPaymentScheduleStatusChangeService, procurementCommonRenumberItemService, procurementItemProjectChangeService, procurementPackageEditBudgetWizardService,
	        procurementCommonDisableEnabledService) {
            var service = {};

            var wizardID = 'procurementPackageSidebarWizards';

            function changePackageStatus() {
                return basicsCommonChangeStatusService.provideStatusChangeInstance({
                    mainService: headerDataService,
                    statusField: 'PackageStatusFk',
                    validateCanChangeStatus: true,
                    title: 'procurement.package.wizard.change.status.headerText',
                    statusName: 'package',
                    projectField: 'ProjectFk',
                    updateUrl: 'procurement/package/wizard/changestatus',
                    id: 11,
                    doStatusChangePostProcessing: function () {
                        var currentItem = headerDataService.getSelected();
                        if (currentItem) {
                            procurementContextService.setModuleStatus(headerDataService.getModuleState(currentItem));
                        } else {
                            procurementContextService.setModuleStatus({IsReadonly: true});
                        }

                        headerDataService.selectedPackageStatusChanged.fire(procurementContextService.getModuleStatus());
                        headerDataService.PackageStatusChangedByWizard.fire(procurementContextService.getModuleStatus());
                        if (currentItem) {
                            headerDataService.setEntityReadOnly(currentItem);
                        }
                    }
                });
            }

            function changeStatusForItem() {
                return prcChangeStatusService.providePrcItemStatusChangeInstance(headerDataService, procurementCommonPrcItemDataService, procurementPackagePackage2HeaderService, 12);
            }

            function changeStatusForProjectDocument() {
                return documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(headerDataService, 'procurement.package');
            }

            function changePaymentScheduleStatus() {
                return prcCommonPaymentScheduleStatusChangeService.providePrcPaymentScheduleStatusChangeInstance(headerDataService, procurementPackagePackage2HeaderService);
            }

            function changeProjectChangeStatus() {
                return boqMainWizardService.changeProjectChangeStatus(headerDataService, prcBoqMainService.getService(procurementPackagePackage2HeaderService));
            }

            function changeItemProjectChangeStatus() {
                var prcItemPrjChangeService = procurementItemProjectChangeService.getService(headerDataService, procurementCommonPrcItemDataService.getService(procurementPackagePackage2HeaderService));
                return prcItemPrjChangeService.changeProjectChangeStatus();
            }

            function changePackageCode() {
                return basicsCommonChangeCodeService.provideCodeChangeInstance({
                    mainService: headerDataService,
                    validationService: 'procurementPackageValidationService',
                    title: 'procurement.package.wizard.change.code.headerText'
                });
            }

            function disableRecord() {
                return platformSidebarWizardCommonTasksService.provideDisableInstance(headerDataService, 'Disable Record', 'cloud.common.disableRecord', 'Code', 'procurement.package.disableDone', 'procurement.package.alreadyDisabled', 'code', 13);
            }

            function enableRecord() {
                return platformSidebarWizardCommonTasksService.provideEnableInstance(headerDataService, 'Enable Record', 'cloud.common.enableRecord', 'Code', 'procurement.package.enableDone', 'procurement.package.alreadyEnabled', 'code', 14);
            }

            function removeItemQuantityValidation() {
                var item = procurementCommonPrcItemDataService.getService().getSelected();
                if (item === null) {
                    platformModalService.showMsgBox('Please select an Item', 'Info', 'ico-info');
                    return;
                }
                procurementCommonItemQuantityValidationFlagService.validateOrNot = false;
                platformDataValidationService.removeFromErrorList(item, 'Quantity', procurementCommonPrcItemValidationService, procurementCommonPrcItemDataService.getService());
                platformRuntimeDataService.applyValidationResult(true, item, 'Quantity');
                procurementCommonPrcItemDataService.getService().gridRefresh();
            }

            function validateAndUpdateItemQuantity() {
                platformModalService.showDialog({
                    templateUrl: globals.appBaseUrl + 'procurement.package/partials/procurement-package-validate-and-update-item-quantity.html',
                    backdrop: false
                }).then(function (result) {
                    if (result.ok === true) {
                        procurementCommonPrcItemDataService.getService().load();
                    }
                });
            }

            service.changeProjectChangeStatus = changeProjectChangeStatus().fn;

            service.changeItemProjectChangeStatus = changeItemProjectChangeStatus().fn;

            service.changePackageStatus = changePackageStatus().fn;

            service.changeStatusForItem = changeStatusForItem().fn;

            service.changeStatusForProjectDocument = changeStatusForProjectDocument().fn;

            service.changePaymentScheduleStatus = changePaymentScheduleStatus().fn;

            service.changePackageCode = changePackageCode().fn;

            service.disableRecord = disableRecord().fn;

            service.enableRecord = enableRecord().fn;

            service.removeItemQuantityValidation = removeItemQuantityValidation;

            service.validateAndUpdateItemQuantity = validateAndUpdateItemQuantity;

            service.gaebImport = function gaebImport(wizardParameter) {
                headerDataService.updateAndExecute(function () {
                    var options = {};
                    var prcBoqMainService = $injector.get('prcBoqMainService');
                    options.boqMainService = prcBoqMainService.getService(procurementPackagePackage2HeaderService);
                    options.wizardParameter = wizardParameter;
                    boqMainGaebImportService.showImportDialog(options);
                });
            };

            service.createAndImportBoqs = function createAndImportBoqs(wizardParameter) {

                headerDataService.updateAndExecute(function () {
                    var selectedHeader = headerDataService.getSelected();
                    if (selectedHeader) {
                        var boqMainService = prcBoqMainService.getService(procurementPackagePackage2HeaderService);
                        var prcBoqService = procurementCommonPrcBoqService.getService(procurementPackagePackage2HeaderService, boqMainService);
                        var options = {};
                        options.boqRootItem = null; // will be created by boqMainGaebImportService
                        options.projectId = selectedHeader.ProjectFk;
                        options.boqMainService = null;   // $injector.get('boqMainService');
                        options.mainService = headerDataService;
                        options.createItemService = prcBoqService;
                        options.wizardParameter = wizardParameter;
                        boqMainGaebImportService.showImportMultipleFilesDialog(options);
                    }
                });
            };

            service.findBidderFull = function findBidderFull() {
                headerDataService.updateAndExecute(procurementPackageBidderSearchWizardService.showBizPartnerPortalDialog);
            };

            service.gaebExport = function gaebExport(wizardParameter) {
                headerDataService.updateAndExecute(function () {

                    var prcBoqMainService = $injector.get('prcBoqMainService');
                    prcBoqMainService = prcBoqMainService.getService(procurementPackagePackage2HeaderService);
                    var options = {};
                    options.boqMainService = prcBoqMainService;
                    options.wizardParameter = wizardParameter;
                    boqMainGaebExportService.showDialog(options);

                });
            };

            service.importOenOnlv = function importOenOnlv() {
                headerDataService.updateAndExecute(function () {
                    boqMainWizardService.importOenOnlv(prcBoqMainService.getService(procurementPackagePackage2HeaderService));
                });
            };

            service.exportOenOnlv = function exportOenOnlv() {
                headerDataService.updateAndExecute(function () {
                    boqMainWizardService.exportOenOnlv(prcBoqMainService.getService(procurementPackagePackage2HeaderService));
                });
            };

            service.importCrbSia = function importCrbSia() {
                headerDataService.updateAndExecute(function () {
                    boqMainWizardService.importCrbSia(prcBoqMainService.getService(procurementPackagePackage2HeaderService));
                });
            };

            service.exportCrbSia = function exportCrbSia() {
                headerDataService.updateAndExecute(function () {
                    boqMainWizardService.exportCrbSia(prcBoqMainService.getService(procurementPackagePackage2HeaderService));
                });
            };

            service.BoqExcelExport = function BoqExcelExport(wizardParameter) {
                headerDataService.updateAndExecute(function () {
                    var boqMainService = $injector.get('prcBoqMainService');
                    boqMainService = boqMainService.getService(procurementPackagePackage2HeaderService);
                    var options = boqMainExportOptionsService.getExportOptions(boqMainService);
                    options.MainContainer.Id = 'boq.main.containerheader.boqStructure';
                    options.wizardParameter = wizardParameter;
                    basicsExportService.showExportDialog(options);
                });
            };

            service.BoqExcelImport = function BoqExcelImport(wizardParameter) {
                headerDataService.updateAndExecute(function () {
                    var boqMainService = $injector.get('prcBoqMainService');
                    boqMainService = boqMainService.getService(procurementPackagePackage2HeaderService);
                    var options = boqMainImportOptionsService.getImportOptions(boqMainService);
                    options.wizardParameter = wizardParameter;
                    basicsImportService.showImportDialog(options);
                });
            };

            service.selectGroups = function selectGroups() {
                headerDataService.updateAndExecute(function () {
                    boqMainWizardService.selectGroups(prcBoqMainService.getService(procurementPackagePackage2HeaderService));
                });
            };

            service.selectPrcItemGroups = function selectPrcItemGroups() {
                var commonPrcItemService = procurementCommonPrcItemDataService.getService(procurementPackagePackage2HeaderService);
                procurementCommonSelectAlternateGroupService.showSelectAlternateGroupWizardDialog(commonPrcItemService);
            };

            service.selectItemScopeReplacement = function selectItemScopeReplacement() {
                var commonPrcItemService = procurementCommonPrcItemDataService.getService(procurementPackagePackage2HeaderService);
                var itemSelected = commonPrcItemService.getSelected();
                if (!itemSelected) {
                    platformModalService.showMsgBox('procurement.package.wizard.scopeReplacement.selectPrcItem', 'Info', 'warning');
                    return;
                }
                var selectedHeader = headerDataService.getSelected();
                let packageId = selectedHeader.Id;
                // let prcHeaderFk=itemSelected.PrcHeaderFk;
                let itemId = itemSelected.Id;
                $http.get(globals.webApiBaseUrl + 'procurement/package/wizard/checkBasePrcItem?packageId=' + packageId + '&prcItemId=' + itemId).then(function (response) {
                    var res = response.data;
                    if (res) {
                        let modalOptions = {
                            templateUrl: globals.appBaseUrl + 'procurement.package/templates/item-scope-replacement-dialog.html',
                            resizeable: true,
                            width: '1080px',
                            heigth: '810px'
                        };
                        platformModalService.showDialog(modalOptions);
                    } else {
                        platformModalService.showMsgBox('procurement.package.wizard.scopeReplacement.isInAssignmentMessage', 'Info', 'warning');
                    }
                });
            };

            service.scanBoq = function scanBoq() {
                headerDataService.updateAndExecute(function () {
                    var boqMainService = $injector.get('prcBoqMainService');
                    boqMainService = boqMainService.getService(procurementPackagePackage2HeaderService);
                    boqMainValidationService.scanBoqAndShowResult(boqMainService.getRootBoqItem(), 'x81');
                });
            };

            service.renumberBoq = function renumberBoq() {
                headerDataService.updateAndExecute(function () {
                    var prcBoqMainService = $injector.get('prcBoqMainService');
                    prcBoqMainService = prcBoqMainService.getService(procurementPackagePackage2HeaderService);
                    var boqMainRenumberService = $injector.get('boqMainRenumberService');
                    boqMainRenumberService.renumberBoqItems(prcBoqMainService);
                });
            };

            service.renumberFreeBoq = function () {
                headerDataService.updateAndExecute(function () {
                    var modalOptions = {
                        headerTextKey: 'boq.main.freeBoqRenumber',
                        bodyTextKey: 'boq.main.renumberOptionTitle',
                        templateUrl: globals.appBaseUrl + 'boq.main/templates/boq-main-renumber-freeboq.html',
                        selectBoQs: $translate.instant('boq.main.renumberAllBoqs'),
                        eachBoQ: $translate.instant('boq.main.renumberEachBoq'),
                        currentPrj: $translate.instant('boq.main.renumberCurrentPrj'),
                        renumberDependance: $translate.instant('boq.main.renumberDependance')
                    };

                    const boqMainStandardTypes = $injector.get('boqMainStandardTypes');
                    var prcBoqMainService = $injector.get('prcBoqMainService');
                    prcBoqMainService = prcBoqMainService.getService(procurementPackagePackage2HeaderService);
                    platformModalService.showDialog(modalOptions).then(function (result) {
                        if (result.ok) {
                            if (result.isRenumberCurrent && prcBoqMainService.getStructure().BoqStandardFk !== boqMainStandardTypes.free) {
                                platformModalService.showMsgBox($translate.instant('boq.main.freeBoqWarningMessage'), $translate.instant('boq.main.freeBoqRenumber'), 'warning');
                            }
                            prcBoqMainService.renumberFreeBoq(result.isRenumberCurrent, result.isWithinBoq);
                        }
                    });
                });
            };

            service.renumberItem = function () {
                headerDataService.updateAndExecute(function () {
                    procurementCommonRenumberItemService.execute(headerDataService);
                });
            };

            service.sendPackagetoYtwo = function sendPackagetoYtwo() {
                headerDataService.updateAndExecute(procurementPackageWizardSendtoYtwoService.execute);
            };

            service.updateBoq = function updateBoq() {
                var selectedHeader = headerDataService.getSelected();
                if (selectedHeader) {
                    headerDataService.updateAndExecute(function () {
                        var headerData = {
                            Module: 'procurement.package',
                            HeaderId: selectedHeader.Id,
                            ExchangeRate: selectedHeader.ExchangeRate
                        };
                        var projectId = selectedHeader.ProjectFk;
                        boqMainWizardService.updateBoq(prcBoqMainService.getService(procurementPackagePackage2HeaderService), projectId, headerDataService, headerData);
                    });
                }
            };

            service.eraseEmptyDivisions = function eraseEmptyDivisions() {
                var selectedHeader = headerDataService.getSelected();
                if (selectedHeader) {
                    headerDataService.updateAndExecute(function () {
                        boqMainWizardService.eraseEmptyDivisions(prcBoqMainService.getService(procurementPackagePackage2HeaderService), headerDataService);
                    });
                }
            };
            service.formatBoQSpecification = function formatBoQSpecification() {
                var selectedHeader = headerDataService.getSelected();
                if (selectedHeader) {
                    headerDataService.updateAndExecute(function () {
                        boqMainWizardService.formatBoQSpecification(prcBoqMainService.getService(procurementPackagePackage2HeaderService), headerDataService);
                    });
                }
            };

            service.updateVersionBoq = function updateVersionBoq() {
                let msgBoxTitle = $translate.instant('procurement.common.wizard.updateVersionBoQ.warningTitle');
                let selectedHeader = headerDataService.getSelected();
                if (selectedHeader) {
                    let prcBoqMainService = $injector.get('prcBoqMainService');
                    let myPrcBoqMainService = prcBoqMainService.getService(procurementPackagePackage2HeaderService);
                    let prcBoqService = procurementCommonPrcBoqService.getService(procurementPackagePackage2HeaderService, myPrcBoqMainService);
                    let boqList = prcBoqService.getList();
                    if (boqList.length === 0) {
                        platformModalService.showMsgBox($translate.instant('procurement.common.wizard.updateVersionBoQ.nonBoQMsg'), msgBoxTitle, 'warning');

                    } else {
                        let modalOptions = {
                            templateUrl: globals.appBaseUrl + 'procurement.common/templates/update-version-boq-dialog.html',
                            controller: 'prcCommonUpdateVersionBoqWizardController',
                            resizeable: true,
                            width: '1080px',
                            heigth: '810px'
                        };
                        platformModalService.showDialog(modalOptions);
                    }
                } else {
                    platformModalService.showMsgBox($translate.instant('procurement.common.wizard.updateVersionBoQ.nonPackageWarningMsg'), msgBoxTitle, 'warning');

                }
            };

            service.generatePaymentSchedule = function generatePaymentSchedule() {
                let entities = headerDataService.getSelectedEntities();
                let bodyText;
                let modalOptions;
                let entityIds;
                if (entities.length && entities.length > 1) {
                    if (!basicsLookupdataLookupDescriptorService.getData('PrcTotalKind')) {
                        basicsLookupdataLookupDescriptorService.loadData('PrcTotalKind');
                    }
                    let haveNoDateEntities = _.filter(entities, function (p) {
                        return !p.PlannedStart || !p.PlannedEnd;
                    });
                    if (haveNoDateEntities && haveNoDateEntities.length) {
                        let codes = _.map(haveNoDateEntities, function (pa) {
                            return pa.Code;
                        });
                        let codesStr = codes.join(',');
                        bodyText = $translate.instant('procurement.common.wizard.generatePaymentSchedule.packageHaveNoPlannedDate', {'code': codesStr});
                        modalOptions = {
                            headerText: $translate.instant('procurement.common.wizard.generatePaymentSchedule.wizard'),
                            bodyText: bodyText,
                            iconClass: 'ico-info'
                        };
                        return platformModalService.showDialog(modalOptions);
                    } else {
                        entityIds = _.map(entities, function (p) {
                            return p.Id;
                        });
                        procurementPackageTotalDataService.resetSameTotalsFromPackagesCach();
                        procurementPackageTotalDataService.getSameTotalsFromPackages(entityIds);
                    }
                }
                if (entities.length && entities.length === 1) {
                    entityIds = [entities[0].Id];
                }

                $http.post(globals.webApiBaseUrl + 'procurement/package/prcpackage2header/getitembyheaderids', entityIds).then(function () {
                    let prcHeaderFks = [];
                    let selectedSubPackage = procurementPackagePackage2HeaderService.getSelected();
                    if (selectedSubPackage) {
                        prcHeaderFks.push(selectedSubPackage.PrcHeaderFk);
                    }
                    $http.post(globals.webApiBaseUrl + 'procurement/common/prcpaymentschedule/getisdoneitems', prcHeaderFks).then(function (res) {
                        var data = res.data;
                        if (data && data.length) {
                            bodyText = $translate.instant('procurement.common.wizard.generatePaymentSchedule.ThereIsRecordIsDone');
                            modalOptions = {
                                headerText: $translate.instant('procurement.common.wizard.generatePaymentSchedule.wizard'),
                                bodyText: bodyText,
                                iconClass: 'ico-info'
                            };
                            return platformModalService.showDialog(modalOptions);
                        } else {
                            procurementCommonGeneratePaymentScheduleService.showGeneratePaymentScheduleWizardDialog(procurementPackageTotalDataService, headerDataService);
                        }
                    });
                });
            };

            service.maintainPaymentScheduleVersion = function () {
                var selectedSubPackage = procurementPackagePackage2HeaderService.getSelected();
                var options = selectedSubPackage ? {PrcHeaderFk: selectedSubPackage.PrcHeaderFk} : {};
                prcCommonMaintainPaymentScheduleVersionService.maintainPaymentScheduleVersion(headerDataService, moduleName, options);
            };

            // change status of boq (in procurement package module)
            function changeBoqHeaderStatus() {
                var prcBoqMainService = $injector.get('prcBoqMainService');
                var myPrcBoqMainService = prcBoqMainService.getService(procurementPackagePackage2HeaderService);
                var prcBoqService = procurementCommonPrcBoqService.getService(procurementPackagePackage2HeaderService, myPrcBoqMainService);
                return basicsCommonChangeStatusService.provideStatusChangeInstance({
                    statusName: 'boq',
                    mainService: headerDataService, // prcBoqService returns a composite object, entity is { BoqHeader: {...} }
                    getDataService: function () {
                        return {
                            getSelected: function () {
                                return _.get(prcBoqService.getSelected(), 'BoqHeader');
                            }, gridRefresh: function () {
                                prcBoqService.gridRefresh();
                            },
	                        getSelectedEntities: function () {
		                        const list = prcBoqService.getSelectedEntities();
		                        return list.map(e => e.BoqHeader);
	                        }
                        };
                    },
                    statusField: 'BoqStatusFk',
                    statusDisplayField: 'DescriptionInfo.Translated',
                    title: 'boq.main.wizardChangeBoqStatus',
                    updateUrl: 'boq/main/changeheaderstatus'
                });
            }

            service.changeBoqHeaderStatus = changeBoqHeaderStatus().fn;

	        service.createRequisition = function createRequisition(wizardParams) {
		        let resultDefer = $q.defer();
		        wizardParams.resultPromise = resultDefer;
		        basicsWorkflowWizardContextService.getContext().resultPromise = resultDefer;
		        const fn = function () {
			        var boqMainService = prcBoqMainService.getService(procurementPackagePackage2HeaderService);
			        var updateBoqPromiss = procurementCommonPrcBoqService.getService(procurementPackagePackage2HeaderService, boqMainService).update();
			        updateBoqPromiss.then(function () {
				        wizardCreateRequisitionService.execute(wizardParams);
			        }, function () {
				        wizardCreateRequisitionService.execute(wizardParams);
			        });
		        };
		        headerDataService.updateAndExecute(fn);
		        return resultDefer.promise;
	        };

            service.resetServiceCatalogNo = function resetServiceCatalogNo() {
                headerDataService.updateAndExecute(function () {
                    var prcBoqMainService = $injector.get('prcBoqMainService');
                    prcBoqMainService = prcBoqMainService.getService(procurementPackagePackage2HeaderService);
                    var boqMainResetServiceCatalogNoService = $injector.get('boqMainResetServiceCatalogNoService');
                    boqMainResetServiceCatalogNoService.resetServiceCatalogNoOfBoqItems(prcBoqMainService);
                });
            };

            service.createContract = function createContract(wizardParams) {
                let resultDefer = $q.defer();
                wizardParams.resultPromise = resultDefer;
                basicsWorkflowWizardContextService.getContext().resultPromise = resultDefer;
                var fn = function (){
                     wizardCreateContractService.execute(wizardParams);
                };
                headerDataService.updateAndExecute(fn);
                return resultDefer.promise;
            };

            service.evaluateEvents = function evaluateEvents() {
                headerDataService.updateAndExecute(evalutionEventsService.execute);
            };

            service.updateScheduling = function updateScheduling() {
                headerDataService.updateAndExecute(updateSchedulingService.execute);
            };

            service.updateDate = function updateDate() {
                headerDataService.updateAndExecute(procurementPackageWizardUpdateDateService.execute);
            };

            /* service.changeStructure = function changeStructure() {
             headerDataService.updateAndExecute(procurementPackageWizardChangeStructureService.execute);
             }; */

            service.createPackage = function createPackage() {
                headerDataService.updateAndExecute(createPackageFromTemplate.execute);
            };

            service.updateEstimate = function updateEstimate(params) {
                var selectedPackage = params.isTriggeredByWorkflow ? basicsWorkflowWizardContextService.getContext().entity : headerDataService.getSelected();
                if (!selectedPackage || selectedPackage.Id <= 0) {
                    platformModalService.showMsgBox($translate.instant('procurement.package.selectedPackage'), $translate.instant('procurement.package.updateEstimate'));
                    return;
                }

                $injector.get('prcCommonUpdateEstimatePrcStructureDataSerivce').setProcurementMainData(selectedPackage.Id, null, 'package');

                var defer = $q.defer();

                if (params.isTriggeredByWorkflow) {
                    $http.get(globals.webApiBaseUrl + 'procurement/package/prcpackage2header/gebypackagefk?packageFk=' + selectedPackage.Id).then(function (response) {
                        defer.resolve(response.data.PrcHeaderFk);
                    });
                } else {
                    var selectedHeaderItem = $injector.get('procurementPackageItemDataService').parentDataService.getSelected();
                    defer.resolve(selectedHeaderItem.PrcHeaderEntity.Id);
                }

                return defer.promise.then(function (prcHeaderId) {

                    let requestData = {
                        headerId: prcHeaderId,
                        sourceType: 'package',
                        qtnHeaderIds: null
                    };

                    return $http.post(globals.webApiBaseUrl + 'procurement/common/option/getIsHasPrcItemAndPrcBoq', requestData).then(function (response) {
                        let prcCommonUpdateEstimateService = $injector.get('prcCommonUpdateEstimateService');
                        prcCommonUpdateEstimateService.setIsHasPrcItem(response.data.isHasPrcItem);
                        prcCommonUpdateEstimateService.setIsHasPrcBoq(response.data.isHasPrcBoq);

                        return platformModalService.showDialog({
                            headerTextKey: 'procurement.package.updateEstimate',
                            templateUrl: globals.appBaseUrl + 'procurement.common/templates/update-estimate-dialog.html',
                            controller: 'packageUpdateEstimateWizardController',
                            resizeable: true,
                            width: '720px',
                            heigth: '540px'
                        }).then(function (res) {
                            return res;
                        });
                    });
                });
            };

            service.createBusinessPartner = function createBusinessPartner() {
                procurementCommonCreateBusinessPartnerService.createBusinessPartner(procurementPackagePackage2HeaderService);
            };

            service.replaceNeutralMaterail = function () {
                procurementCommonReplaceNeutralMaterialService.showReplaceNeutralMaterialWizardDialog(headerDataService);
            };

            service.generateItems = function generateItems() {
                procurementPackageWizardGenerateItemsService.showGenerateItemWizardDialog(headerDataService);
                /*
                 headerDataService.updateAndExecute(procurementPackageWizardGenerateItemsService.execute);
                 */
            };

            service.updateItemPrice = function () {
                procurementCommonUpdateItemPriceService.showUpdateItemPriceWizardDialog(headerDataService);
            };

            service.generateItemDeliverySchedule = function () {
                procurementCommonGenerateDeliverySchedulePackageService.showGenerateDeliveryScheduleWizardDialog(procurementCommonPrcItemDataService, headerDataService);
            };

            service.changeProcurementConfiguration = function () {
                var parentValidationService = $injector.get('procurementPackageValidationService');
                ProcurementCommonChangeConfigurationService.execute(headerDataService, parentValidationService);
            };

            service.packageImport = function packageImport() {
                headerDataService.updateAndExecute(procurementPackageImportWizardService.execute);
            };

            service.packageItemMaterialAiAlternatives = function packageItemMaterialAlternatives() {
                var msgBoxTitle = $translate.instant('procurement.package.ai.aiAlternatives');
                var selectedSubPackage = procurementPackagePackage2HeaderService.getSelected();

                if (!angular.isObject(selectedSubPackage)) {
                    platformModalService.showMsgBox($translate.instant('procurement.package.ai.selectSubPackageWarningMsg'), msgBoxTitle, 'warning');
                    return;
                }

                if (procurementContextService.isReadOnly) {
                    platformModalService.showMsgBox($translate.instant('procurement.package.ai.readonlyWarningMsg'), msgBoxTitle, 'warning');
                    return;
                }

                basicsCommonAIService.checkPermission('77a641750f774c71a05f263977b287b1', true).then(function (canProceed) {
                    if (!canProceed) {
                        return;
                    }

                    var prcHeaderFk = selectedSubPackage.PrcHeaderFk;
                    var companyCurrencyId = procurementContextService.companyCurrencyId;

                    $http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/mtwoai/itemmaterialmapping?prcHeaderFk=' + prcHeaderFk + '&companyCurrencyId=' + companyCurrencyId).then(function (response) {
                        if (response.data && response.data.Main && angular.isArray(response.data.Main)) {
                            if (response.data.Main.length > 0) {
                                var params = {
                                    gridId: '8425d841574a458787927413986A109f', packageItemsData: null
                                };
                                params.packageItemsData = response.data;
                                var modalOptions = {
                                    templateUrl: globals.appBaseUrl + 'procurement.package/templates/package-item-material-alternatives.html',
                                    backdrop: false,
                                    windowClass: 'form-modal-dialog',
                                    lazyInit: true,
                                    resizeable: true,
                                    width: '60%',
                                    height: '80%',
                                    params: params
                                };
                                headerDataService.updateAndExecute(function () {
                                    platformModalService.showDialog(modalOptions);
                                });
                            } else {
                                platformModalService.showMsgBox($translate.instant('procurement.package.ai.noItems2UpdateWarning'), msgBoxTitle, 'warning');
                            }
                        } else {
                            platformModalService.showMsgBox($translate.instant('procurement.package.ai.autoMappingError'), msgBoxTitle, 'warning');
                        }
                    });
                });
            };

            service.packageItemMaterialAiAddition = function packageItemMaterialAiAddition() {
                var msgBoxTitle = $translate.instant('procurement.package.ai.aiAlternatives');

                if (procurementContextService.isReadOnly) {
                    platformModalService.showMsgBox($translate.instant('procurement.package.ai.readonlyWarningMsg'), msgBoxTitle, 'warning');
                    return;
                }

                var selectedSubPackage = procurementPackagePackage2HeaderService.getSelected();
                if (!angular.isObject(selectedSubPackage)) {
                    platformModalService.showMsgBox($translate.instant('procurement.package.ai.selectSubPackageWarningMsg'), msgBoxTitle, 'warning');
                    return;
                }

                basicsCommonAIService.checkPermission('af7aee3e27bd4242ad7d2f03ae9b1921', true).then(function (canProceed) {
                    if (!canProceed) {
                        return;
                    }

                    var params = {
                        gridId: '54578541574a458787927413986A109f', packageItemsData: null
                    };
                    var modalOptions = {
                        templateUrl: globals.appBaseUrl + 'procurement.package/templates/package-item-material-Addition.html',
                        backdrop: false,
                        windowClass: 'form-modal-dialog',
                        lazyInit: true,
                        resizeable: true,
                        width: '60%',
                        height: '70%',
                        params: params
                    };
                    platformModalService.showDialog(modalOptions);
                });
            };

            // todo:following logic to get total cost is complexity,if any other case like this,we must refactor it.
            service.updateCashFlowProjection = function updateCashFlowProjection() {

                var header = headerDataService.getSelected() || {};
                if (!header) {
                    console.log('please select an header item');
                    return;
                }

                var cashProjectionFk = header.CashProjectionFk || null;
                var structureFk = header.StructureFk;
                var scurveFk = getScurveFkByStructureFk(structureFk);// Scurve
                var scurveTotalTypeCode = null;
                var scurveItem = basicsLookupdataLookupDescriptorService.getItemByIdSync(scurveFk, {lookupType: 'Scurve'});
                if (scurveItem) {
                    scurveTotalTypeCode = scurveItem.TotalType;
                }
                var startDate = header.ActualStart || header.PlannedStart;
                var endDate = header.ActualEnd || header.PlannedEnd;
                if (!scurveTotalTypeCode) {
                    scurveTotalTypeCode = getTotalTypeCodeByConfiguration(header.ConfigurationFk);
                }
                var totalCost = getTotalCost(scurveTotalTypeCode);

                function getScurveFkByStructureFk(structureFk) {
                    if (!angular.isDefined(structureFk)) {
                        return null;
                    }
                    var structure = basicsLookupdataLookupDescriptorService.getItemByIdSync(structureFk, {lookupType: 'prcstructure'});
                    if (structure) {
                        return structure.ScurveFk;
                    }
                    return null;
                }

                function getTotalCost(scurveTotalTypeCode) {
                    if (!angular.isDefined(scurveTotalTypeCode) || !angular.isString(scurveTotalTypeCode)) {
                        return 0;
                    }
                    // get code by type === scurve.totaltype
                    var totalList = procurementPackageTotalDataService.getList();
                    var totalItem = _.filter(totalList, function (totalItem) {
                        var type = procurementPackageTotalDataService.getTotalType(totalItem);
                        return type && type.Code === scurveTotalTypeCode;
                    });
                    if (totalItem && totalItem[0]) {
                        return totalItem[0].ValueNetOc || 0;
                    }
                    return 0;
                }

                function getTotalTypeCodeByConfiguration(configurationFk) {
                    var totalTypeCode = null;
                    var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {Id: configurationFk});
                    if (config) {
                        var configHeaderFk = config.PrcConfigHeaderFk, netTotal = totalKinds.netTotal;
                        var totalType = _.find(basicsLookupdataLookupDescriptorService.getData('PrcTotalType'), {
                            PrcTotalKindFk: netTotal, PrcConfigHeaderFk: configHeaderFk
                        });
                        if (totalType) {
                            totalTypeCode = totalType.Code;
                        }
                    }
                    return totalTypeCode;
                }

                var modalOptions = {
                    defaultValue: {
                        CashProjectionFk: cashProjectionFk,
                        ScurveFk: scurveFk,
                        TotalCost: totalCost,
                        StartWork: startDate,
                        EndWork: endDate
                    }, totalsLookupDirective: 'package-total-drop-down'
                };

                basicsCommonUpdateCashFlowProjectionService.showDialog(modalOptions).then(function (result) {
                    if (result && result.CashProjectionFk) {
                        header.CashProjectionFk = result.CashProjectionFk;
                        headerDataService.markItemAsModified(header);
                        headerDataService.update().then(function () {
                            headerDataService.refresh().then(function () {
                                headerDataService.setSelected({}).then(function () {
                                    var newEntity = headerDataService.getItemById(header.Id);
                                    headerDataService.setSelected(newEntity);
                                });
                            });
                        });
                    }
                }, function (error) {
                    console.log(error);
                });
            };

            var wizards = {
                showImages: true, showTitles: true, showSelected: true, items: [{
                    id: 1,
                    text: 'Change Status Wizard',
                    text$tr$: 'procurement.common.wizard.change.status.wizard',
                    groupIconClass: 'sidebar-icons ico-wiz-change-status',
                    visible: true,
                    subitems: [changePackageStatus(), changeStatusForItem(), changeStatusForProjectDocument(), disableRecord(), enableRecord()]
                }, {
                    id: 2,
                    text: 'BoQ Wizard',
                    text$tr$: 'procurement.common.wizard.boq.wizard',
                    groupIconClass: 'sidebar-icons ico-wiz-gaeb-ex',
                    subitems: [{
                        id: 21,
                        text: 'GAEB-Import',
                        text$tr$: 'procurement.common.wizard.gaeb.import',
                        type: 'item',
                        showItem: true,
                        fn: service.gaebImport
                    }, {
                        id: 22,
                        text: 'GAEB-Export',
                        text$tr$: 'procurement.common.wizard.gaeb.export',
                        type: 'item',
                        showItem: true,
                        cssClass: 'md rw',
                        fn: service.gaebExport
                    }, {
                        id: 23,
                        text: 'Renumber BoQ',
                        text$tr$: 'procurement.common.wizard.renumber.boq',
                        type: 'item',
                        showItem: true,
                        cssClass: 'md rw',
                        fn: service.renumberBoq
                    }, {
                        id: 24,
                        text: 'Generate BoQ',
                        text$tr$: 'procurement.package.wizard.generateBoq.caption',
                        type: 'item',
                        showItem: true,
                        cssClass: 'md rw',
                        fn: service.generateBoQ
                    }, {
                        id: 25,
                        text: 'Change BoQ Header Status',
                        text$tr$: 'procurement.common.wizard.change.status.boqheader',
                        type: 'item',
                        showItem: true,
                        cssClass: 'md rw',
                        fn: service.changeBoqHeaderStatus
                    }]
                }, {
                    id: 3,
                    text: 'Create Wizard',
                    text$tr$: 'procurement.common.wizard.group.create',
                    groupIconClass: 'sidebar-icons ico-wiz-change-status',
                    isOpen: true,
                    subitems: [{
                        id: 31,
                        text: 'Generate Items',
                        text$tr$: 'procurement.package.wizard.generateItems.caption',
                        type: 'item',
                        showItem: true,
                        cssClass: 'md rw',
                        fn: service.generateItems
                    }, {
                        id: 32,
                        text: 'Create Requisition',
                        text$tr$: 'procurement.package.wizard.createRequisition.caption',
                        type: 'item',
                        showItem: true,
                        cssClass: 'md rw',
                        fn: service.createRequisition
                    }, {
                        id: 33,
                        text: 'Create Contract',
                        text$tr$: '',
                        type: 'item',
                        showItem: true,
                        cssClass: 'md rw',
                        fn: service.createContract
                    }, {
                        id: 34,
                        text: 'Create Business Partner',
                        type: 'item',
                        showItem: true,
                        cssClass: 'md rw',
                        fn: service.createBusinessPartner
                    }]
                }, {
                    id: 4,
                    text: 'Event Wizards',
                    text$tr$: 'procurement.common.wizard.updateWizardHeaderText',
                    groupIconClass: 'sidebar-icons ico-wiz-change-status',
                    isOpen: true,
                    subitems: [{
                        id: 41,
                        text: 'Evaluate Events',
                        text$tr$: 'procurement.package.wizard.evaluationEvents.caption',
                        type: 'item',
                        showItem: true,
                        cssClass: 'md rw',
                        fn: service.evaluateEvents
                    }, {
                        id: 42,
                        text: 'Update Procurement Schedule',
                        text$tr$: 'procurement.package.wizard.updateScheduling.caption',
                        type: 'item',
                        showItem: true,
                        cssClass: 'md rw',
                        fn: service.updateScheduling
                    }, {
                        id: 43,
                        text: 'Update Dates From Activities',
                        text$tr$: 'procurement.package.wizard.updateDate.caption',
                        type: 'item',
                        showItem: true,
                        cssClass: 'md rw',
                        fn: service.updateDate
                    }]
                }, /*
						 {
						 id: 5,
						 text: 'Change Structure Wizards',
						 text$tr$: 'procurement.package.wizard.structureWizardHeaderText',
						 groupIconClass: 'sidebar-icons ico-wiz-change-status',
						 isOpen: true,
						 subitems: [
						 {
						 id: 51,
						 text: 'Change Structure Code',
						 text$tr$: 'procurement.package.wizard.changeStructure.caption',
						 type: 'item',
						 showItem: true,
						 cssClass: 'md rw',
						 fn: service.changeStructure
						 }
						 ]
						 }, */
                    {
                        id: 6,
                        text: 'Create Package From Template Wizards',
                        text$tr$: 'procurement.package.wizard.createPackageWizardHeaderText',
                        groupIconClass: 'sidebar-icons ico-wiz-change-status',
                        isOpen: true,
                        subitems: [{
                            id: 61,
                            text: 'Create Package From Template',
                            text$tr$: 'procurement.package.wizard.createPackageFromTemplate.caption',
                            type: 'item',
                            showItem: true,
                            cssClass: 'md rw',
                            fn: service.createPackage
                        }]
                    }]
            };

            service.prcItemExcelImport = function prcItemExcelImport() {
                var headerEntity = headerDataService.getSelected();
                if (!headerEntity || angular.isUndefined(headerEntity.Id)) {
                    platformModalService.showMsgBox($translate.instant('procurement.package.selectedPackage'), 'Info', 'ico-info');
                    return;
                }
                headerDataService.updateAndExecute(function () {
                    var prcItemImportOptionsService = $injector.get('prcCommonItemImportOptionsService');
                    var options = prcItemImportOptionsService.getImportOptions(moduleName);
                    var selectedSubPackage = procurementPackagePackage2HeaderService.getSelected();
                    var prcHeaderFk = selectedSubPackage ? selectedSubPackage.PrcHeaderFk : null;
                    options.ImportDescriptor.CustomSettings = {
                        PrcHeaderFk: prcHeaderFk,
                        IsImportPriceAfterTax: options.isOverGross ? options.isOverGross : false,
                        BpdVatGroupFk: headerEntity.BpdVatGroupFk,
                        HeaderTaxCodeFk: headerEntity.TaxCodeFk
                    };
                    options.ImportDescriptor.SubMainId = selectedSubPackage.Id;
                    basicsImportService.showImportDialog(options);
                });
            };

            service.prcItemExcelExport = function prcItemExcelExport(wizardParameter) {
                headerDataService.updateAndExecute(function () {
                    var headerItem = procurementPackagePackage2HeaderService.getSelected();
                    if (!headerItem) {
                        return;
                    }

                    var options = prcCommonItemExportOptionsService.getExportOptions(procurementPackagePackage2HeaderService);
                    options.MainContainer.Id = '1';
                    options.wizardParameter = wizardParameter;
                    basicsExportService.showExportDialog(options);
                });
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
            if (!platformTranslateService.registerModule('procurement.package')) {
                // if translation is already available, call loadTranslation directly
                loadTranslations();
            }

            service.exportMaterial = function () {
                headerDataService.updateAndExecute(function () {
                    var headerItem = procurementPackagePackage2HeaderService.getSelected();
                    if (!headerItem) {
                        return;
                    }
                    $http.get(globals.webApiBaseUrl + 'procurement/common/wizard/exportmaterial?objectFk=' + headerItem.PackageFk + '&ProjectFk=' + headerItem.ProjectFk + '&CurrencyFk=' + headerItem.CurrencyFk + '&moduleName=' + moduleName + '&subObjectFk=' + headerItem.Id).then(function (response) {
                        if (response.data && response.data.FileName) {
                            basicsCommonFileDownloadService.download(null, {
                                FileName: response.data.FileName, Path: response.data.path
                            });
                        }
                    });
                });
            };

            service.importMaterial = function () {
                headerDataService.updateAndExecute(function () {
                    procurementCommonImportMaterialService.execute(headerDataService, procurementPackagePackage2HeaderService, moduleName);
                });
            };

            service.splitOverallDiscount = function splitOverallDiscount() {
                var splitOverallDiscountUrl = globals.webApiBaseUrl + 'procurement/package/package/splitoveralldiscount';
                prcCommonSplitOverallDiscountService.splitOverallDiscount(headerDataService, splitOverallDiscountUrl);
            };

            service.copyUnitRateToBudgetUnit = function copyUnitRateToBudgetUnit() {
                headerDataService.updateAndExecute(function () {
                    boqMainWizardService.copyUnitRateToBudgetUnit($injector.get('prcBoqMainService').getService(headerDataService));
                });
            };

            service.editBudget = function editBudget() {
                headerDataService.updateAndExecute(function () {
                    procurementPackageEditBudgetWizardService.execute();
                });
            };

	        service.enhanceBidderSearch = function enhanceBidderSearch() {
		        headerDataService.updateAndExecute(function () {
			        procurementCommonCreateSuggestedBidderService.execute(procurementPackagePackage2HeaderService);
		        });
	        };

            service.createRfq = function () {
                let selectedPackage = headerDataService.getSelected();
                let modalOptions = {
                    headerTextKey: 'cloud.common.informationDialogHeader',
                    bodyTextKey: 'procurement.package.wizard.createRequisition.noPackageHeader',
                    showCancelButton: true,
                    iconClass: 'ico-info'
                };
                if (!selectedPackage) {
                    return platformModalService.showDialog(modalOptions);
                }
                return headerDataService.updateAndExecute(function () {
                    let boqMainService = prcBoqMainService.getService(procurementPackagePackage2HeaderService);
                    let updateBoqPromise = procurementCommonPrcBoqService.getService(procurementPackagePackage2HeaderService, boqMainService).update();
                    return updateBoqPromise.then(function () {
                        let selectedSubPackage = procurementPackagePackage2HeaderService.getSelected();
                        let getSuggestedBiddersPromise = $http.get(globals.webApiBaseUrl + 'procurement/common/wizard/getbidder?prcHeaderFk=' + selectedSubPackage.PrcHeaderFk).then(function (response) {
                            return response.data;
                        });

                        return getSuggestedBiddersPromise.then(function (suggestedBidders) {
                            let showCreateSucceedDialog = function (rfq) {
                                // return platformModalService.showYesNoDialog($translate.instant('procurement.package.wizard.createRfqSuccessAndGotoModule', {p_0: rfq.Code}), 'procurement.package.wizard.createRfqSuccess', 'yes').then(function (result) {
                                // if (result.yes) {
                                // navigateService.navigate({
                                // moduleName: 'procurement.rfq'
                                // }, rfq, 'Id');
                                // }
                                // });
                                platformDialogService.showDialog({
                                    templateUrl: globals.appBaseUrl + 'procurement.package/partials/create-rfq-wizard-dialog.html',
                                    width: '600px',
                                    resizeable: true,
                                    newId: rfq.Id,
                                    newCode: rfq.Code
                                });
                            };

                            if (!_.isEmpty(suggestedBidders)) {
                                return $http.post(globals.webApiBaseUrl + 'procurement/rfq/header/createfrompackage', {
                                    PackageId: selectedPackage.Id, AutoCopyBidder: true, RfqBpWithContact: []
                                }).then(function (response) {
                                    return showCreateSucceedDialog(response.data);
                                });
                            } else {
                                selectedPackage.bpPrcHeaderEntity = selectedSubPackage.PrcHeaderEntity;
                                return platformModalService.showDialog({
                                    templateUrl: globals.appBaseUrl + 'businesspartner.main/templates/filter-business-partner-dialog.html',
                                    backdrop: false,
                                    resizeable: true,
                                    width: 'max',
                                    height: 'max',
                                    minHeight: '585px',
                                    wizardForCreateRfQFromPackage: true,
                                    mainData: selectedPackage,
	                                 bidderData: suggestedBidders,
                                    onReturnButtonPress: function () {
                                    }
                                }).then(function (result) {
                                    if (result.isOk && result.rfq) {
                                        return showCreateSucceedDialog(result.rfq);
                                    }
                                });
                            }
                        });

                    });
                });
            };

            service.boqScopeReplacement = boqScopeReplacement;

				service.materialItem = ()=>{
					procurementCommonDisableEnabledService.execute();
				}

            return service;

	        function recursionBoqItems(parentBoqNode, boqItems, boqsInAssignment) {
				  const boqItemsToRemove = [];
		        _.forEach(boqItems, function (item) {
			        if (item.BoqItems && item.BoqItems.length > 0) {
				        recursionBoqItems(item, item.BoqItems, boqsInAssignment);
						  if (!item.BoqItems || item.BoqItems.length === 0) {
							  boqItemsToRemove.push(item);
						  }
			        } else {
				        parentBoqNode.BoqItems = _.filter(parentBoqNode.BoqItems, function (bItem) {
					        const key = `${bItem.Id}_${bItem.BoqHeaderFk}`;
					        return boqsInAssignment[key];
				        });
			        }
		        });

				  if (boqItemsToRemove.length > 0) {
					  _.remove(boqItems, (boqItem) => {
						  return boqItemsToRemove.some(item => item.BoqHeaderFk === boqItem.BoqHeaderFk && item.Id === boqItem.Id);
					  });
				  }
	        }

	        // //////////////////
	        function boqScopeReplacement() {
		        let packageItem = headerDataService.getSelected();
		        let boqNodeService = prcBoqMainService.getService(procurementContextService.getMainService());
		        if (!packageItem) {
			        return;
		        }

		        let selectedBoqItem = boqNodeService.getSelected();
		        if (!selectedBoqItem) {
			        platformModalService.showMsgBox('procurement.package.boqScopeReplacement.noSelectBoqItem', 'procurement.package.boqScopeReplacement.title', 'ico-warning');
			        return;
		        }

		        $http.get(globals.webApiBaseUrl + 'procurement/package/wizard/hasvalidboqstobereplaced?packageId=' + packageItem.Id + '&boqHeaderId=' + selectedBoqItem.BoqHeaderFk)
			        .then(function (response) {
				        if (!response || !response.data) {
					        platformModalService.showMsgBox('procurement.package.boqScopeReplacement.notValidToBeReplaced', 'procurement.package.boqScopeReplacement.title', 'ico-warning');
					        return;
				        }

				        const boqsInAssignments = response.data;
				        let rootPrcBoq = boqNodeService.getRootBoqItem();
				        let rootBoq = angular.copy(rootPrcBoq);
				        if (rootBoq && rootBoq.BoqItems !== null) {
					        recursionBoqItems(rootBoq, rootBoq.BoqItems, boqsInAssignments);
				        }

				        let modalOptions = {
					        templateUrl: globals.appBaseUrl + 'procurement.package/partials/boq-scope-replacement-dialog.html',
					        width: '1000px',
					        height: '800px',
					        resizeable: true,
					        data: {
						        packageItem: packageItem, targetBoqItem: selectedBoqItem, targetBoqTree: rootBoq
					        }
				        };

				        platformModalService.showDialog(modalOptions);
			        });
	        }
        }]);

    angular.module(moduleName).factory('procurementPackageBidderSearchWizardService', ['$q', '$window', '$http', 'basicsCommonBusinesspartnerPortalDialogService', 'procurementPackagePackage2HeaderService', 'platformContextService', 'procurementRfqGetBidderColumnsDef', 'procurementCommonSuggestedBiddersDataService', 'basicsLookupdataLookupDescriptorService', 'procurementCommonHelperService', function ($q, $window, $http, businesspartnerPortalDialogService, subPackageDataService, platformContextService, columnsDef, procurementCommonSuggestedBiddersDataService, lookupDescriptorService, procurementCommonHelperService) {

        var service = {};
        service.showBizPartnerPortalDialog = function showBizPartnerPortalDialog() {
            var mainItem = getSubPackageItem();
            if (!mainItem.selected) {
                return;
            }

            businesspartnerPortalDialogService.showDialog({
                columns: columnsDef, gridData: [], inquiryDataFn: inquiryData, requestDataFn: requestData
            }).then(function (result) {
                if (result.ok) {
                    createData();
                }
            });
        };

        function getSubPackageItem() {
            var obj = {selected: false, value: -1};
            var mainItem = subPackageDataService.getSelected();
            if (mainItem && Object.getOwnPropertyNames(mainItem).length > 0) {
                obj.selected = true;
                obj.value = mainItem.Id;
                obj.prcheaderfk = mainItem.PrcHeaderFk;
            }
            return obj;
        }

        function inquiryData(requestId) {
            let params = {
                module: 'businesspartner.main',
                requestId: requestId,
                extparams: JSON.stringify({ is4Procurement: true })
            }
            procurementCommonHelperService.openInquiryWindow(params);
        }

        function requestData(requestId) {
	        return $http.post(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/requestportalbizpartner', {Value: requestId});
        }

        function createData() {
            var data = [];
            var mainItemId = getSubPackageItem().prcheaderfk;

            // exclude the duplicated items
	        _.forEach(businesspartnerPortalDialogService.dataService.getList(), function (newItem) {
		        var item = _.find(procurementCommonSuggestedBiddersDataService.getService().getList(), function (existedItem) {
			        return newItem.Id === existedItem.BusinessPartnerFk;
		        });
		        if (!item) { // if not existed, add it.
			        data.push({
				        Id: mainItemId,
				        BpId: newItem.Id,
				        SubsidiaryId: newItem.SubsidiaryFk,
				        SupplierId: newItem.SupplierId,
				        ContactId: newItem.ContactId
			        });
		        }
	        });

            if (data.length > 0) {
                $http.post(globals.webApiBaseUrl + 'procurement/package/wizard/saveportalbizpartner', data).then(function (response) {
                    lookupDescriptorService.attachData(response.data || {});
                    procurementCommonSuggestedBiddersDataService.getService().doProcessData(response.data.Main); // set readonly and others.
                    procurementCommonSuggestedBiddersDataService.getService().setList(response.data.Main);
                });
            }
        }

        return service;
    }]);
})(angular);