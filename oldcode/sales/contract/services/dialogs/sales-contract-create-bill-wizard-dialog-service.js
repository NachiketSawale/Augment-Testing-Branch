/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */

(function () {
	'use strict';
	var moduleName = 'sales.contract';
	var salesContractModule = angular.module(moduleName);

	salesContractModule.factory('salesContractCreateBillWizardDialogService', [
		'_', '$injector', '$http', '$translate', 'platformModalService', 'platformSidebarWizardCommonTasksService', 'salesContractService', 'PlatformMessenger', 'basicsLookupdataLookupFilterService', 'salesCommonRubric',
		function (_, $injector, $http, $translate, platformModalService, platformSidebarWizardCommonTasksService, salesContractService, PlatformMessenger, basicsLookupdataLookupFilterService, salesCommonRubric) {

			var service = {};
			var filters = [
				{
					key: 'sales-contract-rubric-category-by-customer-billing-filter',
					fn: function (rubricCategory /* , entity */) {
						return rubricCategory.RubricFk === salesCommonRubric.Billing && rubricCategory.sorting !== 0;
					}
				}
			];

			angular.extend(service, {
				onRubricCategoryChanged : new PlatformMessenger(),

				createBillDialog: createBillDialog,
				createBillFromContract: createBillFromContract,
				getContractSelected: getContractSelected,
				registerFilters: registerFilters,
				unregisterFilters: unregisterFilters
			});

			return service;

			function createBillDialog() {

				var selectedContract = salesContractService.getSelected(),
					title = 'sales.contract.wizardCWCreateBill',
					msg = $translate.instant('sales.contract.noCurrentContractSelection');

				if (platformSidebarWizardCommonTasksService.assertSelection(selectedContract, title, msg)) {
					salesContractService.updateAndExecute(function () {
						var contractStatusLookup = $injector.get('salesContractStatusLookupDataService');
						contractStatusLookup.getItemByIdAsync(selectedContract.OrdStatusFk, {dataServiceName: 'salesContractStatusLookupDataService'}).then(function (contractStatus) {
							if (!contractStatus.IsFinallyBilled && !contractStatus.IsOrdered) {
								platformModalService.showMsgBox('sales.contract.wizardCWCreateBillNotOrderedWarning', title, 'info');
								return;
							}

							if (contractStatus.IsFinallyBilled) {
								platformModalService.showMsgBox('sales.contract.wizardCWCreateBillContractFinallyBilled', title, 'info');
								return;
							}

							var dialogOptions = {
								templateUrl: 'sales.contract/templates/sales-contract-create-wizard.html',
								controller: 'salesContractCreationBillWizardController'
							};

							platformModalService.showDialog(dialogOptions);
						});
					});
				}
			}

			function createBillFromContract(entity){
				var options = _.get(entity, '_opts');
				var description = _.get(entity, 'DescriptionInfo.Translated');

				var request = {
					contractId: entity.Id,
					typeId: entity.TypeFk,
					previousBillId: entity.PreviousBillFk,
					configurationId: entity.ConfigurationFk,
					description: description,
					useTransferContractQuantityOpt: options.transferContractQuantity,
					billNo: entity.BillNo,
				};
				return $http.post(globals.webApiBaseUrl + 'sales/billing/createbillfromcontract', request);
			}

			function getContractSelected(){
				// copy entity without the read only properties
				var contract = angular.copy(salesContractService.getSelected());
				delete contract.__rt$data;
				return contract;
			}

			function registerFilters(){
				basicsLookupdataLookupFilterService.registerFilter(filters);
			}

			function unregisterFilters(){
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			}

		}]);
})();
