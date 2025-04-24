/**
 * Created by balkanci on 12.11.2015.
 */
(function (angular) {

	'use strict';

	angular.module('platform').factory('platformFileUtilControllerFactory', ['_', 'globals', '$translate', 'platformModalService', '$rootScope', 'basicsLookupdataLookupDataService',
		function (_, globals, $translate, platformModalService, $rootScope, basicsLookupdataLookupDataService) {

		var service = {};

		service.initFileController = function initFileController($scope, mainService, fileService) {

			$scope.file = {src: null};
			$scope.viewContentLoading = false;
			var buttons = [];
			var uploadMessage = $translate.instant('cloud.common.uploading');
			var deleteMessage = $translate.instant('cloud.common.deleting');
			$scope.dropFileText = $translate.instant('cloud.common.dropFileText');
			var fileFkName = fileService.FILE_FK_NAME;
			var documentTypeItems = [];
			basicsLookupdataLookupDataService.getList('DocumentType').then(function (data) {
				if (!data) {
					return;
				}
				documentTypeItems = data;
			});

			$scope.getFile = function () {

				var selectedMainItem = mainService.getSelected();
				$scope.file.src = null;
				fileService.cancelRequest();
				if (selectedMainItem && selectedMainItem[fileFkName]) {
					setLoading();
					fileService.getFile().then(function (base64String) {
						reset();
						$scope.file.src = base64String;
					}, function () {
						reset();
					});
				}
			};

			mainService.registerSelectionChanged($scope.getFile);
			mainService.registerSelectionChanged(updateTools);
			// called from toolbar

			var photoAddEvent = $rootScope.$on('photoAdded', function (e, result) {
				result.processed = true;
				$scope.addClick();
			});

			var photoDeleteEvent = $rootScope.$on('photoDeleted', function (e, func) {
				$scope.deleteFile().then(function () {
					func();
				});
			});

			$scope.setClick = function () {
				// Later Added by PlatformClickEvent Directive to scope
				$scope.addClick();
			};

			$scope.deleteFile = function () {
				setLoading();
				setMessage(deleteMessage, null);
				return fileService.deleteFile(mainService.getSelected()).then(function () {
					reset();
				}, function () {
					reset();
				});
			};

			$scope.setNextPicture = function () {
				var selectedItem = mainService.getSelected();
				var Items = mainService.getList();
				var index = _.indexOf(Items, selectedItem);
				if (index < Items.length - 1) {
					mainService.setSelected(Items[index + 1]);
				}

			};

			$scope.setPreviousPicture = function () {
				var selectedItem = mainService.getSelected();
				var Items = mainService.getList();
				var index = _.indexOf(Items, selectedItem);
				if (index > 0) {
					mainService.setSelected(Items[index - 1]);
				}
			};

			$scope.getMaxSize = function (file) {
				let maxSize = "4MB";

				const fileName = file.name;
				const suffix = fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length - 1);
				const lowercaseSuffix = _.toLower(suffix);
				const docType = _.find(documentTypeItems, function (item) {
					return item.Extention !== null && item.Extention.indexOf(lowercaseSuffix) !== -1;
				});

				if (docType && docType.MaxByte !== 0) {
					maxSize = formatBytes(docType.MaxByte);
				}
				return maxSize;
			}

			function reset() {
				$scope.file.src = null;
				$scope.info2 = null;
				$scope.viewContentLoading = false;
				$scope.tools.update();
			}

			function setMessage(message, fileName) {
				var displayMessage = message;
				if (!_.isEmpty(fileName)) {
					displayMessage = displayMessage.replace('##fileName##', fileName);
				}

				$scope.info2 = displayMessage;
				setLoading();
			}

			function setLoading() {
				$scope.viewContentLoading = true;
				updateTools();
			}

			function updateTools() {
				$scope.tools.update();
			}

			$scope.uploadFiles = function (file, errFiles) {

				$scope.errFile = errFiles && errFiles[0];
				if ($scope.errFile && $scope.errFile.$error === 'maxSize') {
					var errorText = $translate.instant('cloud.common.maxFileSizeError', {maxSize: errFiles[0].$errorParam});
					platformModalService.showErrorBox(errorText, 'cloud.common.errorMessage');
				}
				if (file) {
					reset();
					setMessage(uploadMessage, file.name);
					fileService.importFile(file).then(function (result) {
						reset();
						$scope.file.src = result.Base64String;

					}, function () {
						reset();
					}, function (evt) {
						file.progress = Math.min(100, parseInt(100.0 *
							evt.loaded / evt.total));
					});
				}
			};

			function isDisabled() {
				let entity = mainService.getSelected();
				if(!entity && mainService.getSelectedSuperEntity) {
					entity = mainService.getSelectedSuperEntity();
				}
				return !entity || entity.Version === 0;
			}

			buttons = $scope.buttons && _.isArray($scope.buttons) ? $scope.buttons : [];
			if (!$scope.buttons && !fileService.config.hideToolbarButtons) {
				buttons = [
					{
						id: 't1',
						caption: 'cloud.common.toolbarAddFile',
						type: 'item',
						iconClass: 'tlb-icons ico-new',
						fn: $scope.setClick,
						disabled: isDisabled
					}
				];
				if (fileService.config.deleteUrl) {
					var delBtn = {
						id: 't2',
						caption: 'cloud.common.toolbarDeleteFile',
						type: 'item',
						iconClass: 'tlb-icons ico-delete',
						fn: $scope.deleteFile,
						disabled: isDisabled
					};
					buttons.push(delBtn);
				}
			}

			if (fileService.config.hasMultiple) {
				buttons.push({
					id: 't3',
					caption: 'Go to Previous',
					type: 'item',
					iconClass: 'tlb-icons ico-rec-previous',
					fn: $scope.setPreviousPicture,
					disabled: isDisabled
				});
				buttons.push({
					id: 't4',
					caption: 'Go to Next',
					type: 'item',
					iconClass: 'tlb-icons ico-rec-next',
					fn: $scope.setNextPicture,
					disabled: isDisabled
				});
			}

			$scope.setTools({
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: buttons
			});

			$scope.$on('$destroy', function () {
				mainService.unregisterSelectionChanged($scope.getFile);
				mainService.unregisterSelectionChanged(updateTools);
				photoAddEvent();
				photoDeleteEvent();
			});

			$scope.canDrop = function () {
				return !isDisabled();
			};

			if (!_.isEmpty(mainService.getSelected())) {
				$scope.getFile();
			}

			function formatBytes(bytes) {
				if (bytes === 0) {
					return '0 Bytes';
				}
				const k = 1024;
				const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
				const i = Math.floor(Math.log(bytes) / Math.log(k));
				return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
			}
		};

		return service;

	}
	]);
})(angular);
