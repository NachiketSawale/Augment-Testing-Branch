/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';
	const module = angular.module('model.viewer');

	/**
	 * @ngdoc service
	 * @name modelViewerHoopsSnapshotService
	 * @function
	 *
	 * @description
	 * Generates snapshots of 3D scenes, as much in the background as possible without interfering with the user's UI view.
	 */
	module.factory('modelViewerHoopsSnapshotService', modelViewerHoopsSnapshotService);

	modelViewerHoopsSnapshotService.$inject = ['$', 'Communicator', 'modelViewerHoopsEndpointService', '$q',
		'modelViewerModelSelectionService', '$log', '_', 'modelAdministrationViewerSettingsRuntimeService',
		'modelViewerHoopsUtilitiesService', '$timeout'];

	function modelViewerHoopsSnapshotService($, Communicator, modelViewerHoopsEndpointService, $q,
		modelViewerModelSelectionService, $log, _, modelAdministrationViewerSettingsRuntimeService,
		modelViewerHoopsUtilitiesService, $timeout) {

		function takeSnapshots(sceneConfig, snapshotConfig, processSnapshot) {
			return modelAdministrationViewerSettingsRuntimeService.loadActiveSettings().then(function (viewerSettings) {
				const effectiveSceneConfig = _.assign({
					rendererType: modelViewerHoopsUtilitiesService.stringToRendererType(viewerSettings.renderMode),
					streamingMode: modelViewerHoopsUtilitiesService.stringToStreamingMode(viewerSettings.streamingMode),
					defaultWidth: 800,
					defaultHeight: 800
				}, _.isObject(sceneConfig) ? sceneConfig : {});
				if (!effectiveSceneConfig.model) {
					effectiveSceneConfig.model = modelViewerModelSelectionService.getSelectedModel();
				}

				if (!effectiveSceneConfig.model) {
					throw new Error('No model specified.');
				}

				if (!_.isArray(snapshotConfig) && _.isObject(snapshotConfig)) {
					snapshotConfig = [snapshotConfig];
				}

				const snapshottingProcess = {
					sceneConfig: effectiveSceneConfig,
					snapshotConfigs: snapshotConfig,
					snapshotIndex: 0,
					resultPromise: null,
					aborted: false,
					sceneReady: false,
					modelStructureReady: false,
					geometryLoaded: false,
					abort: function (reason) {
						if (!this.aborted) {
							$log.warn(`3D snapshot process aborted: ${reason}`);

							this.aborted = true;
							if (this.resultPromise) {
								this.resultPromise.reject({
									reason: reason,
									completedSnapshotsCount: this.snapshotIndex
								});
							}
						}
					},
					enforceTimeLimit: function (waitSeconds, expectedCondition, failureMessage) {
						const that = this;

						if (!that.aborted) {
							$timeout(function () {
								if (!that.aborted && !expectedCondition(that)) {
									that.abort(failureMessage);
								}
							}, waitSeconds * 1000);
						}
					}
				};

				const body = $('body');
				const tempViewerDiv = $('<div></div>').appendTo(body).css({
					display: 'block',
					visibility: effectiveSceneConfig.debug ? 'visible' : 'hidden',
					position: 'absolute',
					width: '800px',
					height: '600px',
					left: '5px',
					top: '5px',
					'z-index': 1000
				});

				return modelViewerHoopsEndpointService.retrieveInstanceUri(effectiveSceneConfig.rendererType).then(function (endpointInfo) {
					const hwv = new Communicator.WebViewer({
						container: tempViewerDiv[0],
						rendererType: effectiveSceneConfig.rendererType,
						streamingMode: effectiveSceneConfig.streamingMode,
						endpointUri: endpointInfo.uri,
						model: '_empty'
					});
					if (effectiveSceneConfig.debug) {
						$log.info({
							hwv
						});
					}

					snapshottingProcess.setViewerSize = function (width, height) {
						tempViewerDiv.css({
							width: `${width}px`,
							height: `${height}px`
						});
						hwv.resizeCanvas();
						return hwv.waitForIdle();
					};

					snapshottingProcess.resultPromise = $q.defer();

					hwv.setCallbacks({
						sceneReady: function () {
							if (snapshottingProcess.aborted) {
								return;
							}

							snapshottingProcess.sceneReady = true;
							$log.info('Background model scene ready.');
							hwv.view.setBackgroundColor(Communicator.Color.white(), Communicator.Color.white());

							snapshottingProcess.enforceTimeLimit(60, p => p.modelStructureReady, 'Timeout for model-structure-ready event exceeded.');
						},
						modelStructureReady: function () {
							if (snapshottingProcess.aborted) {
								return;
							}

							snapshottingProcess.modelStructureReady = true;
							$log.info('Background model structure ready.');

							snapshottingProcess.enforceTimeLimit(60, p => p.geometryLoaded, 'Geometry was not loaded in time.');
							return loadGeometry(hwv, snapshottingProcess.sceneConfig.model).then(function () {
								if (snapshottingProcess.aborted) {
									return;
								}

								snapshottingProcess.geometryLoaded = true;

								return generateSnapshots(hwv, snapshottingProcess, processSnapshot).then(function () {
									if (snapshottingProcess.aborted) {
										return;
									}

									snapshottingProcess.resultPromise.resolve();
								});
							});
						},
						XHRonerror: function (error) {
							snapshottingProcess.abort(`XHR error: ${error.message}`);
						},
						missingModel: function (path) {
							snapshottingProcess.abort(`Missing model: ${path}`);
						},
						modelLoadFailure: function (modelName, reason) {
							snapshottingProcess.abort(`Failed to load model ${modelName}: ${reason}`);
						},
						timeout: function () {
							snapshottingProcess.abort('The 3D scene session has timed out.');
						},
						webGlContextLost: function () {
							snapshottingProcess.abort('The WebGL context was lost.');
						}
					});

					if (hwv.start()) {
						$log.info('Background viewer started.');

						snapshottingProcess.enforceTimeLimit(30, p => p.sceneReady, 'Timeout for scene-ready event exceeded.');

						return snapshottingProcess.resultPromise.promise.then(function () {
							if (!snapshottingProcess.sceneConfig.debug) {
								$log.info('Shutting down background viewer ...');
								hwv.shutdown();
							}
						});
					} else {
						return $q.reject('Failed to start WebViewer.');
					}
				}).then(function processSuccess() {
				}, function processFailure() {
				}).then(function cleanUp() {
					if (!snapshottingProcess.sceneConfig.debug) {
						tempViewerDiv.remove();
					}
				});
			});
		}

		function loadGeometry(hwv, model) {
			$log.info('Loading geometry ...');

			const mdl = hwv.model;
			const globalRoot = mdl.getAbsoluteRootNode();

			let resultPromise = $q.when();

			model.subModels.forEach(function (sm, index) {
				resultPromise = resultPromise.then(function () {
					$log.info(`Loading sub-model at index ${index} ...`);
					// TODO: outsource; copied from other file
					const smMatrix = _.isArray(sm.transform) ? Communicator.Matrix.createFromArray(sm.transform) : new Communicator.Matrix();

					const newNodeId = mdl.createNode(globalRoot, 'SM' + sm.subModelId, null, smMatrix);
					const loadSubtreePromise = (function loadSubtree() {
						if (!_.isEmpty(sm.info.modelUri)) {
							return mdl.loadSubtreeFromScsFile(newNodeId, sm.info.modelUri);
						} else {
							return mdl.loadSubtreeFromModel(newNodeId, sm.info.getModelName());
						}
					})();

					return loadSubtreePromise.then(function () {
						if (_.isNumber(sm.info.scalingFactor)) {
							const matrix = new Communicator.Matrix().scale(sm.info.scalingFactor);
							return mdl.setNodeMatrix(newNodeId, matrix, true);
						}
					});
				});
			});

			return resultPromise;
		}

		function generateSnapshots(hwv, snapshottingProcess, processSnapshot) {
			if (!_.isFunction(processSnapshot)) {
				throw new Error('No callback function for processing generated snapshots supplied.');
			}

			let resultPromise = $q.when();

			for (let ssc of snapshottingProcess.snapshotConfigs) {
				resultPromise = resultPromise.then(function () {
					if (snapshottingProcess.aborted) {
						return;
					}

					snapshottingProcess.snapshotIndex++;

					const snapshotSize = {
						width: _.isInteger(ssc.width) ? ssc.width : snapshottingProcess.sceneConfig.defaultWidth,
						height: _.isInteger(ssc.height) ? ssc.height : snapshottingProcess.sceneConfig.defaultHeight
					};

					return snapshottingProcess.setViewerSize(snapshotSize.width, snapshotSize.height).then(() => snapshotSize);
				}).then(function (snapshotSize) {
					hwv.view.setProjectionMode(ssc.orthographic ? Communicator.Projection.Orthographic : Communicator.Projection.Perspective);

					const camPromise = prepareSnapshotCamera(ssc, hwv);

					const cfg = new Communicator.SnapshotConfig(snapshotSize.width, snapshotSize.height, Communicator.SnapshotLayer.Model);

					$log.info('Taking snapshot ...');
					return camPromise.then(function prepareCuttingPlanes () {
						let resultPromise = hwv.cuttingManager.clearAllCuttingSections();

						if (ssc.cuttingPlanes) {
							const maxCount = Math.min(ssc.cuttingPlanes.length, hwv.cuttingManager.getCuttingSectionCount());
							for (let idx = 0; idx < maxCount; idx++) {
								const sec = hwv.cuttingManager.getCuttingSection(idx);
								const planeDef = ssc.cuttingPlanes[idx];

								const plane = Communicator.Plane.createFromPointAndNormal(new Communicator.Point3(planeDef.point.x, planeDef.point.y, planeDef.point.z), new Communicator.Point3(planeDef.normal.x, planeDef.normal.y, planeDef.normal.z));

								resultPromise = resultPromise.then(function () {
									return sec.addPlane(plane);
								}).then(function () {
									return sec.activate();
								});
							}

							resultPromise =  resultPromise.then(function () {
								return hwv.cuttingManager.activateCuttingSections();
							});
						}

						return resultPromise;
					}).then(function () {
						return hwv.waitForIdle({
							redraw: true
						});
					}).then(function () {
						return hwv.takeSnapshot(cfg).then(function (snapshotEl) {
							return retrieveReferencePoints(ssc, hwv).then(function (refPointsInfo) {
								$log.info('Snapshot taken.');

								const snapshotInfo = {
									config: ssc,
									html: snapshotEl
								};

								if (refPointsInfo) {
									snapshotInfo.referencePoints = refPointsInfo;
								}

								if (snapshottingProcess.aborted) {
									return;
								}

								return $q.when(processSnapshot(snapshotInfo));
							});
						});
					});
				});
			}

			return resultPromise;
		}

		function prepareSnapshotCamera(ssc, hwv) {
			if (ssc.standardCamera) {
				let orientation;
				switch (ssc.standardCamera) {
					case 'top':
						orientation = Communicator.ViewOrientation.Top;
						break;
					case 'bottom':
						orientation = Communicator.ViewOrientation.Bottom;
						break;
					case 'left':
						orientation = Communicator.ViewOrientation.Left;
						break;
					case 'right':
						orientation = Communicator.ViewOrientation.Right;
						break;
					case 'front':
						orientation = Communicator.ViewOrientation.Front;
						break;
					case 'back':
						orientation = Communicator.ViewOrientation.Back;
						break;
					case 'iso':
						orientation = Communicator.ViewOrientation.Iso;
						break;
					default:
						throw new Error(`Unknown standard camera: ${ssc.standardCamera}`);
				}

				return hwv.view.setViewOrientation(orientation, 0);
			}

			if (ssc.camera) {
				const cam = hwv.view.getCamera();

				if (ssc.camera.pos) {
					cam.setPosition(new Communicator.Point3(ssc.camera.pos.x, ssc.camera.pos.y, ssc.camera.pos.z));
				}
				if (ssc.camera.target) {
					cam.setTarget(new Communicator.Point3(ssc.camera.target.x, ssc.camera.target.y, ssc.camera.target.z));
				}
				if (ssc.camera.up) {
					cam.setUp(new Communicator.Point3(ssc.camera.up.x, ssc.camera.up.y, ssc.camera.up.z));
				}

				hwv.view.setCamera(cam);
			}

			return $q.when();
		}

		function retrieveReferencePoints(ssc, hwv) {
			if (ssc.referencePoints) {
				let refPoints3DPromise;

				if (Array.isArray(ssc.referencePoints)) {
					refPoints3DPromise = $q.when(ssc.referencePoints);
				} else {
					refPoints3DPromise = hwv.model.getModelBounding().then(function (bBox) {
						return [bBox.min, bBox.max];
					});
				}

				return refPoints3DPromise.then(function (pts) {
					return pts.map(function (pt) {
						const pt3D = new Communicator.Point3(pt.x, pt.y, pt.z);
						const pt2D = hwv.view.projectPoint(pt3D);

						return {
							point3D: {
								x: pt3D.x,
								y: pt3D.y,
								z: pt3D.z
							},
							point2D: {
								x: pt2D.x,
								y: pt2D.y
							}
						};
					});
				});
			}

			return $q.when();
		}

		return {
			takeSnapshots
		};
	}
})(angular);