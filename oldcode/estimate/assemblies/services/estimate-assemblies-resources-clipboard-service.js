/**
 * Created by badugula on 06.09.2019
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global Platform, _ */
	'use strict';
	let moduleName = 'estimate.assemblies';
	/**
     * @ngdoc service
     * @name estimateAssembliesResourcesClipboardService
     * @description provides cut, copy and paste functionality for the treeview grid for Assembly Resourcs in Assemblies
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateAssembliesResourcesClipboardService', ['$injector','globals','estimateAssembliesResourceService', 'estimateAssembliesService','$http', 'platformDragdropService',
		function ($injector, globals, estimateAssembliesResourceService,estimateAssembliesService, $http, platformDragdropService) {

			let clipboard = {type: null, data: null, cut: false, dataFlattened: null};
			let service = {};

			// events
			service.clipboardStateChanged = new Platform.Messenger();
			service.onPostClipboardError = new Platform.Messenger();

			service.setClipboardMode = function (cut) {
				clipboard.cut = cut; // set clipboard mode
			};

			service.doCanPaste = function doCanPaste (canPastedContent, type, selectedItem){
				let result = true;
				if(!canPastedContent.type.includes('sourceEstResources') && !canPastedContent.type.includes('estResources')){
					return false;
				}
				if(!selectedItem && !canPastedContent.type.includes('sourceEstResource')){
					return false;
				}
				if(!canPastedContent.data){
					return false;
				}
				// let data;
				// if(angular.isArray(canPastedContent.data)) {
				// data = canPastedContent.data[0];
				// } else {
				// data = canPastedContent.data;
				// }
				if (type !== canPastedContent.type) {
					if (type !== 'estResources') {
						result = false;
					}
					return result;
				} else {
					if (canPastedContent.type === 'sourceEstResources') {
						return false;
					} else if(canPastedContent.type === 'estResources'){
						return isAssignmentAllowed(canPastedContent.data[0], selectedItem);
					}
				}
				return result;
			};
			function isAssignmentAllowed(dragItem, dropItem ){
				if(dropItem) {
					if (!dragItem || !dropItem || dropItem.Id === dragItem.Id) {
						return false;
					}
					if (_.isInteger(dropItem.EstResourceParentFk)) {
						let parentItem = estimateAssembliesResourceService.getItemById(dropItem.EstResourceParentFk);
						return isAssignmentAllowed(dragItem, parentItem);
					}

					if (dropItem.EstResourceTypeFk !== 5) {
						// destination item is not a sub item
						return false;
					}
				}
				return true;
			}

			/* jshint -W074 */ // this function is not really complex: Try harder - jsHint
			service.canPaste = function(type, selectedItem ) {
				service.doCanPaste({type: clipboard.type,
					data: clipboard.data,
					action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy},
				type, selectedItem);
			};

			/**
             * @ngdoc function
             * @name cut
             * @function
             * @methodOf estimateAssembliesResourcesClipboardService
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
             * @methodOf estimateAssembliesResourcesClipboardService
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
             * @methodOf estimateAssembliesResourcesClipboardService
             * @description move or copy the clipboard to the selected template group
             * @param {object} selected template group selected node
             * @returns
             */
			service.doPaste = function doPaste (pastedContent, selectedItem, type, onSuccess) {
				if(!selectedItem && pastedContent.type !== 'sourceEstResources') {
					return;
				}

				// destination item is not a sub item
				if(selectedItem.EstResourceTypeFk !== 5){
					return;
				}

				let pastedData  = angular.copy(pastedContent.data);
				let action = pastedContent.action;

				let toItemId;
				if (type === pastedContent.type) {
					if (type === 'estResources') {
						toItemId = selectedItem.Id;
					} else {
						toItemId = selectedItem.Id;
					}
				} else {
					if(selectedItem) {
						toItemId = selectedItem.Id;
					}
					if(pastedContent.type === 'sourceEstResources'){
						action = platformDragdropService.actions.copy;
					}
				}
				// send changes to the server
				postClipboard(toItemId, action, pastedContent.type, pastedData, selectedItem, function (response) {

					// remove node first
					if(pastedContent.action === platformDragdropService.actions.move) {
						removeNode(clipboard.data);
					}

					if(pastedContent.type === 'estResources' && pastedContent.action === platformDragdropService.actions.move){
						let selectedItem = estimateAssembliesService.getSelected();

						estimateAssembliesService.addList(response.data.Item1, true);
						estimateAssembliesService.fireListLoaded();

						estimateAssembliesService.setSelected({}).then(function(){
							estimateAssembliesService.setSelected(selectedItem);
						});
					}
					
					// update clipboard
					pastedData = response;

					// if (pastedContent.type === type) {
					switch (pastedContent.type) {
						case 'estResources':
						case 'sourceEstResources':
							estimateAssembliesResourceService.load();
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
             * @methodOf estimateAssembliesResourcesClipboardService
             * @description move or copy the clipboard to the selected template group
             * @param {object} selected template group selected node
             * @returns
             */
			service.paste = function (selectedItem, type, onSuccess) {
				service.doPaste({type: clipboard.type,
					data: clipboard.data,
					action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy},
				selectedItem, type, onSuccess);
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
			function removeNode(item) {
				switch (clipboard.type) {
					case 'estResources':
						estimateAssembliesResourceService.moveItem(item);
						break;
				}
			}

			function getChildren(list, items) {
				angular.forEach(items, function (item) {
					list.push(item);
					if (item.HasChildren) {
						getChildren(list, item.Locations);
					}
				});
			}

			function add2Clipboard(node, type) {

				clipboard.type = type;
				clipboard.data = angular.copy(node);
				clipboard.dataFlattened = [];
				for (let i = 0; i < clipboard.data.length; i++) {
					clipboard.dataFlattened.push(clipboard.data[i]);
					if (clipboard.data[i].HasChildren) {
						getChildren(clipboard.dataFlattened, clipboard.data[i].Locations);
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

			function postClipboard(toId, action, type, data, destItem, onSuccessCallback) {

				if(!toId) {
					toId=null;
				}
				let api = action === platformDragdropService.actions.move ? 'move' : 'copy';
				let url = '';
				switch (type) {
					case 'estResources':
					case 'sourceEstResources':
						url = 'estimate/main/resource/';
						break;
				}
				
				if (api === 'move') {
					let itemList = estimateAssembliesResourceService.getList();
					let estimateMainResourceType = $injector.get('estimateMainResourceType');
					angular.forEach(data, function (item) {
						$injector.get('estimateMainGenerateSortingService').sortOnDragDrop(destItem, itemList, item);
					});
					
					angular.forEach(data, function (item) {
						if (item.EstResourceTypeFk === estimateMainResourceType.SubItem) {
							item.EstResourceFk = _.find(itemList, {'Id': item.Id}).EstResourceFk;
							$injector.get('estimateMainSubItemCodeGenerator').getSubItemCode(item, itemList);
							_.find(itemList, {'Id': item.Id}).Code = item.Code;
							// handle subitem child code
							if(item.EstResources.length > 0){
								let newItem = _.find(itemList, {'Id': item.Id});
								$injector.get('estimateMainResourceDetailService').updateCodeAndSorting(newItem.EstResources, newItem, estimateAssembliesResourceService);
							}							
						}
					});

					data = itemList;
				}

				$http.post(globals.webApiBaseUrl + url + api + '?toItem=' + toId, data)
					.then(function onSuccess(response) {
						onSuccessCallback(response);
					})
					.catch (function onError(response) {
						service.onPostClipboardError.fire(response);
					});
			}

			return service;
		}
	]);

})(angular);

