/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global $ */
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * this module will be called from Line Item BoQ Ai mapping dialog when user presses the drop down
	 * button on column "Suggested Boq Item Ref.No."
	 * display the top (three) suggested Boq Item Ref.No.results.
	 */
	angular.module(moduleName).directive('estimateMainLineItemsBoqAiMappingLookup',
		['_', '$q', '$http', 'globals', '$translate', '$timeout', '$injector',
			'platformModalService', 'platformGridAPI', 'platformTranslateService', 'platformRuntimeDataService',
			'BasicsLookupdataLookupDirectiveDefinition', 'platformObjectHelper', 'estimateMainLineItemsBoqAiMappingService', 'estimateMainLineItemsBoqAiMappingDataService',
			'estimateMainService', 'procurementPackageDataService', 'estimateMainLiSelStatementListValidationService',
			function (_, $q, $http, globals, $translate, $timeout, $injector,
				platformModalService, platformGridAPI, platformTranslateService, platformRuntimeDataService,
				BasicsLookupdataLookupDirectiveDefinition, platformObjectHelper, estimateMainLineItemsBoqAiMappingService, estimateMainLineItemsBoqAiMappingDataService,
				estimateMainService, procurementPackageDataService, estimateMainLiSelStatementListValidationService) {
				let defaults = {
					lookupType: 'suggestedBoqItem',
					valueMember: 'Id',
					displayMember: 'Reference',
					uuid: 'bdbbfd88064c4da9ad215668a22881ee',
					columns: [
						{
							id: 'code',
							field: 'Reference',
							name: 'Reference',
							width: 100,
							name$tr$: 'estimate.main.aiWizard.boqCode'
						},
						{
							id: 'desc',
							field: 'BriefInfo.Translated',
							name: 'Description',
							width: 200,
							name$tr$: 'estimate.main.aiWizard.boqDescription'
						}
					],
					width: 350,
					height: 120
				};

				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
					dataProvider: 'estimateMainLineItemsBoqAiMappingDataService',
					controller: ['$scope', function ($scope) {
						let buttons = [
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

							let dataService = createDataService();

							platformTranslateService.registerModule('estimate.main');
							let showOptions = {
								gridId: '2f5d48cfjrt3422ea7a5da317c4c04e3',
								width: '790px',
								height: '550px',
								templateUrl: globals.appBaseUrl + '/estimate.main/templates/boq-selection-dialog.html',
								backdrop: false,
								resizeable: true,
								controller: dialogController('', $scope.$parent.options, dataService)
							};

							return platformModalService.showDialog(showOptions).then(function (result) {
								if (!result || !result.isOk) {
									return;
								}
								$scope.$parent.entity.BoqItemFk = result.data.Id;
								estimateMainLineItemsBoqAiMappingDataService.attachExtraData(result.data);
								estimateMainLineItemsBoqAiMappingService.gridRefresh();
							});
						}


						function getTitle(option) {
							if (option.title$tr$) {
								return $translate.instant(option.title$tr$);
							} else if (option.title) {
								return option.title;
							} else {
								return $translate.instant('estimate.main.aiWizard.dialogTitleSelectBoQ') || 'Select BoQ';
							}
						}

						function getGridConfig(scope, treeInfo, option) {
							let gridColumns = [
								{id: 'Reference', field: 'Reference', name: 'Reference', width: 100},
								{id: 'BriefInfo', field: 'BriefInfoTr', name: 'BriefInfo', width: 100},
								{id: 'Reference2', field: 'Reference2', name: 'Reference2', width: 100},
								{id: 'Quantity', field: 'Quantity', name: 'Quantity', width: 100}
							];

							let loadTranslation = function loadTranslation() {
								// register a module - translation table will be reloaded if module isn't available yet
								if (!platformTranslateService.registerModule('estimate.main')) {
									platformTranslateService.instant({
										'estimate.main': _.map(gridColumns, function (column) {
											return 'dialogSuggestedNeutralMaterial.' + column.name.toLocaleLowerCase();
										})
									});
								}
							};

							treeInfo = option.treeInfo || treeInfo;
							if (option.showId) {
								gridColumns.unshift({id: 'Id', field: 'Id', name: 'Id'});
							}
							angular.forEach(gridColumns, function (column) {
								column.name$tr$ = 'estimate.main.dialogSuggestedNeutralMaterial.' + column.name.toLocaleLowerCase();
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
							let url = globals.webApiBaseUrl + 'boq/project/getboqsearchlist';
							let $cacheData = [], $targetTree = [], $filter = null;
							let treeInfo = {
								parentProp: 'BoqItemFk',
								childProp: 'BoqItems'
							};

							return {
								treeInfo: treeInfo,
								search: function (targetTree, filter) {
									let defer = $q.defer();
									$targetTree = targetTree;
									$filter = filter;
									$http.get(url + '?projectId=' + getProjectId() + (filter ? ('&filterValue=' + filter) : '&filterValue=')).then(function (response) {
										$cacheData = processItem(response.data, $targetTree, !!filter);
										defer.resolve($cacheData);
									});
									return defer.promise;
								},
								getResult: function getResult() {
									let checkItems = [];
									let itemResult = function (entity) {
										if (entity.IsSelected !== false && entity.IsLive) {
											checkItems.push(entity);
										}
										if (angular.isArray(entity[treeInfo.childProp])) {
											if ($filter) {
												entity.IsSelected = null;
											}
											angular.forEach(entity[treeInfo.childProp], itemResult);
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
									let self = this;
									angular.forEach(cEntity[treeInfo.childProp], function (item) {
										item.IsSelected = isSelected;
										self.setChild(item, isSelected);
									});
								},
								setParent: function (cEntity) {
									if (!cEntity) {
										return;
									}

									let parent = getParent(cEntity);

									if (parent) {
										if (!parent.IsLive) {
											let predicate = function (child) {
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
									let parent = null;
									for (let i = 0; i < list.length; i++) {
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
								let result = [];
								filter = filter || function () {
									return true;
								};
								items = items || [];
								for (let i = 0; i < items.length; i++) {
									if (filter(items[i])) {
										result.push(items[i]);
									}
									result.push.apply(result, toList(items[i][treeInfo.childProp], filter));
								}
								return result;
							}

							function processItem(responseData, targetTree, collapsed) {
								let responseDataList = toList(process(responseData, collapsed));
								let targetTreeList = toList(process(targetTree));

								angular.forEach(targetTreeList, function (source) {
									let response = _.find(responseDataList, {Id: source.Id});
									if (response) {
										if (check(response, source)) {
											let parentNode = getParent(response, responseData);
											removeNode(parentNode ? parentNode[treeInfo.childProp] : responseData, response);
											// remove parents
											while (parentNode && !parentNode[treeInfo.childProp].length) {
												response = parentNode;
												parentNode = getParent(response, responseData);
												removeNode(parentNode ? parentNode[treeInfo.childProp] : responseData, response);
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

									function countChildren(item) {
										return item[treeInfo.childProp].length + _.sum(item[treeInfo.childProp], countChildren);
									}
								}

								function process(items) {
									angular.forEach(items, function (item) {
										if (!item['BriefInfoTr']) {
											item['BriefInfoTr'] = item['BriefInfo']['Translated'];
										}
										item[treeInfo.childProp] = item[treeInfo.childProp] || [];
										process(item[treeInfo.childProp], item);
									});
									return items;
								}

								function removeNode(list, node) {
									let oldList = angular.copy(list);
									list.length = 0;
									for (let i = 0; i < oldList.length; i++) {
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

							return ['$scope', 'keyCodes', function ($scope, keyCodes) {


								let toolbarItems = [];
								$scope.gridId = option.Id || 'structure.selected';
								$scope.gridData = {state: $scope.gridId};
								$scope.title = getTitle(option);

								$scope.buttons = [
									{
										context$tr$: 'cloud.common.ok', execute: function () {
											let boqItem = $scope.getSelected();
											if (!boqItem) {
												platformModalService.showMsgBox('estimate.main.aiWizard.noBoqItemSelectedError',
													'estimate.main.aiWizard.error', 'error');
												return;
											}
											let boqLineTypes = estimateMainLiSelStatementListValidationService.getValidBoqLineTypes();
											if (boqLineTypes.indexOf(boqItem.BoqLineTypeFk) === -1 || boqItem.BoqItems.length > 0) {
												platformModalService.showMsgBox('estimate.main.aiWizard.selectBoqItemError',
													'estimate.main.aiWizard.error', 'error');
												return;
											}
											$scope.$close({
												isOk: true, data: $scope.getSelected()
											});
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
									let items = dataService.getList(function (item) {
										return item.IsSelected === null;
									});
									let grid = platformGridAPI.grids.element('id', $scope.gridId);
									let cell = grid.instance.getColumnIndex('IsSelected');

									angular.forEach(items, function setIndeterminate(item) {
										let row = grid.dataView.getRowById(item.Id);
										let element = grid.instance.getCellNode(row, cell);
										if ((row || row === 0) && element) {
											element.find('input').attr('checked', false).prop('indeterminate', true);
										}
									});
								};

								$scope.getSelected = function getSelected() {
									let grid = platformGridAPI.grids.element('id', $scope.gridId).instance,
										rows = grid.getSelectedRows();

									let data = rows.map(function (row) {
										return grid.getDataItem(row);
									});
									if (data && data.length > 0) {
										return data[0];
									}
								};

								function setTools(tools) {
									$scope.tools = tools || {};
									$scope.tools.update = function () {
									};
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

						let getProjectId = function getProjectId() {
							// use the controller's uuid to get which current module is
							if (platformGridAPI.grids.exist('681223e37d524ce0b9bfa2294e18d650')) {
								return estimateMainService.getSelectedProjectId();
							}
							else if (platformGridAPI.grids.exist('067be143d76d4ad080660ef147349f1d')) {
								let packageItems = procurementPackageDataService.getList();
								let projectIds = _.uniq(_.map(packageItems, 'ProjectFk'));
								return projectIds;
							}
							else if (platformGridAPI.grids.exist('8fbb8f4fb42343149666a3d7c24dc1b4')) {
								let projectMainService = $injector.get('projectMainService');
								let selectedItem = projectMainService.getSelected();
								if (selectedItem && selectedItem.Id) {
									return selectedItem.Id;
								}
								return null;
							}
							else {
								return null;
							}
						};
					}]
				});
			}
		]);
})(angular);

