/*
 * $Id: basics-common-field-selector-dialog-body.js 634323 2021-04-27 22:05:46Z haagf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const printSelectedId = false;

	/**
	 * @ngdoc directive
	 * @name basics.common.directive:basicsCommonFieldSelectorDialogBody
	 * @element div
	 * @restrict A
	 * @description Displays the body of a field selector dialog.
	 */
	angular.module('basics.common').directive('basicsCommonFieldSelectorDialogBody', ['platformGridAPI', '$compile',
		'$timeout', 'basicsCommonUtilities', 'platformCollectionUtilitiesService', '_', '$translate', '$q', '$window',
		'$rootScope', 'platformModalService', '$log', 'cloudCommonInitUiLanguageItems', '$http',
		function (platformGridAPI, $compile, $timeout, basicsCommonUtilities, platformCollectionUtilitiesService, _, $translate, $q, $window, $rootScope, platformModalService, $log, cloudCommonInitUiLanguageItems,
			$http) {
			return {
				restrict: 'A',
				scope: false,
				templateUrl: globals.appBaseUrl + '/basics.common/templates/field-selector/basics-common-field-selector-dialog-body-template.html',
				link: function ($scope, elem) {
					const finalizers = [];
					let fieldstoUpdate = [];
					const dlgData = $scope.modalOptions.dataItem;

					$scope.isESV2 = dlgData.isESV2;
					// explicit search enhanced dialog
					// in config.js the setting devFeatureFlags.searchTranslationDialog must be true
					const searchTranslationDialogActivated = globals.devFeatureFlags && globals.devFeatureFlags.searchTranslationDialog;
					$scope.showTranslationContainer = (searchTranslationDialogActivated && dlgData.schemaGraphProvider.showTranslationContainerForSearchEnhanced) || false;

					$scope.currentSearchText = ''; // model for searchfield

					$scope.supportsSimpleMode = dlgData.schemaGraphProvider.supportsBookmarks();
					$scope.selectedMode = dlgData.mode;

					// later includes variables
					$scope.supportsSubentities = dlgData.schemaGraphProvider.supportsSubentities();

					$scope.pinningTools = getSubentityTools();

					$scope.$watch('selectedMode.id', function (newValue, oldValue) {
						if (newValue !== oldValue) {
							initializeTree();
						}
					});

					function isTreeSimplified() {
						return $scope.supportsSimpleMode && ($scope.selectedMode.id === 'simple');
					}

					function gatherInitialSelectionInfo(suppliedTree) {

						const selectedId = (dlgData.selectedId && !_.isNull(dlgData.selectedId)) ? dlgData.selectedId : getFirstChildrenFromLoadedTree();

						if (selectedId && !_.isNull(selectedId)) {
							let info = {
								node: dlgData.schemaGraphProvider.findLoadedNode(selectedId, suppliedTree)
							};

							info.parentNode = getParentNode(info);

							return info;
						}
						return null;
					}

					let requiredInitialSelection = gatherInitialSelectionInfo();

					function getFirstChildrenFromLoadedTree() {
						/*
							is no one item selected, then selected the first children as default.
							so that the grid-items are visible in the right side
							ALM#103922
					   */
						const state = dlgData.schemaGraphProvider.__dataState || dlgData.schemaGraphProvider.__ddDataState;
						return (state && state.loadedTree) ? state.loadedTree.children[0].id : null;
					}

					function getParentNode(info) {
						if (info.node) {
							return _.isObject(info.node.parent) ? info.node.parent.id : info.node.parent;
						} else {
							return undefined;
						}
					}

					function isPartOfSelectedId(id) {
						if (dlgData.selectedId && !_.isNull(dlgData.selectedId)) {
							return dlgData.schemaGraphProvider.isPartOfPath(id, [dlgData.selectedId], true);
						}
						return false;
					}

					const baseGridId = '2426cc7a29af41f7b2e8a3bc2571f416';

					const specialNodes = {
						searchResults: {
							id: 'searchResults%',
							name: $translate.instant('basics.common.fieldSelector.searchResults'),
							image: 'tlb-icons ico-search',
							searchResultsReady: false
						}
					};

					function prepareGrid(name, adaptConfig) {
						const gridId = baseGridId + '-' + dlgData.id + name.charAt(0);

						$scope[name + 'GridId'] = gridId;
						$scope[name + 'GridData'] = {
							state: gridId
						};

						if (!platformGridAPI.grids.exist(gridId)) {
							const gridConfig = {
								data: [],
								id: gridId,
								lazyInit: true,
								enableConfigSave: false,
								options: {
									indicator: false,
									allowRowDrag: false,
									skipPermissionCheck: true,
									showMainTopPanel: false,
									idProperty: 'id'
								}
							};
							if (_.isFunction(adaptConfig)) {
								adaptConfig(gridConfig);
							}

							platformGridAPI.grids.config(gridConfig);
						}

						const placeholderEl = elem.find('div#' + name + 'Grid');
						if (placeholderEl.length !== 1) {
							throw new Error('Unexpectedly found ' + placeholderEl.length + ' placeholder elements for list ' + name + '.');
						}
						placeholderEl.append($compile('<platform-grid data-data="' + name + 'GridData"></platform-grid>')($scope));

						finalizers.push(function () {
							platformGridAPI.grids.unregister(gridId);
						});
					}

					function createSubentity() {
						// get selection!
						const selectedItems = _.compact(platformGridAPI.rows.selection({
							gridId: $scope.structureGridId,
							wantsArray: true
						}));
						if (_.isArray(selectedItems) && (selectedItems.length > 0)) {
							const config = {
								resizeable: true,
								showOkButton: true,
								showCancelButton: true,
								bodyTemplateUrl: globals.appBaseUrl + '/basics.common/templates/field-selector/basics-common-subentity-dialog-body.html',
								entity: {
									name: selectedItems[0].name,
									path: selectedItems[0].rawNode.path + $translate.instant('basics.common.fieldSelector.levelSeparator') + selectedItems[0].name
								},
								headerTextKey: 'basics.common.fieldSelector.subentity.title',
								nodeLabel: 'basics.common.fieldSelector.subentity.node',
								newLabel: 'basics.common.fieldSelector.subentity.name',
								namePlaceHolder: 'basics.common.fieldSelector.subentity.placeholder'
							};

							platformModalService.showDialog(config).then(function () {
								const subentity = {
									name: config.entity.name,
									originalNode: selectedItems[0].rawNode
								};
								const labelList = {
									PathLabels: [subentity.originalNode.path, subentity.originalNode.name]
								};
								subentity.displayName = dlgData.schemaGraphProvider.formatDisplayName(labelList);
								const newSubentity = _.first(dlgData.schemaGraphProvider.modifySubentities([subentity], 'create'));
								requiredInitialSelection = {
									node: null,
									parentNode: newSubentity.node.id
								};
								initializeTree();
							});
						}
					}

					function deleteSubentity() {
						// get selection!
						const selectedItems = _.compact(platformGridAPI.rows.selection({
							gridId: $scope.structureGridId,
							wantsArray: true
						}));
						if (_.isArray(selectedItems) && (selectedItems.length > 0)) {
							if (selectedItems[0].id.includes('*')) {
								const subentity = {
									id: selectedItems[0].id
								};
								dlgData.schemaGraphProvider.modifySubentities([subentity], 'delete');
								initializeTree();
							}
						}
					}

					function getSubentityTools() {
						return {
							showImages: false,
							showTitles: true,
							cssClass: 'tools',
							items: [
								{
									id: 't1',
									caption: $translate.instant('basics.common.fieldSelector.subentity.create'),
									iconClass: 'tlb-icons ico-rec-new',
									type: 'item',
									fn: function () {
										createSubentity();
									},
									disabled: function () {
										return !dlgData.isSubentitySelectionValid(true);
									}
								},
								{
									id: 't2',
									caption: $translate.instant('basics.common.fieldSelector.subentity.delete'),
									iconClass: 'tlb-icons ico-rec-delete',
									type: 'item',
									fn: function () {
										deleteSubentity();
									},
									disabled: function () {
										return !dlgData.isSubentitySelectionValid(false);
									}
								}
							]
						};
					}

					prepareGrid('structure', function (cfg) {
						cfg.columns = [{
							id: 'name',
							formatter: 'description',
							field: 'name',
							readonly: true,
							name$tr$: 'basics.common.fieldSelector.parent'
						}, {
							id: 'editor',
							formatter: 'action',
							field: 'selector',
							readonly: true,
							name: 'Selector'
						}];

						_.assign(cfg.options, {
							tree: true,
							childProp: 'children',
							multiSelect: false
						});
					});
					prepareGrid('content', function (cfg) {
						cfg.options.indicator = true;
						cfg.columns = [{
							id: 'icon',
							formatter: function (row, cell, value) {
								const element = $('<span>');
								if (_.isString(value) && (value.length > 0)) {
									element.addClass('block-image ' + value);
								}
								return element[0].outerHTML;
							},
							field: 'image',
							width: 30,
							sortable: false
						}, {
							id: 'name',
							formatter: 'description',
							field: 'name',
							readonly: true,
							name$tr$: 'basics.common.fieldSelector.item',
							sortable: true,
							navigator: {
								moduleName: '',
								navFunc: function (info, item) {
									if (item && item.rawNode) {
										const parentItem = findInStructureTree(_.isObject(item.rawNode.parent) ? item.rawNode.parent.id : item.rawNode.parent);
										if (parentItem) {
											platformGridAPI.rows.expandNode($scope.structureGridId, parentItem);
											nodeExpanded(null, {
												item: parentItem
											});
											platformGridAPI.rows.selection({
												gridId: $scope.structureGridId,
												rows: [{
													id: item.id
												}]
											});
										}
									}
								},
								hide: function (item) {
									return !_.isNumber(_.get(item, 'rawNode.targetId'));
								},
								toolTip$tr$: 'basics.common.fieldSelector.showInTree',
								iconClass: 'control-icons ico-show-in-tree'
							}
						}, {
							id: 'path',
							formatter: 'description',
							field: 'path',
							readonly: true,
							name$tr$: 'basics.common.fieldSelector.path',
							width: 350,
							sortable: true
						}];
					});

					platformGridAPI.events.register($scope.contentGridId, 'onInitialized', function () {
						platformGridAPI.filters.showColumnSearch($scope.contentGridId, true);
					});

					const loadingText = $translate.instant('basics.common.fieldSelector.loadingNode');

					function createStructureNodes(rawNodes, path, level, onlyBookmarked) {
						if (_.isArray(rawNodes)) {
							return _.map(_.filter(rawNodes, function (rawNode) {
								return (rawNode.mightHaveChildren || rawNode.selector) && (rawNode.isRootItem || !onlyBookmarked || dlgData.schemaGraphProvider.isNodeBookmarked(rawNode.id) || !rawNode.targetId);
							}), function (rawNode) {
								const result = {
									id: rawNode.id,
									name: rawNode.name,
									isVirtual: rawNode.isVirtual,
									children: rawNode.mightHaveChildren ? createStructureNodes(rawNode.children, rawNode.id, level + 1, onlyBookmarked) : null,
									rawNode: rawNode,
									image: rawNode.image,
									selector: rawNode.selector,
									nodeInfo: {
										collapsed: (level !== 0) && !isPartOfSelectedId(rawNode.id),
										level: level
									}
								};

								// function requiredInitialSelection can also returns a null
								if (requiredInitialSelection) {
									if (!_.isNull(requiredInitialSelection.node) && (result.id === requiredInitialSelection.node.id)) {
										requiredInitialSelection.nodeItem = result;
									} else if (result.id === requiredInitialSelection.parentNode) {
										requiredInitialSelection.parentItem = result;
									}
								}
								rawNode.isExpanded = !result.nodeInfo.collapsed;
								if (_.isArray(result.children)) {
									result.nodeInfo.children = !_.isEmpty(result.children) ? _.map(result.children, function (ch) {
										return ch.nodeInfo;
									}) : false;
								}
								return result;
							});
						} else {
							return [{
								id: 'temp%' + path,
								name: loadingText,
								nodeInfo: {
									collapsed: true,
									level: level
								},
								isTemporary: true,
								image: 'spinner-sm',
								originalId: path
							}];
						}
					}

					const rawTree = dlgData.schemaGraphProvider.getLoadedTree();
					let structureTree;
					let rootIsLoading;

					let newlyExpandedNodes = [];

					function initializeTree() {
						specialNodes.searchResults.searchResultsReady = false;
						structureTree = createStructureNodes(rawTree, '', 0, isTreeSimplified());
						rootIsLoading = !!structureTree[0].isTemporary;

						platformGridAPI.items.data($scope.structureGridId, structureTree);
						gridDataLoaded();
					}

					initializeTree();

					function findInStructureTree(id) {
						function findInSubTree(root) {
							if (root.id === id) {
								return root;
							}
							if (_.isArray(root.children)) {
								for (let i = 0; i < root.children.length; i++) {
									const result = findInSubTree(root.children[i]);
									if (result) {
										return result;
									}
								}
							}
							return null;
						}

						return findInSubTree(_.last(structureTree));
					}

					function nodeExpanded($event, info) {
						if (_.isObject(info.item.rawNode)) {
							if (!info.item.rawNode.isExpanded) {
								info.item.rawNode.isExpanded = true;
								dlgData.schemaGraphProvider.loadMissing(info.item);
								newlyExpandedNodes.push(info.item);
							}
						}
					}

					platformGridAPI.events.register($scope.structureGridId, 'onTreeNodeExpanded', nodeExpanded);
					finalizers.push(function () {
						platformGridAPI.events.unregister($scope.structureGridId, 'onTreeNodeExpanded', nodeExpanded);
					});

					function gridDataLoaded() {
						const selStructureTreeItem = (function getSelectedStructureItem() {
							const selectedItems = platformGridAPI.rows.selection({
								gridId: $scope.structureGridId,
								wantsArray: true
							});
							if (selectedItems) {
								if (selectedItems.length === 1) {
									return selectedItems[0];
								}
							}
							return null;
						})();

						const requireSubentities = (function requireSubenties() {
							if (dlgData.schemaGraphProvider.supportsSubentities() && !_.isEmpty(dlgData.schemaGraphProvider.modifySubentities())) {
								const subentityRawNodes = [];
								const subentityIds = _.map(dlgData.schemaGraphProvider.modifySubentities(), 'id');
								const allSubentitiesHaveLoaded = _.every(structureTree, function (rootNode) {
									return _.every(subentityIds, function (subEntitiyId) {
										const node = _.find(rootNode.children, {id: subEntitiyId});
										if (node) {
											subentityRawNodes.push(node.rawNode);
											return true;
										} else {
											return false;
										}
									});
								});
								if (allSubentitiesHaveLoaded && dlgData.selectedId && dlgData.selectedId.includes('*')) {
									const rootSubentityNode = {
										children: subentityRawNodes
									};
									requiredInitialSelection = gatherInitialSelectionInfo(rootSubentityNode);
								}
								return !allSubentitiesHaveLoaded;
							} else {
								return false;
							}
						})();

						function updateChildren(node) {
							if (_.isArray(node.children)) {
								if ((node.children.length === 1) && node.children[0].isTemporary) {
									const loaded = createStructureNodes([node.rawNode], node.id, node.nodeInfo.level);
									if ((loaded.length >= 1) && (loaded[0].id === node.id)) {
										node.children = loaded[0].children;
										node.nodeInfo.children = loaded[0].nodeInfo.children;
										if (node === selStructureTreeItem) {
											updateContentGrid();
										}
									}
								} else {
									node.children.forEach(function (ch) {
										updateChildren(ch);
									});
								}
							}
						}

						// if root is loading
						if (rootIsLoading) {
							// reinitialise after load
							$scope.supportsSimpleMode = dlgData.schemaGraphProvider.supportsBookmarks();
							const loadedTree = dlgData.schemaGraphProvider.getLoadedTree();
							if (loadedTree) {
								rootIsLoading = false;
								structureTree.forEach(function (node, index) {
									if (node.isTemporary) {
										structureTree[index] = createStructureNodes(loadedTree, '', 0, isTreeSimplified())[0];
									}
								});
							}
						}
						// if subentities are required
						else if (requireSubentities && $scope.supportsSubentities && !isTreeSimplified()) {
							structureTree.forEach(function (rootNode) {
								const subentityRawNodes = _.cloneDeep(_.map(dlgData.schemaGraphProvider.modifySubentities(), 'node'));
								const subentityNodes = createStructureNodes(subentityRawNodes, rootNode.rawNode.id, 1);
								// always load missing nodes of subentities!
								const subentityRoot = {
									rawNode: {
										children: subentityRawNodes,
										mightHaveChildren: true
									}
								};
								// if node selected -> along path!
								const alongPath = _.some(_.map(subentityRawNodes, 'id'), function (id) {
									return _.includes(dlgData.selectedId, id);
								}) ? [dlgData.selectedId] : null;
								dlgData.schemaGraphProvider.loadMissing(subentityRoot, alongPath);
								newlyExpandedNodes = newlyExpandedNodes.concat(subentityNodes);
								rootNode.children = rootNode.children.concat(subentityNodes);
							});
						}
						// if subentities have loaded
						else {
							newlyExpandedNodes.forEach(function (node) {
								updateChildren(node);
							});
							newlyExpandedNodes = [];
						}

						// only try to start a selection if everythin has loaded
						if (!rootIsLoading && !requireSubentities && requiredInitialSelection && requiredInitialSelection.parentItem) {
							$timeout(function () {
								platformGridAPI.rows.selection({
									gridId: $scope.structureGridId,
									rows: [requiredInitialSelection.parentItem]
								});

								if (requiredInitialSelection.node) {
									platformGridAPI.rows.selection({
										gridId: $scope.contentGridId,
										rows: [{
											id: requiredInitialSelection.node.id
										}]
									});
								}

								platformGridAPI.rows.scrollIntoViewByItem($scope.structureGridId, requiredInitialSelection.parentItem);

								requiredInitialSelection = null;
							}, 600); // TODO: ALM 99043
						}

						// always refresh
						platformGridAPI.grids.refresh($scope.structureGridId);
					}

					dlgData.schemaGraphProvider.registerDataLoaded(gridDataLoaded);
					finalizers.push(function () {
						dlgData.schemaGraphProvider.unregisterDataLoaded(gridDataLoaded);
					});

					function updateContentGrid() {
						const selectedItems = _.compact(platformGridAPI.rows.selection({
							gridId: $scope.structureGridId,
							wantsArray: true
						}));
						if (_.isArray(selectedItems) && (selectedItems.length > 0)) {
							let contentItems;
							if (selectedItems[0] === specialNodes.searchResults) {
								contentItems = dlgData.schemaGraphProvider.getLatestSearchResults();
							} else {
								if (selectedItems[0].rawNode) {
									contentItems = selectedItems[0].rawNode.children;
								} else {
									contentItems = [];
								}
							}

							const createListItemForRawNode = function createListItemForRawNode(rawNode) {
								return {
									id: rawNode.id,
									name: rawNode.userLabelName || rawNode.name,
									rawNode: rawNode,
									path: rawNode.path,
									image: rawNode.image
								};
							};

							const onlyBookmarked = isTreeSimplified();
							contentItems = _.orderBy(_.map(_.filter(contentItems, function removeStructuralNodes(rawNode) {
								return !rawNode.onlyStructural && (!onlyBookmarked || dlgData.schemaGraphProvider.isNodeBookmarked(rawNode.id));
							}), createListItemForRawNode), function (item) {
								return item.name.toLowerCase();
							});

							// add subentities if isRootItem
							if (_.get(selectedItems[0], 'rawNode.isRootItem') && $scope.supportsSubentities) {
								const subentityRawNodes = _.cloneDeep(_.map(dlgData.schemaGraphProvider.modifySubentities(), 'node'));
								const subentityItems = _.map(_.filter(subentityRawNodes, function removeStructuralNodes(rawNode) {
									return !rawNode.onlyStructural && (!onlyBookmarked || dlgData.schemaGraphProvider.isNodeBookmarked(rawNode.id));
								}), createListItemForRawNode);
								contentItems = contentItems.concat(subentityItems);
							}

							platformGridAPI.items.data($scope.contentGridId, contentItems);
						} else {
							platformGridAPI.items.data($scope.contentGridId, []);
						}


						if (searchTranslationDialogActivated && $scope.isESV2) {
							platformGridAPI.rows.addCssClass({
								gridId: $scope.contentGridId,
								items: platformGridAPI.items.data($scope.contentGridId).filter(i => !i.rawNode.IsFilterAttribute),
								cssClass: 'notFilterAttributeColor'
							});
						}

						storeSelectedValue();
					}

					if (dlgData.schemaGraphProvider.registerContentChanged) {
						dlgData.schemaGraphProvider.registerContentChanged(updateContentGrid);
						$scope.$on('$destroy', function () {
							dlgData.schemaGraphProvider.unregisterContentChanged(updateContentGrid);
						});
					}

					function updateTree(config) {
						if (config && config.selectedId) {
							requiredInitialSelection = {
								node: null,
								parentNode: config.selectedId
							};
						}
						initializeTree();
					}

					if (dlgData.schemaGraphProvider.registerTreeChanged) {
						dlgData.schemaGraphProvider.registerTreeChanged(updateTree);
						$scope.$on('$destroy', function () {
							dlgData.schemaGraphProvider.unregisterTreeChanged(updateTree);
						});
					}

					platformGridAPI.events.register($scope.structureGridId, 'onSelectedRowsChanged', updateContentGrid);
					finalizers.push(function () {
						platformGridAPI.events.unregister($scope.structureGridId, 'onSelectedRowsChanged', updateContentGrid);
					});

					function storeSelectedValue() {
						let selectedItems = platformGridAPI.rows.selection({
							gridId: $scope.contentGridId,
							wantsArray: true
						});
						if (!_.isArray(selectedItems) || (selectedItems.length <= 0)) {
							// selection grid item from left side
							selectedItems = platformGridAPI.rows.selection({
								gridId: $scope.structureGridId,
								wantsArray: true
							});
						}

						if (_.isArray(selectedItems) && (selectedItems.length > 0)) {
							const rawNode = selectedItems[0].rawNode;
							if (rawNode) {
								dlgData.selectedId = rawNode.id;

								if (printSelectedId) {
									$log.info(rawNode.id);
								}

								/*
									Explicit for Search Enhanced. Used for translations of reference tables.
									Function for intern. Not for customers
								 */
								if ($scope.showTranslationContainer && dlgData.schemaGraphProvider.propsById(dlgData.selectedId)) {
									processMasterTranslation(rawNode.id);
								}

								return;
							}
						}
						dlgData.selectedId = null;
					}

					function processMasterTranslation(id) {
						const translationProperty = dlgData.schemaGraphProvider.propsById(id);

						let fi, mc, search, columnName, kind, url, filterColIdColName, tabIdRefTabId, columnNameReadOnly;
						if (translationProperty) {
							if(!dlgData.isESV2) {
								fi = translationProperty.dto.filterItem || {};
								mc = fi.myColumn;
								search = mc ? (mc.basDdTableFk + ':' + mc.id + ':en') : (fi.basDdTableFk + ':' + fi.id + ':en');

								columnName = mc ? mc.columnName : fi.columnName;
								// Kind: 1= FilterEntity, 2= FilterColumn, 3=Characteristic
								kind = fi.kind && fi.kind === 1 ? 'lookup or relation (kind:' + fi.kind + ')'
									: fi.kind === 2 ? 'FilterColumn (kind:' + fi.kind + ')'
										: fi.kind === 3 ? 'Characteristic (kind:' + fi.kind + ')'
											: 'n/a (' + fi.kind + ')';

								url = 'https://itwo40-int.rib-software.com/itwo40/master/client/#/api?navigate&operation=query&module=cloud.translation&search=' + search;

								filterColIdColName = translationProperty.dto.filterItemId + ' / ' + (columnName || '');
								tabIdRefTabId = mc ? (mc.basDdTableFk || '') + ' / ' + (mc.referenceTableFk || '') : '';
								columnNameReadOnly = true;
							} else {
								if (!translationProperty.dto) {
									translationProperty.dto = translationProperty;
								}
								let searchStrings = translationProperty.dto.DdPath.split('.');
								let string = [];
								searchStrings.forEach(s => {
									string.push(s.replace(/\D+/, ''));
								});
								string = string.join(':');
								search = translationProperty.dto.TableIdDB + ':' + string + ': ' + cloudCommonInitUiLanguageItems.getCulture();
								columnName = translationProperty.dto.Name;
								translationProperty.dto.isLookupTable = translationProperty.UiTypeId === 'lookup';
								translationProperty.dto.IsFilterAttribute = !!translationProperty.IsFilterAttribute;
								translationProperty.dto.isReference = translationProperty.UiTypeId === 'reference';
								const uiTypeIdCamelCase = translationProperty.dto.UiTypeId.charAt(0).toUpperCase() + translationProperty.dto.UiTypeId.slice(1);
								kind = !translationProperty.dto.isReference && !translationProperty.dto.isLookupTable ? 'FilterColumn (kind:' + uiTypeIdCamelCase + ')' : uiTypeIdCamelCase;
								filterColIdColName = !translationProperty.dto.isReference && !translationProperty.dto.isLookupTable  ? translationProperty.dto.DdPath + ' / ' + (columnName || '') : '';
								tabIdRefTabId = translationProperty.dto.TableIdDB + (translationProperty.dto.isReference || translationProperty.dto.isLookupTable  ? ' / ' + translationProperty.TargetId : '');
								columnNameReadOnly = false;
								translationProperty.dto.nameWithPath = translationProperty.dto.TableNameDB + $translate.instant('basics.common.fieldSelector.levelSeparator') + translationProperty.dto.Name;
								if (_.isFunction(translationProperty.getChildrenPath)) {
									translationProperty.dto.nameWithPath = translationProperty.getChildrenPath();
								}
							}

							const infoDialogNode = {
								node: translationProperty,
								dt: translationProperty.dto,
								fi: fi,
								columnName: columnName,
								columnNameReadOnly: columnNameReadOnly,
								mc: mc,
								search: search,
								kind: kind,
								tabIdRefTabId: tabIdRefTabId,
								filterColIdColName: filterColIdColName,
								// cacheReloadedOn: cloudDesktopEnhancedFilterService.cacheReloadedOn,
								openiTWO40Master: function () {
									$window.open(url);
								},
								ddRefresh: function () {
									$rootScope.$emit('dd:clearReloadCache', true);
								},
								saveTranslation: function (entity) {
									if ($scope.isESV2) {

										updateFieldData(entity);

										$http.post(globals.webApiBaseUrl + 'basics/common/bulkexpr/schema/updatefieldsinfo', fieldstoUpdate).then((result) => {
											fieldstoUpdate = [];
										});
									}
								},
								isFilterAttributeChanged: (entity) => {
									if ($scope.isESV2) {
										let currentItem = platformGridAPI.items.data($scope.contentGridId).filter(x => x.id === entity.id)[0];

										updateFieldData(entity);

										if (entity.IsFilterAttribute) {
											$('.notFilterAttributeColor.active').removeClass('notFilterAttributeColor');
											delete currentItem.cssClass;
										} else {
											platformGridAPI.rows.addCssClass({
												gridId: $scope.contentGridId,
												items: [currentItem],
												cssClass: 'notFilterAttributeColor'
											});
										}
									}
								},
								updateEntityOnChange: (entity) => {
									if ($scope.isESV2) {
										updateFieldData(entity);
									}
								}
							};

							$scope.translationOptions = {
								data: infoDialogNode
							};
						}
					}

					function updateFieldData (entity) {
						if ($scope.isESV2) {
							let entityToUpdate = dlgData.schemaGraphProvider.__ddDataState.entitiesById[entity.TableIdDB].Fields.find(f => f.DdPath === entity.DdPath) || {};

							if (_.isObject(entityToUpdate)) {
								const props = Object.keys(entityToUpdate);
								props.forEach(p => {
									entityToUpdate[p] = entity[p];
								});
								if (_.isUndefined(entityToUpdate.IsLookupTable)){
									entityToUpdate.IsLookupTable = entity.isLookupTable;
								}
							}

							if (fieldstoUpdate.indexOf(entityToUpdate) === -1) {
								fieldstoUpdate.push(entityToUpdate);
							}
						}
					}

					platformGridAPI.events.register($scope.contentGridId, 'onSelectedRowsChanged', storeSelectedValue);
					finalizers.push(function () {
						platformGridAPI.events.unregister($scope.contentGridId, 'onSelectedRowsChanged', storeSelectedValue);
					});

					$scope.searchFields = function () {
						if (!$scope.isSearchBusy) {
							$scope.isSearchBusy = true;
							$q.when(dlgData.schemaGraphProvider.findFields($scope.currentSearchText)).then(function () {
								$scope.$evalAsync(function () {
									$scope.isSearchBusy = false;

									if (!specialNodes.searchResults.searchResultsReady) {
										specialNodes.searchResults.searchResultsReady = true;
										structureTree.splice(0, 0, specialNodes.searchResults);
										platformGridAPI.grids.refresh($scope.structureGridId);
									}

									const previousSelection = _.compact(platformGridAPI.rows.selection({
										gridId: $scope.structureGridId,
										wantsArray: true
									}));
									if (previousSelection.includes(specialNodes.searchResults)) {
										updateContentGrid();
									} else {
										platformGridAPI.rows.selection({
											gridId: $scope.structureGridId,
											rows: [specialNodes.searchResults]
										});
									}
								});
							});
						}
					};

					$scope.onClearSearch = function () {
						// empty search-field
						$scope.currentSearchText = '';
						// set focus on inputfield
						angular.element(elem).find('#searchfield').focus();
					};

					dlgData.isSubentitySelectionValid = function (create) {
						const selectedItems = _.compact(platformGridAPI.rows.selection({
							gridId: $scope.structureGridId,
							wantsArray: true
						}));
						if (_.isArray(selectedItems) && (selectedItems.length > 0)) {
							const rawNode = selectedItems[0].rawNode;
							if (!rawNode.isRootItem) {
								if (create === true) {
									return !rawNode.isVirtual;
								} else {
									return rawNode.isVirtual && !rawNode.onlyStructural;
								}
							}
						}
						return false;
					};

					dlgData.isSelectionValid = function () {
						let selectedItems = _.compact(platformGridAPI.rows.selection({
							gridId: $scope.contentGridId,
							wantsArray: true
						}));
						if (!_.isArray(selectedItems) || (selectedItems.length <= 0)) {
							selectedItems = _.compact(platformGridAPI.rows.selection({
								gridId: $scope.structureGridId,
								wantsArray: true
							}));
						}

						if (_.isArray(selectedItems) && (selectedItems.length > 0)) {
							const rawNode = selectedItems[0].rawNode;
							if (rawNode) {
								return dlgData.schemaGraphProvider.canSelectItem(rawNode);
							}
						}
						return false;
					};

					$scope.$on('$destroy', function () {
						finalizers.forEach(function (f) {
							f();
						});
					});
				}
			};
		}]);
})(angular);
