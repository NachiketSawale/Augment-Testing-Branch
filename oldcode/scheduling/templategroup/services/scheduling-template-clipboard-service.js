(function (angular) {

	/* global globals */
	/* global Platform */

	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingTemplateClipboardService
	 * @description provides cut, copy and paste functionality for the treeview grid
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('scheduling.templategroup').factory('schedulingTemplateGrpClipboardService', ['_', 'schedulingTemplateActivityTmplGrp2CUGrpService',
		'schedulingTemplateGrpEditService', '$http', 'platformDragdropService',
		function (_, schedulingTemplateActivityTmplGrp2CUGrpService, schedulingTemplateGrpEditService, $http, platformDragdropService) {

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
				if (!selectedItem) {
					return false;
				}
				var data;
				var dataFlattened = flatten(canPastedContent.data);

				if (angular.isArray(canPastedContent.data)) {
					data = canPastedContent.data[0];
				} else {
					data = canPastedContent.data;
				}

				if (type !== canPastedContent.type) {
					if (canPastedContent.type === 'group-edit') {
						result = false;
					}
					if (canPastedContent.action === platformDragdropService.actions.move && data &&
						data.ActivityTemplateGroupFk === selectedItem.Id) {
						result = false;
					}
				} else {
					if (canPastedContent.action === platformDragdropService.actions.move && canPastedContent.type !== 'group-edit') {
						return false;
					}
					if (canPastedContent.type === 'group-edit' && angular.isDefined(selectedItem)) {
						var pos = _.find(dataFlattened, function (item) {
							return item.Id === selectedItem.Id;
						});

						if (pos) {
							result = false;
						}
					}
				}
				return result;
			};

			service.canPaste = function (type, selectedItem) {
				service.doCanPaste({
					type: clipboard.type,
					data: clipboard.data,
					action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
				},
				type, selectedItem);
			};

			/**
			 * @ngdoc function
			 * @name cut
			 * @function
			 * @methodOf schedulingTemplateClipboardService
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
			 * @methodOf schedulingTemplateClipboardService
			 * @description adds the item to the copy clipboard
			 * @param {object} item selected node
			 * @returns
			 */
			service.copy = function (items, type) {
				add2Clipboard(items, type);
				clipboard.cut = false; // set clipboard mode
			};

			/**
			 * @ngdoc function
			 * @name doPaste
			 * @function
			 * @methodOf schedulingTemplateClipboardService
			 * @description move or copy the clipboard to the selected template group
			 * @param {object} selected template group selected node
			 * @returns
			 */
			service.doPaste = function doPaste(pastedContent, selectedItem, type, onSuccess) {
				if (!selectedItem) {
					return;
				}

				if (schedulingTemplateGrpEditService.getSelected()) {
					schedulingTemplateGrpEditService.update();
				}

				var pastedData = angular.copy(pastedContent.data);

				var data;

				if (angular.isArray(pastedData)) {
					data = pastedData[0];
				} else {
					data = pastedData;
				}

				var toItemId;
				if (type === pastedContent.type) {
					if (type === 'grp2cu') {
						toItemId = data.ActivityTemplateGroupFk;
					} else {
						toItemId = selectedItem.Id;
					}
				} else {
					toItemId = selectedItem.Id;
				}
				// send changes to the server
				postClipboard(toItemId, pastedContent.action, pastedContent.type, pastedData, function (response) {

					// remove node first
					if (pastedContent.action === platformDragdropService.actions.move) {
						removeNode(response.data, pastedContent.type);
					}

					// update clipboard
					pastedData = response.data;
					if (pastedContent.type === type) {
						if (pastedContent.type === 'group-edit') {
							schedulingTemplateGrpEditService.load();
						} else if (pastedContent.type === 'grp2cu') {
							schedulingTemplateActivityTmplGrp2CUGrpService.load();
						}
					}
					onSuccess(pastedContent.type);   // callback on success
				});
			};

			/**
			 * @ngdoc function
			 * @name paste
			 * @function
			 * @methodOf schedulingTemplateClipboardService
			 * @description move or copy the clipboard to the selected template group
			 * @param {object} selected template group selected node
			 * @returns
			 */
			service.paste = function (selectedItem, type, onSuccess) {
				service.doPaste({
					type: clipboard.type,
					data: clipboard.data,
					action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy
				},
				selectedItem, type, onSuccess);
			};

			service.getClipboard = function () {
				return clipboard;
			};

			service.clearClipboard = function () {
				clearClipboard();
			};

			service.clipboardHasData = function () {
				return clipboard.data !== null;
			};

			// removes a node including all sub-nodes
			var removeNode = function (item, type) {
				switch (type) {
					case 'group-edit':
						schedulingTemplateGrpEditService.moveItem(item);
						break;
					case 'grp2cu':
						schedulingTemplateActivityTmplGrp2CUGrpService.moveItem(item);
						break;
				}
			};

			var getChildren = function (list, items) {
				angular.forEach(items, function (item) {
					list.push(item);
					if (item.HasChildren) {
						getChildren(list, item.ActivityTemplateGroups);
					}
				});
			};

			function flatten(data) {
				var flattenedData = [];
				for (var i = 0; i < data.length; i++) {
					flattenedData.push(data[i]);
					if (data[i].HasChildren) {
						getChildren(flattenedData, data[i].ActivityTemplateGroups);
					}
				}
				return flattenedData;
			}

			var add2Clipboard = function (node, type) {

				clipboard.type = type;
				clipboard.data = angular.copy(node);
				clipboard.dataFlattened = flatten(clipboard.data);

				service.clipboardStateChanged.fire();
			};

			// keep this code - supports offline mode !
			//   var nextId = 0;
			//   var getUnusedId = function() {
			//      nextId--;
			//      return nextId;
			//   }
			//   var setNewIds = function(boqItem) {
			//
			//      boqItem.Id = getUnusedId();
			//
			//      if (angular.isDefined(boqItem.BoqItems) && boqItem.BoqItems !== null) {
			//
			//         for (var i = 0; i < boqItem.BoqItems.length; i++) {
			//            boqItem.BoqItems[i].Id = getUnusedId();
			//            setNewIds(boqItem.BoqItems[i]);
			//         }
			//      }
			//   };

			var clearClipboard = function () {
				clipboard.type = null;
				clipboard.data = null;
				clipboard.dataFlattened = null;
				service.clipboardStateChanged.fire();
			};

			var postClipboard = function (toId, cut, type, data, onSuccessCallback) {

				var api = cut === platformDragdropService.actions.move ? 'move' : 'copy';
				var url = '';
				switch (type) {
					case 'group-edit':
						url = 'scheduling/template/activitytemplategroup/';
						break;
					case 'grp2cu':
						url = 'scheduling/template/activitytmplgrp2cugrp/';
						break;
				}

				$http.post(globals.webApiBaseUrl + url + api + '?toItem=' + toId, data)
					.then(function onSuccess(response) {
						onSuccessCallback(response);
					})
					.catch(function onError(response) {
						service.onPostClipboardError.fire(response);
					});
			};

			return service;

		}

	]);

})(angular);

