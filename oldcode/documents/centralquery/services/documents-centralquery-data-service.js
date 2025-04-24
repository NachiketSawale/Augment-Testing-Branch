/**
 * Created by pel on 1/10/2020.
 */
(function (angular) {
	'use strict';
	/* global , globals,_ */
	var moduleName = 'documents.centralquery';
	/**
	 * @ngdoc service
	 * @name documentCentralQueryDataService
	 * @function
	 * @requireds documentCentralQueryDataService
	 *
	 * @description Provide document central query header data service
	 */

	angular.module(moduleName).factory('documentCentralQueryDataService',
		['$translate','platformDataServiceFactory','$injector', 'platformContextService',
			'$q','cloudDesktopPinningContextService','documentsProjectDocumentReadonlyProcessor','ServiceDataProcessDatesExtension',
			'basicsCommonMandatoryProcessor','documentProjectDocumentFilterService','moment','platformPermissionService',
			'platformModalService','basicsLookupdataLookupDescriptorService','basicsCommonFileDownloadService','PlatformMessenger',
			'basicsLookupdataLookupFilterService','$http','cxService','projectDocumentNumberGenerationSettingsService','platformRuntimeDataService',
			'basicsCommonServiceUploadExtension','documentsProjectFileActionProcessor','documentsProjectDocumentModuleContext','documentsProjectDocumentDataService',
			'platformDataServiceSelectionExtension','platformDataServiceActionExtension','cloudDesktopSidebarService','documentsProjectFileSizeProcessor','platformModuleStateService',
			'basicsLookupdataLookupDataService','platformDataValidationService','platformDataServiceConfiguredCreateExtension','documentsProjectDocumentFileUploadDataService','$rootScope',
			function ($translate,dataServiceFactory,$injector, platformContextService, $q, cloudDesktopPinningContextService,
				documentsProjectDocumentReadonlyProcessor,DatesProcessor,mandatoryProcessor,documentProjectDocumentFilterService,
				moment,platformPermissionService,platformModalService,basicsLookupdataLookupDescriptorService,
				basicsCommonFileDownloadService,PlatformMessenger,basicsLookupdataLookupFilterService,$http,cxService,
				projectDocumentNumberGenerationSettingsService,platformRuntimeDataService,basicsCommonServiceUploadExtension,documentsProjectFileActionProcessor,
				documentsProjectDocumentModuleContext,documentsProjectDocumentDataService,platformDataServiceSelectionExtension,
				platformDataServiceActionExtension,cloudDesktopSidebarService,documentsProjectFileSizeProcessor,platformModuleStateService,
				basicsLookupdataLookupDataService,platformDataValidationService,platformDataServiceConfiguredCreateExtension,fileUploadDataService,$rootScope) {

				var service = {},serviceContainer = null;
				// var onReadSucceeded;
				// set filter parameter for this module
				var sidebarSearchOptions = {
					moduleName: moduleName,  // required for filter initialization
					enhancedSearchEnabled: true,
					pattern: '',
					pageSize: 100,
					useCurrentClient: true,
					showOptions: true,
					showProjectContext: false,
					pinningOptions: {
						isActive: true,
						showPinningContext: [{token: 'project.main', show: true}],
						setContextCallback: setCurrentPinningContext
					},
					withExecutionHints: false,
					enhancedSearchVersion: '2.0',
					includeDateSearch:true
				};

				let initialDialogService = $injector.get('documentCentralQueryCreationInitialDialogService');
				var serviceOptions = {
					flatRootItem: {
						module: angular.module(moduleName),
						serviceName: 'documentCentralQueryDataService',
						entityNameTranslationID: 'documents.centralquery.documentscentralquery',
						entityInformation: { module: 'Documents.CentralQuery', entity: 'Document', specialTreatmentService: initialDialogService},
						httpCRUD: {
							route: globals.webApiBaseUrl + 'documents/centralquery/',
							endRead: 'listDocuments',
							endDelete: 'deleteComplete',
							usePostForRead: true,
							endCreate:'createbycontext'
						},
						dataProcessor: [documentsProjectDocumentReadonlyProcessor,documentsProjectFileSizeProcessor,
							documentsProjectFileActionProcessor,
							new DatesProcessor(['DocumentDate', 'ExpirationDate']),
							{
								processItem: processDocument,
								revertProcessItem: revertProcessDocument
							}
						],
						actions: {
							delete: true,
							create: 'flat',
							canCreateCallBackFunc: function () {
								return true;
							},
							canDeleteCallBackFunc: function () {
								var currentItem = service.getSelected();
								if(currentItem && (currentItem.IsReadonly || (!currentItem.CanDeleteStatus && currentItem.Version !== 0))){
									return false;
								}
								return true;
							}
						},
						entityRole: {
							root: {
								rootForModule: moduleName,
								itemName: 'Document',
								moduleName: 'cloud.desktop.moduleDisplayNameDocumentCentral',
								addToLastObject: true,
								lastObjectModuleName: moduleName,
								handleUpdateDone: function (updateData, response) {
									serviceContainer.data.handleOnUpdateSucceeded(updateData, response, serviceContainer.data, true);
									service.onUpdateSucceeded.fire({updateData: updateData, response: response});
								}
							}
						},
						sidebarSearch: {options: sidebarSearchOptions},
						sidebarWatchList: {active: true},
						entitySelection: {supportsMultiSelection: true},
						presenter: {
							list: {
								handleCreateSucceeded: handleCreateSucceeded,
								initCreationData: (creationData)=>{
									creationData.referEntity = service.getSelected() ?? null;
									var checkSameContextDialogService = $injector.get('documentProjectDocumentUploadCheckSameContextDialogService');
									var contextDialogDto = {};
									checkSameContextDialogService.getGroupingFilterFieldKey(contextDialogDto);
									if(!_.isEmpty(contextDialogDto)) {
										let ParentEntityInfo = {};
										var ColumnConfig = [];
										for (var dtoItem in contextDialogDto) {
											ParentEntityInfo[checkSameContextDialogService.convertDataField(dtoItem)] = contextDialogDto[dtoItem];
											ColumnConfig.push({
												DocumentField: dtoItem,
												DataField: checkSameContextDialogService.convertDataField(dtoItem),
												ReadOnly: false
											});
										}
										creationData.ParentEntityInfo = ParentEntityInfo;
										creationData.ColumnConfig = ColumnConfig;
									}
								},
							}
						},
						sidebarInquiry: {
							options: {
								active: true,
								moduleName: moduleName
							}

						},
						filterByViewer: true
					}
				};

				serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
				serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
					typeName: 'DocumentDto',
					moduleSubModule: 'Documents.Project',
					validationService: 'documentProjectHeaderValidationService',
					mustValidateFields: ['DocumentTypeFk']
				});

				documentProjectDocumentFilterService.registerFilters();

				service = serviceContainer.service;

				var uploadOptions = {
					uploadFilesCallBack: uploadFilesCallBack,
					canPreview: canPreview,
					uploadServiceKey: moduleName +'-'+ 'documents-project-file-upload',
					uploadConfigs: {action: 'UploadWithCompress', SectionType: 'DocumentsProject'}
				};
				basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);
				function handleCreateSucceeded(newData) {
					if(_.isEmpty(service.uploadCreateItem)) {
						newData.DocumentDate = moment.utc(Date.now());
						if(platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(serviceContainer.data)){
							newData.IsFromDialog = true;
						}
						projectDocumentNumberGenerationSettingsService.assertLoaded().then(function () {
							platformRuntimeDataService.readonly(newData, [{
								field: 'Code',
								readonly: projectDocumentNumberGenerationSettingsService.hasToGenerateForRubricCategory(newData.RubricCategoryFk)
							}]);
							newData.Code = projectDocumentNumberGenerationSettingsService.provideNumberDefaultText(newData.RubricCategoryFk, newData.Code);
							var currentItem = service.getSelected();
							service.fireItemModified(currentItem);
						});
						if (_.isNil(newData.PrjProjectFk)) {
							var pinProjectId = getPinningProjectId();
							if (pinProjectId !== -1) {
								newData.PrjProjectFk = pinProjectId;
							}
						}
						return newData;
					}else{
						service.uploadCreateItem.forEach(e => {
							serviceContainer.data.itemList.push(e);
						});
						service.markEntitiesAsModified(serviceContainer.data.itemList);
						serviceContainer.data.doUpdate(serviceContainer.data).then((res) => {
							if (res && res.Document) {
								let readData = {
									dtos: res.Document,
									FilterResult: null
								};
								if(!service.updateRows) {
									serviceContainer.data.onReadSucceeded(readData, serviceContainer.data);
								}else{
									if (service.updateVerItems.length > 0) {
										updateVersion(service.updateVerItems);
									}else{
										const uniqueRows = service.updateRows.filter((item, index, self) =>
											index === self.findIndex((t) => t.Id === item.Id)
										);
										service.setSelectedEntities(uniqueRows);
										service.refreshSelectedEntities();
										service.deselect();
										service.resetUploadData();
									}
								}

							}
						}).finally(() => {
							var parentState = platformModuleStateService.state(service.getModule());
							if (parentState && parentState.modifications) {
								parentState.modifications.EntitiesCount = 0;
							}
							service.isConfigurationDialog = true;
							service.uploadCreateItem = {};
						});
						return [];
					}
				}

				service.handleCreateSucceeded = handleCreateSucceeded;

				service.uploadMsgDialogId = $injector.get('platformCreateUuid')();
				var checkSameContextDialogService = $injector.get('documentProjectDocumentUploadCheckSameContextDialogService');
				serviceContainer.data.onCreateSucceeded = function onCreateSucceeded(newData, data) {
					if(platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(serviceContainer.data)){
						service.dataConfigData = newData;
						service.IsFromDataConfig = true;
					}
					const deffered = $q.defer();
					if(Reflect.ownKeys(service.uploadedFileData).length === 0){
						deffered.resolve(createFunction(newData, data));
					}else {
						let contextDialogDto = {};
						let paramData = {};
						let checkSameContextDialogService = $injector.get('documentProjectDocumentUploadCheckSameContextDialogService');
						checkSameContextDialogService.getGroupingFilterFieldKey(contextDialogDto);
						if(!_.isEmpty(contextDialogDto)) {
							let ParentEntityInfo = {};
							var ColumnConfig = [];
							for (var dtoItem in contextDialogDto) {
								ParentEntityInfo[checkSameContextDialogService.convertDataField(dtoItem)] = contextDialogDto[dtoItem];
								ColumnConfig.push({
									DocumentField: dtoItem,
									DataField: checkSameContextDialogService.convertDataField(dtoItem),
									ReadOnly: false
								});
							}
							let pinProjectEntity = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
							if(pinProjectEntity) {
								ColumnConfig.push({
									DocumentField: 'ProjectFk',
									DataField: 'ProjectFk',
									ReadOnly: false
								});
							}
							paramData.ParentEntityInfo = ParentEntityInfo;
							paramData.ColumnConfig = ColumnConfig;
						}
						fileUploadDataService.asyncCreateDocumentOrUpdateRevision(service.uploadedFileData, service.extractZipOrNot,newData,paramData.ParentEntityInfo,paramData.ColumnConfig,service.IsFromDataConfig).then(function (res) {
							if (!!res && !!res.data && !!res.data.dtos) {
								const resData = res.data.dtos;

								const docItemList = service.getList();
								let refreshItem = [];
								_.forEach(resData, function (docDto) {
									const docItem = docItemList.find(e => e.Id === docDto.Id);
									if (!docItem) {
										serviceContainer.data.itemList.push(docDto);
										serviceContainer.data.selectedItem = docDto;
									}
									refreshItem.push(docDto);
								});

								service.setSelectedEntities(refreshItem);
								service.refreshSelectedEntities().then(function () {
									service.gridRefresh();
									if(resData.length === 1) {
										service.setSelected(resData[0]);
									}
								});
								service.resetUploadData();
								service.filesClear.fire();
							}
						}, function () {
							service.filesClear.fire();
						});
					}

					return deffered.promise;
				};

				function createFunction(newData, data) {
					var newItem;
					if (checkSameContextDialogService.hasGroupingFilterFieldKey) {
						checkSameContextDialogService.hasGroupingFilterFieldKey = false;
					}
					if (service.handleCreateSucceeded) {
						newItem = service.handleCreateSucceeded(newData, data);// In case more data is send back from server it can be stripped down to the new item here.
						if (!newItem) {// Fall back, if no value is returned by handleCreateSucceeded
							newItem = newData;
						}
					} else {
						newItem = newData;
					}
					if (data.addEntityToCache) {
						data.addEntityToCache(newItem, data);
					}
					if (service.isConfigurationDialog === true) {
						service.isConfigurationDialog = false;
					} else {
						return data.handleOnCreateSucceeded(newItem, data);
					}
					return {};
				}

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

				serviceContainer.data.updateOnSelectionChanging = function updateOnSelectionChanging(data) {
					if (data.doUpdate) {
						return data.doUpdate(data);
					}
					return $q.when(true);
				};
				service.canMultipleUploadFiles = canUploadFiles;
				service.uploadFiles = upload;
				// service.showUploadFilesProgress = showUploadFilesProgress;
				service.uploadSingleFile = upload;
				service.canUploadFileForSelectedPrjDocument = canUploadFileForSelectedPrjDocument;
				service.canUploadFiles = canUploadFileForSelectedPrjDocument;
				service.canDownloadFiles = canDownloadFiles;
				service.downloadFiles = downloadFiles;
				service.canPreviewDocument = canPreview;
				service.getPreviewConfig = getPreviewConfig;
				service.lockOrUnlockUploadBtnAndGrid = new PlatformMessenger();
				service.enableContextConfig =true;
				service.contextConfig = contextConfig;
				service.createDocuments = createDocuments;

				service.updatePreviewDocument = new PlatformMessenger();
				service.onUpdateSucceeded = new PlatformMessenger();
				service.onUpdateDocCreateHistory = new PlatformMessenger();
				service.onPreviewDocCreateHistory = new PlatformMessenger();
				service.onDownloadDocCreateHistory = new PlatformMessenger();
				service.filesHaveBeenUploaded = new PlatformMessenger();
				service.filesClear = new PlatformMessenger();

				service.needToLockOrUnlockDocumentRevisionGrid = function (oldReferencedDocumentId, newReferencedDocumentId) {
					if (((oldReferencedDocumentId === 0 || oldReferencedDocumentId === null) && (newReferencedDocumentId !== 0 && newReferencedDocumentId !== null)) ||
						((oldReferencedDocumentId !== 0 && oldReferencedDocumentId !== null) && (newReferencedDocumentId === 0 || newReferencedDocumentId === null))) {
						if ((oldReferencedDocumentId === 0 || oldReferencedDocumentId === null) && (newReferencedDocumentId !== 0 && newReferencedDocumentId !== null)) {
							return {needToLockOrUnlock: true, lockOrUnlock: 'lock'};
						} else {
							return {needToLockOrUnlock: true, lockOrUnlock: 'unlock'};
						}
					} else {
						return {needToLockOrUnlock: false};
					}
				};
				service.isReadOnly =function isReadOnly () {
					var currentItem = service.getSelected();
					if(currentItem === null || currentItem === undefined){
						return true;
					}
					return currentItem.IsReadonly;
				};

				service.getCellEditable = function (item, model) {
					var editable = true;

					if (model === 'DocumentTypeFk') {
						editable = !item.FileArchiveDocFk;
					}

					return editable;
				};

				service.getSelectedProjectId= function () {
					var prjId=-1;
					var documentProject=service.getSelected();
					var project = cloudDesktopPinningContextService.getPinningItem('project.main');
					if(null !== project){
						prjId=project.id;
					}
					if (documentProject && !_.isNull(documentProject.PrjProjectFk)) {
						prjId = documentProject.PrjProjectFk;
					}
					return prjId;
				};

				service.takeOver = function takeOver(entity) {
					var data = serviceContainer.data;
					var dataEntity = data.getItemById(entity.Id, data);
					if(!_.isNil(dataEntity)) {
						entity.CanDeleteStatus = dataEntity.CanDeleteStatus;
						entity.CanWriteStatus = dataEntity.CanWriteStatus;
						data.mergeItemAfterSuccessfullUpdate(dataEntity, entity, true, data);
						data.markItemAsModified(dataEntity, data);
					}
				};
				service.updateReadOnly = function updateReadOnly(entity, readOnlyField, value, editField) {
					if (!entity) {
						return;
					}
					if (editField) {
						entity[editField] = value;
					}
					var readOnly = !service.getCellEditable(entity, readOnlyField);
					platformRuntimeDataService.readonly(entity, [{field: readOnlyField, readonly: readOnly}]);
				};
				service.showInfoDialog = function showInfoDialog(infoData) {
					var modalOptions = {
						templateUrl: globals.appBaseUrl + 'procurement.common/partials/create-prcdocument-existinfo-dialog.html',
						backDrop: false,
						windowClass: 'form-modal-dialog',
						resizeable: true,
						headerTextKey: $translate.instant('basics.common.taskBar.info'),
						infoList: infoData,
						showYesButton: true,
						showNoButton: true
					};
					return platformModalService.showDialog(modalOptions);
				};

				service.getDocumentDataService = function () {
					return documentsProjectDocumentDataService.getService({
						moduleName: documentsProjectDocumentModuleContext.getConfig().moduleName
					});
				};

				var createItem = angular.copy(service.createItem);
				service.createItem = function () {
					if (createItem) {
						createItem(null, serviceContainer.data);
					}
				};



				service.uploadCreateItem = {};
				service.uploadedFileData = {};
				service.extractZipOrNot = false;
				service.isConfigurationDialog = false;
				service.dataConfigData = {};
				service.UploadedFileDataList = [];
				service.updateRows = [];//this is Affected array
				service.updateVerItems = []; //Update the version array
				service.IsFromDataConfig = false;
				service.clearFileInfoArray = function() {
					$rootScope.$broadcast('clearFileInfoArray');
				}

				function canUploadFiles() {
					return platformPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e');
				}

				function uploadFilesCallBack(currItem, data) {
					if (currItem === null || angular.isUndefined(currItem.Id)) {
						var args = {
							currItem: currItem,
							data: data
						};
						service.isSingle = false;
						service.filesHaveBeenUploaded.fire(null, args);
					}else{
						var arg = {
							currItem: currItem,
							data: data
						};
						service.dataList = serviceContainer.data.itemList;
						service.isSingle = true;
						service.filesHaveBeenUploaded.fire(null, arg);
					}
				}

				function upload(option){
					var fileUploadDataService = $injector.get('documentsProjectDocumentFileUploadDataService');
					fileUploadDataService.gridFlag = '4EAA47C530984B87853C6F2E4E4FC67E';
					var uploadService = service.getUploadService();
					let currItem = service.getSelected();
					const documentTypeItems = basicsLookupdataLookupDescriptorService.getData('DocumentType');
					let value = service.getExtension(documentTypeItems, currItem.DocumentTypeFk);
					uploadService.uploadFiles(currItem, value, option);
					// uploadService.uploadFiles(currItem, service.getExtension(documentTypeItems, currItem.DocumentTypeFk));

				}


				/* function uploadFiles(scope) {
					upload(scope);
					function upload(scope) {
						var fileUploadDataService = $injector.get('documentsProjectDocumentFileUploadDataService');
						documentsProjectDocumentFileUploadDataService.gridFlag = '4EAA47C530984B87853C6F2E4E4FC67E';
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + documentsProjectName + '/partials/file-handler-lookup.html',
							scope: scope,
							backdrop: false
						});

						var uploadService = fileUploadDataService.getUploadService();
						var basDocumentTypeArray=fileUploadDataService.getBasDocumentTypeArray();
						var allSupportedFileTypeIds=_.map(basDocumentTypeArray,function(item){
							return item.Id;
						});
						var allSupportedFileExtensions=_.map(allSupportedFileTypeIds,function(item){
							return uploadService.getExtension(basDocumentTypeArray, item);
						});
						allSupportedFileExtensions=_.filter(allSupportedFileExtensions,function(item){
							return !!item;
						});
						var fileExtensionArray=[];
						var gridFlag=fileUploadDataService.gridFlag;
						if(gridFlag === '4EAA47C530984B87853C6F2E4E4FC67E'){
							fileExtensionArray=allSupportedFileExtensions;
						}else{
							var selectedDocumentFileTypeId=fileUploadDataService.getDocumentFileType();
							var selectedDocumentFileExtension=uploadService.getExtension(basDocumentTypeArray, selectedDocumentFileTypeId);
							if(selectedDocumentFileExtension){
								fileExtensionArray.push(selectedDocumentFileExtension);
							}
						}
						fileExtensionArray=_.map(fileExtensionArray,function(item){
							return item.replace(/[*.\s]/g,'');
						});
						var finalFileExtensionArray=[];
						for(var i=0; i<fileExtensionArray.length; i++){
							if(fileExtensionArray[i].indexOf(';')!==-1){
								finalFileExtensionArray = finalFileExtensionArray.concat(fileExtensionArray[i].split(';'));
							}else if(fileExtensionArray[i].indexOf(',')!==-1){
								finalFileExtensionArray = finalFileExtensionArray.concat(fileExtensionArray[i].split(','));
							}else{
								finalFileExtensionArray.push(fileExtensionArray[i]);
							}
						}
						fileUploadDataService.getSupportedMimeTypeMapping().then(function(res){
							var supportedMimeTypeMapping=res;
							var supportedMimeTypesForAcceptAttr=_.map(finalFileExtensionArray,function(fileExtension){
								var attrValue =supportedMimeTypeMapping[fileExtension];
								if (attrValue) {
									return attrValue;
								}else{
									return null;
								}
							});
							supportedMimeTypesForAcceptAttr=_.filter(supportedMimeTypesForAcceptAttr,function(item){
								return item!==null;
							});
							if(!!supportedMimeTypesForAcceptAttr&&!!supportedMimeTypesForAcceptAttr.length&&supportedMimeTypesForAcceptAttr.length>0){
								var supportedMimeTypesForAcceptAttrString=supportedMimeTypesForAcceptAttr.join(',');
								var fileOption = {multiple: true, autoUpload: false,accept:supportedMimeTypesForAcceptAttrString};
								uploadService.selectFiles(fileOption);
							}
						});

					}
				} */

				/* function showUploadFilesProgress(scope) {
					platformModalService.showDialog({
						templateUrl: globals.appBaseUrl + documentsProjectName + '/partials/files-upload-progress.html',
						scope: scope,
						backdrop: false
					});
				} */


				function canUploadFileForSelectedPrjDocument() {

					var documentstatuss=basicsLookupdataLookupDescriptorService.getData('documentstatus');

					var currentItem = service.getSelected();
					if(_.isObject(currentItem)){
						if(!currentItem.CanWriteStatus){
							return false;
						}
						var currentStatus = _.find(documentstatuss, {Id : currentItem.PrjDocumentStatusFk});
						if(currentStatus !== undefined){
							return !!currentItem && !currentStatus.IsReadonly && platformPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e');
						}else{
							return !!currentItem && platformPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e');
						}
					}
					else{
						return !!currentItem && platformPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e');
					}
				}

				function canDownloadFiles() {
					var selectedEntities = service.getSelectedEntities();
               if(selectedEntities.length >= 2){
	               return _.filter(selectedEntities, function(item) {
		               return item.FileArchiveDocFk !== null;
	               }).length > 0;
               }
					var currentItem = service.getSelected();
					if (currentItem) {
						return ($injector.get('basicsCommonDrawingPreviewDataService').checkDocumentCanPreview(service, currentItem, true) && 1000 !== currentItem.DocumentTypeFk) && platformPermissionService.hasRead('4eaa47c530984b87853c6f2e4e4fc67e');
					}
					return false;
				}

				function downloadFiles() {
					const entities = service.getSelectedEntities();
					basicsCommonFileDownloadService.canDownload(service, entities);
				}

				function canPreview() {
					var currentItem = service.getSelected();
					if (currentItem) {
						return ($injector.get('basicsCommonDrawingPreviewDataService').checkDocumentCanPreview(service, currentItem) || 1000 === currentItem.DocumentTypeFk) && platformPermissionService.hasRead('4eaa47c530984b87853c6f2e4e4fc67e');
					}
					return false;
				}

				function getPreviewConfig(defaultEntity) {
					// Fixed #101548,defaultEntity, when select parent entity, it will load the documents and use the first one to preview
					var deffered = $q.defer();
					var currentItem = service.getSelected();
					if(defaultEntity !== undefined){
						currentItem = defaultEntity;
					}
					var fileArchiveDocId = currentItem.FileArchiveDocFk;

					if (currentItem.Url) {
						if (currentItem.Url.indexOf('itwocx') > -1) {
							cxService.LoginCx().then(function (backdata) {
								var key = backdata.key;
								var url = currentItem.Url + '?k=' + key;
								deffered.resolve({
									Url: url,
									title: ''
								});
							});
						}
						else {
							deffered.resolve({
								Url: currentItem.Url,
								title: ''
							});
						}
					}
					else {
						if (fileArchiveDocId) {
							$http.get(globals.webApiBaseUrl + 'basics/common/document/preview?fileArchiveDocId=' + fileArchiveDocId).then(function (result) {
								deffered.resolve({
									src: result.data,
									documentType: currentItem.DocumentTypeFk,
									title: currentItem.OriginFileName
								});
							});
						}
					}
					return deffered.promise;
				}

				function setCurrentPinningContext(dataService) {
					function setCurrentProjectToPinnningContext(dataService) {
						var currentItem = dataService.getSelected();
						if (currentItem) {
							var projectPromise = $q.when(true);
							var pinningContext = [];
							if (angular.isNumber(currentItem.Id)) {
								if (angular.isNumber(currentItem.PrjProjectFk)) {
									projectPromise = cloudDesktopPinningContextService.getProjectContextItem(currentItem.PrjProjectFk).then(function (pinningItem) {
										pinningContext.push(pinningItem);
									});
								}
							}

							return $q.all([projectPromise]).then(
								function () {
									if (pinningContext.length > 0) {
										cloudDesktopPinningContextService.setContext(pinningContext);
									}
								});
						}
					}

					setCurrentProjectToPinnningContext(dataService);
				}
				function revertProcessDocument(item) {
					if (item.Version === 0 && projectDocumentNumberGenerationSettingsService.hasToGenerateForRubricCategory(item.RubricCategoryFk)) {
						item.Code = '';
					}
				}
				function processDocument(item) {
					var fields = [];
					if (item.Version === 0 && projectDocumentNumberGenerationSettingsService.hasToGenerateForRubricCategory(item.RubricCategoryFk)) {
						fields.push({field: 'Code', readonly: true});
					}
					if (fields.length > 0) {
						platformRuntimeDataService.readonly(item, fields);
					}
					// readOnly when the ribArchive file send/callback to itwoSite
					platformRuntimeDataService.readonly(item, [
						{field: 'PrjDocumentCategoryFk', readonly: item.IsLockedType === true},
						{field: 'PrjDocumentTypeFk', readonly: item.IsLockedType === true}]);
				}

				function getPinningProjectId() {
					var context = cloudDesktopPinningContextService.getContext();
					if (context) {
						for (var i = 0; i < context.length; i++) {
							if (context[i].token === 'project.main') {
								return context[i].id;
							}
						}
					}
					return -1;
				}

				function contextConfig() {
					var modalOptions = {
						templateUrl: globals.appBaseUrl + 'documents.centralquery/templates/context-config/documents-centralquery-context-config.html',
						backDrop: false,
						windowClass: 'form-modal-dialog',
						resizeable: false,
						headerTextKey: $translate.instant('basics.common.taskBar.info'),
						showYesButton: true,
						showNoButton: true,
						currentItem:service.getSelected() || null,
						id:'363B846A8B3E4375821EF9D2323D062C'
					};
					return platformModalService.showDialog(modalOptions);
				}

				service.canContextConfig = ()=>{
					return _.isNil(this.canContextConfig);
				};

				service.getServiceContainer = function () {
					return serviceContainer;
				};

				function createDocuments(docParams) {
					return $http.post(globals.webApiBaseUrl + 'documents/projectdocument/createDocument',docParams);
				}

				service.resetUploadData = function resetUploadData() {
					service.uploadCreateItem = {};
					service.uploadedFileData = {};
					service.dataConfigData = {};
					service.UploadedFileDataList = [];
					service.updateRows = [];
					service.updateVerItems = [];
					service.IsFromDataConfig = false;
				}

				return service;
			}]);
})(angular);


