/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const modelAnnotationModule = angular.module('model.annotation');

	modelAnnotationModule.factory('modelAnnotationMarkerDisplayService',
		modelAnnotationMarkerDisplayService);

	modelAnnotationMarkerDisplayService.$inject = ['_', '$http', '$q', '$translate',
		'modelViewerModelSelectionService', 'modelViewerSubModelAlignmentService', 'modelAnnotationDataService', 'platformDialogService', 'modelViewerViewerRegistryService','modelAnnotationCameraUtilitiesService'];

	function modelAnnotationMarkerDisplayService(_, $http, $q, $translate,
		modelViewerModelSelectionService, modelViewerSubModelAlignmentService, modelAnnotationDataService, platformDialogService, modelViewerViewerRegistryService, modelAnnotationCameraUtilitiesService) {

		function generateMarkerId(marker) {
			return `M_${marker.UniformAnnotationParentId}/${marker.Id}`;
		}

		const privateState = {
			renderers: [],
			registerRenderer(renderer) {
				this.renderers.push(renderer);

				renderer.modelUpdated();
				renderer.refreshAll(this.cachedMarkers.markers);
			},
			unregisterRenderer(renderer) {
				const idx = this.renderers.indexOf(renderer);
				this.renderers.splice(idx, 1);
			},
			updateMarker(marker) {
				const mId = generateMarkerId(marker);
				const m = this.cachedMarkers.markerById[mId];
				if (m) {
					_.assign(m, marker);

					for (let renderer of this.renderers) {
						renderer.updateMarker(m);
					}
				}
			},
			addMarker(marker) {
				const mId = generateMarkerId(marker);
				this.cachedMarkers.markerById[mId] = marker;
				this.cachedMarkers.markers.push(marker);

				for (let renderer of this.renderers) {
					renderer.addMarker(marker);
				}

				//Code to get Viewer Information 
				const viewerInfo = modelViewerViewerRegistryService.getViewers();
				
				//create customButtons object dynamically
				const customButtonsObj = [];
				let i = 1;
				angular.forEach(viewerInfo, function (value, key) {					
					const newObject = {
						id: 'yesBtn_'+i,
						caption: $translate.instant('model.annotation.yesFromViewer', { viewerName: viewerInfo[key].getDisplayName() }),
						fn: function () {
							getCameraPositions(key);
						},
						autoClose: true
					};
					customButtonsObj.push(newObject);
					i++;
				});

				function getCameraPositions(viewerNumber) {
					const cameraPositions = viewerInfo[viewerNumber].getCurrentCamPos();
					marker.CameraPosition = cameraPositions;
					
					if (viewerInfo[viewerNumber].getCuttingActive()) {
						marker.CameraPosition.ClippingPlanes = viewerInfo[viewerNumber].getCuttingPlane();
					}

					const blacklistPromise = viewerInfo[viewerNumber].getFilterEngine().getBlacklist().getMeshIds();
					return $q.all({
						blacklist: blacklistPromise,
					}).then(function (results) {
						const blacklistInfo = results.blacklist;
						if (!blacklistInfo.isEmpty()) {
							marker.CameraPosition.HiddenMeshIds = blacklistInfo.useGlobalModelIds().toCompressedString();
						}
					});			
				}

				//Popup to ask user about save camera position
				platformDialogService.showDialog({
					headerText$tr$: 'model.annotation.saveCameraTitle',
					bodyText$tr$: 'model.annotation.saveCameraPositionQuestion',
					showOkButton: false,
					iconClass: 'ico-question',
					buttons: [{
						id: 'no'
					}],
					customButtons: customButtonsObj
				});				

			},
			removeMarker(marker) {
				const mId = generateMarkerId(marker);

				const markerToDelete = this.cachedMarkers.markerById[mId];
				if (markerToDelete) {
					delete this.cachedMarkers.markerById[mId];
					const idx = this.cachedMarkers.markers.indexOf(markerToDelete);
					this.cachedMarkers.markers.splice(idx, 1);

					for (let renderer of this.renderers) {
						renderer.removeMarker(marker);
					}
				}
			},
			refresh() {
				this.loadAnnoMarkersForModel(modelViewerModelSelectionService.getSelectedModelId());
			},
			updateAnnotation(annotationId) {
				const that = this;

				return $http.get(globals.webApiBaseUrl + 'model/annotation/marker/list', {
					params: {
						annotationId: annotationId
					}
				}).then(function (response) {
					for (let marker of response.data) {
						const mId = generateMarkerId(marker);
						const cachedMarker = that.cachedMarkers.markerById[mId];
						if (cachedMarker) {
							cachedMarker.EffectiveColor = marker.EffectiveColor;

							for (let renderer of that.renderers) {
								renderer.updateMarker(cachedMarker);
							}
						}
					}
				});
			},
			removeAnnotation(annotationId) {
				const that = this;

				for (let marker of that.cachedMarkers.markers.slice()) {
					if (marker.AnnotationFk === annotationId) {
						that.removeMarker(marker);
					}
				}
			},
			removeForeignAnnotationParent(uniformParentId) {
				const that = this;

				for (let marker of that.cachedMarkers.markers.slice()) {
					if (marker.UniformAnnotationParentId === uniformParentId) {
						that.removeMarker(marker);
					}
				}
			},
			loadAnnoMarkersForModel(modelId) {
				const that = this;

				that.highlightedMarkerIds = {};
				that.cachedMarkers.markers = [];
				that.cachedMarkers.markerById = {};

				let dataReadyPromise;

				if (_.isInteger(modelId)) {
					dataReadyPromise = $http.get(globals.webApiBaseUrl + 'model/annotation/marker/listbymodel', {
						params: {
							modelId: modelId
						}
					}).then(function (response) {
						for (let marker of response.data) {
							const mId = generateMarkerId(marker);
							that.cachedMarkers.markers.push(marker);
							that.cachedMarkers.markerById[mId] = marker;
						}
					});
				} else {
					dataReadyPromise = $q.when();
				}

				return dataReadyPromise.then(function () {
					for (let renderer of that.renderers) {
						renderer.refreshAll(that.cachedMarkers.markers);
					}
				});
			},
			modelUpdated() {
				for (let renderer of this.renderers) {
					renderer.modelUpdated();
				}

				privateState.refresh();
			},
			subModelTransformChanged(globalModelId) {
				for (let renderer of this.renderers) {
					renderer.subModelTransformChanged(globalModelId);
				}
			},
			setHighlight(markers) {
				const that = this;

				const newHighlight = {};
				if (Array.isArray(markers)) {
					for (let marker of markers) {
						const mId = generateMarkerId(marker);
						newHighlight[mId] = true;
					}
				}

				const changedMarkers = [];

				for (let mId of Object.keys(that.highlightedMarkerIds)) {
					if (!newHighlight[mId]) {
						const marker = that.cachedMarkers.markerById[mId];
						if (marker) {
							changedMarkers.push(marker);
						}
					}
				}
				for (let mId of Object.keys(newHighlight)) {
					if (!that.highlightedMarkerIds[mId]) {
						const marker = that.cachedMarkers.markerById[mId];
						if (marker) {
							changedMarkers.push(marker);
						}
					}
				}
				that.highlightedMarkerIds = newHighlight;

				for (let marker of changedMarkers) {
					that.updateMarker(marker);
				}
			},
			isMarkerHighlighted(marker) {
				const mId = generateMarkerId(marker);
				return this.highlightedMarkerIds[mId];
			},
			highlightedMarkerIds: {},
			cachedMarkers: {
				markers: [],
				markerById: {}
			}
		};

		class MarkerRenderer {
			constructor() {
			}

			modelUpdated() {
			}

			subModelTransformChanged(/* globalModelId */) {
			}

			refreshAll(/* markers */) {
				throw new Error('This method must be overridden in a sublcass.');
			}

			updateMarker(/* marker */) {
				throw new Error('This method must be overridden in a sublcass.');
			}

			addMarker(/* marker */) {
				throw new Error('This method must be overridden in a sublcass.');
			}

			removeMarker(/* marker */) {
				throw new Error('This method must be overridden in a sublcass.');
			}

			dispose() {
				privateState.unregisterRenderer(this);
			}
		}

		modelViewerModelSelectionService.onSelectedModelChanged.register(function modelChanged() {
			privateState.modelUpdated();
		});

		modelViewerSubModelAlignmentService.registerSubModelTransformationChanged(function subModelTransformChanged() {
			// TODO: get more specific information in order to update just annotations from the changed sub-model
			privateState.modelUpdated();
		});

		modelAnnotationDataService.registerItemsDeleted(function annotationsDeleted(annotations) {
			for (let anno of annotations) {
				privateState.removeAnnotation(anno.Id);
			}
		});

		return {
			MarkerRenderer: MarkerRenderer,
			generateMarkerId: generateMarkerId,
			refreshMarkers() {
				privateState.refresh();
			},
			updateAnnotation(annotationId) {
				privateState.updateAnnotation(annotationId);
			},
			removeAnnotation(annotationId) {
				privateState.removeAnnotation(annotationId);
			},
			updateMarker(marker) {
				privateState.updateMarker(marker);
			},
			addMarker(marker) {
				privateState.addMarker(marker);
			},
			removeMarker(marker) {
				privateState.removeMarker(marker);
			},
			removeAnnotationParent(uniformParentId) {
				privateState.removeForeignAnnotationParent(uniformParentId);
			},
			registerRenderer: renderer => privateState.registerRenderer(renderer),
			clearHighlight() {
				privateState.setHighlight([]);
			},
			setHighlight(markers) {
				privateState.setHighlight(Array.isArray(markers) ? markers : []);
			},
			isMarkerHighlighted(marker) {
				return privateState.isMarkerHighlighted(marker);
			}
		};
	}
})(angular);
