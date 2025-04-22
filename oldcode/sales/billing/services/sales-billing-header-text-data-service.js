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
	 * @name salesBillingHeaderTextDataService
	 * @function
	 *
	 * @description
	 * salesBillingHeaderTextDataService is the Data Service for Header Plain Text Container
	 */
	salesBillingModule.factory('salesBillingHeaderTextDataService',
		['globals', '_', '$injector', '$q', '$http', 'platformModalService', 'salesBillingService', 'platformDataServiceFactory', 'SalesCommonHeaderTextProcessor', 'salesCommonBlobsHelperService', 'basicsLookupdataLookupDescriptorService', 'basicsCommonTextFormatConstant', 'PlatformMessenger',
			'salesCommonDataHelperService',
			function (globals, _, $injector, $q, $http, platformModalService, salesBillingService, platformDataServiceFactory, SalesCommonHeaderTextProcessor, salesCommonBlobsHelperService, basicsLookupdataLookupDescriptorService, basicsCommonTextFormatConstant, PlatformMessenger,
					  salesCommonDataHelperService) {

				basicsLookupdataLookupDescriptorService.loadData('Configuration2TextType');

				var salesBillingHeaderTextServiceOption = {
					flatLeafItem: {
						module: salesBillingModule,
						serviceName: 'salesBillingHeaderTextDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'sales/billing/headertext/',
							initReadData: function initReadData(readData) {
								var bilHeader = salesBillingService.getSelected();
								if (bilHeader) {
									var headerId = bilHeader.Id;
									var sourceModule = 'sales.billing';
									readData.filter = '?headerId=' + headerId + '&sourceModule=' + sourceModule;
								}
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
									var bilHeader = salesBillingService.getSelected();
									creationData.headerId = bilHeader.Id;
									creationData.configFk = bilHeader.ConfigurationFk || -1;
									creationData.sourceModule = 'sales.billing';
								}
							}
						},
						dataProcessor: [{processItem: processItem, revertProcessItem: revertProcessItem}],
						entityRole: {
							leaf: {itemName: 'SalesHeaderblob', parentService: salesBillingService}
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

				var serviceContainer = platformDataServiceFactory.createNewComplete(salesBillingHeaderTextServiceOption);
				var service = serviceContainer.service;

				service.toggleCreateButton = function(enable) {
					serviceContainer.service.canCreate = function () {
						return enable;
					};
				};

				service.getContentByModuleTypeFkAsync = function(entity, value) {
					var selectedBill = salesBillingService.getSelected();
					$http.get(globals.webApiBaseUrl + 'sales/billing/headertext/getcontentbytextmodule?basTextModuleTypeFk=' + value + '&salesHeaderFk=' + selectedBill.Id + '&configurationFk=' + selectedBill.ConfigurationFk).then(function(response) {
						if (response.data) {
							entity.PlainText = response.data.PlainText;
							entity.keepOriginalPlainText = false;
						}
					});
				};

				service.setTextMoudleValue = function setTextMoudleValue(id) {
					var defer = $q.defer();
					var entity = service.getSelected();
					if (entity) {
						$http.get(globals.webApiBaseUrl + 'sales/billing/headertext/bilHeaderTextEntity' + '?bilTexttypeFk=' + entity.PrcTexttypeFk + '&textMoudleFk=' + id + '&bilHeaderFk=' + entity.BilHeaderFk).then(function (response) {
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
					salesCommonDataHelperService.getTextModulesByTextModuleType(null, salesBillingService, service);
				}
			}]);
})();
