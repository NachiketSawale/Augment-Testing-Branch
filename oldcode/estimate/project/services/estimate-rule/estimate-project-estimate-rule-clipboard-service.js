/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _, Platform */
	'use strict';

	let moduleName = 'estimate.project';

	/**
 * @ngdoc service
 * @name estimateProjectRuleClipboardService
 * @description provides cut, copy and paste functionality for the treeview grid
 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateProjectRuleClipboardService', ['estimateProjectEstimateRulesService', 'estimateProjectEstRuleParamService', 'estimateProjectEstRuleScriptService', '$http',
		function (estimateProjectEstimateRulesService, estimateProjectEstRuleParamService, estimateProjectEstRuleScriptService, $http) {

			let clipboard = { type: null, data: null, cut: false, dataFlattened: null };
			let service = {};

			// events
			service.clipboardStateChanged = new Platform.Messenger();
			service.onDragStart = new Platform.Messenger();
			service.onDragEnd = new Platform.Messenger();
			service.onDrag = new Platform.Messenger();
			service.onPostClipboardError = new Platform.Messenger();

			service.setClipboardMode = function(cut) {
				clipboard.cut = cut; // set clipboard mode
			};

			service.canPaste = function(type, itemOnDragEnd) {
				let result = true;
				if( type !== clipboard.type) {
					switch(clipboard.type) {
						case 'rule':
							if(type === 'parameter' || type ==='script') {
								result = false;
							}
							break;
						case 'parameter':
							if(type !== 'rule') {
								result = false;
							}
							break;
						case 'script':
							if(type !== 'rule') {
								result = false;
							}
							break;
					}
					return result;
				} else {
					if (clipboard.type === 'group') {
						return false;
					} else if (clipboard.type === 'rule') {
						return isAssignmentAllowed(clipboard.data[0], itemOnDragEnd);
					}
				}
				return result;
			};

			function isAssignmentAllowed(dragItem, dropItem ){
				if(dropItem) {
					if (!dragItem || !dropItem || dropItem.Id === dragItem.Id) {
						return false;
					}
					if (_.isInteger(dropItem.PrjEstRuleFk)) {
						let parentItem = estimateProjectEstimateRulesService.getItemById(dropItem.PrjEstRuleFk);
						return isAssignmentAllowed(dragItem, parentItem);
					}
				}
				return true;
			}
			/**
		 * @ngdoc function
		 * @name cut
		 * @function
		 * @methodOf schedulingTemplateClipboardService
		 * @description adds the item to the cut clipboard
		 * @param {object} item selected node
		 * @returns
		 */
			service.cut = function(items, type) {
			// schedulingTemplateMainService.update();
			// schedulingTemplateGrpEditService.update();
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
			service.copy = function(items, type) {
				add2Clipboard(items, type);
				clipboard.cut = true; // set clipboard mode
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
				if(!selectedItem){
					return;
				}

				let toItemId;
				if (type === clipboard.type) {
				// if(clipboard.cut) {
				//   return;
				// }
					if (type === 'parameter' || type === 'script') {
						toItemId = clipboard.data[0].ActivityTemplateFk;
					} else if (type === 'rule') {
						toItemId = selectedItem.Id;
					} else {
						toItemId = selectedItem.Id;
					}
				} else {
					toItemId = selectedItem.Id;
				}
				// send changes to the server
				postClipboard(toItemId, clipboard.cut, function (data) {

					// remove node first
					if (clipboard.cut) {
						removeNode(clipboard.data);
					}

					// update clipboard
					clipboard.data = data;
					if(clipboard.type === type){
						switch (clipboard.type) {
							case 'rule':
								estimateProjectEstimateRulesService.load();
								break;
							case 'parameter':
								estimateProjectEstRuleParamService.load();
								break;
							case 'script':
								estimateProjectEstRuleScriptService.load();
								break;
						}
					}

					onSuccess(clipboard.type);   // callback on success
					clearClipboard();
				});
			};

			service.getClipboard = function() {
				return clipboard;
			};

			service.fireOnDragStart = function() {
				service.onDragStart.fire();
			};

			service.fireOnDragEnd = function(e,arg) {
				service.onDragEnd.fire(e,arg);
			};

			service.fireOnDrag = function(e,arg) {
				service.onDrag.fire(e,arg);
			};

			service.clearClipboard = function() {
				clearClipboard();
			};

			service.clipboardHasData = function() {
				return clipboard.data !== null;
			};

			// removes a node including all sub-nodes
			let removeNode = function(item) {
				switch (clipboard.type) {
					case 'rule':
						estimateProjectEstimateRulesService.moveItem(item);
						break;
					case 'parameter':
						estimateProjectEstRuleParamService.moveItem(item);
						break;
					case 'script':
						estimateProjectEstRuleScriptService.moveItem(item);
						break;
				}
			};

			let getChildren = function(list, items) {
				angular.forEach(items, function(item) {
					list.push(item);
					if(item.HasChildren) {
						getChildren (list, item.PrjEstRules);
					}
				});
			};

			let add2Clipboard = function(node, type) {

				clipboard.type = type;
				clipboard.data = angular.copy(node);
				clipboard.dataFlattened = [];
				for (let i=0; i< clipboard.data.length; i++) {
					clipboard.dataFlattened.push(clipboard.data[i]);
					if( clipboard.data[i].HasChildren){
						getChildren(clipboard.dataFlattened, clipboard.data[i].PrjEstRules);
					}
				}

				service.clipboardStateChanged.fire();
			};

			let clearClipboard = function() {
				clipboard.type = null;
				clipboard.data = null;
				clipboard.dataFlattened = null;
				service.clipboardStateChanged.fire();
			};

			let postClipboard = function (toId, cut, onSuccessCallback) {

				let api = cut === true ? 'move' : 'copy';
				let url = '';
				switch (clipboard.type) {
					case 'rule':
						url = 'estimate/rule/projectestimaterule/';
						break;
					case 'parameter':
						url = 'estimate/rule/projectestruleparam/';
						break;
					case 'script':
						url = 'estimate/rule/projectestrulescript/';
						break;
				}

				let data = clipboard.data;

				$http.post(globals.webApiBaseUrl + url + api + '?toItem=' + toId , data)
					.then(function onSuccess(response) {
						onSuccessCallback(response);
					})
					.catch (function onError(response) {

						// console.log(response.Exception.Message);
						service.onPostClipboardError.fire(response);

					});
			};

			return service;

		}

	]);

})(angular);
