/**
 * $Id$
 * Copyright (c) RIB Software SE
 */



(function () {
	'use strict';
	var moduleName = 'sales.bid';
	var salesBidModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesBidHeaderTextDataService
	 * @function
	 *
	 * @description
	 * salesBidHeaderTextDataService is the Data Service for Header Plain Text Container
	 */
	salesBidModule.factory('salesBidHeaderTextDataService',
		['globals', '_', '$injector', '$q', '$http', 'platformModalService', 'salesBidService', 'platformDataServiceFactory', 'SalesCommonHeaderTextProcessor', 'salesCommonBlobsHelperService', 'basicsLookupdataLookupDescriptorService', 'basicsCommonTextFormatConstant', 'PlatformMessenger',
			'salesCommonDataHelperService',
			function (globals, _, $injector, $q, $http, platformModalService, salesBidService, platformDataServiceFactory, SalesCommonHeaderTextProcessor, salesCommonBlobsHelperService, basicsLookupdataLookupDescriptorService, basicsCommonTextFormatConstant, PlatformMessenger,
					  salesCommonDataHelperService) {

				basicsLookupdataLookupDescriptorService.loadData('Configuration2TextType');

				var salesBidHeaderTextServiceOption = {
					flatLeafItem: {
						module: salesBidModule,
						serviceName: 'salesBidHeaderTextDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'sales/bid/headertext/',
							initReadData: function initReadData(readData) {
								var bidHeader = salesBidService.getSelected();
								if (bidHeader) {
									var headerId = bidHeader.Id;
									var sourceModule = 'sales.bid';
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
									var bidHeader = salesBidService.getSelected();
									creationData.headerId = bidHeader.Id;
									creationData.configFk = bidHeader.ConfigurationFk || -1;
									creationData.sourceModule = 'sales.bid';
								}
							}
						},
						dataProcessor: [{processItem: processItem, revertProcessItem: revertProcessItem}],
						entityRole: {
							leaf: {itemName: 'SalesHeaderblob', parentService: salesBidService}
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

				var serviceContainer = platformDataServiceFactory.createNewComplete(salesBidHeaderTextServiceOption);
				var service = serviceContainer.service;

				service.toggleCreateButton = function(enable) {
					serviceContainer.service.canCreate = function () {
						return enable;
					};
				};

				service.getContentByModuleTypeFkAsync = function(entity, value) {
					var selectedBid = salesBidService.getSelected();
					$http.get(globals.webApiBaseUrl + 'sales/bid/headertext/getcontentbytextmodule?basTextModuleTypeFk=' + value + '&salesHeaderFk=' + selectedBid.Id + '&configurationFk=' + selectedBid.ConfigurationFk).then(function(response) {
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
						$http.get(globals.webApiBaseUrl + 'sales/bid/headertext/bidHeaderTextEntity' + '?bidTexttypeFk=' + entity.PrcTexttypeFk + '&textMoudleFk=' + id + '&bidHeaderFk=' + entity.BidHeaderFk).then(function (response) {
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
					salesCommonDataHelperService.getTextModulesByTextModuleType(null, salesBidService, service);
				}
			}]);
})();
