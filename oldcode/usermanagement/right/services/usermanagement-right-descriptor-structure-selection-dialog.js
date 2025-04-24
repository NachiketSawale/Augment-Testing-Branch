/**
 * Created by sandu on 12.10.2015.
 */
(function(angular){
	'use strict';

	var moduleName = 'usermanagement.right';

	angular.module(moduleName).controller('usermanagementRightDescriptorStructureSelectionDialogController',usermanagementRightDescriptorStructureSelectionDialogController);
	usermanagementRightDescriptorStructureSelectionDialogController.$inject = ['$scope', 'keyCodes', 'usermanagementRightService', '$http', '$log', 'platformGridAPI', 'platformTranslateService', '$timeout', '_'];

	function usermanagementRightDescriptorStructureSelectionDialogController($scope, keyCodes, usermanagementRightService, $http, $log, platformGridAPI, platformTranslateService, $timeout, _) {
		$scope.dialog.dataService = createDataService();

		function createDataService() {
			var url = globals.webApiBaseUrl + 'usermanagement/main/right/treeComplete';
			var $cacheData = [], $targetTree = [];
			var treeInfo = {
				parentProp: 'ParentGuid',
				childProp: 'Nodes'
			};
			return {
				treeInfo: treeInfo,
				search: function (targetTree, filter) {
					$targetTree = targetTree;
					var assigned = usermanagementRightService.getList();
					var descrIds = [];
					_.each(assigned,function(value){
						if(value.Type === true && !isNaN(value.Id)){
							descrIds.push(parseInt(value.Id,10));
						}
					});
					return $http({
						method: 'POST',
						url: url + (filter ? ('?filter=' + filter) : ''),
						data: descrIds
					}).then(function (response) {
						$cacheData = processItem(response.data, $targetTree);
						return response.data;
					}, function (error) {
						$log.error(error);
					});
				},
				getResult: function getResult() {
					const flattenReduce = (items) => {
						let selected = _.filter(items, (item) => item.IsSelected && item.Nodes.length === 0);

						items.forEach(item => {
							if(item.Nodes && item.Nodes.length > 0) {
								selected = selected.concat(flattenReduce(item.Nodes));
							}
						});
						return selected;
					};
					const checkedItems = flattenReduce($cacheData);

					usermanagementRightService.insertDescriptorNodes(checkedItems);

					return checkedItems;
				},
				getTree: function () {
					return $cacheData;
				},
				getList: function (filter) {
					return toList($cacheData, filter);
				},
				setChild: function (cEntity, isSelected) {
					var self = this;
					cEntity =
							angular.forEach(cEntity[treeInfo.childProp], function (item) {
								item.IsSelected = isSelected;
								self.setChild(item, isSelected);
							});
				},
				setParent: function (cEntity) {
					if (!cEntity) {
						return;
					}

					var parent = getParent(cEntity);

					if (parent) {
						if (!parent.IsLive) {
							var predicate = function (child) {
								return child.IsSelected === false;
							};
							if (_.every(parent[treeInfo.childProp], predicate)) {
								parent.IsSelected = false;
							}
						}
						else {
							parent.IsSelected = null;
						}
						this.setParent(parent);
					}
				}
			};

			function getParent(entity, $data) {
				return (function find(list) {
					var parent = null;
					for (var i = 0; i < list.length; i++) {
						if (list[i].Id === entity[treeInfo.parentProp]) {
							parent = list[i];
						} else {
							parent = find(list[i][treeInfo.childProp]);
						}
						if (parent) {
							break;
						}
					}
					return parent;
				})($data || $cacheData);
			}

			function toList(items, filter) {
				var result = [];
				filter = filter || function () {
					return true;
				};
				items = items || [];
				for (var i = 0; i < items.length; i++) {
					if (filter(items[i])) {
						result.push(items[i]);
					}
					result.push.apply(result, toList(items[i][treeInfo.childProp], filter));
				}
				return result;
			}

			function processItem(responseData, targetTree) {
				var responseDataList = toList(process(responseData));
				var targetTreeList = toList(process(targetTree));

				angular.forEach(targetTreeList, function (source) {
					var response = _.find(responseDataList, {Id: source.Id});
					if (response) {
						if (check(response, source)) {
							var parentNode = getParent(response, responseData);
							removeNode(parentNode ? parentNode[treeInfo.childProp] : responseData, response);
						} else {
							response.IsExistent = true;
							response.IsSelected = false;

						}
					}
				});


				return responseData;

				function check(item1, item2) {
					return (!item1[treeInfo.childProp] && !item2[treeInfo.childProp]) ||
							(item1[treeInfo.childProp] && item2[treeInfo.childProp] && item1[treeInfo.childProp].length === item2[treeInfo.childProp].length);

				}

				function process(items) {
					angular.forEach(items, function (item) {
						item.IsSelected = false;
						item[treeInfo.childProp] = item[treeInfo.childProp] || [];
						process(item[treeInfo.childProp], item);
					});
					return items;
				}

				function removeNode(list, node) {
					var oldList = angular.copy(list);
					list.length = 0;
					for (var i = 0; i < oldList.length; i++) {
						if (oldList[i].Id !== node.Id) {
							list.push(oldList[i]);
						} else {
							oldList[i].IsSelected = true;
						}
					}
					return list;
				}
			}
		}

		$scope.gridId = $scope.dialog.modalOptions.Id || 'structure.selected';
		$scope.gridData = {state: $scope.gridId};

		$scope.search = function (filter, event) {
			if (!event || event.keyCode === keyCodes.ENTER) {
				$scope.dialog.dataService.search(angular.copy($scope.dialog.modalOptions.entities), filter).then(function () {
					platformGridAPI.items.data($scope.gridId, $scope.dialog.dataService.getTree());
					if(filter) {
						platformGridAPI.rows.expandAllNodes($scope.gridId);
					}
				});
			}
		};

		platformGridAPI.grids.config(getGridConfig($scope, $scope.dialog.dataService.treeInfo, $scope.dialog.modalOptions));

		function getGridConfig(scope, treeInfo, option) {
			var gridColumns = [
				{
					id: 'IsSelected',
					field: 'IsSelected',
					name: 'Selected',
					formatter: 'boolean',
					cssClass: 'cell-center',
					editor: 'boolean',
					width: 80
				},
				{id: 'Name', field: 'Name', name: 'Name', width: 200},
				{id: 'Description', field: 'Description', name: 'Description', width: 200}
			];

			var loadTranslation = function loadTranslation() {
				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule('usermanagement.right')) {
					platformTranslateService.instant({
						'usermanagement.right': _.map(gridColumns, function (column) {
							return 'dialogDescriptorStructure.' + column.name.toLocaleLowerCase();
						})
					});
				}
			};

			treeInfo = option.treeInfo || treeInfo;
			angular.forEach(gridColumns, function (column) {
				column.name$tr$ = 'usermanagement.user.dialogDescriptorStructure.' + column.name.toLocaleLowerCase();
			});
			platformTranslateService.translationChanged.register(loadTranslation);
			scope.$on('$destroy', function () {
				platformTranslateService.translationChanged.unregister(loadTranslation);
			});

			return {
				id: scope.gridId,
				columns: platformTranslateService.translateGridConfig(angular.copy(gridColumns)),
				data: [],
				options: {
					indicator: true,
					iconClass: 'controls-icons',
					idProperty: 'Id',
					tree: true,
					propagateCheckboxSelection: true,
					collapsed: true,
					parentProp: treeInfo.parentProp,
					childProp: treeInfo.childProp
				},
				lazyInit: true
			};
		}

		$scope.$on('$destroy', () => platformGridAPI.grids.unregister($scope.gridId));

		setTimeout(() => $scope.search(),0);
	}

	angular.module(moduleName).factory('usermanagementRightDescriptorStructureSelectionDialog',usermanagementRightDescriptorStructureSelectionDialog);

	usermanagementRightDescriptorStructureSelectionDialog.$inject = ['globals','$translate', 'platformTranslateService', 'platformDialogService'];

	function usermanagementRightDescriptorStructureSelectionDialog(globals, $translate, platformTranslateService, platformDialogService){

		platformTranslateService.registerModule('usermanagement.right');

		return {
			showDialog: function(structures, dialogOptions){
				dialogOptions = dialogOptions || {};

				var showOptions={
					headerText: getTitle(dialogOptions),
					bodyTemplateUrl: globals.appBaseUrl + '/usermanagement.right/templates/usermanagement-right-structure-selection-dialog.html',
					structures: structures,
					backdrop: false,
					resizeable: true,
					height: '600px',
					width: '600px',
					buttons: [
						{
							id: 'execute',
							caption$tr$: 'cloud.common.ok',
							fn: function(button, info) {
								info.$close({isOk: true, data: info.scope.dialog.dataService.getResult()});
							}
						},
						{
							id: 'cancel'
						}]
				};

				return platformDialogService.showDialog(showOptions);
			}
		};

		function getTitle(option) {
			if (option.title$tr$) {
				return $translate.instant(option.title$tr$);
			} else if (option.title) {
				return option.title;
			} else {
				return $translate.instant('usermanagement.right.dialogTitleDescriptorStructure') || 'Select Descriptor Structure';
			}
		}
	}

})(angular);