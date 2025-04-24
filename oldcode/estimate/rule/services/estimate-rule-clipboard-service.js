/**
 * Created by lnt on 7/21/2016.
 */
(function (angular) {
	/* global globals, _, Platform */

	'use strict';

	let moduleName = 'estimate.rule';

	/**
	 * @ngdoc service
	 * @name estimateRuleClipboardService
	 * @description provides cut, copy and paste functionality for the treeview grid
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateRuleClipboardService', ['estimateRuleService', 'estimateRuleParameterService', 'estimateRuleScriptDataService', '$http',
		function (estimateRuleService, estimateRuleParameterService, estimateRuleScriptDataService, $http) {

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

			service.canPaste = function(type, itemOnDragEnd, itemService) {
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
					} else if (type === 'rule'){
						return isAssignmentAllowed(clipboard.data[0], itemOnDragEnd, itemService);
					}
				}
				return result;
			};

			function isAssignmentAllowed(dragItem, dropItem, itemService){
				if(dropItem) {
					if (!dragItem || !dropItem || dropItem.Id === dragItem.Id) {
						return false;
					}

					if (_.isInteger(dropItem.EstRuleFk)) {
						let parentItem = itemService.getItemById(dropItem.EstRuleFk);
						return isAssignmentAllowed(dragItem, parentItem, itemService);
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
				if(!selectedItem && type === clipboard.type && type !== 'rule'){
					return;
				}

				estimateRuleService.update();

				let toItemId;
				if (type === clipboard.type) {
					// if(clipboard.cut) {
					//   return;
					// }
					if (type === 'parameter' || type === 'script') {
						toItemId = clipboard.data[0].ActivityTemplateFk;
					} else if (type === 'rule') {
						toItemId = selectedItem ? selectedItem.Id : -1;
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
								estimateRuleService.load();
								break;
							case 'parameter':
								estimateRuleParameterService.load();
								break;
							case 'script':
								estimateRuleScriptDataService.load();
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
			function removeNode(item) {
				switch (clipboard.type) {
					case 'rule':
						estimateRuleService.moveItem(item);
						break;
					case 'parameter':
						estimateRuleParameterService.moveItem(item);
						break;
					case 'script':
						estimateRuleScriptDataService.moveItem(item);
						break;
				}
			}

			let getChildren = function(list, items) {
				angular.forEach(items, function(item) {
					list.push(item);
					if(item.HasChildren) {
						getChildren (list, item.EstRules);
					}
				});
			};

			function add2Clipboard(node, type) {

				clipboard.type = type;
				clipboard.data = angular.copy(node);
				clipboard.dataFlattened = [];
				for (let i=0; i< clipboard.data.length; i++) {
					clipboard.dataFlattened.push(clipboard.data[i]);
					if( clipboard.data[i].HasChildren){
						getChildren(clipboard.dataFlattened, clipboard.data[i].EstRules);
					}
				}

				service.clipboardStateChanged.fire();
			}

			function clearClipboard() {
				clipboard.type = null;
				clipboard.data = null;
				clipboard.dataFlattened = null;
				service.clipboardStateChanged.fire();
			}

			function postClipboard(toId, cut, onSuccessCallback) {

				let api = cut === true ? 'move' : 'copy';
				let url = '';
				switch (clipboard.type) {
					case 'rule':
						url = 'estimate/rule/estimaterule/';
						break;
					case 'parameter':
						url = 'estimate/rule/parameter/';
						break;
					case 'script':
						url = 'estimate/rule/script/';
						break;
				}

				let data = clipboard.data;

				$http.post(globals.webApiBaseUrl + url + api + '?toItem=' + toId , data)
					.then(function(response) {
						onSuccessCallback(response);
					})
					// todo global catch http errors (see http://stackoverflow.com/questions/11971213/global-ajax-error-handler-with-angularjs)
					.catch(function(response) {

						// console.log(response.Exception.Message);
						service.onPostClipboardError.fire(response);

					});
			}

			return service;

		}

	]);

})(angular);


