(function (angular) {
	/* global globals Platform */
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingTemplateClipboardService
	 * @description provides cut, copy and paste functionality for the treeview grid
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('scheduling.template').factory('schedulingTemplateClipboardService', ['_', 'schedulingTemplateGrpMainService', 'schedulingTemplateActivityTemplateService', 'schedulingTemplateEventTemplateService', 'schedulingTemplatePerformanceRuleService', '$http', 'schedulingTemplateActivityTmpl2CUGrpService',
		'platformDragdropService',
		function (_, schedulingTemplateGrpMainService, schedulingTemplateActivityTemplateService, schedulingTemplateEventTemplateService, schedulingTemplatePerformanceRuleService, $http, schedulingTemplateActivityTmpl2CUGrpService, platformDragdropService) {

			var clipboard = {type: null, data: null, cut: false};
			var service = {};

			// events
			service.clipboardStateChanged = new Platform.Messenger();
			service.onPostClipboardError = new Platform.Messenger();

			service.setClipboardMode = function (cut) {
				clipboard.cut = cut; // set clipboard mode
			};

			/* jshint -W074 */
			service.doCanPaste = function doCanPaste(canPastedContent, type, selectedItem) {
				var result = true;
				if (!selectedItem) {
					return false;
				}
				if (!canPastedContent.data) {
					return false;
				}
				var inheritedList = _.filter(canPastedContent.data, {Inherited: true});
				if (inheritedList.length > 0 && inheritedList.length === canPastedContent.data.length &&
					canPastedContent.action === platformDragdropService.actions.move) {
					return false;
				}
				var data;
				if (angular.isArray(canPastedContent.data)) {
					data = canPastedContent.data[0];
				} else {
					data = canPastedContent.data;
				}
				if (type !== canPastedContent.type) {
					if (canPastedContent.action === platformDragdropService.actions.move && data && data.ActivityTemplateFk === selectedItem.Id) {
						result = false;
					}
					switch (canPastedContent.type) {
						case 'group':
							result = false;
							break;
						case 'activity':
							if (type === 'event' || type === 'tmp2cu' || type === 'performancerule') {
								result = false;
							}
							break;
						case 'tmp2cu':
							if (type !== 'activity') {
								result = false;
							}
							break;
						case 'event':
							if (type !== 'activity') {
								result = false;
							}
							break;
						case 'performancerule':
							if (type !== 'activity') {
								result = false;
							}
							break;
					}
					return result;
				} else {
					if (canPastedContent.type === 'group' ||
						canPastedContent.action === platformDragdropService.actions.move) {
						return false;
					}
				}
				return result;
			};
			/* jshint -W074 */ // this function is not really complex: Try harder - jsHint
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

				schedulingTemplateActivityTemplateService.update();

				var pastedData = angular.copy(pastedContent.data);

				var toItemId;
				if (pastedContent.type === type) {
					if (pastedContent.action === platformDragdropService.actions.move) {
						return;
					}
					if (pastedContent.type === 'event' || pastedContent.type === 'performancerule' || pastedContent.type === 'tmp2cu') {
						toItemId = pastedData[0].ActivityTemplateFk;
					} else if (pastedContent.type === 'activity') {
						toItemId = schedulingTemplateGrpMainService.getSelected().Id;
					} else {
						toItemId = selectedItem.Id;
					}
				} else {
					toItemId = selectedItem.Id;
				}
				// send changes to the server
				postClipboard(toItemId, pastedContent.action, pastedContent.type, pastedData, function (data) {

					// remove node first
					if (pastedContent.action === platformDragdropService.actions.move) {
						removeNode(data, pastedContent.type);
					}

					// update clipboard
					pastedData = data;
					switch (pastedContent.type) {
						case 'activity':
							schedulingTemplateActivityTemplateService.load();
							break;
						case 'group':
							schedulingTemplateGrpMainService.load();
							break;
						case 'event':
							schedulingTemplateEventTemplateService.load();
							break;
						case 'performancerule':
							schedulingTemplatePerformanceRuleService.load();
							break;
						case 'tmp2cu':
							schedulingTemplateActivityTmpl2CUGrpService.load();
							break;
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
					case 'activity':
						schedulingTemplateActivityTemplateService.moveItem(item);
						break;
					case 'group':
						schedulingTemplateGrpMainService.moveItem(item);
						break;
					case 'event':
						schedulingTemplateEventTemplateService.moveItem(item);
						break;
					case 'performancerule':
						schedulingTemplatePerformanceRuleService.moveItem(item);
						break;
					case 'tmp2cu':
						schedulingTemplateActivityTmpl2CUGrpService.moveItem(item);
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

			var add2Clipboard = function (node, type) {

				clipboard.type = type;
				clipboard.data = angular.copy(node);
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
				service.clipboardStateChanged.fire();
			};

			var postClipboard = function (toId, action, type, data, onSuccessCallback) {

				var api = action === platformDragdropService.actions.move ? 'move' : 'copy';
				var url = '';
				switch (type) {
					case 'group':
						url = 'scheduling/template/activitytemplategroup/';
						break;
					case 'activity':
						url = 'scheduling/template/activitytemplate/';
						break;
					case 'event':
						url = 'scheduling/template/eventtemplate/';
						break;
					case 'tmp2cu':
						url = 'scheduling/template/activitytmpl2cugrp/';
						break;
					case 'performancerule':
						url = 'scheduling/template/performancerule/';
						break;
				}

				$http.post(globals.webApiBaseUrl + url + api + '?toItem=' + toId, data)
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

