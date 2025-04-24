/**
 * Created by lcn on 1/15/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementCommonCreateSuggestedBidderService',
		['$q', '$http', '$translate', 'PlatformMessenger', 'platformModalService', '$injector',
			function ($q, $http, $translate, PlatformMessenger, platformModalService, $injector) {

				var service = {}/* , self = this */;
				// eslint-disable-next-line no-unused-vars
				service.execute = function (headerDataService) {
					var headerId = -1;
					var header = headerDataService.getSelected();
					if (header) {
						if (header.Version === 0) {
							return false; // header not saved.
						} else if (header.Version > 0) {
							headerId = header.Id;
						}
						header.bpPrcHeaderEntity = header.PrcHeaderEntity;
					}

					var textKey = 'procurement.package.wizard.noSubPackage';
					if (headerDataService.getServiceName() === 'procurementRequisitionHeaderDataService') {
						textKey = 'procurement.requisition.wizard.noRequisition';
					}
					if (headerId === -1) {
						var modalOptions = {
							headerTextKey: 'cloud.common.informationDialogHeader',
							bodyTextKey: textKey,
							showOkButton: true,
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
						return;
					}

					service.getSuggestedBidder(header.PrcHeaderFk).then(function (response) {
						const suggestedBidders = response.data;
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'businesspartner.main/templates/filter-business-partner-dialog.html',
							backdrop: false,
							resizeable: true,
							width: 'max',
							height: 'max',
							minHeight: '585px',
							IsWizardForFindBidder: true,
							IsPrcCommonSuggestedBidder: true,
							mainData: header,
							isCommonBidder: true,
							IsShowBranch: true,
							bidderData: suggestedBidders,
							refreshBidderContainer: function () {
								const service = $injector.get('procurementCommonSuggestedBiddersDataService').getService(headerDataService);
								service.load();
								service.gridRefresh();
							},
							onReturnButtonPress: function () {
							}
						});
					});
				};

				service.createSuggestedBusinessPartner = function (prcHeaderId, businessPartnerList, checkBpMapContact, checkBpMapSubsidiary) {
					return $http.post(globals.webApiBaseUrl + 'procurement/common/suggestedbidder/creatersuggestedbidders', {
							MainItemId: prcHeaderId,
							businessPartnerList: businessPartnerList,
							bpMapContactDic: checkBpMapContact,
							bpMapSubsidiaryDic: checkBpMapSubsidiary
						}
					);
				};

				service.getSuggestedBidder = function (prcHeaderId) {
					return $http.get(globals.webApiBaseUrl + 'procurement/common/wizard/getbidder?prcHeaderFk=' + prcHeaderId);
				};

				return service;
			}]);
})(angular);

