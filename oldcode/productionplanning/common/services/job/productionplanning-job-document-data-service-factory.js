(function (angular) {
	'use strict';
	var module = 'productionplanning.common';

	angular.module(module).factory('productionPlanningJobDocumentDataServiceFactory', ProductionPlanningJobDocumentDataServiceFactory);
	ProductionPlanningJobDocumentDataServiceFactory.$inject = ['$q', 'platformDataServiceFactory',
		'platformPermissionService', 'basicsCommonFileDownloadService'];

	function ProductionPlanningJobDocumentDataServiceFactory($q, platformDataServiceFactory,
	                                                        platformPermissionService, fileDownloadService) {
		var service = {};

		service.createService = function (dataService, field) {
			var options = {
				flatLeafItem: {
					module: angular.module(module),
					serviceName: 'transportPlanningJobDocumentDataService',
					entityNameTranslationID: 'documents.project.title.headerTitle',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'documents/projectdocument/final/',
						initReadData: initDocumentReadData
					},
					entityRole: {
						leaf: { itemName:'ProjectDocument', parentService: dataService }
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(options);

			serviceContainer.service.canDownloadFiles = function () {
				var currentItem = serviceContainer.service.getSelected();
				if (currentItem) {
					return (!!currentItem.OriginFileName && 1000 !== currentItem.DocumentTypeFk) &&
						platformPermissionService.hasRead('a78a23e2b050418cb19df541ab9bf028');
				}
				return false;
			};

			serviceContainer.service.downloadFiles = function () {
				var selectedDocumentDtos = serviceContainer.service.getSelectedEntities();
				if (selectedDocumentDtos.length >= 2) {
					var docIdArray = _.map(selectedDocumentDtos, function (item) {
						return item.FileArchiveDocFk;
					});
					fileDownloadService.download(docIdArray);
				} else {
					fileDownloadService.download(selectedDocumentDtos[0].FileArchiveDocFk);
				}
			};

			serviceContainer.service.canPreview = function () {
				var currentItem = serviceContainer.service.getSelected();
				if (currentItem) {

					return (!!currentItem.OriginFileName ||
						1000 === currentItem.DocumentTypeFk ||
						null !== currentItem.Url && currentItem.Url.length > 0) &&
						platformPermissionService.hasRead('a78a23e2b050418cb19df541ab9bf028');
				}
				return false;
			};

			function fieldChanged(entity, changedField) {
				if (changedField === field) {
					var readData = {filter: ''};
					initDocumentReadData(readData);
					var defer = $q.defer();
					serviceContainer.data.doCallHTTPRead(readData, serviceContainer.data, function (items) {
						defer.resolve(items);
						serviceContainer.data.itemList = items || [];
						serviceContainer.data.listLoaded.fire();
					});
				}
			}

			function initDocumentReadData(readData) {
				var selectedItem = dataService.getSelected();
				if (selectedItem && selectedItem[field]) {
					readData.filter = '?filter=LgmJobFk=' + selectedItem[field];
				} else {
					readData.filter = '?filter=LgmJobFk=-1';
				}
			}

			if (dataService.fieldChanged) {
				dataService.fieldChanged.register(fieldChanged);
			}

			return serviceContainer.service;
		};

		return service;
	}
})(angular);
