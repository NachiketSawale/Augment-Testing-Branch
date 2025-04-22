/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.bid';
	var salesBidModule = angular.module(moduleName);

	salesBidModule.factory('salesBidCreateContractWizardDialogService',
		['_', 'globals', '$injector', '$q', '$http', '$translate', 'platformModalService', 'platformSidebarWizardCommonTasksService', 'salesBidService', 'PlatformMessenger', 'basicsLookupdataLookupFilterService', 'salesCommonRubric',
			function (_, globals, $injector, $q, $http, $translate, platformModalService, platformSidebarWizardCommonTasksService, salesBidService, PlatformMessenger, basicsLookupdataLookupFilterService, salesCommonRubric) {

				var service = {};
				var filters = [
					{
						key: 'sales-bid-rubric-category-by-order-confirmation-filter',
						fn: function (rubricCategory /* , entity */) {
							return rubricCategory.RubricFk === salesCommonRubric.Contract && rubricCategory.sorting !== 0; // Order Confirmation ([BAS_RUBRIC])
						}
					},
					{
						key: 'sales-bid-create-contract-wizard-main-contract-filter',
						fn: function (contract, entity) {
							// show only contracts from project
							var restrictToProject = entity.ProjectFk ? contract.ProjectFk === entity.ProjectFk : true;
							// only contracts allowed which do not reference other contracts
							// also do not allow self reference
							return contract.Id === entity.Id ? false : contract.OrdHeaderFk === null && restrictToProject;
						}
					},
					{
						key: 'sales-contract-configuration-filter',
						serverSide: true,
						fn: function (entity) {
							var rubricCat = entity.RubricCategoryFk > 0 ? ' AND RubricCategoryFk=' + entity.RubricCategoryFk : '';
							return `RubricFk=${salesCommonRubric.Contract}${rubricCat}`;
						}
					},
					{
						key: 'sales-contract-project-change-common-filter',
						serverSide: true,
						serverKey: 'sales-contract-project-change-common-filter',
						fn: function (item) {
							if (item.ProjectFk) {
								return {
									ProjectFk: item.ProjectFk,
									IsChangeOrder: true,
									IsSales: true
								};
							}
						}
					},
					{
						key: 'sales-contract-code-filter',
						serverSide: true,
						fn: function (entity) {
							entity = entity ? entity : service.getBidSelected();
							if (!entity) {
								return;
							}
							if (entity.Id !== null && entity.ProjectFk !== null) {
								return 'BidHeaderFk=' + entity.Id + '&ProjectFk=' + entity.ProjectFk;
							}
						}
					}
				];
				angular.extend(service, {
					onRubricCategoryChanged: new PlatformMessenger(),

					createContractDialog: createContractDialog,
					createContractDialogConfirmation: createContractDialogConfirmation,
					createContractFromBid: createContractFromBid,
					getBidSelected: getBidSelected,
					getMainContract: getMainContract,
					suggestMainContractForChangeOrSide: suggestMainContractForChangeOrSide,
					isUniqueContract: isUniqueContract,
					canCreateContractFromBid: canCreateContractFromBid,
					registerFilters: registerFilters,
					unregisterFilters: unregisterFilters,
					updateContractFromBid: updateContractFromBid
				});

				return service;

				function createContractDialog() {

					var selectedBid = salesBidService.getSelected(),
						title = 'sales.bid.wizardCWCreateContract',
						msg = $translate.instant('sales.bid.noCurrentBidSelection');

					if (platformSidebarWizardCommonTasksService.assertSelection(selectedBid, title, msg)) {
						var bidStatusLookup = $injector.get('salesBidStatusLookupDataService');
						bidStatusLookup.getItemByIdAsync(selectedBid.BidStatusFk, {dataServiceName: 'salesBidStatusLookupDataService'}).then(function (bidStatus) {
							if (!bidStatus.IsQuoted) {
								platformModalService.showMsgBox('sales.bid.wizardCWCreateContractNotQuoted', title, 'info');
								return;
							}

							var dialogOptions = {
								templateUrl: 'sales.bid/templates/sales-bid-create-wizard.html',
								controller: 'salesBidCreationContractWizardController'
							};

							platformModalService.showDialog(dialogOptions);
						});
					}
				}

				function createContractDialogConfirmation(type) {
					var textKey = 'sales.bid.wizardCWCreateContract';
					textKey += ((type === 'billto') ? 'ForBillToAlreadyExistsConfirm' : 'AlreadyExistsConfirm');

					var modalOptions = {
						headerTextKey: $translate.instant('sales.bid.wizardCWCreateContract'),
						bodyTextKey: $translate.instant(textKey),
						showYesButton: true,
						showNoButton: true,
						iconClass: 'ico-question'
					};

					return platformModalService.showDialog(modalOptions);
				}

				function createRequest(entity, isUpdate = false) {
					// Since we do not want to reset the settings for main contract/change order if the user changes
					// the contract type, we have to post process the entity and ignore invalid settings like
					// "isMain Type" with selected main and/or change contract
					var typeEntity = $injector.get('salesContractTypeLookupDataService').getItemById(entity.TypeFk);
					return {
						typeId: entity.TypeFk,
						bidId: entity.BidId,
						rubricCategoryId: entity.RubricCategoryFk,
						configurationId: entity.ConfigurationFk,
						mainContractId: !typeEntity.IsMain ? (entity.OrdHeaderFk || -1) : null, // TODO: check why -1 instead of null
						description: entity.Description,
						billToId: entity.BillToFk,
						billingMethodFk: entity.BillingMethodFk,
						changeOrderId: typeEntity.IsChange ? (entity.ChangeOrderFk || null) : null,
						...(isUpdate && { contractId: entity.OrdHeaderFk })
					};
				}
				function createContractFromBid(entity) {
					const request = createRequest(entity);
					return $http.post(globals.webApiBaseUrl + 'sales/contract/createcontractfrombid', request);
				}

				function updateContractFromBid(entity) {
					const request = createRequest(entity, true);
					return $http.post(globals.webApiBaseUrl + 'sales/contract/updatecontractfrombid', request);
				}
				function getBidSelected() {
					return angular.copy(salesBidService.getSelected());
				}

				// TODO: (parts) duplicate
				function suggestMainContractForChangeOrSide(entity) {
					if (_.isNil(_.get(entity, 'ProjectFk')) || !_.has(entity, 'OrdHeaderFk')) {
						return $q.when(null);
					}
					if (_.isObject(_.get(entity, 'TypeEntity'))) {
						if (!(entity.TypeEntity.IsChange || entity.TypeEntity.IsSide)) {
							return $q.when(null);
						}
					}
					return $http.post(globals.webApiBaseUrl + 'sales/contract/suggestmaincontract?projectId=' + entity.ProjectFk).then(function (response) {
						var mainContractHeader = response.data;
						if (_.isObject(mainContractHeader) && _.has(mainContractHeader, 'Id')) {
							entity.OrdHeaderFk = mainContractHeader.Id;
						}
					});
				}

				function getMainContract(bidId) {
					return $http.get(globals.webApiBaseUrl + 'sales/contract/maincontractbybidid?bidId=' + bidId);
				}

				function canCreateContractFromBid(bidEntity) {
					var defer = $q.defer();
					if (_.get(bidEntity, 'TypeEntity.IsChange') !== true) {
						// no validation here (if it's not a change)
						defer.resolve({canCreate: true});
					} else {
						$http.post(globals.webApiBaseUrl + 'sales/contract/cancreatecontractfrombid', bidEntity.BidId).then(function (response) {
							defer.resolve(response.data);
						});
					}
					return defer.promise;
				}

				function isUniqueContract(bidId, billToId) {
					var defer = $q.defer();
					var data = {
						bidHeaderFk: bidId,
						billToFk: billToId
					};
					$http.post(globals.webApiBaseUrl + 'sales/contract/isuniquebid', data).then(function (response) {
						defer.resolve(response.data);
					});
					return defer.promise;
				}

				function registerFilters() {
					basicsLookupdataLookupFilterService.registerFilter(filters);
				}

				function unregisterFilters() {
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
				}
			}]);
})();
