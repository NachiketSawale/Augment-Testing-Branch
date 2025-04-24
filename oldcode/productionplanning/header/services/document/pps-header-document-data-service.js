(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.header';
	var headerModule = angular.module(moduleName);

	headerModule.factory('ppsHeaderDocumentDataService', DocumentDataService);

	DocumentDataService.$inject = ['platformDataServiceFactory', 'productionplanningHeaderDataService',
		'ppsHeaderDocumentProcessor', 'basicsCommonServiceUploadExtension'];

	function DocumentDataService(platformDataServiceFactory, headerDataService,
								 documentProcessor, serviceUploadExtension) {
		var serviceOption = {
			flatNodeItem: {
				module: headerModule,
				serviceName: 'ppsHeaderDocumentDataService',
				entityNameTranslationID: 'productionplanning.header.entityDocument',
				httpCRUD: {route: globals.webApiBaseUrl + 'productionplanning/header/documents/'},
				dataProcessor: [documentProcessor],
				entityRole: {
					node: {
						itemName: 'Document',
						parentService: headerDataService,
						parentFilter: 'headerFk'
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
			uploadServiceKey: 'pps-header',
			canUpload: false,
			canCancelUpload: false,
			canDownload: true,
			canPreview: true
		});

		return serviceContainer.service;
	}
})(angular);