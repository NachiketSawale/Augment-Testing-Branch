/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.contract';
	var salesContractModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesContractHeaderFormattedTextDataService
	 * @function
	 *
	 * @description
	 * salesContractHeaderFormattedTextDataService is the data service for the Header Formatted Text Container
	 */
	salesContractModule.factory('salesContractHeaderFormattedTextDataService',
		['globals', '_', '$injector', '$q', '$http', 'platformModalService', 'salesContractService', 'platformDataServiceFactory', 'basicsCommonTextFormatConstant', 'PlatformMessenger',
			'salesCommonDataHelperService',
			function (globals, _, $injector, $q, $http, platformModalService, salesContractService, platformDataServiceFactory, basicsCommonTextFormatConstant, PlatformMessenger,
					  salesCommonDataHelperService) {

				var salesContractHeaderTextServiceOption = {
					flatLeafItem: {
						module: salesContractModule,
						serviceName: 'salesContractHeaderTextDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'sales/contract/headertext/',
							initReadData: function initReadData(readData) {
								var contractHeader = salesContractService.getSelected();
								var headerId = contractHeader.Id;
								var sourceModule = 'sales.contract';
								readData.filter = '?headerId=' + headerId + '&sourceModule=' + sourceModule;
							}
						},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									if (readData) {
										readData.Main = readData.Main || readData;
										return data.handleReadSucceeded(readData.Main, data);
									}
								},
								initCreationData: function initCreationData(creationData) {
									var contractHeader = salesContractService.getSelected();
									creationData.headerId = contractHeader.Id;
									creationData.configFk = contractHeader.ConfigurationFk || -1;
									creationData.sourceModule = 'sales.contract';
								}
							}
						},
						dataProcessor: [{processItem: processItem, revertProcessItem: revertProcessItem}],
						entityRole: {
							leaf: {itemName: 'SalesHeaderblob', parentService: salesContractService}
						}
					}
				};

				// Data Processor Functions
				function processItem(entity) {
					entity.keepOriginalContentString = true;
					entity.keepOriginalPlainText = true;
					entity.originalContent = entity.Content;
					entity.originalContentString = entity.ContentString;
					entity.originalPlainText = entity.PlainText;

					if (entity.TextFormatFk === basicsCommonTextFormatConstant.hyperlink) {
						entity.Content = null;
						entity.ContentString = null;
						entity.PlainText = null;
					}
				}

				function revertProcessItem(entity) {
					if (entity.keepOriginalContentString) {
						entity.ContentString = entity.originalContentString;
						entity.Content = entity.originalContent;
					}

					if (entity.keepOriginalPlainText) {
						entity.PlainText = entity.originalPlainText;
					}

					entity.keepOriginalContentString = true;
					entity.keepOriginalPlainText = true;
					entity.originalContent = entity.Content;
					entity.originalContentString = entity.ContentString;
					entity.originalPlainText = entity.PlainText;
				}

				var serviceContainer = platformDataServiceFactory.createNewComplete(salesContractHeaderTextServiceOption);
				var service = serviceContainer.service;

				service.toggleCreateButton = function(enable) {
					serviceContainer.service.canCreate = function () {
						return enable;
					};
				};

				service.getContentByModuleTypeFkAsync = function(entity, value) {
					var selectedContract = salesContractService.getSelected();
					$http.get(globals.webApiBaseUrl + 'sales/contract/headertext/getcontentbytextmodule?basTextModuleTypeFk=' + value + '&salesHeaderFk=' + selectedContract.Id + '&configurationFk=' + selectedContract.ConfigurationFk).then(function(response) {
						if (response.data) {
							entity.Content = response.data.Content;
							entity.ContentString = response.data.ContentString;
							entity.keepOriginalContentString = false;
						}
					});
				};

				service.setTextMoudleValue = function setTextMoudleValue(id) {
					var defer = $q.defer();
					var entity = service.getSelected();
					if (entity) {
						$http.get(globals.webApiBaseUrl + 'sales/contract/headertext/contractHeaderTextEntity' + '?contractTexttypeFk=' + entity.PrcTexttypeFk + '&textMoudleFk=' + id + '&ordHeaderFk=' + entity.OrdHeaderFk).then(function (response) {
							if (response) {
								defer.resolve({
									entity: entity,
									ContentString: response.data.ContentString,
									PlainText: response.data.PlainText
								});
								return;
							}
							defer.resolve(null);
						});
					} else {
						defer.resolve(null);
					}
					return defer.promise;
				};

				service.salesHeaderTextTypeChange = new PlatformMessenger();
				service.registerSelectionChanged(onSelectionChanged);

				return service;

				function onSelectionChanged() {
					salesCommonDataHelperService.getTextModulesByTextModuleType(null, salesContractService, service);
				}
			}]);
})();
