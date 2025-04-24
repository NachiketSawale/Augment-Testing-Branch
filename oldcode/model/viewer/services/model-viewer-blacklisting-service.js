/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerBlacklistingService
	 * @function
	 *
	 * @description Provides an object for managing a blacklist of model elements.
	 */
	angular.module('model.viewer').factory('modelViewerBlacklistingService',
		modelViewerBlacklistingService);

	modelViewerBlacklistingService.$inject = ['_', 'modelViewerFilterDefinitionService',
		'modelViewerModelSelectionService', 'modelViewerObjectIdMapService',
		'modelViewerObjectTreeService'];

	function modelViewerBlacklistingService(_, modelViewerFilterDefinitionService,
		modelViewerModelSelectionService, modelViewerObjectIdMapService,
		modelViewerObjectTreeService) {

		const service = {};

		function BlacklistFilter() {
			modelViewerFilterDefinitionService.EagerFilter.call(this);
		}

		BlacklistFilter.prototype = Object.create(modelViewerFilterDefinitionService.EagerFilter.prototype);
		BlacklistFilter.prototype.constructor = BlacklistFilter;

		BlacklistFilter.prototype.usesDynamicHighlightingSchemes = function () {
			return true;
		};

		function getState(blacklist) {
			let result = blacklist._rib$blacklistState;
			if (!_.isObject(result)) {
				result = blacklist._rib$blacklistState = {
					filter: new BlacklistFilter()
				};
			}
			return result;
		}

		function Blacklist() {
		}

		service.Blacklist = Blacklist;

		Blacklist.prototype.registerUser = function (user) {
			const state = getState(this);
			state.filter.registerUser(user);
		};

		Blacklist.prototype.unregisterUser = function (user) {
			const state = getState(this);
			state.filter.unregisterUser(user);
		};

		Blacklist.prototype.prepare = function () {
			const state = getState(this);
			return state.filter.prepareMeshStates();
		};

		Blacklist.prototype.getState = function (meshIds) {
			const state = getState(this);
			return state.filter.getMeshStates(meshIds);
		};

		Blacklist.prototype.excludeAll = function () {
			const state = getState(this);
			const treeInfo = modelViewerObjectTreeService.getTree();
			const meshIdMap = modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
				const modelMeshIdMap = new modelViewerObjectIdMapService.ObjectIdMap();
				const modelTreeInfo = treeInfo[subModelId];
				modelTreeInfo.allMeshIds().forEach(function (meshId) {
					modelMeshIdMap[meshId] = false;
				});
				return modelMeshIdMap;
			});
			state.filter.getResultController().updateMeshStates(meshIdMap);
		};

		Blacklist.prototype.includeMeshIds = function (meshIds) {
			const meshIdMap = modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
				const modelMeshIds = meshIds[subModelId];
				let modelMeshIdMap = null;
				if (_.isArray(modelMeshIds)) {
					modelMeshIdMap = new modelViewerObjectIdMapService.ObjectIdMap();
					modelMeshIds.forEach(function (meshId) {
						modelMeshIdMap[meshId] = true;
					});
				} else if (_.isObject(modelMeshIds)) {
					modelMeshIdMap = new modelViewerObjectIdMapService.ObjectIdMap();
					Object.keys(modelMeshIds).forEach(function (meshId) {
						meshId = parseInt(meshId);
						modelMeshIdMap[meshId] = true;
					});
				}
				return modelMeshIdMap;
			});

			const state = getState(this);
			state.filter.getResultController().updateMeshStates(meshIdMap);
		};

		Blacklist.prototype.includeAllExceptMeshIds = function (excludedMeshIds) {
			const treeInfo = modelViewerObjectTreeService.getTree();
			const meshIdMap = modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
				const modelMeshIdMap = new modelViewerObjectIdMapService.ObjectIdMap();

				let modelExcludedMeshIds = excludedMeshIds[subModelId];
				if (_.isArray(modelExcludedMeshIds)) {
					const newModelExcludedMeshIds = {};
					modelExcludedMeshIds.forEach(function (meshId) {
						meshId = parseInt(meshId);
						newModelExcludedMeshIds[meshId] = true;
					});
					modelExcludedMeshIds = newModelExcludedMeshIds;
				} else if (!_.isObject(modelExcludedMeshIds)) {
					modelExcludedMeshIds = {};
				}

				const modelTreeInfo = treeInfo[subModelId];
				modelTreeInfo.allMeshIds().forEach(function (meshId) {
					modelMeshIdMap[meshId] = !modelExcludedMeshIds[meshId];
				});

				return modelMeshIdMap;
			});

			const state = getState(this);
			state.filter.getResultController().updateMeshStates(meshIdMap);
		};

		Blacklist.prototype.createFacade = function () {
			const that = this;
			return {
				excludeAll: function () {
					return that.excludeAll();
				},
				includeMeshIds: function (meshIds) {
					return that.includeMeshIds(meshIds);
				},
				includeAllExceptMeshIds: function (excludedMeshIds) {
					return that.includeAllExceptMeshIds(excludedMeshIds);
				},
				getMeshIds: function () {
					return that.prepare().then(function () {
						return that.getState();
					});
				}
			};
		};

		return service;
	}
})(angular);
