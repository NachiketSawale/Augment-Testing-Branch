/*
 Create by alm on 4/27/2017
 */
/* global , globals, _ */
(function (angular) {
	'use strict';
	var modName = 'defect.main';
	var module = angular.module(modName);
	module.service('defectDocumentDataService', ['defectMainHeaderDataService', 'platformDataServiceFactory', 'platformRuntimeDataService', 'basicsCommonServiceUploadExtension', 'basicsLookupdataLookupDescriptorService', '$q', '$http', 'ServiceDataProcessDatesExtension', 'platformRuntimeDataService',
		'PlatformMessenger', 'defectDocumentReadonlyProcessor',
		function (defectMainHeaderDataService, dataServiceFactory, runtimeDataService, basicsCommonServiceUploadExtension, basicsLookupdataLookupDescriptorService, $q, $http, ServiceDataProcessDatesExtension, platformRuntimeDataService,
			PlatformMessenger, readonlyProcessor) {


			var serviceOption = {
				flatLeafItem: {
					module: module,
					serviceName: 'defectDocumentDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'defect/document/',
						endRead: 'listbyparent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							let selectedParent = defectMainHeaderDataService.getSelected();
							readData.PKey1 = selectedParent.Id;
						}
					},
					dataProcessor: [
						new ServiceDataProcessDatesExtension(['DocumentDate']),
						readonlyProcessor
					],
					entityRole: {leaf: {itemName: 'DfmDocuments', parentService: defectMainHeaderDataService}},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData || {});
								let dataRead = serviceContainer.data.handleReadSucceeded(readData, data);
								angular.forEach(readData, function (item) {
									service.updateReadOnly(item);
								});
								return dataRead;
							},
							initCreationData: function initCreationData(creationData) {
								let selectedParent = defectMainHeaderDataService.getSelected();
								creationData.PKey1 = selectedParent.Id;
							}
						}
					},
				}
			};
			var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
			var service = serviceContainer.service;
			let uploadOptions = {
				uploadServiceKey: 'defect-main-document',
				uploadConfigs: {
					action: 'UploadWithCompress',
					SectionType: 'Defect', createForUploadFileRoute: 'defect/document/createforuploadfile',
				},
				canPreview: true
			};
			basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);

			service.updateReadOnly = function updateReadOnly(entity) {
				runtimeDataService.readonly(entity, [{
					field: 'DocumentTypeFk',
					readonly: !!entity.FileArchiveDocFk
				}]);
			};

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
				var mainItem = defectMainHeaderDataService.getSelected();
				if (mainItem) {
					var readonlyStatus = defectMainHeaderDataService.getModuleState(mainItem);
					if (readonlyStatus) {
						return false;
					}
				}
				return true;
			};

			service.canDelete = function () {
				var readonlyStatus;
				var mainItem = defectMainHeaderDataService.getSelected();
				if (mainItem) {
					readonlyStatus = defectMainHeaderDataService.getModuleState(mainItem);
					if (readonlyStatus) {
						return false;
					}
				}

				var selected = service.getSelected();
				readonlyStatus = !!selected;
				return readonlyStatus;

			};

			let canMultipleUploadFiles = service.canMultipleUploadFiles;
			service.canMultipleUploadFiles = function(){
				if (parentReadOnly()) {
					return false;
				}
				return canMultipleUploadFiles();
			};
			function parentReadOnly() {
				let mainItem = defectMainHeaderDataService.getSelected();
				if (mainItem) {
					let readonlyStatus = defectMainHeaderDataService.getModuleState(mainItem);
					return !!readonlyStatus;
				}
				return false;
			}
			service.registerListLoaded(function () {
				let isReadonly = parentReadOnly();
				let items = service.getList();
				if (items && items.length > 0 && service.setReadOnlyRow) {
					items.forEach(item => {
						platformRuntimeDataService.readonly(item, isReadonly);
					});
				}
			});
			return service;
		}]);

})(angular);
