(function (angular) {
	/* global globals, Platform */
	'use strict';
	var moduleName = 'project.main';
	/**
	 * @ngdoc service
	 * @name projectMainCostGroupClipboardService
	 * @description provides cut, copy and paste functionality for the treeview grid
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('projectMainCostGroupClipboardService', ['_','$injector', 'projectMainCostGroupDataService', '$http', 'platformDragdropService', 'projectMainService',
		'projectMainCostGroupCatalogDataService','cloudCommonGridService',
		function (_, $injector,projectMainCostGroupDataService, $http, platformDragdropService, projectMainService, projectMainCostGroupCatalogDataService,cloudCommonGridService) {

			var clipboard = {type: null, data: null, cut: false, dataFlattened: null};
			var service = {};

			// events
			service.clipboardStateChanged = new Platform.Messenger();
			service.onPostClipboardError = new Platform.Messenger();

			service.setClipboardMode = function (cut) {
				clipboard.cut = cut; // set clipboard mode
			};

			// removes a node including all sub-nodes
			var removeNode = function (content) {
				projectMainCostGroupDataService.moveItem(content.data);
			};

			var getChild = function (list, items) {
				angular.forEach(items, function (item) {
					var find = _.find(list, {Id: item.Id});
					if(!_.isNil(find)) {
						list.push(item);
					}
					if (item.HasChildren) {
						getChild(list, item.CostGroupChildren);
					}
				});
			};

			var getChildren = function (list, items, selection) {
				angular.forEach(items, function (item) {
					var found = _.find(selection,{CostGroupFk: item.Id});
					list.push(item);
					if(_.isNil(found)){
						if (item.HasChildren) {
							getChildren(list, item.CostGroupChildren, selection);
						}
					}
				});
			};

			var add2Clipboard = function (node, type) {

				clipboard.type = type;
				clipboard.data = angular.copy(node);
				clipboard.dataFlattened = [];
				for (var i = 0; i < clipboard.data.length; i++) {
					clipboard.dataFlattened.push(clipboard.data[i]);
					if (clipboard.data[i].HasChildren) {
						getChild(clipboard.dataFlattened, clipboard.data[i].CostGroupChildren);
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

				if(!toId) {
					toId=null;
				}

				var api = action === platformDragdropService.actions.move ? 'move' : 'copy';
				var url = 'project/main/costgroup/';
				var parentService = projectMainCostGroupCatalogDataService.parentService();
				var toCostGroupCatalogId = projectMainCostGroupCatalogDataService.getSelected() ? projectMainCostGroupCatalogDataService.getSelected().Id : -1;

				saveBeforeDragDrop(parentService).then(function(response){
					var savedCostGroup =[];
					if(type === 'sourceCostGroup'){
						api = 'copy';
					}

					if(response.CostGroupCatalogsToSave && response.CostGroupCatalogsToSave.length){
						_.forEach(response.CostGroupCatalogsToSave,function(cat){
							if(cat.CostGroupsToSave && cat.CostGroupsToSave.length){
								savedCostGroup = savedCostGroup.concat( cat.CostGroupsToSave);
							}
						});
					}

					if(savedCostGroup && savedCostGroup.length){
						_.forEach(data,function(d){
							var matchData = _.find(savedCostGroup,{'Id': d.Id});
							if(matchData){
								angular.extend(d, matchData);
							}
						});
					}

					$http.post(globals.webApiBaseUrl + url + api + '?toItem=' + toId  +'&toCostGroupCatalogId=' +toCostGroupCatalogId, data )
						.then(function onSuccess(response) {
							onSuccessCallback(response);
						})
						.catch (function onError(response) {
							service.onPostClipboardError.fire(response);
						});
				});
			};

			service.doCanPaste = function doCanPaste (canPastedContent, type, selectedItem){
				var result = true;

				if(type === 'sourceCostGroup'){
					return false;
				}
				if(!canPastedContent.type.includes('sourceCostGroup') && !canPastedContent.type.includes('projectCostGroup')){
					return false;
				}
				if(!selectedItem && !canPastedContent.type.includes('sourceCostGroup')){
					return false;
				}
				if(!canPastedContent.data){
					return false;
				}


				var output= [];
				var isToSubLevel = null;
				if(type === 'projectCostGroup'  && !canPastedContent.type.includes('sourceCostGroup')){
					cloudCommonGridService.flatten(canPastedContent.data, output, 'CostGroupChildren');
					isToSubLevel =_.find(output, {Id: selectedItem.Id});
				}

				if(isToSubLevel){
					return false;
				}

				var data;
				if(angular.isArray(canPastedContent.data)) {
					data = canPastedContent.data[0];
				} else {
					data = canPastedContent.data;
				}
				if (type !== canPastedContent.type) {
					var selectedCat = projectMainCostGroupCatalogDataService.getSelected();
					if(_.isNil(selectedCat)) {
						result = false;
					}
					return result;
				} else {
					if(canPastedContent.type === 'sourceCostGroup'   || canPastedContent.type === 'projectCostGroup') {
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
					if (_.isInteger(dropItem.CostGroupParentFk)) {
						var parentItem = projectMainCostGroupDataService.getItemById(dropItem.CostGroupParentFk);
						return isAssignmentAllowed(dragItem, parentItem);
					}
				}
				return true;
			}

			function saveBeforeDragDrop (parentService){
				return parentService.update();
			}

			/* jshint -W074 */ // this function is not really complex: Try harder - jsHint
			service.canPaste = function(type, selectedItem ) {
				service.doCanPaste({type: clipboard.type,
					data: clipboard.data,
					action: clipboard.cut ? platformDragdropService.actions.move : platformDragdropService.actions.copy},
				type, selectedItem);
			};


			service.cut = function (items, type) {
				add2Clipboard(items, type);
				clipboard.cut = true; // set clipboard mode
			};


			service.copy = function (items, type) {
				add2Clipboard(items, type);
				clipboard.cut = true; // set clipboard mode
			};

			service.doPaste = function doPaste (pastedContent, selectedItem, type, onSuccess) {
				if(!selectedItem && pastedContent.type !== 'sourceCostGroup') {
					return;
				}

				var pastedData  = angular.copy(pastedContent.data);
				var toItemId  = selectedItem ? selectedItem.Id : null;
				/*if (type === pastedContent.type) {
					if (type === 'costGroup1') {
						toItemId = selectedItem.Id;
					} else {
						toItemId = selectedItem.Id;
					}
				} else {
					if(selectedItem) {
						toItemId = selectedItem.Id;
					}
				}*/

				if(pastedContent.type === 'sourceCostGroup'){
					pastedContent.action = platformDragdropService.actions.copy;
				}
				// var pastedData = pastedContent.action === platformDragdropService.actions.move ? angular.copy(pastedContent.data) : flatten(angular.copy(pastedContent.data));
				// send changes to the server
				postClipboard(toItemId, pastedContent.action, pastedContent.type, pastedData, function (data) {

					// remove node first
					if(pastedContent.action === platformDragdropService.actions.move) {
						removeNode(pastedContent);
					}

					// update clipboard
					pastedData = data;
					switch (pastedContent.type) {
						case 'projectCostGroup':
						case 'sourceCostGroup':
							projectMainCostGroupDataService.load();
							break;
					}

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

			return service;

		}

	]);

})(angular);

