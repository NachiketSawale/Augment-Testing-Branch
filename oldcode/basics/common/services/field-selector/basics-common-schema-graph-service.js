/*
 * $Id: basics-common-schema-graph-service.js 620688 2021-01-21 08:46:40Z baf $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basics.common.basicsCommonSchemaGraphService
	 * @function
	 *
	 * @description Provides classes that represent data schema graphs.
	 */
	angular.module('basics.common').factory('basicsCommonSchemaGraphService', ['PlatformMessenger', '$q', '_',
		'$translate', 'platformPromiseUtilitiesService',
		function (PlatformMessenger, $q, _, $translate, platformPromiseUtilitiesService) {
			const service = {};

			const expandedPreloadDepth = 2;

			service.getExpandedPreloadDepth = function () {
				return expandedPreloadDepth;
			};

			// SchemaGraphNode ----------------------------------------------------------------

			function pickIconTypeUiTypeId(uiTypeId) {
				switch (uiTypeId) {
					case'number':
					case'quantity':
						return 'control-icons ico-domain-decimal';
					case 'factor':
						return 'control-icons ico-domain-factor';
					case 'money':
						return 'control-icons ico-domain-money';
					case 'exchangerate':
						return 'control-icons ico-domain-exchangerate';

					case'integer':
						return 'control-icons ico-domain-integer';
					case'percent':
						return 'control-icons ico-domain-percent';

					case'date':
					case'dateutc':
						return 'control-icons ico-domain-date';

					case'datetime':
					case'datetimeutc':
						return 'control-icons ico-domain-date-time';

					case'code':
					case'string':
					case'description':
					case'remark':
					case 'remarkString':
					case'comment':
					case'text':
						return 'control-icons ico-domain-text';

					case'translation':
						return 'control-icons ico-domain-translation';

					case'boolean':
						return 'control-icons ico-domain-boolean';

					case 'lookup':
						return 'control-icons ico-domain-lookup';
					case'email':
						return 'control-icons ico-domain-email';
					case'color':
						return 'control-icons ico-domain-color';
					case 'imageselect':
						return 'control-icons ico-domain-imageselect';
					case 'relationset':
						return 'control-icons ico-domain-lookup';

					case 'characteristics':
						return 'control-icons ico-criterion-at-fo';
				}
			}

			function SchemaGraphNode(id, uiTypeId, targetId, name, parent, isEnum, isForeignKey, userLabelName) {
				this.parent = parent;
				this.id = id;
				this.uiTypeId = uiTypeId;
				this.targetId = targetId;
				this.name = name;
				this.path = _.isObject(parent) ? parent.getChildrenPath() : '';
				this.mightHaveChildren = false;
				this.children = null;
				this.isExpanded = false;
				this.onlyStructural = false;
				this.isEnum = !!isEnum;
				this.userLabelName = userLabelName;

				if (_.isNumber(this.targetId)) {
					if (isEnum) {
						this.image = 'control-icons ico-criterion-lookup';
					} else if (isForeignKey) {
						this.image = 'control-icons ico-criterion-1n';
					} else {
						this.image = 'control-icons ico-criterion-n1';
					}
				} else if (this.uiTypeId) {
					this.image = pickIconTypeUiTypeId(this.uiTypeId);
				}
			}

			function appendParentToNodes(tree) {
				const parent = tree.id;
				angular.forEach(tree.children, function (child) {
					child.parent = parent;
				});

				return tree;
			}

			SchemaGraphNode.prototype.getChildrenPath = function () {
				if (_.isEmpty(this.path)) {
					return this.name;
				} else {
					return this.path + $translate.instant('basics.common.fieldSelector.levelSeparator') + this.name;
				}
			};

			service.SchemaGraphNode = SchemaGraphNode;

			function compareSchemaGraphNodes(a, b) {
				if (_.isNil(a)) {
					if (_.isNil(b)) {
						return 0;
					} else {
						return -1;
					}
				} else if (_.isNil(b)) {
					return 1;
				}

				let result;
				if (_.isNumber(a.sorting)) {
					if (_.isNumber(b.sorting)) {
						result = a.sorting - b.sorting;
						if (result !== 0) {
							return result;
						}
					} else {
						return -1;
					}
				} else if (_.isNumber(b.sorting)) {
					return 1;
				}

				return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
			}

			// SchemaGraphProvider ----------------------------------------------------------------

			function getState(instance) {
				let result = instance.__dataState;
				if (!result) {
					result = instance.__dataState = {
						loadedTree: null,
						getChildren: null,
						onDataLoaded: new PlatformMessenger(),
						fireDataLoaded: function () {
							this.onDataLoaded.fire();
						},
						searchResults: []
					};
				}
				return result;
			}

			function SchemaGraphProvider() {
			}

			service.SchemaGraphProvider = SchemaGraphProvider;

			SchemaGraphProvider.prototype.storeTreeRoot = function (rootItem, getChildrenInfo) {
				const state = getState(this);
				state.loadedTree = rootItem;
				rootItem.image = 'control-icons ico-criterion-focus';

				let getChildren;
				if (_.isFunction(getChildrenInfo)) {
					getChildren = getChildrenInfo;
				} else if (_.isObject(getChildrenInfo)) {
					getChildren = getChildrenInfo.getChildren;
					state.prepareNodeDataForId = getChildrenInfo.prepareNodeDataForId;
				} else {
					throw new Error('No children retrieval function(s) supplied.');
				}

				return $q.when(getChildren(rootItem)).then(function (children) {
					children.sort(compareSchemaGraphNodes);
					rootItem.children = children;
					appendParentToNodes(rootItem);
					rootItem.isExpanded = true;
					return $q.all(_.map(_.filter(rootItem.children, function (child) {
						return child.mightHaveChildren;
					}), function (child) {
						return $q.when(getChildren(child)).then(function (children) {
							children.sort(compareSchemaGraphNodes);
							child.children = children;
						});
					}));
				}).then(function () {
					state.getChildren = getChildren;

					state.fireDataLoaded();
				});
			};

			SchemaGraphProvider.prototype.getLoadedTree = function () {
				const state = getState(this);
				return state.loadedTree ? [state.loadedTree] : null;
			};

			SchemaGraphProvider.prototype.findLoadedNode = function (id, tree) {

				// go in all child-elements, and search for id
				function findObject(node) {
					let result;

					for (let i = 0; i < node.length; i++) {
						if (node[i].id === id) {
							result = node[i];
							break;
						}
						if (node[i].children) {
							result = findObject(node[i].children);
							if (result) {
								break;
							}
						}
					}
					return result;
				}

				function findInSubtree(rootNode) {
					if (rootNode.id === id) {
						return rootNode;
					}
					if (_.isArray(rootNode.children)) {
						// search rekursive
						const resultItem = findObject(rootNode.children);
						if (resultItem) {
							return resultItem;
						}
					}
					return null;
				}

				const state = getState(this);
				if (tree || state.loadedTree) {
					return findInSubtree(tree || state.loadedTree);
				}

				return null;
			};

			SchemaGraphProvider.prototype.registerDataLoaded = function (handler) {
				const state = getState(this);
				state.onDataLoaded.register(handler);
			};

			SchemaGraphProvider.prototype.unregisterDataLoaded = function (handler) {
				const state = getState(this);
				state.onDataLoaded.unregister(handler);
			};

			SchemaGraphProvider.prototype.prepareNodeDataForId = function (id) {
				const state = getState(this);
				if (_.isFunction(state.prepareNodeDataForId)) {
					return $q.when(state.prepareNodeDataForId(id));
				} else {
					return $q.resolve();
				}
			};

			SchemaGraphProvider.prototype.loadMissing = function (startAtNode, expandPaths, customDepth) {
				if (!_.isArray(expandPaths)) {
					expandPaths = [];
				}

				const that = this;
				const state = getState(this);

				if (state.loadedTree) {

					return platformPromiseUtilitiesService.while(function processNode(info) {
						const nodeInfo = info.nextNodes.shift();
						const actualRequiredLevels = that.isPartOfPath(nodeInfo.node.id, expandPaths) ? expandedPreloadDepth : nodeInfo.requiredLevels;
						if (nodeInfo.node.mightHaveChildren && (actualRequiredLevels > 0)) {
							let integrateChildrenPromise;
							if (_.isArray(nodeInfo.node.children)) {
								integrateChildrenPromise = $q.resolve();
							} else {
								integrateChildrenPromise = $q.when(state.getChildren(nodeInfo.node)).then(function (children) {
									if (_.isArray(children)) {
										nodeInfo.node.children = children.sort(compareSchemaGraphNodes);
									} else {
										nodeInfo.node.children = null;
									}
								});
							}

							return integrateChildrenPromise.then(function () {
								nodeInfo.node.children.forEach(function (child) {
									info.nextNodes.push({
										node: child,
										requiredLevels: actualRequiredLevels - 1
									});
								});

								return info;
							});
						} else {
							return info;
						}
					}, function canContinue(info) {
						return info.nextNodes.length > 0;
					}, {
						nextNodes: [{
							node: (_.isObject(startAtNode) && _.isObject(startAtNode.rawNode)) ? startAtNode.rawNode : state.loadedTree,
							requiredLevels: customDepth || expandedPreloadDepth
						}],
						twoLevelsMissing: [],
						oneLevelMissing: []
					}).then(function finalizeProcessing() {
						state.fireDataLoaded();
					});
				} else {
					return $q.resolve();
				}
			};

			SchemaGraphProvider.prototype.expandPath = function (path) {
				const that = this;
				return that.prepareNodeDataForId(path).then(function (newPath) {
					return that.loadMissing(null, [newPath || path]);
				});
			};

			SchemaGraphProvider.prototype.isPartOfPath = function () {
				return false;
			};

			SchemaGraphProvider.prototype.findFields = function () {
				throw new Error('This method must be overridden by a subclass.');
			};

			SchemaGraphProvider.prototype.storeSearchResults = function (items) {
				const state = getState(this);

				if (_.isArray(items)) {
					state.searchResults = items;
				} else {
					state.searchResults = [];
				}

				state.fireDataLoaded();
			};

			SchemaGraphProvider.prototype.getLatestSearchResults = function () {
				const state = getState(this);
				return state.searchResults;
			};

			SchemaGraphProvider.prototype.getDisplayNameForItem = function () {
				throw new Error('This method must be overridden by a subclass.');
			};

			SchemaGraphProvider.prototype.formatDisplayName = function () {
				throw new Error('This method must be overridden by a subclass.');
			};

			SchemaGraphProvider.prototype.canSelectItem = function () {
				return true;
			};

			SchemaGraphProvider.prototype.fieldTypesMatch = function () {
				throw new Error('This method must be overridden by a subclass.');
			};

			SchemaGraphProvider.prototype.isNodeBookmarked = function () {
				return false;
			};

			SchemaGraphProvider.prototype.supportsBookmarks = function () {
				return false;
			};

			SchemaGraphProvider.prototype.modifySubentities = function () {
				throw new Error('This method must be overridden by a subclass.');
			};

			SchemaGraphProvider.prototype.supportsSubentities = function () {
				return false;
			};

			SchemaGraphProvider.prototype.modifyAliasExpressions = function () {
				throw new Error('This method must be overridden by a subclass.');
			};

			return service;
		}]);
})();
