(function (angular) {
	'use strict';
	var moduleName = 'basics.site';
	angular.module(moduleName).factory('basicsTreeClipboardServiceFactory', basicsTreeClipboardServiceFactory);

	basicsTreeClipboardServiceFactory.$inject = ['platformDragdropService'];

	function basicsTreeClipboardServiceFactory(platformDragdropService) {
		var serviceFactory = {};
		var serviceCache = {};

		serviceFactory.createService = function (dataService) {

			var service = {};

			var clipboard = { type: null, data: null, cut: false, dataFlattened: null };

			service.clipboardStateChanged = new Platform.Messenger();
			service.onDragStart = new Platform.Messenger();
			service.onDrag = new Platform.Messenger();
			service.onDragEnd = new Platform.Messenger();
			service.onPostClipboardError = new Platform.Messenger();
			service.onPostClipboardSuccess = new Platform.Messenger();

			service.setClipboardMode = function (cut) {
				clipboard.cut = cut;
			};

			service.getClipboardMode = function () {
				return clipboard.cut;
			};

			service.cut = function (items, type) {
				add2Clipboard(items, type);
				clipboard.cut = true;
			};

			service.copy = function (items, type) {
				add2Clipboard(items, type);
				clipboard.cut = false;
			};

			service.doCanPaste = function (canPastedContent, type, selectedItem) {
				if (type !== type) {
					return false;
				}

				var data;
				if (angular.isArray(canPastedContent.data)) {
					data = canPastedContent.data[0];
				} else {
					data = canPastedContent.data;
				}

				return dataService.canMove(data, selectedItem);
			};

			service.canPaste = function (type, selectedItem) {
				return service.doCanPaste({
					type: clipboard.type,
					data: clipboard.data,
					action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
				}, type, selectedItem);
			};

			service.doPaste = function (pastedContent, selectedItem, type, onSuccess) {
				var pastedData;
				if (pastedContent.action === platformDragdropService.actions.move) {
					pastedData = pastedContent.data;
				} else {
					pastedData = angular.copy(pastedContent.data);
				}

				var data;
				if (angular.isArray(pastedData)) {
					data = pastedData[0];
				} else {
					data = pastedData;
				}

				if (selectedItem !== null) {
					if (pastedContent.action === platformDragdropService.actions.move) {
						dataService.move(data, selectedItem);
						clearClipboard();
						if (onSuccess){
							onSuccess(pastedContent.type);
						}
					}
				}
			};

			service.paste = function (selectedItem, type, onSuccess) {
				service.doPaste({
					type: clipboard.type,
					data: clipboard.data,
					action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
				}, selectedItem, type, onSuccess);
			};

			service.getClipboard = function () {
				return clipboard;
			};

			service.clearClipboard = function () {
				clearClipboard();
			};

			service.clipboardHasData = function () {
				return angular.isDefined(clipboard.data) && clipboard.data !== null;
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

			function add2Clipboard(item, type) {
				clipboard.type = type;
				clipboard.data = angular.copy(item);
				clipboard.dataFlattened = [];
				service.clipboardStateChanged.fire();
			}

			function clearClipboard() {
				clipboard.type = null;
				clipboard.data = null;
				clipboard.dataFlattened = null;
				service.clipboardStateChanged.fire();
			}

			return service;

		};

		serviceFactory.getOrCreateService = function (dataService) {
			var dataServiceName = dataService.getServiceName();
			if(!serviceCache[dataServiceName]){
				serviceCache[dataServiceName] = serviceFactory.createService(dataService);
			}
			return serviceCache[dataServiceName];
		};
		return serviceFactory;
	}
})(angular);