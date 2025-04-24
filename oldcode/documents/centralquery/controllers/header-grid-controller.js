/**
 * Created by pel on 12/27/2019.
 */

(function (angular) {
	'use strict';
	/* global ,_ */
	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName = 'documents.centralquery';
	angular.module(moduleName).controller('documentCentralQueryHeaderGridController',
		['$scope', '$translate', 'platformGridControllerService', 'documentCentralQueryDataService', 'documentProjectHeaderUIStandardService',
			'documentsProjectDocumentReadonlyProcessor', 'cloudDesktopSidebarService', 'documentProjectHeaderValidationService', 'documentsProjectDocumentFileUploadDataService',
			'basicsLookupdataLookupDefinitionService', 'platformModalService', 'basicsLookupdataLookupDescriptorService', 'documentProjectClipboardService',
			'$injector', 'documentProjectCommonConfigControllerService', 'basicsPermissionServiceFactory', 'platformPermissionService', 'modelViewerStandardFilterService', 'modelViewerDragdropService', 'modelViewerCompositeModelObjectSelectionService', 'documentsProjectModelObjectDataService',
			'platformGridAPI', 'documentsCentralQuaryGotoDropDown', 'basicsCommonServiceUploadExtension', 'basicsCommonUploadDownloadControllerService','platformDataServiceConfiguredCreateExtension','cloudDesktopPinningContextService',
			function ($scope, $translate, gridControllerService, dataService, gridColumns, documentsProjectDocumentReadonlyProcessor, cloudDesktopSidebarService, documentProjectHeaderValidationService,
				fileUploadDataService, basicsLookupdataLookupDefinitionService, platformModalService, basicsLookupdataLookupDescriptorService,
				documentProjectClipboardService, $injector, documentProjectCommonConfigControllerService,
				basicsPermissionServiceFactory, platformPermissionService, modelViewerStandardFilterService, modelViewerDragdropService, modelViewerCompositeModelObjectSelectionService, documentsProjectModelObjectDataService,
				platformGridAPI, documentsCentralQuaryGotoDropDown, basicsCommonServiceUploadExtension, basicsCommonUploadDownloadControllerService,platformDataServiceConfiguredCreateExtension,cloudDesktopPinningContextService) {

				var documentProjectPermissionService = basicsPermissionServiceFactory.getService('documentProjectPermissionDescriptor');
				fileUploadDataService.getSupportedMimeTypeMapping();
				basicsLookupdataLookupDefinitionService.load(['documentsProjectHasDocumentRevisionCombobox']);

				$scope.gridFlag = '4EAA47C530984B87853C6F2E4E4FC67E';
				$scope.allowedFiles = [''];
				$scope.FileInfoArray = [];
				dataService.isDragOrSelect = 'drag';
				dataService.dragDropFileTargetGridId = $scope.gridFlag;
				// var uploadService = fileUploadDataService.getUploadService();
				var uploadService = dataService.getUploadService();
				uploadService.registerUploadStarting(onUploadStarting);
				uploadService.registerUploadDone(onUploadDone);
				uploadService.registerUploadCancelled(cancelLoading);
				uploadService.registerUploadError(cancelLoading);
				// uploadService.registerStartUploadProgress(onStartUploadProgress);
				uploadService.registerUploadFinished(onUploadFinished);
				// need this function?
				// $scope.uploadFiles = function () {
				//
				// };
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
				function onStartUploadProgress() {
					var documentDataService = dataService.getDocumentDataService();
					if (!!dataService.isDragOrSelect && dataService.isDragOrSelect === 'drag') {
						documentDataService.showUploadFilesProgress($scope);
					}
				}

				function filesHaveBeenUploadedReaction(e, args) {
					if (dataService.isDragOrSelect === 'drag' && dataService.dragDropFileTargetGridId === $scope.gridFlag) {
						var fileInfoData = args.data;
						if (!!fileInfoData.FileArchiveDocId && !!fileInfoData.fileName && !!fileInfoData.file) {
							$scope.FileInfoArray.push(fileInfoData);
						}
					}
				}

				function clearFileInfoArray() {
					$scope.FileInfoArray = [];
				}

				dataService.filesHaveBeenUploaded.register(filesHaveBeenUploadedReaction);
				dataService.filesClear.register(clearFileInfoArray);

				function onUploadDone() {

				}

				$scope.$on('clearFileInfoArray', function() {
					$scope.FileInfoArray = [];
				});

				function onUploadFinished() {
					cancelLoading();
					fileUploadDataService.dragedFilesHaveBeenUploaded.fire();
					dataService.extractZipOrNot = $scope.containerHeaderInfo.checkBoxChecked;
					var uploadedFileDataArray = [];
					if ((!!$scope.FileInfoArray) && angular.isArray($scope.FileInfoArray) && $scope.FileInfoArray.length > 0) {
						angular.forEach($scope.FileInfoArray, function (fileInfo) {
							uploadedFileDataArray.push({
								FileArchiveDocId: fileInfo.FileArchiveDocId,
								FileName: fileInfo.fileName,
								LastModified: fileInfo.file.lastModified
							});
						});
						if (dataService.isSingle === true) {
							var revisionDataService = fileUploadDataService.getDocumentRevisionDataService();
							if (revisionDataService){
								fileUploadDataService.currentSelectedDocument = angular.copy(fileUploadDataService.getDocumentSelectedItem());
								fileUploadDataService.currentRevisionList = angular.copy(revisionDataService.getList());
							}
							dataService.update().then(function () {
								var extractZipOrNot_ = $scope.containerHeaderInfo.checkBoxChecked;
								fileUploadDataService.asynCreateDocumentRevisionForUploadFile(uploadedFileDataArray, extractZipOrNot_).then(function (res) {
									if (res) {
										var filterRequest = angular.copy(cloudDesktopSidebarService.filterRequest);
										cloudDesktopSidebarService.filterRequest.pKeys = _.map(dataService.getList(), 'Id');
										dataService.refresh().then(function () {
											cloudDesktopSidebarService.filterRequest = filterRequest;
										});
									}
									$scope.FileInfoArray = [];
								}, function () {
									$scope.FileInfoArray = [];
								});
							});
						} else {
							if (dataService.isDragOrSelect === 'drag' && dataService.dragDropFileTargetGridId === $scope.gridFlag) { // the Document Project grid
								let extractZipOrNot = $scope.containerHeaderInfo.checkBoxChecked;
								let checkSameContextDialogService = $injector.get('documentProjectDocumentUploadCheckSameContextDialogService');
								let contextDialogDto = {};
								let paramData = {};
								checkSameContextDialogService.getGroupingFilterFieldKey(contextDialogDto);
								if (!_.isEmpty(contextDialogDto)) {
									let ParentEntityInfo = {};
									let ColumnConfig = [];
									for (let dtoItem in contextDialogDto) {
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
								if(!platformDataServiceConfiguredCreateExtension.hasToUseConfiguredCreate(dataService.getServiceContainer().data)) {
									createDocumentOrUpdateRevision(uploadedFileDataArray, extractZipOrNot,dataService.getSelected(),paramData.ParentEntityInfo,paramData.ColumnConfig);
								}else{
									let docItem = dataService.getSelected();
									dataService.uploadedFileData = uploadedFileDataArray;
									let postData = [], postItem = {}, mainField = null;
									if (uploadedFileDataArray) {
										_.forEach(uploadedFileDataArray, function (fileItem) {
											let item = angular.copy(postItem);
											item.OriginFileName = fileItem.FileName;
											item.FileArchiveDocFk = fileItem.FileArchiveDocId;
											if(paramData.ColumnConfig) {
												paramData.ColumnConfig.forEach(function (field) {
													const {DocumentField, DataField} = field;
													if (paramData.ParentEntityInfo.hasOwnProperty(DataField)) {
														item[DocumentField] = paramData.ParentEntityInfo[DataField];
													} else {
														item[DocumentField] = null;
													}
												});
											}
											postData.push(item);
										});
									}
									let param = {Documents: postData, IsZip: extractZipOrNot, HeaderField: mainField ,moduleName:'documents.centralquery'};
									checkSameContextDialogService.validationFile(param).then(function (response) {
										var existsData = (response && response.data) ? response.data : response;
										if (existsData && existsData.length === postData.length) {
											createDocumentOrUpdateRevision(uploadedFileDataArray, extractZipOrNot,docItem,paramData.ParentEntityInfo,paramData.ColumnConfig,true);
										}else{
											dataService.createItem(docItem, dataService.getServiceContainer().data);
										}
									});
								}
							}
						}
					}
				}

				function createDocumentOrUpdateRevision(uploadedFileDataArray,extractZipOrNot,record,parentEntityInfo,columnConfig,isFromDataConfig) {
					fileUploadDataService.asyncCreateDocumentOrUpdateRevision(uploadedFileDataArray, extractZipOrNot,record,parentEntityInfo,columnConfig,isFromDataConfig).then(function (res) {
						if (!!res && !!res.data && !!res.invalidFiles && angular.isArray(res.data.invalidFiles) && res.data.invalidFiles.length > 0) {
							var errMsg;
							if (res.data.length > 1) {
								var fileNames = res.data.join('<br/>');
								errMsg = '<br/>' + $translate.instant('documents.project.FileUpload.validation.FileExtensionsErrorInfo') + ':<br/>' + fileNames;
							} else {
								errMsg = '<br/>' + $translate.instant('documents.project.FileUpload.validation.FileExtensionErrorInfo') + ':<br/>' + res.data[0];
							}
							errMsg = '<div style=\'height:300px\'>' + errMsg + '</div>';
							platformModalService.showMsgBox(errMsg, 'documents.project.FileUpload.validation.FileExtensionErrorMsgBoxTitle', 'warning');
						}
						if(!!res && !!res.data && res.data.invalidFiles && res.data.invalidFiles.length > 0 && res.data.dtos.length === 0){
							platformModalService.showMsgBox('documents.project.errRubricCategoryRestricted', 'documents.project.errRubricCategoryRestrictedTitle', 'ico-error');
						}

						if (!!res && !!res.data && !!res.data.dtos) {
							const resData = res.data.dtos;

							const docItemList = dataService.getList();
							let refreshItem = [];
							_.forEach(resData, function (docDto) {
								const docItem = docItemList.find(e => e.Id === docDto.Id);
								if (!docItem) {
									docItemList.push(docDto);
								}
								refreshItem.push(docDto);
							});
							dataService.gridRefresh();
							dataService.setSelectedEntities(refreshItem);
							dataService.refreshSelectedEntities().then(function () {
								dataService.setSelected(docItemList[docItemList.length-1]);
								dataService.gridRefresh();
							});
							dataService.resetUploadData();
						}
					}).finally(()=>{
						$scope.FileInfoArray = [];
					});
				}

				function validationFiles(files) {
					if (!(files && files.length && files.length > 0)) {
						platformModalService.showMsgBox($translate.instant('documents.project.FileUpload.validation.FileUnValid'),
							$translate.instant('documents.project.FileUpload.validation.FileExtensionErrorMsgBoxTitle'), 'ico-error');
						return false;
					}
					return true;
					// else{
					//     var moduleName=config.moduleName;
					//     var result=!!fileUploadDataService.getSelectedParentItem();
					//     if(result===false){
					//         var errMsg=$translate.instant('documents.project.FileUpload.validation.NoHeaderEntitySelectedTip',{ModuleName:moduleName});
					//         platformModalService.showMsgBox(errMsg,
					//             $translate.instant('documents.project.FileUpload.validation.NoHeaderSelected'), 'ico-error');
					//     }
					//     return result;
					// }
				}


				// load the DocumentType
				basicsLookupdataLookupDescriptorService.loadData(['DocumentType', 'DocumentStatus']);



				// documentDataService.updatePreviewDocument.register(updatePreview);

				gridControllerService.initListController($scope, gridColumns, dataService, documentProjectHeaderValidationService,
					{
						initCalled: false,
						columns: [],
						type: 'modelMainObjectDataService',
						dragDropService: documentProjectClipboardService,
						extendDraggedData: function (draggedData) {
							draggedData.modelDataSource = documentProjectClipboardService.myDragdropAdapter;
						}
					});

				//  gridControllerService.initListController($scope, gridColumns, dataService, documentCentreValidationService, gridConfig);

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

				// drag one drive or outlook file --------------------------
				let origCanDrop = $scope.ddTarget.canDrop;
				$scope.ddTarget.canDrop = function (info) {
					if ($scope.containerHeaderInfo.loading) {
						return false;
					}

					if (info.draggedData && info.draggedData.draggingFromViewer) {
						return !!dataService.getSelected();
					} else if (info.draggedData && info.draggedData.sourceGrid && _.includes(['oneDrive', 'outlook'], info.draggedData.sourceGrid.type)) {
						// return config.parentService.hasSelection();

						let validate = true;

						let dragItems = info.draggedData.sourceGrid.data;
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

				// $scope.progressBarOptions = {
				// fileNameVisible: false,
				// cancelButtonVisible: true,
				// //selectionStatusVisible: true,
				// useFixedWidth: false,
				// canCancelUpload:false
				// };

				var origDrop = $scope.ddTarget.drop;
				$scope.ddTarget.drop = function (info) {

					if (info.draggedData && info.draggedData.draggingFromViewer) {
						var documents = dataService.getSelectedEntities();
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
							var documentModelService = documentsProjectModelObjectDataService.getService({
								moduleName: moduleName,
								parentService: dataService
							});
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

						var docs = dataService.getList();

						var lodash = $injector.get('_');

						var postData = [];
						angular.forEach(oneDriveItems, function(driveItem) {
							var found = lodash.find(docs, function(doc) {
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
							? outlookAttachmentService.getAttachmentById(info.draggedData.sourceGrid.itemService.graphClient, messageId, _.map(attachments, 'id')[0])
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

				function initGrid($scope) {
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
					}
					if (!!$scope && !!$scope.$parent && !!$scope.$parent.tools && !!$scope.$parent.tools.items) {
						var newBtn = _.find($scope.$parent.tools.items, function (item) {
							return item.id === 'create';
						});
						if (newBtn !== null && newBtn !== undefined) {
							newBtn.caption = $translate.instant(moduleName + '.createButtonCaption');
						}
					}
					_.remove($scope.tools.items, function (item) {
						return item.id === 'cancelUpload';
					});
				}

				initGrid($scope, dataService);
				basicsCommonUploadDownloadControllerService.initGrid($scope, dataService);

				function updateToolsBar() {
					initGrid($scope, dataService);
					$scope.fileDropped = fileDropped;
					$scope.canDrop = canDrop;
					_.remove($scope.tools.items, function (item) {
						return item.id === 'cancelUpload';
					});
				}

				$scope.fileDropped = fileDropped;

				function fileDropped(files) {
					var documentDataService = fileUploadDataService.getDocumentDataService();
					documentDataService.isDragOrSelect = 'drag';
					documentDataService.dragDropFileTargetGridId = $scope.gridFlag;
					if (validationFiles(files)) {
						documentDataService.onFileSelected($scope, files);
					}
				}

				$scope.canDrop =canDrop;
				function canDrop() {
					if ($scope.containerHeaderInfo.loading) {
						return false;
					}
					var selectedDocumentDto = fileUploadDataService.getDocumentSelectedItem();
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

				$scope.containerHeaderInfo = {
					checkBoxChecked: false,
					extractZipFileTip: $translate.instant('documents.project.FileUpload.extractZipFileTip'),
					prefix: $translate.instant(''),
					currentModuleName: '',
					headerNotSaveError: $translate.instant('basics.common.errornotsavefile'),
					loading: false
				};

				function updatePreview(defaultEntity) {
					documentProjectCommonConfigControllerService.previewDocument($scope, dataService, false, defaultEntity);
				}

				// function updataDocument(entities){
				//     if (!entities.hasOwnProperty('ProjectDocument')) {
				//         if(!documentDataService.update){
				//             return;
				//         }
				//         if(documentDataService.isNeedUpdateSelf){
				//             $timeout(function(){
				//                 documentDataService.update();
				//             },800);
				//         }
				//
				//     }
				// }

				function updateGotoButton() {
					documentsCentralQuaryGotoDropDown.updateNavItem($scope);
				}

				function updateToolBarAndPreview() {
					updateGotoButton();
					updatePreview();
					updateToolsBar();
				}

				dataService.registerSelectionChanged(updateToolBarAndPreview);
				dataService.registerItemModified(updateToolBarAndPreview);
				dataService.registerSelectionChanged(updatePermission);
				// basicsCommonServiceUploadExtension.initGrid($scope,dataService,)

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'documentCentralQueryDataService');

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
				$scope.$on('$destroy', function () {
					// documentDataService.documentParentService.unregisterUpdateDataExtensionEvent(updataDocument);
					// rootService.unregisterUpdateDataExtensionEvent(updataDocument);
					dataService.unregisterSelectionChanged(updateToolBarAndPreview);
					dataService.updatePreviewDocument.unregister(updatePreview);
					dataService.unregisterSelectionChanged(updatePermission);
					modelViewerCompositeModelObjectSelectionService.unregisterSelectionChanged(objectChange);

					uploadService.unregisterUploadStarting(onUploadStarting);
					uploadService.unregisterUploadDone(onUploadDone);
					uploadService.unregisterUploadCancelled(cancelLoading);
					uploadService.unregisterUploadError(cancelLoading);
					uploadService.unregisterUploadFinished(onUploadFinished);
					fileUploadDataService.filesHaveBeenUploaded.unregister(filesHaveBeenUploadedReaction);
					uploadService.unregisterUploadStarting(onStartUploadProgress);
				});

				$scope.isDisabled = function () {
					return false;
					// return documentDataService.isReadOnly && documentDataService.isReadOnly();

				};

				function updatePermission(e, selected) {
					if (!selected || selected.PermissionObjectInfo === '') {
						return;
					}
					documentProjectPermissionService.setPermissionObjectInfo(selected.PermissionObjectInfo);
				}

			}]
	);
})(angular);
