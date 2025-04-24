/**
 * Created by lja on 2015/12/22.
 */

(function (angular) {
	'use strict';

	var moduleName = 'documents.main';
	var invoiceModule = 'procurement.invoice';
	var salesModule = 'sales.billing';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('documentsMainController',
		['$scope', 'cloudDesktopInfoService', 'platformTranslateService',
			'platformNavBarService', '$translate', 'cloudDesktopSidebarService',
			'documentsProjectDocumentDataService', 'procurementInvoiceHeaderDataService', 'salesBillingService', 'initApp',
			function ($scope, cloudDesktopInfoService, platformTranslateService,
				platformNavBarService, $translate, cloudDesktopSidebarService,
				documentsProjectDocumentDataService, leadingService, salesBillingService, initAppService) {

				platformTranslateService.registerModule(['cloud.common', 'procurement.common']);

				var invoiceId;
				var billingId;
				var appStartupInfo = initAppService.getStartupInfo();
				if (appStartupInfo && appStartupInfo.navInfo) {
					/** @namespace appStartupInfo.navInfo.invoiceid */
					invoiceId = appStartupInfo.navInfo.invoiceid;
					/** @namespace appStartupInfo.navInfo.billingid */
					billingId = appStartupInfo.navInfo.billingid;
				}

				var loadTranslations = function () {
					if (invoiceId) {
						cloudDesktopInfoService.updateModuleInfo($translate.instant('documents.main.invoiceModuleName'));
					} else if (billingId) {
						cloudDesktopInfoService.updateModuleInfo($translate.instant('documents.main.billModuleName'));
					} else {
						cloudDesktopInfoService.updateModuleInfo($translate.instant('documents.main.moduleName'));
					}
				};

				platformTranslateService.translationChanged.register(loadTranslations);

				// Remove the unnecessary default buttons
				platformNavBarService.removeActions(['prev', 'next', 'save', 'refresh', 'first', 'last', 'discard']);

				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule(moduleName)) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}

				cloudDesktopSidebarService.unRegisterSidebarContainer(cloudDesktopSidebarService.getSidebarIds().search, true);
				cloudDesktopSidebarService.unRegisterSidebarContainer(cloudDesktopSidebarService.getSidebarIds().quickStart, true);
				cloudDesktopSidebarService.unRegisterSidebarContainer(cloudDesktopSidebarService.getSidebarIds().favorites, true);
				cloudDesktopSidebarService.unRegisterSidebarContainer(cloudDesktopSidebarService.getSidebarIds().lastobjects, true);
				cloudDesktopSidebarService.unRegisterSidebarContainer(cloudDesktopSidebarService.getSidebarIds().watchlist, true);
				cloudDesktopSidebarService.unRegisterSidebarContainer('workflow-tasks', true);
				cloudDesktopSidebarService.unRegisterSidebarContainer('workflow', true);

				if (invoiceId) {
					documentsProjectDocumentDataService.register({
						moduleName: invoiceModule,
						title: $translate.instant('documents.main.invoiceHeader'),
						parentService: leadingService,
						fromModuleName: moduleName,
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
							{documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false}
						]
					});
				} else if (billingId) {
					documentsProjectDocumentDataService.register({
						moduleName: salesModule,
						title: $translate.instant('documents.main.billingHeader'),
						parentService: salesBillingService,
						fromModuleName: moduleName,
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
							{documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false}
						]
					});
				}

				$scope.$on('$destroy', function () {
					platformTranslateService.translationChanged.unregister(loadTranslations);
					platformNavBarService.clearActions();
				});
			}]);
})(angular);