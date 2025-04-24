/**
 * Created by lcn on 10/10/2017.
 */
// eslint-disable-next-line no-redeclare
/* global angular,globals,Set */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.stock';
	angular.module(moduleName).factory('projectStockSidebarWizardService',
		['$http', '_', '$q', 'platformSidebarWizardConfigService', 'platformModalService', 'procurementStockStockTotalDataService', '$translate', 'procurementStockShowOrderProposalDialogService',
			'procurementStockHeaderDataService', 'procurementStockOrderProposalDataService', 'platformContextService',
			function ($http, _, $q, platformSidebarWizardConfigService, platformModalService, procurementStockStockTotalDataService, $translate, procurementStockShowOrderProposalDialogService,
				procurementStockHeaderDataService, procurementStockOrderProposalDataService, platformContextService) {

				var service = {};
				service.ClearProjectStock = function () {
					var checkedPrjStockFks = procurementStockHeaderDataService.checkedPrjStockFks;
					if (checkedPrjStockFks) {
						var checkedCompanyIds = _.map(_.filter(procurementStockHeaderDataService.getList(), function (item) {
							return checkedPrjStockFks.indexOf(item.PrjStockFk) !== -1;
						}), 'CompanyFk');

						var length = _.size(_.filter(checkedCompanyIds, function (companyId) {
							return companyId !== platformContextService.clientId;
						}));
						if (length > 0) {
							platformModalService.showDialog({
								headerText: $translate.instant('procurement.stock.wizard.ClearProjectStockTitle'),
								bodyText: $translate.instant('procurement.stock.wizard.notBelongToLoginCompanyMessage'),
								iconClass: 'ico-info'
							});
						} else {
							platformModalService.showDialog({
								templateUrl: globals.appBaseUrl + 'procurement.stock/templates/clear-projectstock-template.html',
								controller: 'procurementStockClearProjectStockController',
								width: '620px',
								resolve: {
									'params': [
										function () {
											return {
												prjStockIds: checkedPrjStockFks
											};
										}
									]
								}
							}).then(function (res) {
								if (res.isClear) {
									procurementStockStockTotalDataService.callRefresh();
									procurementStockHeaderDataService.callRefresh();
								}
							});
						}
					} else {
						// select a project first.
						platformModalService.showDialog({
							headerText: $translate.instant('procurement.stock.wizard.ClearProjectStockTitle'),
							bodyText: $translate.instant('procurement.stock.wizard.SelectProjectStockMessage'),
							iconClass: 'ico-info'
						});
					}
				};

				service.CreateOrderProposal = function () {
					procurementStockShowOrderProposalDialogService.showOrderProposal();
				};

				service.CreateContract = function () {
					showDialogForMultiselection({
						url: globals.webApiBaseUrl + 'procurement/stock/orderproposal/createcontract',
						templateUrl: globals.appBaseUrl + 'procurement.stock/templates/create-contract-requisition-success.html',
						item: $translate.instant('procurement.stock.wizard.createByOrderProposal.contract'),
						moduleName: 'procurement.contract',
						registerService: 'procurementContractHeaderDataService',
						headerText: $translate.instant('procurement.stock.wizard.createByOrderProposal.createContract')
					});
				};

				service.CreateRequisition = function () {
					showDialogForMultiselection({
						url: globals.webApiBaseUrl + 'procurement/stock/orderproposal/createrequisition',
						templateUrl: globals.appBaseUrl + 'procurement.stock/templates/create-contract-requisition-success.html',
						item: $translate.instant('procurement.stock.wizard.createByOrderProposal.requisition'),
						moduleName: 'procurement.requisition',
						registerService: 'procurementRequisitionHeaderDataService',
						headerText: $translate.instant('procurement.stock.wizard.createByOrderProposal.createRequisition')
					});
				};

				service.createAccrualTransaction=function(){
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + 'procurement.stock/templates/create-accrual-transaction-dialog.html',
						controller: 'procurementStockCreateAccrualTransactionController'
					});
				};

				function showDialogForMultiselection(option) {
					var selOrderProposals = procurementStockOrderProposalDataService.getSelectedEntities();
					var ids = new DistinctIdsFrom(selOrderProposals, 'Id');
					if (selOrderProposals && selOrderProposals.length === 1) {
						$http.post(option.url, {Ids: ids, CreateType: 0}).then(function (res) {
							goToContract(res.data, option);
							procurementStockStockTotalDataService.callRefresh();
							procurementStockOrderProposalDataService.callRefresh();
						});
					} else if (selOrderProposals) {
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'procurement.stock/templates/stock-wizard-create-contract-requisition-dialog.html',
							controller: 'ProcurementStockCreateContractRequisitionController',
							width: '620px',
							resolve: {
								'params': function () {
									return {
										OrderProposalList: selOrderProposals,
										OrderProposalIds: ids,
										Option: option
									};
								}
							}
						}).then(function () {
							procurementStockStockTotalDataService.callRefresh();
							procurementStockOrderProposalDataService.callRefresh();
						});
					}
				}

				function goToContract(data, option) {
					option.resizeable = true;
					option.itemList = _.isArray(data) ? data : [data];
					platformModalService.showDialog(option);
				}

				function DistinctIdsFrom(data, field) {
					return Array.from(new Set(_.map(data, field)));
				}

				return service;

			}
		]);
})(angular);