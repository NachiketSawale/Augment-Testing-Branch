/**
 * Created by lcn on 8/30/2018.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementCommonJudgmentTemplateService',
		['platformModalService', '$translate', '$http', '$timeout', 'procurementContextService',
			function (platformModalService, $translate, $http, $timeout, procurementContextService) {
				let service = {};
				service.execute = function execute(parentService, option, extendOption) {
					let strTitle = '', strBody = '';
					const header = parentService.getSelected();
					const serviceName = parentService.getServiceName();

					let codes = getService(header, serviceName);
					if (!header || !header.Id) {
						strTitle = $translate.instant('procurement.common.errorTip.noRecordSelectedTitle');
						strBody = $translate.instant('procurement.common.errorTip.noRecordSelectedBody', {
							code: codes.name
						});
						return platformModalService.showMsgBox(strBody, strTitle, 'info');
					} else {
						let statusFk = codes.status;
						let url = 'procurement/' + codes.url + '/isStatusReadonly?statusId=';
						return $http.get(globals.webApiBaseUrl + url + statusFk).then(
							function (response) {
								if (response.data) {
									let body = extendOption && extendOption.recordIsReadOnlyBody ? extendOption.recordIsReadOnlyBody : 'procurement.common.errorTip.recordIsReadOnlyBody';
									strTitle = $translate.instant('procurement.common.errorTip.recordIsReadOnlyTitle');
									strBody = $translate.instant(body, {
										code: codes.name
									});
									return platformModalService.showMsgBox(strBody, strTitle, 'info');
								} else {
									option.currentCode = codes;
									return platformModalService.showDialog(option);
								}
							}
						);
					}
				};

				function getService(header, serviceName) {
					if (serviceName.indexOf('Contract') !== -1) {
						return {
							name: 'contract',
							url: 'contract/constatus',
							status: header ? header.ConStatusFk : 0,
							isExistBillingSchema: true,
							supName: 'Contract',
							rubricFk: procurementContextService.contractRubricFk,
							isUpdateHeaderTexts: true
						};
					} else if (serviceName.indexOf('Package') !== -1) {
						return {
							name: 'package',
							url: 'package/package',
							status: header ? header.PackageStatusFk : 0,
							isExistBillingSchema: false,
							supName: 'Package',
							rubricFk: procurementContextService.packageRubricFk,
							isUpdateHeaderTexts: true
						};
					} else if (serviceName.indexOf('Requisition') !== -1) {
						return {
							name: 'requisition',
							url: 'requisition/requisition',
							status: header ? header.ReqStatusFk : 0,
							isExistBillingSchema: false,
							supName: 'Requisition',
							rubricFk: procurementContextService.requisitionRubricFk,
							isUpdateHeaderTexts: true
						};
					} else if (serviceName.indexOf('Rfq') !== -1) {
						return {
							name: 'rfq',
							url: 'rfq/header',
							status: header ? header.RfqStatusFk : 0,
							isExistBillingSchema: false,
							supName: 'Rfq',
							rubricFk: procurementContextService.rfqRubricFk,
							isUpdateHeaderTexts: true
						};
					} else if (serviceName.indexOf('Pes') !== -1) {
						return {
							name: 'pes',
							url: 'pes/status',
							status: header ? header.PesStatusFk : 0,
							isExistBillingSchema: true,
							supName: 'Pes',
							rubricFk: procurementContextService.pesRubricFk,
							isUpdateHeaderTexts: false
						};
					} else if (serviceName.indexOf('Quote') !== -1) {
						return {
							name: 'quote',
							url: 'quote/header',
							status: header ? header.StatusFk : 0,
							isExistBillingSchema: false,
							supName: 'Quote',
							rubricFk: procurementContextService.quoteRubricFk,
							isUpdateHeaderTexts: false,
							serverSide: true,
							autoRefresh: true,
							qualifier: 'procurement.quote'
						};
					}

				}

				return angular.extend(service, {});
			}]);
})(angular);