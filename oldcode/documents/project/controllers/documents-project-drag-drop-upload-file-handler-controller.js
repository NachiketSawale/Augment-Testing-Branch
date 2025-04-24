/**
 * Created by lja on 2016-2-3.
 */
(function (angular) {
	'use strict';
	var moduleName = 'documents.project';
	angular.module(moduleName).controller('documentsProjectDragDropUploadFileHandlerController',
		[
			'$scope',
			'$translate',
			'documentsProjectDocumentFileUploadDataService',
			'basicsCommonUploadDownloadControllerService',
			function ($scope, $translate, fileUploadDataService, basicsCommonUploadDownloadControllerService) {

				$scope.modalOptions = {
					gridFlag: $scope.gridFlag,
					loading: {
						dialogLoading: false,
						loadingInfo: null
					},
					cancel: cancel,
					headerText: $translate.instant('documents.project.FileUpload.dialog.title')
				};

				$scope.progressBarOptions = {
					fileNameVisible: true,
					cancelButtonVisible: true,
					useFixedWidth: false
				};

				fileUploadDataService.dragedFilesHaveBeenUploaded.register(closeLoadingAndDialog);

				function closeLoadingAndDialog() {
					$scope.modalOptions.loading.dialogLoading = false;
					cancel();
				}

				basicsCommonUploadDownloadControllerService.initDialog($scope, fileUploadDataService, {enableDragAndDrop: false});

				$scope.$on('$destroy', function () {

				});


				function cancel() {
					$scope.$close(false);
				}
			}]);
})(angular);