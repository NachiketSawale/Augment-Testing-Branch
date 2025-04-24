/**
 * Created by lja on 2016-2-3.
 */
(function (angular) {
	'use strict';
	var moduleName = 'documents.project';
	angular.module(moduleName).factory('documentsProjectFileHandlerConfigurations',
		['$translate',
			function ($translate) {
				return {
					'fid': 'documents.project.fileUpload',
					'version': '1.1.0',
					'showGrouping': false,
					'groups': [
						{
							'gid': 'fileUpload',
							'header': 'fileUpload',
							'isOpen': true,
							'visible': true,
							'sortOrder': 1
						}
					],
					'rows': [
						{
							'gid': 'fileUpload',
							'rid': 'FileUpload',
							'label': $translate.instant('documents.project.FileUpload.FileUpload'),
							'type': 'directive',
							'directive': 'documents-project-file-upload-lookup',
							'options': {
								showClearButton: false
							}
						}
					]
				};
			}]
	);

	angular.module(moduleName).factory('SingleDocumentsProjectFileHandlerConfigurations',
		['$translate',
			function ($translate) {
				return {
					'fid': 'documents.project.fileUpload',
					'version': '1.1.0',
					'showGrouping': false,
					'groups': [
						{
							'gid': 'fileUpload',
							'header': 'fileUpload',
							'isOpen': true,
							'visible': true,
							'sortOrder': 1
						}
					],
					'rows': [
						{
							'gid': 'fileUpload',
							'rid': 'FileUpload',
							'label': $translate.instant('documents.project.FileUpload.FileUpload'),
							'type': 'directive',
							'directive': 'single-documents-project-file-upload-lookup',
							'options': {
								showClearButton: false
							}
						}
					]
				};
			}]
	);

	angular.module(moduleName).controller('documentsProjectFileHandlerController',
		[
			'_',
			'globals',
			'moment',
			'$scope',
			'$translate',
			'documentsProjectFileHandlerConfigurations',
			'documentsProjectDocumentFileUploadDataService',
			'basicsCommonUploadDownloadControllerService',
			'platformModalService',
			'SingleDocumentsProjectFileHandlerConfigurations',
			'documentsProjectDocumentModuleContext',
			'$injector', 'cloudDesktopSidebarService',
			function (_, globals, moment,$scope, $translate, config, fileUploadDataService, basicsCommonUploadDownloadControllerService,
				platformModalService, singleConfig, moduleContext, $injector, cloudDesktopSidebarService) {

				var errorType = {info: 1, error: 3},
					showError = function (isShow, message, type) {
						$scope.error = {
							show: isShow,
							messageCol: 1,
							message: message,
							type: type
						};
					};

				$scope.fileUploadEntity = {
					FileInfo: null
				};

				$scope.modalOptions = {
					parentScope: $scope.modalOptions.scope,
					gridFlag: $scope.gridFlag,
					headerText: $translate.instant('documents.project.FileUpload.dialog.title'),
					body: {
						formOptions: {
							configure: config,
							validationMethod: angular.noop
						},
						formOptionsSingle: {
							configure: singleConfig,
							validationMethod: angular.noop
						}

					},
					footer: {
						okBtn: $translate.instant('cloud.common.ok'),
						cancelBtn: $translate.instant('cloud.common.cancel'),
						onOK: function (uploadType) {
							var documentDataService = fileUploadDataService.getDocumentDataService();
							var moduleConfig = moduleContext.getConfig();
							if (moduleConfig.moduleName === 'documents.centralquery') {
								documentDataService = $injector.get('documentCentralQueryDataService');
							}
							if (uploadType === 'single') {
								if (validationModel()) {

									$scope.modalOptions.loading.dialogLoading = true;
									var documentType = fileUploadDataService.getDocumentType($scope.fileUploadEntity.FileInfo[0]);
									var selectedDocument = documentDataService.getSelected();
									if (selectedDocument !== undefined) {
										// var uploadEntity = $scope.fileUploadEntity;
										var errMsg = $translate.instant('documents.project.FileUpload.validation.FileExtensionErrorInfo');
										if (selectedDocument.HasDocumentRevision > 0 && selectedDocument.DocumentTypeFk !== documentType.Id) {
											errMsg = errMsg + ':' + $scope.fileUploadEntity.FileInfo[0].fileName;
											platformModalService.showDialog({
												templateUrl: globals.appBaseUrl + 'documents.project' + '/partials/invalid-files-list.html',
												headerText: $translate.instant('documents.project.FileUpload.validation.FileExtensionErrorMsgBoxTitle'),
												content: errMsg,
												scope: $scope,
												backdrop: false
											});
											closeLoading();
											return;
										}
									}

									var documentInfo = {
										Id: selectedDocument.Id,
										Description: $scope.fileUploadEntity.FileInfo[0].fileName,
										DocumentCategoryFk: 0,
										LoggerInfo: ''
									};
									var documentCategoryFk = 0;
									fileUploadDataService.getDocumentCategory(documentInfo).then(function (data) {
										if (data && data.DocumentCategoryFk !== 0) {
											documentCategoryFk = data.DocumentCategoryFk;
										} else if (data) {
											console.log(data.LoggerInfo);
										}

										fileUploadDataService.createNewRevision().then(function (revisionEntity) {
											revisionEntity.Barcode = $scope.fileUploadEntity.BarCode;
											revisionEntity.CommentText = $scope.fileUploadEntity.Comment;

											// modify document item
											var documentItem = fileUploadDataService.getDocumentSelectedItem();
											documentItem.Barcode = $scope.fileUploadEntity.BarCode;
											var fileName = $scope.fileUploadEntity.FileInfo[0].fileName;
											if (fileName.length > 252) {
												documentItem.Description = fileName.substr(0, 252);
												revisionEntity.Description = fileName.substr(0, 252);
											} else {
												documentItem.Description = fileName;
												revisionEntity.Description = fileName;
											}
											if ($scope.fileUploadEntity.Comment !== undefined && $scope.fileUploadEntity.Comment !== '') {
												documentItem.CommentText = $scope.fileUploadEntity.Comment;
											}
											documentItem.FileArchiveDocFk = $scope.fileUploadEntity.FileInfo[0].FileArchiveDocId;
											documentItem.OriginFileName = $scope.fileUploadEntity.FileInfo[0].fileName;
											documentItem.Revision = revisionEntity.Revision;

											if (documentType) {
												var documentTypes = $injector.get('basicsLookupdataLookupDescriptorService').getData('DocumentType');
												var foundDocType = _.find(documentTypes, {Id: documentItem.DocumentTypeFk});
												documentItem.DocumentTypeFk = documentType.Id;
												if (documentItem.OriginFileName) {
													var suffix = _.toLower(documentItem.OriginFileName.substr(documentItem.OriginFileName.lastIndexOf('.'), documentItem.OriginFileName.length - 1));
													if (foundDocType && foundDocType.Extention !== null && (foundDocType.Extention.indexOf(suffix) !== -1 || suffix.indexOf(foundDocType.Extention) !== -1)) {
														documentItem.DocumentTypeFk = foundDocType.Id;
													}
												}
											}

											if (documentCategoryFk !== 0) {
												documentItem.PrjDocumentCategoryFk = documentCategoryFk;
											}

											if (moduleConfig.moduleName === 'transportplanning.transport') {
												var parentNode = documentDataService.getCurrentSelectedItem();
												documentItem.LgmJobFk = parentNode.JobDefFk;
												documentItem.PrjProjectFk = parentNode.ProjectDefFk;
											}

											// documentItem.DocumentTypeFk = 0;//$scope.fileUploadEntity.FileInfo.fileType
											fileUploadDataService.documentSingleDoUpdate(documentItem).then(function () {

												closeLoadingAndDialog();
												// in case of fileName lost
												documentItem.OriginFileName = $scope.fileUploadEntity.FileInfo[0].fileName;
												// var documentDataService = fileUploadDataService.getDocumentDataService();
												var filterRequest = angular.copy(cloudDesktopSidebarService.filterRequest);
												cloudDesktopSidebarService.filterRequest.pKeys = _.map(documentDataService.getList(), 'Id');
												documentDataService.refresh().then(function () {
													cloudDesktopSidebarService.filterRequest = filterRequest;
												});
												// documentDataService.refresh();
											}, function () {
												closeLoadingAndDialog();
											});
										}, function () {
											closeLoadingAndDialog();
										});
									});
								}
							} else {
								if (validationModel() && fileUploadDataService.isDragOrSelect === 'select') {
									// var documentDataService = fileUploadDataService.getDocumentDataService();
									var uploadedFileDataArray = [];
									var gridFlag = $scope.gridFlag;
									if ((!!$scope.fileUploadEntity.FileInfo) && angular.isArray($scope.fileUploadEntity.FileInfo) && $scope.fileUploadEntity.FileInfo.length > 0) {
										angular.forEach($scope.fileUploadEntity.FileInfo, function (fileInfo) {
											uploadedFileDataArray.push({
												FileArchiveDocId: fileInfo.FileArchiveDocId,
												FileName: fileInfo.fileName,
												LastModified: fileInfo.file.lastModified
											});
										});
										var extractZipOrNot = null;
										var moduleName = null;
										if (gridFlag === '4EAA47C530984B87853C6F2E4E4FC67E') { // the Document Project grid
											$scope.modalOptions.loading.dialogLoading = true;
											extractZipOrNot = $scope.modalOptions.parentScope.containerHeaderInfo.checkBoxChecked;
											fileUploadDataService.asynCreateDocumentProjectAndDocumentRevisionForUploadFile(uploadedFileDataArray, extractZipOrNot, moduleName).then(function (res) {
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
												fileUploadDataService.isDragOrSelect = null;
												$scope.fileUploadEntity.FileInfo = [];
												var container = documentDataService.getServiceContainer();
												if (!!res && !!res.data && !!res.data.dtos) {
													if (res.data.aiInfo !== '') {
														console.log(res.data.aiInfo);
													}
													angular.forEach(res.data.dtos, function (dto) {
														dto.DocumentDate = moment.utc(dto.DocumentDate);
														container.data.itemList.push(dto);
													});
													documentDataService.setSelected(res.data.dtos[0]);
													documentDataService.gridRefresh();
												}
												closeLoadingAndDialog();
											}, function () {
												fileUploadDataService.isDragOrSelect = null;
												$scope.fileUploadEntity.FileInfo = [];
												closeLoadingAndDialog();
											});
										} else if (gridFlag === '684F4CDC782B495E9E4BE8E4A303D693') {  // the Document Revision grid
											$scope.modalOptions.loading.dialogLoading = true;
											extractZipOrNot = $scope.modalOptions.parentScope.containerHeaderInfo.checkBoxChecked;
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
												fileUploadDataService.isDragOrSelect = null;
												$scope.fileUploadEntity.FileInfo = [];
												documentDataService.refresh();
												closeLoadingAndDialog();
											}, function () {
												fileUploadDataService.isDragOrSelect = null;
												$scope.fileUploadEntity.FileInfo = [];
												closeLoadingAndDialog();
											});
										}
									}
								}
							}

						},
						onCancel: function () {
							$scope.$close(false);
						}
					},
					loading: {
						dialogLoading: false,
						loadingInfo: null
					},
					cancel: function () {
						$scope.$parent.$close(false);
					}
				};

				$scope.progressBarOptions = {
					fileNameVisible: true,
					cancelButtonVisible: true,
					// selectionStatusVisible: true,
					useFixedWidth: false
				};

				basicsCommonUploadDownloadControllerService.initDialog($scope, fileUploadDataService, {enableDragAndDrop: false});

				var uploadService = fileUploadDataService.getUploadService();
				uploadService.registerFileSelected(onFileSelected);
				// uploadService.registerUploadStarting(onUploadStarting);
				uploadService.registerUploadDone(onUploadDone);
				// uploadService.registerUploadCancelled(onUploadCancelled);
				// uploadService.registerUploadError(onUploadError);
				uploadService.registerUploadFinished(onUploadFinished);

				function onFileSelected(files) {
					fileUploadDataService.isDragOrSelect = 'select';
					fileUploadDataService.onFileSelected($scope, files);
				}

				function onUploadDone(files) {
					console.log(files);
				}

				function onUploadFinished() {
				}

				// get the chosen file message when the file is uploaded
				var unWatchFileChosen = $scope.$on('fileChosen', function (scope, data) {
					if (!$scope.fileUploadEntity.FileInfo) {
						$scope.fileUploadEntity.FileInfo = [];
					}
					if (JSON.stringify(data) !== '{}') {
						$scope.fileUploadEntity.FileInfo.push(data);
					}
				});

				// close loading and dialog
				function closeLoadingAndDialog() {
					$scope.modalOptions.loading.dialogLoading = false;
					$scope.$close(false);
				}

				function closeLoading() {
					$scope.modalOptions.loading.dialogLoading = false;
				}

				function validationModel() {
					if (!($scope.fileUploadEntity.FileInfo && angular.isArray($scope.fileUploadEntity.FileInfo) && $scope.fileUploadEntity.FileInfo.length > 0)) {
						showError(true, $translate.instant('documents.project.FileUpload.validation.FileUnValid'), errorType.error);
						return false;
					}

					showError(false);
					return true;
				}

				/* function asynCreateNewRevision(documentProjectEntity, fileData) {
					var defer = $q.defer();
					fileUploadDataService.createNewRevision(documentProjectEntity).then(function (revisionEntity) {
						documentProjectEntity.FileArchiveDocFk = fileData.FileArchiveDocId;
						documentProjectEntity.OriginFileName = fileData.fileName;
						var allSupportedFileExtensionArray = fileUploadDataService.getAllSupportedFileExtensionArray();
						if (!!allSupportedFileExtensionArray) {
							var extensionName = getFileExtension(fileData.fileName);
							extensionName = extensionName.replace(/[\*\.\s]/g, '');
							var fileExtensionObject = _.find(allSupportedFileExtensionArray, function (item) {
								return item.fileExtension === extensionName;
							});
							documentProjectEntity.DocumentTypeFk = fileExtensionObject.id;
						}
						documentProjectEntity.Revision = revisionEntity.Revision;

						revisionEntity.FileArchiveDocFk = fileData.FileArchiveDocId;
						revisionEntity.OriginFileName = fileData.fileName;
						fileUploadDataService.documentDoUpdate(documentProjectEntity).then(function () {
							documentProjectEntity.OriginFileName = fileData.fileName;
							fileUploadDataService.refreshDocumentGrid();
							fileUploadDataService.refreshDocumentRevisionGrid();
							defer.resolve(revisionEntity);
						}, function () {
							defer.reject();
						});
					}, function () {
						defer.reject();
					});
					return defer.promise;
				} */

				/* function asynCreateNewRevisions(documentProjectEntities, fileDataCollection) {
					var defer = $q.defer();
					var documentProjectIds = _.map(documentProjectEntities, function (documentProjectItem) {
						return documentProjectItem.Id;
					});
					fileUploadDataService.createNewRevisions(documentProjectIds).then(function (res) {
						for (var i = 0; i < documentProjectEntities.length; i++) {
							var documentProjectEntity = documentProjectEntities[i];
							documentProjectEntity.FileArchiveDocFk = fileDataCollection[i].FileArchiveDocId;
							documentProjectEntity.OriginFileName = fileDataCollection[i].fileName;
							var allSupportedFileExtensionArray = fileUploadDataService.getAllSupportedFileExtensionArray();
							if (!!allSupportedFileExtensionArray) {
								var extensionName = getFileExtension(fileDataCollection[i].fileName);
								extensionName = extensionName.replace(/[\*\.\s]/g, '');
								var fileExtensionObject=null;
								for(var j=0;j<allSupportedFileExtensionArray.length;j++){
									if(allSupportedFileExtensionArray[j].fileExtension === extensionName){
										fileExtensionObject=allSupportedFileExtensionArray[j];
										break;
									}
								}
								documentProjectEntity.DocumentTypeFk = fileExtensionObject.id;
							}
							var revisionEntity=null;
							for(var k=0;k<res.data.length;k++){
								if(res.data[k].PrjDocumentFk === documentProjectEntity.Id){
									revisionEntity=res.data[k];
									break;
								}
							}
							documentProjectEntity.Revision = revisionEntity.Revision;

							revisionEntity.FileArchiveDocFk = fileDataCollection[i].FileArchiveDocId;
							revisionEntity.OriginFileName = fileDataCollection[i].fileName;
						}
						defer.resolve(res);
					}, function () {
						defer.reject();
					});
					return defer.promise;
				} */

				$scope.$on('$destroy', function () {
					unWatchFileChosen();
					uploadService.clear();
					uploadService.unregisterFileSelected(onFileSelected);
					// uploadService.unregisterUploadStarting(onUploadStarting);
					uploadService.unregisterUploadDone(onUploadDone);
					// uploadService.unregisterUploadCancelled(onUploadCancelled);
					// uploadService.unregisterUploadError(onUploadError);
					uploadService.unregisterUploadFinished(onUploadFinished);
				});
			}]);
})(angular);