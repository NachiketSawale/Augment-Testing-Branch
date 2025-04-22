/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */

(function () {
	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc service
	 * @name salesContractCreateRevenueWizardDialogService
	 * @function
	 * @requires platformSidebarWizardCommonTasksService salesContractService
	 *
	 * @description
	 * # service for revenue creation dialog
	 */
	angular.module(moduleName).factory('salesContractCreateRevenueWizardDialogService',
		['$injector', '$q', '$http', '$translate', 'platformModalService', 'platformSidebarWizardCommonTasksService', 'salesContractService',
			function ($injector, $q, $http, $translate, platformModalService, platformSidebarWizardCommonTasksService, salesContractService) {

				var service = {};

				angular.extend(service, {
					createRevenueDialog: createRevenueDialog,
					createRevenueDialogConfirmation: createRevenueDialogConfirmation,
					createRevenueFromContract: createRevenueFromContract,
					getContractSelected: getContractSelected,
					isUniqueContract: isUniqueContract
				});

				return service;

				function createRevenueDialog() {

					var selectedContract = salesContractService.getSelected(),
						title = 'sales.contract.wizardCWCreateRevenue',
						msg = $translate.instant('sales.contract.noCurrentContractSelection');

					if (platformSidebarWizardCommonTasksService.assertSelection(selectedContract, title, msg)) {
						salesContractService.updateAndExecute(function () {
							var contractStatusLookup = $injector.get('salesContractStatusLookupDataService');
							contractStatusLookup.getItemByIdAsync(selectedContract.OrdStatusFk, {dataServiceName: 'salesContractStatusLookupDataService'}).then(function (contractStatus) {
								if (!contractStatus.IsOrdered) {
									platformModalService.showMsgBox('sales.contract.wizardCWCreateRevenueNotOrderedWarning', title, 'info');
									return;
								}

								var dialogOptions = {
									templateUrl: 'sales.contract/templates/sales-contract-create-wizard.html',
									controller: 'salesContractCreationRevenueWizardController'
								};

								platformModalService.showDialog(dialogOptions);
							});
						});
					}
				}

				function createRevenueDialogConfirmation(){
					var modalOptions = {
						headerTextKey: $translate.instant('sales.contract.wizardCWCreateRevenue'),
						bodyTextKey: $translate.instant('sales.contract.wizardCWCreateRevenueAlreadyExistsConfirm'),
						showYesButton: true,
						showNoButton: true,
						iconClass: 'ico-question'
					};

					return platformModalService.showDialog(modalOptions);
				}

				/**
				 * @ngdoc function
				 * @name createRevenueFromContract
				 * @function
				 * @methodOf salesContractCreateRevenueWizardDialogService
				 * @description post data to transfer revenue to estimate
				 * @param entity
				 * @returns promise
				 */
				function createRevenueFromContract(entity){
					return $http.get(globals.webApiBaseUrl + 'estimate/project/transferrevenuefromcontract' + '?projectId='+ entity.ProjectFk + '&contractFk=' + entity.Id + '&estHeaderFk=' + entity.EstHeaderFk + '&costCodeFk=' + entity.mdcCostCodeFk + '&costCodeDisCountFk=' + entity.disCountCostCodeFk);
				}

				function getContractSelected(){
					return angular.copy(salesContractService.getSelected());
				}

				function isUniqueContract(id){
					var defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'sales/wip/isuniquecontract?ordHeaderFk=' + id).then(function(response){
						defer.resolve(response.data);
					});
					return defer.promise;
				}

			}]);
})();
