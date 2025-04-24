(function (angular) {
	/* global angular, globals, _, Platform */
	'use strict';
	var moduleName = 'basics.costgroups';

	angular.module(moduleName).factory('basicsCostGroupClipboardService', ['$injector', 'projectMainCostGroupDataService', '$http', 'platformDragdropService', 'projectMainService',
		'projectMainCostGroupCatalogDataService','cloudCommonGridService',
		function ($injector,projectMainCostGroupDataService, $http, platformDragdropService, projectMainService, projectMainCostGroupCatalogDataService,cloudCommonGridService) {

			var clipboard = {type: null, data: null, cut: false, dataFlattened: null};
			var service = {};

			// events
			service.clipboardStateChanged = new Platform.Messenger();
			service.onPostClipboardError = new Platform.Messenger();

			service.setClipboardMode = function (cut) {
				clipboard.cut = cut; // set clipboard mode
			};


			var getChild = function (list, items) {
				angular.forEach(items, function (item) {
					var find = _.find(list, {Id: item.Id});
					if(find) {
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
				var url = 'basics/CostGroups/costgroup/';
				var parentService = $injector.get('basicsCostGroupCatalogDataService');
				var toCostGroupCatalogId = parentService.getSelected() ? parentService.getSelected().Id : -1;

				saveBeforeDragDrop(parentService).then(function(response){
					var savedCostGroup = response.CostGroupsToSave;
					if(savedCostGroup && savedCostGroup.length){
						_.forEach(data,function(d){
							var matchData = _.find(savedCostGroup,{'Id': d.Id});
							if(matchData){
								angular.extend(d, matchData);
							}
						});
					}

					var output = data;
					if(api === 'copy') {
						output =[];
						cloudCommonGridService.flatten(data, output, 'ChildItems');
						_.forEach(output, function (d) {
							d.ChildItems = [];
							d.HasChildren = false;
						});
						output = _.uniq(output, 'Id');
						output = _.orderBy(output, ['Id'], ['asc']);
					}
					$http.post(globals.webApiBaseUrl + url + api + '?toItem=' + toId  +'&toCostGroupCatalogId=' +toCostGroupCatalogId, output )
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
				if(!canPastedContent.type.includes('costGroup')){
					return false;
				}

				if(!canPastedContent.data){
					return false;
				}

				if(!selectedItem){
					return false;
				}


				var output= [];
				var isToSubLevel = null;
				if(type ==='costGroup'){
					cloudCommonGridService.flatten(canPastedContent.data, output, 'ChildItems');
					isToSubLevel =_.find(output, {Id: selectedItem.Id});
				}

				if(isToSubLevel){
					return false;
				}

				let data;
				if(angular.isArray(canPastedContent.data)) {
					data = canPastedContent.data[0];
				} else {
					data = canPastedContent.data;
				}
				if (type !== canPastedContent.type) {
					if (type !== 'costGroup') {
						result = false;
					}
					var selectedCat = projectMainCostGroupCatalogDataService.getSelected();
					if(_.isNil(selectedCat)) {
						result = false;
					}
					return result;
				} else {
					if(canPastedContent.type === 'costGroup'){
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
				if(!selectedItem) {
					return;
				}

				var pastedData  = angular.copy(pastedContent.data);
				var toItemId;
				/* if (type === pastedContent.type) {
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
				if(selectedItem) {
					toItemId = selectedItem.Id;
				}
				postClipboard(toItemId, pastedContent.action, pastedContent.type, pastedData, function (data) {

					// remove node first
					//if(pastedContent.action === platformDragdropService.actions.move) {
					// removeNode(pastedContent);
					// }

					// update clipboard
					var basicsCostGroupDataService = $injector.get('basicsCostGroupDataService');
					basicsCostGroupDataService.load();

					onSuccess(pastedContent.type);   // callback on success
					clearClipboard();
				});
			};

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

