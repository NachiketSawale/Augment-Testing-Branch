/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'cloud.desktop';

	angular.module(moduleName).factory('cloudDesktopOneDriveControllerDropService', [
		'$translate',
		'platformModalService',
		'cloudDesktopOneDriveDataService',
		'_',
		'$log',
		function (
			$translate,
			platformModalService,
			dataService,
			_,
			$log) {
			let service = {};

			service.initDrop = function ($scope) {
				let origCanDrop = $scope.ddTarget.canDrop;
				$scope.ddTarget.canDrop = function (info) {
					if (info.draggedData && info.draggedData.sourceGrid &&
						(info.draggedData.sourceGrid.type === 'modelMainObjectDataService' || info.draggedData.sourceGrid.type === 'documentRevision')) {

						let files = info.draggedData.sourceGrid.data;
						// return $scope.currentDriveItem && files && files.length > 0;
						return files && files.length > 0;
					} else {
						return origCanDrop.call($scope.ddTarget, info);
					}
				};

				let origDrop = $scope.ddTarget.drop;
				$scope.ddTarget.drop = function (info) {
					if (info.draggedData && info.draggedData.sourceGrid && (info.draggedData.sourceGrid.type === 'modelMainObjectDataService' || info.draggedData.sourceGrid.type === 'documentRevision')) {

						$log.log(info.draggedData.sourceGrid.data);

						let oneDriveItems = dataService.getList();
						let files = info.draggedData.sourceGrid.data;
						let data = [], sameNameCount = 0;
						angular.forEach(files, function (file) {

							let pushItem = {
								FileArchiveDocId: file.FileArchiveDocFk,
								Overwrite: false,
								DriveItem: null
							};

							let found = _.find(oneDriveItems, function (oneDriveItem) {
								return oneDriveItem.name &&
									file.OriginFileName &&
									oneDriveItem.name.toLocaleLowerCase() === file.OriginFileName.toLocaleLowerCase();
							});
							if (found) {
								sameNameCount++;
								pushItem.Overwrite = true;
								pushItem.DriveItem = found;
							}

							data.push(pushItem);
						});

						let uploadFunc = function () {
							dataService.uploadFileToOneDrive($scope.currentDriveItem, data).then(function (res) {
								if (res.data && res.data['Success']) {
									$scope.navigate($scope.currentDriveItem);
								} else {
									platformModalService.showMsgBox((res.data && res.data.Message) ? res.data.Message : 'Upload failed!', 'cloud.desktop.oneDrive.title', 'ico-info');
								}
							}, function (error) {
								console.log(error);
							});
						};

						if (sameNameCount > 0) {
							let modalOptions = {
								templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/one-drive/file-conflict-dialog.html',
								backDrop: false,
								windowClass: 'form-modal-dialog',
								headerText: $translate.instant('cloud.desktop.oneDrive.title'),
								message: $translate.instant('cloud.desktop.oneDrive.conflictMessage', {count: sameNameCount})
							};
							platformModalService.showDialog(modalOptions).then(function (result) {
								$log.log(result);
								if (result) {
									if (result.overwrite) {
										angular.forEach(data, function (dataItem) {
											if (dataItem.DriveItem) {
												dataItem.Overwrite = result.overwrite;
											}
										});
									} else { // If skip files with the same name, the files with the same name are not uploaded to OneDrive.
										data = data.filter(x => !x.Overwrite);
									}
									if (data.length > 0) {
										uploadFunc();
									}
								}
							});
						} else {
							uploadFunc();
						}
					} else {
						origDrop.call($scope.ddTarget, info);
					}
				};
			};

			return service;
		}]);

})(angular);
