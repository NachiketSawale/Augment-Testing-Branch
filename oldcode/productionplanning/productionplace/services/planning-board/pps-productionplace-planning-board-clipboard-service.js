(function () {
	'use strict';

	var moduleName = 'productionplanning.productionplace';
	var serviceName = 'ppsProductionPlacePlanningBoardClipboardService';

	angular.module(moduleName).service(serviceName, PpsProductionPlaceClipboardService);

	PpsProductionPlaceClipboardService.$inject = ['_', 'globals', '$http', 'platformDragdropService'];

	function PpsProductionPlaceClipboardService(_, globals, $http, platformDragdropService) {
		var clipboard = { type: null, data: null, cut: false, dataFlattened: null };
		var self = this;

		self.canDrag = function canDrag() {
			return true;
		};
		// events
		this.clipboardStateChanged = new Platform.Messenger();
		this.onPostClipboardError = new Platform.Messenger();

		this.setClipboardMode = function (cut) {
			clipboard.cut = cut; // set clipboard mode
		};

		function doCanPaste(canPastedContent, type, selectedItem) {
			var result = true;

			if (!_.includes(canPastedContent.type, 'productionPhase')) {
				return false;
			}
			if (!selectedItem) {
				return false;
			}
			if (!canPastedContent.data) {
				return false;
			}

			if (type !== canPastedContent.type) {
				if (type !== 'productionPhase') {
					result = false;
				}
				return result;
			} else {
				if (canPastedContent.type === 'productionPhase') {
					return false;
				}
			}
			return result;
		}

		this.canPaste = function (type, selectedItem) {
			return doCanPaste({
				type: clipboard.type,
				data: clipboard.data,
				action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
			},
			type,
			selectedItem);
		};

		var add2Clipboard = function (node, type) {
			clipboard.type = type;
			clipboard.data = angular.copy(node);
			clipboard.dataFlattened = [];

			self.clipboardStateChanged.fire();
		};

		var clearClipboard = function () {
			clipboard.type = null;
			clipboard.data = null;
			clipboard.dataFlattened = null;
			self.clipboardStateChanged.fire();
		};


		this.cut = function (items, type) {
			add2Clipboard(items, type);
			clipboard.cut = true; // set clipboard mode
		};

		this.copy = function (items, type) {
			add2Clipboard(items, type);
			clipboard.cut = true; // set clipboard mode
		};

		function doPaste(pastedContent, selectedItem, type, onSuccess) {
			if (!selectedItem && pastedContent.type !== 'productionPhase') {
				return;
			}

		}

		this.paste = function (selectedItem, type, onSuccess) {
			doPaste({
				type: clipboard.type,
				data: clipboard.data,
				action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
			},
			selectedItem, type, onSuccess);
		};

		this.getClipboard = function () {
			return clipboard;
		};

		this.fireOnDragStart = function () {
			self.onDragStart.fire();
		};

		this.fireOnDragEnd = function (e, arg) {
			self.onDragEnd.fire(e, arg);
		};

		this.fireOnDrag = function (e, arg) {
			self.onDrag.fire(e, arg);
		};

		this.clearClipboard = function () {
			clearClipboard();
		};

		this.clipboardHasData = function () {
			return clipboard.data !== null;
		};



	}
})(angular);

