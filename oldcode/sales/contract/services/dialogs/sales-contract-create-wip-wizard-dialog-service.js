/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */

(function () {
	'use strict';
	var moduleName = 'sales.contract';
	var salesContractModule = angular.module(moduleName);

	salesContractModule.factory('salesContractCreateWipWizardDialogService',
		['_', '$injector', '$q', '$http', '$translate', 'platformModalService', 'platformSidebarWizardCommonTasksService', 'salesContractService', 'PlatformMessenger', 'basicsLookupdataLookupFilterService', 'salesCommonRubric','platformDialogService',
			function (_, $injector, $q, $http, $translate, platformModalService, platformSidebarWizardCommonTasksService, salesContractService, PlatformMessenger, basicsLookupdataLookupFilterService, salesCommonRubric, platformDialogService) {

				var service = {};
				var filters = [
					{
						key: 'sales-wip-rubric-category-by-rubric-filter',
						serverKey: 'rubric-category-by-rubric-company-lookup-filter',
						serverSide: true,
						fn: function () {
							return { Rubric: salesCommonRubric.Wip };
						}
					},
					{
						key: 'sales-wip-configuration-filter',
						serverSide: true,
						fn: function (entity) {
							var rubricCat = entity.RubricCategoryFk > 0 ? ' AND RubricCategoryFk=' + entity.RubricCategoryFk : '';
							return `RubricFk=${salesCommonRubric.Wip}${rubricCat}`;
						}
					},
					{
						key: 'sales-contract-create-wip-previouswip-filter',
						serverKey: 'sales-wip-previouswip-filter-by-server',
						serverSide: true,
						fn: function (dlgEntity /* , state */) {
							var selectedContract = salesContractService.getSelected();
							// main contract or change/side contract?
							let mainContractId = selectedContract.OrdHeaderFk > 0 ? selectedContract.OrdHeaderFk : selectedContract.Id;
							return {
								ContractId: mainContractId,
								ProjectId: selectedContract.ProjectFk
							};
						}
					},
					{
						key: 'sales-wip-code-filter',
						serverSide: true,
						fn: function () {
							var entity = service.getContractSelected();
							if (!entity) {
								return;
							}
							if (entity.Id !== null && entity.ProjectFk !== null) {
								return 'OrdHeaderFk=' + entity.Id + '&ProjectFk=' + entity.ProjectFk;
							}
						}
					}
				];

				// grid contracts
				var contracts = [];
				var wipRelatedContracts = [];
				var wipHeaderFk = 0;

				// options
				var isCollectiveWIP = false;

				angular.extend(service, {
					onRubricCategoryChanged : new PlatformMessenger(),

					createWipDialog: createWipDialog,
					createWipDialogConfirmation: createWipDialogConfirmation,
					createWipFromContract: createWipFromContract,
					createWipFromContracts: createWipFromContracts,
					getContractSelected: getContractSelected,
					getMainContract: getMainContract,
					getContracts: getContracts,
					getContractsFromServer: getContractsFromServer,
					isUniqueContract: isUniqueContract,
					getCollectiveWIP: getCollectiveWIP,
					setCollectiveWIP: setCollectiveWIP,
					registerFilters: registerFilters,
					unregisterFilters: unregisterFilters,
					updateWipFromContracts: updateWipFromContracts,
					getWipRelatedContracts: getWipRelatedContracts,
					getWipHeaderFk: getWipHeaderFk,
				});

				return service;

				function createWipDialog() {

					var selectedContract = salesContractService.getSelected(),
						title = 'sales.contract.wizardCWCreateWip',
						msg = $translate.instant('sales.contract.noCurrentContractSelection');

					if (platformSidebarWizardCommonTasksService.assertSelection(selectedContract, title, msg)) {
						salesContractService.updateAndExecute(function () {
							var contractStatusLookup = $injector.get('salesContractStatusLookupDataService');
							contractStatusLookup.getItemByIdAsync(selectedContract.OrdStatusFk, {dataServiceName: 'salesContractStatusLookupDataService'}).then(function (contractStatus) {

								// for change orders we don't have the 'isOrdered' restriction (see 121482)
								var isChangeOrder = selectedContract.OrdHeaderFk !== null && selectedContract.PrjChangeFk !== null;
								if (!contractStatus.IsFinallyBilled && !contractStatus.IsOrdered && !isChangeOrder) {
									platformModalService.showMsgBox('sales.contract.wizardCWCreateWipNotOrderedWarning', title, 'info');
									return;
								}

								if (contractStatus.IsFinallyBilled) {
									platformModalService.showMsgBox('sales.contract.wizardCWCreateWipContractFinallyBilled', title, 'info');
									return;
								}

								var dialogOptions = {
									templateUrl: 'sales.contract/templates/sales-contract-create-update-wizard.html',
									controller: 'salesContractCreationWipWizardController',
									width: '800px'
								};

								platformDialogService.showDialog(dialogOptions);
							});
						});
					}
				}

				function createWipDialogConfirmation(){
					var modalOptions = {
						headerTextKey: $translate.instant('sales.contract.wizardCWCreateWip'),
						bodyTextKey: $translate.instant('sales.contract.wizardCWCreateWipAlreadyExistsConfirm'),
						showYesButton: true,
						showNoButton: true,
						iconClass: 'ico-question'
					};

					return platformModalService.showDialog(modalOptions);
				}

				function getCollectiveWIP() {
					return isCollectiveWIP;
				}

				function setCollectiveWIP(isEnable) {
					isCollectiveWIP = isEnable;
				}

				function getContracts() {
					return contracts;
				}
				function getWipHeaderFk(wipId) {
					wipHeaderFk = wipId;
					return wipHeaderFk;
				}

				function getContractsFromServer() {
					var selectedContract = salesContractService.getSelected();
					if (_.has(selectedContract, 'Id')) {
						var defer = $q.defer();
						var route = isCollectiveWIP ? 'contractsforcollectivewip' : 'relatedcontracts';
						$http.get(globals.webApiBaseUrl + 'sales/contract/' + route + '?contractId=' + selectedContract.Id).then(function (response) {
							contracts = response.data;
							_.each(contracts, $injector.get('SalesContractDocumentTypeProcessor').processItem);
							defer.resolve(response.data);
						});
						return defer.promise;
					} else {
						return $q.when([]);
					}
				}
				function getWipRelatedContracts() {
					var selectedContract = salesContractService.getSelected();
					if (_.has(selectedContract, 'Id')) {
						var defer = $q.defer();
						let params = {
							projectId: selectedContract.ProjectFk,
							isCollectiveWip: false,
							ordHeaderFk: selectedContract.OrdHeaderFk,
							wipHeaderFk: wipHeaderFk,
						};
						$http.post(globals.webApiBaseUrl + 'sales/contract/GetSalesContractsByProject', params).then(function (response) {
							wipRelatedContracts = response.data;
							_.each(wipRelatedContracts, $injector.get('SalesContractDocumentTypeProcessor').processItem);
							defer.resolve(response.data);
						});
						return defer.promise;
					} else {
						return $q.when([]);
					}
				}
				function getMainContract(contracts) {
					return _.isArray(contracts) ? _.find(contracts, {OrdHeaderFk: null}) || null : null;
				}

				function createWipFromContract(entity, contract){
					var postData = {
						contractId : contract.Id,
						rubricCategoryId : entity.RubricCategoryFk,
						description : entity.DescriptionInfo.Translated
					};
					return $http.post(globals.webApiBaseUrl + 'sales/wip/createwipfromcontract', postData);
				}

				function createWipFromContracts(entity) {
					var postData = {
						rubricCategoryId: entity.RubricCategoryFk,
						ConfigurationId: entity.ConfigurationFk,
						description: entity.DescriptionInfo.Translated,
						isCollectiveWip: entity.IsCollectiveWip,
						PrevWipHeaderId: entity.PreviousWipId
					};

					if (entity.IsCollectiveWip) {
						postData = angular.extend({
							contractId: _.first(contracts).Id,
							sideContractIds: null,
							includeMainContract: true,
							contractIds: _.map(contracts, 'Id')
						}, postData);

						return $http.post(globals.webApiBaseUrl + 'sales/wip/createwipfromcontracts', postData);
					} else {
						var markedContracts = _.filter(contracts, {'IsMarked': true});
						var mainContract = getMainContract(contracts);
						if (mainContract) {
							var isMainContractMarked = !_.isUndefined(_.find(markedContracts, {Id: mainContract.Id}));
							// exclude main contract from side order array
							_.remove(markedContracts, {'Id': mainContract.Id});
							postData = angular.extend({
								contractId: mainContract.Id,
								sideContractIds: _.map(markedContracts, 'Id'),
								includeMainContract: isMainContractMarked,
								contractIds: null
							}, postData);

							return $http.post(globals.webApiBaseUrl + 'sales/wip/createwipfromcontracts', postData);
						} else {
							return $q.reject(null);
						}
					}
				}
				function updateWipFromContracts(entity) {
					var postData = {
						configurationId: entity.ConfigurationFk,
						rubricCategoryId: entity.RubricCategoryFk,
						description: entity.DescriptionInfo.Translated,
						isCollectiveWIP: entity.IsCollectiveWip,
						PrevWipHeaderId: entity.PreviousWipId
					};
					var markedContracts = _.filter(wipRelatedContracts, { 'IsMarked': true });
					var mainContract = getMainContract(contracts);
					if (mainContract) {
						var isMainContractMarked = !_.isUndefined(_.find(markedContracts, { Id: mainContract.Id }));
						// exclude main contract from side order array
						_.remove(markedContracts, { 'Id': mainContract.Id });
						postData = angular.extend({
							contractId: mainContract.Id,
							sideContractIds: _.map(markedContracts, 'Id'),
							includeMainContract: isMainContractMarked,
							contractIds: null,
							wipHeaderFk: entity.WipHeaderFk
						}, postData);
						return $http.post(globals.webApiBaseUrl + 'sales/wip/updatewipfromcontracts', postData);
					} else {
						return $q.reject(null);
					}
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

				function registerFilters(){
					basicsLookupdataLookupFilterService.registerFilter(filters);
				}

				function unregisterFilters(){
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
				}
			}]);
})();
