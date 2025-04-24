/**
 * Created by gvj on 8/28/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.material';
	angular.module(moduleName).directive('basicsMaterialNeutralMaterialAiMappingLookup',
		['_', '$q', '$http', 'globals', '$translate', '$timeout',
			'platformModalService', 'platformGridAPI', 'platformTranslateService', 'platformRuntimeDataService',
			'BasicsLookupdataLookupDirectiveDefinition','platformObjectHelper','materialNeutralMaterialAiMappingService','basicsMaterialNeutralAiDataService',
			function (_, $q, $http, globals, $translate, $timeout,
				  platformModalService, platformGridAPI, platformTranslateService, platformRuntimeDataService,
				  BasicsLookupdataLookupDirectiveDefinition,platformObjectHelper,materialNeutralMaterialAiMappingService,basicsMaterialNeutralAiDataService) {
				var defaults = {
					lookupType: 'suggestedNeutralMaterial',
					valueMember: 'Id',
					displayMember: 'Code',
					uuid: '715db9cd86dd4859a1a3c63daf3ee588',
					columns: [
						{ id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode' },
						{ id: 'desc', field: 'DescriptionInfo.Translated', name: 'Description', width: 200, name$tr$: 'cloud.common.entityDescription' }
					],
					width: 350,
					height: 120
				};

				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
					dataProvider: 'basicsMaterialNeutralAiDataService',

					controller: ['$scope', function ($scope) {
						var buttons = [
							{
								img: globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-input-lookup',
								execute: onOpenPopupClicked,
								canExecute: function () {
									return true;
								}
							}
						];

						$.extend($scope.lookupOptions, {
							buttons: buttons
						});

						function onOpenPopupClicked() {

							var dataService = createDataService();

							platformTranslateService.registerModule('basics.material');
							var showOptions = {
								gridId:'2f5d48cfjrt3422ea7a5da317c4c04e3',
								width: '790px',
								height: '550px',
								templateUrl: globals.appBaseUrl + '/basics.material/templates/materal-records-selection-dialog.html',
								backdrop: false,
								resizeable: true,
								controller: dialogController('', $scope.$parent.options, dataService)
							};
							return platformModalService.showDialog(showOptions).then(function (result) {
								if (!result || !result.isOk) {
									return;
								}
								$scope.$parent.entity.MdcMaterialFk = result.data.Id;
								basicsMaterialNeutralAiDataService.attachExtraData(result.data);
								materialNeutralMaterialAiMappingService.gridRefresh();
							});
						}


						function getTitle(option) {
							if (option.title$tr$) {
								return $translate.instant(option.title$tr$);
							} else if (option.title) {
								return option.title;
							} else {
								return $translate.instant('basics.material.AI.DialogTitleSelectNeutralMaterial') || 'Select Neutral Material';
							}
						}

						function getGridConfig(scope, treeInfo, option) {
							var gridColumns = [
								{id: 'Code', field: 'Code', name: 'Code', width: 150},
								{id: 'Description', field: 'Description', name: 'Description', width: 500}
							];

							var loadTranslation = function loadTranslation() {
							// register a module - translation table will be reloaded if module isn't available yet
								if (!platformTranslateService.registerModule('basics.material')) {
									platformTranslateService.instant({
										'basics.material': _.map(gridColumns, function (column) {
											return 'dialogSuggestedNeutralMaterial.' + column.name.toLocaleLowerCase();
										})
									});
								}
							};

							treeInfo = option.treeInfo || treeInfo;
							if(option.showId){
								gridColumns.unshift({id: 'Id',field: 'Id',name: 'Id'});
							}
							angular.forEach(gridColumns, function (column) {
								column.name$tr$ = 'basics.material.dialogSuggestedNeutralMaterial.' + column.name.toLocaleLowerCase();
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
									tree: false,
									collapsed: true,
									parentProp: treeInfo.parentProp,
									childProp: treeInfo.childProp
								},
								lazyInit: true
							};
						}

						function createDataService() {
							var url = globals.webApiBaseUrl + 'basics/material/searchneutralmaterials';
							var $cacheData = [], $targetTree = [],$filter = null;
							var treeInfo = {
								parentProp: 'PrcStructureFk',
								childProp: 'ChildItems',
								countProp:'ChildCount'
							};

							return {
								treeInfo: treeInfo,
								search: function (targetTree, filter) {
									var defer = $q.defer();
									$targetTree = targetTree;
									$filter = filter;
									$http.get(url + (filter ? ('?filter=' + filter) : '')).then(function (response) {
										$cacheData = processItem(response.data, $targetTree,!!filter);
										defer.resolve($cacheData);
									});
									return defer.promise;
								},
								getResult: function getResult() {
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
									return checkItems;
								},
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

							function processItem(responseData, targetTree,collapsed) {
								var responseDataList = toList(process(responseData,collapsed));
								var targetTreeList = toList(process(targetTree));

								angular.forEach(targetTreeList, function (source) {
									var response = _.find(responseDataList, {Id: source.Id});
									if (response) {
										if (check(response, source)) {
											var parentNode = getParent(response, responseData);
											removeNode(parentNode ? parentNode[treeInfo.childProp] : responseData, response);
											//remove parents
											while(parentNode && !parentNode[treeInfo.childProp].length){
												response = parentNode;
												parentNode = getParent(response, responseData);
												removeNode(parentNode ? parentNode[treeInfo.childProp] : responseData,response);
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

						function dialogController(entities, option, dataService) {

							return ['$scope', 'keyCodes',function ($scope, keyCodes) {


								var toolbarItems = [];
								$scope.gridId = option.Id || 'structure.selected';
								$scope.gridData = {state: $scope.gridId};
								$scope.title = getTitle(option);

								$scope.buttons = [
									{
										context$tr$: 'cloud.common.ok', execute: function () {
											$scope.$close({isOk: true, data: $scope.getSelected()});
										}
									},
									{
										context$tr$: 'cloud.common.cancel', execute: function () {
											$scope.$close({isOk: false, isCancel: true});
										}
									}
								];

								$scope.search = function (filter, event) {
									if (!event || event.keyCode === keyCodes.ENTER) {
										dataService.search(angular.copy(entities), filter).then(function () {
											platformGridAPI.items.data($scope.gridId, dataService.getTree());
											if (filter) {
												platformGridAPI.rows.expandAllNodes($scope.gridId);
											}
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

								$scope.getSelected = function getSelected() {
									var grid = platformGridAPI.grids.element('id', $scope.gridId).instance,
										rows = grid.getSelectedRows();

									var data = rows.map(function (row) {
										return grid.getDataItem(row);
									});
									if (data && data.length > 0) {
										return data[0];
									}
								};

								function setTools(tools) {
									$scope.tools = tools || {};
									$scope.tools.update = function () {};
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
									},
									{
										id: 'd2',
										sort: 100,
										type: 'divider'
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
									platformGridAPI.grids.element('id', $scope.gridId).instance.onRenderCompleted.subscribe($scope.onRenderCompleted);
								}, 500);
								$scope.$on('$destroy', function () {
									platformGridAPI.grids.element('id', $scope.gridId).instance.onRenderCompleted.unsubscribe($scope.onRenderCompleted);
									platformGridAPI.grids.unregister($scope.gridId);
								});

								$scope.search();
							}];
						}
					}]
				});
			}
		]);
})(angular);

