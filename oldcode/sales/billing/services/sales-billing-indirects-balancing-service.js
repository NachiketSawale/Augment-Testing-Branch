/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesBillingIndirectBalancingService
	 * @function
	 *
	 * @description
	 * salesBillingIndirectBalancingService service for Indirect Costs Balancing
	 */
	salesBillingModule.factory('salesBillingIndirectBalancingService',
		['globals', '$q', '$http', '$injector', '_', 'salesBillingService', 'platformDataServiceFactory',
			function (globals, $q, $http, $injector, _, salesBillingService, platformDataServiceFactory) {

				var currentConfig = {};

				var serviceOption = {
					flatLeafItem: {
						module: salesBillingModule,
						serviceName: 'salesBillingIndirectBalancingService',
						httpRead: {
							route: globals.webApiBaseUrl + 'sales/billing/',
							endRead: 'getindirectsconfigbybill'
						},
						httpUpdate: { route: globals.webApiBaseUrl + 'sales/billing/', endUpdate: 'update' },
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									return [readData];
								}
							}
						},
						entityRole: {
							node: {
								itemName: 'BilIndirectCostsBalancingConfig',
								parentService: salesBillingService,
								parentFilter: 'billHeaderId'
							}
						},
						actions: {
							canCreateCallBackFunc: function () {
							},
							canDeleteCallBackFunc: function () {
							}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;

				service.getSelected = function getSelected() {
					return service.getCurrentConfig();
				};

				service.getCurrentConfig = function getCurrentConfig() {
					return currentConfig;
				};

				service.setCurrentConfig = function setCurrentConfig(config) {
					currentConfig = config;
					if (_.isObject(currentConfig)) {
						currentConfig.OrdHeaderFk = _.get(currentConfig, 'ContractId');
						$injector.get('platformDataProcessExtensionHistoryCreator').processItem(currentConfig);
					}
				};

				service.showCreateConfigDialog = function showCreateConfigDialog() {
					var dataItem = {
						ConfigId: null
					};
					// init with default config (if available)
					$injector.get('basicsLookupdataSimpleLookupService').getDefault({
						lookupModuleQualifier: 'basics.customize.billindirectcostbalancingconfiguration',
						displayMember: 'Description',
						valueMember: 'Id'
					}).then(function (config) {
						if (_.isObject(config) && _.get(config, 'Id') > 0) {
							dataItem.ConfigId = config.Id;
						}
					});
					var modalDialogConfig = {
						title: $injector.get('$translate').instant('sales.billing.createIndirectCostsBalancingConfigTooltip'),
						dataItem: dataItem,
						formConfiguration: {
							fid: 'sales.billing.selectIndirectCostsBalancingConfigDialog',
							version: '0.1.0',
							showGrouping: false,
							groups: [{
								gid: 'baseGroup',
								attributes: ['configid']
							}],
							rows: [
								$injector.get('basicsLookupdataConfigGenerator').provideGenericLookupConfigForForm('basics.customize.billindirectcostbalancingconfiguration', 'Description', {
									gid: 'baseGroup',
									rid: 'configid',
									model: 'ConfigId',
									required: true,
									sortOrder: 1,
									label: 'Configuration', // TODO:
									// label$tr$: , // TODO:
								})
							]
						},
						dialogOptions: {
							disableOkButton: function disableOkButton() {
							}
						},
						handleOK: function handleOK(result) {
							var configId = _.get(result, 'data.ConfigId') || null;
							service.createIndirectCostsBalancingConfig(configId);
						},
						handleCancel: function handleCancel() {
						}
					};

					$injector.get('platformTranslateService').translateFormConfig(modalDialogConfig.formConfiguration);
					$injector.get('platformModalFormConfigService').showDialog(modalDialogConfig);
				};

				service.createIndirectCostsBalancingConfig = function createIndirectCostsBalancingConfig(configId) {
					var billHeaderId = _.get(salesBillingService.getSelected(), 'Id');
					if (billHeaderId > 0) {
						var request = {
							billHeaderId: billHeaderId,
							configId: configId
						};
						$http.post(globals.webApiBaseUrl + 'sales/billing/createindirectcostbalancingconfigifnotavailable', request)
							.then(function (/* response */) {
							});
					}
				};

				service.getIndirectCostsBalancingConfig = function getIndirectCostsBalancingConfig(configId) {
					if (configId > 0) {
						return $http.get(globals.webApiBaseUrl + 'sales/billing/getindirectsconfig?configId=' + configId);
					}
					return $q.when({data: null});
				};

				service.getIndirectCostsBalancingConfigByBill = function getIndirectCostsBalancingConfigByBill(billHeaderId) {
					billHeaderId = billHeaderId || _.get(salesBillingService.getSelected(), 'Id');
					if (billHeaderId > 0) {
						return $http.get(globals.webApiBaseUrl + 'sales/billing/getindirectsconfigbybill?billHeaderId=' + billHeaderId);
					}
					return $q.when({data: null});
				};

				service.updateIndirectCostsBalancingConfig = function updateIndirectCostsBalancingConfig() {
					var config = service.getCurrentConfig();
					if (_.isObject(config)) {
						return $http.post(globals.webApiBaseUrl + 'sales/billing/updateindirectsconfig', config);
					}
					return $q.when({data: null});
				};

				service.applyIndirectCostsBalancingConfig = function applyIndirectCostsBalancingConfig(billHeaderId) {
					service.updateIndirectCostsBalancingConfig().then(function (response) {
						var updatedConfig = response.data;
						currentConfig = updatedConfig;
						salesBillingService.updateAndExecute(function () {
							billHeaderId = billHeaderId || _.get(salesBillingService.getSelected(), 'Id');
							if (billHeaderId > 0) {
								$http.post(globals.webApiBaseUrl + 'sales/billing/applyindirectsconfig', billHeaderId)
									.then(function () {
										$injector.get('salesBillingBoqStructureService').refreshBoqData();
										$injector.get('platformDialogService').showInfoBox('sales.billing.indirectCostsBalancingConfigSuccessMessage');
									});
							}
						});
					});
				};
				service.updateDirectCostPerUnit = function updateDirectCostPerUnit(billHeaderId) {
					salesBillingService.updateAndExecute(function () {
						billHeaderId = billHeaderId || _.get(salesBillingService.getSelected(), 'Id');
						if (billHeaderId > 0) {
							$http.post(globals.webApiBaseUrl + 'sales/billing/updateindirectcostsperunit', billHeaderId)
								.then(function () {
									$injector.get('salesBillingBoqStructureService').refreshBoqData();
									$injector.get('platformDialogService').showInfoBox('sales.billing.updateDirectCostPerUnitSuccessMessage');
								});
						}
					});
				};

				// dialog for customizing (detail config)
				service.showIndirectCostsBalancingDetailConfigDialogForCustomize = function showIndirectCostsBalancingDetailConfigDialogForCustomize(configEntity) {
					// just for the config dialog in customizing we need the schema dto loaded
					$injector.get('platformSchemaService').getSchemas([{
						typeName: 'IndirectCostBalancingConfigDetailDto',
						moduleSubModule: 'Sales.Billing'
					}]).then(function () {
						var configDetailId = configEntity.IndirectCostBalancingConfigurationDetailFk;
						if (configDetailId > 0) {
							service.getIndirectCostsBalancingConfig(configDetailId).then(function (response) {
								var config = _.get(response, 'data');
								var dataItem = config;
								$injector.get('platformDataProcessExtensionHistoryCreator').processItem(dataItem);
								var modalDialogConfig = {
									title: $injector.get('$translate').instant('basics.customize.editIndirectCostDetails'),
									dataItem: dataItem,
									formConfiguration: $injector.get('salesBillingIndirectBalancingConfigurationService').getLayoutForCustomizing(),
									dialogOptions: {
										disableOkButton: function disableOkButton() {
										}
									},
									handleOK: function handleOK(result) {
										// TODO: save config on changes
										var updatedConfig = result.data;
										$http.post(globals.webApiBaseUrl + 'sales/billing/updateindirectsconfig', updatedConfig);
									},
									handleCancel: function handleCancel() {
									}
								};

								$injector.get('platformTranslateService').translateFormConfig(modalDialogConfig.formConfiguration);
								$injector.get('platformModalFormConfigService').showDialog(modalDialogConfig);
							});
						} else if (configDetailId === 0) {
							$injector.get('platformModalService').showMsgBox('basics.customize.editIndirectCostDetailsSavePrompt', 'cloud.common.informationDialogHeader', 'info');
						}
					});
				};
				service.resetServiceData = function resetServiceData() {
					serviceContainer.data.selectedItem = service.getSelected();
					serviceContainer.data.itemList = [service.getSelected()];
				};
				return service;

			}]);
})();