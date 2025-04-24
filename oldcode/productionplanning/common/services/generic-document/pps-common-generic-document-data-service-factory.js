(function (angular) {
	'use strict';
	/* global angular, globals, _ */

	var moduleName = 'productionplanning.common';
	var angModule = angular.module(moduleName);

	angModule.factory('ppsCommonGenericDocumentDataServiceFactory', DocumentDataServiceFactory);

	DocumentDataServiceFactory.$inject = [
		'$q', '$injector', '$http',
		'basicsCommonBaseDataServiceBasicExtension',
		'basicsLookupdataLookupDescriptorService',
		'platformDataServiceFactory',
		'PlatformMessenger',
		'ppsCommonGenericDocumentProcessor',
		'basicsCommonServiceUploadExtension',
		'documentsProjectDocumentFileUploadDataService'];

	function DocumentDataServiceFactory(
		$q, $injector, $http,
		basicsCommonBaseDataServiceBasicExtension,
		basicsLookupdataLookupDescriptorService,
		platformDataServiceFactory,
		PlatformMessenger,
		documentProcessor,
		serviceUploadExtension,
		documentsProjectDocumentFileUploadDataService) {

		var serviceFactory = {};
		var serviceCache = {};
		//moduleId is used to handle the special service.
		serviceFactory.createNewComplete = function createNewComplete(options) {
			const readonlyFromKeys = _.isNil(options.readonlyKeys) ? [] : [... options.readonlyKeys.split(',').values()];

			var uploadDone = new PlatformMessenger();
			var parentService = $injector.get(options.parentServiceName);
			var serviceOption = {
				flatNodeItem: {
					module: options.module,
					serviceName: options.serviceName,
					entityNameTranslationID: options.entityNameTranslationID,
					httpCRUD: {route: globals.webApiBaseUrl + options.url},
					dataProcessor: [documentProcessor],
					entityRole: {
						node: {
							itemName: 'GenericDocument',
							parentService: parentService,
							parentFilter: options.parentFilter,
							doesRequireLoadAlways: true
						}
					},
					actions: {
						create: 'flat',
						delete: true,
						canDeleteCallBackFunc: function () {
							let selected = service.getSelected();
							return !_.isNil(selected) && readonlyFromKeys.indexOf(selected.From) === -1;
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								// process dtos for supporting upload
								_.forEach(readData, function (dto) {
									dto.CanUpload = true;
								});

								return data.handleReadSucceeded(readData, data);
							},
							initCreationData: function (creationData) {
								creationData.Id = parentService.getSelected().Id;
							}
						}
					}
				}
			};

			if (options.dataProcessor) {
				if (typeof options.dataProcessor === 'string') {
					options.dataProcessor = $injector.get(options.dataProcessor);
				}
				
				if(_.isArray(options.dataProcessor)){
					serviceOption.flatNodeItem.dataProcessor = serviceOption.flatNodeItem.dataProcessor.concat(options.dataProcessor);
				} else {
					serviceOption.flatNodeItem.dataProcessor.push(options.dataProcessor);
				}
			}

			if (!options.createBtn) {
				serviceOption.flatNodeItem.actions.create = false;
			}
			if (!options.deleteBtn) {
				serviceOption.flatNodeItem.actions.delete = false;
			}

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			var service = serviceContainer.service;

			service.registerUploadDone = function (callback) {
				uploadDone.register(callback);
			};

			function uploadFilesCallBack(currItem, data) {
				// reset SectionType!!!
				if (_.isNil(currItem) || angular.isUndefined(currItem.Id)) {
					service.createItem().then((item) =>{
						updateLoadedDocument(item, data);
						item.Revision = 1;
						documentProcessor.processItem(item);
						uploadDone.fire(null, data);
					});
				}else{
					updateLoadedDocument(currItem, data);
					documentProcessor.processItem(currItem);
					uploadDone.fire(null, data);
				}
			}

			function updateLoadedDocument(item, data) {
				item.FileArchiveDocFk = data.FileArchiveDocId;
				var fileName = data.fileName;
				if (angular.isString(fileName) && fileName.length > 42) {
					item.FileName = fileName.substr(0, 42);
				} else {
					item.FileName = fileName;
				}
				item.Description = fileName;

				var documentType = documentsProjectDocumentFileUploadDataService.getDocumentType(data);
				if (documentType) {
					item.DocumentTypeFk = documentType.Id;
				}

				item.CanUpload = true;
				service.updateLoadedItem(item);
				service.markItemAsModified(item);
			}

			const uploadAndCreateItem = () => {
				var deferred = $q.defer();
				service.uploadFiles(null, {})
					.then(function (file) {
						file.isCreatingDocumentByFuncUploadAndCreateItem = true;
						return service.createItem().then(function (document) {
							let documentType = documentsProjectDocumentFileUploadDataService.getDocumentType(file);
							document.DocumentTypeFk = documentType.Id;
							serviceContainer.data.newEntityValidator.validate(document);

							document.FileArchiveDocFk = file.FileArchiveDocId;
							document.OriginFileName = file.fileName;
							deferred.resolve(document);
							uploadDone.fire(null, file);
						});
					});
				return deferred.promise;
			};

			const canPreview = () => {
				let currentItem = service.getSelected();
				return !_.isNil(currentItem) && currentItem.OriginFileName !== null && currentItem.FileArchiveDocFk !== null;
			};

			const canUploadFiles = () => {
				let currentItem = service.getSelected();
				return !_.isNil(currentItem) && readonlyFromKeys.indexOf(currentItem.From) === -1;
			};

			const updateDocumentFromLoadedRevision = (revisionItem) => {
				let selected = service.getSelected();

				selected.FileArchiveDocFk = revisionItem.FileArchiveDocFk;
				selected.FileName = revisionItem.FileName;
				selected.Description = revisionItem.Description;
				selected.DocumentTypeFk = revisionItem.DocumentTypeFk;
				selected.Revision = revisionItem.Revision;

				service.markItemAsModified(selected);
			};

			serviceUploadExtension.extendForStandard(serviceContainer, {
				uploadServiceKey: options.uploadServiceKey,
				// At the moment, we only upload ppsHeader document and project document for engTask or ppsHeader module.
				// Both ppsHeader document and project document use SectionType: 'DocumentsProject'.
				// If in the future, we want to support other type document, we should change codes for checking if need to SectionType before doing upload.
				uploadConfigs: {SectionType: 'DocumentsProject', appId: '1F45E2E0E33843B98DEB97DBD69FA218'},
				uploadFilesCallBack: uploadFilesCallBack,
				canUpload: true,
				canDownload: true,
				canPreview: true,
				previewExtension: 'PpsCommonDocumentPreviewServiceExtension'
			});

			basicsCommonBaseDataServiceBasicExtension.addBasics(serviceContainer);

			//Button "upload plus" set visible
			service.uploadCreateVisible = !!options.createBtn;
			service.updateLoadedDocument = updateLoadedDocument;
			service.uploadAndCreateItem = uploadAndCreateItem;
			service.canPreviewDocument = canPreview;
			service.canDownloadFiles = canPreview;
			service.canUploadFiles = canUploadFiles;

			service.updateDocumentFromLoadedRevision = updateDocumentFromLoadedRevision;

			return service;
		};

		serviceFactory.getOrCreateService = function getOrCreateService(options) {
			if (!serviceCache[options.serviceName]) {
				serviceCache[options.serviceName] = serviceFactory.createNewComplete(options);
			}
			return serviceCache[options.serviceName];
		};

		serviceFactory.getServiceByName = function getServiceByName(serviceName) {
			if (serviceCache[serviceName]) {
				return serviceCache[serviceName];
			}
			return null;
		};
		return serviceFactory;

	}
})(angular);