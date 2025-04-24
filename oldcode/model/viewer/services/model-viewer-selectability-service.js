/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerSelectabilityService
	 * @function
	 *
	 * @description Manages information on whether or not certain meshes in models are selectable.
	 */
	angular.module('model.viewer').factory('modelViewerSelectabilityService', ['_', 'modelViewerModelSelectionService',
		'modelViewerObjectIdMapService',
		function (_, modelViewerModelSelectionService, modelViewerObjectIdMapService) {
			var selectabilityInfoProperty = 'rib$selectability';

			var service = {};

			function SelectabilityInfo() {
				this._modelId = null;
				this.prepare();
			}

			SelectabilityInfo.prototype.prepare = function () {
				var selModelId = modelViewerModelSelectionService.getSelectedModelId();
				if (selModelId !== this._modelId) {
					if (selModelId) {
						this._map = {
							meshes: modelViewerModelSelectionService.forEachSubModel(function () {
								return new modelViewerObjectIdMapService.ObjectIdMap();
							}),
							subModels: {}
						};
					} else {
						this._map = null;
					}
					this._modelId = selModelId;
				}
			};

			SelectabilityInfo.prototype.updateSelectabilityInfo = function (selectabilityMap) {
				if (!_.isObject(selectabilityMap)) {
					return;
				}

				var that = this;
				modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
					var modelSelectabilityMap = selectabilityMap[subModelId];
					if (modelSelectabilityMap) {
						var modelPersistedMap = that._map.meshes[subModelId];
						Object.keys(modelSelectabilityMap).forEach(function (meshId) {
							meshId = parseInt(meshId);
							modelPersistedMap[meshId] = !modelSelectabilityMap[meshId];
						});
					}
				});
			};

			SelectabilityInfo.prototype.isMeshSelectable = function (subModelId, meshId) {
				if (this._map) {
					if (!this._map.subModels[subModelId]) {
						var modelMap = this._map.meshes[subModelId];
						if (modelMap) {
							return !modelMap[meshId];
						}
					}
				}
				return false;
			};

			SelectabilityInfo.prototype.reduceToSelectableMeshIds = function (meshIds) {
				if (_.isObject(meshIds)) {
					var that = this;
					return modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						var modelResult = new modelViewerObjectIdMapService.ObjectIdMap();
						if (!that._map.subModels[subModelId]) {
							var modelPersistedMap = that._map.meshes[subModelId];
							var modelMeshIds = meshIds[subModelId];
							if (_.isArray(modelMeshIds)) {
								modelMeshIds.forEach(function (meshId) {
									if (!modelPersistedMap[meshId]) {
										modelResult[meshId] = true;
									}
								});
							} else if (_.isObject(modelMeshIds)) {
								Object.keys(modelMeshIds).forEach(function (meshId) {
									meshId = parseInt(meshId);
									if (!modelPersistedMap[meshId]) {
										modelResult[meshId] = true;
									}
								});
							}
						}
						return modelResult;
					});
				} else {
					return null;
				}
			};

			SelectabilityInfo.prototype.setSubModelSuppressed = function (subModelId, isSuppressed) {
				if (this._map) {
					this._map.subModels[subModelId] = !!isSuppressed;
				}
			};

			service.getSelectabilityInfo = function (owner) {
				var result = owner[selectabilityInfoProperty];
				if (!_.isObject(result)) {
					result = owner[selectabilityInfoProperty] = new SelectabilityInfo();
				}
				return result;
			};

			return service;
		}]);
})(angular);
