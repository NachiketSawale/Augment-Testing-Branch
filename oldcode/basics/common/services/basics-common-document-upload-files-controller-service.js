(function (angular) {
	'use strict';

	var moduleName = 'basics.common';
	/**
	 * @ngdoc service
	 * @basicsCommonDocumentUploadFilesController
	 * @Description
	 * For Documents Container: Is triggered when dragging and dropping documents from the Explorer and clicking the
	 * 'Upload and Create Document' tool-icon
	 *  createForUploadFile function must exists in data service
	 */
	angular.module(moduleName).factory('basicsCommonDocumentUploadFilesControllerService',
		['$http', '$injector', '$translate', 'platformModalService',

			function BasicsCommonDocumentUploadFilesControllerService($http, $injector, $translate, platformModalService) {

				let service = {};
				service.initUploadFilesController = function initUploadFilesController($scope, service, gridFlag) {

					let dataService = service;
					let fileInfoArray = [];
					dataService.isDragOrSelect = 'drag';
					dataService.dragDropFileTargetGridId = gridFlag;

					$scope.containerHeaderInfo = {
						checkBoxChecked: false,
						extractZipFileTip: $translate.instant('basics.common.fileUpload.extractZipFileTip'),
					};

					function filesHaveBeenUploadedReaction(e, args) {
						if ((dataService.isDragOrSelect === 'drag' || dataService.isUploadCreateDocument === 'uploadcreate') && dataService.dragDropFileTargetGridId === gridFlag) {
							let fileInfoData = args.data;
							if (!!fileInfoData.FileArchiveDocId && !!fileInfoData.fileName && !!fileInfoData.file) {
								fileInfoArray.push(fileInfoData);
							}
						}
					}

					dataService.filesHaveBeenUploaded.register(filesHaveBeenUploadedReaction);

					let uploadService = dataService.getUploadService();

					uploadService.registerUploadFinished(onUploadFinished);

					function onUploadFinished() {
						let uploadedFileDataArray = [];
						if ((!!fileInfoArray) && angular.isArray(fileInfoArray) && fileInfoArray.length > 0) {
							angular.forEach(fileInfoArray, function (fileInfo) {
								uploadedFileDataArray.push({
									FileArchiveDocId: fileInfo.FileArchiveDocId,
									FileName: fileInfo.fileName
								});
							});
							if ((dataService.isDragOrSelect === 'drag' || dataService.isUploadCreateDocument === 'uploadcreate') && dataService.dragDropFileTargetGridId === gridFlag) { // the Document Project grid
								let extractZipOrNot = $scope.containerHeaderInfo.checkBoxChecked;
								let selectParentItem = dataService.parentService().getSelected();

								dataService.createForUploadFile(selectParentItem.Id, uploadedFileDataArray, extractZipOrNot).then(function (res) {
									showInfoMessage(res);
									dataService.isDragOrSelect = null;
									dataService.isUploadCreateDocument = null;
									fileInfoArray = [];
									dataService.read();
								}, function () {
								});
							}
						}
					}

					function showInfoMessage(res) {
						if (!!res && !!res.data && angular.isArray(res.data) && res.data.length > 0) {
							let errMsg;
							if (res.data.length > 1) {
								var fileNames = res.data.join('<br/>');
								errMsg = '<br/>' + $translate.instant('documents.project.FileUpload.validation.FileExtensionsErrorInfo') + ':<br/>' + fileNames;
							} else {
								errMsg = '<br/>' + $translate.instant('documents.project.FileUpload.validation.FileExtensionErrorInfo') + ':<br/>' + res.data[0];
							}
							errMsg = '<div style=\'height:300px\'>' + errMsg + '</div>';
							platformModalService.showMsgBox(errMsg, 'documents.project.FileUpload.validation.FileExtensionErrorMsgBoxTitle', 'warning');
						}
					}

					$scope.$on('$destroy', function () {
						uploadService.unregisterUploadFinished(onUploadFinished);
						dataService.filesHaveBeenUploaded.unregister(filesHaveBeenUploadedReaction);
					});
				};
				return service;
			}
		]);
})(angular);