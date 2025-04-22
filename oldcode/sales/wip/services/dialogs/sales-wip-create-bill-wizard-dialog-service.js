/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.wip';
	var salesWipModule = angular.module(moduleName);

	salesWipModule.factory('salesWipCreateBillWizardDialogService',
		['globals', '_', '$injector', '$http', '$translate', 'platformModalService', 'platformSidebarWizardCommonTasksService', 'salesWipService', 'basicsLookupdataLookupFilterService', 'salesCommonRubric',
			function (globals, _, $injector, $http, $translate, platformModalService, platformSidebarWizardCommonTasksService, salesWipService, basicsLookupdataLookupFilterService, salesCommonRubric) {

				var service = {};
				var filters = [
					{
						key: 'sales-wip-rubric-category-by-customer-billing-filter',
						fn: function (rubricCategory /* , entity */) {
							return rubricCategory.RubricFk === salesCommonRubric.Billing && rubricCategory.sorting !== 0;
						}
					},
					{
						key: 'sales-billing-no-filter',
						serverSide: true,
						fn: function (entity) {
							entity = entity ? entity : service.getWIPSelected();
							if (!entity) {
								return;
							}
							if (entity.Id !== null && entity.ProjectFk !== null) {
								return 'WipId=' + entity.Id;
							}
						}

					}
				];

				angular.extend(service, {
					createBillDialog: createBillDialog,
					getWIPSelected: getWIPSelected,
					createBillFromWIPs: createBillFromWIPs,
					getWIPsFromSameContract: getWIPsFromSameContract,
					getPreselectedWIPs: getPreselectedWIPs,
					transferLineItemQuantitiesToBill: transferLineItemQuantitiesToBill,
					registerFilters: registerFilters,
					unregisterFilters: unregisterFilters,
					updateBillFromWIPs: updateBillFromWIPs
				});

				return service;

				function createBillDialog() {
					var selectedWip = salesWipService.getSelected(),
						title = 'sales.wip.wizardCWCreateBill',
						msg = $translate.instant('sales.wip.noCurrentWipSelection');

					if (platformSidebarWizardCommonTasksService.assertSelection(selectedWip, title, msg)) {
						salesWipService.updateAndExecute(function () {
							var wipStatusLookup = $injector.get('salesWipStatusLookupDataService');
							wipStatusLookup.getItemByIdAsync(selectedWip.WipStatusFk, {dataServiceName: 'salesWipStatusLookupDataService'}).then(function (wipStatus) {
								if (!wipStatus.IsAccepted) {
									platformModalService.showMsgBox('sales.wip.wizardCWCreateBillWipNotOrderedInfo', title, 'info');
									return;
								}

								var dialogOptions = {
									templateUrl: 'sales.wip/templates/sales-wip-create-wizard.html',
									controller: 'salesWipCreationBillWizardController',
									width: '800px',
									resizeable: true
								};

								platformModalService.showDialog(dialogOptions);
							});
						});
					}
				}

				function getWIPSelected() {
					return angular.copy(salesWipService.getSelected());
				}
				function createBillFromWIPs(billDescription, typeId, configurationId, previousBillId, wipIds, billToId, billNo) {
					var url = globals.webApiBaseUrl + 'sales/billing/';
					var request = {
						typeId: typeId,
						configurationId: configurationId,
						previousBillId: previousBillId,
						description: billDescription,
						billToId: billToId,
						billNo : billNo
					};
					if (_.size(wipIds) > 1) {
						request.wipIds = wipIds;
						return $http.post(url + 'createbillfromwips', request);
					} else if (_.size(wipIds) === 1) {
						request.wipId = wipIds[0];
						return $http.post(url + 'createbillfromwip', request);
					}
				}
				function updateBillFromWIPs(entity, wipIds) {
					var url = globals.webApiBaseUrl + 'sales/billing/';
					var request = {
						typeId: entity.TypeFk,
						configurationId: entity.ConfigurationFk,
						previousBillId: entity.PreviousBillFk,
						description: entity.Description,
						billToId: entity.BillToFk,
						billId: entity.BilHeaderFk,
						wipIds: wipIds
					};
					return $http.post(url + 'updatebillfromwips', request);
				}

				function getWIPsFromSameContract() {
					var selectedWip = salesWipService.getSelected();
					var allWips = salesWipService.getList();

					// get all status ids
					var wipStatusLookup = $injector.get('salesWipStatusLookupDataService');
					var statusIdList = _.map(_.filter(wipStatusLookup.getListSync({lookupType: 'salesWipStatusLookupDataService'}), {IsAccepted: true}), 'Id');

					// return all wips belonging to same contract and having already status, which flag IsAccepted is set
					return _.filter(_.filter(allWips, {OrdHeaderFk: selectedWip.OrdHeaderFk}), function (item) {
						return _.includes(statusIdList, item.WipStatusFk);
					});
				}

				function transferLineItemQuantitiesToBill(billId, wipIds, projectId, previousBillId) {
					var url = globals.webApiBaseUrl + 'estimate/main/lineitemquantity/';
					var request = {
						billId: billId,
						wipIds: wipIds,
						projectFk : projectId,
						previousBillId: previousBillId
					};
					$http.post(url + 'transferwipquantitiestobill', request);
				}

				function getPreselectedWIPs() {
					return [salesWipService.getSelected()];
				}

				function registerFilters() {
					basicsLookupdataLookupFilterService.registerFilter(filters);
				}

				function unregisterFilters() {
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
				}

			}]);
})();
