/**
 * Created by anl on 1/29/2023.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular, globals, _ */
	let moduleName = 'productionplanning.common';
	let module = angular.module(moduleName);

	module.factory('ppsGenericDocumentRevisionDataServiceFactory', GenericDocumentRevisionDataServiceFactory);

	GenericDocumentRevisionDataServiceFactory.$inject = [
		'$q',
		'$injector',
		'PlatformMessenger',
		'platformDataServiceFactory',
		'platformDataServiceActionExtension',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonServiceUploadExtension',
		'basicsCommonFileUploadServiceFactory',
		'ppsCommonGenericDocumentDataServiceFactory',
		'ppsCommonGenericDocumentProcessor',
		'documentsProjectDocumentFileUploadDataService'];

	function GenericDocumentRevisionDataServiceFactory(
		$q,
		$injector,
		PlatformMessenger,
		platformDataServiceFactory,
		platformDataServiceActionExtension,
		basicsLookupdataLookupDescriptorService,
		basicsCommonServiceUploadExtension,
		uploadServiceFactory,
		genericDocumentDataServiceFactory,
		documentRevisionProcessor,
		documentsProjectDocumentFileUploadDataService) {

		let serviceFactroy = {};
		let serviceCache = {};

		serviceFactroy.createNewComplete = function (serviceOptions) {
			$injector.get(serviceOptions.parentServiceName); // try to build dataService at first
			let parentService = genericDocumentDataServiceFactory.getServiceByName(serviceOptions.parentServiceName);
			let uploadDone = new PlatformMessenger();
			let updateDocument = new PlatformMessenger();
			let serviceContainer;

			const registerUploadDone = (callback) => {
				uploadDone.register(callback);
			};

			const updateDocumentFn = (RevisionItem) => {
				parentService.updateDocumentFromLoadedRevision(RevisionItem);
			};

			updateDocument.register(updateDocumentFn);

			const uploadFiles = () => {
				let documentTypeId = parentService.getSelected().DocumentTypeFk;
				return uploadService.uploadFiles({},
					service.getExtension(basicsLookupdataLookupDescriptorService.getData('DocumentType'),
						documentTypeId));
			};

			const uploadFilesCallBack = (currentItem, data) => {
				createUploadRevision(currentItem, data, function () {
					uploadDone.fire(null, data);
				});
			};

			const canUploadFiles = () => {
				return parentService.canUploadFiles();
			};

			const canPreviewDocument = () => {
				let currentItem = service.getSelected();
				return !_.isNil(currentItem) && currentItem.OriginFileName !== null && currentItem.FileArchiveDocFk !== null;
			};

			const createUploadRevision = (currentItem, data, afterCreatedCallback) => {
				if (_.isNil(currentItem) || angular.isUndefined(currentItem.Id)) {
					service.createItem().then((newItem) => {
						newItem.FileArchiveDocFk = data.FileArchiveDocId;
						let fileName = data.fileName;
						if (angular.isString(fileName) && fileName.length > 250) {
							newItem.Description = fileName.substr(0, 250);
							newItem.OriginFileName = fileName;
						} else {
							newItem.OriginFileName = newItem.Description = fileName;
						}

						let documentType = documentsProjectDocumentFileUploadDataService.getDocumentType(data);
						if (documentType) {
							newItem.DocumentTypeFk = documentType.Id;
						}
						if (afterCreatedCallback) {
							afterCreatedCallback.call(this);
							updateDocument.fire(newItem);
						}
					});
				}
			};

			let serviceOption = {
				flatLeafItem: {
					module: serviceOptions.module,
					entityNameTranslationID: 'productionplanning.common.document.revision.entityRevision',
					serviceName: serviceOptions.parentServiceName + 'RevisionDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + serviceOptions.url,
						endRead: 'list',
						usePostForRead: true,
						initReadData: function (readData) {
							let selected = parentService.getSelected();
							readData.SourceId = selected.SourceId;
							readData.From = selected.From;
						}
					},
					dataProcessor: [documentRevisionProcessor],
					entityRole: {
						leaf: {
							itemName: 'DocumentRevision',
							parentService: parentService,
							doesRequireLoadAlways: true
						},
					},
					actions: {
						create: 'flat',
						delete: true,
						canDeleteCallBackFunc: canUploadFiles
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData);
								let result = readData.Main ? {
									FilterResult: readData.FilterResult,
									dtos: readData.Main || []
								} : readData;

								return serviceContainer.data.handleReadSucceeded(result, data);
							},
							initCreationData: function initCreationData(creationData) {
								let selected = parentService.getSelected();
								creationData.Id = selected.SourceId;
								let maxRevision = _.maxBy(service.getList(), 'Revision');
								creationData.PKey1 = maxRevision ? maxRevision.Revision + 1 : 1;
							}
						}
					}
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			/* jshint -W003 */
			let service = serviceContainer.service;
			serviceContainer.data.usesCache = false;

			let uploadOptions = {
				uploadServiceKey: serviceOptions.uploadServiceKey,
				uploadConfigs: {SectionType: 'DocumentsProject', appId: '1F45E2E0E33843B98DEB97DBD69FA218'},
				canUpload: true,
				canPreview: true,
				canDownload: true,
				uploadFilesCallBack: uploadFilesCallBack
			};
			let uploadService = uploadServiceFactory.createService(uploadOptions);

			basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);

			// Remove button "upload plus" set visible
			service.uploadCreateVisible = false;
			service.enableOnlineEdit = false;
			service.uploadFiles = uploadFiles;
			service.canUploadFiles = canUploadFiles;
			service.canDownloadFiles = canPreviewDocument;
			service.canPreviewDocument = canPreviewDocument;
			service.createUploadRevision = createUploadRevision;
			service.registerUploadDone = registerUploadDone;

			return service;
		};

		// get service or create service by module name
		serviceFactroy.getOrCreateService = (serviceOptions) => {
			let containerId = serviceOptions.containerId;
			if (!serviceCache[containerId]) {
				serviceCache[containerId] = serviceFactroy.createNewComplete(serviceOptions);
			}
			return serviceCache[containerId];
		};

		return serviceFactroy;
	}
})(angular);