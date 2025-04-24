/*
 * $Id: cloud-desktop-sidebar-search-schema-graph-service.js 558771 2019-09-13 13:15:29Z uestuenel $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name cloud.Desktop.cloudDesktopSidebarSearchSchemaGraphService
	 * @function
	 * @requires _, basicsCommonSchemaGraphService, $http, $q, $translate
	 *
	 * @description Provides classes that represent data schema graphs based on the data dictionary.
	 */
	angular.module('cloud.desktop').factory('cloudDesktopSidebarSearchSchemaGraphService', ['_', 'basicsCommonSchemaGraphService',
		'$http', '$q', '$translate',
		function (_, basicsCommonSchemaGraphService, $http, $q, $translate) {
			var service = {};

			var rootId = ':root';
			var commonState;

			function createNode(filterProp, parentNode) {
				var isStructuralNode = !filterProp.isSelectable;
				var imgObj = (isStructuralNode || _.isNumber(_.get(filterProp, 'dto.filterItem.myColumn.referenceTableFk'))) ? {
					image: 'control-icons ' + filterProp.image
				} : {};

				return _.assign(new basicsCommonSchemaGraphService.SchemaGraphNode(filterProp.id, _.get(filterProp, 'dto.filterItem.uiType'), _.get(filterProp, 'dto.filterItem.myColumn.referenceTableFk'), filterProp.name, parentNode, _.get(filterProp, 'dto.filterItem.myColumn.isLookUp')), {
					isNullable: !!_.get(filterProp, 'dto.filterItem.isNullable'),
					mightHaveChildren: !!filterProp.HasChildren,
					onlyStructural: isStructuralNode
				}, imgObj);
			}

			function getFullPath(filterProp, propsById) {
				var result = [];
				for (var current = filterProp; current; current = _.isNumber(current.parentId) ? propsById[current.parentId] : null) {
					if (!current.isRoot) {
						result.unshift(current.name);
					}
				}
				return result;
			}

			function formatPropPath(filterProp, propsById) {
				var fullPath = getFullPath(filterProp, propsById);
				fullPath.pop();
				return formatPath(fullPath);
			}

			function formatPath(path) {
				var ellipsisStr = $translate.instant('basics.common.fieldSelector.ellipsis');
				return _.map(path, function (part) {
					return part === null ? ellipsisStr : part;
				}).join($translate.instant('basics.common.fieldSelector.levelSeparator'));
			}

			function formatPropWithPath(filterProp, propsById, shorten) {
				var fullPath = getFullPath(filterProp, propsById);
				if (shorten) {
					if (fullPath.length > 3) {
						fullPath = _.concat(fullPath.slice(0, 1), [null], fullPath.slice(-2));
					}
				}
				return formatPath(fullPath);
			}

			function collectAllProperties(propList, propsById) {
				if (_.isArray(propList)) {
					propList.forEach(function (prop) {
						propsById[prop.id] = prop;
						collectAllProperties(prop.childProperties, propsById);
					});
				}
			}

			function getState(instance) {
				var result = instance.__searchSidebarDataState;
				if (!result) {
					var initializedDeferred = $q.defer();
					instance.__searchSidebarDataState = result = {
						isInitialized: false,
						initializedPromise: initializedDeferred.promise,
						entitiesById: {},
						propsById: {},
						initialize: function (config) {
							var that = this;

							collectAllProperties(config.filterColumns, that.propsById);
							that.entitiesById[rootId] = config.filterColumns;
							return instance.storeTreeRoot(_.assign(new basicsCommonSchemaGraphService.SchemaGraphNode(':root', null, null, config.rootDisplayName), {
								mightHaveChildren: true,
								isRoot: true
							}),
							function getChildrenForNode(node) {
								var result = that.entitiesById[node.id];
								return _.map(_.isArray(result) ? result : [], function (filterProp) {
									if (filterProp.HasChildren) {
										that.entitiesById[filterProp.id] = filterProp.childProperties;
									}

									return createNode(filterProp, node);
								});
							}).then(function () {
								that.isInitialized = true;
								initializedDeferred.resolve();
							});
						},
						cancelCurrentSearchRequest: function () {
						},
						applyTypeRestrictionsToRequest: function (requestParams) {
							var els = {};
							if (this.uiTypeId) {
								els.t = this.uiTypeId;
							}
							if (this.targetId) {
								els.e = this.targetId;
							} else if (this.targetTableName) {
								els.e = this.targetTableName;
							}
							if (!_.isEmpty(this.targetKind)) {
								els.k = this.targetKind;
							}
							var restrictionElements = _.map(Object.keys(els), function (key) {
								return key + ':' + els[key];
							});
							if (restrictionElements.length > 0) {
								requestParams.typeRestrictions = restrictionElements.join(';');
							}
						}
					};
				}
				return result;
			}

			function SidebarSearchSchemaGraphProvider(config) {
				basicsCommonSchemaGraphService.SchemaGraphProvider.call(this, config);

				var actualConfig = _.assign({
					filterColumns: []
				}, _.isObject(config) ? config : {});

				var state = getState(this);
				state.initialize(actualConfig);
			}

			SidebarSearchSchemaGraphProvider.prototype = Object.create(basicsCommonSchemaGraphService.SchemaGraphProvider.prototype);
			SidebarSearchSchemaGraphProvider.prototype.constructor = SidebarSearchSchemaGraphProvider;

			service.SidebarSearchSchemaGraphProvider = SidebarSearchSchemaGraphProvider;

			SidebarSearchSchemaGraphProvider.prototype.findFields = function (searchText) {
				var that = this;
				var state = getState(this);

				searchText = _.isString(searchText) ? searchText.toLowerCase() : '';

				var results = _.filter(_.map(state.propsById, function (prop) {
					if (_.includes(prop.nameWithPath.toLowerCase(), searchText.toLowerCase())) {
						var resultNode = createNode(prop, null);
						_.assign(resultNode, {
							mightHaveChildren: false,
							path: formatPropPath(prop, state.propsById)
						});
						return resultNode;
					}
				}), function (result) {
					return !_.isNil(result);
				});
				that.storeSearchResults(results);
				return results.length;
			};

			SidebarSearchSchemaGraphProvider.prototype.getDisplayNameForItem = function (id) {
				var state = getState(this);
				return state.initializedPromise.then(function () {
					var prop = state.propsById[id];
					if (prop) {
						return {
							long: formatPropWithPath(prop, state.propsById, false),
							short: formatPropWithPath(prop, state.propsById, true)
						};
					}
					return '';
				});
			};

			SidebarSearchSchemaGraphProvider.prototype.canSelectItem = function (item) {
				return !item.isRoot && !item.onlyStructural;
			};

			SidebarSearchSchemaGraphProvider.prototype.fieldTypesMatch = function (f1, f2) {
				if (_.isNil(f1) || _.isNil(f2)) {
					throw new Error('The fieldTypesMatch method can only work with field info objects.');
				}

				if (f1.UiTypeId === f2.UiTypeId) {
					if ((_.isEmpty(f1.TargetKind) && _.isEmpty(f2.TargetKind)) || (f1.TargetKind === f2.TargetKind)) {
						if ((!_.isNumber(f1.TargetId) && !_.isNumber(f2.TargetId)) || (f1.TargetId === f2.TargetId)) {
							return true;
						}
					}
				}
				return false;
			};

			SidebarSearchSchemaGraphProvider.prototype.propsById = function (id) {
				var state = getState(this);
				return state.propsById && state.propsById[id];
			};

			SidebarSearchSchemaGraphProvider.prototype.isPartOfPath = function (itemId, selectedId) {

				var state;

				if (!commonState) {
					commonState = getState(this);
				}

				var curParent = commonState.propsById && commonState.propsById[selectedId[0]];

				if (selectedId.length === 0) {
					return false;
				}

				while (curParent.parent) {
					curParent = curParent.parent;

					if (curParent && curParent.id === itemId) {
						// merken dass es return wurde. und oben abfragen, ob es return worden ist. UNd: ab level 2 die funktion aufrufen
						return true;
					}
				}

				return false;
			};

			SidebarSearchSchemaGraphProvider.prototype.showTranslationContainerForSearchEnhanced = true;

			return service;
		}]);
})();