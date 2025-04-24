(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';
	var itemModule = angular.module(moduleName);

	itemModule.factory('ppsItemDocumentDataService', DocumentDataService);

	DocumentDataService.$inject = ['platformDataServiceFactory', 'productionplanningItemDataService',
		'ppsItemDocumentProcessor', 'basicsCommonServiceUploadExtension'];

	function DocumentDataService(platformDataServiceFactory, itemDataService,
								 documentProcessor, serviceUploadExtension) {
		var serviceOption = {
			flatNodeItem: {
				module: itemModule,
				serviceName: 'ppsItemDocumentDataService',
				entityNameTranslationID: 'productionplanning.item.entityDocument',
				httpCRUD: {route: globals.webApiBaseUrl + 'productionplanning/item/documents/'},
				dataProcessor: [documentProcessor],
				entityRole: {
					node: {
						itemName: 'Document',
						parentService: itemDataService,
						parentFilter: 'itemFk'
					}
				},
				actions: {
					create: {},
					delete: false
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

		serviceUploadExtension.extendForStandard(serviceContainer, {
			uploadServiceKey: 'pps-item',
			canUpload: false,
			canCancelUpload: false,
			canDownload: true,
			canPreview: true
		});

		return serviceContainer.service;
	}
})(angular);