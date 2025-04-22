/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {
	'use strict';
	var moduleName = 'sales.wip';
	var salesWipModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesWipBillingService
	 * @function
	 *
	 * @description
	 * salesWipBillingService
	 */
	salesWipModule.factory('salesWipBillingService',
		['globals', '_', '$injector', 'platformDataServiceProcessDatesBySchemeExtension', 'platformRuntimeDataService', 'platformDataServiceFactory', 'salesWipService',
			function (globals, _, $injector, platformDataServiceProcessDatesBySchemeExtension, platformRuntimeDataService, platformDataServiceFactory, salesWipService) {

				// validation
				function canCreate() {
					return true; // TODO: add validation
				}

				function canDelete() {
					return true; // TODO: add validation
				}

				var salesWipBillingServiceOption = {
					flatLeafItem: {
						module: salesWipModule,
						serviceName: 'salesWipBillingService',
						httpRead: {
							usePostForRead: true, route: globals.webApiBaseUrl + 'sales/billing/', endRead: 'billsByWipId',
							initReadData: function initReadData(readData) {
								readData.PKey1 = _.get(salesWipService.getSelected(), 'Id');
							}
						},
						dataProcessor: [
							{  // make readonly
								processItem: function (bill) {
									platformRuntimeDataService.readonly(bill, true);
								}
							},
							platformDataServiceProcessDatesBySchemeExtension.createProcessor({
								typeName: 'BilHeaderDto',
								moduleSubModule: 'Sales.Billing'
							})
						],
						presenter: {
							list: {}
						},
						entityRole: {
							leaf: {itemName: 'Wip2Bill', parentService: salesWipService}
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

				var serviceContainer = platformDataServiceFactory.createNewComplete(salesWipBillingServiceOption);
				var service = serviceContainer.service;

				// TODO: refactor?
				// - delete is handled as subentity
				// - creation will be directly, so create+save+reload subentity (using assign bill dialog)
				// - originalCreateItem not used yet internally
				// var originalCreateItem = service.createItem;
				service.createItem = function createItem() {
					var selectedWips = salesWipService.getSelectedEntities();
					// process if only one wip is selected
					if (_.size(selectedWips) !== 1) {
						return;
					}
					var selectedWip = salesWipService.getSelected();
					var filters = [{
						key: 'sales-wip-assign-related-bill-filter',
						serverKey: 'sales-wip-assign-related-bill-filter-by-server',
						serverSide: true,
						fn: function (/* dlgEntity , state */) {
							var curWip = salesWipService.getSelected();
							return {
								WipId: curWip.Id,
								ProjectId: curWip.ProjectFk
							};
						}
					}];
					$injector.get('basicsLookupdataLookupFilterService').registerFilter(filters);

					function unregisterFilter() {
						$injector.get('basicsLookupdataLookupFilterService').unregisterFilter(filters);
					}

					var dataItem = {
						RelatedBillId: null,
					};
					var modalDialogConfig = {
						title: $injector.get('$translate').instant('sales.common.dialogTitleAssignBill'), // TODO: 'sales.wip.assignRelatedBillDialogTitle'?
						dataItem: dataItem,
						formConfiguration: {
							fid: 'sales.wip.assignRelatedBillDialog',
							version: '0.1.0',
							showGrouping: false,
							groups: [{
								gid: 'baseGroup',
								attributes: ['relatedBillId']
							}],
							rows: [
								// Related Bill
								{
									gid: 'baseGroup',
									rid: 'relatedBillId',
									model: 'RelatedBillId',
									sortOrder: 1,
									label: 'Related Bill',
									label$tr$: 'sales.wip.RelatedBill', // TODO: add to en.json
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'sales-common-bill-dialog-v2',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											filterKey: 'sales-wip-assign-related-bill-filter',
											showClearButton: false
										}
									}
								}
							]
						},
						dialogOptions: {
							disableOkButton: function disableOkButton() {
								return dataItem.RelatedBillId === null;
							}
						},
						handleOK: function handleOK(result) {
							if (_.has(result, 'data.RelatedBillId')) {
								var RelatedBillId = _.get(result, 'data.RelatedBillId');
								if (RelatedBillId > 0 && _.isObject(selectedWip)) {
									salesWipService.updateAndExecute(function () {
										$injector.get('$http').post(globals.webApiBaseUrl + 'sales/billing/postAddWip2BillAndSave', {
											PKey1: RelatedBillId,
											PKey2: selectedWip.Id
										}).then(function () {
											// reload related bills container
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
