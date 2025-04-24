/**
 * Created by jhe on 8/29/2018.
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,Platform */
	var moduleName = 'procurement.invoice';
	var accountAssignmentModule = angular.module(moduleName);
	accountAssignmentModule.factory('procurementInvoiceAccountAssignmentDataService', ['globals', 'procurementInvoiceHeaderDataService',
		'platformDataServiceFactory', 'platformRuntimeDataService', '_', 'procurementInvoiceAccountAssignmentFilterService', 'procurementInvoiceAccountAssignmentValidationService',
		'procurementInvoiceAccountAssignmentReadonlyProcessor', '$http', 'procurementContextService', 'ServiceDataProcessDatesExtension',

		function (globals, procurementInvoiceHeaderDataService,
			platformDataServiceFactory, runtimeDataService, _, filterService, procurementInvoiceAccountAssignmentValidationService,
			readonlyProcessor, $http, moduleContext, ServiceDataProcessDatesExtension) {

			var usingContractChangedMessage = new Platform.Messenger();
			var onFilterLoaded = new Platform.Messenger();
			var onFilterUnLoaded = new Platform.Messenger();
			var updateTools = new Platform.Messenger();
			var isCreateByDeepCopy = false;
			var DeepCopyData;
			var isNeedUpdateDelete = false;
			var service;
			var sortId;
			var factoryOptions = {
				flatLeafItem: {
					module: accountAssignmentModule,
					serviceName: 'procurementInvoiceAccountAssignmentGetDataService',
					entityNameTranslationID: 'procurement.Invoice.entityAccountAssignment',
					httpCreate: {
						route: globals.webApiBaseUrl + 'procurement/invoice/accountAssignment/'
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/invoice/accountAssignment/',
						initReadData: function initReadData(readData) {
							var selectedItem = procurementInvoiceHeaderDataService.getSelected();
							if (selectedItem && selectedItem.Id > 0) {
								readData.filter = '?invoiceId=' + selectedItem.Id;
							}
						}
					},
					actions: {
						delete: true,
						create: 'flat',
						canCreateCallBackFunc: function () {
							return readonlyProcessor.getIsInvAccountChangeable();
						},
						canDeleteCallBackFunc: function () {
							return readonlyProcessor.getIsInvAccountChangeable();
						}
					},
					entityRole: {
						leaf: {
							itemName: 'InvAccountAssignmentDto',
							parentService: procurementInvoiceHeaderDataService
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								// ConHeaderFk
								var selectedItem = procurementInvoiceHeaderDataService.getSelected();
								if (selectedItem && selectedItem.Id > 0) {
									creationData.InvHeaderFk = selectedItem.Id;
									creationData.ConHeaderFk = selectedItem.ConHeaderFk;
									creationData.CompanyFk = selectedItem.CompanyFk;
									creationData.CurrentDtos = service.getList();
									if (creationData.CurrentDtos.length === 0) {
										creationData.ItemNO = 1;
									} else {
										creationData.CurrentDtos.sort(sortId);
										creationData.ItemNO = creationData.CurrentDtos[creationData.CurrentDtos.length - 1].ItemNO + 1;
									}
								}
							}
						}
					},
					dataProcessor: [
						new ServiceDataProcessDatesExtension(['DateDelivery'])
					]
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);
			service = serviceContainer.service;

			service.contractData = {
				conTotalAmount: 0,
				conTotalAmountOc: 0,
				conTotalNet: 0,
				conTotalNetOc: 0,
				conTotalPercent: 0,
				invoiceTotalAmount: 0,
				invoiceTotalAmountOc: 0,
				invoiceTotalNet: 0,
				invoiceTotalNetOc: 0,
				invoiceTotalPercent: 0,
				previousInvoiceNet: 0,
				previousInvoiceNetOc: 0,
				previousInvoiceAmount: 0,
				previousInvoiceAmountOc: 0,
				invCompanyCurrency: '',
				invHeaderCurrency: '',
				conCompanyCurrency: '',
				conHeaderCurrency: '',
				previousInvCompanyCurrency: '',
				previousInvHeaderCurrency: ''
			};

			var onReadSucceeded = serviceContainer.data.onReadSucceeded;
			serviceContainer.data.onReadSucceeded = function incorporateDataRead(readData, data) {
				var dataRead = onReadSucceeded({
					dtos: readData.dtos,
					FilterResult: readData.FilterResult
				},
				data);

				service.goToFirst();

				if (isCreateByDeepCopy) {
					service.setList(DeepCopyData);
					readData.dtos = DeepCopyData;
					isCreateByDeepCopy = false;
				} else {
					service.contractData.conTotalAmount = readData.conTotalAmount;
					service.contractData.conTotalAmountOc = readData.conTotalAmountOc;
					service.contractData.conTotalNet = readData.conTotalNet;
					service.contractData.conTotalNetOc = readData.conTotalNetOc;
					service.contractData.conTotalPercent = readData.conTotalPercent;
					service.contractData.invoiceTotalAmount = readData.invoiceTotalAmount;
					service.contractData.invoiceTotalAmountOc = readData.invoiceTotalAmountOc;
					service.contractData.invoiceTotalNet = readData.invoiceTotalNet;
					service.contractData.invoiceTotalNetOc = readData.invoiceTotalNetOc;
					service.contractData.invoiceTotalPercent = readData.invoiceTotalPercent;
					service.contractData.previousInvoiceNet = readData.previousInvoiceNet;
					service.contractData.previousInvoiceNetOc = readData.previousInvoiceNetOc;
					service.contractData.previousInvoiceAmount = readData.previousInvoiceAmount;
					service.contractData.previousInvoiceAmountOc = readData.previousInvoiceAmountOc;
					service.contractData.invCompanyCurrency = readData.invCompanyCurrency;
					service.contractData.invHeaderCurrency = readData.invHeaderCurrency;
					service.contractData.conCompanyCurrency = readData.conCompanyCurrency;
					service.contractData.conHeaderCurrency = readData.conHeaderCurrency;
					service.contractData.previousInvCompanyCurrency = readData.previousInvCompanyCurrency;
					service.contractData.previousInvHeaderCurrency = readData.previousInvHeaderCurrency;
				}

				usingContractChangedMessage.fire(service.contractData);

				_.forEach(readData.dtos, function (item) {
					readonlyProcessor.setAccountAssignmentFieldsReadOnly(item);
				});

				service.gridRefresh();

				return dataRead;
			};

			var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
			serviceContainer.data.onCreateSucceeded = function (created, data, creationData) {
				return onCreateSucceeded.call(serviceContainer.data, created, data, creationData).then(function () { // jshint ignore : line
					if (created.InvBreakdownPercent !== 0 || created.InvBreakdownAmount !== 0 || created.InvBreakdownAmountOc !== 0) {
						var totalInvBreakdownPercent = _.sumBy(creationData.CurrentDtos, function (item) {
							return item.InvBreakdownPercent;
						});
						var totalInvBreakdownAmount = _.sumBy(creationData.CurrentDtos, function (item) {
							return item.InvBreakdownAmount;
						});
						var totalInvBreakdownAmountOc = _.sumBy(creationData.CurrentDtos, function (item) {
							return item.InvBreakdownAmountOc;
						});
						service.fireInvoiceBreakdownPercentOrInvoiceBreakdownAmountChange(totalInvBreakdownPercent, totalInvBreakdownAmount, totalInvBreakdownAmountOc);
						validateInvBreakdownPercent();
					}
					if (created.BreakdownPercent !== 0 || created.BreakdownAmount !== 0 || created.BreakdownAmountOc !== 0) {
						var totalBreakdownPercent = _.sumBy(creationData.CurrentDtos, function (item) {
							return item.BreakdownPercent;
						});
						var totalBreakdownAmount = _.sumBy(creationData.CurrentDtos, function (item) {
							return item.BreakdownAmount;
						});
						var totalBreakdownAmountOc = _.sumBy(creationData.CurrentDtos, function (item) {
							return item.BreakdownAmountOc;
						});
						service.fireBreakdownPercentOrBreakdownAmountChange(totalBreakdownPercent, totalBreakdownAmount, totalBreakdownAmountOc);
						validateBreakdownPercent();
					}
					if (created.PreviousInvoiceAmount !== 0 || created.PreviousInvoiceAmountOc !== 0) {
						var totalAmount = _.sumBy(creationData.CurrentDtos, function (item) {
							return item.PreviousInvoiceAmount;
						});
						var totalAmountOc = _.sumBy(creationData.CurrentDtos, function (item) {
							return item.PreviousInvoiceAmountOc;
						});
						service.firePreviousInvoiceBreakdownPercentOrPreviousInvoiceBreakdownAmountChange(totalAmount, totalAmountOc);
					}
					readonlyProcessor.setAccountAssignmentFieldsReadOnly(created);
					service.gridRefresh();
				});
			};

			var onDeleteDone = serviceContainer.data.onDeleteDone;
			serviceContainer.data.onDeleteDone = function () {
				var deleteItem = arguments[0].entities[0];
				onDeleteDone.apply(serviceContainer.data, arguments);
				if (deleteItem && (deleteItem.InvBreakdownPercent !== 0 || deleteItem.InvBreakdownAmount !== 0 || deleteItem.InvBreakdownAmountOc !== 0)) {
					var totalInvBreakdownPercent = _.sumBy(serviceContainer.data.itemList, function (item) {
						return item.InvBreakdownPercent;
					});
					var totalInvBreakdownAmount = _.sumBy(serviceContainer.data.itemList, function (item) {
						return item.InvBreakdownAmount;
					});
					var totalInvBreakdownAmountOc = _.sumBy(serviceContainer.data.itemList, function (item) {
						return item.InvBreakdownAmountOc;
					});
					service.fireInvoiceBreakdownPercentOrInvoiceBreakdownAmountChange(totalInvBreakdownPercent, totalInvBreakdownAmount, totalInvBreakdownAmountOc);
					validateInvBreakdownPercent();
				}
				if (deleteItem && (deleteItem.BreakdownPercent !== 0 || deleteItem.BreakdownAmount !== 0 || deleteItem.BreakdownAmountOc !== 0)) {
					var totalBreakdownPercent = _.sumBy(serviceContainer.data.itemList, function (item) {
						return item.BreakdownPercent;
					});
					var totalBreakdownAmount = _.sumBy(serviceContainer.data.itemList, function (item) {
						return item.BreakdownAmount;
					});
					var totalBreakdownAmountOc = _.sumBy(serviceContainer.data.itemList, function (item) {
						return item.BreakdownAmountOc;
					});
					service.fireBreakdownPercentOrBreakdownAmountChange(totalBreakdownPercent, totalBreakdownAmount, totalBreakdownAmountOc);
					validateBreakdownPercent();
				}
				if (deleteItem && (deleteItem.PreviousInvoiceAmount !== 0 || deleteItem.PreviousInvoiceAmountOc !== 0)) {
					var totalAmount = _.sumBy(serviceContainer.data.itemList, function (item) {
						return item.PreviousInvoiceAmount;
					});
					var totalAmountOc = _.sumBy(serviceContainer.data.itemList, function (item) {
						return item.PreviousInvoiceAmountOc;
					});
					service.firePreviousInvoiceBreakdownPercentOrPreviousInvoiceBreakdownAmountChange(totalAmount, totalAmountOc);
				}
			};

			// contract change, tell controller to change title
			service.registerContractChangedMessage = function (fn) {
				usingContractChangedMessage.register(fn);
			};

			service.unRegisterContractChangedMessage = function (fn) {
				usingContractChangedMessage.unregister(fn);
			};

			// Breakdown Percent Or Breakdown Amount Change
			service.fireBreakdownPercentOrBreakdownAmountChange = function fireBreakdownPercentOrBreakdownAmountChange(totalBreakdownPercent, totalBreakdownAmount, totalBreakdownAmountOc) {
				service.contractData.conTotalPercent = totalBreakdownPercent;
				service.contractData.conTotalAmount = totalBreakdownAmount;
				service.contractData.conTotalAmountOc = totalBreakdownAmountOc;
				usingContractChangedMessage.fire(service.contractData);
			};

			// Invoice Breakdown Percent Or Invoice Breakdown Amount Change
			service.fireInvoiceBreakdownPercentOrInvoiceBreakdownAmountChange = function fireBreakdownPercentOrBreakdownAmountChange(totalInvoiceBreakdownPercent, totalInvoiceBreakdownAmount, totalInvoiceBreakdownAmountOc) {
				service.contractData.invoiceTotalPercent = totalInvoiceBreakdownPercent;
				service.contractData.invoiceTotalAmount = totalInvoiceBreakdownAmount;
				service.contractData.invoiceTotalAmountOc = totalInvoiceBreakdownAmountOc;
				usingContractChangedMessage.fire(service.contractData);
			};

			// Previous Invoice Breakdown Percent Or Previous Invoice Breakdown Amount Change
			service.firePreviousInvoiceBreakdownPercentOrPreviousInvoiceBreakdownAmountChange = function fireBreakdownPercentOrBreakdownAmountChange(totalPreviousInvoiceBreakdownAmount, totalPreviousInvoiceBreakdownAmountOc) {
				service.contractData.previousInvoiceAmount = totalPreviousInvoiceBreakdownAmount;
				service.contractData.previousInvoiceAmountOc = totalPreviousInvoiceBreakdownAmountOc;
				usingContractChangedMessage.fire(service.contractData);
			};

			service.fireContractChanged = function fireContractChanged() {
				usingContractChangedMessage.fire(service.contractData);
			};

			// filters register and un-register, it will call by the contract-module.js
			service.registerFilters = function () {
				filterService.registerFilters();
				onFilterLoaded.fire(moduleName);
			};

			// unload filters
			service.unRegisterFilters = function () {
				filterService.unRegisterFilters();
				onFilterUnLoaded.fire(moduleName);
			};

			sortId = function (a, b) {
				return a.ItemNO - b.ItemNO;
			};

			var validator = procurementInvoiceAccountAssignmentValidationService(service);

			service.checkBasAccAssignAccType = function checkBasAccAssignAccType() {
				validateBasAccAssignAccTypeFk();
			};

			function validateBasAccAssignAccTypeFk() {
				var dataSource = service.getList();
				if (dataSource.length > 0) {
					var conFunc = 'validateBasAccAssignAccTypeFk';
					validator[conFunc](dataSource[0], dataSource[0]['BasAccAssignAccTypeFk'], 'BasAccAssignAccTypeFk'); // jshint ignore : line
				} else {
					service.gridRefresh();
				}
			}

			function validateBreakdownPercent() {
				var dataSource = service.getList();
				if (dataSource.length > 0) {
					var conFunc = 'validateBreakdownPercent';
					validator[conFunc](dataSource[0], dataSource[0]['BreakdownPercent'], 'BreakdownPercent'); // jshint ignore : line
				} else {
					service.gridRefresh();
				}
			}

			function validateInvBreakdownPercent() {
				var dataSource = service.getList();
				if (dataSource.length > 0) {
					var invFunc = 'validateInvBreakdownPercent';
					validator[invFunc](dataSource[0], dataSource[0]['InvBreakdownPercent'], 'InvBreakdownPercent');// jshint ignore : line
				} else {
					service.gridRefresh();
				}
			}

			service.copyAccountAssignmentFromNewContract = function copyAccountAssignmentFromNewContract(invoiceId, conHeaderId) {
				var requestData = {
					invoiceId: invoiceId,
					contractId: conHeaderId
				};
				$http.post(globals.webApiBaseUrl + 'procurement/invoice/accountAssignment/copyAllAccountAssignmentFromContract', requestData)
					.then(function (response) {
						if (response.data) {
							var newAccountAssignments = [];
							_.forEach(response.data.dtos, function (item) {
								newAccountAssignments.push(item);
							});

							_.forEach(serviceContainer.data.itemList, function (item) {
								service.deleteItem(item);
							});

							if (newAccountAssignments.length > 0) {
								service.createAccountAssignments(newAccountAssignments);
								isNeedUpdateDelete = true;
							} else {
								service.gridRefresh();
							}

							service.contractData.conTotalAmount = response.data.conTotalAmount;
							service.contractData.conTotalAmountOc = response.data.conTotalAmountOc;
							service.contractData.conTotalNet = response.data.conTotalNet;
							service.contractData.conTotalNetOc = response.data.conTotalNetOc;
							service.contractData.conTotalPercent = response.data.conTotalPercent;
							service.contractData.invoiceTotalAmount = response.data.invoiceTotalAmount;
							service.contractData.invoiceTotalAmountOc = response.data.invoiceTotalAmountOc;
							service.contractData.invoiceTotalNet = response.data.invoiceTotalNet;
							service.contractData.invoiceTotalNetOc = response.data.invoiceTotalNetOc;
							service.contractData.invoiceTotalPercent = response.data.invoiceTotalPercent;
							service.contractData.previousInvoiceNet = response.data.previousInvoiceNet;
							service.contractData.previousInvoiceNetOc = response.data.previousInvoiceNetOc;
							service.contractData.previousInvoiceAmount = response.data.previousInvoiceAmount;
							service.contractData.previousInvoiceAmountOc = response.data.previousInvoiceAmountOc;
							service.contractData.invCompanyCurrency = response.data.invCompanyCurrency;
							service.contractData.invHeaderCurrency = response.data.invHeaderCurrency;
							service.contractData.conCompanyCurrency = response.data.conCompanyCurrency;
							service.contractData.conHeaderCurrency = response.data.conHeaderCurrency;
							service.contractData.previousInvCompanyCurrency = response.data.previousInvCompanyCurrency;
							service.contractData.previousInvHeaderCurrency = response.data.previousInvHeaderCurrency;
						}

					});
			};

			service.createAccountAssignments = function (items) {
				if (serviceContainer.data.onCreateSucceeded && angular.isArray(items)) {
					_.forEach(items, function (item) {
						var creationData = {CurrentDtos: {}};
						// creationData.CurrentDtos = service.getList();
						serviceContainer.data.handleCreateSucceededWithoutSelect(item, serviceContainer.data, service);
					});
				}
			};

			var onCompleteEntityCreated = function onCompleteEntityCreated(e, completeData) {
				DeepCopyData = completeData.AccountAssignments;
				isCreateByDeepCopy = true;
				service.contractData.conTotalAmount = completeData.conTotalAmount;
				service.contractData.conTotalAmountOc = completeData.conTotalAmountOc;
				service.contractData.conTotalNet = completeData.conTotalNet;
				service.contractData.conTotalNetOc = completeData.conTotalNetOc;
				service.contractData.conTotalPercent = completeData.conTotalPercent;
				service.contractData.invoiceTotalAmount = completeData.invoiceTotalAmount;
				service.contractData.invoiceTotalAmountOc = completeData.invoiceTotalAmountOc;
				service.contractData.invoiceTotalNet = completeData.invoiceTotalNet;
				service.contractData.invoiceTotalNetOc = completeData.invoiceTotalNetOc;
				service.contractData.invoiceTotalPercent = completeData.invoiceTotalPercent;
				service.contractData.previousInvoiceNet = completeData.previousInvoiceNet;
				service.contractData.previousInvoiceNetOc = completeData.previousInvoiceNetOc;
				service.contractData.previousInvoiceAmount = completeData.previousInvoiceAmount;
				service.contractData.previousInvoiceAmountOc = completeData.previousInvoiceAmountOc;
				service.contractData.invCompanyCurrency = completeData.invCompanyCurrency;
				service.contractData.invHeaderCurrency = completeData.invHeaderCurrency;
				service.contractData.conCompanyCurrency = completeData.conCompanyCurrency;
				service.contractData.conHeaderCurrency = completeData.conHeaderCurrency;
				service.contractData.previousInvCompanyCurrency = completeData.previousInvCompanyCurrency;
				service.contractData.previousInvHeaderCurrency = completeData.previousInvHeaderCurrency;
			};
			procurementInvoiceHeaderDataService.completeEntityCreateed.register(onCompleteEntityCreated);

			service.registerUpdateTools = function (fn) {
				updateTools.register(fn);
			};

			service.unRegisterUpdateTools = function (fn) {
				updateTools.unregister(fn);
			};

			service.updateTools = function (conHeaderId) {
				var invoiceHeaderService = moduleContext.getLeadingService();
				var invoiceHeader = invoiceHeaderService.getSelected();
				var isInvAccountChangeable = true;
				if (invoiceHeader) {
					if (conHeaderId) {
						$http.get(globals.webApiBaseUrl + 'procurement/contract/header/getitembyId?id=' + conHeaderId).then(function (response) {
							if (response && response.data) {
								isInvAccountChangeable = response.data.IsInvAccountChangeable;
								invoiceHeader.IsInvAccountChangeable = response.data.IsInvAccountChangeable;
							} else {
								isInvAccountChangeable = invoiceHeader.IsInvAccountChangeable;
							}
							updateTools.fire(isInvAccountChangeable, isNeedUpdateDelete);
						});
					} else {
						invoiceHeader.IsInvAccountChangeable = true;
						isInvAccountChangeable = invoiceHeader.IsInvAccountChangeable;
						updateTools.fire(isInvAccountChangeable, isNeedUpdateDelete);
					}
				} else {
					updateTools.fire(isInvAccountChangeable, isNeedUpdateDelete);
				}
				isNeedUpdateDelete = false;
			};

			return {
				service: service,
				contractData: service.contractData
			};

		}]);

	accountAssignmentModule.factory('procurementInvoiceAccountAssignmentGetDataService', ['procurementInvoiceAccountAssignmentDataService',
		function (procurementInvoiceAccountAssignmentDataService) {
			return procurementInvoiceAccountAssignmentDataService.service;
		}]);

	accountAssignmentModule.factory('procurementInvoiceAccountAssignmentGetValidationService', ['procurementInvoiceAccountAssignmentDataService',
		'procurementInvoiceAccountAssignmentValidationService',
		function (procurementInvoiceAccountAssignmentDataService,
			procurementInvoiceAccountAssignmentValidationService) {
			return procurementInvoiceAccountAssignmentValidationService(procurementInvoiceAccountAssignmentDataService.service);
		}]);

})(angular);