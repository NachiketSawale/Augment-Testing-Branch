(function () {
	'use strict';
	var moduleName = 'productionplanning.report';
	var module = angular.module(moduleName);
	module.factory('productionplanningReportProductFilterDataService', ReportProductFilterDataService);
	ReportProductFilterDataService.$inject = ['platformDataServiceFactory', 'productionplanningReportContainerInformationService',
		'productionplanningProductDocumentDataProviderFactory'];
	function ReportProductFilterDataService(platformDataServiceFactory, reportContainerInformationService,
		productDocumentDataProviderFactory) {

		var productFilter = {
			activityId: null,
			ppsItemId: null,
			jobId: null,
			statusIds: null
		};

		var serviceOption = {
			flatRootItem: {
				module: module,
				serviceName: 'productionplanningReportProductFilterDataService',
				entityNameTranslationID: 'productionplanning.common.product.productTitle',
				httpRead: {
					route: globals.webApiBaseUrl + 'productionplanning/common/product/',
					endRead: 'getproductsbyfilter',
					usePostForRead: true,
					initReadData: function (readData) {
						readData.ActivityId = productFilter.activityId;
						readData.JobId = productFilter.jobId;
						readData.DrawingId = productFilter.drawingId;
						readData.BundleId = productFilter.bundleId;
						readData.StatusIds = productFilter.statusIds;
					}
				},
				presenter: {
					list: {

					}
				},
				entityRole: {
					root: {
						itemName: 'Products'
					}
				},
				actions: {
					create: false,
					delete: false
				},
				modification: false
			}
		};

		var container = platformDataServiceFactory.createNewComplete(serviceOption);

		container.service.filter = function (filters) {
			productFilter.activityId = filters[0];
			productFilter.jobId = filters[1];
			productFilter.drawingId = filters[2];
			productFilter.bundleId = filters[3];
			productFilter.statusIds = filters[4];

			container.service.read();
		};

		container.service.paste = function (source) {
			var reportProductContainerInfo = reportContainerInformationService.getContainerInfoByGuid('e584a2d7de02488590552a17db1bdd75');
			var report2ProductDataService = reportProductContainerInfo.dataServiceName;

			report2ProductDataService.handleAssignedProducts(source);
		};

		const documentDataProvider = productDocumentDataProviderFactory.create(container.service, true);
		_.extend(container.service, documentDataProvider);

		return container.service;
	}
})();