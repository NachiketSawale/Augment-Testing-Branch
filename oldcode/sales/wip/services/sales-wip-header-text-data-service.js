/**
 * $Id: sales-wip-header-text-data-service.js 68296 2023-01-13 14:16:02Z postic $
 * Copyright (c) RIB Software SE
 */



(function () {
	'use strict';
	var moduleName = 'sales.wip';
	var salesWipModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name salesWipHeaderTextDataService
	 * @function
	 *
	 * @description
	 * salesWipHeaderTextDataService is the Data Service for Header Plain Text Container
	 */
	salesWipModule.factory('salesWipHeaderTextDataService',
		['globals', '_', '$injector', '$q', '$http', 'platformModalService', 'salesWipService', 'platformDataServiceFactory', 'SalesCommonHeaderTextProcessor', 'salesCommonBlobsHelperService', 'basicsLookupdataLookupDescriptorService', 'basicsCommonTextFormatConstant', 'PlatformMessenger',
			'salesCommonDataHelperService',
			function (globals, _, $injector, $q, $http, platformModalService, salesWipService, platformDataServiceFactory, SalesCommonHeaderTextProcessor, salesCommonBlobsHelperService, basicsLookupdataLookupDescriptorService, basicsCommonTextFormatConstant, PlatformMessenger,
					  salesCommonDataHelperService) {

				basicsLookupdataLookupDescriptorService.loadData('Configuration2TextType');

				var salesWipHeaderTextServiceOption = {
					flatLeafItem: {
						module: salesWipModule,
						serviceName: 'salesWipHeaderTextDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'sales/wip/headertext/',
							initReadData: function initReadData(readData) {
								var wipHeader = salesWipService.getSelected();
								if (wipHeader) {
									var headerId = wipHeader.Id;
									var sourceModule = 'sales.wip';
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
									var wipHeader = salesWipService.getSelected();
									creationData.headerId = wipHeader.Id;
									creationData.configFk = wipHeader.ConfigurationFk || -1;
									creationData.sourceModule = 'sales.wip';
								}
							}
						},
						dataProcessor: [{ processItem: processItem, revertProcessItem: revertProcessItem }],
						entityRole: {
							leaf: { itemName: 'SalesHeaderblob', parentService: salesWipService }
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

				var serviceContainer = platformDataServiceFactory.createNewComplete(salesWipHeaderTextServiceOption);
				var service = serviceContainer.service;

				service.toggleCreateButton = function (enable) {
					serviceContainer.service.canCreate = function () {
						return enable;
					};
				};

				service.getContentByModuleTypeFkAsync = function (entity, value) {
					var selectedWip = salesWipService.getSelected();
					$http.get(globals.webApiBaseUrl + 'sales/wip/headertext/getcontentbytextmodule?basTextModuleTypeFk=' + value + '&salesHeaderFk=' + selectedWip.Id + '&configurationFk=' + selectedWip.ConfigurationFk).then(function (response) {
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
						$http.get(globals.webApiBaseUrl + 'sales/wip/headertext/wipHeaderTextEntity' + '?wipTexttypeFk=' + entity.PrcTexttypeFk + '&textMoudleFk=' + id + '&wipHeaderFk=' + entity.WipHeaderFk).then(function (response) {
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
					salesCommonDataHelperService.getTextModulesByTextModuleType(null, salesWipService, service);
				}
			}]);
})();
