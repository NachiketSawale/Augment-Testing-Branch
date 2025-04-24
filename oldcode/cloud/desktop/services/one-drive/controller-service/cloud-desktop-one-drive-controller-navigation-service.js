/**
 * Created by lst on 7/13/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'cloud.desktop';

	angular.module(moduleName).factory('cloudDesktopOneDriveControllerNavigationService',
		['cloudDesktopOneDriveMainService', 'cloudDesktopOneDriveDataService', 'platformGridAPI',
			'$window', '$log',
			function (cloudDesktopOneDriveMainService, dataService, platformGridAPI,
				$window, $log) {
				var service = {};

				service.initNavigation = function ($scope) {
					function getPath(driveItem) {
						if (driveItem.parentReference && driveItem.parentReference.path) {
							return driveItem.parentReference.path + '/' + driveItem.name;
						}
						return '/drive/root:';
					}

					function updateGridData(dataList) {
						dataService.setList(dataList);
					}

					// set the value every time when load data from oneDrive.
					$scope.loadSuccess = false;

					// this is the oneDrive item, it always equals current folder after initialized.
					$scope.currentDriveItem = null;

					$scope.paths = [];
					$scope.navigate = function (pathOrDriveItem) {

						$scope.isLoading = true;
						$scope.loadSuccess = false;

						var isPath = typeof (pathOrDriveItem) === 'string';
						var path = isPath ? pathOrDriveItem : getPath(pathOrDriveItem);
						var relPath = isPath ? path : path.split(':')[1];
						var tempPaths = relPath.split('/');
						var tempPath = '';
						$scope.paths = [];
						angular.forEach(tempPaths, function (pathItem) {
							if (pathItem && pathItem.length > 0) {
								tempPath += '/' + pathItem;
								$scope.paths.push({name: pathItem, path: tempPath});
							}
						});

						var drive = '/me/drive/';

						if (isPath) {
							// /me/drive/root:{path}:?xxx=xxx
							var parameters = '?expand=thumbnails,children(expand=thumbnails(select=large))';
							relPath = relPath ? encodeURIComponent(relPath) : relPath;
							var queryPath = drive + 'root' + (relPath ? ':' + relPath + ':' : '');
							cloudDesktopOneDriveMainService.get(queryPath).then(function (res) {
								$scope.currentDriveItem = res.data;
								cloudDesktopOneDriveMainService.get(queryPath + parameters).then(function (res) {
									var directory = res.data.children || [];
									updateGridData(directory);
									$scope.isLoading = false;
									$scope.loadSuccess = true;
								}, function (err) {
									$log.log(err);
									$scope.isLoading = false;
								});
							}, function (err) {
								$log.log(err);
								$scope.isLoading = false;
							});
						} else {
							$scope.currentDriveItem = pathOrDriveItem;
							// folder: /me/drive/items/{item id}/children   file:  /me/drive/items/{item id}
							var odquery = drive + 'items/' + pathOrDriveItem.id + (pathOrDriveItem.folder ? '/children' : '');
							cloudDesktopOneDriveMainService.get(odquery).then(function (res) {
								var directory = res.data.value || [];
								updateGridData(directory);
								$scope.isLoading = false;
								$scope.loadSuccess = true;
							}, function (err) {
								$log.log(err);
								$scope.isLoading = false;
							});
						}
					};

					platformGridAPI.events.register($scope.getContainerUUID(), 'onDblClick', onGridDblClick);

					function onGridDblClick(e, args) {
						var rows = platformGridAPI.rows.getRows($scope.getContainerUUID());
						var currentRow = rows[args.row];
						$log.log(currentRow);
						if (currentRow.folder) {
							$scope.navigate(currentRow);
						} else if (currentRow.file || currentRow.package) {
							if (currentRow.webUrl) {
								$window.open(currentRow.webUrl, '_blank');
							}
						}
					}
				};

				return service;
			}]);

})(angular);