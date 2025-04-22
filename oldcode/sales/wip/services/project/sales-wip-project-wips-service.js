/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {
	'use strict';
	let moduleName = 'sales.wip';
	let salesWipModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesWipService
	 * @function
	 *
	 * @description
	 * salesWipProjectWipsService is the data service for project wips Header functionality.
	 */
	salesWipModule.factory('salesWipProjectWipsService', ['globals', '_', '$injector', '$http', '$state', '$translate', '$timeout', 'platformModalService', 'cloudDesktopSidebarService', 'platformDataServiceFactory', 'projectMainService', 'salesWipCreateWipDialogService', 'ServiceDataProcessDatesExtension',
		function (globals, _, $injector, $http, $state, $translate, $timeout, platformModalService, cloudDesktopSidebarService, platformDataServiceFactory, projectMainService, salesWipCreateWipDialogService, ServiceDataProcessDatesExtension) {

			// The instance of the main service - to be filled with functionality below
			let salesWipHeaderServiceOptions = {
				flatLeafItem: {
					module: salesWipModule,
					serviceName: 'salesWipService',
					httpCreate: {route: globals.webApiBaseUrl + 'sales/wip/'},
					httpRead: {route: globals.webApiBaseUrl + 'sales/wip/'},
					entityRole: {
						leaf: {
							itemName: 'WipHeader',
							moduleName: 'Sales Wip',
							parentService: projectMainService,
							parentFilter: 'projectId'
						}
					},
					entitySelection: {},
					dataProcessor: [new ServiceDataProcessDatesExtension(['DocumentDate', 'PerformedFrom', 'PerformedTo', 'DateEffective'])],
					presenter: {
						list: {}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(salesWipHeaderServiceOptions);

			// create a wip dialog
			serviceContainer.service.createItem = function createWip() {
				salesWipCreateWipDialogService.resetToDefault();
				let selectedProject = projectMainService.getSelected();
				salesWipCreateWipDialogService.init({
					ProjectFk: _.get(selectedProject, 'Id', null),
					CurrencyFk: _.get(selectedProject, 'CurrencyFk', null) // TODO: probably not used anymore => check
				});
				salesWipCreateWipDialogService.showDialog(function (creationData) {
					serviceContainer.data.doCallHTTPCreate(creationData, serviceContainer.data, serviceContainer.data.onCreateSucceeded);
				}, false, ['projectfk'] /* readonly rows */);
			};

			serviceContainer.service.createItemForQto = function createItemForQto(visibleAdditionRows, qtoHeaderSelected, purposeType) {

				initializeWIP(qtoHeaderSelected, purposeType);

				if (angular.isUndefined(visibleAdditionRows) || visibleAdditionRows === null || visibleAdditionRows === false) {
					salesWipCreateWipDialogService.showDialog(function (creationData) {
						createWip(creationData, qtoHeaderSelected ? qtoHeaderSelected.ClerkFk : 0, purposeType);
					}, true, ['projectfk'], ['performedFrom', 'performedTo', 'UpdateWith'] /* readonly rows */);
				} else {
					let readOnlyRows = [];
					readOnlyRows.push('projectfk');
					if (qtoHeaderSelected.OrdHeaderFk) {
						readOnlyRows.push('ordheaderfk');
					}
					let unvisibleRows = [];
					unvisibleRows.push('UpdateWith');
					salesWipCreateWipDialogService.showDialog(function (creationData) {
						createWip(creationData, qtoHeaderSelected ? qtoHeaderSelected.ClerkFk : 0, purposeType);
					}, true, readOnlyRows /* readonly rows */, unvisibleRows, purposeType);
				}
			};

			function createWip(creationData, selectedID, purposeType) {
				// var purposeType = creationData.PurposeType;
				let basicLookup = $injector.get('basicsLookupdataLookupDataService');
				basicLookup.getList('clerk').then(function (itemList) {
					let findedItem = _.find(itemList, function (item) {
						return item.Id === selectedID;
					});
					if (findedItem && findedItem.Code === null) {
						platformModalService.showErrorBox($translate.instant('sales.wip.createWIPFail'), $translate.instant('cloud.common.informationDialogHeader'));
						return;
					}

					$http.post(globals.webApiBaseUrl + 'qto/main/createwip/createWipOrBilling', creationData).then(function (response) {
						let data = response.data;
						data.ProjectFk = creationData.ProjectFk;
						let isCreate = data.IsCreate;

						if(response.data.timeStr && response.data.timeStr.m_StringValue){
							console.log(response.data.timeStr.m_StringValue);
						}

						if (isCreate) {
							$injector.get('qtoMainDetailService').load().then(function () {
								if (selectedID) {
									if (purposeType === 'wip') {
										stateGo(data.Wip, purposeType);
									} else if (purposeType === 'bill') {
										stateGo(data.Billing, purposeType);
									}

								} else {
									if (purposeType === 'wip') {
										serviceContainer.data.onCreateSucceeded(data.Wip, serviceContainer.data, creationData);
									} else if (purposeType === 'bill') {
										serviceContainer.data.onCreateSucceeded(data.Billing, serviceContainer.data, creationData);
									}
								}
							});
						} else {
							let strTitle = $translate.instant('sales.wip.createWIPFail');
							let strContent = $translate.instant('sales.wip.createWarning');
							platformModalService.showMsgBox(strContent, strTitle, 'info');
						}
					});
				});

			}

			let stateGo = function (data, purposeType) {
				let url = globals.defaultState + '.' + 'sales.wip'.replace('.', '');
				if (purposeType === 'bill') {
					url = globals.defaultState + '.' + 'sales.billing'.replace('.', '');
				}

				$state.go(url).then(function () {
					cloudDesktopSidebarService.filterSearchFromPKeys([data.Id], null, data.ProjectFk);
					if (purposeType === 'wip') {
						let salesWipService = $injector.get('salesWipService');
						salesWipService.setWipHeader(data);
						salesWipService.refresh().then(function () {
							$timeout(function () {
								salesWipService.gridRefresh();
								salesWipService.setSelected(data);
							}, 500);
						}
						);
					} else if (purposeType === 'bill') {
						let salesBillingService = $injector.get('salesBillingService');
						salesBillingService.setBilHeader(data);
						salesBillingService.refresh().then(function () {
							$timeout(function () {
								salesBillingService.gridRefresh();
								salesBillingService.setSelected(data);
							}, 500);
						}
						);
					}
				});
			};

			function setContractTypeFk(contractFk) {
				if (!contractFk) {
					return;
				}
				$http.get(globals.webApiBaseUrl + 'sales/contract/byid?id=' + contractFk).then(function (response) {
					if (response && response.data) {
						salesWipCreateWipDialogService.init({
							ContractTypeFk: response.data.ContractTypeFk,
							BusinessPartnerFk: response.data.BusinesspartnerFk,
							SubsidiaryFk: response.data.SubsidiaryFk,
							CustomerFk: response.data.CustomerFk
						});
					}
				});
			}

			function setContractTypeFkByProjectFk(projectFk) {
				if (!projectFk) {
					return;
				}

				$http.get(globals.webApiBaseUrl + 'project/main/byid?id=' + projectFk).then(function (response) {
					if (response && response.data) {
						salesWipCreateWipDialogService.init({
							ContractTypeFk: response.data.ContractTypeFk
						});
					}
				});
			}

			function initializeWIP(qtoHeaderSelected, purposeType) {
				salesWipCreateWipDialogService.setQtoHeaderId(qtoHeaderSelected.Id);
				salesWipCreateWipDialogService.setPurposeType(purposeType);
				salesWipCreateWipDialogService.resetToDefault();
				let selectedProject = projectMainService.getSelected();
				salesWipCreateWipDialogService.init({
					ProjectFk: _.get(selectedProject, 'Id', null),
					CurrencyFk: _.get(selectedProject, 'CurrencyFk', null),
					purposeType: purposeType
				});

				if (qtoHeaderSelected && qtoHeaderSelected.OrdHeaderFk) {
					setContractTypeFk(qtoHeaderSelected.OrdHeaderFk);
				}

				if (qtoHeaderSelected && !qtoHeaderSelected.OrdHeaderFk && qtoHeaderSelected.ProjectFk) {
					setContractTypeFkByProjectFk(qtoHeaderSelected.ProjectFk);
				}

				/* var qtoLines = $injector.get('qtoMainDetailService').getList();
				var filterQtoLines = _.filter(qtoLines, function (qtoLine) {
					return qtoLine.OrdHeaderFk > 0;
				});
				 var isOrdQuantityOnly = filterQtoLines.length > 0; */

				if (angular.isDefined(qtoHeaderSelected) && qtoHeaderSelected !== null) {
					salesWipCreateWipDialogService.init({
						PerformedFrom: _.get(qtoHeaderSelected, 'PerformedFrom', null),
						PerformedTo: _.get(qtoHeaderSelected, 'PerformedTo', null),
						QtoHeaderFk: _.get(qtoHeaderSelected, 'Id', null),
						ProjectFk: _.get(qtoHeaderSelected, 'ProjectFk', null),
						BoqHeaderFk: _.get(qtoHeaderSelected, 'BoqHeaderFk', null),// PrjBoqFk
						Description: _.get(qtoHeaderSelected, 'DescriptionInfo.Description', null),
						OrdHeaderFk: _.get(qtoHeaderSelected, 'OrdHeaderFk', null),
						IsOrdQuantityOnly: false, // default value is false
						HasOrdHeaderFk: qtoHeaderSelected.OrdHeaderFk > 0,
						IsForQto: true,
						purposeType: purposeType
					});
				}
			}

			return serviceContainer.service;

		}]);
})();
