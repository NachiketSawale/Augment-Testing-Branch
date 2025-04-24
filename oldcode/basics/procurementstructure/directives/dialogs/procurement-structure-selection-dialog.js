/**
 * Created by wui on 12/23/2014.
 */

(function(angular) { /* jshint -W083 */ // don't make function within a loop
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).factory('basicsProcurementstructureSelectionDialog',
		['_', '$q', '$http', 'globals', '$translate', '$timeout', 'platformModalService', 'platformGridAPI', 'platformTranslateService', 'platformRuntimeDataService', 'basicsProcurementstructureTreeHelper',
			function (_, $q, $http, globals, $translate, $timeout, platformModalService, platformGridAPI, platformTranslateService, platformRuntimeDataService, basicsProcurementstructureTreeHelper) {

				var dataService = createDataService();
				let parentService={};
				platformTranslateService.registerModule('basics.procurementstructure');

				return {
					showDialog: function (structures, dialogOptions) {
						dialogOptions = dialogOptions || {showId:false};
						if (dialogOptions.parentService){
							setParentService(dialogOptions.parentService);
						}
						var showOptions = {
							width: dialogOptions.dialogWidth || '790px',
							height: dialogOptions.dialogHeight || '550px',
							templateUrl: globals.appBaseUrl + '/basics.procurementstructure/templates/procurement-structure-selection-dialog.html',
							backdrop: false,
							resizeable: true,
							controller: dialogController(structures, dialogOptions, dataService)
						};
						return platformModalService.showDialog(showOptions);
					}
				};

				function setParentService(service){
					parentService=service;
				}

				function getParentService(){
					return parentService;
				}

				function getTitle(option) {
					if (option.title$tr$) {
						return $translate.instant(option.title$tr$);
					} else if (option.title) {
						return option.title;
					} else {
						return $translate.instant('cloud.common.dialogTitleProcurementStructure') || 'Select Procurement Structure';
					}
				}

				function getGridConfig(scope, treeInfo, option) {
					var gridColumns = [
						{id: 'IsSelected',field: 'IsSelected',name: 'Selected',formatter: 'boolean',cssClass: 'cell-center',editor: 'boolean',width: 80},
						{id: 'Code', field: 'Code', name: 'Code', width: 120},
						{id: 'Description', field: 'Description', name: 'Description', width: 300},
						{id: 'Comment', field: 'Comment', name: 'Comment', width: 300}
					];

					var loadTranslation = function loadTranslation() {
						// register a module - translation table will be reloaded if module isn't available yet
						if (!platformTranslateService.registerModule('basics.procurementstructure')) {
							platformTranslateService.instant({
								'basics.procurementstructure': _.map(gridColumns, function (column) {
									return 'dialogProcurementStructure.' + column.name.toLocaleLowerCase();
								})
							});
						}
					};

					treeInfo = option.treeInfo || treeInfo;
					if(option.showId){
						gridColumns.unshift({id: 'Id',field: 'Id',name: 'Id'});
					}
					angular.forEach(gridColumns, function (column) {
						column.name$tr$ = 'basics.procurementstructure.dialogProcurementStructure.' + column.name.toLocaleLowerCase();
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
							collapsed: true,
							parentProp: treeInfo.parentProp,
							childProp: treeInfo.childProp
						},
						lazyInit: true
					};
				}

				function createDataService() {
					var url = globals.webApiBaseUrl + 'basics/procurementstructure/search';
					var $cacheData = [], $targetTree = [],$filter = null;
					var treeInfo = {
						parentProp: 'PrcStructureFk',
						childProp: 'ChildItems',
						countProp:'ChildCount'
					};

					return {
						treeInfo: treeInfo,
						search: function (targetTree, filter,dataCaches) {
							var defer = $q.defer();
							$targetTree = targetTree;
							$filter = filter;
							$http.get(url + (filter ? ('?filter=' + filter) : '')).then(function (response) {
								basicsProcurementstructureTreeHelper.setChildCount(response.data,treeInfo,function (obj){return !!obj;});
								let dataProcessItem= processItem(response.data, $targetTree,!!filter);
								if (dataCaches&&dataCaches.length>0) {
									changeIsSelected(dataProcessItem, dataCaches);
								}
								$cacheData=dataProcessItem;
								defer.resolve($cacheData);
							});
							return defer.promise;
						},
						// region new cache be use in filter search
						getCachesCount:function (dataCaches)
						{
							let  count=0;
							for (let i = 0; i < dataCaches.length; i++) {
								let dataCache = dataCaches[i];
								if (dataCache.IsSelected ===true&&dataCache.IsLive ===true) {
									count+=1;
								}
							}
							return count;

						},
						cleanCache:function cleanCache() {
							$cacheData=[];
						},
						// use in ok and apply function,filter Parents data must be null
						setParentsToNull:function changeCacheData(dataCaches) {
							let itemResult = function (entity) {
								if (angular.isArray(entity[treeInfo.childProp])) {
									if($filter){
										entity.IsSelected = null;
									}
									angular.forEach(entity[treeInfo.childProp], itemResult);
								}
							};
							dataCaches.forEach(itemResult);
							return dataCaches;
						},
						updateCachesComplete:function (dialogCaches) {
							let nowPageDatas=dataService.getNowPageDatas();
							let mixDialogCaches = dataService.updateCachesNew(nowPageDatas,dialogCaches);
							return mixDialogCaches;
						},
						getNowPageDatas:function () {
							return $cacheData;
						},
						updateCachesNew :function (nowPageDatas,dataCaches) {
							for (let c = 0; c < nowPageDatas.length; c++) {
								if (dataCaches&&dataCaches.length>0) {
									for (let d = 0; d < dataCaches.length; d++) {
										if (nowPageDatas[c].Id === dataCaches[d].Id && nowPageDatas[c].IsSelected === false) {
											dataCaches.splice(d, 1);
											d--;
										}
									}
								}
								let findData = dataCaches.find(e => e.Id === nowPageDatas[c].Id);
								if (!findData && nowPageDatas[c].IsSelected !== false) {
									dataCaches.push(nowPageDatas[c]);
								}
								if (nowPageDatas[c].HasChildren) {
									dataService.updateCachesNew(nowPageDatas[c].ChildItems, dataCaches);
								}

							}
							return dataCaches;

						},
						// endregion
						// region no use
						/* getResult: function getResult() {
							var checkItems = [];
							var itemResult = function (entity) {
								if (entity.IsSelected !== false && entity.IsLive) {
									checkItems.push(entity);
								}
								if (angular.isArray(entity[treeInfo.childProp])) {
									if($filter){
										entity.IsSelected = null;
									}
									angular.forEach(entity[treeInfo.childProp],itemResult);
								}

							};
							$cacheData.forEach(itemResult);
							let parentService = getParentService();
							if(angular.isFunction(parentService.getRebuildSelectItems)) {
								checkItems = parentService.getRebuildSelectItems(checkItems);
							}
							return checkItems;
						}, */
						// endregion
						getTree: function () {
							return $cacheData;
						},
						getList: function (filter) {
							return toList($cacheData, filter);
						},
						setChild: function (cEntity, isSelected) {
							var self = this;
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
								if (!parent.IsLive || !parent.AllowAssignment) {
									var predicate = function (child) {
										return child.IsSelected === false;
									};
									if (_.every(parent[treeInfo.childProp], predicate)) {
										// if no children is selected, and it is not assignable.
										parent.IsSelected = false;
									}else{
										// has children selected, it will be assigned event it is not assignable originally.
										parent.IsSelected = null;
									}
								}
								else {
									parent.IsSelected = null;
								}
								this.setParent(parent);
							}
						}
					};

					function changeIsSelected (dataProcessItems,dataCaches) {
						for (let i = 0; i < dataProcessItems.length; i++) {
							let dataProcessItem = dataProcessItems[i];
							for (let c = 0; c < dataCaches.length; c++) {
								if (dataProcessItem.Id === dataCaches[c].Id) {
									dataProcessItem.IsSelected = dataCaches[c].IsSelected;
								}
							}
							if (dataProcessItem.HasChildren) {
								changeIsSelected(dataProcessItem.ChildItems, dataCaches);
							}
						}
					}
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

					function processItem(responseData, targetTree,collapsed) {
						var responseDataList = toList(process(responseData,collapsed));
						var targetTreeList = toList(process(targetTree));

						angular.forEach(targetTreeList, function (source) {
							var response = _.find(responseDataList, {Id: source.Id});
							if (response) {
								if (check(response, source)) {
									var parentNode = getParent(response, responseData);
									removeNodeNew(parentNode ? parentNode[treeInfo.childProp] : responseData, response);
									// remove parents
									while(parentNode && !parentNode[treeInfo.childProp].length){
										response = parentNode;
										parentNode = getParent(response, responseData);
										removeNodeNew(parentNode ? parentNode[treeInfo.childProp] : responseData,response);
									}
								} else {
									response.IsExistent = true;
									response.IsSelected = (response.IsLive === false ? false : null);
								}
							}
						});


						return responseData;

						function check(item1, item2) {
							return (!item1[treeInfo.childProp] && !item2[treeInfo.childProp]) ||
								(item1[treeInfo.childProp] && item2[treeInfo.childProp] && item1[treeInfo.countProp] === countChildren(item2));

							function countChildren(item){
								return item[treeInfo.childProp].length + _.sum(item[treeInfo.childProp],countChildren);
							}
						}

						function process(items) {
							angular.forEach(items, function (item) {
								// item.nodeInfo = (collapsed !== undefined?null: {collapsed: collapsed});
								item.IsSelected = false;
								item[treeInfo.childProp] = item[treeInfo.childProp] || [];
								process(item[treeInfo.childProp], item);
							});
							return items;
						}
						// region no use
						/* function removeNode(list, node) {
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
						} */
						// endregion
						function removeNodeNew(list, node) {
							for (let i = 0; i < list.length; i++) {
								if (list[i].Id === node.Id) {
									list.splice(i, 1);
									i--;
								}
							}
							return list;
						}
					}
				}

				function dialogController(entities, option, dataService) {

					return ['$scope', 'keyCodes',function ($scope, keyCodes) {

						$scope.dialogCaches = [];
						$scope.openCount = 0;
						$scope.dialog = $scope.dialog || {};
						$scope.modalTitle = $scope.modalTitle || $scope.dialog.title || getTitle(option);
						$scope.dialog.cancel = $scope.dialog.cancel || cancel;
						var toolbarItems = [];
						$scope.gridId = option.Id || 'structure.selected';
						$scope.gridData = {state: $scope.gridId};
						$scope.title = getTitle(option);
						$scope.filter='';
						$scope.htmlTranslate = {
							structureSelectCount: $translate.instant('basics.procurementstructure.structureSelectCount', {count: $scope.dialogCaches.length}),
						};
						$scope.buttons = [
							{
								context$tr$: 'cloud.common.apply', execute: function () {
									apply();
								}
							},
							{
								context$tr$: 'cloud.common.ok', execute: function () {
									if (!angular.isArray($scope.dialogCaches) || $scope.dialogCaches.length === 0) {
										$scope.$close({isOk: true, data: []});
									}
									$scope.dialogCaches=dataService.setParentsToNull($scope.dialogCaches);
									let selectItems = $scope.dialogCaches;
									$scope.dialogCaches=[];
									let parentService = getParentService();
									if (angular.isFunction(parentService.getRebuildSelectItems)) {
										selectItems = parentService.getRebuildSelectItems(selectItems);
									}
									$scope.$close({isOk: true, data: selectItems});
								}
							},
							{
								context$tr$: 'cloud.common.cancel', execute: function () {
									$scope.$close({isOk: false, isCancel: true});
								}
							}
						];

						$scope.search = function (filter, event) {
							$scope.filter=filter;
							if (!event || event.keyCode === keyCodes.ENTER) {
								dataService.search(angular.copy(entities), filter, $scope.dialogCaches).then(function () {

									setReadOnly(dataService.getTree());
									platformGridAPI.items.data($scope.gridId, dataService.getTree());

									if (filter) {
										platformGridAPI.rows.expandAllNodes($scope.gridId);
									}
									$scope.openCount += 1;
									if ($scope.openCount === 1) {
										$scope.onRenderCompleted();
									}

								});
							}
						};

						$scope.onBeforeEditCell = function onBeforeEditCell(e, arg) {// can not select item whose 'IsLive' is false.
							return !arg.item.IsLive;
						};

						$scope.onCellChange = function onCellChange(e, arg) {
							if (arg.grid.getColumns()[arg.cell].id === 'IsSelected') {
								dataService.setChild(arg.item, arg.item.IsSelected);
								dataService.setParent(arg.item, arg.item.IsSelected);
								platformGridAPI.items.data($scope.gridId, dataService.getTree());
								$scope.dialogCaches=dataService.updateCachesComplete($scope.dialogCaches);
								let cacheCount = dataService.getCachesCount($scope.dialogCaches);
								$timeout(function () {
									$scope.htmlTranslate.structureSelectCount = $translate.instant('basics.procurementstructure.structureSelectCount', {count: cacheCount});
								});
							}
						};

						$scope.onRenderCompleted = function onRenderCompleted() {
							var items = dataService.getList(function (item) {
								return item.IsSelected === null;
							});
							var grid = platformGridAPI.grids.element('id', $scope.gridId);
							var cell = grid.instance.getColumnIndex('IsSelected');

							angular.forEach(items, function setIndeterminate(item) {
								var row = grid.dataView.getRowById(item.Id);
								var element = grid.instance.getCellNode(row, cell);
								if ((row || row === 0) && element) {
									element.find('input').attr('checked', false).prop('indeterminate', true);
								}
							});
						};

						function setTools(tools) {
							$scope.tools = tools || {};
							$scope.tools.update = function () {};
						}
						function cancel(){
							$scope.$close(false);
						}
						function apply() {
							// let  data=dataService.getResult();
							if (!angular.isArray($scope.dialogCaches) || $scope.dialogCaches.length === 0) {
								return;
							}
							$scope.dialogCaches=dataService.setParentsToNull($scope.dialogCaches);
							let selectItems = $scope.dialogCaches;
							$scope.dialogCaches=[];
							let cacheCount = dataService.getCachesCount($scope.dialogCaches);
							$scope.htmlTranslate.structureSelectCount = $translate.instant('basics.procurementstructure.structureSelectCount', {count: cacheCount});
							let parentService = getParentService();
							if (angular.isFunction(parentService.getRebuildSelectItems)) {
								selectItems = parentService.getRebuildSelectItems(selectItems);
							}
							parentService.createHttp(selectItems).then(function (response) {
								parentService.createResponeHandle(response);
								entities = angular.copy(parentService.getPrcStructures());
								dataService.search(entities, $scope.filter).then(function () {
									setReadOnly(dataService.getTree());
									platformGridAPI.items.data($scope.gridId, dataService.getTree());
									if ($scope.filter && $scope.filter !== '') {
										platformGridAPI.rows.expandAllNodes($scope.gridId);
									}
								});
							});
						}
						toolbarItems.push(
							{
								id: 't7',
								sort: 60,
								caption: 'cloud.common.toolbarCollapse',
								type: 'item',
								iconClass: 'tlb-icons ico-tree-collapse',
								fn: function collapseSelected() {
									platformGridAPI.rows.collapseNextNode($scope.gridId);
								}
							},
							{
								id: 't8',
								sort: 70,
								caption: 'cloud.common.toolbarExpand',
								type: 'item',
								iconClass: 'tlb-icons ico-tree-expand',
								fn: function expandSelected() {
									platformGridAPI.rows.expandNextNode($scope.gridId);
								}
							},
							{
								id: 't9',
								sort: 80,
								caption: 'cloud.common.toolbarCollapseAll',
								type: 'item',
								iconClass: 'tlb-icons ico-tree-collapse-all',
								fn: function collapseAll() {
									platformGridAPI.rows.collapseAllSubNodes($scope.gridId);
								}
							},
							{
								id: 't10',
								sort: 90,
								caption: 'cloud.common.toolbarExpandAll',
								type: 'item',
								iconClass: 'tlb-icons ico-tree-expand-all',
								fn: function expandAll() {
									platformGridAPI.rows.expandAllSubNodes($scope.gridId);
								}
							}
						);

						setTools({
							showImages: true,
							showTitles: true,
							cssClass: 'tools',
							items: toolbarItems
						});

						platformGridAPI.grids.config(getGridConfig($scope, dataService.treeInfo, option));
						$timeout(function () {
							platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', $scope.onBeforeEditCell);
							platformGridAPI.events.register($scope.gridId, 'onCellChange', $scope.onCellChange);
							platformGridAPI.grids.element('id', $scope.gridId).instance.onRenderCompleted.subscribe($scope.onRenderCompleted);
						}, 500);
						$scope.$on('$destroy', function () {
							platformGridAPI.grids.element('id', $scope.gridId).instance.onRenderCompleted.unsubscribe($scope.onRenderCompleted);
							platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', $scope.onBeforeEditCell);
							platformGridAPI.events.unregister($scope.gridId, 'onCellChange', $scope.onCellChange);
							platformGridAPI.grids.unregister($scope.gridId);
							entities = null;
							$scope.dialogCaches=[];
							dataService.cleanCache();
						});

						// set IsSelected field to readOnly if item[AllowAsignment] is false.
						function setReadOnly(responseData){
							if(responseData){
								if(_.isArray(responseData) && responseData.length > 0 ){
									_.forEach(responseData, function(item){
										setReadOnly(item);
									});
								}
								if(_.isObject(responseData)){
									if(!responseData.AllowAssignment){
										platformRuntimeDataService.readonly(responseData, [{field: 'IsSelected', readonly: true}]);
									}
									var child = responseData[dataService.treeInfo.childProp];
									if(child && child.length){
										setReadOnly(child);
									}
								}
							}
						}
						$scope.search();
					}];
				}
			}
		]);


})(angular);