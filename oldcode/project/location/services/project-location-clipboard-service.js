(function (angular) {
	/* global globals Platform */
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectLocationClipboardService
	 * @description provides cut, copy and paste functionality for the treeview grid
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('project.location').factory('projectLocationClipboardService', ['_', 'projectLocationMainService', '$http', 'platformDragdropService', 'projectMainService',
		function (_, projectLocationMainService, $http, platformDragdropService, projectMainService) {

			var clipboard = {type: null, data: null, cut: false, dataFlattened: null};
			var service = {};

			// events
			service.clipboardStateChanged = new Platform.Messenger();
			service.onPostClipboardError = new Platform.Messenger();

			service.setClipboardMode = function (cut) {
				clipboard.cut = cut; // set clipboard mode
			};

			service.doCanPaste = function doCanPaste(canPastedContent, type, selectedItem) {
				var result = true;
				if (canPastedContent.type !== 'sourceLocation' && canPastedContent.type !== 'location') {
					return false;
				}
				if (!selectedItem && canPastedContent.type !== 'sourceLocation') {
					return false;
				}
				if (!canPastedContent.data) {
					return false;
				}
				var data;
				if (angular.isArray(canPastedContent.data)) {
					data = canPastedContent.data[0];
				} else {
					data = canPastedContent.data;
				}
				if (type !== canPastedContent.type) {
					if (type !== 'location') {
						result = false;
					}
					return result;
				} else {
					if (canPastedContent.type === 'sourceLocation') {
						return false;
					} else if (type === 'location') {
						return isAssignmentAllowed(canPastedContent.data[0], selectedItem);
					}
				}
				return result;
			};

			function isAssignmentAllowed(dragItem, dropItem) {
				if (dropItem) {
					if (!dragItem || !dropItem || dropItem.Id === dragItem.Id) {
						return false;
					}
					if (_.isInteger(dropItem.LocationParentFk)) {
						var parentItem = projectLocationMainService.getItemById(dropItem.LocationParentFk);
						return isAssignmentAllowed(dragItem, parentItem);
					}
				}
				return true;
			}

			/* jshint -W074 */ // this function is not really complex: Try harder - jsHint
			service.canPaste = function (type, selectedItem) {
				service.doCanPaste({
					type: clipboard.type,
					data: clipboard.data,
					action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
				}, type, selectedItem);
			};

			/**
			 * @ngdoc function
			 * @name cut
			 * @function
			 * @methodOf projectLocationClipboardService
			 * @description adds the item to the cut clipboard
			 * @param {object} item selected node
			 * @returns
			 */
			service.cut = function (items, type) {
				add2Clipboard(items, type);
				clipboard.cut = true; // set clipboard mode
			};

			/**
			 * @ngdoc function
			 * @name copy
			 * @function
			 * @methodOf projectLocationClipboardService
			 * @description adds the item to the copy clipboard
			 * @param {object} item selected node
			 * @returns
			 */
			service.copy = function (items, type) {
				add2Clipboard(items, type);
				clipboard.cut = true; // set clipboard mode
			};
			/**
			 * @ngdoc function
			 * @name doPaste
			 * @function
			 * @methodOf projectLocationClipboardService
			 * @description move or copy the clipboard to the selected template group
			 * @param {object} selected template group selected node
			 * @returns
			 */
			service.doPaste = function doPaste(pastedContent, selectedItem, type, onSuccess) {
				if (pastedContent.type !== 'sourceLocation' && pastedContent.type !== 'location') {
					return;
				}
				if (!selectedItem && pastedContent.type !== 'sourceLocation') {
					return;
				}

				var action = pastedContent.action;

				var toItemId;
				if (type === pastedContent.type) {
					if (type === 'location') {
						toItemId = selectedItem.Id;
					} else {
						toItemId = selectedItem.Id;
					}
				} else {
					if (selectedItem) {
						toItemId = selectedItem.Id;
					}
					if (pastedContent.type === 'sourceLocation') {
						action = platformDragdropService.actions.copy;
					}
				}

				var pastedData = action === platformDragdropService.actions.move ? angular.copy(pastedContent.data) : flatten(angular.copy(pastedContent.data));
				// send changes to the server
				postClipboard(toItemId, action, pastedContent.type, pastedData, function (data) {

					// remove node first
					if (pastedContent.action === platformDragdropService.actions.move) {
						removeNode(pastedContent.data);
					}

					// update clipboard
					pastedData = data;
					// if (pastedContent.type === type) {
					switch (pastedContent.type) {
						case 'location':
						case 'sourceLocation':
							projectLocationMainService.load();
							break;
					}
					// }

					onSuccess(pastedContent.type);   // callback on success
					clearClipboard();
				});
			};
			/**
			 * @ngdoc function
			 * @name paste
			 * @function
			 * @methodOf projectLocationClipboardService
			 * @description move or copy the clipboard to the selected template group
			 * @param {object} selected template group selected node
			 * @returns
			 */
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

			service.fireOnDragStart = function () {
				service.onDragStart.fire();
			};

			service.fireOnDragEnd = function (e, arg) {
				service.onDragEnd.fire(e, arg);
			};

			service.fireOnDrag = function (e, arg) {
				service.onDrag.fire(e, arg);
			};

			service.clearClipboard = function () {
				clearClipboard();
			};

			service.clipboardHasData = function () {
				return clipboard.data !== null;
			};

			// removes a node including all sub-nodes
			var removeNode = function (item) {
				switch (clipboard.type) {
					case 'location':
						projectLocationMainService.moveItem(item);
						break;
				}
			};

			var getChildren = function (list, items, selection) {
				angular.forEach(items, function (item) {
					var found = _.find(selection, {LocationParentFk: item.Id});
					list.push(item);
					if (_.isNil(found)) {
						if (item.HasChildren) {
							getChildren(list, item.Locations, selection);
						}
					}
				});
			};

			var flatten = function (data) {
				var flatList = [];
				angular.forEach(data, function (item) {
					flatList.push(item);
					var found = _.find(data, {LocationParentFk: item.Id});
					if (item.HasChildren && _.isNil(found)) {
						getChildren(flatList, item.Locations, data);
					}
				});
				return flatList;
			};

			var add2Clipboard = function (node, type) {

				clipboard.type = type;
				clipboard.data = angular.copy(node);
				clipboard.dataFlattened = [];
				for (var i = 0; i < clipboard.data.length; i++) {
					clipboard.dataFlattened.push(clipboard.data[i]);
					if (clipboard.data[i].HasChildren) {
						getChildren(clipboard.dataFlattened, clipboard.data[i].Locations, clipboard.data);
					}
				}

				service.clipboardStateChanged.fire();
			};

			var clearClipboard = function () {
				clipboard.type = null;
				clipboard.data = null;
				clipboard.dataFlattened = null;
				service.clipboardStateChanged.fire();
			};

			var postClipboard = function (toId, action, type, data, onSuccessCallback) {

				if (!toId) {
					toId = null;
				}
				var api = action === platformDragdropService.actions.move ? 'move' : 'copy';
				var url = '';
				switch (type) {
					case 'location':
					case 'sourceLocation':
						url = 'project/location/';
						break;
				}

				$http.post(globals.webApiBaseUrl + url + api + '?toItem=' + toId + '&toProjectId=' + projectMainService.getSelected().Id, data)
					.then(function onSuccess(response) {
						onSuccessCallback(response);
					})
					.catch(function onError(response) {

						// console.log(response.Exception.Message);
						service.onPostClipboardError.fire(response);

					});
			};

			return service;

		}

	]);

})(angular);

