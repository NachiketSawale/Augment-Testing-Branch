/*
 * $Id: basics-common-dd-schema-graph-service.js 611539 2020-11-10 10:19:07Z haagf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name basics.common.basicsCommonDdSchemaGraphService
	 * @function
	 *
	 * @description Provides classes that represent data schema graphs based on the data dictionary.
	 */
	angular.module('basics.common').factory('basicsCommonDdSchemaGraphService',
		basicsCommonDdSchemaGraphService);

	basicsCommonDdSchemaGraphService.$inject = ['_', 'basicsCommonSchemaGraphService',
		'$http', 'PlatformMessenger', '$q', '$translate', 'basicsCommonDataDictionaryTypeService',
		'basicsCommonDdPathBookmarkDataService', '$injector',
		'basicsCommonFieldParamDialogService'];

	function basicsCommonDdSchemaGraphService(_, basicsCommonSchemaGraphService,
		$http, PlatformMessenger, $q, $translate, basicsCommonDataDictionaryTypeService,
		basicsCommonDdPathBookmarkDataService, $injector,
		basicsCommonFieldParamDialogService) {

		const service = {};

		function formatDdPath(labeledPath) {
			return labeledPath.PathLabels.join($translate.instant('basics.common.fieldSelector.levelSeparator'));
		}

		function formatDdPathShort(labeledPath) {
			let relevantParts;
			if (labeledPath.PathLabels.length > 3) {
				relevantParts = _.concat(labeledPath.PathLabels.slice(0, 1), [null], labeledPath.PathLabels.slice(-2));
			} else {
				relevantParts = labeledPath.PathLabels;
			}

			const ellipsisStr = $translate.instant('basics.common.fieldSelector.ellipsis');

			return _.map(relevantParts, function toStr(p) {
				if (_.isString(p)) {
					if (p.length > 20 + ellipsisStr.length) {
						return p.substr(0, 15) + ellipsisStr + p.substr(-5);
					} else {
						return p;
					}
				} else {
					return ellipsisStr;
				}
			}).join($translate.instant('basics.common.fieldSelector.levelSeparator'));
		}

		function collectAllProperties(propList, propsById) {
			if (_.isObject(propList)) {
				const props = _.flatten(Object.entries(propList).map(props => props[1]));
				props.forEach(function (prop) {
					prop.Fields.forEach((f) => {
						f.TableNameDB = prop.DisplayName;
						f.TableIdDB = prop.Id;
						propsById[f.DdPath] = _.cloneDeep(f);
					});
				});
			}
		}

		function getState(instance) {
			let result = instance.__ddDataState;
			if (!result) {
				instance.__ddDataState = result = {
					entitiesById: {},
					dynamicFieldSelectorsById: {},
					loadedTree: null,
					onDataLoaded: new PlatformMessenger(),
					onContentChanged: new PlatformMessenger(),
					onTreeChanged: new PlatformMessenger(),
					isInitialized: false,
					propsById: {},
					fireDataLoaded: function () {
						this.onDataLoaded.fire();
					},
					initialize: function (config) {
						const searchTranslationDialogActivated = globals.devFeatureFlags && globals.devFeatureFlags.searchTranslationDialog;
						const that = this;

						this.focusTableName = config.focusTableName;
						this.moduleName = config.moduleName;
						this.uiTypeId = config.uiTypeId;
						this.targetKind = config.targetKind;
						this.targetId = config.targetId;
						this.targetTableName = config.targetTableName;

						this.contextProvider = config.contextProvider;

						const requestPromises = {};

						const requestParams = {
							tableName: config.focusTableName,
							maxDepth: 1,
							moduleName: config.moduleName
						};
						this.applyTypeRestrictionsToRequest(requestParams);

						requestPromises.tree = $http.get(globals.webApiBaseUrl + 'basics/common/bulkexpr/schema/entityfieldshierarchically', {
							params: requestParams
						});

						if (this.targetTableName) {
							requestPromises.targetId = $http.get(globals.webApiBaseUrl + 'basics/common/bulkexpr/schema/entityid', {
								params: {
									tableName: this.targetTableName
								}
							});
						}

						requestPromises.bookmarks = this.moduleName ?
							basicsCommonDdPathBookmarkDataService.loadBookmarksByModule(this.moduleName) :
							basicsCommonDdPathBookmarkDataService.loadBookmarks(this.focusTableName);

						return $q.all(requestPromises).then(function (responses) {
							if (responses.targetId) {
								that.targetId = responses.targetId.data;
							}

							that.bookmarks = responses.bookmarks;

							const response = responses.tree;
							if (_.isArray(response.data) && (response.data.length > 0)) {
								if (!searchTranslationDialogActivated) {
									response.data.forEach(e => e.Fields = e.Fields.filter(f => _.isUndefined(f.IsFilterAttribute) || f.IsFilterAttribute));
								}



								response.data.forEach(function (entityInfo) {
									if (!that.entitiesById[entityInfo.Id]) {
										if (searchTranslationDialogActivated) {
											let referenceFields = entityInfo.Fields.filter(field => field.UiTypeId === 'reference' || field.UiTypeId === 'lookup');
											entityInfo.Fields = entityInfo.Fields.filter(f =>
												f.UiTypeId === 'reference' && f.TargetId ||
												f.UiTypeId === 'lookup' ||
												referenceFields.filter(rF => rF.Name === f.Name).length === 0);
										}

										that.entitiesById[entityInfo.Id] = entityInfo;
									}
								});

								collectAllProperties(that.entitiesById, that.propsById);

								const rootNode = response.data[0];
								return instance.storeTreeRoot(_.assign(new basicsCommonSchemaGraphService.SchemaGraphNode('', null, rootNode.Id, rootNode.DisplayName), {
									mightHaveChildren: true,
									isRootItem: true
								}), {
									getChildren: function getChildrenForNode(node) {
										function getEntityDef() {
											const nodeType = that.entitiesById[node.targetId];
											if (nodeType || !node.targetId) {
												return $q.when(nodeType);
											} else {
												const fieldsRequestParams = {
													tableId: node.targetId
												};
												that.applyTypeRestrictionsToRequest(fieldsRequestParams);

												const request = $http.get(globals.webApiBaseUrl + 'basics/common/bulkexpr/schema/entityfields', {
													params: fieldsRequestParams
												}).then(function (response) {
													that.entitiesById[node.targetId] = response.data;
													return response.data;
												});
												that.entitiesById[node.targetId] = request;
												return request;
											}
										}

										return getEntityDef().then(function (nodeType) {
											if (!nodeType && node.children) {
												return node.children;
											}

											const completionPromises = [];
											function addCompletionPromise(p) {
												completionPromises.push(p);
											}

											function createSchemaGraphNodes(nodeData, parentNode) {
												const logicalParentNode = parentNode.logicalParentNode || parentNode;

												return _.map(nodeData, function (field) {
													const isParametrized = _.isArray(field.Parameters) && !_.isEmpty(field.Parameters);

													const node = _.assign(new basicsCommonSchemaGraphService.SchemaGraphNode((logicalParentNode.id.length > 0 ? logicalParentNode.id + '.' : '') + field.DdPath, isParametrized ? null : field.UiTypeId, isParametrized ? null : field.TargetId, field.Name, parentNode, field.UiTypeId === 'lookup', field.IsForeignKey), {
														isNullable: !!field.IsNullable,
														mightHaveChildren: (_.isNumber(field.TargetId) && _.isEmpty(field.TargetKind)) || isParametrized,
														onlyStructural: (function determineOnlyStructural() {
															if (isParametrized) {
																return true;
															}

															if (_.isNumber(field.TargetId)) {
																if (_.isNumber(that.targetId)) {
																	return (field.TargetId !== that.targetId) || !((_.isEmpty(that.targetKind) === _.isEmpty(field.TargetKind)) || (field.TargetKind === that.targetKind));
																} else {
																	return !!that.uiTypeId;
																}
															}
															return false;
														})(),
														targetKind: field.TargetKind,
														isVirtual: isParametrized,
														IsFilterAttribute: !!field.IsFilterAttribute
													});

													if (isParametrized) {
														if (!that.contextProvider) {
															throw new Error('Parametrized fields are not supported without a context provider.');
														}

														node.children = [];

														node.selector = {
															actionList: [{
																toolTip: $translate.instant('basics.common.fieldSelector.selectFieldParams'),
																icon: 'tlb-icons ico-settings',
																callbackFn: function () {
																	return basicsCommonFieldParamDialogService.showDialog({
																		editorManager: that.contextProvider.getEditorManager()
																	}, field).then(function (result) {
																		const aliasId = that.contextProvider.addAliasExpression(logicalParentNode.id, field.DdPath, result.operands);

																		if (!Array.isArray(node.children)) {
																			node.children = [];
																		}

																		return that.contextProvider.getAliasExpressionLabel(aliasId.match(/[0-9]+$/)[0]).then(function (aliasLabel) {
																			return {
																				id: aliasId,
																				label: aliasLabel
																			};
																		});
																	}).then(function (aliasInfo) {
																		const newTreeNode = new basicsCommonSchemaGraphService.SchemaGraphNode(aliasInfo.id, field.UiTypeId, field.TargetId, aliasInfo.label, node, field.UiTypeId === 'lookup', field.IsForeignKey);
																		_.assign(newTreeNode, {
																			isVirtual: true,
																			mightHaveChildren: true,
																			onlyStructural: true
																		});
																		node.children.push(newTreeNode);

																		that.onTreeChanged.fire({
																			selectedId: newTreeNode.id
																		});
																	});

																	/*
																	return selectorUiService.selectItem().then(function (selId) {
																		var newFields = {};
																		newFields[sel.Id] = [selId];
																		return that.contextProvider.addDynamicFields(newFields, true).then(function (anyChanges) {
																			if (anyChanges) {
																				storedSelectorInfo.updateTreeNodes();
																			}
																		});
																	});
																	*/
																}
															}]
														};

														that.contextProvider.initializeAliasExpressions(instance, node, field, addCompletionPromise);
													}

													return node;
												});
											}

											const categoryNodes = [];
											_.forEach(nodeType.Categories, function (category) {
												const groupedNodes = _.filter(nodeType.Fields, function (field) {
													return _.includes(field.CategoryId, category.Id);
												});
												if (!_.isEmpty(groupedNodes)) {
													const categoryNode = _.assign(new basicsCommonSchemaGraphService.SchemaGraphNode((node.id.length > 0 ? node.id + '.' : '') + category.Id, category.Id, null, category.Name, node), {
														mightHaveChildren: true,
														onlyStructural: true,
														isVirtual: true
													});
													categoryNode.children = createSchemaGraphNodes(groupedNodes, categoryNode);
													categoryNodes.push(categoryNode);
												}
											});

											const regularNodes = _.filter(nodeType.Fields, function (field) {
												return _.isUndefined(field.CategoryId);
											});
											let nodes = createSchemaGraphNodes(regularNodes, node);

											const selectorNodes = nodeType.DynamicFieldSelectors ? _.map(nodeType.DynamicFieldSelectors, function (sel) {
												if (!that.contextProvider) {
													throw new Error('Dynamic fields are not supported without a context provider.');
												}

												const selectorUiService = $injector.get(sel.SelectorConfig.SelectorServiceName);
												if (!_.isFunction(selectorUiService.selectItem)) {
													throw new Error('Selector UI service ' + sel.SelectorConfig.SelectorServiceName + ' does not have a selectItem() function.');
												}

												let storedSelectorInfo = that.dynamicFieldSelectorsById[sel.Id];
												if (!storedSelectorInfo) {
													storedSelectorInfo = {
														treeNodes: [],
														updateTreeNodes: function (suppressUpdate) {
															const loadedFields = that.contextProvider.getDynamicFieldsByType(sel.Id);
															this.treeNodes.forEach(function updateDynamicSelectorNode(tn) {
																tn.children = createSchemaGraphNodes(loadedFields, tn);
															});
															if (!suppressUpdate) {
																that.onContentChanged.fire();
															}
														}
													};
													that.dynamicFieldSelectorsById[sel.Id] = storedSelectorInfo;
												}

												const selNode = _.assign(new basicsCommonSchemaGraphService.SchemaGraphNode((node.id.length > 0 ? node.id + '.' : '') + sel.Id, sel.Id, null, sel.DisplayName, node), {
													logicalParentNode: node,
													mightHaveChildren: false,
													onlyStructural: true,
													isVirtual: true,
													selector: {
														actionList: [{
															toolTip: $translate.instant('basics.common.fieldSelector.selectDynField'),
															icon: 'tlb-icons ico-settings',
															callbackFn: function () {
																return selectorUiService.selectItem().then(function (selId) {
																	const newFields = {};
																	newFields[sel.Id] = [selId];
																	return that.contextProvider.addDynamicFields(newFields, true).then(function (anyChanges) {
																		if (anyChanges) {
																			storedSelectorInfo.updateTreeNodes();
																		}
																	});
																});
															}
														}]
													}
												});
												storedSelectorInfo.treeNodes.push(selNode);
												storedSelectorInfo.updateTreeNodes();
												return selNode;
											}) : [];

											nodes = _.concat(nodes, categoryNodes, selectorNodes);

											nodes.forEach(node => {
												if(that.propsById[node.id]) {
													_.merge(that.propsById[node.id], node);
												}
											});

											if (completionPromises.length > 0) {
												return $q.all(completionPromises).then(() => nodes);
											}

											return nodes;
										});
									},
									prepareNodeDataForId: function (id) {
										// sanitize path
										if (that.contextProvider) {
											id = that.contextProvider.normalizePath(id);
										}

										const prepRequestParams = {
											tableName: config.focusTableName,
											maxDepth: 1,
											alongPath: id,
											moduleName: config.moduleName
										};
										that.applyTypeRestrictionsToRequest(prepRequestParams);

										return $http.get(globals.webApiBaseUrl + 'basics/common/bulkexpr/schema/entityfieldshierarchically', {
											params: prepRequestParams
										}).then(function (response) {
											if (_.isArray(response.data) && (response.data.length > 0)) {
												response.data.forEach(function (entityInfo) {
													if (!that.entitiesById[entityInfo.Id]) {
														that.entitiesById[entityInfo.Id] = entityInfo;
													}
												});
											}
											return id;
										});
									}
								}).then(function () {
									// only if no restrictions are set
									let subentityPromise = $q.when(true);
									const restrictionArray = [that.targetId, that.uiTypeId, that.targetTableName, that.targetKind];
									const withoutRestrictions = _.every(restrictionArray, function (value) {
										return _.isNull(value) || _.isUndefined(value);
									});
									if (withoutRestrictions) {
										subentityPromise = that.contextProvider.initializeSubentities(instance);
									}
									subentityPromise.then(function () {
										that.isInitialized = true;
									});
								});
							} else {
								that.isInitialized = true;
								return $q.resolve();
							}
						});
					},
					cancelCurrentSearchRequest: function () {
					},
					applyTypeRestrictionsToRequest: function (requestParams) {
						const els = {};
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
						const restrictionElements = _.map(Object.keys(els), function (key) {
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

		function DdSchemaGraphProvider(config) {
			basicsCommonSchemaGraphService.SchemaGraphProvider.call(this, config);

			const actualConfig = _.assign({
				uiType: null,
				targetKind: null,
				targetId: null
			}, _.isObject(config) ? config : {});

			if (!_.isString(actualConfig.focusTableName) && !_.isString(actualConfig.moduleName)) {
				throw new Error('Neither focus table nor module name specified.');
			}

			const state = getState(this);
			state.initialize(actualConfig);
		}

		DdSchemaGraphProvider.prototype = Object.create(basicsCommonSchemaGraphService.SchemaGraphProvider.prototype);
		DdSchemaGraphProvider.prototype.constructor = DdSchemaGraphProvider;

		service.DdSchemaGraphProvider = DdSchemaGraphProvider;

		DdSchemaGraphProvider.prototype.findFields = function (searchText) {
			let state;

			function resetSearchRequestCanceler() {
				state.cancelCurrentSearchRequest = function () {
				};
			}

			state = getState(this);
			if (!state.isInitialized) {
				return null;
			}

			if (_.isEmpty(searchText)) {
				this.storeSearchResults([]);
				return $q.when(0);
			}

			state.cancelCurrentSearchRequest();

			const searchRequestCanceler = $q.defer();
			state.cancelCurrentSearchRequest = function () {
				searchRequestCanceler.resolve();
				resetSearchRequestCanceler();
			};

			const requestParams = {
				originTableName: state.focusTableName,
				searchText: searchText,
				moduleName: state.moduleName
			};
			state.applyTypeRestrictionsToRequest(requestParams);

			const that = this;
			return $http.get(globals.webApiBaseUrl + 'basics/common/bulkexpr/schema/findfields', {
				params: requestParams,
				timeout: searchRequestCanceler.promise
			}).then(function (response) {
				resetSearchRequestCanceler();
				const results = _.map(response.data, function (sr) {
					const fullId = (_.isEmpty(sr.Path.Path) ? '' : (sr.Path.Path + '.')) + sr.Field.DdPath;
					return _.assign(new basicsCommonSchemaGraphService.SchemaGraphNode(fullId, sr.Field.UiTypeId, sr.Field.TargetId, sr.Field.Name, null, sr.Field.UiTypeId === 'lookup', sr.Field.isForeignKey), {
						isNullable: !!sr.Field.IsNullable,
						mightHaveChildren: false,
						path: formatDdPath(sr.Path),
						targetKind: sr.Field.TargetKind
					});
				});
				that.storeSearchResults(results);
				return results.length;
			}, function (reason) {
				resetSearchRequestCanceler();
				return $q.reject(reason);
			});
		};

		DdSchemaGraphProvider.prototype.getDisplayNameForItem = function (id) {
			if (_.isString(id)) {
				const state = getState(this);
				/*
				let subentityLabels;
				if (id.includes('*')) {
					subentityLabels = state.contextProvider.extractLabelsFromPath(id);
					id = state.contextProvider.sanitizePath(id);
				} */

				return $http.get(globals.webApiBaseUrl + 'basics/common/bulkexpr/schema/pathlabels', {
					params: {
						originTableName: state.focusTableName,
						path: id,
						moduleName: state.moduleName
					}
				}).then(function (response) {
					const retrievalPromises = [];

					const pathSegments = id.split('.');
					response.data.PathLabels = _.map(pathSegments, function (segment, idx) {
						// always keep this regex the same as in DdPathConverter.cs
						const segmentMatch = segment.match(/^((?:.*[^0-9])?)([0-9]+)$/);
						if (segmentMatch) {
							switch (segmentMatch[1]) {
								case '*':
									return state.contextProvider.getSubEntityLabel(segmentMatch[2]);
								case '@':
									retrievalPromises.push(state.contextProvider.getAliasExpressionLabel(segmentMatch[2]).then(function (lbl) {
										response.data.PathLabels[idx] = lbl;
									}));
									return null;
							}
						}

						return response.data.PathLabels[idx];
					});

					let resultPromise = retrievalPromises.length > 0 ? $q.all(retrievalPromises) : $q.when();
					return resultPromise.then(function () {
						return {
							long: formatDdPath(response.data),
							short: formatDdPathShort(response.data)
						};
					});
				});
			} else {
				return $q.when('');
			}
		};

		DdSchemaGraphProvider.prototype.formatDisplayName = function (labelList) {
			return {
				long: formatDdPath(labelList),
				short: formatDdPathShort(labelList)
			};
		};

		DdSchemaGraphProvider.prototype.canSelectItem = function (item) {
			const state = getState(this);
			if (state.isInitialized) {
				if (state.targetId) {
					if ((item.targetId === state.targetId) && ((_.isEmpty(item.targetKind) && _.isEmpty(state.targetKind)) || (item.targetKind === state.targetKind))) {
						return true;
					}
				} else if (state.uiTypeId) {
					if (basicsCommonDataDictionaryTypeService.areUiTypesCompatible(item.uiTypeId, state.uiTypeId)) {
						return true;
					}
				} else {
					return !item.isRootItem && !item.onlyStructural;
				}
			}

			return false;
		};

		DdSchemaGraphProvider.prototype.fieldTypesMatch = function (f1, f2) {
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

		DdSchemaGraphProvider.prototype.isPartOfPath = function (id, paths, ignoreLeaves) {
			return _.isString(id) && _.some(_.filter(paths, _.isString), function (p) {
				return (!ignoreLeaves && (id === p)) || (id === '') || p.startsWith(id + '.');
			});
		};

		DdSchemaGraphProvider.prototype.isNodeBookmarked = function (id) {
			const state = getState(this);
			return !state.bookmarks || state.bookmarks.isBookmarked(id);
		};

		DdSchemaGraphProvider.prototype.supportsBookmarks = function () {
			const state = getState(this);
			return !state.bookmarks ? false : !state.bookmarks.isEmpty();
		};

		DdSchemaGraphProvider.prototype.supportsSubentities = function () {
			const state = getState(this);
			return !_.isUndefined(state.contextProvider);
		};

		DdSchemaGraphProvider.prototype.modifySubentities = function (subentities, mode) {
			const state = getState(this);

			switch (mode) {
				case 'create':
					return state.contextProvider.addEntities(subentities);
				case 'delete':
					state.contextProvider.removeEntities(_.map(subentities, 'id'));
					break;
				default:
				case 'get':
					if (subentities) {
						return state.contextProvider.retrieveEntities(_.map(subentities, 'id'));
					} else {
						return state.contextProvider.retrieveEntities();
					}
			}
		};

		DdSchemaGraphProvider.prototype.modifyAliasExpressions = function (items, mode) {
			const state = getState(this);

			switch (mode) {
				case 'create':
					return state.contextProvider.addAliasExpressions(items);
				case 'delete':
					state.contextProvider.removeAliasExpressions(_.map(items, 'id'));
					break;
				default:
				case 'get':
					if (items) {
						return state.contextProvider.retrieveAliasExpressions(_.map(items, 'id'));
					} else {
						return state.contextProvider.retrieveAliasExpressions();
					}
			}
		};

		DdSchemaGraphProvider.prototype.propsById = function (selectedId) {
			const state = getState(this);

			let id = selectedId.split('.').at(-1);

			return state.propsById[id];
		};


		DdSchemaGraphProvider.prototype.registerContentChanged = function (handler) {
			const state = getState(this);

			state.onContentChanged.register(handler);
		};

		DdSchemaGraphProvider.prototype.unregisterContentChanged = function (handler) {
			const state = getState(this);

			state.onContentChanged.unregister(handler);
		};

		DdSchemaGraphProvider.prototype.registerTreeChanged = function (handler) {
			const state = getState(this);

			state.onTreeChanged.register(handler);
		};

		DdSchemaGraphProvider.prototype.unregisterTreeChanged = function (handler) {
			const state = getState(this);

			state.onTreeChanged.unregister(handler);
		};

		DdSchemaGraphProvider.prototype.showTranslationContainerForSearchEnhanced = true;

		return service;
	}
})(angular);
