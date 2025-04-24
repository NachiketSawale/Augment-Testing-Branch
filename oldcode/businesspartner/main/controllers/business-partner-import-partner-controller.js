/**
 * Created by lst on 9/12/2016.
 */

(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('businesspartner.main').controller('businessPartnerImportPartnerController',
		['$scope', '$translate', '$q', 'businesspartnerMainHeaderDataService', 'basicsCommonUploadDownloadControllerService', 'platformModalService',
			function ($scope, $translate, $q, businesspartnerMainHeaderDataService, basicsCommonUploadDownloadControllerService, platformModalService) {

				$scope.options = {};

				$scope.modalOptions = angular.extend($scope.modalOptions, {
					closeButtonText: 'Cancel',
					actionButtonText: 'OK',
					headerText: $translate.instant('businesspartner.main.importBusinessPartner.title')
				});

				$scope.import = {
					fileName: '',
					isDisabled: false
				};

				$scope.progressBarOptions = {
					cancelButtonVisible: true
				};

				basicsCommonUploadDownloadControllerService.initDialog($scope, businesspartnerMainHeaderDataService, {enableDragAndDrop: false});

				var uploadService = businesspartnerMainHeaderDataService.getUploadService('business-partner-partner');

				angular.element('button#importFileBtn').click(function () { // to avoid the $apply issue
					// uploadService.uploadFiles({}, uploadService.getExtension(), {multiple: true});
					var fileOption = {multiple: false, autoUpload: false};
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
					businesspartnerMainHeaderDataService.testReadAsync(files, doSave);
				}

				function doSave(files, vCards, charSets) {
					var businessPartners = [];
					vCards.forEach(function (card) {
						if (card.ORG) {
							businessPartners.push(card.ORG);
						}
					});

					var businessPartnersIsValid = businessPartners && businessPartners.length > 0;
					if (!businessPartnersIsValid) {
						platformModalService.showMsgBox('businesspartner.main.importBusinessPartner.bpNameIsEmpty',
							'businesspartner.main.importBusinessPartner.title', 'ico-info');
						return;
					}

					businesspartnerMainHeaderDataService.checkBusinessPartnerIsExists(businessPartners).then(function (response) {
						var formData = {saveByWarning: true, charSets: JSON.stringify(charSets)};
						if (response && response.data && response.data.length > 0) {
							var head = 'businesspartner.main.importBusinessPartner.title';
							var body = 'businesspartner.main.importBusinessPartner.leaveSame';
							// noinspection JSCheckFunctionSignatures
							platformModalService.showYesNoDialog(body, head).then(function (dialogResult) {
								if (dialogResult.yes) {
									// noinspection JSUnresolvedFunction
									uploadService.startUploadFiles(files, formData);
								}
								if (dialogResult.no) {
									// formData.saveByWarning = false;
									// uploadService.startUploadFiles(files, formData);
									$scope.modalOptions.ok();
								}
							});
						} else {
							// noinspection JSUnresolvedFunction
							uploadService.startUploadFiles(files, formData);
						}
					});
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
					businesspartnerMainHeaderDataService.refresh();
				}
			}]);
})(angular);