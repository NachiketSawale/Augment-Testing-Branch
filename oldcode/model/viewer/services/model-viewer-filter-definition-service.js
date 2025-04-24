/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerFilterDefinitionService
	 * @function
	 *
	 * @description Contains (base) classes for model object filters.
	 */
	angular.module('model.viewer').factory('modelViewerFilterDefinitionService', ['$q', 'modelViewerModelIdSetService',
		'modelViewerObjectIdMapService', 'modelViewerModelSelectionService', 'modelViewerObjectTreeService',
		'_', '$translate', '$log',
		function ($q, modelViewerModelIdSetService, modelViewerObjectIdMapService, modelViewerModelSelectionService,
		          modelViewerObjectTreeService, _, $translate, $log) {
			var service = {};

			// FilterAccessor ----------------------------------------------------------------

			function FilterResultController(filter) {
				if (!filter) {
					throw new Error('No filter supplied for FilterResult.');
				}

				this._owner = filter;
			}

			FilterResultController.prototype.excludeAll = function () {
				var state = getState(this._owner);
				state.excludeAll();
			};

			FilterResultController.prototype.updateMeshStates = function (meshStates, doInvalidateAll) {
				var state = getState(this._owner);
				state.updateMeshStates(meshStates, doInvalidateAll);
			};

			FilterResultController.prototype.setIncludedMeshIds = function (meshIds) {
				var state = getState(this._owner);
				state.setIncludedMeshIds(meshIds);
			};

			FilterResultController.prototype.updateMeshHints = function (meshHints) {
				var state = getState(this._owner);
				state.updateMeshHints(meshHints);
			};

			// InternalFilterState ----------------------------------------------------------------

			function InternalFilterState(filter) {
				this._owner = filter;
				this._modelId = null;
				this._meshStates = null;
				this._meshHints = null;
				this._allExcluded = null;
				this._users = [];
				this.updateForModelIfRequired();
				this._suspendedCount = 0;
				this._lockCount = 0;
			}

			InternalFilterState.prototype.updateForModelIfRequired = function () {
				var selModel = modelViewerModelSelectionService.getSelectedModel();
				if (!selModel) {
					this._modelId = null;
					return true;
				}

				var that = this;

				if (this._modelId !== selModel.info.modelId) {
					var treeInfo = modelViewerObjectTreeService.getTree();
					this._meshStates = modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						var idMap = new modelViewerObjectIdMapService.ObjectIdMap();
						if (that._owner.usesDynamicHighlightingSchemes()) {
							that._allExcluded = null;
						} else {
							var modelTreeInfo = treeInfo[subModelId];
							idMap.addFromArray(modelTreeInfo.allMeshIds(), 'e');
							that._allExcluded = true;
						}
						return idMap;
					});
					this._meshHints = null;
					this._owner.updateForModel();
					this._modelId = selModel.info.modelId;
					return true;
				}

				return false;
			};

			InternalFilterState.prototype.excludeAll = function () {
				if (this._lockCount > 0) {
					return;
				}

				if (this._owner.usesDynamicHighlightingSchemes()) {
					throw new Error('Cannot exclude items based on a dynamic highlighting scheme.');
				} else {
					if (modelViewerModelSelectionService.getSelectedModelId()) {
						var treeInfo = modelViewerObjectTreeService.getTree();
						this._meshStates = modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
							var idMap = new modelViewerObjectIdMapService.ObjectIdMap();
							var modelTreeInfo = treeInfo[subModelId];
							idMap.addFromArray(modelTreeInfo.allMeshIds(), 'e');
							return idMap;
						});
						this._allExcluded = true;

						this._users.forEach(function invalidateAllMeshesForUser(user) {
							user.invalidateAllMeshes();
						});
					}
				}
			};

			// Updates the flag that indicates whether all meshes are excluded and returns a value that indicates
			// whether a full invalidation is required.
			function updateAllExcludedState(foundNonExcluded) {
				var that = this; // jshint ignore:line
				if (!that._owner.usesDynamicHighlightingSchemes()) {
					if (that._allExcluded) {
						if (foundNonExcluded) {
							that._allExcluded = false;
							return true;
						}
					} else {
						if (!foundNonExcluded) {
							if (Object.keys(that._meshStates).every(function (subModelId) {
								var persistedModelMeshStates = that._meshStates[parseInt(subModelId)];
								return Object.keys(persistedModelMeshStates).every(function (meshId) {
									return persistedModelMeshStates[parseInt(meshId)] === 'e';
								});
							})) {
								that._allExcluded = true;
								return true;
							}
						}
					}
				}
				return false;
			}

			InternalFilterState.prototype.updateMeshStates = function (meshStates, doInvalidateAll) {
				if (this._lockCount > 0) {
					return;
				}

				if (!_.isObject(meshStates)) {
					throw new Error('No mesh states supplied.');
				}

				var that = this;
				if (modelViewerModelSelectionService.getSelectedModelId()) {
					var foundNonExcluded = false;
					var changedMeshIds = modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						var modelChangedMeshIds = [];

						var modelMeshStates = meshStates[subModelId];
						var persistedModelMeshStates = that._meshStates[subModelId];
						if (_.isObject(modelMeshStates)) {
							Object.keys(modelMeshStates).forEach(function (meshId) {
								meshId = parseInt(meshId);
								var newVal = modelMeshStates[meshId];
								if (persistedModelMeshStates[meshId] !== newVal) {
									persistedModelMeshStates[meshId] = newVal;
									modelChangedMeshIds.push(meshId);
									foundNonExcluded |= (newVal !== 'e');
								}
							});
						}

						return modelChangedMeshIds;
					});

					var invalidateAll = Boolean(doInvalidateAll) || updateAllExcludedState.call(this, foundNonExcluded);

					this._users.forEach(function invalidateMeshIdsForUser(user) {
						if (invalidateAll) {
							user.invalidateAllMeshes();
						} else {
							user.invalidateMeshIds(changedMeshIds);
						}
					});
				}
			};

			InternalFilterState.prototype.setIncludedMeshIds = function (meshIds) {
				if (this._lockCount > 0) {
					return;
				}

				if (!_.isObject(meshIds)) {
					throw new Error('No mesh IDs supplied.');
				}

				if (this._owner.usesDynamicHighlightingSchemes()) {
					throw new Error('Cannot include items based on a dynamic highlighting scheme.');
				} else {
					if (modelViewerModelSelectionService.getSelectedModelId()) {
						var foundNonExcluded = false;
						var that = this;
						var treeInfo = modelViewerObjectTreeService.getTree();
						var changedMeshIds = modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
							var modelChangedMeshIds = [];

							var persistedModelMeshStates = that._meshStates[subModelId];
							var modelMeshIds = meshIds[subModelId];
							var modelTreeInfo = treeInfo[subModelId];

							if (_.isArray(modelMeshIds)) {
								var modelMeshIdsObject = {};
								modelMeshIds.forEach(function (meshId) {
									modelMeshIdsObject[meshId] = true;
								});
								modelMeshIds = modelMeshIdsObject;
							}

							if (_.isObject(modelMeshIds)) {
								modelTreeInfo.allMeshIds().forEach(function (meshId) {
									if (modelMeshIds[meshId]) {
										foundNonExcluded = true;
										if (persistedModelMeshStates[meshId] !== 'i') {
											persistedModelMeshStates[meshId] = 'i';
											modelChangedMeshIds.push(meshId);
										}
									} else {
										if (persistedModelMeshStates[meshId] !== 'e') {
											persistedModelMeshStates[meshId] = 'e';
											modelChangedMeshIds.push(meshId);
										}
									}
								});
							} else {
								modelTreeInfo.allMeshIds().forEach(function (meshId) {
									if (persistedModelMeshStates[meshId] !== 'e') {
										persistedModelMeshStates[meshId] = 'e';
										modelChangedMeshIds.push(meshId);
									}
								});
							}

							return modelChangedMeshIds;
						});

						var invalidateAll = updateAllExcludedState.call(this, foundNonExcluded);

						this._users.forEach(function invalidateMeshIdsForUser(user) {
							if (invalidateAll) {
								user.invalidateAllMeshes();
							} else {
								user.invalidateMeshIds(changedMeshIds);
							}
						});
					}
				}
			};

			InternalFilterState.prototype.updateMeshHints = function (meshHints) {
				if (!_.isObject(meshHints)) {
					throw new Error('No mesh hints supplied.');
				}

				var that = this;
				if (modelViewerModelSelectionService.getSelectedModelId()) {
					if (!_.isObject(that._meshHints)) {
						that._meshHints = new modelViewerModelIdSetService.MultiModelIdSet();
					}

					var changedMeshIds = modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						var modelChangedMeshIds = [];

						var modelMeshHints = meshHints[subModelId];
						if (_.isObject(modelMeshHints)) {
							var persistedModelMeshHints = that._meshHints[subModelId];
							if (!_.isObject(persistedModelMeshHints)) {
								that._meshHints[subModelId] = new modelViewerObjectIdMapService.ObjectIdMap();
							}

							Object.keys(modelMeshHints).forEach(function (meshId) {
								meshId = parseInt(meshId);
								persistedModelMeshHints[meshId] = modelMeshHints[meshId];
								modelChangedMeshIds.push(meshId);
							});
						}

						return modelChangedMeshIds;
					});

					this._users.forEach(function invalidateMeshIdsForUser(user) {
						user.invalidateMeshIds(changedMeshIds);
					});
				}
			};

			// Filter ----------------------------------------------------------------

			function initializeHighlightingSettings(usesDynamicSchemes) {
				if (!usesDynamicSchemes) {
					return {
						specialEmptyResultSetTreatment: true
					};
				} else {
					return {};
				}
			}

			var stateProperty = '__pvtFilterState';

			function getState(filter) {
				var result = filter[stateProperty];
				if (!result) {
					result = filter[stateProperty] = new InternalFilterState(filter);
				}
				return result;
			}

			function Filter() {
				this.highlightingSettings = initializeHighlightingSettings(this.usesDynamicHighlightingSchemes());
			}

			service.Filter = Filter;

			Filter.prototype.updateForModel = function () {
			};

			Filter.prototype.prepareMeshStates = function () {
				var state = getState(this);
				return $q.when(state.updateForModelIfRequired());
			};

			Filter.prototype.getMeshStates = function (includeIdMap) {
				var state = getState(this);
				var that = this;

				if (_.isObject(includeIdMap)) {
					return (function returnMeshStatesExcerpt() {
						var useGeneralState = !that.usesDynamicHighlightingSchemes() && state._allExcluded && that.highlightingSettings.specialEmptyResultSetTreatment;

						var hintsResult = new modelViewerModelIdSetService.MultiModelIdSet();
						var result = modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
							var modelResult = new modelViewerObjectIdMapService.ObjectIdMap();
							var modelHintsResult = new modelViewerObjectIdMapService.ObjectIdMap();

							var modelHints = _.isObject(state._meshHints) ? state._meshHints[subModelId] : null;
							var modelIncludeIdMap = includeIdMap[subModelId];
							var modelMeshStates = state._meshStates[subModelId];
							if (_.isArray(modelIncludeIdMap)) {
								modelIncludeIdMap.forEach(function (meshId) {
									modelResult[meshId] = useGeneralState ? '0' : modelMeshStates[meshId];

									var hint = _.isObject(modelHints) ? modelHints[meshId] : null;
									if (_.isObject(hint)) {
										modelHintsResult[meshId] = hint;
									}
								});
							} else if (_.isObject(modelIncludeIdMap)) {
								Object.keys(modelIncludeIdMap).forEach(function (meshId) {
									meshId = parseInt(meshId);
									if (modelIncludeIdMap[meshId]) {
										modelResult[meshId] = useGeneralState ? '0' : modelMeshStates[meshId];

										var hint = _.isObject(modelHints) ? modelHints[meshId] : null;
										if (_.isObject(hint)) {
											modelHintsResult[meshId] = hint;
										}
									}
								});
							}

							hintsResult[subModelId] = modelHintsResult;
							return modelResult;
						});

						result.hints = hintsResult;
						return result;
					})();
				} else {
					return (function returnAllMeshStates() {
						var result;
						if (!that.usesDynamicHighlightingSchemes() && state._allExcluded && that.highlightingSettings.specialEmptyResultSetTreatment) {
							var treeInfo = modelViewerObjectTreeService.getTree();
							result = modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
								var modelTreeInfo = treeInfo[subModelId];
								return new modelViewerObjectIdMapService.ObjectIdMap(modelTreeInfo.allMeshIds(), '0');
							});
						} else {
							result = _.clone(state._meshStates);
						}
						result.hints = state._meshHints;
						return result;
					})();
				}
			};

			Filter.prototype.suspendUpdates = function () {
				var state = getState(this);
				state._suspendedCount++;
			};

			Filter.prototype.resumeUpdates = function () {
				var state = getState(this);
				if (state._suspendedCount > 0) {
					state._suspendedCount--;
					//if (state._suspendedCount === 0) {
					// TODO: somehow trigger an update process again (?)
					//}
				} else {
					throw new Error('Filter updates have not been suspended.');
				}
			};

			Filter.prototype.lock = function () {
				var state = getState(this);
				state._lockCount++;
			};

			Filter.prototype.unlock = function () {
				var state = getState(this);
				if (state._lockCount > 0) {
					state._lockCount--;
				} else {
					$log.warn('WARNING: The filter has not been locked.');
				}
			};

			Filter.prototype.usesDynamicHighlightingSchemes = function () {
				return false;
			};

			Filter.prototype.registerUser = function (user) {
				var state = getState(this);
				state._users.push(user);
			};

			Filter.prototype.unregisterUser = function (user) {
				var state = getState(this);
				var idx = state._users.indexOf(user);
				if (idx >= 0) {
					state._users.splice(idx, 1);
				}
			};

			Filter.prototype.update = function () {
				var state = getState(this);

				var executionPromises = _.map(state._users, function (user) {
					return user.applyFilter(true);
				});
				return $q.all(executionPromises);
			};

			Filter.prototype.getHighlightingSchemeIds = function (defaultStaticHlSchemeId) {
				return [{
					isDynamic: this.usesDynamicHighlightingSchemes(),
					id: this.usesDynamicHighlightingSchemes() ? null : defaultStaticHlSchemeId
				}];
			};

			Filter.prototype.getUserFacade = function () {
				var state = getState(this);
				if (!_.isObject(state._userFacade)) {
					state._userFacade = {
						applyFilter: function () {
							var executionPromises = _.map(state._users, function applyFilterForUser(user) {
								return user.applyFilter();
							});
							return $q.all(executionPromises);
						},
						invalidateAllMeshes: function () {
							state._users.forEach(function invalidateAllMeshesForUser(user) {
								user.invalidateAllMeshes();
							});
						},
						invalidateMeshIds: function (meshIds) {
							state._users.forEach(function invalidateMeshIdsForUser(user) {
								user.invalidateMeshIds(meshIds);
							});
						}
					};
				}

				return state._userFacade;
			};

			Filter.prototype.countByMeshState = function (includeAllStates, verboseStateNames) {
				var state = getState(this);
				var result = state._meshStates.countByValue();
				if (includeAllStates) {
					['0', 'i', 'e', '+', '-', '~', 't', 'b', 'c', 'n', '%', '1', '2', '3', '4', '5', '6'].forEach(function (stateId) {
						if (!_.isNumber(result[stateId])) {
							result[stateId] = 0;
						}
					});
				}
				if (verboseStateNames) {
					var verboseResult = {};
					Object.keys(result).forEach(function (key) {
						var verboseKey = (function () {
							switch (key) {
								case '0':
									return 'onlyExcluded';
								case 'i':
									return 'included';
								case 'e':
									return 'excluded';
								case '+':
									return 'appearing';
								case '-':
									return 'disappearing';
								case '~':
									return 'modified';
								case 't':
									return 'temporary';
								case 'b':
									return 'blacklisted';
								case 'c':
									return 'completed';
								case 'n':
									return 'notStarted';
								case '%':
									return 'partiallyCompleted';
								case '1':
									return 'completedBeforeRP';
								case '2':
									return 'completedDuringRP';
								case '3':
									return 'partiallyCompletedInRP';
								case '4':
									return 'notStartedInRP';
								case '5':
									return 'notScheduledForRP';
								case '6':
									return 'DelayedInRP';
								default:
									return null;
							}
						})();
						if (_.isString(verboseKey)) {
							verboseResult[verboseKey] = result[key];
						}
					});
					result = verboseResult;
				}
				return result;
			};

			Filter.prototype.countByMeshInfoGroup = function () {
				return this.countByMeshState(false, false);
			};

			Filter.prototype.getByMeshInfoGroup = function (groupIds) {
				var state = getState(this);
				return state._meshStates.normalizeToMaps(null, function (v) {
					return _.includes(groupIds, v);
				});
			};

			Filter.prototype.getStateDescArguments = function () {
				return {};
			};

			Filter.prototype.getStateDesc = function () {
				return $translate.instant(this.translationKeyRoot + '.stateDesc', this.getStateDescArguments());
			};

			Filter.prototype.getDescriptors = function () {
				if (_.isString(this.id)) {
					return [{
						type: 'filter',
						filterId: this.id
					}];
				} else {
					throw new Error('This function must be overridden by a subclass.');
				}
			};

			Filter.prototype.getDisplayName = function () {
				return $translate.instant(this.translationKeyRoot + '.command');
			};

			Filter.prototype.dependsOnRuleset = function (/*rulesetId*/) {
				return false;
			};

			Filter.prototype.getIconClass = function () {
				return 'control-icons ico-filter-on';
			};

			// EagerFilter ----------------------------------------------------------------

			function EagerFilter() {
				Filter.call(this);

				this._resultController = new FilterResultController(this);
			}

			EagerFilter.prototype = Object.create(Filter.prototype);
			EagerFilter.prototype.constructor = EagerFilter;

			service.EagerFilter = EagerFilter;

			EagerFilter.prototype.getResultController = function () {
				return this._resultController;
			};

			// LazyFilter ----------------------------------------------------------------

			function LazyFilter(updateFunc) {
				if (!_.isFunction(updateFunc)) {
					throw new Error('No update function supplied.');
				}

				Filter.call(this);

				var state = getState(this);
				state._updateFunc = updateFunc;
			}

			LazyFilter.prototype = Object.create(Filter.prototype);
			LazyFilter.prototype.constructor = LazyFilter;

			service.LazyFilter = LazyFilter;

			LazyFilter.prototype.prepareMeshStates = function (forceReEvaluation) {
				var that = this;
				var state = getState(that);

				if (!state.lazyPreparationPromise) {
					var promise = Filter.prototype.prepareMeshStates.call(this).then(function meshStatesPrepared(requiresReEvaluation) {
						if (!state.skipReEvaluation || requiresReEvaluation || forceReEvaluation) {
							var updateFunc = state._updateFunc;
							return $q.when(updateFunc(new FilterResultController(that))).then(function (result) {
								state.skipReEvaluation = true;
								return result;
							});
						} else {
							return $q.resolve();
						}
					}).then(function () {
						if (state.lazyPreparationPromise === promise) {
							state.lazyPreparationPromise = null;
						}
					});
					state.lazyPreparationPromise = promise;
				}
				return state.lazyPreparationPromise;
			};

			LazyFilter.prototype.update = function () {
				var state = getState(this);
				state.skipReEvaluation = false;
				state.lazyPreparationPromise = null;

				return Filter.prototype.update.apply(this, arguments);
			};

			return service;
		}]);
})(angular);
