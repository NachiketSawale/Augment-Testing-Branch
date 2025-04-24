(function (angular) {
	'use strict';

	angular.module('basics.site').service('resourceReservationPlanningBoardClipboardService', ResourceReservationPlanningBoardClipboardService);

	ResourceReservationPlanningBoardClipboardService.$inject = ['resourceRequisitionDataService', 'platformDragdropService'];

	function ResourceReservationPlanningBoardClipboardService(resourceRequisitionDataService, platformDragdropService) {
		var clipboard = {type: null, data: null, cut: false, dataFlattened: null};
		var self = this;

		self.canDrag = function canDrag(/* type */) {
			return true;
		};
		// events
		this.clipboardStateChanged = new Platform.Messenger();
		this.onPostClipboardError = new Platform.Messenger();

		this.setClipboardMode = function (cut) {
			clipboard.cut = cut; // set clipboard mode
		};

		function doCanPaste (canPastedContent, selectedItem){
			var result = true;

			if (!_.includes(canPastedContent.type, 'resourceRequisition')) {
				result = false;
			}
			else if(!selectedItem){
				result = false;
			}
			else if(!canPastedContent.data){
				result = false;
			}
			return result;
		}

		this.canPaste = function(type, selectedItem ) {
			return doCanPaste({type: clipboard.type,
				data: clipboard.data,
				action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy}, selectedItem);
		};

		this.cut = function (items, type) {
			add2Clipboard(items, type);
			clipboard.cut = true; // set clipboard mode
		};

		this.copy = function (items, type) {
			add2Clipboard(items, type);
			clipboard.cut = true; // set clipboard mode
		};

		function doPaste (pastedContent, selectedItem, type, onSuccess) {
			if(!selectedItem && pastedContent.type !== 'resourceRequisition') {
				return;
			}

			var pastedData  = angular.copy(pastedContent.data);
			var action = pastedContent.action;

			var toItemId;
			if (type === pastedContent.type) {
				if (type === 'costGroup1') {
					toItemId = selectedItem.Id;
				} else {
					toItemId = selectedItem.Id;
				}
			} else {
				if(selectedItem) {
					toItemId = selectedItem.Id;
				}
				if(pastedContent.type === 'resourceRequisition'){
					action = 'platformDragdropService.actions.copy';
				}
			}
			// send changes to the server
			postClipboard(toItemId, action, pastedContent.type, pastedData, function (data) {

				// remove node first
				if(pastedContent.action === 'platformDragdropService.actions.move') {
					removeNode(clipboard.data);
				}

				// update clipboard
				pastedData = data;
				// if (pastedContent.type === type) {
				switch (pastedContent.type) {
					case 'resourceRequisition':
						resourceRequisitionDataService.load();
						break;
				}
				// }

				onSuccess(pastedContent.type);   // callback on success
				clearClipboard();
			});
		}

		this.paste = function (selectedItem, type, onSuccess) {
			doPaste({type: clipboard.type,
				data: clipboard.data,
				action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy}, selectedItem, type, onSuccess);
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

		var removeNode = function (item) {
			switch (clipboard.type) {
				case 'costGroup1':
					resourceRequisitionDataService.moveItem(item);
					break;
			}
		};

		var getChildren = function (list, items) {
			angular.forEach(items, function (item) {
				list.push(item);
				if (item.HasChildren) {
					getChildren(list, item.Locations);
				}
			});
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

		var postClipboard = function (toId, action, type /* data,onSuccessCallback */ ) {

			if(!toId) {
				toId=null;
			}
			// var api = action === platformDragdropService.actions.move ? 'move' : 'copy';
			var url = '';
			switch (type) {
				case 'resourceRequisition':
					url = 'resource/reservation/';
					break;
			}

			/*
				-- needs to figured out how to do this best ...
			$http.post(globals.webApiBaseUrl + url + api + '?toItem=' + toId+'&toProjectId=' + projectMainService.getSelected().Id, data )
					.then(function onSuccess(response) {
						onSuccessCallback(response);
					})
					.catch (function onError(response) {

					// console.log(response.Exception.Message);
					self.onPostClipboardError.fire(response);

				});
				*/
		};
	}
})(angular);

