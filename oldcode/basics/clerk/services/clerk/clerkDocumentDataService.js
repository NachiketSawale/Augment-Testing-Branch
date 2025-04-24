/**
 * Created by pel on 3/21/2019.
 */

(function (angular) {
	/* global globals */

	'use strict';
	var modName = 'basics.clerk';
	var module = angular.module(modName);
	module.service('clerkDocumentDataService', ['basicsClerkMainService', 'platformDataServiceFactory', 'platformRuntimeDataService', 'basicsCommonServiceUploadExtension', 'basicsLookupdataLookupDescriptorService', '$q', '$http', 'ServiceDataProcessDatesExtension', 'platformRuntimeDataService',
		'PlatformMessenger', 'basicsCommonMandatoryProcessor', '_', 'clerkDocumentReadonlyProcessor',
		function (basicsClerkMainService, dataServiceFactory, runtimeDataService, basicsCommonServiceUploadExtension, basicsLookupdataLookupDescriptorService, $q, $http, ServiceDataProcessDatesExtension, platformRuntimeDataService, PlatformMessenger, mandatoryProcessor, _, readonlyProcessor) {

			var serviceOption = {
				flatLeafItem: {
					module: module,
					serviceName: 'clerkDocumentDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'clerk/document/',
						endRead: 'listbyparent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							let selectedParent = basicsClerkMainService.getSelected();
							readData.PKey1 = selectedParent.Id;
						}
					},
					dataProcessor: [
						new ServiceDataProcessDatesExtension(['DocumentDate']),
						// {processItem: processItem}
						readonlyProcessor
					],
					entityRole: {leaf: {itemName: 'ClerkDocuments', parentService: basicsClerkMainService}},
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
								let selectedParent = basicsClerkMainService.getSelected();
								creationData.PKey1 = selectedParent.Id;
							}
						}
					},
				}
			};
			var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
			var service = serviceContainer.service;
			var uploadOptions = {
				uploadServiceKey: 'clerk-document',
				uploadConfigs: {SectionType: 'clerk', createForUploadFileRoute: 'clerk/document/createforuploadfile'},
				canPreview: true
			};

			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
				typeName: 'Clerk2documentDto',
				moduleSubModule: 'Basics.Clerk',
				validationService: 'clerkDocumentValidationService',
				mustValidateFields: ['ClerkDocumentTypeFk']
			});

			basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);

			service.updateReadOnly = function updateReadOnly(entity) {
				runtimeDataService.readonly(entity, [{
					field: 'DocumentTypeFk',
					readonly: !!entity.FileArchiveDocFk
				}]);
			};

			/*
			function processItem(item) {
				var mainItem = basicsClerkMainService.getSelected();
				var readonlyStatus = basicsClerkMainService.getModuleState(mainItem);
				var fields = [];
				fields.push({field: 'DocumentTypeFk', readonly: readonlyStatus});
				fields.push({field: 'DfmDocumenttypeFk', readonly: readonlyStatus});
				fields.push({field: 'DocumentDate', readonly: readonlyStatus});
				fields.push({field: 'Description', readonly: readonlyStatus});

				platformRuntimeDataService.readonly(item, fields);
			}
			 */

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
				var mainItem = basicsClerkMainService.getSelected();
				if (mainItem) {
					var readonlyStatus = basicsClerkMainService.getModuleState(mainItem);
					if (readonlyStatus) {
						return false;
					}
				}
				return true;
			};

			service.canDelete = function () {
				var readonlyStatus;
				var mainItem = basicsClerkMainService.getSelected();
				if (mainItem) {
					readonlyStatus = basicsClerkMainService.getModuleState(mainItem);
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

