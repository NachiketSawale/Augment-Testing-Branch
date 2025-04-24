/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationHoopsOverlayService';

	myModule.factory(svcName, modelAnnotationHoopsOverlayService);

	modelAnnotationHoopsOverlayService.$inject = ['modelAnnotationOverlayService',
		'modelViewerHoopsLinkService', '_', '$timeout'];

	function modelAnnotationHoopsOverlayService(modelAnnotationOverlayService,
		modelViewerHoopsLinkService, _, $timeout) {

		const ViewerAdapter = modelAnnotationOverlayService.ViewerAdapter;

		class HoopsViewerAdapter extends ViewerAdapter {
			constructor(viewer) {
				super();
				const that = this;

				that._viewer = viewer;

				that._cameraUpdated = _.debounce(function notifyUpdateCamera() {
					//that._fireViewportUpdated();
					that._fireViewportUpdated(that._generateInfo());

				}, {
					wait: 750,
					maxWait: 3000
				});
				that._viewer.setCallbacks({
					camera: that._cameraUpdated
				});
			}

			enrichDrawingData(drawingData) {
				_.assign(drawingData, this._generateInfo());
			}

			_generateInfo() {
				const camera = this._viewer.view.getCamera();
				const camPos = camera.getPosition();
				const camDir = camera.getTarget().subtract(camPos);
				return {
					spatialInfo: {
						actor: {
							x: camPos.x,
							y: camPos.y,
							z: camPos.z
						},
						viewingDirection: {
							x: camDir.x,
							y: camDir.y,
							z: camDir.z
						}
					}
				};
			}

			findNearbyMeshes() {
				// workaround around HC bug where the promise returned from beginSphereSelection never gets resolved
				// if called right after a camera movement - reported to TS3D as SDHC-18344
				const that = this;
				return $timeout(function () {
					return modelViewerHoopsLinkService.findMeshesNearPoint(that._viewer, that._viewer.view.getCamera().getPosition(), 20);
				}, 50);
			}

			retrieveMeshCenter(subModelId, meshId) {
				const nodeId = modelViewerHoopsLinkService.meshToViewerId(this._viewer, {
					subModelId: subModelId,
					meshId: meshId
				});
				return this._viewer.model.getNodesBounding([nodeId]).then(bBox => bBox.center());
			}

			getAnnotationVisibility() {
				return this._viewer.rib$annotationTypeVisibility;
			}

			finalize() {
				this._viewer.unsetCallbacks({
					camera: this._cameraUpdated
				});

				super.finalize();
			}
		}

		return {
			HoopsViewerAdapter: HoopsViewerAdapter
		};
	}
})(angular);
