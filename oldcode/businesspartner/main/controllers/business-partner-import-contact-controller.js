/**
 * Created by lst on 9/12/2016.
 */

(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('businesspartner.main').controller('businessPartnerImportContactController',
		['$scope', '$translate', 'businesspartnerMainHeaderDataService', 'businesspartnerMainContactDataService', 'basicsCommonUploadDownloadControllerService', 'platformModalService',
			function ($scope, $translate, businesspartnerMainHeaderDataService, businesspartnerMainContactDataService, basicsCommonUploadDownloadControllerService, platformModalService) {

				$scope.options = {};

				$scope.modalOptions = angular.extend($scope.modalOptions, {
					closeButtonText: 'Cancel',
					actionButtonText: 'OK',
					headerText: $translate.instant('businesspartner.main.importContact.title')
				});

				$scope.import = {
					fileName: '',
					isDisabled: false
				};

				$scope.progressBarOptions = {
					cancelButtonVisible: true
				};

				basicsCommonUploadDownloadControllerService.initDialog($scope, businesspartnerMainContactDataService, {enableDragAndDrop: false});

				var uploadService = businesspartnerMainContactDataService.getUploadService('business-partner-contact');

				angular.element('button#importFileBtn').click(function () { // to avoid the $apply issue
					// uploadService.uploadFiles({}, uploadService.getExtension(), {businessPartnerId: $scope.modalOptions.currentItem.Id});
					var fileOption = {multiple: true, autoUpload: false};
					// noinspection JSUnresolvedFunction
					uploadService.selectFiles(fileOption);
				});

				$scope.$on('$destroy', function () {
					uploadService.clear();
					uploadService.unregisterFileSelected(onFileSelected);
					uploadService.unregisterUploadStarting(onUploadStarting);
					uploadService.unregisterUploadDone(onUploadDone);
					uploadService.unregisterUploadCancelled(onUploadCancelled);
					uploadService.unregisterUploadError(onUploadError);
					uploadService.unregisterUploadFinished(onUploadFinished);
				});
				uploadService.registerFileSelected(onFileSelected);
				uploadService.registerUploadStarting(onUploadStarting);
				uploadService.registerUploadDone(onUploadDone);
				uploadService.registerUploadCancelled(onUploadCancelled);
				uploadService.registerUploadError(onUploadError);
				uploadService.registerUploadFinished(onUploadFinished);

				function onFileSelected(files) {
					businesspartnerMainHeaderDataService.testReadAsync(files, doValidate);

				}

				function doValidate(files, vCards, charSets) {
					var currentBusinessPartnerName1 = $scope.modalOptions.currentItem.BusinessPartnerName1;
					var notMatchCount = 0;
					for (var i = vCards.length; i > 0; i--) {
						if (vCards[i - 1].ORG !== currentBusinessPartnerName1) {
							notMatchCount++;
						}
					}

					var formData = {
						businessPartnerId: $scope.modalOptions.currentItem.Id,
						businessPartnerName1: currentBusinessPartnerName1,
						saveByWarning: true,
						charSets: JSON.stringify(charSets)
					};
					if (notMatchCount > 0) {
						var head = 'businesspartner.main.importContact.title';
						var body = 'businesspartner.main.importContact.orgNotMatch';
						showYesNoCancelDialog(head, body).then(function (dialogResult) {
							if (dialogResult.yes) {
								// noinspection JSUnresolvedFunction
								uploadService.startUploadFiles(files, formData);
							}
							if (dialogResult.no) {
								if (files.length === notMatchCount) {
									$scope.modalOptions.ok();
								} else {
									formData.saveByWarning = false;
									// noinspection JSUnresolvedFunction
									uploadService.startUploadFiles(files, formData);
								}
							}
						});
					} else {
						// noinspection JSUnresolvedFunction
						uploadService.startUploadFiles(files, formData);
					}
				}

				function showYesNoCancelDialog(head, body) {
					var modalOptions = {
						headerTextKey: head,
						bodyTextKey: body,
						showYesButton: true,
						showNoButton: true,
						showCancelButton: true,
						iconClass: 'ico-question'
					};
					return platformModalService.showDialog(modalOptions);
				}

				// noinspection JSUnusedLocalSymbols
				function onUploadStarting(e, info) {
					// noinspection JSUnresolvedFunction
					if (info && info.entity && info.entity.Id === $scope.getUploadItem().Id && info.file) {
						$scope.import.fileName = info.file.name;
						$scope.import.isDisabled = true;
					}
				}

				function onUploadDone() {
					$scope.import.isDisabled = false;
				}

				function onUploadCancelled() {
					$scope.import.isDisabled = false;
				}

				function onUploadError() {
					$scope.import.isDisabled = false;
				}

				function onUploadFinished() {
					$scope.modalOptions.ok();
					businesspartnerMainContactDataService.load();
				}
			}]);
})(angular);