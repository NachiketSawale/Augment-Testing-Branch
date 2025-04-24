/**
 * Created by pel on 12/30/2019.
 */

(function (angular) {
	'use strict';
	/* global ,_ */
	var moduleName = 'documents.centralquery';
	angular.module(moduleName).controller('documentCentralQueryRevisionController',
		[
			'globals',
			'$scope',
			'documentsProjectDocumentRevisionUIStandardService',
			'platformGridControllerService',
			'platformToolbarService',
			'documentsProjectDocumentModuleContext',
			'documentCentralQueryDataService',
			'documentsProjectDocumentRevisionDataService',
			'documentProjectCommonConfigControllerService',
			'$translate', 'platformModalService', 'documentsProjectDocumentFileUploadDataService',
			'$http', 'documentRevisionClipboardService', '$injector', 'cloudDesktopSidebarService',
			function (globals, $scope,
				gridColumns,
				gridControllerService,
				platformToolbarService,
				documentsProjectDocumentModuleContext,
				documentCentralQueryDataService,
				documentsProjectDocumentRevisionDataService,
				documentProjectCommonConfigControllerService,
				$translate, platformModalService, fileUploadDataService,
				$http, documentRevisionClipboardService, $injector, cloudDesktopSidebarService) {

				var config = documentsProjectDocumentModuleContext.getConfig();

				$scope.gridFlag = '684F4CDC782B495E9E4BE8E4A303D693';

				var revisionConfig = angular.copy(config);

				revisionConfig.parentService = documentCentralQueryDataService;

				var dataService = documentsProjectDocumentRevisionDataService.getService(revisionConfig);
				// used to get the latest data and refresh revision container
				// documentsProjectDocumentRevisionDataService.refreshGridService = dataService;

				dataService.isDragOrSelect = 'drag';
				dataService.dragDropFileTargetGridId = $scope.gridFlag;

				$scope.allowedFiles = [''];
				$scope.FileInfoArray = [];
				$scope.containerHeaderInfo = {
					checkBoxChecked: false,
					extractZipFileTip: $translate.instant('documents.project.FileUpload.extractZipFileTip')
				};
				// var uploadService = fileUploadDataService.getUploadService();
				var uploadService = dataService.getUploadService();
				// uploadService.registerUploadStarting(onUploadStarting);
				uploadService.registerUploadDone(onUploadDone);
				// uploadService.registerUploadCancelled(onUploadCancelled);
				// uploadService.registerUploadError(onUploadError);
				uploadService.registerUploadFinished(onUploadFinished);

				$scope.canDrop = function () {
					var selectedDocumentDto = fileUploadDataService.getDocumentSelectedItem();
					return !(selectedDocumentDto && (selectedDocumentDto.IsReadonly || !selectedDocumentDto.CanWriteStatus));
				};
				$scope.uploadFiles = function () {

				};

				function filesHaveBeenUploadedReaction(e, args) {
					if (dataService.isDragOrSelect === 'drag' && dataService.dragDropFileTargetGridId === $scope.gridFlag) {
						var fileInfoData = args.data;
						$scope.FileInfoArray.push(fileInfoData);
					}
				}

				dataService.filesHaveBeenUploaded.register(filesHaveBeenUploadedReaction);

				function onUploadDone() {

				}

				function onUploadFinished() {
					fileUploadDataService.dragedFilesHaveBeenUploaded.fire();
					fileUploadDataService.currentSelectedDocument = angular.copy(fileUploadDataService.getDocumentSelectedItem());
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
						if (dataService.isDragOrSelect === 'drag' && dataService.dragDropFileTargetGridId === $scope.gridFlag) {  // the Document Revision grid
							var extractZipOrNot = $scope.containerHeaderInfo.checkBoxChecked;
							fileUploadDataService.asynCreateDocumentRevisionForUploadFile(uploadedFileDataArray, extractZipOrNot).then(function (res) {
								if (!!res && !!res.data && angular.isArray(res.data) && res.data.length > 0) {
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
								$scope.FileInfoArray = [];
								if (res) {
									var filterRequest = angular.copy(cloudDesktopSidebarService.filterRequest);
									cloudDesktopSidebarService.filterRequest.pKeys = _.map(documentDataService.getList(), 'Id');
									documentDataService.refresh().then(function () {
										cloudDesktopSidebarService.filterRequest = filterRequest;
									});
								}
							}, function () {
								$scope.FileInfoArray = [];
							});
						}
					}
				}

				function validationFiles(files) {
					if (!(files && files.length && files.length > 0)) {
						platformModalService.showMsgBox($translate.instant('documents.project.FileUpload.validation.FileUnValid'),
							$translate.instant('documents.project.FileUpload.validation.FileExtensionErrorMsgBoxTitle'), 'ico-error');
						return false;
					} else {
						var result = !!fileUploadDataService.getDocumentSelectedItem();
						if (result === false) {
							var errMsg = $translate.instant('documents.project.FileUpload.validation.NoDocumentEntitySelectedTip');
							platformModalService.showMsgBox(errMsg,
								$translate.instant('documents.project.FileUpload.validation.NoDocumentEntitySelected'), 'ico-error');
						}
						return result;
					}
				}

				$scope.fileDropped = function (files) {
					fileUploadDataService.isDragOrSelect = 'drag';
					fileUploadDataService.dragDropFileTargetGridId = $scope.gridFlag;
					if (validationFiles(files)) {
						var selectedDocumentDto = fileUploadDataService.getDocumentSelectedItem();
						var basDocumentTypeId = selectedDocumentDto.DocumentTypeFk;
						// if has not revision yet, then can upload any type documents which type was supported by the system
						if (selectedDocumentDto.HasDocumentRevision <= 0) {
							basDocumentTypeId = null;
						}
						var extractZipOrNot = $scope.containerHeaderInfo.checkBoxChecked;
						fileUploadDataService.onFileSelected($scope, files, basDocumentTypeId, extractZipOrNot);
					}
				};

				gridControllerService.initListController($scope, gridColumns, dataService, {},
					{
						type: 'documentRevision',
						dragDropService: documentRevisionClipboardService
					});

				// drag one drive file --------------------------
				function copyFileToDocument(oneDriveItems) {
					var documentDataService = fileUploadDataService.getDocumentDataService();
					var uploadedFileDataArray = [];
					if (oneDriveItems && oneDriveItems.length > 0) {
						angular.forEach(oneDriveItems, function (fileInfo) {
							uploadedFileDataArray.push({
								FileArchiveDocId: fileInfo.FileArchiveDocId,
								FileName: fileInfo.OriginalFileName,
								LastModified: fileInfo.LastModified
							});
						});
						var extractZipOrNot = $scope.containerHeaderInfo.checkBoxChecked;
						fileUploadDataService.asynCreateDocumentRevisionForUploadFile(uploadedFileDataArray, extractZipOrNot).then(function (res) {
							if (!!res && !!res.data && angular.isArray(res.data) && res.data.length > 0) {
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
							documentDataService.refresh();
						}, function () {
						});
					}
				}

				var origCanDrop = $scope.ddTarget.canDrop;
				$scope.ddTarget.canDrop = function (info) {
					if (info.draggedData && info.draggedData.sourceGrid && _.includes(['oneDrive', 'outlook'], info.draggedData.sourceGrid.type)) {
						// return config.parentService.hasSelection();

						var validate = true;
						var oneDriveItems = info.draggedData.sourceGrid.data;
						if (validationFiles(oneDriveItems)) {
							var selectedDocumentDto = fileUploadDataService.getDocumentSelectedItem();
							var basDocumentTypeId = selectedDocumentDto.DocumentTypeFk;
							var extractZipOrNot = $scope.containerHeaderInfo.checkBoxChecked;
							validate = fileUploadDataService.validateFileExtension($scope, oneDriveItems, basDocumentTypeId, extractZipOrNot);
						} else {
							validate = false;
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
					if (info.draggedData && info.draggedData.sourceGrid && info.draggedData.sourceGrid.type === 'oneDrive') { // code that determines whether the dragged data can be handled

						var oneDriveItems = info.draggedData.sourceGrid.data;

						var documentRevisions = dataService.getList();

						var lodash = $injector.get('_');

						var postData = [];
						angular.forEach(oneDriveItems, function (driveItem) {
							var found = lodash.find(documentRevisions, function (doc) {
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
							.then(function (response) {
								console.log(response);
								if (response && response.data && response.data.Success &&
									response.data.CopiedFiles && response.data.CopiedFiles.length > 0) {

									copyFileToDocument(response.data.CopiedFiles);
								}
							});
					} else if (info.draggedData && info.draggedData.sourceGrid && info.draggedData.sourceGrid.type === 'outlook'){
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

				documentCentralQueryDataService.lockOrUnlockUploadBtnAndGrid.register(lockOrUnlockUploadBtnAndGrid);
				var tools = [];

				function initGrid($scope, dataService) {
					$injector.get('basicsCommonDocumentPreview3DViewerService').addModelStatusInGrid($scope, dataService);
					if (tools.length === 0) {
						tools = documentProjectCommonConfigControllerService.initialUploadController($scope, dataService);
						if (tools.length > 0) {
							$scope.addTools(tools);
						}
					} else {
						// $scope.addTools(tools);
						$scope.updateTools();
					}
					$scope.setTools({
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: documentsProjectDocumentRevisionDataService.toolBarHandler($scope.getContainerUUID())
					});
					if (!!$scope && !!$scope.$parent && !!$scope.$parent.tools && !!$scope.$parent.tools.items) {
						var deleteBtn = _.find($scope.$parent.tools.items, function (item) {
							return item.id === 'delete';
						});
						if (deleteBtn !== null && deleteBtn !== undefined) {
							deleteBtn.fn = function () {
								var selectedEntities = dataService.getSelectedEntities();
								if (selectedEntities !== null && selectedEntities !== undefined) {
									var ids = _.map(selectedEntities, function (item) {
										return item.Id;
									});
									if (!!ids && angular.isArray(ids)) {
										$http.post(globals.webApiBaseUrl + 'documentsproject/revision/deleteDocumentRevisions', ids).then(function () {
											// fileUploadDataService.roadRevisionsToContainer();
											// dataService.deleteEntities(selectedEntities);
											documentCentralQueryDataService.refresh();
										});
									}
								}
							};
						}
					}
					var checkResulet = null;
					var selectedDocumentEntity = documentCentralQueryDataService.getSelected();
					if (selectedDocumentEntity) {
						if (selectedDocumentEntity.PrjDocumentFk === 0 || selectedDocumentEntity.PrjDocumentFk === null) {
							checkResulet = {needToLockOrUnlock: true, lockOrUnlock: 'unlock'};
						} else {
							checkResulet = {needToLockOrUnlock: true, lockOrUnlock: 'lock'};
						}
					} else {
						checkResulet = {needToLockOrUnlock: true, lockOrUnlock: 'lock'};
					}
					documentCentralQueryDataService.lockOrUnlockUploadBtnAndGrid.fire(null, {lockOrUnlock: checkResulet.lockOrUnlock});
					initialUploadProgress($scope, dataService);
				}


				function initialUploadProgress($scope, dataService) {
					$scope.uploadServiceKey = dataService.getUploadServiceKey();

					$scope.progressBarOptions = provideProgressBar();

					function provideProgressBar() {
						if ($scope.progressBarOptions) {
							return $scope.progressBarOptions;
						} else {
							return {
								fileNameVisible: true,
								cancelButtonVisible: true,
								selectionStatusVisible: true,
								useFixedWidth: true
							};
						}
					}
				}

				initGrid($scope, dataService);

				function updateTooBarAndPreview() {
					documentProjectCommonConfigControllerService.previewDocument($scope, dataService, false);
					initGrid($scope, dataService);
				}

				function lockOrUnlockUploadBtnAndGrid(e, lockOrUnlock) {
					dataService.lockOrUnlockUploadBtnAndGridFlag = lockOrUnlock;
					$scope.tools.version += 1;
				}

				dataService.registerSelectionChanged(updateTooBarAndPreview);

				$scope.$on('$destroy', function () {
					dataService.unregisterSelectionChanged(updateTooBarAndPreview);
					documentCentralQueryDataService.lockOrUnlockUploadBtnAndGrid.unregister(lockOrUnlockUploadBtnAndGrid);
					uploadService.unregisterUploadDone(onUploadDone);
					uploadService.unregisterUploadFinished(onUploadFinished);
					fileUploadDataService.filesHaveBeenUploaded.unregister(filesHaveBeenUploadedReaction);
				});
			}]);
})(angular);
