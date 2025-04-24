/**
 * Created by lst on 6/7/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'cloud.desktop';

	angular.module(moduleName).controller('cloudDesktopOneDriveListController', [
		'$scope', 'platformGridControllerService', 'cloudDesktopOneDriveUIStandardService',
		'cloudDesktopOneDriveDataService', 'cloudDesktopOneDriveClipboardService', 'cloudDesktopOneDriveTranslationService', 'platformGridAPI', '$timeout',
		'_', 'cloudDesktopOneDriveControllerNavigationService', 'cloudDesktopOneDriveControllerDropService',
		/* 'cloudDesktopOneDriveControllerContextMenuService', */
		function ($scope, platformGridControllerService, UIStandardService,
			dataService, cloudDesktopOneDriveClipboardService, translationService, platformGridAPI, $timeout,
			_, navigationService, dropService/* , contextMenuService */) {

			$scope.getContainerUUID = function () {
				return 'cd5cbbf18c2141b0be25bb4dc9b5b18e';
			};

			$scope.setTools = function (tools) {
				tools.version = Math.random();
				tools.update = function () {
					tools.version += 1;
				};
				$scope.tools = tools;
			};

			// when user open oneDrive set initialized to true.
			$scope.initialized = false;

			var gridConfig = {
				initCalled: false,
				grouping: false,
				enableConfigSave: false,
				idProperty: 'id',
				type: 'oneDrive',
				dragDropService: cloudDesktopOneDriveClipboardService
			};

			platformGridControllerService.initListController($scope, UIStandardService, dataService, translationService, gridConfig);

			navigationService.initNavigation($scope);

			dropService.initDrop($scope);

			// context menu is not finished. todo:lst
			// contextMenuService.initContextMenu($scope);

			// var toolbarItems = [
			// 	{
			// 		id: 't1',
			// 		caption: 'cloud.desktop.oneDrive.toolBar.newFolder',
			// 		iconClass: 'tlb-icons ico-add',
			// 		type: 'item',
			// 		fn: function () {
			// 			$scope.executeCmd('newFolder');
			// 		}
			// 	},
			// 	{
			// 		id: 't2',
			// 		caption: 'cloud.desktop.oneDrive.toolBar.copy',
			// 		iconClass: 'tlb-icons ico-copy',
			// 		type: 'item',
			// 		fn: function () {
			// 			$scope.executeCmd('copy');
			// 		}
			// 	},
			// 	{
			// 		id: 't3',
			// 		caption: 'cloud.desktop.oneDrive.toolBar.paste',
			// 		iconClass: 'tlb-icons ico-copy-paste',
			// 		type: 'item',
			// 		fn: function () {
			// 			$scope.executeCmd('paste');
			// 		}
			// 	},
			// 	{
			// 		id: 't4',
			// 		caption: 'cloud.desktop.oneDrive.toolBar.delete',
			// 		iconClass: 'tlb-icons ico-delete',
			// 		type: 'item',
			// 		fn: function () {
			// 			$scope.executeCmd('delete');
			// 		}
			// 	},
			// 	{
			// 		id: 't5',
			// 		caption: 'cloud.desktop.oneDrive.toolBar.rename',
			// 		iconClass: 'tlb-icons ico-rename-variable',
			// 		type: 'item',
			// 		fn: function () {
			// 			$scope.executeCmd('rename');
			// 		}
			// 	}
			// ];

			// $scope.setTools({
			// 	showImages: true,
			// 	showTitles: true,
			// 	cssClass: 'tools',
			// 	items: toolbarItems
			// });

			function resizGrid() {
				$timeout(function () {
					platformGridAPI.grids.resize($scope.getContainerUUID());
					$timeout(function () {
						platformGridAPI.grids.resize($scope.getContainerUUID());
					}, 0);
				}, 0);
			}

			// $scope.directory = [
			// 	{
			// 		id: 'xxxxx1',
			// 		name: 'bookfolder1',
			// 		lastModifiedDateTime: '2018-5-30 13:51:24',
			// 		folder: {
			// 			childcount: 1
			// 		}
			// 	},
			// 	{
			// 		id: 'xxxxx2',
			// 		name: 'bookfolder2',
			// 		lastModifiedDateTime: '2018-5-31 13:51:24',
			// 		folder: {
			// 			childcount: 1
			// 		}
			// 	},
			// 	{
			// 		id: 'xxxxx31',
			// 		name: 'book12.pdf',
			// 		lastModifiedDateTime: '2018-5-3 13:51:24',
			// 		file: {
			// 			mimeType: 'application/pdf'
			// 		},
			// 		size: 10000
			// 	},
			// 	{
			// 		id: 'xxxxx32',
			// 		name: 'book12.doc',
			// 		lastModifiedDateTime: '2018-5-3 13:51:24',
			// 		file: {
			// 			mimeType: 'application/msword'
			// 		},
			// 		size: 10000
			// 	},
			// 	{
			// 		id: 'xxxxx33',
			// 		name: 'book12.xls',
			// 		lastModifiedDateTime: '2018-5-3 13:51:24',
			// 		file: {
			// 			mimeType: 'application/vnd.ms-excel'
			// 		},
			// 		size: 10000
			// 	},
			// 	{
			// 		id: 'xxxxx34',
			// 		name: 'book12.ppt',
			// 		lastModifiedDateTime: '2018-5-3 13:51:24',
			// 		file: {
			// 			mimeType: 'application/vnd.ms-powerpoint'
			// 		},
			// 		size: 10000
			// 	},
			// 	{
			// 		id: 'xxxxx35',
			// 		name: 'book12.txt',
			// 		lastModifiedDateTime: '2018-5-3 13:51:24',
			// 		file: {
			// 			mimeType: 'text/plain'
			// 		},
			// 		size: 10000
			// 	},
			// 	{
			// 		id: 'xxxxx4',
			// 		name: 'book12.pdfX',
			// 		lastModifiedDateTime: '2018-5-3 13:51:24',
			// 		file: {
			// 			mimeType: 'pdfX'
			// 		},
			// 		size: 10000
			// 	}
			// ];

			function load() {
				resizGrid();
				// if current folder is set, load the folder else load the root folder.
				$scope.navigate($scope.currentDriveItem ? $scope.currentDriveItem : '');

				// dataService.setList($scope.directory);
			}

			$scope.$on('one-drive-sidebar-opened', function () {
				$scope.initialized = true;
				if ($scope.loadSuccess === false) {
					$timeout(function () {
						load();
					}, 50);
				}
			});

			var unWatch = $scope.$watch(function () {
				return $scope.$parent.$parent.$parent.isAuthenticated;
			}, function (newValue) {
				if (newValue === true && $scope.initialized === true) {
					load();
				}
			});

			$scope.$on('$destroy', function () {
				unWatch();
			});
		}
	]);
})(angular);