/**
 * Created by lva on 2014/11/7.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.material';
	angular.module(moduleName).controller('basicsMaterialImportRecordsController',
		['$scope', '_', '$http', '$translate', 'globals', 'basicsMaterialImportMaterialRecordsService', 'basicsMaterialRecordService','basicsCommonUploadDownloadControllerService', 'platformModalService',
			function ($scope, _, $http, $translate, globals, basicsMaterialImportMaterialRecordsService, basicsMaterialRecordService, basicsCommonUploadDownloadControllerService, platformModalService
			) {

				var canImport = false;
				var isUploaded = false;
				var isImported = false;
				$scope.options = {};

				$scope.error = basicsMaterialImportMaterialRecordsService.alertInfo;

				angular.extend($scope.modalOptions, {
					headerText: $translate.instant('basics.material.import.importd9xTitle')
				});

				$scope.import = {
					fileName: '',
					isDisabled: false,
					disableInfo: disableInfo,
					disableImport: disableImport
				};

				$scope.progressBarOptions = {
					cancelButtonVisible: true
				};

				$scope.showInfo = function () {
					var modalOptions = {
						templateUrl: globals.appBaseUrl + 'basics.material/partials/import-material-records-error-dialog.html',
						backDrop: false,
						windowClass: 'form-modal-dialog',
						resizeable: true,
						headerTextKey: $translate.instant('basics.common.taskBar.info'),
						infoList: basicsMaterialImportMaterialRecordsService.infoList
					};
					platformModalService.showDialog(modalOptions);
				};

				basicsCommonUploadDownloadControllerService.initDialog($scope, basicsMaterialImportMaterialRecordsService, {enableDragAndDrop: false});

				var uploadService = basicsMaterialImportMaterialRecordsService.getUploadService();

				angular.element('button#importFileBtn').click(function(){ // to avoid the $apply issue
					uploadService.uploadFiles({}, uploadService.getExtension(), {action: 'Upload'}); // action: 'Upload', isImportImmediately: false, moduleName: $scope.modalOptions.moduleName, materialCatalogId: $scope.modalOptions.materialCatalogId, materialCatalogCode: $scope.modalOptions.materialCatalogCode
				});

				$scope.importMaterial = importMaterial;

				$scope.close = close;

				$scope.$on('$destroy', function () {
					deleteFile();
					uploadService.clear();
					basicsMaterialImportMaterialRecordsService.reset();
				});

				uploadService.registerUploadStarting(onUploadStarting);
				uploadService.registerUploadDone(onUploadDone);
				uploadService.registerUploadCancelled(onUploadCancelled);
				uploadService.registerUploadError(onUploadError);

				function onUploadStarting(e){
					if (e){
						$scope.import.fileName = e.name;
						$scope.import.isDisabled = true;
						$scope.isLoading = true;
					}
					$scope.error.show = false;
					deleteFile();
					basicsMaterialImportMaterialRecordsService.reset();
					isUploaded = false;
					isImported = false;
				}

				function onUploadDone(){
					$scope.import.isDisabled = false;
					$scope.isLoading = false;
					canImport = true;
					isUploaded = true;
				}

				function onUploadCancelled(){
					$scope.import.isDisabled = false;
					$scope.isLoading = false;
				}

				function onUploadError(){
					$scope.import.isDisabled = false;
					$scope.isLoading = false;
				}

				function disableInfo() {
					return !basicsMaterialImportMaterialRecordsService.hasInfo;
				}

				function disableImport() {
					return !isUploaded ? basicsMaterialImportMaterialRecordsService.hasInfo || !canImport : !canImport;
				}

				function importMaterial() {
					var result = null;
					$scope.isLoading = true;
					canImport = false;
					isImported = false;
					var errMsg = $translate.instant('basics.material.import.importError4BigData');
					basicsMaterialImportMaterialRecordsService.infoList = [];
					var data = {
						FileArchiveDocId: basicsMaterialImportMaterialRecordsService.fileArchiveDocId,
						FileName: basicsMaterialImportMaterialRecordsService.fileName,
						ModuleName: $scope.modalOptions.moduleName,
						MaterialCatalogId: $scope.modalOptions.materialCatalogId,
						MaterialCatalogCode: $scope.modalOptions.materialCatalogCode
					};

					$http.post(globals.webApiBaseUrl + 'basics/material/wizard/importmaterialfromd9x', data)
						.then(function (response) {
							if (response.data.JobId) {
								checkImportState(response.data.JobId);
							}
						});

					function checkImportState(jobId) {
						$http.get(globals.webApiBaseUrl + 'basics/material/wizard/importstate?jobId=' + jobId)
							.then(function (response) {
								if (response.data) {
									result = response.data;
									isImported = true;
									ImportFinish();
								} else {
									setTimeout(function () {
										checkImportState(jobId);
									}, 5000);
								}
							}, function (error) {
								if (error && error.data) {
									errMsg = error.data.ErrorMessage;
								}
								result = {
									InfoList: [errMsg],
									StatusCode: -2
								};
								ImportFinish();
							});
					}

					function ImportFinish() {
						$scope.isLoading = false;
						canImport = true;

						var temp = angular.extend(result, {
							FileArchiveDocId: basicsMaterialImportMaterialRecordsService.fileArchiveDocId,
							fileName: basicsMaterialImportMaterialRecordsService.fileName
						});
						basicsMaterialImportMaterialRecordsService.importDataCallBack(null, temp);
						if (result.ImportObjects) {
							var ids = _.map(result.ImportObjects, 'Id');
							basicsMaterialRecordService.navigateToItem(ids);
						}
					}

				}

				function close() {
					$scope.$close(isImported);
				}

				function deleteFile() {
					if (isUploaded && basicsMaterialImportMaterialRecordsService.fileArchiveDocId) {
						var docId = basicsMaterialImportMaterialRecordsService.fileArchiveDocId;
						$http.post(globals.webApiBaseUrl + 'basics/common/document/deletefilearchivedoc', [docId]);
					}
				}
			}]);
})(angular);