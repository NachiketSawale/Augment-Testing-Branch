/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsCuttingService
	 * @function
	 *
	 * @description Manages cutting planes and applies them to a HOOPS viewer.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsCuttingService',
		modelViewerHoopsCuttingService);

	modelViewerHoopsCuttingService.$inject = ['_', '$q', 'Communicator',
		'modelViewerHoopsRuntimeDataService', 'modelViewerHoopsUtilitiesService',
		'platformPromiseUtilitiesService'];

	function modelViewerHoopsCuttingService(_, $q, Communicator,
		modelViewerHoopsRuntimeDataService, modelViewerHoopsUtilitiesService,
		platformPromiseUtilitiesService) {

		const defaultPlaneColor = new Communicator.Color(170, 180, 200);
		const activeColor = new Communicator.Color(255, 255, 0);

		class RotatablePlane {
			constructor(initialAngle, modelCenter, plane) {
				this.planeId = plane;
				this.defaultLocation = {
					x: modelCenter.x,
					y: modelCenter.y
				};
				this.location = {
					x: modelCenter.x,
					y: modelCenter.y
				};
				this.rotationAxis = {
					x: modelCenter.x,
					y: modelCenter.y
				};
				this.defaultAngle = initialAngle;
				this.angle = initialAngle;
				this.bottomCenter = new Communicator.Point3(modelCenter.x, modelCenter.y, 0);
			}

			prepareViewer(viewer, geo, planeIndex) {
				this.planeIndex = planeIndex;
				this.createCuttingPlane(viewer);
				return this.createGeometry(viewer, geo);
			}

			createCuttingPlane(viewer) {
				const cuttingSec = viewer.cuttingManager.getCuttingSection(1);
				while (cuttingSec.getCount() <= this.planeIndex) {
					cuttingSec.addPlane(Communicator.Plane.createFromPointAndNormal(new Communicator.Point3(0, 0, 0), new Communicator.Point3(1, 0, 0)));
				}
			}

			createGeometry(viewer, geo) {
				const result = [];
				const mdl = viewer.model;
				const that = this;

				if (this.planeMeshInstanceId) {
					mdl.setNodesVisibility([this.planeMeshInstanceId], true);
				} else {
					const planeMeshInstance = new Communicator.MeshInstanceData(geo.rotatablePlaneMeshId, undefined, undefined, undefined, undefined, undefined, Communicator.MeshInstanceCreationFlags.DoNotLight);
					planeMeshInstance.setFaceColor(defaultPlaneColor);
					planeMeshInstance.setOpacity(0.6);
					result.push(mdl.createMeshInstance(planeMeshInstance, geo.cuttingGeometryParentId).then(function (id) {
						that.planeMeshInstanceId = id;
						mdl.setInstanceModifier(Communicator.InstanceModifier.DoNotCut, [id], true);
					}));
				}
				if (!this.planeAxisMeshInstanceId) {
					const planeAxisMeshInstance = new Communicator.MeshInstanceData(geo.rotatablePlaneAxisMeshId);
					planeAxisMeshInstance.setFaceColor(activeColor);
					result.push(mdl.createMeshInstance(planeAxisMeshInstance, geo.cuttingGeometryParentId).then(function (id) {
						that.planeAxisMeshInstanceId = id;
						mdl.setInstanceModifier(Communicator.InstanceModifier.DoNotCut, [id], true);
						mdl.setNodesVisibility([id], false);
					}));
				}

				return $q.all(result).then(function () {
					that.updatePosition(viewer.model, viewer.cuttingManager.getCuttingSection(1));
				});
			}

			updatePosition(model, cuttingSection) {
				const that = this;

				const supportVector = new Communicator.Point3(this.location.x, this.location.y, 0);
				const angleRadians = this.angle / 180 * Math.PI;
				const normal = new Communicator.Point3(-Math.sin(angleRadians), Math.cos(angleRadians), 0);
				const plane = Communicator.Plane.createFromPointAndNormal(supportVector, normal);
				cuttingSection.updatePlane(this.planeIndex, plane);

				if (this.planeMeshInstanceId) {
					(function () {
						const pt = Communicator.Point3.zero();
						let ray = new Communicator.Ray(that.bottomCenter, normal);
						if (!plane.intersectsRay(ray, pt)) {
							ray = new Communicator.Ray(that.bottomCenter, new Communicator.Point3(-normal.x, -normal.y, 0));
							plane.intersectsRay(ray, pt);
						}
						that.location.x = pt.x;
						that.location.y = pt.y;

						const matrix = modelViewerHoopsUtilitiesService.createMatrix(Communicator.Matrix.createFromOffAxisRotation(new Communicator.Point3(0, 0, 1), that.angle),
							new Communicator.Matrix().setTranslationComponent(that.location.x, that.location.y, 0));
						model.setNodeMatrix(that.planeMeshInstanceId, matrix);
					})();
				}
				if (this.planeAxisMeshInstanceId) {
					model.setNodeMatrix(this.planeAxisMeshInstanceId, new Communicator.Matrix().setTranslationComponent(this.rotationAxis.x, this.rotationAxis.y, 0));
				}
			}

			setActive(model, isActive) {
				if (isActive) {
					if (this.planeMeshInstanceId) {
						model.setNodesFaceColor([this.planeMeshInstanceId], activeColor);
					}
					if (this.planeAxisMeshInstanceId) {
						model.setNodesVisibility([this.planeAxisMeshInstanceId], true);
					}
				} else {
					if (this.planeMeshInstanceId) {
						model.setNodesFaceColor([this.planeMeshInstanceId], defaultPlaneColor);
					}
					if (this.planeAxisMeshInstanceId) {
						model.setNodesVisibility([this.planeAxisMeshInstanceId], false);
					}
				}
			}

			disable(viewer) {
				if (this.planeMeshInstanceId) {
					viewer.model.setNodesVisibility([this.planeMeshInstanceId], false);
				}
				if (this.planeAxisMeshInstanceId) {
					viewer.model.setNodesVisibility([this.planeAxisMeshInstanceId], false);
				}
			}

			enable(viewer) {
				if (this.planeMeshInstanceId) {
					viewer.model.setNodesVisibility([this.planeMeshInstanceId], true);
				}
			}

			move(delta) {
				const angleRadians = this.angle / 180 * Math.PI;
				const normal = new Communicator.Point3(-Math.sin(angleRadians), Math.cos(angleRadians), 0);
				normal.normalize().scale(delta);

				this.location.x += normal.x;
				this.location.y += normal.y;

				this.rotationAxis.x += normal.x;
				this.rotationAxis.y += normal.y;
			}

			moveTo(newPos) {
				this.location.x = newPos[0];
				this.location.y = newPos[1];

				this.rotationAxis.x = newPos[0];
				this.rotationAxis.y = newPos[1];
			}

			rotate(delta) {
				const baseOffset = new Communicator.Point3(this.location.x - this.rotationAxis.x, this.location.y - this.rotationAxis.y, 0);
				const rotMatrix = Communicator.Matrix.createFromOffAxisRotation(new Communicator.Point3(0, 0, 1), delta);
				rotMatrix.transform(baseOffset, baseOffset);

				this.location.x = this.rotationAxis.x + baseOffset.x;
				this.location.y = this.rotationAxis.y + baseOffset.y;
				this.angle += delta;
			}

			rotateTo(newPos) {
				const angle = Math.atan2(-newPos[3], newPos[4]) * 180 / Math.PI;
				const baseOffset = new Communicator.Point3(this.location.x - this.rotationAxis.x, this.location.y - this.rotationAxis.y, 0);
				const rotMatrix = Communicator.Matrix.createFromOffAxisRotation(new Communicator.Point3(0, 0, 1), angle);
				rotMatrix.transform(baseOffset, baseOffset);

				this.location.x = this.rotationAxis.x + baseOffset.x;
				this.location.y = this.rotationAxis.y + baseOffset.y;
				this.angle = angle;
			}

			moveAxis(deltaX, deltaY, absolute) {
				if (absolute) {
					this.rotationAxis.x = deltaX;
					this.rotationAxis.y = deltaY;
				} else {
					this.rotationAxis.x += deltaX;
					this.rotationAxis.y += deltaY;
				}
			}

			ownsGeometry(nodeId) {
				if (this.planeMeshInstanceId) {
					if (nodeId === this.planeMeshInstanceId) {
						return true;
					}
				}
				if (this.planeAxisMeshInstanceId) {
					if (nodeId === this.planeAxisMeshInstanceId) {
						return true;
					}
				}
				return false;
			}

			tryGetAxisMovementPlane(nodeId, pt, viewer) {
				if (this.isAxisGeometry(nodeId)) {
					return this.getAxisMovementPlane(pt, viewer);
				} else {
					return null;
				}
			}

			isAxisGeometry(nodeId) {
				if (this.planeAxisMeshInstanceId) {
					if (nodeId === this.planeAxisMeshInstanceId) {
						return true;
					}
				}
				return false;
			}

			getAxisMovementPlane(pt, viewer) {
				const v = viewer.view;
				const c = v.getCamera();

				const viewDir = c.getTarget().subtract(c.getPosition()).normalize();
				viewDir.z = 0;
				const clickPlane = Communicator.Plane.createFromPointAndNormal(new Communicator.Point3(this.rotationAxis.x, this.rotationAxis.y, 0), viewDir);

				const intersectPoint = Communicator.Point3.zero();
				if (clickPlane.intersectsRay(v.raycastFromPoint(pt), intersectPoint)) {
					return Communicator.Plane.createFromPointAndNormal(intersectPoint, new Communicator.Point3(0, 0, 1));
				} else {
					return null;
				}
			}

			getPlane() {
				const supportVector = new Communicator.Point3(this.location.x, this.location.y, 0);
				const angleRadians = this.angle / 180 * Math.PI;
				const normal = new Communicator.Point3(-Math.sin(angleRadians), Math.cos(angleRadians), 0);
				return Communicator.Plane.createFromPointAndNormal(supportVector, normal);
			}

			resetPlanePosition() {
				const delta = {
					x: this.defaultLocation.x - this.location.x,
					y: this.defaultLocation.y - this.location.y
				};
				this.location.x = this.defaultLocation.x;
				this.location.y = this.defaultLocation.y;
				this.rotationAxis.x += delta.x;
				this.rotationAxis.y += delta.y;
			}

			resetAxisPosition() {
				this.rotationAxis.x = this.location.x;
				this.rotationAxis.y = this.location.y;
			}

			resetAngle() {
				const radius = this.getPlane().distanceToPoint(new Communicator.Point3(this.rotationAxis.x, this.rotationAxis.y, 0));
				const angleRadians = Math.PI + this.defaultAngle / 180 * Math.PI;
				this.location.x = this.rotationAxis.x - Math.sin(angleRadians) * radius;
				this.location.y = this.rotationAxis.y + Math.cos(angleRadians) * radius;
				this.angle = this.defaultAngle;
			}
		}

		const service = {};

		const planes = {
			x: 'x',
			y: 'y',
			z: 'z'
		};

		service.planes = planes;

		function createGeometry(viewer, geo) {
			const result = [];
			const mdl = viewer.model;
			const boundingBox = modelViewerHoopsRuntimeDataService.getBoundingBox(viewer);

			if (!_.isNumber(geo.cuttingGeometryParentId)) {
				geo.cuttingGeometryParentId = mdl.createNode(modelViewerHoopsUtilitiesService.getHelperGeometryRoot(viewer));
			}

			if (!geo.rotatablePlaneMeshId) {
				result.push((function () {
					const md = new Communicator.MeshData();
					md.setBackfacesEnabled(true);

					const totalLength = boundingBox.max.x - boundingBox.min.x + boundingBox.max.y - boundingBox.min.y + 2;

					const corners = [
						new Communicator.Point3(-totalLength / 2, 0, boundingBox.min.z - 1),
						new Communicator.Point3(totalLength / 2, 0, boundingBox.min.z - 1),
						new Communicator.Point3(totalLength / 2, 0, boundingBox.max.z + 1),
						new Communicator.Point3(-totalLength / 2, 0, boundingBox.max.z + 1)
					];
					md.addFaces(modelViewerHoopsUtilitiesService.pointsToCoordArray([
						corners[0], corners[1], corners[2],
						corners[0], corners[2], corners[3]
					]));

					return mdl.createMesh(md).then(function (id) {
						geo.rotatablePlaneMeshId = id;
					});
				})());
			}
			if (!geo.rotatablePlaneAxisMeshId) {
				result.push((function () {
					const md = new Communicator.MeshData();
					md.setBackfacesEnabled(false);

					const boundingBox = modelViewerHoopsRuntimeDataService.getBoundingBox(viewer);

					const axisTop = boundingBox.max.z + 1.25;
					const axisBottom = boundingBox.min.z - 1.25;

					const faces = modelViewerHoopsUtilitiesService.createCylinderFaces(0.1, [axisTop, axisBottom]);

					md.addFaces(modelViewerHoopsUtilitiesService.pointsToCoordArray(faces));
					md.setFaceWinding(Communicator.FaceWinding.CounterClockwise);

					return mdl.createMesh(md).then(function (id) {
						geo.rotatablePlaneAxisMeshId = id;
					});
				})());
			}

			if (!geo.zPlaneMeshInstanceId) {
				result.push((function () {
					const md = new Communicator.MeshData();
					md.setBackfacesEnabled(true);

					const boundingBox = modelViewerHoopsRuntimeDataService.getBoundingBox(viewer);
					const corners = [
						new Communicator.Point3(boundingBox.min.x - 1, boundingBox.min.y - 1, 0),
						new Communicator.Point3(boundingBox.max.x + 1, boundingBox.min.y - 1, 0),
						new Communicator.Point3(boundingBox.max.x + 1, boundingBox.max.y + 1, 0),
						new Communicator.Point3(boundingBox.min.x - 1, boundingBox.max.y + 1, 0)
					];
					md.addFaces(modelViewerHoopsUtilitiesService.pointsToCoordArray([
						corners[0], corners[1], corners[2],
						corners[0], corners[2], corners[3]
					]));

					return mdl.createMesh(md).then(function (id) {
						const mid = new Communicator.MeshInstanceData(id, undefined, undefined, undefined, undefined, undefined, Communicator.MeshInstanceCreationFlags.DoNotLight);
						mid.setFaceColor(activeColor);
						mid.setOpacity(0.6);
						return mdl.createMeshInstance(mid, geo.cuttingGeometryParentId).then(function (id) {
							geo.zPlaneMeshInstanceId = id;
							mdl.setInstanceModifier(Communicator.InstanceModifier.DoNotCut, [id], true);
						});
					});
				})());
			}

			return result;
		}

		function setZPlaneActive(geo, model, isActive) {
			if (geo.zPlaneMeshInstanceId) {
				model.setNodesFaceColor([geo.zPlaneMeshInstanceId], isActive ? activeColor : defaultPlaneColor);
			}
		}

		service.cleanViewer = function (viewer) {
			viewer.rib$cuttingGeometry = null;
		};

		service.createManager = function (viewer, viewerSettings) {
			if (!viewer.rib$cuttingGeometry) {
				viewer.rib$cuttingGeometry = {};
			}
			const cuttingGeometry = viewer.rib$cuttingGeometry;

			const mdl = viewer.model;
			const boundingBox = modelViewerHoopsRuntimeDataService.getBoundingBox(viewer);

			let meshesReady = false;
			let meshPromise = (function () {
				const meshPromises = createGeometry(viewer, cuttingGeometry);

				if (cuttingGeometry.rotatablePlanes) {
					cuttingGeometry.rotatablePlanes.forEach(function (plane) {
						plane.enable(viewer);
					});
					return $q.when(true);
				} else {
					return $q.all(meshPromises).then(function () {
						const boundingBoxCenter = modelViewerHoopsRuntimeDataService.getBoundingBox(viewer).center();
						cuttingGeometry.rotatablePlanes = [
							new RotatablePlane(0, boundingBoxCenter, planes.x),
							new RotatablePlane(90, boundingBoxCenter, planes.y)
						];
						cuttingGeometry.findPlane = function (plane) {
							for (let idx = 0; idx < cuttingGeometry.rotatablePlanes.length; idx++) {
								const currentPlane = cuttingGeometry.rotatablePlanes[idx];
								if (currentPlane.planeId === plane) {
									return currentPlane;
								}
							}
							return null;
						};

						const rotatableMeshPromises = [];
						cuttingGeometry.rotatablePlanes.forEach(function (plane, index) {
							rotatableMeshPromises.push(plane.prepareViewer(viewer, cuttingGeometry, index));
						});

						return $q.all(rotatableMeshPromises);
					});
				}
			})();

			if (!viewerSettings.cuttingPlanes) {
				viewerSettings.cuttingPlanes = {};
			}
			const settings = viewerSettings.cuttingPlanes;
			settings.isActive = settings.isActive || false;
			settings.z = settings.z || boundingBox.center().z;

			const cuttingMgr = viewer.cuttingManager;
			if (cuttingMgr.getCuttingSectionCapacity() < 3) {
				throw new Error('The current device does not support cutting planes.');
				// TODO: decline more gracefully?
			}
			cuttingMgr.setCappingFaceColor(new Communicator.Color(255, 255, 0));
			cuttingMgr.setCappingLineColor(new Communicator.Color(255, 0, 0));
			cuttingMgr.setCappingGeometryVisibility(true);

			const cuttingSec = cuttingMgr.getCuttingSection(1);
			while (cuttingSec.getCount() < 3) {
				cuttingSec.addPlane(Communicator.Plane.createFromPointAndNormal(Communicator.Point3.zero(), new Communicator.Point3(1, 0, 0)));
			}

			function updatePosition() {
				cuttingGeometry.rotatablePlanes.forEach(function (plane) {
					plane.updatePosition(mdl, cuttingSec);
				});

				const zPlane = Communicator.Plane.createFromPointAndNormal(new Communicator.Point3(0, 0, settings.z), new Communicator.Point3(0, 0, 1));
				cuttingSec.updatePlane(cuttingGeometry.rotatablePlanes.length, zPlane);

				if (meshesReady) {
					mdl.setNodeMatrix(cuttingGeometry.zPlaneMeshInstanceId, new Communicator.Matrix().setTranslationComponent(0, 0, settings.z));
				}
			}

			meshPromise = meshPromise.then(function () {
				mdl.setNodesVisibility([cuttingGeometry.zPlaneMeshInstanceId], true);
				meshesReady = true;
				updatePosition();
				meshPromise = null;
			});

			const mgr = {
				getMeshReadyPromise: () => meshPromise,
				setActivePlane: function (plane) {
					const activationFunc = function () {
						cuttingGeometry.rotatablePlanes.forEach(function (plane) {
							plane.setActive(mdl, false);
						});
						setZPlaneActive(cuttingGeometry, mdl, false);
						switch (plane) {
							case planes.x:
								cuttingGeometry.rotatablePlanes[0].setActive(mdl, true);
								break;
							case planes.y:
								cuttingGeometry.rotatablePlanes[1].setActive(mdl, true);
								break;
							case planes.z:
								setZPlaneActive(cuttingGeometry, mdl, true);
								break;
						}
					};
					if (meshPromise) {
						meshPromise.then(activationFunc);
					} else {
						activationFunc();
					}
				},
				movePlane: function (plane, delta) {
					switch (plane) {
						case planes.x:
							cuttingGeometry.rotatablePlanes[0].move(delta);
							break;
						case planes.y:
							cuttingGeometry.rotatablePlanes[1].move(delta);
							break;
						case planes.z:
							settings.z += delta;
							break;
						default:
							throw new Error('Unsupported plane: ' + plane);
					}
					updatePosition();
				},
				movePlaneTo: function (plane, newPos) {
					switch (plane) {
						case planes.x:
							cuttingGeometry.rotatablePlanes[0].moveTo(newPos);
							break;
						case planes.y:
							cuttingGeometry.rotatablePlanes[1].moveTo(newPos);
							break;
						case planes.z:
							settings.z = newPos[2];
							break;
						default:
							throw new Error('Unsupported plane: ' + plane);
					}
					updatePosition();
				},
				rotateAroundZ: function (plane, delta) {
					switch (plane) {
						case planes.x:
							cuttingGeometry.rotatablePlanes[0].rotate(delta);
							break;
						case planes.y:
							cuttingGeometry.rotatablePlanes[1].rotate(delta);
							break;
						case planes.z:
							break;
						default:
							throw new Error('Unsupported plane: ' + plane);
					}
					updatePosition();
				},
				rotatePlaneAroundZ: function (plane, newPos) {
					switch (plane) {
						case planes.x:
							cuttingGeometry.rotatablePlanes[0].rotateTo(newPos);
							break;
						case planes.y:
							cuttingGeometry.rotatablePlanes[1].rotateTo(newPos);
							break;
						case planes.z:
							break;
						default:
							throw new Error('Unsupported plane: ' + plane);
					}
					updatePosition();
				},
				moveRotationAxis: function (plane, deltaX, deltaY, absolute) {
					switch (plane) {
						case planes.x:
							cuttingGeometry.rotatablePlanes[0].moveAxis(deltaX, deltaY, absolute);
							break;
						case planes.y:
							cuttingGeometry.rotatablePlanes[1].moveAxis(deltaX, deltaY, absolute);
							break;
						case planes.z:
							break;
						default:
							throw new Error('Unsupported plane: ' + plane);
					}
					updatePosition();
				},
				toggle: function () {
					if (!cuttingSec.isActive()) {
						cuttingSec.activate();
					} else {
						cuttingSec.deactivate();
					}
				},
				activate: function () {
					if (!cuttingSec.isActive()) {
						cuttingSec.activate();
					}
				},
				deactivate: function () {
					if (cuttingSec.isActive()) {
						cuttingSec.deactivate();
					}
				},
				isCuttingActive: function () {
					return cuttingSec.isActive();
				},
				destroy: function () {
					mdl.setNodesVisibility([cuttingGeometry.zPlaneMeshInstanceId], false);
					cuttingGeometry.rotatablePlanes.forEach(function (plane) {
						plane.disable(viewer);
					});
				},
				pickPlaneFromPoint: function (pt) {
					const pickConfig = new Communicator.IncrementalPickConfig();
					pickConfig.respectVisibility = false;
					pickConfig.selectionMask = Communicator.SelectionMask.Face;

					let hitPlaneId = null;

					return viewer.view.beginRayDrillSelection(pt, 1, pickConfig).then(function (incSelId) {
						return platformPromiseUtilitiesService.doWhile(function (incSelId) {
							return viewer.view.advanceIncrementalSelection(incSelId).then(function (selItems) {
								if (_.isArray(selItems) && (selItems.length > 0)) {
									for (let i = 0; i < selItems.length; i++) {
										const selItem = selItems[i];
										const nodeId = selItem.getNodeId();
										if (cuttingGeometry.zPlaneMeshInstanceId === nodeId) {
											hitPlaneId = planes.z;
											return;
										}
										for (let idx = 0; idx < cuttingGeometry.rotatablePlanes.length; idx++) {
											const plane = cuttingGeometry.rotatablePlanes[idx];
											if (plane.ownsGeometry(nodeId)) {
												hitPlaneId = plane.planeId;
												return;
											}
										}
									}
									return incSelId;
								} else {
									return null;
								}
							});
						}, function (incSelId) {
							return !!incSelId && !hitPlaneId;
						}, incSelId).then(function () {
							return viewer.view.endIncrementalSelection(incSelId);
						});
					}).then(function () {
						return hitPlaneId;
					});
				},
				checkAxisHit: function (pt, plane) {
					return viewer.view.pickFromPoint(pt, new Communicator.PickConfig()).then(function (selItem) {
						if (selItem && (selItem.getSelectionType() !== Communicator.SelectionType.None)) {
							let nodeId = selItem.getNodeId();
							if (angular.isString(nodeId)) {
								nodeId = parseInt(nodeId, 10);
							}
							if (plane === planes.z) {
								return false;
							} else {
								const pl = cuttingGeometry.findPlane(plane);
								if (!_.isNil(pl)) {
									return pl.tryGetAxisMovementPlane(nodeId, pt, viewer);
								}
							}
						}
						return false;
					});
				},
				getPlane: function (plane) {
					let pl = null;
					if (plane === planes.z) {
						pl = Communicator.Plane.createFromPointAndNormal(new Communicator.Point3(0, 0, settings.z), new Communicator.Point3(0, 0, 1));
					} else {
						const planeObj = cuttingGeometry.findPlane(plane);
						if (!_.isNil(planeObj)) {
							pl = planeObj.getPlane();
						}
					}
					return pl;
				},
				getPlaneMovementPlane: function (pt, plane) {
					const pl = this.getPlane(plane);
					if (pl) {
						const hitPt = Communicator.Point3.zero();
						const ray = viewer.view.raycastFromPoint(pt);
						if (pl.intersectsRay(ray, hitPt)) {
							const c = viewer.view.getCamera();
							const viewDir = c.getTarget().subtract(c.getPosition()).normalize();
							return Communicator.Plane.createFromPointAndNormal(hitPt, modelViewerHoopsUtilitiesService.projectVectorToPlane(viewDir, pl));
						} else {
							return null;
						}
					} else {
						return null;
					}
				},
				resetPlanePosition: function (plane) {
					if (plane === planes.z) {
						settings.z = boundingBox.center().z;
					} else {
						const pl = cuttingGeometry.findPlane(plane);
						if (pl) {
							pl.resetPlanePosition();
						}
					}
					updatePosition();
				},
				resetAxisPosition: function (plane) {
					const pl = cuttingGeometry.findPlane(plane);
					if (pl) {
						pl.resetAxisPosition();
						updatePosition();
					}
				},
				resetPlaneAngle: function (plane) {
					const pl = cuttingGeometry.findPlane(plane);
					if (pl) {
						pl.resetAngle();
						updatePosition();
					}
				}
			};
			cuttingGeometry.manager = mgr;
			return mgr;
		};

		return service;
	}
})(angular);
