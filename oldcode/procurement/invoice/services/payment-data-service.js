/**
 * Created by ltn on 11/18/2016.
 */
/* global globals,_ */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.invoice';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementInvoicePaymentDataService',
		['platformDataServiceFactory', 'procurementInvoiceHeaderDataService', 'basicsLookupdataLookupDescriptorService',
			'ServiceDataProcessDatesExtension','procurementContextService','procurementInvoicePaymentReadonlyProcessor','PlatformMessenger',
			function (dataServiceFactory, parentService, lookupDescriptorService,ServiceDataProcessDatesExtension,moduleContext,readonlyProcessor,PlatformMessenger) {
				var serviceContainer;
				var serviceOption = {
					flatLeafItem: {
						httpCreate: {route: globals.webApiBaseUrl + 'procurement/invoice/payment/'},
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/invoice/payment/',
							initReadData: function initReadData(readData) {
								readData.filter = '?mainItemId=' + parentService.getSelected().Id;
							}
						},
						actions: {
							delete: true,
							create: 'flat',
							canCreateCallBackFunc: function () {
								var rightByStatus = parentService.haveRightByStatus('InvStatusCreateRightToPayment');
								var editRightByStatus = parentService.haveRightByStatus('InvStatusEditRightToPayment');
								if (rightByStatus.hasDescriptor || (editRightByStatus && editRightByStatus.hasDescriptor)) {
									return true;
								}
								return !moduleContext.isReadOnly && rightByStatus.right;
							},
							canDeleteCallBackFunc: function () {
								var rightByStatus = parentService.haveRightByStatus('InvStatusDeleteRightToPayment');
								var editRightByStatus = parentService.haveRightByStatus('InvStatusEditRightToPayment');
								if (rightByStatus.hasDescriptor || (editRightByStatus && editRightByStatus.hasDescriptor)) {
									return true;
								}
								return !moduleContext.isReadOnly && rightByStatus.right;
							}
						},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									lookupDescriptorService.attachData(readData);
									serviceContainer.data.handleReadSucceeded(readData.Main, data, true);
									serviceContainer.service.setItemsReadOnly(readData.Main);
									serviceContainer.service.goToFirst();
								},
								initCreationData: function (creationData) {
									creationData.mainItemId = parentService.getSelected().Id;
								},
								handleCreateSucceeded: function (item) {
									item.Amount_Net = 0;// jshint ignore : line
									item.DiscountAmountNet = 0;
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'InvPayment',
								parentService: parentService
							}
						},
						dataProcessor: [new ServiceDataProcessDatesExtension(['PaymentDate','PostingDate'])]
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;

				var oldDeleteDone = serviceContainer.data.onDeleteDone;
				serviceContainer.data.onDeleteDone = onDeleteDoneInList;

				function onDeleteDoneInList(deleteParams, data, response) {
					service.firePaymentsDelete(angular.copy(deleteParams.entities));
					oldDeleteDone(deleteParams, data, response);
				}

				var onPaymentsAmountTotalUpdate = new PlatformMessenger();
				var onPaymentsDiscountAmountTotalUpdate = new PlatformMessenger();
				var onPaymentsDelete = new PlatformMessenger();
				// AmountVat update
				service.registerPaymentsAmountTotalUpdate = function registerPaymentsAmountTotalUpdate(func) {
					onPaymentsAmountTotalUpdate.register(func);
				};
				service.unregisterPaymentsAmountTotalUpdate = function unregisterPaymentsAmountTotalUpdate(func) {
					onPaymentsAmountTotalUpdate.unregister(func);
				};
				service.firePaymentsAmountTotalUpdate = function(item){
					onPaymentsAmountTotalUpdate.fire(null, item);
				};

				// DiscountAmount update
				service.registerPaymentsDiscountAmountTotalUpdate = function registerPaymentsDiscountAmountTotalUpdate(func) {
					onPaymentsDiscountAmountTotalUpdate.register(func);
				};
				service.unregisterPaymentsDiscountAmountTotalUpdate = function unregisterPaymentsDiscountAmountTotalUpdate(func) {
					onPaymentsDiscountAmountTotalUpdate.unregister(func);
				};
				service.firePaymentsDiscountAmountTotalUpdate = function(item){
					onPaymentsDiscountAmountTotalUpdate.fire(null, item);
				};

				// delete payments
				service.registerPaymentsDelete = function registerPaymentsDelete(func){
					onPaymentsDelete.register(func);
				};
				service.unregisterPaymentsDelete = function unregisterPaymentsDelete(func){
					onPaymentsDelete.unregister(func);
				};
				service.firePaymentsDelete = function(items){
					onPaymentsDelete.fire(null, items);
				};

				service.setItemsReadOnly = function setItemsReadOnly(items) {
					var rightByStatus = parentService.haveRightByStatus('InvStatusEditRightToPayment');
					if (!rightByStatus.right) {
						for (var k = 0; k < items.length; k++) {
							readonlyProcessor.setRowReadOnly(items[k], true);
						}
					}
					else {
						if (!rightByStatus.hasDescriptor) {
							var parentItem = parentService.getSelected();
							var parentStatus = parentService.getItemStatus(parentItem);
							if (parentStatus) {
								if (parentStatus.IsReadOnly) {
									for (var i = 0; i < items.length; i++) {
										readonlyProcessor.setRowReadOnly(items[i], true);
									}
								}
							}
						}
					}
				};

				service.getVatPercentWithTaxCodeMatrix = function getVatPercentWithTaxCodeMatrix(taxCodeFk, vatGroupFk) {
					var vatPercent = parentService.getVatPercentWithTaxCodeMatrix(taxCodeFk, vatGroupFk);
					return vatPercent;
				};

				function vatGroupChanged() {
					var list = serviceContainer.service.getList();
					if (list && list.length) {
						_.forEach(list, function (item) {
							calculateTotalAndVatAndGross(item);
						});
					}
				}

				function calculateTotalAndVatAndGross(item) {
					if (item === null) {
						return;
					}
					if(item.TaxCodeFk) {
						var vatPercent = service.getVatPercentWithTaxCodeMatrix(item.TaxCodeFk);
						var value = item.Amount;
						var DiscountValue = item.DiscountAmount;
						item.Amount_Net = value / (1 + (vatPercent / 100));// jshint ignore : line
						item.AmountVat = value - item.Amount_Net;// jshint ignore : line
						item.DiscountAmountNet =  DiscountValue / (1 + (vatPercent / 100));
						item.DiscountAmountVat = DiscountValue - item.DiscountAmountNet;
						serviceContainer.service.gridRefresh();
					}
				}

				parentService.vatGroupChanged.register(vatGroupChanged);

				return service;
			}]);
})(angular);