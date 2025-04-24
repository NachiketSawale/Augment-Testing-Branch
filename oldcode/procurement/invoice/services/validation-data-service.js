(function (angular) {
	'use strict';
	var moduleName = 'procurement.invoice';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).constant('procurementInvoiceReconciliationReference', {
		general: 1,
		certificate: 2,
		invHeader: 4
	});

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementInvoiceValidationDataService',
		['$http', '$timeout', 'platformDataServiceFactory', 'procurementInvoiceHeaderDataService', 'platformModalService',
			'basicsCommonReadDataInterceptor',
			function ($http, $timeout, dataServiceFactory, parentService, platformModalService,readDataInterceptor) {
				var serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						// dataProcessor: [readonlyProcessor],
						serviceName: 'procurementInvoiceValidationDataService',
						httpRead: {
							route: globals.webApiBaseUrl + 'procurement/invoice/validation/',
							initReadData: function initReadData(readData) {
								readData.filter = '?mainItemId=' + parentService.getSelected().Id;
							}
						},
						httpCreate: {route: globals.webApiBaseUrl + 'procurement/invoice/other/'},
						actions: {
							delete: true, create: 'flat',
							canCreateCallBackFunc: function () {
								return false;
							},
							canDeleteCallBackFunc: function () {
								return false;
							}
						},
						entityRole: {
							leaf: {
								itemName: 'InvValidation',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						}
					}
				};

				var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;

				readDataInterceptor.init(service, serviceContainer.data);

				var self = this;
				self.validations = [];

				var jobList = [];
				service.isUpdateValidation = false; // jshint ignore : line
				service.updateValidation = function updateValidation(jobId) {
					if (service.isUpdateValidation) {
						$timeout(function () {
							$http.get(globals.webApiBaseUrl + 'procurement/invoice/transaction/getjobstate?jobId=' + jobId).then(function (res) {
								if (res && res.data > -1 && _.includes([0, 1, 2], res.data)) {
									updateValidation(jobId);
								} else {
									var index = _.indexOf(jobList, jobId);
									jobList.splice(index, 1);
								}
							});
						}, 1000 * 15);
					}
				};

				service.updateAll = function updateAll() {
					service.isUpdateValidation = true;
					if (jobList.length > 0) {
						angular.forEach(jobList, function (item) {
							(function (item) {
								service.updateValidation(item);
							})(item);
						});
					} else {
						$http.get(globals.webApiBaseUrl + 'procurement/invoice/transaction/getjobs').then(function (res) {
							if (res && res.data && res.data.length > 0) {
								jobList = jobList.concat(res.data);
								updateAll();
							}
						});
					}
				};

				service.addJob = function addJob(jobId) {
					jobList.push(jobId);
				};

				var dialogConfig = {
					dataItems: []
				};

				service.initDialogItems = function initDialogItems() {
					dialogConfig.dataItems.length = 0;
				};

				service.getItems = function getItems() {
					return dialogConfig.dataItems;
				};
				service.showDialog = function showDialog() {
					if (dialogConfig.dataItems.length > 0) {
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'procurement.invoice/partials/invoice-reconciliation-warn-dialog.html',
							headerTextKey: 'procurement.invoice.reconciliationDialogTitle',
							headerTemplateUrl: 'modaldialog/modaldialog-header-template.html',
							backdrop: false,
							width: '600px'
						});
					}
				};

				service.createValidations = function createValidations() {
					if (self.validations.length > 0) {
						var postData = _.filter(self.validations, {isPost: false});
						postData.map(function (d) {
							d.isPost = true;
							return d;
						});
						if (postData && postData.length) {
							$http.post(serviceContainer.data.httpReadRoute + 'createitems', postData
							).then(function (response) {
								self.validations.length = 0;
								if (serviceContainer.data.handleCreateSucceededWithoutSelect && response.data) {
									angular.forEach(response.data, function (newItem) {
										serviceContainer.data.handleCreateSucceededWithoutSelect(newItem, serviceContainer.data, {});
									});
								}
							});
						}
					}
				};
				service.checkValidation = function checkValidation(message, reference, messageFormat, parameter1, parameter2, parameter3, parentItemId) {
					var parentItem = parentService.getSelected();
					if (!parentItem) {
						return true;
					}
					var validation = {
						InvHeaderFk: parentItemId ? parentItemId : parentItem.Id,
						MessageseverityFk: 2,
						Reference: reference,
						MessageFormat: messageFormat,
						Parameter1: parameter1,
						Parameter2: parameter2,
						Parameter3: parameter3
					};
					var checkValidations = _.find(self.validations, {Message: message});
					if (angular.isString(message) || angular.isUndefined(message.Id)) {
						validation.Message = message;
					} else {
						validation.MainItemId = parentItem.Id;
						validation.Remark = message.DescriptionInfo.Translated;
						validation.InvoiceValue = message.InvoiceValue;
						validation.ContractValue = message.ContractValue;
						validation.ValueType = message.IsPercent ? 'Percentage' : 'Absolute';
						validation.Id = dialogConfig.dataItems.length + 1;
						dialogConfig.dataItems.push(validation);
						checkValidations = _.find(self.validations, {Parameter1: parameter1, Parameter2: parameter2, Parameter3: parameter3});
						if (!checkValidations) {
							checkValidations = _.find(service.getList(), {Parameter1: parameter1, Parameter2: parameter2, Parameter3: parameter3});
						}
					}
					var item = _.find(service.getList(), {
						Message: message
					});

					if (!item && !checkValidations) {
						validation.isPost = false;
						self.validations.push(validation);
					}
				};

				service.deleteItemByMessage = function deleteItemByMessage(message) {
					var deleteItem = _.find(service.getList(), {
						Message: message
					});
					serviceContainer.data.supportUpdateOnSelectionChanging = false;
					if (deleteItem) {
						service.deleteItem(deleteItem);
					} else {
						deleteItem = _.find(service.getList(), {
							MessageFormat: message
						});
						if (deleteItem) {
							service.deleteItem(deleteItem);
							self.validations = self.validations.filter(function (item) {
								return item.Message !== message;
							});
						}
					}
					serviceContainer.data.supportUpdateOnSelectionChanging = true;
				};

				function updateGridAfterParentUpdat() {
					serviceContainer.data.supportUpdateOnSelectionChanging = false;
					service.load().then(function (d) {
						serviceContainer.data.supportUpdateOnSelectionChanging = true;
					});
				}

				parentService.onUpdateSucceeded.register(updateGridAfterParentUpdat);

				let onCompleteEntityCreated = function onCompleteEntityCreated(e, completeData) {
					/** @namespace completeData.InvValidations */
					service.setCreatedItems(completeData.InvValidations || []);
				};

				parentService.completeEntityCreateed.register(onCompleteEntityCreated);


				return service;
			}]);
})(angular);