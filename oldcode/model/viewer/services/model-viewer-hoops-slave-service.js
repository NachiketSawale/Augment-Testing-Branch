/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsSlaveService
	 * @function
	 * @requires
	 *
	 * @description Displays a HOOPS 3D viewer in a separate browser tab/window. It is very limited in its features and
	 *              is completely controlled by the main application.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsSlaveService', ['$window', '$compile', '$rootScope',
		'modelViewerHoopsEndpointService', 'Communicator', 'modelViewerModelSelectionService',
		'modelViewerHoopsOperatorService', 'modelViewerUtilitiesService',
		function ($window, $compile, $rootScope, modelViewerHoopsEndpointService, Communicator,
		          modelViewerModelSelectionService, modelViewerHoopsOperatorService, viewerUtils) {
			var service = {};

			var windowId = 'eb308c53aab142ac938f54f31298d398';
			var nextWindowIndex = 1;

			/**
			 * @ngdoc function
			 * @name showViewerWindow
			 * @function
			 * @methodOf modelViewerHoopsSlaveService
			 * @description Displays a limited 3D viewer in a separate window.
			 * @param {String} filterId The ID of the filter applied in the 3D view.
			 */
			service.showViewerWindow = function (filterId) {
				var winScope = $rootScope.$new();

				winScope.viewerSettings = {
					renderMode: 'c',
					streamingMode: 'l',
					transitions: true,
					defaultView: 'Iso',
					projection: 'p',
					drawingMode: 's',
					backgroundColor: new viewerUtils.RgbColor(255, 255, 255),
					selectionColor: new viewerUtils.RgbColor(255, 255, 0),
					showModelName: true,
					camOperator: 'orbit',
					preventTimeout: false,
					antiAliasing: '-'
				};

				var win = $window.open(globals.appBaseUrl + 'model.viewer/partials/model-viewer-external.html', '_blank');

				function updateModel() {
					var modelInfo = modelViewerModelSelectionService.getSelectedModel();
					if (modelInfo) {
						winScope.modelName = modelInfo.modelName;
					} else {
						winScope.modelName = null;
					}
				}

				modelViewerModelSelectionService.onSelectedModelChanged.register(updateModel);

				win.onload = function () {
					win.onunload = function () {
						modelViewerModelSelectionService.onSelectedModelChanged.unregister(updateModel);
						winScope.$destroy();
					};

					var winBodyEl = angular.element(win.document.body);

					var localBodyEl = angular.element(document.body);
					winScope.rib$viewerData = {
						mainBody: localBodyEl,
						viewerId: windowId + '-' + nextWindowIndex,
						externalWindow: win,
						assignOperators: function (viewer) {
							var op = modelViewerHoopsOperatorService.operators.orbitOperator(viewer, {}, winScope.focusViewer);
							var opId = viewer.operatorManager.registerCustomOperator(op);
							viewer.operatorManager.push(opId);
						},
						filterId: filterId
					};
					nextWindowIndex++;

					winBodyEl.append($compile('<div data-model-viewer-hoops-slave></div>')(winScope));

					if (modelViewerModelSelectionService.getSelectedModelId()) {
						updateModel();
					}
				};
			};

			/**
			 * @ngdoc function
			 * @name addMainEntityWindowToolbarButton
			 * @function
			 * @methodOf modelViewerHoopsSlaveService
			 * @description Adds a button for opening a 3D viewer in a separate browser window to a toolbar.
			 * @param {Object} tools The toolbar definition.
			 */
			service.addMainEntityWindowToolbarButton = function (tools) {
				if (service.isSlaveEnabled()) {
					tools.items.push({
						id: 'extViewer',
						caption: 'model.viewer.mainEntityViewerWindow',
						type: 'item',
						iconClass: 'tlb-icons ico-view-extwindow',
						fn: function () {
							service.showViewerWindow('moduleContext');
						}
					});
				}
			};

			/**
			 * @ngdoc function
			 * @name isSlaveEnabled
			 * @function
			 * @methodOf modelViewerHoopsSlaveService
			 * @description Indicates whether the slave window feature is enabled. In some application versions, the
			 *              feature may be disabled for maintenance reasons, as not all versions of HOOPS Communicator
			 *              support transferring the viewer into external browser windows/tabs.
			 * @return {Boolean} A value that indicates whether the feature is enabled.
			 */
			service.isSlaveEnabled = function () {
				return false;
			};

			return service;
		}]);
})(angular);
