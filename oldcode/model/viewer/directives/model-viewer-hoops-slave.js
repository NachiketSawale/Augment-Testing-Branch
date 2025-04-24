/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name model.viewer.directive:modelViewerHoopsSlave
	 * @element div
	 * @restrict A
	 * @description Embeds the HOOPS 3D Viewer with limited features.
	 */
	angular.module('model.viewer').directive('modelViewerHoopsSlave', modelViewerHoopsSlave);

	modelViewerHoopsSlave.$inject = ['$timeout', '$translate', 'Communicator',
		'modelViewerHoopsOperatorService', 'modelViewerHoopsEndpointService',
		'modelViewerHoopsLinkService', 'modelViewerViewerRegistryService', '$log'];

	function modelViewerHoopsSlave($timeout, $translate, Communicator,
		customOperators, modelViewerHoopsEndpointService,
		modelViewerHoopsLinkService, viewerRegistry, $log) {

		return {
			restrict: 'A',
			scope: false,
			link: function (scope, elem/* , attrs */) {
				const vd = scope.rib$viewerData;
				const viewerElId = 'viewer-' + vd.viewerId;
				let loadedModelName = null;

				vd.viewRecord = (function () {
					const viewerActions = modelViewerHoopsLinkService.createActions(scope);
					viewerActions.updateNumber = function () {
						/* vd.externalWindow.document.title = $translate.instant('model.viewer.hoops.numberedWindowFullTitle', {
							name: name,
							filter: $translate.instant(modelViewerModelSelectionService.filterById[vd.filterId].stateKey)
						}); */
					};

					const viewerInfo = new viewerRegistry.ViewerInfo(viewerElId, 'model.viewer.hoops.windowTitle', 'model.viewer.hoops.numberedWindowTitle', viewerActions);

					return viewerRegistry.registerViewer(viewerInfo, viewerActions);
				})();

				/**
				 * @ngdoc function
				 * @name showModel
				 * @function
				 * @methodOf modelViewerHoopsSlave
				 * @description Reloads the viewer with a new model.
				 * @param {String} modelName The name of the model to load.
				 */
				function showModel(modelName) {
					shutdownViewer();
					loadedModelName = modelName;
					if (modelName) {
						modelViewerHoopsEndpointService.retrieveInstanceUri(Communicator.RendererType.Client)
							.then(function (instanceUri) {
								if (instanceUri) {
									elem.empty();

									vd.mainBody.append('<div id="' + viewerElId + '" style="width: 640px; height: 480px"></div>');

									const viewer = scope.viewer = new Communicator.WebViewer({
										containerId: viewerElId,
										endpointUri: instanceUri,
										model: modelName,
										rendererType: Communicator.RendererType.Client,
										streamingMode: Communicator.StreamingMode.Interactive
									});

									viewer.operatorManager.clear();
									viewer.focusInput(true);

									scope.focusViewer = function () {
										const el = angular.element(elem);
										el.find('#' + viewerElId + '-canvas-container').focus();
									};

									viewer.setCallbacks({
										modelStructureReady: function () {
											const viewerEl = vd.mainBody.find('#' + viewerElId);
											viewerEl.detach();
											elem.append(viewerEl[0]);

											vd.assignOperators(viewer);

											vd.viewRecord.setIsReady(true);
										}
									});

									viewer.start();
									// TODO: else handle error
								}
							});
					}
				}

				/**
				 * @ngdoc function
				 * @name shutdownViewer
				 * @function
				 * @methodOf modelViewerHoopsSlave
				 * @description Issues a shutdown command to the active viewer, if any.
				 */
				function shutdownViewer() {
					if (vd.viewRecord) {
						vd.viewRecord.setIsReady(false);
					}
					if (scope.viewer) {
						const viewerEl = elem.find('#' + viewerElId);
						try {
							scope.viewer.operatorManager.clear();

							viewerEl.detach();
							vd.mainBody.append(viewerEl[0]);

							scope.viewer.shutdown();
						} catch (e) {
							$log.error(e);
						} finally {
							viewerEl.detach();
						}

						scope.viewer = null;
						loadedModelName = null;
					}
				}

				vd.viewRecord.setFilterAndOdsId(vd.filterId, '-1')
					.then(function () {
						scope.$watch('modelName', function (newValue) {
							if (loadedModelName !== newValue) {
								showModel(newValue);
							}
						});

						showModel(scope.modelName);
					});

				scope.$on('$destroy', function () {
					shutdownViewer();
					if (vd.viewRecord) {
						viewerRegistry.unregisterViewer(viewerElId);
						vd.viewRecord = null;
					}
				});
			}
		};
	}
})(angular);
