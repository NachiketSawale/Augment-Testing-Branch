/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.evaluation.modelEvaluationRulesetFilterService
	 * @function
	 *
	 * @description Provides a model filter implementation that takes its results from rule sets.
	 */
	angular.module('model.evaluation').factory('modelEvaluationRulesetFilterService',
		modelEvaluationRulesetFilterService);

	modelEvaluationRulesetFilterService.$inject = ['_', 'modelViewerFilterDefinitionService',
		'modelViewerModelSelectionService', 'modelViewerModelIdSetService',
		'modelViewerObjectTreeService', 'modelViewerObjectIdMapService',
		'modelEvaluationRulesetResultCacheService'];

	function modelEvaluationRulesetFilterService(_, modelViewerFilterDefinitionService,
		modelViewerModelSelectionService, modelViewerModelIdSetService,
		modelViewerObjectTreeService, modelViewerObjectIdMapService,
		modelEvaluationRulesetResultCacheService) {

		const service = {};

		function RulesetFilter(rulesetId, hlSchemeId) {
			const that = this;

			modelViewerFilterDefinitionService.LazyFilter.call(this, function evaluateRulesetFilter(resultController) {
				const modelId = modelViewerModelSelectionService.getSelectedModelId();
				const treeInfo = modelViewerObjectTreeService.getTree();
				if (treeInfo) {
					return modelEvaluationRulesetResultCacheService.getResults(modelId, rulesetId, hlSchemeId).then(function applyRulesetFilterResults(rawResults) {
						let result = new modelViewerModelIdSetService.MultiModelIdSet();
						let infoMap = new modelViewerModelIdSetService.MultiModelIdSet();
						rawResults.forEach(function applyRulesetFilterResultsForGroup(idGroup) {
							// TODO: optimize by switching order?
							let idGroupIds = modelViewerModelIdSetService.createFromCompressedStringWithMaps(idGroup.ids, idGroup.hli).useSubModelIds();
							result = result.assign(idGroupIds);

							idGroupIds = modelViewerModelIdSetService.createFromCompressedStringWithMaps(idGroup.ids, idGroup.rs + '/' + idGroup.r).useSubModelIds();
							infoMap = infoMap.assign(idGroupIds);
						});
						that._infoMap = infoMap;

						modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
							const modelTreeInfo = treeInfo[subModelId];
							const modelResult = result[subModelId];
							if (modelResult) {
								modelTreeInfo.allMeshIds().forEach(function (meshId) {
									if (_.isNil(modelResult[meshId])) {
										modelResult[meshId] = null;
									}
								});
							} else {
								result[subModelId] = new modelViewerObjectIdMapService.ObjectIdMap(modelTreeInfo.allMeshIds(), null);
							}
						});

						resultController.updateMeshStates(result, true);
					}, function rulesetEvaluationFailed() {
						if (treeInfo) {
							const emptyResults = modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
								const modelTreeInfo = treeInfo[subModelId];
								return new modelViewerObjectIdMapService.ObjectIdMap(modelTreeInfo.allMeshIds(), null);
							});
							resultController.updateMeshStates(emptyResults);
						}
					});
				}
			});

			this._rulesetId = rulesetId;
			this._hlSchemeId = hlSchemeId;
		}

		RulesetFilter.prototype = Object.create(modelViewerFilterDefinitionService.LazyFilter.prototype);
		RulesetFilter.prototype.constructor = RulesetFilter;

		RulesetFilter.prototype.usesDynamicHighlightingSchemes = function () {
			return true;
		};

		RulesetFilter.prototype.getHighlightingSchemeIds = function () {
			return [{
				isDynamic: true,
				id: this._hlSchemeId
			}];
		};

		RulesetFilter.prototype.dependsOnRuleset = function (rulesetId) {
			return _.isNil(rulesetId) ? true : (rulesetId === this._rulesetId);
		};

		RulesetFilter.prototype.getDescriptors = function () {
			return [{
				type: 'ruleset',
				rulesetId: this._rulesetId,
				HighlightingSchemeFk: this._hlSchemeId
			}];
		};

		RulesetFilter.prototype.countByMeshInfoGroup = function () {
			if (!this._infoMap) {
				return {};
			}

			return this._infoMap.countByValue();
		};

		RulesetFilter.prototype.getByMeshInfoGroup = function (groupIds) {
			if (!this._infoMap) {
				return new modelViewerModelIdSetService.MultiModelIdSet();
			}

			return this._infoMap.normalizeToMaps(null, function (v) {
				return _.includes(groupIds, v);
			});
		};

		service.getFilter = function (rulesetId, hlSchemeId) {
			return new RulesetFilter(rulesetId, hlSchemeId);
		};

		return service;
	}
})(angular);
