/**
 * Created by lst on 11/6/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'documents.project';

	angular.module(moduleName).factory('documentRevisionClipboardService',
		['PlatformMessenger',
			function (PlatformMessenger) {
				var clipboard = {type: null, data: null, cut: false, dataFlattened: null};
				var service = {};

				service.clipboardStateChanged = new PlatformMessenger();

				service.setClipboardMode = function (clipboardMode) {
					clipboard.cut = clipboardMode;
				};

				service.getClipboard = function () {
					return clipboard;
				};

				service.canDrag = function (/* type */) {
					return true;
				};

				service.canPaste = function (/* type */) {
					return true;
				};

				service.cut = function (items, type) {
					if (items) {
						clipboard.data = angular.copy(items);
						clipboard.type = type;
					}
				};

				service.copy = function (items, type) {
					clipboard.type = type;
					clipboard.data = angular.copy(items);
					clipboard.dataFlattened = [];
					service.clipboardStateChanged.fire();

					clipboard.cut = false;
				};

				service.paste = function () {

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
				};

				return service;

			}]);
})(angular);
