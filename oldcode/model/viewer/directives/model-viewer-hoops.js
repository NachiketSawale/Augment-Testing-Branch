/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name model.viewer.directive:modelViewerHoops
	 * @element div
	 * @restrict A
	 * @description Embeds the Hoops 3D Viewer. An `initViewerData` attribute on the element needs to indicate the
	 *              server URL to connect to or the SCS file URL for retrieving the 3D data.
	 */
	angular.module('model.viewer').directive('modelViewerHoops', modelViewerHoopsViewer);

	modelViewerHoopsViewer.$inject = ['$log', '$timeout', 'Communicator',
		'modelViewerHoopsOperatorService', 'modelViewerHoopsUtilitiesService',
		'modelViewerHoopsLinkService', '_'];

	function modelViewerHoopsViewer($log, $timeout, Communicator,
		customOperators, modelViewerHoopsUtilitiesService,
		modelViewerHoopsLinkService, _) {

		return {
			restrict: 'A',
			scope: false,
			link: function (scope, elem) {
				/**
				 * @ngdoc function
				 * @name showModel
				 * @function
				 * @methodOf modelViewerHoops
				 * @description Reloads the viewer with a new model.
				 * @param {String} modelName The name of the model to load.
				 * @param {Communicator.RendererType} rendererType The renderer type to use.
				 * @param {Communicator.StreamingMode} streamingMode The streaming mode to use.
				 */
				function showModel(modelName, rendererType, streamingMode) {
					let viewer;

					function resizeViewer() {
						viewer.resizeCanvas();
					}

					elem.empty();

					const viewerPrms = {
						container: elem[0],
						rendererType: rendererType,
						streamingMode: streamingMode
					};
					if (scope.viewerInitData.instanceUri) {
						viewerPrms.endpointUri = scope.viewerInitData.instanceUri;
						viewerPrms.model = modelName;
					} else if (scope.viewerInitData.modelUri) {
						viewerPrms.endpointUri = scope.viewerInitData.modelUri;
					}

					function initializeGraphicalOverlayManager(mgr) {
						const parent = elem.parent();
						parent.on('mouseenter', function () {
							mgr.enterCursor();
						});
						parent.on('mouseleave', function () {
							mgr.leaveCursor();
						});
					}

					try {
						viewer = new Communicator.WebViewer(viewerPrms);
						scope.viewer = function getViewerInstance() {
							return viewer;
						};

						if (!scope.isLightweightHoopsViewer) {
							viewer.getGraphicalOverlayManager = function () {
								return scope.graphicalOverlayManager();
							};
							if (scope.graphicalOverlayManager) {
								initializeGraphicalOverlayManager(scope.graphicalOverlayManager());
							} else {
								scope.$watch('::graphicalOverlayManager', function (newValue) {
									initializeGraphicalOverlayManager(newValue);
								});
							}
						}

						if (angular.isFunction(scope.viewerHandlers.viewerCreated)) {
							scope.viewerHandlers.viewerCreated(viewer);
						}
						if (!scope.isLightweightHoopsViewer) {
							modelViewerHoopsUtilitiesService.addDefaultShortcuts({
								viewer: scope.viewer ? scope.viewer() : null,
								viewerSettings: scope.viewerSettings
							});
						}

						if (!scope.isLightweightHoopsViewer) {
							viewer.operatorManager.clear();
						}
						viewer.focusInput(true);

						scope.focusViewer = function () {
							const el = angular.element(elem);
							el.find('div[id*="-canvas-container"]').focus();
						};

						if (!scope.isLightweightHoopsViewer) {
							const operatorsList = customOperators.registerAll(viewer, scope.bimUiSettings, scope.focusViewer, scope.viewRecord);
							scope.operators = function () {
								return operatorsList;
							};
						}

						viewer.setCallbacks(scope.viewerHandlers);
						viewer.setCallbacks({
							modelSwitched: scope.sceneReady,
							timeout: function () {
								if (!modelViewerHoopsLinkService.isViewerDiscarded(viewer)) {
									if (_.isFunction(scope.sceneTimeout)) {
										scope.sceneTimeout();
									}
								}
							},
							info: function (infoType, msg) {
								$log.info(infoType + (modelViewerHoopsLinkService.isViewerDiscarded(viewer) ? ' D' : '') + ': ' + msg);
							}
						});

						if (viewer.start()) {
							$log.info('Viewer started.');
						} else {
							$log.error('Failed to start viewer.');
						}

						elem.children('div[id*="-canvas-container"]').css('position', 'relative');

						scope.resizeViewer = resizeViewer;
					} catch (e) {
						$log.info(e);
					}
				}

				elem.addClass('model-viewer-3d-hoops');

				scope.$watch('viewerInitData', function (newValue, oldValue) {
					if ((oldValue !== newValue) || (newValue && newValue.modelUri)) {
						if (oldValue) {
							scope.viewer = null;
							scope.operators = null;
							scope.focusViewer = function () {
							};
						}

						if (newValue) {
							if (scope.modelName) {
								showModel(scope.modelName, newValue.rendererType, newValue.streamingMode);
								return;
							}
						}

						elem.empty();
					}
				});
			}
		};
	}
})(angular);
