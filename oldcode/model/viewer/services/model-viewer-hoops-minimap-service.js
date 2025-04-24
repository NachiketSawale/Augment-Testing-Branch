/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsMinimapService
	 * @function
	 *
	 * @description Provides a class for minimaps.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsMinimapService', ['_', 'modelViewerHoopsRuntimeDataService',
		'Communicator', 'PlatformMessenger', 'd3', 'modelMapRuntimeDataService', 'modelMapLevelDataService',
		function (_, modelViewerHoopsRuntimeDataService, Communicator, PlatformMessenger, d3,
		          modelMapRuntimeDataService, modelMapLevelDataService) {
			var service = {};

			service.linkMinimapToViewer = function (minimap, viewer, viewerSettings) {
				function updateMap(info) {
					var bBox = modelViewerHoopsRuntimeDataService.getBoundingBox(viewer);
					var bRect = [{
						x: bBox.min.x,
						y: -bBox.min.y
					}, {
						x: bBox.min.x,
						y: -bBox.max.y
					}, {
						x: bBox.max.x,
						y: -bBox.max.y
					}, {
						x: bBox.max.x,
						y: -bBox.min.y
					}];

					var mapData = {
						polygons: [{
							points: bRect
						}]
					};

					if (_.isObject(info)) {
						if (_.isArray(info.levels)) {
							mapData.graphics = _.compact(_.map(info.levels, function mapLevelGraphic(lvl) {
								if (!lvl.graphicsDescriptor) {
									return null;
								}

								return {
									id: lvl.CompoundId + ':' + lvl.graphicsDescriptor.type + ':' + (_.isNumber(lvl.FileArchiveDocFk) ? lvl.FileArchiveDocFk : '_'),
									type: lvl.graphicsDescriptor.type,
									refPoint: (function () {
										var result = modelMapLevelDataService.getAlignmentPoint(lvl, 1);
										if (!result) {
											result = {
												x: 0,
												y: 0
											};
										}
										return result;
									})(),
									orientationAngle: lvl.OrientationAngle,
									translation: {
										x: lvl.TranslationX,
										y: lvl.TranslationY
									},
									scale: lvl.Scale,
									url: lvl.graphicsDescriptor.url
								};
							}));
						}
					}

					minimap.setMapData(mapData);
				}

				var actor = modelMapRuntimeDataService.addActor();
				actor.registerMapUpdated(updateMap);

				var cameraUpdated = function (cam) {
					var pos = cam.getPosition();
					pos.y = -pos.y;

					var angleDegrees = (function () {
						var trg = cam.getTarget();
						trg.y = -trg.y;

						var viewDir2D = new Communicator.Point2(trg.x - pos.x, trg.y - pos.y);
						var viewDirLen = viewDir2D.length();
						if (viewDirLen === 0) {
							return 0;
						}
						viewDir2D.scale(1 / viewDirLen);

						var angleRadians = Math.atan2(1, 0) - Math.atan2(viewDir2D.y, viewDir2D.x);
						var angleDegrees = (angleRadians / Math.PI * 180) + 180;
						while (angleDegrees < 0) {
							angleDegrees += 360;
						}
						while (angleDegrees >= 360) {
							angleDegrees -= 360;
						}
						return angleDegrees;
					})();
					minimap.setActorLocation(pos.x, pos.y, pos.z, angleDegrees);
					actor.setLocation(pos);
				};

				if (!minimap) {
					throw new Error('No minimap set.');
				}
				if (!viewer) {
					throw new Error('No viewer set.');
				}

				updateMap();
				var cam = viewer.view.getCamera();
				cameraUpdated(cam);

				if (!viewer.rib$onCameraUpdated) {
					viewer.rib$onCameraUpdated = new PlatformMessenger();

					var view = viewer.view;

					var origUpdateCamera = view.updateCamera;
					view.updateCamera = function (camera) {
						var result = origUpdateCamera.call(view, camera);
						cameraUpdated(result);
						return result;
					};
				}

				viewer.rib$onCameraUpdated.register(cameraUpdated);

				viewer.setCallbacks({
					camera: cameraUpdated
				});

				var svg = d3.select('.minimap');
				var scaledCamTarget = [];
				var scaledCamPos = [];
				var originalMousePos = [];
				var originalMouseTarget = [];
				var dragDropStarted = false;
				var dragMoveStarted = false;

				var originalPanPos = [];
				var originalPanTarget = [];
				var originalCam = [];

				svg.on('mousedown', function () {
					var mouse;
					if (d3.event.button === 0) {
						originalCam = viewer.view.getCamera();
						dragDropStarted = true;
						dragMoveStarted = false;
						mouse = d3.mouse(d3.event.currentTarget);
						originalMousePos.x = mouse[0];
						originalMousePos.y = mouse[1];
						scaledCamPos = service.miniMapScaleCords(mouse[0], mouse[1]);

						var tempTarget = [];
						tempTarget.x = scaledCamPos.x + 2;
						tempTarget.y = scaledCamPos.y;
						// Show Actor when jumping in MiniMap
						//var originalCamTarget= cam._target;
						generateActor(scaledCamPos);
						service.updateCameraAnnotations(scaledCamPos);
					} else if (d3.event.button === 1) {
						//Start Pan
						originalCam = viewer.view.getCamera();
						dragMoveStarted = true;
						dragDropStarted = false;
						mouse = d3.mouse(d3.event.currentTarget);
						originalPanPos.x = mouse[0];
						originalPanPos.y = mouse[1];
					}

					if (d3.event.button === 0 || d3.event.button === 1) {
						var translatePan = function (clickedButton, mouseTarget) {
							// Handle Pan
							var deltaPan = [];
							if (dragMoveStarted === true) {
								var mouse = mouseTarget;
								originalPanTarget.x = mouse[0];
								originalPanTarget.y = mouse[1];

								var reversedPanPos = service.miniMapScaleCords(originalPanPos.x, originalPanPos.y);
								var reversedPanTarget = service.miniMapScaleCords(originalPanTarget.x, originalPanTarget.y);
								var modelPanPos = service.miniMapToModelCords(reversedPanPos.x, reversedPanPos.y);
								var modelPanTarget = service.miniMapToModelCords(reversedPanTarget.x, reversedPanTarget.y);

								var reversedModelPanPos = rotate(0, 0, modelPanPos.x, modelPanPos.y, (-360 + minimap.actorLocation.angle));
								var reversedModelPanTarget = rotate(0, 0, modelPanTarget.x, modelPanTarget.y, (-360 + minimap.actorLocation.angle));

								deltaPan.x = reversedModelPanTarget.x - reversedModelPanPos.x;
								deltaPan.y = reversedModelPanTarget.y - reversedModelPanPos.y;
								service.translateCameraWithDelta(deltaPan, originalCam);

							}

						};
						var wrappedTranslatePan = _.debounce(translatePan, 5);

						svg.on('mousemove', function () {

							if (d3.event.button === 0 || d3.event.button === 1) {

								if (dragDropStarted === true) {
									// Limiting Viewing Distance during picking new cam pos and new cam target
									var cam = viewer.view.getCamera();
									var oldCamPos = cam._position;
									var oldCamTarget = cam._target;

									var oldCamPosMap = service.modelToMiniMapCord(oldCamPos.x, oldCamPos.y);
									var oldCamTargetMap = service.modelToMiniMapCord(oldCamTarget.x, oldCamTarget.y);

									var scaledOldCamPos = service.miniMapScaleCords(oldCamPosMap.x, oldCamPosMap.y);
									var scaledOldCamTarget = service.miniMapScaleCords(oldCamTargetMap.x, oldCamTargetMap.y);
									var scaledOldCamPosPoint = new Communicator.Point2(scaledOldCamPos.x, scaledOldCamPos.y);
									var scaledOldCamTargetPoint = new Communicator.Point2(scaledOldCamTarget.x, scaledOldCamTarget.y);
									var viewingDist = Communicator.Point2.subtract(scaledOldCamTargetPoint, scaledOldCamPosPoint).length();

									var mouseMove = d3.mouse(d3.event.currentTarget);
									originalMouseTarget.x = mouseMove.x;
									originalMouseTarget.y = mouseMove.y;
									scaledCamTarget = service.miniMapScaleCords(mouseMove[0], mouseMove[1]);
									var camVector = [];

									camVector.x = scaledCamTarget.x - scaledCamPos.x;
									camVector.y = scaledCamTarget.y - scaledCamPos.y;

									var camVectorPoint = new Communicator.Point2(camVector.x, camVector.y);
									if (checkArrHasNumber(camVectorPoint)) {
										var targetAddition = camVectorPoint.normalize().scale(viewingDist);
										var newCamTarget = Communicator.Point3.add(scaledCamPos, targetAddition);
										service.updateCameraAnnotations(scaledCamPos, newCamTarget);
									}
								}
								if (dragMoveStarted === true) {

									wrappedTranslatePan(d3.event.button, d3.mouse(d3.event.currentTarget));
								}

							}
						});

					}


				});

				svg.on('mouseup', function () {
					var mouse;
					if (d3.event.button === 0) {
						if (dragDropStarted === true) {
							svg.on('mousemove', null);
							mouse = d3.mouse(d3.event.currentTarget);
							originalMouseTarget.x = mouse[0];
							originalMouseTarget.y = mouse[1];

							scaledCamTarget = service.miniMapScaleCords(mouse[0], mouse[1]);
							service.updateCameraAnnotations(scaledCamPos, scaledCamTarget);

							var p1 = new Communicator.Point3(originalMousePos.x, originalMousePos.y, 0);
							var p2 = new Communicator.Point3(originalMouseTarget.x, originalMouseTarget.y, 0);

							var viewingDist = Communicator.Point3.subtract(p2, p1).length();
							if (viewingDist > 1) {
								service.updateCameraFromMiniMap(originalMousePos, originalMouseTarget);
							} else {
								service.updateCameraFromMiniMap(originalMousePos);
							}
							service.clearAnnotations();
						}
						dragDropStarted = false;
					}
					// Handle Pan
					else if (d3.event.button === 1) {
						var deltaPan = [];
						if (dragMoveStarted) {
							svg.on('mousemove', null);
							mouse = d3.mouse(d3.event.currentTarget);
							originalPanTarget.x = mouse[0];
							originalPanTarget.y = mouse[1];

							var reversedPanPos = service.miniMapScaleCords(originalPanPos.x, originalPanPos.y);
							var reversedPanTarget = service.miniMapScaleCords(originalPanTarget.x, originalPanTarget.y);
							var modelPanPos = service.miniMapToModelCords(reversedPanPos.x, reversedPanPos.y);
							var modelPanTarget = service.miniMapToModelCords(reversedPanTarget.x, reversedPanTarget.y);

							var reversedModelPanPos = rotate(0, 0, modelPanPos.x, modelPanPos.y, (-360 + minimap.actorLocation.angle));
							var reversedModelPanTarget = rotate(0, 0, modelPanTarget.x, modelPanTarget.y, (-360 + minimap.actorLocation.angle));

							deltaPan.x = reversedModelPanTarget.x - reversedModelPanPos.x;
							deltaPan.y = reversedModelPanTarget.y - reversedModelPanPos.y;

							service.translateCameraWithDelta(deltaPan, originalCam);
							dragMoveStarted = false;
						}
					}

				});
				service.updateCameraAnnotations = function (tempPos, tempTarget) {
					var cam = viewer.view.getCamera();
					var delta = [];
					delta.x = minimap.width / 2;
					delta.y = minimap.height / 3 * 2;

					if (tempPos) {
						service.clearAnnotations();
						if (tempTarget) {

							if (checkArrHasNumber(tempPos) && checkArrHasNumber(tempTarget)) {
								generateActor(tempPos, tempTarget);
							}
						} else {
							//generateActor(tempPos, originalCamTarget);
							generateActor(tempPos);
							//service.addCircleMarker(tempPos, 3);
						}
					} else {
						var target = [];
						target.x = cam._target.x;
						target.y = cam._target.y;

						service.clearAnnotations();
						var mapCamTarget = service.modelToMiniMapCord(target.x, target.y);
						service.addCircleMarker(mapCamTarget, 2.5);
					}
				};
				service.miniMapToModelCords = function (mx, my) {
					var result = [];
					var cam = viewer.view.getCamera();

					var delta = [];
					delta.x = minimap.width / 2;
					delta.y = minimap.height / 3 * 2;

					// reversed scaled new point
					var reversedScaledNewPoint = [];
					reversedScaledNewPoint.x = minimap.mapScale.invert(mx - delta.x);
					reversedScaledNewPoint.y = minimap.mapScale.invert(my - delta.y);

					reversedScaledNewPoint = rotate(0, 0, reversedScaledNewPoint.x, reversedScaledNewPoint.y, (-360 + minimap.actorLocation.angle));

					result.x = cam._position.x + reversedScaledNewPoint.x;

					result.y = cam._position.y - reversedScaledNewPoint.y;
					result.z = cam._position.z;

					return result;

				};
				service.modelToMiniMapCord = function (mx, my) {
					var result = [];
					result.x = minimap.mapScale(mx);
					result.y = -minimap.mapScale(my);
					return result;
				};
				service.miniMapScaleCords = function (mx, my) {
					var result = [];
					var delta = [];
					delta.x = minimap.width / 2;
					delta.y = minimap.height / 3 * 2;
					result.x = minimap.mapScale.invert(mx - delta.x);
					result.y = minimap.mapScale.invert(my - delta.y);
					result = rotate(0, 0, result.x, result.y, (-360 + minimap.actorLocation.angle));

					result.x = minimap.mapScale((minimap.actorLocation.x) + result.x);
					result.y = minimap.mapScale((minimap.actorLocation.y) + result.y);

					return result;
				};
				service.clearAnnotations = function () {
					var circleAnnotations = minimap.mapArea.selectAll('circle');
					if (circleAnnotations._groups[0].length > 0) {
						circleAnnotations.remove();
					}

					var lineAnnotations = minimap.mapArea.selectAll('line');
					if (lineAnnotations._groups[0].length > 0) {
						lineAnnotations.remove();
					}

					var pathAnnotations = minimap.mapArea.selectAll('path');
					if (pathAnnotations._groups[0].length > 0) {
						pathAnnotations.remove();
					}
				};

				service.updateCameraFromMiniMap = function (camPos, camTarget) {
					var cam = viewer.view.getCamera();
					var oldCamPos = cam._position;
					var oldCamTarget = cam._target;
					var viewingDist = Communicator.Point3.subtract(oldCamTarget, oldCamPos).length();
					var delta = [];
					delta.x = minimap.width / 2;
					delta.y = minimap.height / 3 * 2;

					// reverse camera position
					var reversedScaledNewPoint = service.miniMapToModelCords(camPos.x, camPos.y);
					var targetAddition = [];
					var camVectorPoint = [];
					var camVector = [];
					var newCamTarget = [];
					if (camTarget) {
						// reverse camera target
						var reversedScaledCamTarget = service.miniMapToModelCords(camTarget.x, camTarget.y);

						camVector.x = reversedScaledCamTarget.x - reversedScaledNewPoint.x;
						camVector.y = reversedScaledCamTarget.y - reversedScaledNewPoint.y;

						camVectorPoint = new Communicator.Point2(camVector.x, camVector.y);


						targetAddition = camVectorPoint.normalize().scale(viewingDist);
						newCamTarget = Communicator.Point2.add(reversedScaledNewPoint, targetAddition);
						newCamTarget.z = cam._target.z;
					} else {

						camVector.x = oldCamTarget.x - oldCamPos.x;
						camVector.y = oldCamTarget.y - oldCamPos.y;
						camVector.z = oldCamTarget.z - oldCamPos.z;
						camVectorPoint = new Communicator.Point3(camVector.x, camVector.y, camVector.z);

						targetAddition = camVectorPoint.normalize().scale(viewingDist);
						newCamTarget = Communicator.Point3.add(reversedScaledNewPoint, targetAddition);
						newCamTarget.z = cam._target.z;
					}

					cam._position.x = reversedScaledNewPoint.x;
					cam._position.y = reversedScaledNewPoint.y;

					cam.setTarget(newCamTarget);

					if (Math.abs(cam.getUp().z) > 0.001) {
						cam.setUp(new Communicator.Point3(0, 0, 1));

					}

					if (viewerSettings.transitions) {
						viewer.view.setCamera(cam, 100);
					} else {
						viewer.view.setCamera(cam);
					}

				};
				service.translateCameraWithDelta = function (deltaPan, originalCam) {
					var cam = viewer.view.getCamera();
					var oldCamPos = cam._position;
					var oldCamTarget = cam._target;
					var viewingDist = Communicator.Point3.subtract(oldCamTarget, oldCamPos).length();
					var delta = [];
					delta.x = minimap.width / 2;
					delta.y = minimap.height / 3 * 2;
					var reversedDeltaPan = deltaPan;

					var targetAddition = [];
					var camVectorPoint = [];
					var camVector = [];
					var newCamTarget = [];
					var newPosPan = [];

					newPosPan.x = originalCam._position.x - reversedDeltaPan.x;
					newPosPan.y = originalCam._position.y - reversedDeltaPan.y;
					var newPosPoint = new Communicator.Point3(newPosPan.x, newPosPan.y, cam._position.z);

					camVector.x = oldCamTarget.x - oldCamPos.x;
					camVector.y = oldCamTarget.y - oldCamPos.y;
					camVector.z = oldCamTarget.z - oldCamPos.z;
					camVectorPoint = new Communicator.Point3(camVector.x, camVector.y, camVector.z);

					targetAddition = camVectorPoint.normalize().scale(viewingDist);
					newCamTarget = Communicator.Point3.add(newPosPoint, targetAddition);
					newCamTarget.z = originalCam._target.z;

					cam._position.x = newPosPan.x;
					cam._position.y = newPosPan.y;

					cam.setTarget(newCamTarget);

					if (Math.abs(cam.getUp().z) > 0.001) {
						cam.setUp(new Communicator.Point3(0, 0, 1));
					}
					viewer.view.setCamera(cam);
				};

				service.addCircleMarker = function (point, r) {
					if (point) {
						minimap.mapArea.append('circle').attrs({
							cx: point.x,
							cy: point.y,
							r: r
						});
					}

				};

				function rotate(cx, cy, x, y, angle) {
					var result = [];
					var radians = (Math.PI / 180) * angle,
						cos = Math.cos(radians),
						sin = Math.sin(radians),
						nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
						ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
					result.x = nx;
					result.y = ny;

					return result;
				}

				function checkArrHasNumber(arr) {
					var hasNumber = false;


					if (arr.x) {
						hasNumber = true;
					}

					if (arr.y) {
						hasNumber = true;
					}


					return hasNumber;

				}

				function drawActor(coordinates, degree, tempPos) {
					var tempRadialGradient = d3.select('#tempViewingFrustumGradient');
					var gradient = [];
					if (tempRadialGradient.empty()) {
						gradient = d3.select('defs').append('radialGradient').attrs({
							id: 'tempViewingFrustumGradient',
							cx: '50%',
							cy: '100%',
							r: 1
						});
						gradient.append('stop').attrs({
							offset: '5%',
							'stop-color': 'rgba(128, 0, 128, 0.6)'
						});
						gradient.append('stop').attrs({
							offset: '98%',
							'stop-color': 'rgba(128, 0, 128, 0.1)'
						});
					}


					minimap.mapArea.append('path').classed('tempActorViewingFrustum', true).attrs({
						d: coordinates,
						fill: 'url(#tempViewingFrustumGradient)',
						transform: 'translate(' + (tempPos.x) + ',' + (tempPos.y) + ')rotate(' + (90 + degree) + ')'
					});
					minimap.mapArea.append('circle').attrs({
						cx: tempPos.x,
						cy: tempPos.y,
						r: 3
					});
				}

				function generateActor(tempPos, tempTarget) {
					var coordinates = 'M ' + 0 + ',' + 0 + ' L ' + (-12) + ',' + (-15) + ' Q ' + (0) + ',' + (-25) + ',' + (12) + ',' + (-15) + ' Z';
					var angleDeg = -minimap.actorLocation.angle - 90;
					if (tempTarget) {

						angleDeg = Math.atan2(tempTarget.y - (tempPos.y), tempTarget.x - (tempPos.x)) * 180 / Math.PI;
					}

					drawActor(coordinates, angleDeg, tempPos);
					return coordinates;
				}

				return function unlinkMinimap() {
					actor.destroy();
				};
			};

			return service;
		}]);
})(angular);
