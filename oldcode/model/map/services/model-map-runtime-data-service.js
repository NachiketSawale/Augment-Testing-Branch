/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.map.modelMapRuntimeDataService
	 * @function
	 *
	 * @description Manages map data for the current model, to be displayed in a minimap.
	 */
	angular.module('model.map').factory('modelMapRuntimeDataService', modelMapRuntimeDataService);

	modelMapRuntimeDataService.$inject = ['_', '$http', 'modelViewerModelSelectionService',
		'PlatformMessenger', 'modelMapLevelDataService', '$q', 'modelMapPolygonDataService', 'd3',
		'platformCollectionUtilitiesService'];

	function modelMapRuntimeDataService(_, $http, modelViewerModelSelectionService,
		PlatformMessenger, modelMapLevelDataService, $q, modelMapPolygonDataService, d3,
		platformCollectionUtilitiesService) {

		const service = {};

		const privateState = {
			loadedMap: null,
			actorsById: {},
			nextId: 1
		};

		service.forceReloadMap = function () {
			reloadMap();
		};

		function reloadMap() {
			privateState.loadedMap = null;
			const selModelId = modelViewerModelSelectionService.getSelectedModelId();
			if (selModelId) {
				$http.get(globals.webApiBaseUrl + 'model/map/runtimemap', {
					params: {
						modelId: selModelId
					}
				}).then(function (response) {
					privateState.loadedMap = _.isArray(response.data) ? response.data : [];
					privateState.loadedMap.forEach(function (m) {
						if (_.isArray(m.MapAreaEntities)) {
							m.MapAreaEntities.forEach(function (a) {
								if (!_.isArray(a.MapPolygonEntities)) {
									a.MapPolygonEntities = [];
								}
								if (_.isArray(a.MapLevelEntities)) {
									a.MapLevelEntities.forEach(function (l) {
										l.CompoundId = m.ModelFk + '/' + l.Id;
									});
								} else {
									a.MapLevelEntities = [];
								}
							});
						} else {
							m.MapAreaEntities = [];
						}
					});

					Object.keys(privateState.actorsById, function (id) {
						const actor = privateState.actorsById[id];
						actor.fireMapUdpated();
					});
				});
			}
		}

		modelViewerModelSelectionService.onSelectedModelChanged.register(reloadMap);

		function getDisplayedLevels(location) {
			if (_.isArray(privateState.loadedMap)) {
				return _.flatten(_.map(privateState.loadedMap, function (m) {
					const candidateAreas = _.filter(_.map(_.filter(m.MapAreaEntities, function filterHorizontally(ma) {
						if (_.isEmpty(ma.MapLevelEntities)) {
							return false;
						}

						if (_.isEmpty(ma.MapPolygonEntities)) {
							return true;
						}

						return _.some(ma.MapPolygonEntities, function (mp) {
							const pts = modelMapPolygonDataService.parsePointsStr(mp.Points);
							return d3.polygonContains(pts, [location.x, location.y]);
						});
					}), function enrichWithLevels(ma) {
						return {
							area: ma,
							levelCandidates: _.filter(ma.MapLevelEntities, function filterVertically(ml) {
								return modelMapLevelDataService.isZInLevel(ml, location.z);
							})
						};
					}), function filterByLevels(maInfo) {
						return !_.isEmpty(maInfo.levelCandidates);
					});

					const currentLevelInfo = (function pickCurrentLevel() {
						if (_.isEmpty(candidateAreas)) {
							return null;
						}

						// TODO: This selection process can be improved.
						return {
							area: candidateAreas[0].area,
							level: candidateAreas[0].levelCandidates[0]
						};
					})();

					const result = [];
					if (currentLevelInfo) {
						result.push(currentLevelInfo.level);
					}
					platformCollectionUtilitiesService.appendItems(result, _.compact(_.flatten(_.map(_.filter(m.MapAreaEntities, function excludeUsed(ma) {
						return !_.some(candidateAreas, function (caInfo) {
							return caInfo.area === ma;
						});
					}), function mapToLevel(ma) {
						return _.find(ma.MapLevelEntities, function (ml) {
							return modelMapLevelDataService.isZInLevel(ml, location.z);
						});
					}))));

					return result;
				}));
			} else {
				return [];
			}
		}

		service.addActor = function () {
			const actor = {
				id: 'a' + privateState.nextId,
				location: {
					x: 0,
					y: 0,
					z: 0
				},
				onMapUpdated: new PlatformMessenger(),
				fireMapUdpated: function () {
					if (privateState.loadedMap) {
						const levels = getDisplayedLevels(actor.location);
						$q.all(_.map(levels, function (lvl) {
							if (lvl.graphicsDescriptor && (lvl.graphicsDescriptor.FileArchiveDocFk === lvl.FileArchiveDocFk)) {
								return $q.when(lvl);
							} else {
								return modelMapLevelDataService.getGraphicsDescriptor(lvl).then(function (gd) {
									lvl.graphicsDescriptor = gd;
									if (gd) {
										gd.FileArchiveDocFk = lvl.FileArchiveDocFk;
									}
									return lvl;
								});
							}
						})).then(function (levels) {
							actor.onMapUpdated.fire({
								levels: levels
							});
						});
					}
				},
				controller: {
					setLocation: function (location) {
						actor.location = {
							x: location.x,
							y: location.y,
							z: location.z
						};
						actor.fireMapUpdatedDelayed();
					},
					registerMapUpdated: function (handler) {
						actor.onMapUpdated.register(handler);
					},
					unregisterMapUpdated: function (handler) {
						actor.onMapUpdated.unregister(handler);
					},
					destroy: function () {
						delete privateState.actorsById[actor.id];
					}
				}
			};
			actor.fireMapUpdatedDelayed = _.debounce(actor.fireMapUdpated, 800, {
				maxWait: 1200
			});
			privateState.actorsById[actor.id] = actor;
			privateState.nextId++;
			return actor.controller;
		};

		return service;
	}
})(angular);
