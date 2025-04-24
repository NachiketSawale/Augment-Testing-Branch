(function (angular) {
	'use strict';
	// jshint -W072
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	var moduleName = 'procurement.invoice';

	angular.module(moduleName).controller('procurementInvoiceController',
		['$scope', 'platformMainControllerService', 'procurementInvoiceTranslationService',
			'procurementInvoiceHeaderDataService', 'procurementInvoiceHeader2HeaderDataService',
			'procurementInvoiceCertificateDataService', 'procurementInvoicePESDataService',
			'invoiceBillingSchemaDataService', 'procurementInvoiceGeneralDataService', 'procurementCommonTabConfigService',
			'procurementInvoiceWizardsService', 'procurementContextService',
			'documentsProjectDocumentDataService', 'procurementInvoiceOtherDataService', 'procurementInvoiceRejectionDataService', 'cloudDesktopSidebarService',
			'basicsCharacteristicDataServiceFactory', '$translate', 'modelViewerStandardFilterService', 'procurementInvoiceNumberGenerationSettingsService',
			'platformNavBarService', 'documentsProjectDocumentModuleContext', 'procurementInvoicePaymentDataService', 'procurementInvoiceCertificateActualDataService',
			'documentsProjectDocumentFileUploadDataService','$rootScope',
			function ($scope, platformMainControllerService, translateService, leadingService,
				header2HeaderDataService, certificateDataService, pesDataService,
				invoiceBillingSchemaDataService, generalDataService, procurementCommonTabConfigService,
				procurementInvoiceWizardsService, moduleContext,
				documentsProjectDocumentDataService, invoiceOtherDataService, rejectionDataService, cloudDesktopSidebarService, basicsCharacteristicDataServiceFactory, $translate,
				modelViewerStandardFilterService, procurementInvoiceNumberGenerationSettingsService, platformNavBarService, documentsProjectDocumentModuleContext, procurementInvoicePaymentDataService,
				procurementInvoiceCertificateActualDataService,fileUploadDataService,$rootScope) {

				var opt = {search: true, reports: false, auditTrail: '9e2c62586d434fb1b22594f6e3acb2e4'};
				var result = platformMainControllerService.registerCompletely($scope, leadingService, {},
					translateService, moduleName, opt);
				basicsCharacteristicDataServiceFactory.getService(leadingService, leadingService.targetSectionId);

				modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('procurementInvoiceModelFilterService');

				procurementInvoiceNumberGenerationSettingsService.assertLoaded();

				// add export capability

				var exportOptions = {
					ModuleName: moduleName,
					permission: '588c3f33c4914b3684e114cd9107b1c2#e',
					MainContainer: {
						Id: 'prc.inv.header.grid',
						Label: 'procurement.invoice.title.header'
					},
					SubContainers: [
						{
							Id: 'procurement.invoice.characteristic',
							Qualifier: 'characteristic',
							Label: 'cloud.common.ContainerCharacteristicDefaultTitle',
							Selected: false
						},
						{
							Id: 'prc.inv.rejection.grid',
							Qualifier: 'rejection',
							Label: 'procurement.invoice.title.rejection',
							Selected: false
						},
						{
							Id: 'prc.inv.contract.grid',
							Qualifier: 'contractitems',
							Label: 'procurement.invoice.title.contract',
							Selected: false
						}
					]
				};

				platformMainControllerService.registerExport(exportOptions);  // add export feature to the main-controller

				moduleContext.setLeadingService(leadingService);
				moduleContext.setMainService(leadingService);

				// enable filters in contract header filter service
				leadingService.registerFilters(leadingService);
				generalDataService.init();

				procurementCommonTabConfigService.registerTabConfig(moduleName, leadingService);
				procurementInvoiceWizardsService.activate();

				leadingService.getRightbyInvStatus();

				var originDiscard = platformNavBarService.getActionByKey('discard').fn;
				platformNavBarService.getActionByKey('discard').fn = function () {
					originDiscard();
					var config = documentsProjectDocumentModuleContext.getConfig();
					var documentService = documentsProjectDocumentDataService.getService(config);
					documentService.clear();
				};

				var itemStatus = leadingService.getItemStatus();
				if (itemStatus) {
					moduleContext.setModuleStatus({IsReadonly: itemStatus.IsReadOnly});
				} else {
					moduleContext.setModuleStatus({IsReadonly: false});
				}

				var sidebarInfo = {
					name: cloudDesktopSidebarService.getSidebarIds().info,
					title: 'info',
					type: 'template',
					templateUrl: globals.appBaseUrl + 'procurement.invoice/templates/sidebar-info.html'
				};
				// noinspection JSCheckFunctionSignatures
				cloudDesktopSidebarService.registerSidebarContainer(sidebarInfo, true);

				documentsProjectDocumentDataService.register({
					moduleName: moduleName,
					title: $translate.instant('procurement.invoice.title.header'),
					parentService: leadingService,
					columnConfig: [
						{documentField: 'InvHeaderFk', dataField: 'Id', readOnly: false},
						{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
						{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
						{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
						{documentField: 'PrcStructureFk', dataField: 'PrcStructureFk', readOnly: false},
						{documentField: 'PrcPackageFk', dataField: 'PrcPackageFk', readOnly: false},
						{documentField: 'ConHeaderFk', dataField: 'ConHeaderFk', readOnly: false},
						{documentField: 'PesHeaderFk', dataField: 'PesHeaderFk', readOnly: false},
						{documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
						{documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false},
						{documentField: 'BpdSubsidiaryFk', dataField: 'SubsidiaryFk', readOnly: false},
						{documentField: 'BpdContactFk', dataField: 'ContactFk', readOnly: false}

					],
					subModules: [
						{
							service: procurementInvoiceCertificateActualDataService,
							title: $translate.instant('cloud.common.actualCertificateListContainerTitle'),
							columnConfig: [
								{documentField: 'BpdCertificateFk', dataField: 'Id', readOnly: false},
								{documentField: 'InvHeaderFk', dataField: 'InvHeaderFk', readOnly: false},
								{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
								{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
								{documentField: 'OrdHeaderFk', dataField: 'OrdHeaderFk', readOnly: false},
								{documentField: 'ConHeaderFk', dataField: 'ConHeaderFk', readOnly: false}
							],
							otherFilter: [{documentField: 'InvHeaderFk', dataField: 'InvHeaderFk'}]
						}
					]
				});

				// TODO: calculate the Amount and DiscountAmout
				procurementInvoicePaymentDataService.registerPaymentsAmountTotalUpdate(onPaymentsAmountTotalUpdate);

				function onPaymentsAmountTotalUpdate(e, payment) {
					getAdditionTotal(payment);
				}

				procurementInvoicePaymentDataService.registerPaymentsDiscountAmountTotalUpdate(onPaymentsDiscountAmountTotalUpdate);

				function onPaymentsDiscountAmountTotalUpdate(e, payment) {
					getAdditionTotal(undefined, payment);
				}

				procurementInvoicePaymentDataService.registerPaymentsDelete(onPaymentsDelete);

				function onPaymentsDelete(e, payments) {
					getAdditionTotal(undefined, undefined, payments);
				}

				function getAdditionTotal(modifiedAmount, modifiedDiscountAmount, deleteItems) {
					var sumAmounts = 0.00;
					var sumDiscountAmounts = 0.00;
					var selected = leadingService.getSelected();
					var payments = procurementInvoicePaymentDataService.getList();
					if (modifiedAmount) {
						_.forEach(payments, function (payment) {
							if (modifiedAmount.Id === payment.Id) {
								sumAmounts += modifiedAmount.Amount;
							} else {
								sumAmounts += payment.Amount;
							}
						});

						selected.FromPaymentTotalPayment = sumAmounts;
					} else if (modifiedDiscountAmount) {
						_.forEach(payments, function (payment) {
							if (modifiedDiscountAmount.Id === payment.Id) {
								sumDiscountAmounts += modifiedDiscountAmount.DiscountAmount;
							} else {
								sumDiscountAmounts += payment.DiscountAmount;
							}
						});

						selected.FromPaymentTotalPaymentDiscount = sumDiscountAmounts;
					} else if (deleteItems) {
						_.forEach(payments, function (payment) {
							var index = _.findIndex(deleteItems, {Id: payment.Id});
							if (index === -1) {
								sumAmounts += payment.Amount;
								sumDiscountAmounts += payment.DiscountAmount;
							}
						});

						selected.FromPaymentTotalPayment = sumAmounts;
						selected.FromPaymentTotalPaymentDiscount = sumDiscountAmounts;
					}

					leadingService.markItemAsModified(selected);
				}

				const unregisterReportPrepare = $rootScope.$on('reporting:postPreparePrint', function(dummy, reportValue) {
					reportValue.processed = true;
					fileUploadDataService.storeReportAsProjectDocument(reportValue);
				});

				$scope.$on('$destroy', function () {
					unregisterReportPrepare();
					leadingService.unRegisterFilters();
					// noinspection JSCheckFunctionSignatures
					cloudDesktopSidebarService.unRegisterSidebarContainer(sidebarInfo.name, true);
					platformMainControllerService.unregisterCompletely(leadingService, result, translateService, opt);
					procurementCommonTabConfigService.unregisterTabConfig();
					procurementInvoiceWizardsService.deactivate();
					moduleContext.removeModuleValue(moduleContext.leadingServiceKey);
					moduleContext.removeModuleValue(moduleContext.prcCommonMainService);
					procurementInvoicePaymentDataService.unregisterPaymentsAmountTotalUpdate(onPaymentsAmountTotalUpdate);
					procurementInvoicePaymentDataService.unregisterPaymentsDiscountAmountTotalUpdate(onPaymentsDiscountAmountTotalUpdate);
					procurementInvoicePaymentDataService.unregisterPaymentsDelete(onPaymentsDelete);
				});

			}]);
})(angular);
