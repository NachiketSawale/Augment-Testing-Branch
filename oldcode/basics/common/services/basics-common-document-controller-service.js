(function (angular) {
	'use strict';

	const moduleName = 'basics.common';
	/**
	 * @ngdoc service
	 * @basicsCommonDocumentUploadController
	 * @Description
	 * For Documents Container: Is triggered when dragging and dropping documents from the Explorer and clicking the
	 * 'Upload and Create Document' tool-icon
	 *  createForUploadFile function must exist in data service
	 */
	angular.module(moduleName).factory('basicsCommonDocumentControllerService',
		['_', '$http', '$injector', '$translate', 'platformModalService', '$timeout',

			function BasicsCommonDocumentControllerService(_, $http, $injector, $translate, platformModalService, $timeout) {

				let service = {};
				service.initDocumentUploadController = function initDocumentUploadController($scope, service, gridFlag) {

					let dataService = service;
					let fileInfoArray = [];
					dataService.isDragOrSelect = 'drag';
					dataService.dragDropFileTargetGridId = gridFlag;

					$scope.containerHeaderInfo = {
						checkBoxChecked: false,
						extractZipFileTip: $translate.instant('basics.common.fileUpload.extractZipFileTip'),
						headerNotSaveError: $translate.instant('basics.common.errornotsavefile'),
					};

					function onFileUploaded(e, args) {
						if ((dataService.isDragOrSelect === 'drag' || dataService.isUploadCreateDocument === 'uploadcreate') && dataService.dragDropFileTargetGridId === gridFlag) {
							let fileInfoData = args.data;
							if (!!fileInfoData.FileArchiveDocId && !!fileInfoData.fileName && !!fileInfoData.file) {
								fileInfoArray.push(fileInfoData);
							}
						}
					}

					dataService.fileHasUploaded.register(onFileUploaded);

					let uploadService = dataService.getUploadService();
					if (angular.isFunction(dataService.unregisterUploadFinishedHandler)) {  // For BP Evaluation.
						dataService.unregisterUploadFinishedHandler();
						dataService.unregisterUploadFinishedHandler = null;
					}
					dataService.unregisterUploadFinishedHandler = uploadService.registerUploadFinished(onUploadFinished);

					function onUploadFinished() {
						if ((dataService.isDragOrSelect === 'drag' || dataService.isUploadCreateDocument === 'uploadcreate') && dataService.dragDropFileTargetGridId === gridFlag) { // the Document Project grid

							let uploadedFileDataArray = [];
							if ((!!fileInfoArray) && _.isArray(fileInfoArray) && fileInfoArray.length > 0) {
								_.forEach(fileInfoArray, function (fileInfo) {
									uploadedFileDataArray.push({
										FileArchiveDocId: fileInfo.FileArchiveDocId,
										FileName: fileInfo.fileName
									});
								});

								let extractZipOrNot = $scope.containerHeaderInfo.checkBoxChecked;
								let selectParentItemId = dataService.getSelectedParentId();

								let uploadConfigs = uploadService.options;
								let dupRoute = uploadConfigs.checkDuplicateByFileNameRoute;
								if (angular.isDefined(dupRoute) && _.isString(dupRoute) && dupRoute.length > 0) { // if requires duplicate check, eg. checklist document, procurement document.
									createDocumentsForUploadFilesWithDupCheck(selectParentItemId, uploadedFileDataArray, extractZipOrNot, uploadConfigs);
								} else {
									createDocumentsForUploadFiles({PKey1: selectParentItemId}, uploadedFileDataArray, extractZipOrNot, uploadConfigs);
								}

							}
						}
					}

					function createDocumentsForUploadFiles(identData, uploadedFileDataArray, extractZipOrNot, uploadConfigs) {
						dataService.createForUploadFiles(identData, uploadedFileDataArray, extractZipOrNot, uploadConfigs).then(function (res) {
							$injector.get('basicsCommonDocumentPreview3DViewerService').uploadPreviewModel(dataService, fileInfoArray);
							dataService.isDragOrSelect = null;
							dataService.isUploadCreateDocument = null;
							fileInfoArray = [];

							let isParentNotSaved = false;
							if (res && !!res.data) {
								let data = res.data;
								if (data.InvalidFileList && data.InvalidFileList.length > 0) {
									showInfoMessage(data.InvalidFileList);
								}
								// if parent entity is not saved, please set "IsParentNotSaved=true". eg. BP Evaluation. Document parent is saved by default.
								if (data.Options && data.Options.IsParentNotSaved) {
									if (data.Documents && _.isArray(data.Documents) && data.Documents.length > 0) {
										isParentNotSaved = true;
										dataService.addNewDocumentsToGrid(data.Documents);
									}
								}
							}
							if (!isParentNotSaved) {
								dataService.clearCache();
								dataService.load();
							}
						}, function () {
							dataService.isDragOrSelect = null;
							dataService.isUploadCreateDocument = null;
							fileInfoArray = [];
						});
					}

					function createDocumentsForUploadFilesWithDupCheck(selectParentItemId, uploadedFileDataArray, extractZipOrNot, uploadConfigs) {
						let roleService = dataService.parentEntityRoleService();
						roleService.updateAndExecute(function () {
							dataService.checkDuplicateFile(selectParentItemId, uploadedFileDataArray, extractZipOrNot, uploadConfigs).then(function (res) {
								let validFiles = [];
								let duplicateFiles = [];
								res.data.forEach(function (fileData, index) {
									if (!fileData.IsExist) {
										validFiles.push(fileData);
									} else {
										let item = {Id: index, Info: fileData.FileName};
										duplicateFiles.push(item);
									}
								});
								if (duplicateFiles.length > 0) {
									dataService.showInfoDialog(duplicateFiles).then(function (result) {
										let createFiles;
										if (result.yes) {
											createFiles = uploadedFileDataArray;
										} else {
											if (uploadedFileDataArray.length >= 1) {
												let fileArchiveDocIds = [];
												for (let i = 0; i < uploadedFileDataArray.length; i++) {
													fileArchiveDocIds.push(uploadedFileDataArray[i].FileArchiveDocId);
												}
												$http.post(globals.webApiBaseUrl + 'documents/projectdocument/deleteFiles', fileArchiveDocIds);
												fileInfoArray = [];
											}
											return;
										}
										createDocumentsForUploadFiles({PKey1: selectParentItemId}, createFiles, extractZipOrNot, uploadConfigs);
									});
								} else {
									createDocumentsForUploadFiles({PKey1: selectParentItemId}, uploadedFileDataArray, extractZipOrNot, uploadConfigs);
								}
							});
						});
					}

					function showInfoMessage(invalidFiles) {
						if (!!invalidFiles && _.isArray(invalidFiles) && invalidFiles.length > 0) {
							let errMsg;
							if (invalidFiles.length > 1) {
								let fileNames = invalidFiles.join('<br/>');
								errMsg = '<br/>' + $translate.instant('documents.project.FileUpload.validation.FileExtensionsErrorInfo') + ':<br/>' + fileNames;
							} else {
								errMsg = '<br/>' + $translate.instant('documents.project.FileUpload.validation.FileExtensionErrorInfo') + ':<br/>' + invalidFiles[0];
							}
							errMsg = '<div style=\'height:300px\'>' + errMsg + '</div>';
							platformModalService.showMsgBox(errMsg, 'documents.project.FileUpload.validation.FileExtensionErrorMsgBoxTitle', 'warning');
						}
					}

					$scope.$on('$destroy', function () {
						uploadService.unregisterUploadFinished(onUploadFinished);
						if (angular.isFunction(dataService.unregisterUploadFinishedHandler)) {  // For BP Evaluation.
							dataService.unregisterUploadFinishedHandler();
							dataService.unregisterUploadFinishedHandler = null;
						}
						dataService.fileHasUploaded.unregister(onFileUploaded);
					});
				};
				return service;
			}
		]);
})(angular);