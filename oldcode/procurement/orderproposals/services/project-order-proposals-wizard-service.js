
(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'procurement.orderproposals';
	angular.module(moduleName).factory('ProcurementOrderProposalsSidebarWizardService',
		['$http', '_', '$translate', 'platformModalService', 'procurementStockStockTotalDataService', 'procurementOrderProposalsDataService',
			function procurementOrderProposalsSidebarWizardService($http, _, $translate, platformModalService, procurementStockStockTotalDataService, procurementOrderProposalsDataService) {

				var service = {},webApiBaseUrl = globals.webApiBaseUrl, appBaseUrl = globals.appBaseUrl;

				service.CreateContract = function CreateContract(){
					showDialogForMultiselection({
						url: webApiBaseUrl + 'procurement/orderproposals/header/createcontract',
						templateUrl: appBaseUrl + 'procurement.orderproposals/templates/create-contract-requisition-success.html',
						item: $translate.instant('procurement.stock.wizard.createByOrderProposal.contract'),
						moduleName: 'procurement.contract',
						registerService: 'procurementContractHeaderDataService',
						headerText: $translate.instant('procurement.stock.wizard.createByOrderProposal.createContract')
					});
				};

				service.CreateRequisition = function CreateRequisition(){
					showDialogForMultiselection({
						url: webApiBaseUrl + 'procurement/orderproposals/header/createrequisition',
						templateUrl: appBaseUrl + 'procurement.orderproposals/templates/create-contract-requisition-success.html',
						item: $translate.instant('procurement.stock.wizard.createByOrderProposal.requisition'),
						moduleName: 'procurement.requisition',
						registerService: 'procurementRequisitionHeaderDataService',
						headerText: $translate.instant('procurement.stock.wizard.createByOrderProposal.createRequisition')
					});
				};

				function showDialogForMultiselection(option){
					var selOrderProposals = procurementOrderProposalsDataService.getSelectedEntities();
					var ids = new DistinctIdsFrom(selOrderProposals,'Id');
					if(selOrderProposals){
						platformModalService.showDialog({
							templateUrl: appBaseUrl + 'procurement.orderproposals/templates/order-proposals-wizard-create-contract-requisition-dialog.html',
							controller: 'OrderProposalsCreateContractRequisitionController',
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
						}).then(function callback(data) {
							if(data) {
								procurementStockStockTotalDataService.callRefresh();
								procurementOrderProposalsDataService.callRefresh();
							}
						});
					}
				}

				function DistinctIdsFrom(data, field) {
					return Array.from(new Set(_.map(data, field)));
				}

				return service;

			}
		]);
})(angular);