/**
 * Created by alm on 23/12/2020.
 */
/* global  */
(function (angular) {
	'use strict';
	var moduleName='defect.main';

	angular.module(moduleName).factory('defectMainClipboardService', ['$q', '$http', '$injector', '$translate', 'PlatformMessenger',
		'platformModalService', 'defectMainHeaderDataService', '_', 'modelViewerDragdropService',
		function ($q, $http, $injector, $translate, PlatformMessenger, platformModalService,
			defectMainHeaderDataService, _, modelViewerDragdropService) {

			var clipboard = {type: null, data: null, cut: false, dataFlattened: null};
			var service = {};

			service.clipboardStateChanged = new PlatformMessenger();
			service.onDragStart = new PlatformMessenger();
			service.onDragEnd = new PlatformMessenger();
			service.onDrag = new PlatformMessenger();
			service.onPostClipboardError = new PlatformMessenger();

			var add2Clipboard = function (item, type) {
				clipboard.type = type;
				clipboard.data = angular.copy(item);
				clipboard.dataFlattened = [];
				service.clipboardStateChanged.fire();
			};

			var clearClipboard = function () {
				clipboard.type = null;
				clipboard.data = null;
				clipboard.dataFlattened = null;
				service.clipboardStateChanged.fire();
			};

			service.setClipboardMode = function (clipboardMode) {
				clipboard.cut = clipboardMode;
			};

			service.getClipboard = function () {
				return clipboard;
			};


			service.canDrag = function () {
				var item = defectMainHeaderDataService.getSelected();
				return item !== null;
			};

			service.canPaste = function (/* type */) {
				return false;
			};
			service.copy = function (items, type) {
				add2Clipboard(items, type);
				clipboard.cut = false;
			};
			service.cut = function (items, type) {
				if (items) {
					clipboard.data = angular.copy(items);
					clipboard.type = type;
				}
			};


			service.fireOnDragStart = function () {

				service.onDragStart.fire();
			};

			service.fireOnDragEnd = function (e, arg) {
				service.onDragEnd.fire(e, arg);
			};

			service.fireOnDrag = function (e, arg) {
				service.onDrag.fire(e, arg);
			};

			service.clipboardHasData = function () {
				return clipboard.data !== null;
			};


			// #start drag & drop for 3D Viewer
			service.myDragdropAdapter = new modelViewerDragdropService.DragdropAdapter();
			service.myDragdropAdapter.canDrop = function (info) {
				if (!info.draggedData && info.draggedData.sourceGrid) {
					return;
				}
				if (info.draggedData.sourceGrid.type === 'modelMainObjectDataService') {
					return true;
				}
				return false;
			};

			service.myDragdropAdapter.drop = function (info) {

				if (!info.draggedData && info.draggedData.sourceGrid) {
					return;
				}
				var grid = info.draggedData.sourceGrid;
				var draggedData = grid.data;
				if (draggedData && grid.type === 'modelMainObjectDataService') {// drag project document to 3D viewer
					modelViewerDragdropService.paste().then(function () {
						clearClipboard();
					});
				}
			};

			return service;

		}]);
})(angular);
