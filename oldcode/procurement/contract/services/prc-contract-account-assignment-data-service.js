/**
 * Created by jhe on 8/8/2018.
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,Platform */
	var moduleName = 'procurement.contract';
	var accountAssignmentModule = angular.module(moduleName);
	accountAssignmentModule.factory('procurementContractAccountAssignmentDataService', ['globals', 'procurementContractHeaderDataService',
		'platformDataServiceFactory', 'platformRuntimeDataService', '_', 'procurementContractAccountAssignmentFilterService',
		'procurementContractAccountAssignmentValidationService', 'ServiceDataProcessDatesExtension','procurementContextService',

		function (globals, procurementContractHeaderDataService,
			platformDataServiceFactory, runtimeDataService, _, filterService,
			procurementContractAccountAssignmentValidationService, ServiceDataProcessDatesExtension,moduleContext) {

			var usingContractChangedMessage = new Platform.Messenger();
			var onFilterLoaded = new Platform.Messenger();
			var onFilterUnLoaded = new Platform.Messenger();
			var createButtonStatusChangeMessage = new Platform.Messenger();
			var sortId;
			var service;
			var factoryOptions = {
				flatLeafItem: {
					module: accountAssignmentModule,
					serviceName: 'procurementContractAccountAssignmentGetDataService',
					entityNameTranslationID: 'procurement.contract.entityAccountAssignment',
					httpCreate: {
						route: globals.webApiBaseUrl + 'procurement/contract/accountAssignment/'
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/contract/accountAssignment/',
						initReadData: function initReadData(readData) {
							var selectedItem = procurementContractHeaderDataService.getSelected();
							if (selectedItem && selectedItem.Id > 0) {
								readData.filter = '?contractId=' + selectedItem.Id;
							}
						}
					},
					actions: {delete: true, create: 'flat'},
					sidebarWatchList: {active: true},
					entityRole: {
						leaf: {
							itemName: 'ConAccountAssignmentDto',
							parentService: procurementContractHeaderDataService
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								// ConHeaderFk
								var selectedItem = procurementContractHeaderDataService.getSelected();
								if (selectedItem && selectedItem.Id > 0) {
									creationData.ConHeaderFk = selectedItem.Id;
									creationData.CurrentDtos = service.getList();
									if (creationData.CurrentDtos.length === 0) {
										creationData.ItemNO = 1;
									} else {
										creationData.CurrentDtos.sort(sortId);
										creationData.ItemNO = creationData.CurrentDtos[creationData.CurrentDtos.length - 1].ItemNO + 1;
									}
									createButtonStatusChangeMessage.fire(false);
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
				currentContractTotalNet: 0,
				totalPercent: 0,
				totalAmount: 0,
				currentContractTotalNetOc: 0,
				totalAmountOc: 0,
				conCurrency: '',
				conCurrencyOc: ''
			};

			service.updateFieldsReadOnly = function updateFieldsReadOnly(entity) {
				var readOnly = !service.getCellEditable(entity, 'PsdActivityFk');
				runtimeDataService.readonly(entity, [{field: 'PsdActivityFk', readonly: readOnly}]);
				runtimeDataService.readonly(entity, [{field: 'Version', readonly: true}]);
			};

			service.getCellEditable = function (item, model) {
				var editable = true;
				if (angular.isDefined(item)) {
					// check filed editable
					if (model === 'PsdActivityFk') {
						editable = item.PsdScheduleFk;
					}
				}
				return editable;
			};

			var onReadSucceeded = serviceContainer.data.onReadSucceeded;
			serviceContainer.data.onReadSucceeded = function incorporateDataRead(readData, data) {
				angular.forEach(readData.dtos, function (item) {
					service.updateFieldsReadOnly(item);
				});
				var dataRead = onReadSucceeded({
					dtos: readData.dtos,
					FilterResult: readData.FilterResult
				},
				data);

				service.goToFirst();

				service.contractData.currentContractTotalNet = readData.conTotalNet;
				service.contractData.currentContractTotalNetOc = readData.conTotalNetOc;
				service.contractData.totalPercent = readData.conTotalPercent;
				service.contractData.totalAmount = readData.conTotalAmount;
				service.contractData.totalAmountOc = readData.conTotalAmountOc;
				service.contractData.conCurrency = readData.conCompanyCurrency;
				service.contractData.conCurrencyOc = readData.conHeaderCurrency;

				usingContractChangedMessage.fire(service.contractData);

				return dataRead;
			};

			var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
			serviceContainer.data.onCreateSucceeded = function (created, data, creationData) {
				return onCreateSucceeded.call(serviceContainer.data, created, data, creationData).then(function () {
					if (created.BreakdownPercent !== 0 || created.BreakdownAmount !== 0) {
						var totalBreakdownPercent = _.sumBy(creationData.CurrentDtos, function (item) {
							return item.BreakdownPercent;
						});
						var totalBreakdownAmount = _.sumBy(creationData.CurrentDtos, function (item) {
							return item.BreakdownAmount;
						});
						service.fireBreakdownPercentOrBreakdownAmountChange(totalBreakdownPercent, totalBreakdownAmount);
						validate();
					}
					createButtonStatusChangeMessage.fire(true);
				});
			};

			var onDeleteDone = serviceContainer.data.onDeleteDone;
			serviceContainer.data.onDeleteDone = function () {
				var deleteItem = arguments[0].entities[0];
				onDeleteDone.apply(serviceContainer.data, arguments);
				if (deleteItem && (deleteItem.BreakdownPercent !== 0 || deleteItem.BreakdownAmount !== 0)) {
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
					validate();
				}
			};

			service.registerSelectionChanged(function SelectionChanged() {
				var currentItem = service.getSelected();
				if (currentItem && currentItem.Id) {
					service.updateFieldsReadOnly(currentItem);
				}
			});

			// contract change, tell controller to change title
			service.registerContractChangedMessage = function (fn) {
				usingContractChangedMessage.register(fn);
			};

			service.unRegisterContractChangedMessage = function (fn) {
				usingContractChangedMessage.unregister(fn);
			};

			// Breakdown Percent Or Breakdown Amount Change
			service.fireBreakdownPercentOrBreakdownAmountChange = function fireBreakdownPercentOrBreakdownAmountChange(totalBreakdownPercent, totalBreakdownAmount, totalBreakdownAmountOc) {
				service.contractData.totalPercent = totalBreakdownPercent;
				service.contractData.totalAmount = totalBreakdownAmount;
				service.contractData.totalAmountOc = totalBreakdownAmountOc;
				usingContractChangedMessage.fire(service.contractData);
			};

			service.fireContractChanged = function fireContractChanged() {
				usingContractChangedMessage.fire(service.contractData);
			};

			var onUpdateDone;
			// Contract Total Net Change
			service.registerParentUpdateDone = function () {
				procurementContractHeaderDataService.registerUpdateDone(onUpdateDone);
			};

			onUpdateDone = function () {
				service.load();
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

			var validator = procurementContractAccountAssignmentValidationService(service);

			function validate() {
				var dataSource = service.getList();
				if (dataSource.length > 0) {
					var func = 'validateBreakdownPercent';
					validator[func](dataSource[0], dataSource[0]['BreakdownPercent'], 'BreakdownPercent');// jshint ignore:line
					validator['validateBasAccAssignAccTypeFk'](dataSource[0], dataSource[0]['BasAccAssignAccTypeFk'], 'BasAccAssignAccTypeFk');// jshint ignore:line
				} else {
					service.gridRefresh();
				}
			}

			service.registerCreateButtonStatusChange = function (fn) {
				createButtonStatusChangeMessage.register(fn);
			};

			service.unRegisterCreateButtonStatusChange = function (fn) {
				createButtonStatusChangeMessage.unregister(fn);
			};

			return {
				service: service,
				contractData: service.contractData
			};

		}]);

	accountAssignmentModule.factory('procurementContractAccountAssignmentGetDataService', ['procurementContractAccountAssignmentDataService',
		function (procurementContractAccountAssignmentDataService) {
			return procurementContractAccountAssignmentDataService.service;
		}]);

	accountAssignmentModule.factory('procurementContractAccountAssignmentGetValidationService', ['procurementContractAccountAssignmentDataService',
		'procurementContractAccountAssignmentValidationService',
		function (procurementContractAccountAssignmentDataService,
			procurementContractAccountAssignmentValidationService) {
			return procurementContractAccountAssignmentValidationService(procurementContractAccountAssignmentDataService.service);
		}]);

})(angular);
