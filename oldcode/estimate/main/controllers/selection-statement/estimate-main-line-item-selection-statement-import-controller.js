/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainLineItemSelectionStatementImportController',
		['$scope', '$translate', 'basicsMaterialImportMaterialRecordsService', 'basicsCommonUploadDownloadControllerService', 'platformModalService',
			function ($scope, $translate, basicsMaterialImportMaterialRecordsService, basicsCommonUploadDownloadControllerService, platformModalService) {

				let isImported = false;
				$scope.options = {};

				$scope.error = basicsMaterialImportMaterialRecordsService.alertInfo;

				angular.extend($scope.modalOptions, {
					headerText: $translate.instant('basics.material.import.importd9xTitle')
				});

				$scope.import = {
					fileName: '',
					isDisabled: false,
					disableInfo: disableInfo
				};

				$scope.progressBarOptions = {
					cancelButtonVisible: true
				};

				$scope.showInfo = function () {
					let modalOptions = {
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

				let uploadService = basicsMaterialImportMaterialRecordsService.getUploadService();

				angular.element('button#importFileBtn').click(function(){ // to avoid the $apply issue
					uploadService.uploadFiles({}, uploadService.getExtension(), {moduleName: $scope.modalOptions.moduleName, materialCatalogId: $scope.modalOptions.materialCatalogId, materialCatalogCode: $scope.modalOptions.materialCatalogCode});
				});

				$scope.close = function () {
					$scope.$close(isImported);
				};

				$scope.$on('$destroy', function () {
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
					basicsMaterialImportMaterialRecordsService.reset();
				}

				function onUploadDone(){
					$scope.import.isDisabled = false;
					$scope.isLoading = false;
					isImported = true;
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
			}]);
})(angular);
