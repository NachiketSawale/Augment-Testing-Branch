/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingController
	 * @function
	 *
	 * @description
	 * Main controller for the sales.billing module
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesBillingController',
		['_', '$scope', '$rootScope', '$translate', 'cloudDesktopInfoService', 'platformMainControllerService', 'salesBillingService', 'salesBillingBoqStructureService', 'salesBillingTranslationService', 'salesBillingNumberGenerationSettingsService', 'salesCommonLoadLookupDataService', 'documentsProjectDocumentDataService', 'salesBillingPaymentService', 'estimateProjectRateBookConfigDataService', 'modelViewerStandardFilterService', 'boqMainLookupFilterService', 'procurementCommonTabConfigService',
			'businesspartnerCertificateCertificateContainerServiceFactory','documentsProjectDocumentFileUploadDataService',
			function (_, $scope, $rootScope, $translate, cloudDesktopInfoService, platformMainControllerService, salesBillingService, salesBillingBoqStructureService, translationService, salesBillingNumberGenerationSettingsService, salesCommonLoadLookupDataService, documentsProjectDocumentDataService, salesBillingPaymentService, estimateProjectRateBookConfigDataService, modelViewerStandardFilterService, boqMainLookupFilterService, procurementCommonTabConfigService,
				bpCertificateContainerServiceFactory, fileUploadDataService) {
				var certificateDataService = bpCertificateContainerServiceFactory.getDataService('sales.billing', salesBillingService);
				documentsProjectDocumentDataService.register({
					moduleName: moduleName,
					title: $translate.instant('sales.billing.containerTitleBills'),
					parentService: salesBillingService,
					columnConfig: [
						{documentField: 'BilHeaderFk', dataField: 'Id', readOnly: false},
						{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
						{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
						{documentField: 'PrcStructureFk', dataField: 'PrcStructureFk', readOnly: false},
						{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
						{documentField: 'ConHeaderFk', dataField: 'ConHeaderFk', readOnly: false},
						{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false},
						{documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
						{documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false}
					],
					subModules: [
						{
							service: certificateDataService,
							title: $translate.instant('cloud.common.actualCertificateListContainerTitle'),
							columnConfig: [
								{documentField: 'BpdCertificateFk', dataField: 'Id', readOnly: false},
								{documentField: 'ConHeaderFk', dataField: 'ConHeaderFk', readOnly: false},
								{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
								{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
								{documentField: 'OrdHeaderFk', dataField: 'OrdHeaderFk', readOnly: false}
							]
						}
					]

				});
				// Header info
				cloudDesktopInfoService.updateModuleInfo($translate.instant('cloud.desktop.moduleDisplayNameBilling'));

				var opt = {search: true, auditTrail: '3a5cbaf5d7a94c879b3b03f4796b5bef'};
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, salesBillingService, mc, translationService, moduleName, opt);

				modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('salesBillingModelFilterService');

				procurementCommonTabConfigService.registerTabConfig(moduleName, salesBillingService);

				salesBillingNumberGenerationSettingsService.assertLoaded();
				salesCommonLoadLookupDataService.loadLookupData(salesBillingService);
				boqMainLookupFilterService.setTargetBoqMainService(salesBillingBoqStructureService);

				// TODO: calculate the Amount and DiscountAmout
				salesBillingPaymentService.registerPaymentsAmountTotalUpdate(onPaymentsAmountTotalUpdate);

				function onPaymentsAmountTotalUpdate(e, payment) {
					getAdditionTotal(payment);
				}

				salesBillingPaymentService.registerPaymentsDiscountAmountTotalUpdate(onPaymentsDiscountAmountTotalUpdate);

				function onPaymentsDiscountAmountTotalUpdate(e, payment) {
					getAdditionTotal(undefined, payment);
				}

				salesBillingPaymentService.registerPaymentsDelete(onPaymentsDelete);

				function onPaymentsDelete(e, payments) {
					getAdditionTotal(undefined, undefined, payments);
				}

				function getAdditionTotal(modifiedAmount, modifiedDiscountAmount, deleteItems) {
					var sumAmountNet = 0.00;
					var sumDiscountAmountNet = 0.00;
					var billSelected = salesBillingService.getSelected();   // TODO: names of AmountTotal and DiscountAmountTotal needs to be changed (net)
					var payments = salesBillingPaymentService.getList();
					if (modifiedAmount) {
						_.forEach(payments, function (payment) {
							if (modifiedAmount.Id === payment.Id) {
								sumAmountNet += modifiedAmount.AmountNet;
							} else {
								sumAmountNet += payment.AmountNet;
							}
						});

						billSelected.AmountTotal = sumAmountNet;
					} else if (modifiedDiscountAmount) {
						_.forEach(payments, function (payment) {
							if (modifiedDiscountAmount.Id === payment.Id) {
								sumDiscountAmountNet += modifiedDiscountAmount.DiscountAmountNet;
							} else {
								sumDiscountAmountNet += payment.DiscountAmountNet;
							}
						});

						billSelected.DiscountAmountTotal = sumDiscountAmountNet;
					} else if (deleteItems) {
						_.forEach(payments, function (payment) {
							var index = _.findIndex(deleteItems, {Id: payment.Id});
							if (index === -1) {
								sumAmountNet += payment.AmountNet;
								sumDiscountAmountNet += payment.DiscountAmountNet;
							}
						});

						billSelected.AmountTotal = sumAmountNet;
						billSelected.DiscountAmountTotal = sumDiscountAmountNet;
					}

					salesBillingService.markItemAsModified(billSelected);
				}
				const unregisterReportPrepare = $rootScope.$on('reporting:postPreparePrint', function (dummy, reportValue) {
					reportValue.processed = true;
					fileUploadDataService.storeReportAsProjectDocument(reportValue);
				});
				// un-register on destroy
				$scope.$on('$destroy', function () {
					unregisterReportPrepare();
					procurementCommonTabConfigService.unregisterTabConfig();
					platformMainControllerService.unregisterCompletely(salesBillingService, sidebarReports, translationService, opt);
					salesBillingPaymentService.unregisterPaymentsAmountTotalUpdate(onPaymentsAmountTotalUpdate);
					salesBillingPaymentService.unregisterPaymentsDiscountAmountTotalUpdate(onPaymentsDiscountAmountTotalUpdate);
					salesBillingPaymentService.unregisterPaymentsDelete(onPaymentsDelete);
					estimateProjectRateBookConfigDataService.clearData();
					boqMainLookupFilterService.setTargetBoqMainService(null);
				});
			}]);

})();
