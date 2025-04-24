/**
 * Created by chi on 8/2/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';
	/* jshint -W072 */
	angular.module(moduleName).factory('procurementCommonCreateBusinessPartnerService', procurementCommonCreateBusinessPartnerService);

	procurementCommonCreateBusinessPartnerService.$inject = ['_', 'globals', '$http', '$state', '$translate', '$injector', 'platformModalService',
		'cloudDesktopSidebarService', 'procurementCommonSuggestedBiddersDataService', 'platformModuleStateService', 'procurementContextService'];

	function procurementCommonCreateBusinessPartnerService(_, globals, $http, $state, $translate, $injector, platformModalService,
		cloudDesktopSidebarService, procurementCommonSuggestedBiddersDataService, platformModuleStateService, moduleContext) {
		var service = {};

		service.createBusinessPartner = createBusinessPartner;
		var bpIds = [];
		service.goTo = goTo;
		service.ok = ok;
		return service;

		function ok() {
			bpIds = [];
		}

		function goTo() {
			var url = globals.defaultState + '.' + 'businesspartner.main'.replace('.', '');
			$state.go(url).then(function () {
				cloudDesktopSidebarService.filterSearchFromPKeys(bpIds);
				bpIds = [];
			});
		}

		// /////////////////////
		function createBusinessPartner(parentService) {

			var leadingService = moduleContext.getLeadingService();
			leadingService.update().then(function () {

				var originalModuleName = parentService.name;
				var leadingSelected = leadingService.getSelected();
				// it is better compare with full module name.
				if (leadingSelected === null) {
					if (originalModuleName === 'procurement.package') {
						platformModalService.showMsgBox($translate.instant('procurement.common.wizard.createBusinessPartner.errorNoSelectOnePackage'), 'Info', 'ico-info');
					} else if (originalModuleName === 'procurement.requisition') {
						platformModalService.showMsgBox($translate.instant('procurement.common.wizard.createBusinessPartner.errorNoSelectOneREQ'), 'Info', 'ico-info');
					} else if (originalModuleName === 'procurement.rfq.requisition') {
						platformModalService.showMsgBox($translate.instant('procurement.common.wizard.createBusinessPartner.errorNoSelectOneRfq'), 'Info', 'ico-info');
					}
					return;
				}

				var suggestedBidderService = procurementCommonSuggestedBiddersDataService.getService(parentService);
				var bidderList = suggestedBidderService.getList();
				var data = [];
				var isHasNullBpName = false;
				_.forEach(bidderList, function (item) {
					if (item.BusinessPartnerFk === null) {
						var temp = angular.copy(item);
						temp.MainItemId = temp.Id;
						data.push(temp);

						if (!item.BpName1) {
							isHasNullBpName = true;
						}
					}
				});

				if (!data || data.length === 0) {
					platformModalService.showMsgBox($translate.instant('procurement.common.wizard.createBusinessPartner.errorNoSBWithouBP'), 'Info', 'ico-info');
					return;
				}

				if (isHasNullBpName) {
					platformModalService.showMsgBox($translate.instant('procurement.common.wizard.createBusinessPartner.bidderHasNoBpName'), 'Info', 'ico-info');
					return;
				}

				var parentEntity = parentService.getSelected(); // get it's prcHeaderFk;
				var prcHeaderFk = -1;
				if (parentEntity.PrcHeaderFk > 0) {
					prcHeaderFk = parentEntity.PrcHeaderFk;
				} else if (parentEntity.PrcHeaderEntity && parentEntity.PrcHeaderEntity.Id) {
					prcHeaderFk = parentEntity.PrcHeaderEntity.Id;
				}
				var rfqHeaderFk = -1;
				if (originalModuleName === 'procurement.rfq.requisition') {
					rfqHeaderFk = leadingSelected.Id;
				}
				// $http.post(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/createwithparams', data).then(function (response) {
				$http.post(globals.webApiBaseUrl + 'procurement/common/wizard/createwithparams?prcHeaderFk=' + prcHeaderFk + '&rfqHeaderFk=' + rfqHeaderFk).then(function (response) {
					var result = response.data;
					if (!result || result.length === 0) {
						platformModalService.showMsgBox($translate.instant('procurement.common.wizard.createBusinessPartner.errorNoSBWithouBPReload'), 'Info', 'ico-info').then(function () {
							suggestedBidderService.reload();
						});
					} else {
						var modalOptions = {
							templateUrl: globals.appBaseUrl + 'procurement.common/partials/wizard/goto-dialog.html',
							headerText: $translate.instant('procurement.common.wizard.createBusinessPartner.headerText'),
							bodyText: result.length > 1 ? $translate.instant('procurement.common.wizard.createBusinessPartner.bodyTextMulti', {length: result.length}) : $translate.instant('procurement.common.wizard.createBusinessPartner.bodyText'),
							showOKButton: true
						};
						_.forEach(result, function (bidder) {
							if (bidder.BusinessPartnerFk) {
								bpIds.push(bidder.BusinessPartnerFk);
							}
						});

						platformModalService.showDialog(modalOptions).then(function () {
							suggestedBidderService.reload();
							if (originalModuleName === 'procurement.rfq.requisition') {
								var rfqBidderService = $injector.get('procurementRfqBusinessPartnerService');
								if (rfqBidderService && rfqBidderService.load) {
									rfqBidderService.load();
								}
							}
						});
					}

				}, function () {
					platformModalService.showMsgBox($translate.instant('procurement.common.wizard.createBusinessPartner.failToCreate'), 'Info', 'ico-info');
				});
			});
		}
	}
})(angular);