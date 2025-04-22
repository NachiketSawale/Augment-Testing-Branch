/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'sales.contract';

	angular.module(moduleName).factory('salesContractTotalsConfigurationService',

		['platformUIStandardConfigService', 'salesContractTranslationService',
			function (platformUIStandardConfigService, salesContractTranslationService) {
				function detailLayout() {
					return {
						fid: 'sales.contract.totalsDetailform',
						addValidationAutomatically: true,
						version: '0.1.0',
						groups: [
							{
								gid: 'basicData',
								attributes: ['amountnet', 'amountnetoc', 'amountgross', 'amountgrossoc']
							}
						],
						overloads: {
							amountnet: {readonly: true},
							amountnetoc: {readonly: true},
							amountgross: {readonly: true},
							amountgrossoc: {readonly: true}
						}
					};
				}

				var BaseService = platformUIStandardConfigService;

				var attributeDomains = {
					AmountNet: {'domain': 'money'},
					AmountNetOc: {'domain': 'money'},
					AmountGross: {'domain': 'money'},
					AmountGrossOc: {'domain': 'money'}
				};

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				return new BaseService(detailLayout(), attributeDomains, salesContractTranslationService);
			}
		]);

	angular.module(moduleName).factory('salesContractTotalsDataService',
		['_', 'platformDataServiceFactory', 'salesContractService',
			function (_, platformDataServiceFactory, salesContractService) {

				function loadData() {
					let selectedContracts = salesContractService.getSelectedEntities();
					return [{
						Id: 1,
						AmountNet: _.sumBy(selectedContracts, 'AmountNet'),
						AmountNetOc: _.sumBy(selectedContracts, 'AmountNetOc'),
						AmountGross: _.sumBy(selectedContracts, 'AmountGross'),
						AmountGrossOc: _.sumBy(selectedContracts, 'AmountGrossOc')
					}];
				}

				const serviceOption = {
					flatLeafItem: {
						module: angular.module(moduleName),
						serviceName: 'salesContractTotalsDataService',
						entityNameTranslationID: 'sales.contract.containerTitleTotals',
						httpRead: {
							useLocalResource: true,
							resourceFunction: loadData,
							resourceFunctionParameters: []
						},
						presenter: {list: {}},
						entityRole: {
							leaf: {
								itemName: 'Totals',
								parentService: salesContractService,
								doesRequireLoadAlways: false
							}
						}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				let service = serviceContainer.service;

				// no create and delete buttons
				delete service.createItem;
				delete service.deleteItem;

				return service;
			}]);
})(angular);