/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.map';

	/**
	 * @ngdoc controller
	 * @name modelMapPolygonListController
	 * @function
	 *
	 * @description
	 * Controller for the list container of map polygons.
	 **/
	angular.module(moduleName).controller('modelMapPolygonListController', ModelMapPolygonListController);

	ModelMapPolygonListController.$inject = ['$scope', 'modelViewerModelSelectionService',
		'modelViewerHoopsLoadingService', 'Communicator', '$log', 'd3',
		'platformContainerControllerService', 'modelMapPolygonDataService', 'PlatformMessenger',
		'modelMapAreaDataService', '$translate'];

	function ModelMapPolygonListController($scope, modelViewerModelSelectionService,
		modelViewerHoopsLoadingService, Communicator, $log, d3,
		platformContainerControllerService, modelMapPolygonDataService, PlatformMessenger,
		modelMapAreaDataService, $translate) {

		platformContainerControllerService.initController($scope, moduleName, '87476328055e41ceb232ab1f82a54e8f');

		const onContentResized = new PlatformMessenger();
		const onRefreshRequested = new PlatformMessenger();
		$scope.viewerConfig = {
			getUiAddOns: function () {
				return $scope.getUiAddOns();
			},
			statusFieldId: 'status',
			registerSizeChanged: function (handler) {
				onContentResized.register(handler);
			},
			unregisterSizeChanged: function (handler) {
				onContentResized.unregister(handler);
			},
			useModelSelectionService: true,
			registerRefreshRequested: function (handler) {
				onRefreshRequested.register(handler);
			},
			unregisterRefreshRequested: function (handler) {
				onRefreshRequested.unregister(handler);
			},
			additionalViewerInitialization: function (info) {
				info.viewer.view.setViewOrientation(Communicator.ViewOrientation.Top);
			}
		};
		$scope.tools.items.push(
			{
				id: 'undoDrawPolygon',
				sort: 10,
				caption: 'model.map.polygon.undoDrawPolygon',
				type: 'item',
				iconClass: 'tlb-icons ico-undo',
				fn: function () {
					modelMapPolygonDataService.undoDrawingPolygon();
				}
			}, {
				id: 'refresh',
				type: 'item',
				caption: 'model.viewer.refresh',
				iconClass: 'tlb-icons ico-refresh',
				fn: function () {
					onRefreshRequested.fire();
				}
			});

		$scope.getActiveRendererType = function () {
			return Communicator.RendererType.Server;
		};
		$scope.getActiveStreamingMode = function () {
			return Communicator.StreamingMode.Interactive;
		};

		$scope.isLightweightHoopsViewer = true;
		$scope.$watch('viewer._alreadyShutDown', function () {
			const uiAddOns = $scope.getUiAddOns();
			const whiteBoard = uiAddOns.getWhiteboard();
			if ($scope.viewer) {
				const viewer = $scope.viewer();
				if (viewer._alreadyShutDown === true) {
					whiteBoard.setInfo($translate.instant('model.viewer.modelTimeout'));
					whiteBoard.setVisible(true);
				} else if (viewer._alreadyShutDown === false) {
					whiteBoard.setVisible(false);
					updateSelectedMapArea();
				}
			}
		});

		function updateSelectedModel() {
			updateSelectedMapArea();
			const selModel = modelViewerModelSelectionService.getSelectedModel();
			if (!selModel) {
				// TODO: shutdown existing viewer
			}
		}

		function updateSelectedMapArea() {
			const uiAddOns = $scope.getUiAddOns();
			const whiteBoard = uiAddOns.getWhiteboard();

			const selArea = modelMapAreaDataService.getSelected();
			if (selArea) {
				whiteBoard.setVisible(false);
			} else {
				whiteBoard.setInfo($translate.instant('model.map.message.areaNotSelected'));
				whiteBoard.setVisible(true);
			}
			$scope.tools.update();
		}

		$scope.resizeContent = function () {
			onContentResized.fire();
			if ($scope.overlayLink) {
				$scope.overlayLink.resizeMapContent();
			}
		};
		$scope.$watch('overlayLink', function () {
			$scope.overlayLink.resizeMapContent();
		});
		// $scope.overlayLink();
		$scope.onContentResized($scope.resizeContent);

		modelMapAreaDataService.registerListLoaded(updateSelectedMapArea);
		modelMapAreaDataService.registerSelectionChanged(updateSelectedMapArea);
		modelViewerModelSelectionService.onSelectedModelChanged.register(updateSelectedModel);
		updateSelectedModel();
		updateSelectedMapArea();

		$scope.$on('$destroy', function () {
			modelMapAreaDataService.unregisterListLoaded(updateSelectedMapArea);
			modelViewerModelSelectionService.onSelectedModelChanged.unregister(updateSelectedModel);
			modelMapAreaDataService.unregisterSelectionChanged(updateSelectedMapArea);
		});
	}
})(angular);
