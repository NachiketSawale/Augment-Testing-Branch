/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */

(function () {
	'use strict';
	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesBillingWipService
	 * @function
	 *
	 * @description
	 * salesBillingWipService
	 */
	salesBillingModule.factory('salesBillingWipService',
		['_', '$injector', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'salesBillingService',
			function (_, $injector, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, salesBillingService) {

				var statusEntities = $injector.get('salesBillingStatusLookupDataService').getListSync('salesBillingStatusLookupDataService');

				function ensureStatusLoaded() {
					if (_.isEmpty(statusEntities)) {
						statusEntities = $injector.get('salesBillingStatusLookupDataService').getListSync('salesBillingStatusLookupDataService');
					}
				}

				// validation
				function canCreate() {
					ensureStatusLoaded();
					// Do not allow to add WIPs to a bill for which one of the following conditions is true:
					// Is Billed = true, Is Posted = true, Is Cancelled = true, Is Read-only = true
					var curBill = salesBillingService.getSelected();
					if (curBill !== null) {
						var curStatus = _.find(statusEntities, {Id: curBill.BilStatusFk});
						if (curStatus) {
							var systemOption = $injector.get('salesCommonSystemOption'); // TODO: access to sys opt value should be easier
							var sysOptionService = $injector.get('salesCommonSystemOptionService');
							var updateAlreadyBilledQuantity = sysOptionService.getValueAsBool(systemOption.UpdateAlreadyBilledQuantity);
							return !(updateAlreadyBilledQuantity && (curStatus.IsPosted || curStatus.IsBilled || curStatus.IsStorno || curStatus.IsReadOnly));
						}
					}
					return false;
				}

				function canDelete() {
					// we use same check like for canCreate() at the moment
					return canCreate();
				}

				var salesBillingWipServiceOption = {
					flatLeafItem: {
						module: salesBillingModule,
						serviceName: 'salesBillingWipService',
						httpCreate: {route: globals.webApiBaseUrl + 'sales/billing/', endCreate: 'createBill2Wip'}, // TODO: endpoint not used yet, see TODO below (regarding originalCreateItem)
						httpRead: {
							usePostForRead: true, route: globals.webApiBaseUrl + 'sales/wip/', endRead: 'wipsbyBillId',
							initReadData: function initReadData(readData) {
								readData.PKey1 = _.get(salesBillingService.getSelected(), 'Id');
							}
						},
						dataProcessor: [
							platformDataServiceProcessDatesBySchemeExtension.createProcessor({
								typeName: 'WipHeaderDto',
								moduleSubModule: 'Sales.Wip'
							})],
						presenter: {
							list: {}
						},
						entityRole: {
							leaf: {itemName: 'Bill2Wip', parentService: salesBillingService}
						},
						actions: {
							delete: true, create: 'flat',
							canCreateCallBackFunc: function (item) {
								return canCreate(item);
							},
							canDeleteCallBackFunc: function (item) {
								return canDelete(item);
							}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(salesBillingWipServiceOption);
				var service = serviceContainer.service;

				// TODO: refactor?
				// - delete is handled as subentity
				// - creation will be directly, so create+save+reload subentity (using assign wip dialog)
				// - originalCreateItem not used yet internally
				// var originalCreateItem = service.createItem;
				service.createItem = function createItem() {
					var selectedBills = salesBillingService.getSelectedEntities();
					// process if only one bill is selected
					if (_.size(selectedBills) !== 1) {
						return;
					}
					var selectedBill = salesBillingService.getSelected();
					var filters = [{
						key: 'sales-billing-assign-related-wip-filter',
						serverKey: 'sales-billing-assign-related-wip-filter-by-server',
						serverSide: true,
						fn: function (/* dlgEntity , state */) {
							var curBill = salesBillingService.getSelected();
							return {
								BillId: curBill.Id,
								ProjectId: curBill.ProjectFk
							};
						}
					}];
					$injector.get('basicsLookupdataLookupFilterService').registerFilter(filters);

					function unregisterFilter() {
						$injector.get('basicsLookupdataLookupFilterService').unregisterFilter(filters);
					}

					var dataItem = {
						RelatedWipId: null,
					};
					var modalDialogConfig = {
						title: $injector.get('$translate').instant('sales.common.dialogTitleAssignWip'), // TODO: 'sales.billing.assignRelatedWipDialogTitle'?
						dataItem: dataItem,
						formConfiguration: {
							fid: 'sales.billing.assignRelatedWipDialog',
							version: '0.1.0',
							showGrouping: false,
							groups: [{
								gid: 'baseGroup',
								attributes: ['relatedWipId']
							}],
							rows: [
								// Related WIP
								{
									gid: 'baseGroup',
									rid: 'relatedWipId',
									model: 'RelatedWipId',
									sortOrder: 1,
									label: 'Related WIP',
									label$tr$: 'sales.billing.RelatedWip',
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'sales-common-wip-dialog-v2',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											filterKey: 'sales-billing-assign-related-wip-filter',
											showClearButton: false
										}
									}
								}
							]
						},
						dialogOptions: {
							disableOkButton: function disableOkButton() {
								return dataItem.RelatedWipId === null;
							}
						},
						handleOK: function handleOK(result) {
							if (_.has(result, 'data.RelatedWipId')) {
								var RelatedWipId = _.get(result, 'data.RelatedWipId');
								if (RelatedWipId > 0 && _.isObject(selectedBill)) {
									salesBillingService.updateAndExecute(function () {
										$injector.get('$http').post(globals.webApiBaseUrl + 'sales/billing/postAddWip2BillAndSave', {
											PKey1: selectedBill.Id,
											PKey2: RelatedWipId
										}).then(function () {
											// TODO: merge new bill header

											// reload related wips container
											service.load();
										});
									});
								}
							}
							unregisterFilter();
						},
						handleCancel: function handleCancel() {
							unregisterFilter();
						}
					};

					$injector.get('platformTranslateService').translateFormConfig(modalDialogConfig.formConfiguration);
					$injector.get('platformModalFormConfigService').showDialog(modalDialogConfig);
				};

				return service;

			}]);
})();
