/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerCombinedFilterService
	 * @function
	 *
	 * @description Can create combined filter objects.
	 */
	angular.module('model.viewer').factory('modelViewerCombinedFilterService',
		modelViewerCombinedFilterService);

	modelViewerCombinedFilterService.$inject = ['_', '$q', 'modelViewerModelSelectionService',
		'modelViewerModelIdSetService', 'modelViewerObjectIdMapService',
		'modelViewerObjectTreeService', 'modelViewerFilterDefinitionService',
		'modelEvaluationRulesetFilterService', 'modelViewerStandardFilterService',
		'modelSimulationFilterService', 'platformCollectionUtilitiesService'];

	function modelViewerCombinedFilterService(_, $q, modelViewerModelSelectionService,
		modelViewerModelIdSetService, modelViewerObjectIdMapService,
		modelViewerObjectTreeService, modelViewerFilterDefinitionService,
		modelEvaluationRulesetFilterService, modelViewerStandardFilterService,
		modelSimulationFilterService, platformCollectionUtilitiesService) {

		const service = {};

		function CombinedFilter(config) {
			this.isCombinedFilter = true;
			this.translationKeyRoot = 'model.viewer.combinedFilter';

			const actualConfig = _.assign({}, config || {});
			if (!_.isArray(actualConfig.descriptors) || _.isEmpty(actualConfig.descriptors)) {
				actualConfig.descriptors = [{
					type: 'filter',
					filterId: 'disabled'
				}];
			}

			this._descriptors = actualConfig.descriptors;
			this._actualFilters = _.filter(_.map(actualConfig.descriptors, function (descriptor) {
				switch (descriptor.type) {
					case 'filter':
						return modelViewerStandardFilterService.getFilterById(descriptor.filterId, true);
					case 'simulation':
						return modelSimulationFilterService.getFilterByTimelineId(descriptor.timelineId);
					case 'ruleset':
						return modelEvaluationRulesetFilterService.getFilter(descriptor.rulesetId, descriptor.HighlightingSchemeFk);
					default:
						throw new Error('Unknown combined filter element type: ' + descriptor.type);
				}
			}), function (f) {
				return _.isObject(f);
			});
			this._hlSchemeIds = _.map(actualConfig.descriptors, function (descriptor) {
				return _.isNumber(descriptor.HighlightingSchemeFk) ? descriptor.HighlightingSchemeFk : null;
			});

			modelViewerFilterDefinitionService.Filter.call(this);

			this._userCount = 0;
		}

		CombinedFilter.prototype = Object.create(modelViewerFilterDefinitionService.Filter.prototype);
		CombinedFilter.prototype.constructor = CombinedFilter;

		function updateUserCount() {
			const that = this; // jshint ignore:line

			let userFacade;
			if (that._userCount === 1) {
				userFacade = that.getUserFacade();
				that._actualFilters.forEach(function (filter) {
					filter.registerUser(userFacade);
				});
			} else if (that._userCount === 0) {
				userFacade = that.getUserFacade();
				that._actualFilters.forEach(function (filter) {
					filter.unregisterUser(userFacade);
				});
			}
		}

		CombinedFilter.prototype.registerUser = function (user) {
			modelViewerFilterDefinitionService.Filter.prototype.registerUser.call(this, user);
			this._userCount++;
			updateUserCount.call(this);
		};

		CombinedFilter.prototype.unregisterUser = function (user) {
			modelViewerFilterDefinitionService.Filter.prototype.unregisterUser.call(this, user);
			this._userCount--;
			updateUserCount.call(this);
		};

		CombinedFilter.prototype.usesDynamicHighlightingSchemes = function () {
			return true;
		};

		CombinedFilter.prototype.getHighlightingSchemeIds = function (defaultStaticHlSchemeId) {
			const that = this;

			const result = [];
			this._actualFilters.forEach(function (filter, index) {
				let fallbackHlSchemeId = that._hlSchemeIds[index];
				if (!_.isNumber(fallbackHlSchemeId)) {
					fallbackHlSchemeId = defaultStaticHlSchemeId;
				}

				platformCollectionUtilitiesService.appendItems(result, filter.getHighlightingSchemeIds(fallbackHlSchemeId));
			});
			return result;
		};

		CombinedFilter.prototype.prepareMeshStates = function (forceReEvaluation) {
			return $q.all(_.map(this._actualFilters, function (filter) {
				return filter.prepareMeshStates(forceReEvaluation);
			}));
		};

		CombinedFilter.prototype.getMeshStates = function (includeIdMap) {
			let totalLayerCount = 0;
			const layers = _.map(this._actualFilters, function (filter) {
				const result = {
					states: filter.getMeshStates(includeIdMap)
				};

				const startIndex = totalLayerCount;
				if (result.states.isLayered) {
					result.getCopyFuncForSubModel = function (subModelId) {
						const modelStates = result.states[subModelId];
						if (_.isObject(modelStates)) {
							return function (meshId, destination) {
								const val = modelStates[meshId];
								if (_.isArray(val)) {
									for (let i = result.states.layerCount - 1; i >= 0; i--) {
										destination[startIndex + i] = val[i];
									}
								}
							};
						} else {
							return function () {
							};
						}
					};
					totalLayerCount += result.states.layerCount;
				} else {
					result.getCopyFuncForSubModel = function (subModelId) {
						const modelStates = result.states[subModelId];
						if (_.isObject(modelStates)) {
							return function (meshId, destination) {
								destination[startIndex] = modelStates[meshId];
							};
						} else {
							return function () {
							};
						}
					};
					totalLayerCount++;
				}

				return result;
			});

			layers.getFullCopyFuncForSubModel = function (subModelId) {
				const funcs = _.map(this, function (l) {
					return l.getCopyFuncForSubModel(subModelId);
				});
				return function (meshId, modelDestination) {
					const meshResult = [];
					for (let i = funcs.length - 1; i >= 0; i--) {
						funcs[i](meshId, meshResult);
					}
					modelDestination[meshId] = meshResult;
				};
			};

			const result = new modelViewerModelIdSetService.MultiModelIdSet();
			const hintsResult = new modelViewerModelIdSetService.MultiModelIdSet();

			if (_.isObject(includeIdMap)) {
				modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
					const modelIncludeIdMap = includeIdMap[subModelId];
					const modelResult = result[subModelId] = new modelViewerObjectIdMapService.ObjectIdMap();
					const copyFuncForSubModel = layers.getFullCopyFuncForSubModel(subModelId);

					if (_.isArray(modelIncludeIdMap)) {
						modelIncludeIdMap.forEach(function (meshId) {
							copyFuncForSubModel(meshId, modelResult);
						});
					} else if (_.isObject(modelIncludeIdMap)) {
						Object.keys(modelIncludeIdMap).forEach(function (meshId) {
							meshId = parseInt(meshId);
							copyFuncForSubModel(meshId, modelResult);
						});
					}
				});
			} else {
				const treeInfo = modelViewerObjectTreeService.getTree();
				modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
					const modelTreeInfo = treeInfo[subModelId];
					const modelResult = result[subModelId] = new modelViewerObjectIdMapService.ObjectIdMap();
					const copyFuncForSubModel = layers.getFullCopyFuncForSubModel(subModelId);

					modelTreeInfo.allMeshIds().forEach(function (meshId) {
						copyFuncForSubModel(meshId, modelResult);
					});
				});
			}

			result.isLayered = true;
			result.layerCount = totalLayerCount;
			result.hints = hintsResult;
			return result;
		};

		CombinedFilter.prototype.getDescriptors = function () {
			return _.cloneDeep(this._descriptors);
		};

		CombinedFilter.prototype.dependsOnRuleset = function (rulesetId) {
			return _.some(this._actualFilters, function (filter) {
				return filter.dependsOnRuleset(rulesetId);
			});
		};

		CombinedFilter.prototype.getIconClass = function () {
			return service.getFilterIconClass();
		};

		CombinedFilter.prototype.countByMeshInfoGroup = function () {
			return null;
		};

		CombinedFilter.prototype.getByMeshInfoGroup = function () {
			return new modelViewerModelIdSetService.MultiModelIdSet();
		};

		service.getFilterIconClass = function () {
			return 'tlb-icons ico-line-item-filter';
		};

		service.createFilter = function (config) {
			return new CombinedFilter(config);
		};

		return service;
	}
})(angular);
