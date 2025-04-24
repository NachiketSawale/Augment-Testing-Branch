(function (angular) {
	'use strict';
	/* global globals */
	var modName = 'basics.material';
	var module = angular.module(modName);
	module.service('basicsMaterialReferenceDataService', ['platformDataServiceFactory','basicsMaterialRecordService','basicsLookupdataLookupFilterService', 'basicsCommonReadOnlyProcessor',
		function (dataServiceFactory,basicsMaterialRecordService,basicsLookupdataLookupFilterService, basicsCommonReadOnlyProcessor) {

			var serviceOption = {
				flatLeafItem: {
					module: module,
					serviceName: 'defectQuestionDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/material/reference/'
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								return data.handleReadSucceeded(readData, data);
							}
						}
					},
					entityRole: { leaf: { itemName: 'MaterialReference', parentService: basicsMaterialRecordService } },
					dataProcessor: [{processItem: readonlyProcessItem}],
					actions: {
						delete: {},
						create: 'flat',
						canCreateCallBackFunc: function () {
							return !basicsMaterialRecordService.isReadonlyMaterial();
						},
						canDeleteCallBackFunc: function () {
							return !basicsMaterialRecordService.isReadonlyMaterial();
						}
					}
				}
			};
			var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
			var service=serviceContainer.service;


			var filters = [
				{
					key:'basics-material-reference-material-filter',
					serverSide: true,
					fn: function (currentItem,searchOptions) {
						var filter = {};
						searchOptions.Filter = filter;
						if (currentItem && currentItem.MdcMaterialCatalogFk) {
							filter.MaterialCatalogId = currentItem.MdcMaterialCatalogFk;
						}
						return filter;
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			var readonlyProcessorService = basicsCommonReadOnlyProcessor.createReadOnlyProcessor({
				uiStandardService: 'basicsMaterialReferenceUIStandardService',
				readOnlyFields: []
			});
			function readonlyProcessItem(item) {
				if (!item) {
					return;
				}
				if (basicsMaterialRecordService.isReadonlyMaterial()) {
					readonlyProcessorService.setRowReadonlyFromLayout(item, true);
				}
			}


			return service;
		}]);

})(angular);
