/**
 * Created by chk on 1/29/2016.
 */
(function () {
	'use strict';
	/* global globals, _ */
	var moduleName = 'documents.project';

	/* jshint -W072 */
	angular.module(moduleName).factory('documentsProjectDocumentRevisionDataService',
		['$q','$http','platformDataServiceFactory', 'platformToolbarService','basicsCommonFileDownloadService',
			'platformModalService','$injector','basicsLookupdataLookupDescriptorService','platformPermissionService',
			'documentsProjectDocumentReadonlyProcessor','PlatformMessenger','basicsPermissionServiceFactory','basicsCommonServiceUploadExtension','documentsProjectFileActionProcessor','documentsProjectFileSizeProcessor',
			function ($q,$http,dataServiceFactory, platformToolbarService,basicsCommonFileDownloadService,
				platformModalService,$injector,basicsLookupdataLookupDescriptorService,platformPermissionService,
				documentsProjectDocumentReadonlyProcessor,PlatformMessenger,basicsPermissionServiceFactory,basicsCommonServiceUploadExtension, documentsProjectFileActionProcessor,documentsProjectFileSizeProcessor) {
				var serviceCache = {};
				var DocumentprojectName = 'documents.main';
				var isFromDocumentproject = false;
				var documentProjectPermissionService = basicsPermissionServiceFactory.getService('documentProjectPermissionDescriptor');
				function createNewComplete(options) {
					var service = {};
					var parentService = options.parentService;
					var serviceOptions = {
						flatLeafItem: {
							module: angular.module(moduleName),
							serviceName: 'documentsProjectDocumentRevisionDataService',
							httpCRUD: {
								route: globals.webApiBaseUrl + 'documentsproject/revision/final/'
							},
							dataProcessor: [documentsProjectFileActionProcessor,documentsProjectFileSizeProcessor],
							presenter: {
								list: {
									initCreationData: function initCreationData(creationData) {
										if(options.documentProjectEntity !== null && options.documentProjectEntity !== undefined){
											creationData.PKey1 = options.documentProjectEntity.Id;
										}
									}
								}
							},
							entityRole: {
								leaf: {
									itemName: 'DocumentRevision',
									parentService: parentService
								}
							}
						}
					};
					var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
					service =  serviceContainer.service;

					service.canUploadFileForSelectedPrjDocument = canUploadFileForSelectedPrjDocument;
					service.uploadSingleFile = uploadSingleFile;
					// service.uploadFiles = uploadFiles;
					service.canDownloadFiles = canDownloadFiles;
					service.downloadFiles = downloadFiles;
					service.canPreview = canPreview;
					service.getPreviewConfig = getPreviewConfig;
					service.lockOrUnlockUploadBtnAndGridFlag={lockOrUnlock:'lock'};
					service.canDelete = canDelete;
					service.onPreviewDocCreateHistory = new PlatformMessenger();
					service.onDownloadDocCreateHistory = new PlatformMessenger();
					service.filesHaveBeenUploaded = new PlatformMessenger();

					const originalOnDeleteDone = serviceContainer.data.onDeleteDone;
					serviceContainer.data.onDeleteDone = function (deleteParams) {
						if (deleteParams.entities && deleteParams.entities.length > 0) {
							const selectionModelService = $injector.get('modelWdeViewerSelectionService');
							selectionModelService.deleteModels = selectionModelService.deleteModels ?? [];
							_.forEach(deleteParams.entities, function (entity) {
								selectionModelService.deleteModels.push(entity.PreviewModelFk);
							});
						}
						return originalOnDeleteDone.apply(this, arguments);
					};

					var uploadOptions = {
						uploadFilesCallBack: uploadFilesCallBack,
						canPreview: canPreview,
						uploadServiceKey: options.fromModuleName +'-'+ 'documents-project-revision-file-upload',
						uploadConfigs: {action: 'UploadWithCompress', SectionType: 'DocumentsProject'}
					};
					service.uploadOptions = uploadOptions;
					basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);

					var historyService = _.filter(parentService.getChildServices(), function(s) {
						return s.getServiceName() === 'documentsProjectDocumentHistoryDataService';
					});
					if (historyService.length && historyService[0] && _.isFunction(historyService[0].createHistoryForPreviewAndDownloadInDocRevision)) {
						historyService[0].createHistoryForPreviewAndDownloadInDocRevision(service);
					}

					if (options.fromModuleName === DocumentprojectName) {
						isFromDocumentproject = true;
					}
					function uploadFilesCallBack(currItem, data) {
						var args = {
							currItem: currItem,
							data: data
						};
						service.filesHaveBeenUploaded.fire(null, args);
					}
					function canDelete() {
						if (isFromDocumentproject) {
							return false;
						}
						var selectedDocument= parentService.getSelected();
						// if the project document has not create right, then the revision can't be deleted
						if(selectedDocument && selectedDocument.PermissionObjectInfo && parentService.getServiceName() === 'documentsProjectDocumentDataService') {
							var hasDelete = documentProjectPermissionService.hasDelete('4eaa47c530984b87853c6f2e4e4fc67e');
							if (selectedDocument && selectedDocument.IsReadonly || !hasDelete || !selectedDocument.CanDeleteStatus) {
								return false;
							}
						}
						else
						{
							if(selectedDocument && (selectedDocument.IsReadonly  || !selectedDocument.CanDeleteStatus) || !platformPermissionService.hasDelete('4eaa47c530984b87853c6f2e4e4fc67e')){
								return false;
							}
						}
						//
						// if(selectedDocument && selectedDocument.IsReadonly  || !platformPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e')){
						// return false;
						// }
						var currentItem = service.getSelected();
						return !!currentItem;

					}

					function canUploadFileForSelectedPrjDocument() {
						if (isFromDocumentproject) {
							return false;
						}
						var selectedDocument= parentService.getSelected();
						if(selectedDocument){
							if(selectedDocument && selectedDocument.PermissionObjectInfo && parentService.getServiceName() === 'documentsProjectDocumentDataService') {
								var hasCreate = documentProjectPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e');
								if (selectedDocument && selectedDocument.IsReadonly || !hasCreate) {
									return false;
								}
							}
							else
							{
								if(selectedDocument && (selectedDocument.IsReadonly || !selectedDocument.CanWriteStatus)  || !platformPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e')){
									return false;
								}
							}
							// if(!selectedDocument.CanWriteStatus || !platformPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e')){
							// return false;
							// }
							var PrjDocumentStatusFk=selectedDocument.PrjDocumentStatusFk;
							var documentstatuss=basicsLookupdataLookupDescriptorService.getData('documentstatus');
							var documentstatus= _.find(documentstatuss,function(item){ return item.Id===PrjDocumentStatusFk;});
							if(documentstatus&&documentstatus.IsReadonly){
								return false;
							}
						}
						return (!!selectedDocument)&&service.lockOrUnlockUploadBtnAndGridFlag.lockOrUnlock==='unlock'&&platformPermissionService.hasCreate('684f4cdc782b495e9e4be8e4a303d693')&&!parentService.isReadOnly();
					}

					function canDownloadFiles() {
						var currentItem = service.getSelected();
						if (currentItem) {
							return $injector.get('basicsCommonDrawingPreviewDataService').checkDocumentCanPreview(service, currentItem, true) && platformPermissionService.hasRead('684f4cdc782b495e9e4be8e4a303d693');
						}
					}

					function canPreview() {
						var currentItem = service.getSelected();
						if (currentItem) {
							return $injector.get('basicsCommonDrawingPreviewDataService').checkDocumentCanPreview(service, currentItem) && platformPermissionService.hasRead('684f4cdc782b495e9e4be8e4a303d693');
						}
					}

					function getPreviewConfig(){
						var deffered = $q.defer();
						var currentItem = service.getSelected();
						var fileArchiveDocId = currentItem.FileArchiveDocFk;
						if(currentItem.ArchiveElementId){
							$http.get(globals.webApiBaseUrl + 'basics/common/document/previewdatengutfile?archiveElementId=' + currentItem.ArchiveElementId + '&fileName=' + currentItem.OriginFileName)
								.then(function (result) {
									var typeName = _.last(result.data.split('.'));
									deffered.resolve({
										src: result.data,
										typeName: typeName,
										title: currentItem.OriginFileName
									});
								});
						}
						else{
							$http.get(globals.webApiBaseUrl + 'basics/common/document/preview?fileArchiveDocId=' + fileArchiveDocId).then(function(result) {
								var typeName = _.last(result.data.split('.'));
								deffered.resolve({
									src : result.data,
									typeName: typeName,
									title:currentItem.OriginFileName
								});
							});
						}
						return deffered.promise;
					}
					/* function uploadFiles(scope) {
						var count = 0;
						var parent = parentService;
						while (!angular.isFunction(parent.update) && count < 10) {
							parent = parent.parentService();
							count++;
						}

						if (angular.isFunction(parent.update)) {
							parent.update().then(function () {
								upload(scope);
							});
						}
						else {
							upload(scope);
						}

						function upload() {
							var documentsProjectDocumentFileUploadDataService = $injector.get('documentsProjectDocumentFileUploadDataService');
							documentsProjectDocumentFileUploadDataService.gridFlag = '684F4CDC782B495E9E4BE8E4A303D693';
							platformModalService.showDialog({
								templateUrl: globals.appBaseUrl + moduleName + '/partials/file-handler-lookup.html',
								scope: scope,
								backdrop: false
							});
						}
					} */

					function uploadSingleFile(scope, option) {
						var count = 0;
						var parent = parentService;
						while (!angular.isFunction(parent.update) && count < 10) {
							parent = parent.parentService();
							count++;
						}

						if (angular.isFunction(parent.update)) {
							parent.update().then(function () {
								// upload(scope);
								var fileUploadDataService = $injector.get('documentsProjectDocumentFileUploadDataService');
								fileUploadDataService.gridFlag = '684F4CDC782B495E9E4BE8E4A303D693';
								var uploadService = service.getUploadService();
								let currItem = service.parentService().getSelected();
								const documentTypeItems = basicsLookupdataLookupDescriptorService.getData('DocumentType');
								let value = service.getExtension(documentTypeItems, currItem.DocumentTypeFk);
								uploadService.uploadFiles(currItem, value, option);
								// service.uploadFiles(null, null, 'revision');
							});
						}
						else {
							// upload(scope);
							var fileUploadDataService = $injector.get('documentsProjectDocumentFileUploadDataService');
							fileUploadDataService.gridFlag = '684F4CDC782B495E9E4BE8E4A303D693';
							var uploadService = service.getUploadService();
							let currItem = service.parentService().getSelected();
							const documentTypeItems = basicsLookupdataLookupDescriptorService.getData('DocumentType');
							let value = service.getExtension(documentTypeItems, currItem.DocumentTypeFk);
							uploadService.uploadFiles(currItem, value);
							// service.uploadFiles(null, null, 'revision');
						}
					}

					function downloadFiles() {
						const entities = service.getSelectedEntities();
						basicsCommonFileDownloadService.canDownload(service, entities);
					}

					service.getServiceContainer=function(){
						return serviceContainer;
					};

					return service;
				}

				function toolBarHandler(containerUUID) {
					var removeItems = ['create','createChild'];

					var toolItems = _.filter(platformToolbarService.getTools(containerUUID), function (item) {
						return item && item.type !=='overflow-btn' && removeItems.indexOf(item.id) === -1;
					});

					platformToolbarService.removeTools(containerUUID);
					return toolItems;
				}

				return {
					getService: function (serviceOptions) {
						var documentRevisionService=serviceCache[serviceOptions.moduleName];
						if ((!documentRevisionService)||(!!serviceOptions.documentProjectEntity)) {
							documentRevisionService=serviceCache[serviceOptions.moduleName] = createNewComplete(serviceOptions);
						}
						return documentRevisionService;
					},
					toolBarHandler: toolBarHandler
				};

			}]);
})();