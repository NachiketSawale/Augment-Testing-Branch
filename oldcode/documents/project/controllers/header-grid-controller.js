/**
 * Created by lja on 2016-2-1.
 */
/* jshint -W072 */ // many parameters because of dependency injection
(function (angular) {
	/* global $ */
	'use strict';
	var moduleName = 'documents.project';
	angular.module(moduleName).controller('documentsProjectDocumentController',
		[
			'globals', '$scope', '$timeout', '$rootScope',
			'documentsProjectDocumentDataService',
			'documentProjectHeaderUIStandardService',
			'platformGridControllerService',
			'basicsLookupdataLookupDescriptorService',
			'documentsProjectDocumentModuleContext',
			'documentProjectHeaderValidationService',
			'$translate',
			'documentProjectCommonConfigControllerService',
			'platformModuleDataExtensionService',
			'documentProjectClipboardService', 'platformGridAPI', '$injector', 'platformModalService',
			'documentsProjectDocumentFileUploadDataService', 'basicsLookupdataLookupDefinitionService',
			'basicsPermissionServiceFactory', 'documentsProjectDocumentReadonlyProcessor','documentsProjectFileSizeProcessor','ServiceDataProcessDatesExtension',
			'platformPermissionService',
			'modelViewerDragdropService',
			'modelViewerCompositeModelObjectSelectionService',
			'documentsProjectModelObjectDataService',
			'documentsCentralQuaryGotoDropDown',
			'basicsCommonUploadDownloadControllerService',
			'_',
			'platformDataServiceConfiguredCreateExtension',
			'platformModuleEntityCreationConfigurationService',
			'basicsCommonPreviewDocumentExtensionService',
			function (globals, $scope, $timeout, $rootScope,
				documentsProjectDocumentDataService,
				UIStandardService,
				gridControllerService,
				basicsLookupdataLookupDescriptorService,
				documentsProjectDocumentModuleContext,
				documentProjectHeaderValidationService,
				$translate,
				documentProjectCommonConfigControllerService,
				platformModuleDataExtensionService,
				documentProjectClipboardService, platformGridAPI, $injector, platformModalService,
				fileUploadDataService, basicsLookupdataLookupDefinitionService,
				basicsPermissionServiceFactory, documentsProjectDocumentReadonlyProcessor,documentsProjectFileSizeProcessor,DatesProcessor,
				platformPermissionService, modelViewerDragdropService,
				modelViewerCompositeModelObjectSelectionService,
				documentsProjectModelObjectDataService,
				documentsCentralQuaryGotoDropDown,
				basicsCommonUploadDownloadControllerService, _,
				platformDataServiceConfiguredCreateExtension,
				platformModuleEntityCreationConfigurationService,
				previewDocumentExtensionService) {
				fileUploadDataService.getSupportedMimeTypeMapping();
				basicsLookupdataLookupDefinitionService.load(['documentsProjectHasDocumentRevisionCombobox']);
				var config = documentsProjectDocumentModuleContext.getConfig();
				var documentDataService = documentsProjectDocumentDataService.getService(config);
				var checkSameContextDialogService = $injector.get('documentProjectDocumentUploadCheckSameContextDialogService');
				setMandatoryByConfig();
				var permissionDescriptor = '4eaa47c530984b87853c6f2e4e4fc67e';
				var documentProjectPermissionService = basicsPermissionServiceFactory.getService('documentProjectPermissionDescriptor');
				var DocumentsMainName = 'documents.main';
				var IsFromDocumentsMain = false;
				if (config.fromModuleName === DocumentsMainName) {
					IsFromDocumentsMain = true;
				}

				$scope.gridFlag = '2bac93628c56416991e49f4c61a722ad';
				documentDataService.isDragOrSelect = 'drag';
				documentDataService.dragDropFileTargetGridId = $scope.gridFlag;
				$scope.allowedFiles = [''];

				$scope.FileInfoArray = [];
				// var uploadService = fileUploadDataService.getUploadService();
				var uploadService = documentDataService.getUploadService();
				uploadService.registerUploadStarting(onUploadStarting);
				uploadService.registerStartUploadProgress(onStartUploadProgress);
				uploadService.registerUploadDone(onUploadDone);
				uploadService.registerUploadCancelled(cancelLoading);
				uploadService.registerUploadError(cancelLoading);
				uploadService.registerUploadFinished(onUploadFinished);

				function onUploadStarting() {
					$scope.containerHeaderInfo.loading = true;
					const uploadBtn = _.find($scope.$parent.tools.items, {id: 'multipleupload'});
					if (uploadBtn) {
						uploadBtn.disabled = true;
					}
				}
				function cancelLoading() {
					$scope.containerHeaderInfo.loading = false;
					const uploadBtn = _.find($scope.$parent.tools.items, {id: 'multipleupload'});
					if (uploadBtn) {
						uploadBtn.disabled = false;
					}
				}

				$rootScope.$on('updateDone', function () {
					$('#prjdocsaveerror').hide();
				});

				// $scope.setTools = function (tools) {
				// $scope.tools = tools;
				// };

				function setMandatoryByConfig() {
					platformModuleEntityCreationConfigurationService.load('documents.centralquery').then(function (response) {
						if (response !== null) {
							var detailView = UIStandardService.getStandardConfigForDetailView();
							if (!_.isNull(response.ClassConfigurations) && response.ClassConfigurations.length > 0) {
								var configEntity = _.find(response.ClassConfigurations, {EntityName: 'Document'});
								if (!_.isNil(configEntity) && !_.isNil(configEntity.ColumnsForCreateDialog) && configEntity.ColumnsForCreateDialog.length > 0) {
									_.forEach(configEntity.ColumnsForCreateDialog, function (field) {
										if (field.IsMandatory === 'true') {
											var found = _.find(detailView.rows, function (row) {
												return row.rid.toLowerCase() === field.PropertyName.toLowerCase();
											});
											if (found) {
												found.required = true;
												if(!_.isNil(found.options) && !_.isNil(found.options.showClearButton) ){
													found.options.showClearButton = false;
													if(!_.isNil(found.options.lookupOptions) && !_.isNil(found.options.lookupOptions.showClearButton)){
														found.options.lookupOptions.showClearButton = false;
													}
												}
											}
										}
									});
								}
							}
						}
					});
				}

				function onStartUploadProgress() {
					// var documentDataService = fileUploadDataService.getDocumentDataService();
					if (!!fileUploadDataService.isDragOrSelect && fileUploadDataService.isDragOrSelect === 'drag') {
						// documentDataService.showUploadFilesProgress($scope);
					}
				}

				function filesHaveBeenUploadedReaction(e, args) {
					if (documentDataService.isDragOrSelect === 'drag' && documentDataService.dragDropFileTargetGridId === $scope.gridFlag) {
						var fileInfoData = args.data;
						if (!!fileInfoData.FileArchiveDocId && !!fileInfoData.fileName && !!fileInfoData.file) {
							$scope.FileInfoArray.push(fileInfoData);
						}
					}
				}

				documentDataService.filesHaveBeenUploaded.register(filesHaveBeenUploadedReaction);

				function onUploadDone() {

				}

				function updateGotoButton() {
					documentsCentralQuaryGotoDropDown.updateNavItem($scope);
				}

				// function onUploadCancelled(file,entity){
				//
				// }

				function onUploadFinished() {
					cancelLoading();
					var documentDataService = fileUploadDataService.getDocumentDataService();
					var uploadedFileDataArray = [];
					if ((!!$scope.FileInfoArray) && angular.isArray($scope.FileInfoArray) && $scope.FileInfoArray.length > 0) {
						angular.forEach($scope.FileInfoArray, function (fileInfo) {
							uploadedFileDataArray.push({
								FileArchiveDocId: fileInfo.FileArchiveDocId,
								FileName: fileInfo.fileName,
								LastModified: fileInfo.file.lastModified
							});
						});
						if (documentDataService.isSingle === true) {
							var revisionDataService = fileUploadDataService.getDocumentRevisionDataService();
							if (revisionDataService){
								fileUploadDataService.currentSelectedDocument = angular.copy(fileUploadDataService.getDocumentSelectedItem());
								fileUploadDataService.currentRevisionList = angular.copy(revisionDataService.getList());
							}
							documentDataService.update().then(function () {
								var extractZipOrNot = $scope.containerHeaderInfo.checkBoxChecked;
								fileUploadDataService.asynCreateDocumentRevisionForUploadFile(uploadedFileDataArray, extractZipOrNot).then(function () {
									documentDataService.refresh();
									$scope.FileInfoArray = [];
								}, function () {
									$scope.FileInfoArray = [];
								});
							});
						} else {
							if (documentDataService.isDragOrSelect === 'drag' && documentDataService.dragDropFileTargetGridId === $scope.gridFlag) { // the Document Project grid
								var extractZipOrNot_ = $scope.containerHeaderInfo.checkBoxChecked;
								platformModuleEntityCreationConfigurationService.load('documents.centralquery').then(()=>{
									if(documentDataService.getServiceContainer().data.hasOwnProperty('getModuleOfService')){
										documentDataService.getServiceContainer().data.getModuleOfService().name = 'documents.centralquery';
									}
									let postDocumentData = {
										ExtractZipOrNot: extractZipOrNot_,
										UploadedFileDataList: uploadedFileDataArray,
										ParentEntityInfo: {},
										ModuleName: documentsProjectDocumentModuleContext.getConfig().moduleName,
										referEntity:null
									};

									let parentEntity = documentDataService.getCurrentSelectedItem();
									postDocumentData.ColumnConfig = documentDataService.getColumnConfig();
									postDocumentData.ParentEntityInfo = fileUploadDataService.setParentInfo(parentEntity);
									if (!platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(documentDataService.getServiceContainer().data)) {
										createDocumentOrUpdateRevision(uploadedFileDataArray, extractZipOrNot_,null,postDocumentData.ParentEntityInfo,postDocumentData.ColumnConfig);
									} else {
										let docItem = documentDataService.getSelected();
										documentDataService.uploadedFileData = uploadedFileDataArray;
										let postData = [], postItem = {}, mainField = null;
										if (uploadedFileDataArray) {
											_.forEach(uploadedFileDataArray, function (fileItem) {
												let item = angular.copy(postItem);
												item.OriginFileName = fileItem.FileName;
												item.FileArchiveDocFk = fileItem.FileArchiveDocId;
												if(postDocumentData.ColumnConfig) {
													postDocumentData.ColumnConfig.forEach(function (field) {
														const {documentField, dataField} = field;
														if (postDocumentData.ParentEntityInfo.hasOwnProperty(dataField)) {
															item[documentField] = postDocumentData.ParentEntityInfo[dataField];
														} else {
															item[documentField] = null;
														}
													});
												}
												postData.push(item);
											});
										}
										let param = {Documents: postData, IsZip: extractZipOrNot_, HeaderField: mainField };
										checkSameContextDialogService.validationFile(param).then(function (response) {
											var existsData = (response && response.data) ? response.data : response;
											if (existsData && existsData.length === postData.length) {
												createDocumentOrUpdateRevision(uploadedFileDataArray, extractZipOrNot_,docItem, postDocumentData.ParentEntityInfo,postDocumentData.ColumnConfig,true);
											}else{
												documentDataService.createItem(docItem, documentDataService.getServiceContainer().data);
											}
										});
									}
								});
							}
						}
					}
				}

				function createDocumentOrUpdateRevision(uploadedFileDataArray,extractZipOrNot,record,parentEntityInfo,columnConfig) {
					fileUploadDataService.asyncCreateDocumentOrUpdateRevision(uploadedFileDataArray, extractZipOrNot,record,parentEntityInfo,columnConfig).then(function (res) {
						var resData = (res && res.data) ? res.data : res;
						if (!!resData && !!resData.invalidFiles && angular.isArray(resData.invalidFiles) && resData.invalidFiles.length > 0) {
								var errMsg = $translate.instant('documents.project.FileUpload.validation.FileExtensionErrorInfo');
								if (res.data.length > 1) {
									var fileNames = res.data.join('<br/>');
									errMsg = '<br/>' + $translate.instant('documents.project.FileUpload.validation.FileExtensionsErrorInfo') + ':<br/>' + fileNames;
								} else {
									errMsg = '<br/>' + $translate.instant('documents.project.FileUpload.validation.FileExtensionErrorInfo') + ':<br/>' + res.data[0];
								}
								errMsg = '<div style=\'height:300px\'>' + errMsg + '</div>';
								platformModalService.showMsgBox(errMsg, 'documents.project.FileUpload.validation.FileExtensionErrorMsgBoxTitle', 'warning');
							}

						if (!!res && !!res.data && !!res.data.dtos) {
							const resData = res.data.dtos;

							const docItemList = documentDataService.getList();
							let refreshItem = [];
							_.forEach(resData, function (docDto) {
								const docItem = docItemList.find(e => e.Id === docDto.Id);
								if (!docItem) {
									docItemList.push(docDto);
								}
								refreshItem.push(docDto);
							});
							documentDataService.gridRefresh();
							documentDataService.setSelectedEntities(refreshItem);
							documentDataService.refreshSelectedEntities().then(function () {
								documentDataService.setSelected(docItemList[docItemList.length - 1]);
							});
							documentDataService.resetUploadData();
						}
					}).finally(()=>{
						$scope.FileInfoArray = [];
					});
				}
				documentDataService.filesClear.register(clearFileInfoArray);
				function clearFileInfoArray() {
					$scope.FileInfoArray = [];
				}
				function validationFiles(files) {
					if (!(files && files.length && files.length > 0)) {
						platformModalService.showMsgBox($translate.instant('documents.project.FileUpload.validation.FileUnValid'),
							$translate.instant('documents.project.FileUpload.validation.FileExtensionErrorMsgBoxTitle'), 'ico-error');
						return false;
					} else {
						var moduleName = config.moduleName;
						var result = !!fileUploadDataService.getSelectedParentItem();
						if (result === false) {
							var errMsg = $translate.instant('documents.project.FileUpload.validation.NoHeaderEntitySelectedTip', {ModuleName: moduleName});
							platformModalService.showMsgBox(errMsg,
								$translate.instant('documents.project.FileUpload.validation.NoHeaderSelected'), 'ico-error');
						}
						return result;
					}
				}

				// load the DocumentType
				basicsLookupdataLookupDescriptorService.loadData(['DocumentType', 'DocumentStatus']);

				// function getTranslatedModuleName(moduleName){
				// if(moduleName.indexOf('.')){
				// var arrayTemp=moduleName.split('.');
				// var finalModuleName='';
				// for(var i=0;i<arrayTemp.length;i++){
				// finalModuleName
				// }
				// }
				// }

				$scope.containerHeaderInfo = {
					checkBoxChecked: false,
					extractZipFileTip: $translate.instant('documents.project.FileUpload.extractZipFileTip'),
					prefix: $translate.instant('cloud.common.Container') + ': ',
					currentModuleName: documentsProjectDocumentDataService.getCurTitle(config.moduleName) || '',
					headerNotSaveError: $translate.instant('basics.common.errornotsavefile')
				};

				documentsProjectDocumentDataService.registerModuleChangedMessage(registerModuleChangedMessage);

				documentDataService.updatePreviewDocument.register(updatePreview);

				function registerModuleChangedMessage(currentModuleName) {
					$scope.containerHeaderInfo.currentModuleName = currentModuleName;
				}

				documentsProjectDocumentDataService.setIsContainerConnected(true);

				// get UI service
				// var gridColumns = UIStandardService.getUIStandardService(config.moduleName);

				function createUIService(newColumn){
					let listViewStdCfg = UIStandardService.getStandardConfigForListView();
					let columns =  _.cloneDeep(listViewStdCfg.columns);
					columns.splice(0, 0, newColumn);
					return {
						getStandardConfigForListView: () => ({
							addValidationAutomatically: listViewStdCfg.addValidationAutomatically,
							isTranslated: listViewStdCfg.isTranslated,
							columns: columns
						}),
						getStandardConfigForDetailView: () => UIStandardService.getStandardConfigForDetailView(),
						getDtoScheme: UIStandardService.getDtoScheme
					};
				}

				let newUIService = UIStandardService;

				if($scope.getContentValue('showOriginColumn') === true){
					newUIService = createUIService({
						id: 'origin',
						field: 'Origin',
						name: $translate.instant('documents.project.origin'),
						name$tr$: 'documents.project.origin',
						readonly: true
					});
				}

				gridControllerService.initListController($scope, newUIService, documentDataService, documentProjectHeaderValidationService,
					{
						isRoot: false,
						type: 'modelMainObjectDataService',
						dragDropService: documentProjectClipboardService,
						extendDraggedData: function (draggedData) {
							draggedData.modelDataSource = documentProjectClipboardService.myDragdropAdapter;
						}
					});

				function copyFileToDocument(oneDriveItems) {
					if (!oneDriveItems || !Array.isArray(oneDriveItems) && oneDriveItems.length < 1) {
						return;
					}
					angular.forEach(oneDriveItems, function (fileInfo) {
						$scope.FileInfoArray.push({
							FileArchiveDocId: fileInfo.FileArchiveDocId,
							fileName: fileInfo.OriginalFileName,
							file: {
								name: fileInfo.OriginalFileName,
								lastModified: fileInfo.LastModified instanceof Date ? fileInfo.LastModified.getTime() : new Date().getTime(),
								lastModifiedDate: fileInfo.LastModified,
							}
						});
					});
					onUploadFinished();
				}

				// drag one drive file --------------------------
				const origCanDrop = $scope.ddTarget.canDrop;
				$scope.ddTarget.canDrop = function (info) {
					if ($scope.containerHeaderInfo.loading) {
						return false;
					}
					if (info.draggedData && info.draggedData.draggingFromViewer) {
						return !!documentDataService.getSelected();
					} else if (info.draggedData && info.draggedData.sourceGrid && _.includes(['oneDrive', 'outlook'], info.draggedData.sourceGrid.type) ) {
						// return config.parentService.hasSelection();

						var validate = config.parentService.hasSelection();
						if (!validate) {
							return false;
						}
						var dragItems = info.draggedData.sourceGrid.data;
						if (validationFiles(dragItems)) {
							validate &= fileUploadDataService.validateFileExtension($scope, dragItems);
						} else {
							validate &= false;
						}
						return validate;
					} else if (info.draggedData && info.draggedData.sourceGrid &&
						(info.draggedData.sourceGrid.type === 'modelMainObjectDataService' ||
							info.draggedData.sourceGrid.type === 'documentRevision')) {
						return false;
					} else {
						return origCanDrop.call($scope.ddTarget, info);
					}
				};

				var origDrop = $scope.ddTarget.drop;
				$scope.ddTarget.drop = function (info) {
					if (info.draggedData && info.draggedData.draggingFromViewer) {
						var documents = documentDataService.getSelectedEntities();
						// var viewerModelId = modelViewerModelSelectionService.getSelectedModelId();
						modelViewerDragdropService.paste().then(function(createParam) {
							var objectIds = createParam.includedObjectIds;
							var reqParameters = [];
							angular.forEach(documents, function(item) {
								var param = {
									PrjDocumentId: item.Id,
									MdlModelId: createParam.modelId,
									ObjectIds: objectIds.useGlobalModelIds().toCompressedString()
								};
								reqParameters.push(param);
							});

							var documentModelService = documentsProjectModelObjectDataService.getService(documentsProjectDocumentModuleContext.getConfig());
							documentModelService.createObjectSetToDocument(reqParameters);

						});
					} else if (info.draggedData && info.draggedData.sourceGrid && info.draggedData.sourceGrid.type === 'oneDrive') {
						// handle dragged data
						// console.log(info.draggedData.sourceGrid.data);

						var oneDriveItems = info.draggedData.sourceGrid.data;

						// var validate = true;
						//
						// if( validationFiles(oneDriveItems) ){
						// validate = fileUploadDataService.validateFileExtensionAndShowMsg($scope,oneDriveItems);
						// }else{
						// validate = false;
						// }
						//
						// if(!validate){
						// return;
						// }

						var documents2 = documentDataService.getList();

						var lodash = $injector.get('_');

						var postData = [];
						angular.forEach(oneDriveItems, function(driveItem) {
							var found = lodash.find(documents2, function(doc) {
								return doc.OriginFileName && doc.OriginFileName.toLocaleUpperCase() === driveItem.name.toLocaleUpperCase();
							});

							var newItem = {
								Overwrite: false,
								FileArchiveDocId: null,
								DriveItem: driveItem
							};

							if (found) {
								newItem.Overwrite = true;
								newItem.FileArchiveDocId = found.Id;
							}
							postData.push(newItem);
						});

						var cloudDesktopOneDriveDataService = $injector.get('cloudDesktopOneDriveDataService');

						cloudDesktopOneDriveDataService.copyFileFromOneDrive('DocumentsProject', postData)
							.then(function(response) {
								console.log(response);
								if (response && response.data && response.data.Success &&
									response.data.CopiedFiles && response.data.CopiedFiles.length > 0) {
									copyFileToDocument(response.data.CopiedFiles);
								}
							});
					} else if (info.draggedData && info.draggedData.sourceGrid && info.draggedData.sourceGrid.type === 'outlook') {
						let outlookAttachmentService = info.draggedData.sourceGrid.attachmentService;
						let attachments = info.draggedData.sourceGrid.data;
						let messageId = info.draggedData.messageId;
						const getAttachment = !info.draggedData.draggingFromDraft && messageId
							? info.draggedData.sourceGrid.attachmentService.getAttachmentById(info.draggedData.sourceGrid.itemService.graphClient, messageId, _.map(attachments, 'id')[0])
							: Promise.resolve(attachments[0]);
						getAttachment.then(attachment => {
							outlookAttachmentService.createDocumentFromOutlookAttachment(attachment).then(function(response) {
								if (response.Success) {
									copyFileToDocument(response.CopiedFiles);
								} else {
									platformModalService.showErrorDialog(response.Message);
								}
							});
						});
					} else {
						origDrop.call($scope.ddTarget, info);
					}
				};

				// end drag one drive file ------------------------------

				// update toolbars
				var tools = [];
				var goToBtn = documentsCentralQuaryGotoDropDown.createNavItem($scope);

				function initGrid($scope, dataService) {
					if (tools.length === 0) {
						tools = documentProjectCommonConfigControllerService.initialUploadController($scope, dataService);
						if (goToBtn) {
							tools.push(goToBtn);
						}
						if (tools.length > 0) {
							$scope.addTools(tools);
						}
					} else {
						// $scope.addTools(tools);
						$scope.updateTools();
						// _.remove(tools, function (item) {
						// return item.id === 'cancelUpload' && item.id === 'upload';
						// });
					}
					if (!!$scope && !!$scope.$parent && !!$scope.$parent.tools && !!$scope.$parent.tools.items) {
						var newBtn = _.find($scope.$parent.tools.items, function (item) {
							return item.id === 'create';
						});
						if (newBtn) {
							newBtn.caption = $translate.instant(moduleName + '.createButtonCaption');
						}
					}

					if (config.readonly) {
						_.remove($scope.tools.items, function (item) {
							return item.id === 'create' || item.id === 'delete' || item.id === 'upload';
						});
					}
					// testServiceA.testA();
				}

				initGrid($scope, documentDataService);
				basicsCommonUploadDownloadControllerService.initGrid($scope, documentDataService);

				$scope.canDrop = canDrop;
				function canDrop(){
					if ($scope.containerHeaderInfo.loading) {
						return false;
					}
					const selectItem = config.parentService.getSelected();
					if (selectItem !== null && selectItem.Version === 0) {
						$('#prjdocsaveerror').show();
						return false;
					}

					if (IsFromDocumentsMain) {
						return false;
					}

					var selectedDocumentDto = fileUploadDataService.getDocumentSelectedItem();
					// var documentDataService = fileUploadDataService.getDocumentDataService();
					if (selectedDocumentDto && selectedDocumentDto.PermissionObjectInfo) {
						var hasCreate = documentProjectPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e');
						if (selectedDocumentDto && (selectedDocumentDto.IsReadonly || !hasCreate || !selectedDocumentDto.CanWriteStatus)) {
							return false;
						} else {
							return true;
						}
					} else {
						if (selectedDocumentDto) {
							return !(selectedDocumentDto.IsReadonly || !selectedDocumentDto.CanWriteStatus || !platformPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e'));
						} else {
							return platformPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e');
						}
						// return !(selectedDocumentDto && (selectedDocumentDto.IsReadonly || !selectedDocumentDto.CanWriteStatus ||!platformPermissionService.hasCreate('4eaa47c530984b87853c6f2e4e4fc67e')));
					}

				}

				$scope.fileDropped = fileDropped;

				function  fileDropped(files){
					var documentDataService = fileUploadDataService.getDocumentDataService();
					documentDataService.isDragOrSelect = 'drag';
					documentDataService.dragDropFileTargetGridId = $scope.gridFlag;
					if (validationFiles(files)) {
						documentDataService.onFileSelected($scope, files);
					}
				}


				function updateToolsBar() {
					initGrid($scope, documentDataService);
					$scope.fileDropped = fileDropped;
					$scope.canDrop = canDrop;
				}

				function updatePreview(defaultEntity) {
					documentProjectCommonConfigControllerService.previewDocument($scope, documentDataService, false, defaultEntity);
				}

				function updataDocument(entities) {
					if (!Object.prototype.hasOwnProperty.call(entities, 'ProjectDocument')) {
						if (!documentDataService.update) {
							return;
						}
						if (documentDataService.isNeedUpdateSelf) {
							$timeout(function () {
								documentDataService.update();
							}, 10);// if 800 will execute update two times when click two times quickly
						}

					}
				}

				function updateToolBarAndPreview() {
					updateGotoButton();
					updatePreview();
					updateToolsBar();
				}

				function showToolItems(enabled) {
					var  canUploadFile = true;
					var documentDataService = fileUploadDataService.getDocumentDataService();
					if(documentDataService){
						canUploadFile = documentDataService.canUploadFileForSelectedPrjDocument();
					}
					angular.forEach($scope.tools.items, function (item) {
						if (item.id === 'upload') {
							item.disabled = !enabled || !canUploadFile;
						} else if (item.id === 'previewedit') {
							item.disabled = !enabled;
						}
					});
				}

				function disableBtnByParentChanged() {
					angular.forEach($scope.tools.items, function (item) {
						if (item.id === 'upload') {
							item.disabled = true;
						} else if (item.id === 'previewedit') {
							item.disabled = true;
						}
					});
				}

				var parentService = documentDataService.parentService();
				if (parentService !== undefined) {
					documentDataService.documentParentService = parentService;
					documentDataService.documentParentService.registerUpdateDone(updateToolBarAndPreview);
					documentDataService.documentParentService.registerSelectionChanged(disableBtnByParentChanged);
				}
				var rootService = parentService;
				if (rootService !== undefined) {

					while (rootService.parentService() !== null) {
						rootService = rootService.parentService();
					}
					// rootService.registerUpdateDataExtensionEvent(updataDocument);
					var basedoPrepareUpdateCall = angular.copy(rootService.doPrepareUpdateCall);
					rootService.doPrepareUpdateCall = function (updateData) {
						if (_.isFunction(basedoPrepareUpdateCall)) {
							basedoPrepareUpdateCall(updateData);
						}
						updataDocument(updateData);
					};

				}

				function updatePermission(e, selected) {
					if (!selected) {
						return;
					}
					documentProjectPermissionService.setPermissionObjectInfo(selected.PermissionObjectInfo)
						.then(function () {
							documentProjectPermissionService.resetSystemContext();
							var hasWrite = documentProjectPermissionService.hasWrite(permissionDescriptor);
							var hasDelete = documentProjectPermissionService.hasDelete(permissionDescriptor);
							var hasCreate = documentProjectPermissionService.hasCreate(permissionDescriptor);
							if (!hasCreate) {
								var createBtnIdx = _.findIndex($scope.tools.items, function (item) {
									return item.id === 'create';
								});
								$scope.tools.items.splice(createBtnIdx, 1);
							}
							if (!hasDelete) {
								var deleteBtnIdx = _.findIndex($scope.tools.items, function (item) {
									return item.id === 'delete';
								});
								$scope.tools.items.splice(deleteBtnIdx, 1);
							}
							var entity = documentDataService.getSelected();
							if (entity && (!hasWrite || !hasCreate)) {
								showToolItems(false);
								documentsProjectDocumentReadonlyProcessor.setRowReadOnlyByPermission(entity, true);
							} else {
								showToolItems($scope.isDisabled);
							}

							// $scope.updateTools();
							// $rootScope.$emit('permission-service:updated');
							// $rootScope.$emit('permission-service:changed');
						});
				}

				documentDataService.registerSelectionChanged(updateToolBarAndPreview);
				documentDataService.registerSelectionChanged(updatePermission);
				documentDataService.registerItemModified(updateToolBarAndPreview);

				var filterViewBtn = _.find($scope.tools.items, function (item) {
					return item.id === 'toggleFilteringSelection';
				});
				filterViewBtn.disabled = true;

				function objectChange() {
					var selectObjectIds = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds().useGlobalModelIds().toCompressedString();
					if (selectObjectIds.length > 0) {
						filterViewBtn.disabled = false;
					} else {
						filterViewBtn.disabled = true;
					}
					$scope.updateTools();
				}

				modelViewerCompositeModelObjectSelectionService.registerSelectionChanged(objectChange);

				var setCellEditable = function (e, arg) {
					var curColumn = arg.grid.getColumns()[arg.grid.getActiveCell().cell];
					var currentItem = arg.item;
					if (curColumn.field === 'DocumentTypeFk' && currentItem.DocumentTypeFk === 1000 || curColumn.field === 'Url' && currentItem.DocumentTypeFk === 1000) {
						return false;
					}
				};
				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);

				function onParentGridCellClick(evt, parentInfo){
					documentDataService.triggerParentClick(parentInfo);
				}

				const unregistParentGridCellClick = $rootScope.$on('documentsproject-parent-grid-click', onParentGridCellClick);

				// DEV-8304 Preview Procurement Invoice in gccModule
				function handleGccDocumentProjectTools() {
					if(documentDataService.parentService().getServiceName() === 'controllingGeneralcontractorCostControlDataService'){
						let controllerFeaturesServiceProvider = $injector.get('controllingGeneralcontractorControllerFeaturesServiceProvider');
						controllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

						let canUseButtonId = ['t12','t108','gridSearchAll','preview','gridSearchColumn','t199','t200','overflow-btn'];
						_.forEach($scope.tools.items,function (item) {
							if(canUseButtonId.indexOf(item.id) <= -1){
								item.disabled = function () {
									return true;
								}
							}
						});
					}
				}
				handleGccDocumentProjectTools();

				previewDocumentExtensionService.registerGridClick($scope, documentDataService);

				$scope.$on('$destroy', function () {
					// documentDataService.documentParentService.unregisterUpdateDataExtensionEvent(updataDocument);
					// rootService.unregisterUpdateDataExtensionEvent(updataDocument);
					documentDataService.unregisterSelectionChanged(updateToolBarAndPreview);
					documentDataService.unregisterSelectionChanged(updatePermission);
					documentsProjectDocumentDataService.unRegisterModuleChangedMessage(registerModuleChangedMessage);
					documentsProjectDocumentDataService.setIsContainerConnected(false);
					if (documentDataService.documentParentService !== undefined) {
						documentDataService.documentParentService.unregisterUpdateDone(updateToolBarAndPreview);
						documentDataService.documentParentService.unregisterSelectionChanged(disableBtnByParentChanged);
					}
					documentDataService.updatePreviewDocument.unregister(updatePreview);
					modelViewerCompositeModelObjectSelectionService.unregisterSelectionChanged(objectChange);

					uploadService.unregisterUploadStarting(onUploadStarting);
					uploadService.unregisterUploadDone(onUploadDone);
					uploadService.unregisterUploadCancelled(cancelLoading);
					uploadService.unregisterUploadError(cancelLoading);
					uploadService.unregisterUploadFinished(onUploadFinished);
					fileUploadDataService.filesHaveBeenUploaded.unregister(filesHaveBeenUploadedReaction);
					unregistParentGridCellClick();
					previewDocumentExtensionService.unregisterGridClick($scope, documentDataService);
				});

				$scope.isDisabled = function () {
					return documentDataService.isReadOnly && documentDataService.isReadOnly();

				};

			}]);
})(angular);