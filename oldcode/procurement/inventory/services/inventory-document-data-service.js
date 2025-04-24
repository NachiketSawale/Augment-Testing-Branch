/**
 * Created by pel on 7/9/2019.
 */
// eslint-disable-next-line no-redeclare
/* global angular,globals,_ */
(function (angular) {
	'use strict';
	var modName = 'procurement.inventory';
	var module = angular.module(modName);
	module.service('inventoryDocumentDataService', ['procurementInventoryHeaderDataService', 'platformDataServiceFactory', 'basicsCommonServiceUploadExtension', 'basicsLookupdataLookupDescriptorService', '$q', '$http', 'ServiceDataProcessDatesExtension', 'platformRuntimeDataService',
		'PlatformMessenger',
		function (inventoryHeaderDataService, dataServiceFactory, basicsCommonServiceUploadExtension, basicsLookupdataLookupDescriptorService, $q, $http, ServiceDataProcessDatesExtension, platformRuntimeDataService,
			PlatformMessenger) {

			var serviceOption = {
				flatLeafItem: {
					module: module,
					serviceName: 'inventoryDocumentDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'procurement/inventory/header/document/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: initReadData,
					},
					presenter: {
						list: {
							initCreationData: initCreationData
						}
					},
					dataProcessor: [
						new ServiceDataProcessDatesExtension(['DocumentDate']),
						{processItem: processItem}
					],
					entityRole: {leaf: {itemName: 'InventoryDocuments', parentService: inventoryHeaderDataService}}
				}
			};
			var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
			var service = serviceContainer.service;
			var uploadOptions = {
				uploadServiceKey: 'inventory-header-document',
				uploadConfigs: {SectionType: 'Inventory', createForUploadFileRoute: 'procurement/inventory/header/document/createforuploadfile'},
				canPreview: true
			};
			basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);

			function initReadData(readData) {
				let header = inventoryHeaderDataService.getSelected();
				readData.PKey1 = header ? header.Id : null;
			}

			function initCreationData(creationData) {
				let header = inventoryHeaderDataService.getSelected();
				creationData.PKey1 = header.Id;
			}

			function processItem(item) {
				var readonlyStatus = false;
				var mainItem = inventoryHeaderDataService.getSelected();
				if (mainItem) {
					readonlyStatus = mainItem.IsPosted;
				}
				if (readonlyStatus) {
					var fields = [];
					fields.push({field: 'DocumentTypeFk', readonly: readonlyStatus});
					fields.push({field: 'DocumentDate', readonly: readonlyStatus});
					fields.push({field: 'FileArchiveDocFk', readonly: readonlyStatus});
					fields.push({field: 'Description', readonly: readonlyStatus});

					platformRuntimeDataService.readonly(item, fields);
				}
			}

			service.getPreviewConfig = function getPreviewConfig() {
				var deffered = $q.defer();
				var currentItem = service.getSelected();
				var fileArchiveDocId = currentItem.FileArchiveDocFk;
				if (fileArchiveDocId) {
					$http.get(globals.webApiBaseUrl + 'basics/common/document/preview?fileArchiveDocId=' + fileArchiveDocId).then(function (result) {
						deffered.resolve({
							src: result.data,
							documentType: currentItem.DocumentTypeFk,
							title: currentItem.OriginFileName
						});
					});
				}
				return deffered.promise;
			};

			service.canCreate = function () {
				var mainItem = inventoryHeaderDataService.getSelected();
				if (mainItem) {
					var readonlyStatus = mainItem.IsPosted;
					if (readonlyStatus) {
						return false;
					}
				}
				return true;
			};

			service.canDelete = function () {
				var readonlyStatus;
				var mainItem = inventoryHeaderDataService.getSelected();
				if (mainItem) {
					readonlyStatus = mainItem.IsPosted;
					if (readonlyStatus) {
						return false;
					}
				}

				var selected = service.getSelected();
				readonlyStatus = !!selected;
				return readonlyStatus;

			};

			return service;
		}]);

})(angular);

