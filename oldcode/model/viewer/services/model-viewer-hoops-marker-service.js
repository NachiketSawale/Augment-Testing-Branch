/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsMarkerService
	 * @function
	 *
	 * @description Displays 3D position markers in a HOOPS viewer.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsMarkerService', ['_', 'Communicator',
		'modelViewerMarkerService', 'modelViewerHoopsUtilitiesService', '$q', 'basicsCommonDrawingUtilitiesService',
		function (_, Communicator, modelViewerMarkerService, modelViewerHoopsUtilitiesService, $q,
		          basicsCommonDrawingUtilitiesService) {
			var service = {};

			function createMarkerMesh(model) {
				var centerSize = 0.005;
				var extent = 0.08;

				var centerDistance = centerSize / 2;
				var centerCube = [
					new Communicator.Point3(centerDistance, centerDistance, centerDistance),
					new Communicator.Point3(-centerDistance, centerDistance, centerDistance),
					new Communicator.Point3(-centerDistance, -centerDistance, centerDistance),
					new Communicator.Point3(centerDistance, -centerDistance, centerDistance),

					new Communicator.Point3(centerDistance, centerDistance, -centerDistance),
					new Communicator.Point3(-centerDistance, centerDistance, -centerDistance),
					new Communicator.Point3(-centerDistance, -centerDistance, -centerDistance),
					new Communicator.Point3(centerDistance, -centerDistance, -centerDistance)
				];

				var outerCube = [
					new Communicator.Point3(extent, extent, extent),
					new Communicator.Point3(-extent, extent, extent),
					new Communicator.Point3(-extent, -extent, extent),
					new Communicator.Point3(extent, -extent, extent),

					new Communicator.Point3(extent, extent, -extent),
					new Communicator.Point3(-extent, extent, -extent),
					new Communicator.Point3(-extent, -extent, -extent),
					new Communicator.Point3(extent, -extent, -extent)
				];

				var rays = [
					outerCube[0], centerCube[1], centerCube[3],
					outerCube[0], centerCube[4], centerCube[1],
					outerCube[0], centerCube[3], centerCube[4],

					outerCube[1], centerCube[2], centerCube[0],
					outerCube[1], centerCube[0], centerCube[5],
					outerCube[1], centerCube[5], centerCube[2],

					outerCube[2], centerCube[3], centerCube[1],
					outerCube[2], centerCube[6], centerCube[3],
					outerCube[2], centerCube[1], centerCube[6],

					outerCube[3], centerCube[0], centerCube[2],
					outerCube[3], centerCube[7], centerCube[0],
					outerCube[3], centerCube[2], centerCube[7],

					outerCube[4], centerCube[7], centerCube[5],
					outerCube[4], centerCube[0], centerCube[7],
					outerCube[4], centerCube[5], centerCube[0],

					outerCube[5], centerCube[4], centerCube[6],
					outerCube[5], centerCube[1], centerCube[4],
					outerCube[5], centerCube[6], centerCube[1],

					outerCube[6], centerCube[5], centerCube[7],
					outerCube[6], centerCube[2], centerCube[5],
					outerCube[6], centerCube[7], centerCube[2],

					outerCube[7], centerCube[6], centerCube[4],
					outerCube[7], centerCube[4], centerCube[3],
					outerCube[7], centerCube[3], centerCube[6]
				];

				var md = new Communicator.MeshData();
				md.setBackfacesEnabled(false);
				md.setFaceWinding(Communicator.FaceWinding.CounterClockwise);
				md.addFaces(modelViewerHoopsUtilitiesService.pointsToCoordArray(rays));
				return model.createMesh(md);
			}

			service.createMarkerManager = function (webViewer, settings) {
				if (!settings) {
					throw new Error('No settings object supplied.');
				}

				if (!settings.byType) {
					settings.byType = {};
				}

				var managerPrivate = {
					webViewer: webViewer,
					markerMeshId: null,
					byType: {},
					settings: settings,
					getManagerForType: function (markerType) {
						var markerTypeId = angular.isObject(markerType) ? markerType.id : markerType;
						var mgr = this.byType[markerTypeId];
						if (!mgr) {
							if (!settings.byType[markerTypeId]) {
								settings.byType[markerTypeId] = {
									visible: false
								};
							}

							this.byType[markerTypeId] = mgr = {
								settings: settings.byType[markerTypeId],
								dataService: modelViewerMarkerService.getDataService(markerType),
								setVisibility: function (newVisibility) {
									this.settings.visible = !!newVisibility;
									if (Object.keys(this.markerMeshInstanceIds).length > 0) {
										var that = this;
										managerPrivate.webViewer.model.setNodesVisibility(_.map(Object.keys(this.markerMeshInstanceIds), function (markerId) {
											return that.markerMeshInstanceIds[markerId];
										}), this.settings.visible);
									}
								},
								markerMeshInstanceIds: {},
								updateMarkers: function (changedMarkerIds) {
									if (!managerPrivate.markerMeshId) {
										return;
									}

									var changedMarkerIdSet = null;
									if (angular.isArray(changedMarkerIds)) {
										changedMarkerIdSet = {};
										changedMarkerIds.forEach(function (id) {
											changedMarkerIdSet[id] = true;
										});
									}

									var model = webViewer.model;

									var items = _.filter(this.dataService.getList(), function (mrk) {
										return !!mrk.isInitialized;
									});
									var that = this;
									var obsoleteInstances = _.clone(this.markerMeshInstanceIds);

									var highlightedMarkerIds = this.dataService.getHighlighted();

									this.getColorInfo().then(function (colorInfo) {
										var waitFor = [];
										items.forEach(function (marker) {
											var mx = new Communicator.Matrix().setTranslationComponent(marker.PositionX, marker.PositionY, marker.PositionZ);
											var instIdOrPromise = that.markerMeshInstanceIds[marker.Id];
											var color = highlightedMarkerIds.indexOf(marker.Id) >= 0 ? colorInfo.HighlightColor : colorInfo.MarkerColor;
											if (_.isNumber(instIdOrPromise)) {
												if (!changedMarkerIdSet || changedMarkerIdSet[marker.Id]) {
													waitFor.push($q.all([
														model.setNodeMatrix(instIdOrPromise, mx),
														model.setNodesFaceColor([instIdOrPromise], color)
													]));
												}
											} else {
												if (instIdOrPromise) {
													that.markerMeshInstanceIds[marker.Id] = instIdOrPromise.then(function (id) {
														return $q.all([
															model.setNodesFaceColor([id], color),
															model.setNodeMatrix(id, mx)
														]).then(function () {
															return id;
														});
													});
												} else {
													var mid = new Communicator.MeshInstanceData(managerPrivate.markerMeshId, undefined, undefined, undefined, undefined, undefined,
														Communicator.MeshInstanceCreationFlags.DoNotLight | Communicator.MeshInstanceCreationFlags.DoNotCut);
													mid.setFaceColor(color);
													mid.setMatrix(mx);

													var createMarkerPromise = model.createMeshInstance(mid, managerPrivate.markerParentNodeId).then(function (id) {
														that.markerMeshInstanceIds[marker.Id] = id;
														return $q.all([
															model.setNodesVisibility([id], that.settings.visible),
															model.setInstanceModifier(Communicator.InstanceModifier.SuppressCameraScale, [id], true)
														]).then(function () {
															return id;
														});
													});

													waitFor.push(createMarkerPromise);
													that.markerMeshInstanceIds[marker.Id] = createMarkerPromise;
												}
											}
											delete obsoleteInstances[marker.Id];
										});

										if (waitFor.length > 0) {
											return $q.all(waitFor);
										}
									}).then(function () {
										var instancesToDelete = [];
										Object.keys(obsoleteInstances).forEach(function (markerId) {
											markerId = parseInt(markerId);
											var instId = obsoleteInstances[markerId];
											delete that.markerMeshInstanceIds[markerId];
											if (instId) {
												instancesToDelete.push(instId);
											}
										});
										if (instancesToDelete.length > 0) {
											model.deleteMeshInstances(instancesToDelete);
										}
									});
								},
								getColorInfo: function () {
									var that = this;
									if (that.colorInfo) {
										return $q.when(that.colorInfo);
									} else {
										return that.dataService.getColorInfo().then(function (info) {
											var hoopsColorInfo = {};
											Object.keys(info).forEach(function (key) {
												hoopsColorInfo[key] = modelViewerHoopsUtilitiesService.rgbColorToViewerColor(basicsCommonDrawingUtilitiesService.intToRgbColor(info[key]));
											});
											that.colorInfo = hoopsColorInfo;

											return hoopsColorInfo;
										});
									}
								}
							};
							mgr.updateMarkers();

							var updateItem = function (unused, item) {
								mgr.updateMarkers([item.Id]);
							};
							var updateHighlights = function (newHighlight, oldHighlight) {
								mgr.updateMarkers(newHighlight.concat(oldHighlight));
							};
							var updateAllItems = function () {
								mgr.updateMarkers();
							};

							mgr.dataService.registerListLoaded(updateAllItems);
							mgr.dataService.registerItemModified(updateItem);
							mgr.dataService.registerHighlightChanged(updateHighlights);

							mgr.detach = function () {
								mgr.dataService.unregisterListLoaded(updateAllItems);
								mgr.dataService.unregisterItemModified(updateItem);
								mgr.dataService.unregisterHighlightChanged(updateHighlights);
							};
						}
						return mgr;
					}
				};

				var managerPublic = {
					detach: function () {
						Object.keys(managerPrivate.byType).forEach(function (key) {
							managerPrivate.byType[key].detach();
						});
					}
				};

				managerPublic.setVisibility = function (markerType, newVisibility) {
					managerPrivate.getManagerForType(markerType).setVisibility(newVisibility);
				};

				createMarkerMesh(webViewer.model).then(function (meshId) {
					managerPrivate.markerMeshId = meshId;
					managerPrivate.markerParentNodeId = webViewer.model.createNode(modelViewerHoopsUtilitiesService.getHelperGeometryRoot(webViewer));
					Object.keys(managerPrivate.byType).forEach(function (markerTypeKey) {
						managerPrivate.byType[markerTypeKey].updateMarkers();
					});
				});

				managerPublic.createVisibilityMenu = function (markerSettings, saveSettings) {
					if (!markerSettings.byType) {
						markerSettings.byType = {};
					}

					return _.map(Object.keys(modelViewerMarkerService.markerTypes), function (markerTypeKey) {
						var markerType = modelViewerMarkerService.markerTypes[markerTypeKey];

						return {
							id: 'marker_' + markerTypeKey,
							type: 'check',
							value: !!((markerSettings.byType[markerType.id] || {}).visible),
							caption: markerType.categoryNameKey,
							fn: function (btnId, btn) {
								managerPublic.setVisibility(markerType, btn.value);
								saveSettings();
							}
						};
					});
				};

				_.forEach(Object.keys(modelViewerMarkerService.markerTypes), function (markerTypeKey) {
					var markerType = modelViewerMarkerService.markerTypes[markerTypeKey];
					var typeSettings = settings.byType[markerType.id];
					if (typeSettings) {
						if (typeSettings.visible) {
							managerPublic.setVisibility(markerType, true);
						}
					}
				});

				return managerPublic;
			};

			return service;
		}]);
})(angular);
