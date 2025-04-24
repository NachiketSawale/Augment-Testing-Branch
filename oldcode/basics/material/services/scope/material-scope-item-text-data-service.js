/**
 * Created by wui on 10/17/2018.
 */

(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialScopeItemTextDataService', [
		'$http',
		'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'basicsMaterialScopeDetailDataService',
		'basicsMaterialRecordService',
		'basicsCommonReadOnlyProcessor',
		function ($http,
			platformDataServiceFactory,
			basicsLookupdataLookupDescriptorService,
			basicsMaterialScopeDetailDataService,
			basicsMaterialRecordService,
			basicsCommonReadOnlyProcessor) {

			basicsLookupdataLookupDescriptorService.loadData('Configuration2TextType');

			// service configuration
			var serviceContainer,
				serviceOptions = {
					flatLeafItem: {
						serviceName: 'basicsMaterialScopeItemTextDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'basics/material/scope/detail/blob/'
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var parent = basicsMaterialScopeDetailDataService.getSelected();
									creationData.Id = parent.Id;
								}
							}
						},
						entityRole: {leaf: {itemName: 'MaterialScopeDtlBlob', parentService: basicsMaterialScopeDetailDataService}},
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

			serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			// read service from serviceContainer
			var service = serviceContainer.service;

			service.registerEntityCreated(hasText);
			service.registerEntityDeleted(hasText);

			function hasText() {
				var scopeDetail = basicsMaterialScopeDetailDataService.getSelected();
				var itemList = service.getList();
				var hasText = itemList.length > 0;

				if (scopeDetail.HasText !== hasText) {
					scopeDetail.HasText = hasText;
					basicsMaterialScopeDetailDataService.markItemAsModified(scopeDetail);
				}
			}

			var readonlyProcessorService = basicsCommonReadOnlyProcessor.createReadOnlyProcessor({
				uiStandardService: 'basicsMaterialItemTextUIStandardService',
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
		}
	]);

})(angular);