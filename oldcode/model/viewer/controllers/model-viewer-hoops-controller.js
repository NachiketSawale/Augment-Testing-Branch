/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc controller
	 * @name model.viewer.controller:modelViewerHoopsController
	 *
	 * @description Controller for the {@link modelViewerHoops} directive.
	 */
	const moduleName = 'model.viewer';
	angular.module(moduleName).controller('modelViewerHoopsController', modelViewerHoopsController);

	modelViewerHoopsController.$inject = ['_', '$scope', '$rootScope', '$translate', 'Communicator', 'modelViewerModelSelectionService', 'modelViewerHoopsOperatorService',
		'mainViewService', 'modelViewerModelSettingsService', '$timeout',
		'modelViewerViewerRegistryService', 'modelViewerHoopsLinkService', 'modelViewerHoopsUtilitiesService',
		'modelMainViewpointQuickCreateService', 'modelViewerUtilitiesService',
		'modelMainObjectSidebarService', 'platformScopedConfigDialogService',
		'basicsCommonConfigLocationListService', 'modelViewerDragdropService', 'modelViewerHoopsEndpointService',
		'modelViewerHoopsRuntimeDataService', '$sce', 'platformDragdropService', 'modelViewerFixedModuleConfigurationService',
		'modelViewerHoopsMarkerService', 'modelMainObjectDataService',
		'modelMainValueTypeService', 'modelViewerSelectorRegistrationService',
		'modelViewerCompositeModelObjectSelectionService', 'modelViewerObjectTreeService',
		'modelViewerHoopsLoadingService', 'modelViewerHoopsSubModelFilterMenuService',
		'modelViewerHoopsMinimapService', 'modelViewerScsFileSelectionService', 'modelViewerCombinedFilterService',
		'modelViewerFilterMenuService', 'modelViewerSelectabilityService',
		'modelViewerHoopsFilterEngineService', 'modelViewerHlSchemeMenuService', '$log',
		'modelViewerStatusBarService', 'modelMainProgressReportingService',
		'modelViewerHoopsSettingsManagementService', 'basicsCommonDrawingUtilitiesService',
		'modelAnnotationOverlayService', 'modelViewerHoopsOverlayService',
		'modelAnnotationHoopsOverlayService',
		'modelAnnotationHoopsMarkerDisplayService', 'modelAnnotationQuickCreateService',
		'modelMeasurementOverlayService', 'modelAnnotationVisibilityStateService', 'modelProjectSelectedModelInfoDialogService',
		'modelMainViewpointDataService', 'basicsCommonPermissionSummaryService'];

	function modelViewerHoopsController(_, $scope, $rootScope, $translate, Communicator, viewerDataService, customOperators,
		mainViewService, modelSettingsService, $timeout,
		viewerRegistry, modelViewerHoopsLinkService, viewerImplUtils,
		modelMainViewpointQuickCreateService, viewerUtils,
		objectSidebarSvc, scopedCfgDialogSvc,
		basicsCommonConfigLocationListService, modelViewerDragdropService,
		modelViewerHoopsEndpointService, modelViewerHoopsRuntimeDataService, $sce,
		platformDragdropService, modelViewerFixedModuleConfigurationService,
		modelViewerHoopsMarkerService, modelMainObjectDataService,
		modelMainValueTypeService,
		modelViewerSelectorRegistrationService,
		modelViewerCompositeModelObjectSelectionService, modelViewerObjectTreeService,
		modelViewerHoopsLoadingService, modelViewerHoopsSubModelFilterMenuService,
		modelViewerHoopsMinimapService, modelViewerScsFileSelectionService,
		modelViewerCombinedFilterService, modelViewerFilterMenuService,
		modelViewerSelectabilityService, modelViewerHoopsFilterEngineService,
		modelViewerHlSchemeMenuService, $log, modelViewerStatusBarService,
		modelMainProgressReportingService, modelViewerHoopsSettingsManagementService,
		basicsCommonDrawingUtilitiesService, modelAnnotationOverlayService,
		modelViewerHoopsOverlayService, modelAnnotationHoopsOverlayService,
		modelAnnotationHoopsMarkerDisplayService, modelAnnotationQuickCreateService,
		modelMeasurementOverlayService, modelAnnotationVisibilityStateService,
		modelProjectSelectedModelInfoDialogService, modelMainViewpointDataService, basicsCommonPermissionSummaryService) {

		$scope.minimapData = {};

		function isToolsReady() {
			if ($scope.tools) {
				return true;
			}

			$log.warn('3D viewer tools accessed after they have been released.');
			return false;
		}

		var viewerMode = (function () {
			var result = $scope.getContentValue('mode');
			switch (result) {
				case 'scs':
					return viewerUtils.viewerModes.scs;
				default:
					return viewerUtils.viewerModes.selectedModel;
			}
		})();

		switch (viewerMode) {
			case viewerUtils.viewerModes.selectedModel:
				modelViewerFixedModuleConfigurationService.updateModelSelectionSource();
				break;
		}

		var viewUUID = $scope.getContentValue('uuid');

		var settingsMgr = modelViewerHoopsSettingsManagementService.createManager(viewUUID);

		$scope.$parent.disableNavigationShortCut = true;

		function getSelectedModel() {
			switch (viewerMode) {
				case viewerUtils.viewerModes.selectedModel:
					return viewerDataService.getSelectedModel();
				case viewerUtils.viewerModes.scs:
					return modelViewerScsFileSelectionService.getSelectedModel();
				default:
					throw new Error('Unsupported viewer mode: ' + viewerMode);
			}
		}

		let overlayManager;
		$scope.setOverlayManager = function (scMgr) {
			overlayManager = scMgr;
		};

		var filterSelectorMenu, staticHlSchemeSelectorMenu;

		var statusBarLink;
		switch (viewerMode) {
			case viewerUtils.viewerModes.selectedModel:
				$scope.supportsMinimap = true;

				$scope.ddDummyTarget = new platformDragdropService.DragdropTarget(platformDragdropService.dragAreas.main, viewUUID);
				$scope.ddTarget = new platformDragdropService.DragdropTarget(platformDragdropService.dragAreas.main, viewUUID);
				$scope.ddTarget.canDrop = function (info) {
					if (info.draggedData && info.draggedData.modelDataSource) {
						return info.draggedData.modelDataSource.canDrop(info);
					} else {
						return false;
					}
				};
				$scope.ddTarget.drop = function (info) {
					if (info.draggedData && info.draggedData.modelDataSource) {
						info.draggedData.modelDataSource.drop(info);
					}
				};
				$scope.ddTarget.getAllowedActions = function () {
					return [platformDragdropService.actions.link];
				};

				statusBarLink = modelViewerStatusBarService.initializeStatusBar($scope, {
					modifyCombinedFilter: function () {
						filterSelectorMenu.modifyCombinedFilter();
					}
				});
				break;
		}

		var viewDisplayName = $scope.getContentValue('title');

		var unbindHandlers = [];

		// scope variables/functions
		$scope.bimUiSettings = {};
		_.assign($scope.bimUiSettings, {
			camOperator: 'orbit',
			markerSettings: {},
			filter: 'disabled'
		}, mainViewService.customData(viewUUID, 'viewerSettings'));
		(function removeLegacySettings(settingsObj) {
			['renderMode', 'streamingMode', 'transitions', 'defaultView', 'projection', 'drawingMode',
				'backgroundColor', 'selectionColor', 'showModelName', 'showSelectionColor', 'showInputInfo',
				'perventTimeout', 'antiAliasing', 'chunkedUpdates'].forEach(function (pn) {
					_.unset(settingsObj, pn);
				});
		})($scope.bimUiSettings);

		/**
		 * @ngdoc function
		 * @name saveUiSettings
		 * @function
		 * @methodOf modelViewerHoopsController
		 * @description Saves the current viewer settings to the database.
		 */
		function saveUiSettings() {
			mainViewService.customData(viewUUID, 'viewerSettings', $scope.bimUiSettings);
		}

		function getActiveRendererType() {
			return viewerImplUtils.stringToRendererType($scope.viewerSettings.renderMode);
		}

		function getActiveStreamingMode() {
			return viewerImplUtils.stringToStreamingMode($scope.viewerSettings.streamingMode);
		}

		$scope.getActiveProjection = function () {
			return viewerImplUtils.stringToProjectionMode($scope.viewerSettings.projection);
		};
		$scope.getActiveDrawingMode = function () {
			return viewerImplUtils.stringToDrawingMode($scope.viewerSettings.drawingMode);
		};
		$scope.getActiveAntiAliasingMode = function () {
			return viewerImplUtils.stringToAntiAliasingMode($scope.viewerSettings.antiAliasing);
		};

		/**
		 * @ngdoc function
		 * @name applyLiveSwitchableViewerSettings
		 * @function
		 * @methodOf modelViewerHoopsController
		 * @description Applies any settings that can be modified without reloading the page.
		 */
		function applyLiveSwitchableViewerSettings() {
			var viewer = $scope.viewer();
			if ($scope.getActiveProjection() !== viewer.view.getProjectionMode()) {
				viewer.view.setProjectionMode($scope.getActiveProjection());
			}
			viewer.setClientTimeout($scope.viewerSettings.preventTimeout ? 600 : 15, 14);
			viewer.view.setDrawMode($scope.getActiveDrawingMode());
			viewer.view.setAntiAliasingMode($scope.getActiveAntiAliasingMode());
			viewer.view.setLineVisibility(true);

			if (manipOperatorSelector) {
				manipOperatorSelector.type = $scope.viewerSettings.groupManipOps ? 'dropdown-btn' : 'sublist';
			}
			if (camOperatorSelector) {
				camOperatorSelector.type = $scope.viewerSettings.groupCamOps ? 'dropdown-btn' : 'sublist';
			}
			if (annotationTools) {
				annotationTools.type = $scope.viewerSettings.groupAnno ? 'dropdown-btn' : 'sublist';
			}
			$scope.tools.update();

			applyColorSettings();
		}

		var viewRecord;

		var modelSettings = null;

		/**
		 * @ngdoc function
		 * @name applyColorSettings
		 * @function
		 * @methodOf modelViewerHoopsController
		 * @description Applies color-related and visibility-related settings from various differently prioritized
		 *              sources.
		 */
		function applyColorSettings() {
			if (!$scope.viewer || !viewRecord) {
				return;
			}
			if (_.isFunction($scope.viewer)) {
				let hwv = $scope.viewer();
				if (hwv && modelViewerHoopsLinkService.isViewerDiscarded($scope.viewer())) {
					return;
				}
			}

			var bgColor = basicsCommonDrawingUtilitiesService.intToRgbColor($scope.viewerSettings.backgroundColor);
			var bgColor2;
			if (_.isInteger($scope.viewerSettings.backgroundColor2)) {
				bgColor2 = basicsCommonDrawingUtilitiesService.intToRgbColor($scope.viewerSettings.backgroundColor2);
			} else {
				bgColor2 = bgColor;
			}
			var selColor = basicsCommonDrawingUtilitiesService.intToRgbColor($scope.viewerSettings.selectionColor);

			if (modelSettings && modelSettings.displaySettings) {
				if (modelSettings.displaySettings.selColor) {
					selColor = modelSettings.displaySettings.selColor;
				}
			}

			var fe = modelViewerHoopsFilterEngineService.getFilterEngine($scope.viewer());
			if (fe) {
				fe.setDefaultBackgroundColor([bgColor, bgColor2]);
				fe.setDefaultSelectionColor(selColor);
			}

			if (modelSettings && modelSettings.displaySettings) {
				$scope.viewer().view.setBackfacesVisible(Boolean(modelSettings.displaySettings.showBackfaces));
				if (modelSettings.displaySettings) {
					viewRecord.setShowModelByDefault(modelSettings.displaySettings.showModel);
				} else {
					viewRecord.setShowModelByDefault(false);
				}
			}
		}

		$scope.path = globals.appBaseUrl;
		$scope.sceneTimeout = function () {
			setIsReady(false);
			if ($scope.viewer) {
				$scope.viewer().operatorManager.clear();
			}
			$scope.$evalAsync(function () {
				showStatusInfo($translate.instant('model.viewer.modelTimeout'));
			});
			$scope.viewer = null;
			$scope.instanceUri = null;
			if (statusBarLink) {
				statusBarLink.updateFields([{
					id: 'status',
					value: $translate.instant('model.viewer.loading.disconnected')
				}]);
			}
		};
		$scope.modelData = {};
		$scope.focusViewer = function () {
		};

		viewRecord = (function () {
			switch (viewerMode) {
				case viewerUtils.viewerModes.selectedModel:
					var viewerActions = modelViewerHoopsLinkService.createActions($scope);
					viewerActions.updateNumber = function (name, icon) {
						$scope.$evalAsync(function () {
							$scope.setIconClass(icon);
						});
					};

					var viewerInfo = new viewerRegistry.ViewerInfo(viewUUID, viewDisplayName, 'model.viewer.hoops.numberedTitle', viewerActions);

					return viewerRegistry.registerViewer(viewerInfo, viewerActions);
				default:
					return null;
			}
		})();
		$scope.viewRecord = viewRecord;
		if (viewRecord) {
			// TODO: load and save (?) filter and highlighting scheme
			/* viewRecord.setFilterAndOdsId($scope.viewerSettings.filter, $scope.viewerSettings.ods).then(function () {
				$scope.viewerSettings.filter = viewRecord.info.getFilterId();
				$scope.viewerSettings.ods = viewRecord.info.getOdsId();

				// TODO: select active filter
				// TODO: selector active static highlighting scheme
				if (filterSelector && odsSelector) {
					$scope.tools.update();
				}
			}); */

			unbindHandlers.push(function () {
				viewerRegistry.unregisterViewer(viewUUID);
			});
		}

		function setIsReady(isReady) {
			if (viewRecord) {
				viewRecord.setIsReady(isReady);
				if (isReady) {
					if ($scope.viewer) {
						var fe = modelViewerHoopsFilterEngineService.getFilterEngine($scope.viewer());
						if (filterSelectorMenu && fe) {
							filterSelectorMenu.setFilterEngine(fe);
							staticHlSchemeSelectorMenu.setFilterEngine(fe);
						}
					}
				}
			}

			if (!isReady) {
				if ($scope.viewer) {
					var viewer = $scope.viewer();
					if (_.isFunction(viewer.rib$unlinkMinimap)) {
						viewer.rib$unlinkMinimap();
					}
				}
			}
		}

		/**
		 * @ngdoc function
		 * @name selectCustomCameraPosition
		 * @function
		 * @methodOf modelViewerHoopsController
		 * @description Switches the view to a stored camera position.
		 * @param {CameraPosition} camPos The new camera position.
		 */
		function selectCustomCameraPosition(camPos) {
			var view = $scope.viewer().view;
			var camera = view.getCamera();

			camera.setPosition(new Communicator.Point3(camPos.pos.x, camPos.pos.y, camPos.pos.z));
			camera.setTarget(new Communicator.Point3(camPos.trg.x, camPos.trg.y, camPos.trg.z));
			camera.setUp(new Communicator.Point3(0, 0, 1));

			view.setCamera(camera, $scope.viewerSettings.transitions ? 500 : 0);
		}

		var storedCameraPositionSelector;

		var camPosSelectorMgr = null;

		/**
		 * @ngdoc function
		 * @name updateCustomCameraPositionItems
		 * @function
		 * @methodOf modelViewerHoopsController
		 * @description Updates the menu for selecting stored camera positions.
		 */
		function updateCustomCameraPositionItems() {
			return modelMainViewpointDataService.createMenuItems(() => viewRecord, true).then(function (menuItems) {
				if (isToolsReady()) {
					camPosSelectorMgr.updateItems(menuItems);

					$scope.tools.update();
				}
			});
		}

		switch (viewerMode) {
			case viewerUtils.viewerModes.selectedModel:
				camPosSelectorMgr = basicsCommonConfigLocationListService.createMenuItems([]);
				storedCameraPositionSelector = camPosSelectorMgr.menuItem;

				/**
				 * @ngdoc function
				 * @name addCameraPosition
				 * @function
				 * @methodOf modelViewerHoopsController
				 * @description Adds the current camera position to the list of stored camera positions.
				 */
				$scope.addCameraPosition = function () {
					modelMainViewpointQuickCreateService.addViewpoint(viewRecord).then(function (vp) {
						if (vp) {
							return updateCustomCameraPositionItems();
						}
					});
				};

				filterSelectorMenu = modelViewerFilterMenuService.createMenu({
					filterId: $scope.bimUiSettings.filter,
					combinedFilter: _.isObject($scope.bimUiSettings.combinedFilter) ? $scope.bimUiSettings.combinedFilter : null,
					menuUpdated: function () {
						if ($scope.tools) {
							$scope.tools.update();
						}
					}
				});
				unbindHandlers.push(function () {
					filterSelectorMenu.destroy();
				});
				filterSelectorMenu.registerFilterChanged(function (filterSettings) {
					var changeDetected = false;
					if ($scope.bimUiSettings.filter !== filterSettings.filterId) {
						$scope.bimUiSettings.filter = filterSettings.filterId;
						changeDetected = true;
					}
					if (_.isObject(filterSettings.combinedFilter)) {
						$scope.bimUiSettings.combinedFilter = filterSettings.combinedFilter;
						changeDetected = true;
					}
					if (changeDetected) {
						saveUiSettings();
					}

					if (statusBarLink) {
						filterSettings.translate();
						statusBarLink.updateFields([{
							id: 'filter',
							value: filterSettings.title,
							iconClass: filterSettings.iconClass
						}]);
					}
				});

				staticHlSchemeSelectorMenu = modelViewerHlSchemeMenuService.createMenu(_.isNumber($scope.bimUiSettings.staticHlSchemeId) ? {
					hlSchemeId: $scope.bimUiSettings.staticHlSchemeId
				} : null, {
					menuUpdated: function () {
						$scope.tools.update();
					}
				});
				staticHlSchemeSelectorMenu.registerHlSchemeChanged(function (hlSchemeSettings) {
					var changeDetected = false;
					if ($scope.bimUiSettings.staticHlSchemeId !== hlSchemeSettings.hlSchemeId) {
						$scope.bimUiSettings.staticHlSchemeId = hlSchemeSettings.hlSchemeId;
						changeDetected = true;
					}
					if (changeDetected) {
						saveUiSettings();
					}
				});
				break;
		}

		function configureViewer() {
			return settingsMgr.configure().then(function (newConfig) {
				if (newConfig) {
					$scope.viewerSettings = newConfig;
					if ($scope.viewer) {
						var viewer = $scope.viewer();
						if ((getActiveRendererType() !== viewer.getRendererType()) || (getActiveStreamingMode() !== viewer.getStreamingMode())) {
							refreshViewerPage();
						} else {
							applyLiveSwitchableViewerSettings();
						}
					}
				}
			});
		}

		/**
		 * @ngdoc function
		 * @name refreshViewerPage
		 * @function
		 * @methodOf modelViewerHoopsController
		 * @description Generates a new web viewer URL in order to force a fresh reload of the page (to retrieve a
		 *              new server URL) instead of fetching a previously loaded version from the cache.
		 */
		function refreshViewerPage() {
			modelSelectionChanged();
		}

		/**
		 * @ngdoc function
		 * @name refreshViewerPage
		 * @function
		 * @methodOf modelViewerHoopsController
		 * @description Generates a new web viewer URL in order to force a fresh reload of the page (to retrieve a
		 *              new server URL) instead of fetching a previously loaded version from the cache.
		 */
		$scope.refreshViewerPage = refreshViewerPage;

		$scope.onContentResized(function () {
			if ($scope.viewer) {
				$scope.resizeViewer();
			}
			if (overlayManager) {
				overlayManager.updateSize();
			}
		});

		/**
		 * @ngdoc function
		 * @name zoom
		 * @function
		 * @methodOf modelViewerHoopsController
		 * @description Zooms in or out.
		 * @param {String} key The ID of the button.
		 * @param {Object} btn The button that invoked the method.
		 */
		$scope.zoom = function (key, btn) {
			if (btn.zoomIn) {
				customOperators.zoomIn($scope.viewer(), 3);
			} else {
				customOperators.zoomOut($scope.viewer(), 3);
			}
			$scope.focusViewer();
		};

		/**
		 * @ngdoc function
		 * @name zoomFit
		 * @function
		 * @methodOf modelViewerHoopsController
		 * @description Zooms the camera so the whole model is visible in the viewport.
		 */
		$scope.zoomFit = function () {
			$scope.viewer().view.fitWorld($scope.viewerSettings.transitions ? 500 : 0);
			$scope.focusViewer();
		};

		var defaultViewItems = _.groupBy(_.map(viewerImplUtils.getDefaultViews({
			viewer: function () {
				return $scope.viewer ? $scope.viewer() : null;
			},
			viewerSettings: function () {
				return $scope.viewerSettings;
			}
		}), function (v, index) {
			return {
				id: v.id,
				group: index % 2,
				caption: v.title,
				type: 'item',
				iconClass: 'tlb-icons ico-view-' + v.iconId,
				fn: function () {
					v.activate(false);
				}
			};
		}), 'group');
		// grouping and concatenation to reorder items, assuming a 4 x 2 grid layout
		defaultViewItems = defaultViewItems[0].concat(defaultViewItems[1]);

		function sceneToolButtonDisabled() {
			return !$scope.isSceneReady || $scope.showInfoOverlay;
		}

		function objectRelatedToolButtonDisabled() {
			return sceneToolButtonDisabled() || viewerDataService.getSelectedModel().info.isPreview;
		}

		var manipOperator, cameraOperator;

		/**
		 * @ngdoc function
		 * @name updateOperatorInfo
		 * @function
		 * @methodOf modelViewerHoopsController
		 * @description Updates the control info for the currently selected operators.
		 */
		function updateOperatorInfo() {
			$scope.$evalAsync(function () {
				var relevantOperators = [cameraOperator];
				switch (viewerMode) {
					case viewerUtils.viewerModes.selectedModel:
						relevantOperators.splice(0, 0, manipOperator);
						break;
				}

				var info = customOperators.getOperatorsHelpText(relevantOperators);
				if (info) {
					$scope.displayedOperatorInfo = $sce.trustAsHtml(info.replace(/§§/g, '<br>'));
				} else {
					$scope.displayedOperatorInfo = '';
				}
			});
		}

		/**
		 * @ngdoc function
		 * @name updateCameraOperatorInfo
		 * @function
		 * @methodOf modelViewerHoopsController
		 * @description Updates the selected camera operator object.
		 * @param {Object} operator The operator.
		 */
		$scope.updateCameraOperatorInfo = function (operator) {
			cameraOperator = operator;
			updateOperatorInfo();
		};

		/**
		 * @ngdoc function
		 * @name updateManipulationOperatorInfo
		 * @function
		 * @methodOf modelViewerHoopsController
		 * @description Updates the selected manipulation operator object.
		 * @param {Object} operator The operator.
		 */
		$scope.updateManipulationOperatorInfo = function (operator) {
			manipOperator = operator;
			updateOperatorInfo();
		};

		let manipOperatorSelector = null;
		let camOperatorSelector = null;
		switch (viewerMode) {
			case viewerUtils.viewerModes.selectedModel:
				camOperatorSelector = customOperators.createCameraOperatorMenu($scope, sceneToolButtonDisabled, saveUiSettings);

				manipOperatorSelector = customOperators.createManipulationOperatorMenu($scope, sceneToolButtonDisabled, saveUiSettings);
				manipOperatorSelector.list.activeValue = 'pointer';

				var previousManipOperator = null;
				break;
			case viewerUtils.viewerModes.scs:
				camOperatorSelector = customOperators.createCameraOperatorScsMenu($scope, sceneToolButtonDisabled, saveUiSettings);
				break;
		}

		/**
		 * @ngdoc function
		 * @name setTemporaryManipulationOperator
		 * @function
		 * @methodOf modelViewerHoopsController
		 * @description Temporarily activates a manipulation operator.
		 * @param {String} operatorId The identifier of the temporarily set operator.
		 * @param {any} activationData Optionally, arbitrary data that the newly activated operator will receive.
		 */
		$scope.setTemporaryManipulationOperator = function (operatorId, activationData) {
			if (!manipOperatorSelector) {
				throw new Error('Cannot set a temporary manipulation operator in the current viewer mode (' + viewerMode + ').');
			}

			if (!previousManipOperator) {
				previousManipOperator = manipOperatorSelector.list.activeValue;
			}
			$scope.rib$operatorActivationData = activationData;
			this.viewer.rib$operatorActivationData = activationData;
			manipOperatorSelector.selectOperator(operatorId);
			$scope.tools.update();
		};

		/**
		 * @ngdoc function
		 * @name unsetTemporaryManipulationOperator
		 * @function
		 * @methodOf modelViewerHoopsController
		 * @description Resets the manipulation operator to the one selected before a call to
		 *              {@see setTemporaryManipulationOperator}. If no temporary operator is active in the current
		 *              viewer, the method will not do anything.
		 */
		$scope.unsetTemporaryManipulationOperator = function () {
			if (!manipOperatorSelector) {
				throw new Error('Cannot set a temporary manipulation operator in the current viewer mode (' + viewerMode + ').');
			}

			if (previousManipOperator) {
				manipOperatorSelector.selectOperator(previousManipOperator);
				previousManipOperator = null;
			} else {
				var activeOp = manipOperatorSelector.getActiveOperatorDef();
				if (!activeOp || activeOp.isTemporarilyVisible) {
					manipOperatorSelector.selectOperator('pointer');
				}
			}
			$scope.tools.update();
		};

		var camPosMgrItems = [{
			id: 'cameraPosMenu',
			caption: 'model.viewer.cameraPos',
			type: 'dropdown-btn',
			iconClass: 'ico-view-cam-pos',
			disabled: sceneToolButtonDisabled,
			list: {
				showImages: true,
				cssClass: 'dropdown-menu-right',
				items: [{
					type: 'sublist',
					caption: 'model.viewer.defaultCamPos',
					list: {
						showImages: true,
						cssClass: 'icon-view',
						items: defaultViewItems
					}
				}].concat([{
					id: 'zoomToSelection',
					caption: 'model.viewer.zoomToSelection',
					type: 'item',
					fn: function () {
						var duration = $scope.viewerSettings.transitions ? 500 : 0;

						var viewer = $scope.viewer();

						var selMeshIds = modelViewerCompositeModelObjectSelectionService.getSelectedMeshIds();
						if (selMeshIds.isEmpty()) {
							viewer.view.fitWorld(duration);
						} else {
							var viewerIds = modelViewerHoopsLinkService.meshToViewerIds(viewer, selMeshIds);
							viewer.view.fitNodes(viewerIds, duration);
						}
					},
					disabled: objectRelatedToolButtonDisabled
				}], (function () {
					switch (viewerMode) {
						case viewerUtils.viewerModes.selectedModel:
							return [storedCameraPositionSelector];
						default:
							return [];
					}
				})())
			}
		}].concat((function () {
			switch (viewerMode) {
				case viewerUtils.viewerModes.selectedModel:
					return {
						id: 'AddOrientation',
						caption: 'model.viewer.saveCustomCameraPos',
						type: 'item',
						iconClass: 'tlb-icons ico-view-cam-pos-add',
						fn: $scope.addCameraPosition,
						disabled: function () {
							return false;
						}
					};
				default:
					return [];
			}
		})());

		const addAnnotationButton = modelAnnotationQuickCreateService.createToolbarButton(() => viewRecord);

		const annotationTools = {
			id: 'annotations',
			type: 'sublist',
			iconClass: 'tlb-icons ico-annotation-group',
			caption: 'model.viewer.modelAnnos',
			list: {
				showTitles: true,
				items: []
			}
		};

		let insideOutsideMgr = null;

		var toolItems = ((function () {
			var result = [];
			if (manipOperatorSelector) {
				result.push(manipOperatorSelector);
			}
			if (camOperatorSelector) {
				result.push(camOperatorSelector);
			}
			return result;
		})()).concat([{
			id: 'camPosMgr',
			type: 'sublist',
			caption: 'model.viewer.camPosManager',
			list: {
				showTitles: false,
				items: camPosMgrItems
			}
		}, {
			id: 'zoomMgr',
			type: 'sublist',
			caption: 'model.viewer.zoomFeatures',
			list: {
				showTitles: false,
				items: [{
					id: 'In',
					caption: 'model.viewer.zoomIn',
					type: 'item',
					iconClass: 'tlb-icons ico-zoom-in',
					zoomIn: true,
					fn: $scope.zoom,
					disabled: sceneToolButtonDisabled
				}, {
					id: 'Out',
					caption: 'model.viewer.zoomOut',
					type: 'item',
					iconClass: 'tlb-icons ico-zoom-out',
					zoomIn: false,
					fn: $scope.zoom,
					disabled: sceneToolButtonDisabled
				}, {
					id: 'Fit',
					caption: 'model.viewer.cameraFit',
					type: 'item',
					iconClass: 'tlb-icons ico-zoom-fit',
					fn: $scope.zoomFit,
					disabled: sceneToolButtonDisabled
				}]
			}
		}, {
			id: 'refresh',
			caption: 'model.viewer.refresh',
			type: 'item',
			iconClass: 'tlb-icons ico-refresh',
			fn: function () {
				refreshViewerPage();
				$scope.focusViewer();
			}
		}]).concat((function () {
			switch (viewerMode) {
				case viewerUtils.viewerModes.selectedModel: {
					insideOutsideMgr = {
						id: 'insideOutsideMgr',
						type: 'sublist',
						caption: 'model.viewer.insideOutsideFeatures',
						list: {
							cssClass: 'radio-group',
							items: [{
								id: 'inside',
								value: 'inside',
								caption: $translate.instant('model.viewer.insideOutsideFeatures.inside'),
								type: 'radio',
								iconClass: 'tlb-icons ico-view-switch-inside',
								zoomIn: true,
								fn: function () {
									var viewer = $scope.viewer();
									var bBox = modelViewerHoopsRuntimeDataService.getBoundingBox(viewer);
									var cam = viewer.view.getCamera();
									var viewingDist = Communicator.Point3.subtract(cam.getTarget(), cam.getPosition()).length();
									var newCamPos = bBox.center();
									var newCamTarget = Communicator.Point3.add(newCamPos, new Communicator.Point3(1, 1, 0).normalize().scale(viewingDist));
									cam.setPosition(newCamPos);
									cam.setTarget(newCamTarget);
									cam.setUp(new Communicator.Point3(0, 0, 1));
									viewer.view.setCamera(cam, 1000);
									camOperatorSelector.selectOperator('mouseWalk');
								},
								disabled: sceneToolButtonDisabled
							}, {
								id: 'outside',
								value: 'outside',
								caption: $translate.instant('model.viewer.insideOutsideFeatures.outside'),
								type: 'radio',
								iconClass: 'tlb-icons ico-view-switch-outside',
								zoomIn: false,
								fn: function () {
									var viewer = $scope.viewer();
									viewer.view.setViewOrientation(Communicator.ViewOrientation.Iso, 1000);
									camOperatorSelector.selectOperator('orbit');
								},
								disabled: sceneToolButtonDisabled
							}]
						}
					};

					return _.compact([insideOutsideMgr, annotationTools, {
						id: 'commandsMenu',
						caption: 'model.viewer.commands',
						type: 'dropdown-btn',
						iconClass: 'tlb-icons ico-menu2',
						disabled: sceneToolButtonDisabled,
						list: {
							showImages: false,
							items: [{
								id: 'selectionTitle',
								type: 'item',
								disabled: true,
								cssClass: 'title',
								caption: 'model.viewer.selectionTitle'
							}, {
								id: 'selectAll',
								type: 'item',
								caption: 'model.viewer.selectAll',
								fn: function () {
									showBusyIndicator();
									modelViewerCompositeModelObjectSelectionService.selectAll(modelViewerSelectabilityService.getSelectabilityInfo($scope.viewer()));
									$scope.focusViewer();
									hideBusyIndicator();
								},
								disabled: objectRelatedToolButtonDisabled
							}, {
								id: 'selectNone',
								type: 'item',
								caption: 'model.viewer.selectNone',
								fn: function () {
									modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds();
									$scope.focusViewer();
								},
								disabled: objectRelatedToolButtonDisabled
							}, {
								id: 'toggleSel',
								type: 'item',
								caption: 'model.viewer.toggleSelection',
								fn: function () {
									showBusyIndicator();
									modelViewerCompositeModelObjectSelectionService.toggleSelection(modelViewerSelectabilityService.getSelectabilityInfo($scope.viewer()));
									$scope.focusViewer();
									hideBusyIndicator();
								},
								disabled: objectRelatedToolButtonDisabled
							}, {
								id: 'blacklistTitle',
								type: 'item',
								disabled: true,
								cssClass: 'title',
								caption: 'model.viewer.blacklistTitle'
							}, {
								id: 'addToBlacklist',
								type: 'item',
								caption: 'model.viewer.addToBlacklist',
								fn: function () {
									var fe = modelViewerHoopsFilterEngineService.getFilterEngine($scope.viewer());
									if (fe) {
										fe.getBlacklist().includeMeshIds(modelViewerCompositeModelObjectSelectionService.getSelectedMeshIds());
										modelViewerCompositeModelObjectSelectionService.setSelectedMeshIds(null);
									}
									$scope.focusViewer();
								},
								disabled: objectRelatedToolButtonDisabled
							}, {
								id: 'addOpeningsToBlacklist',
								type: 'item',
								caption: 'model.viewer.addOpeningsToBlacklist',
								fn: function () {
									showBusyIndicator();
									modelMainObjectDataService.getMeshesByPropertyTextValue('cpiComponentType', 'string', 'Opening').then(function (ids) {
										var fe = modelViewerHoopsFilterEngineService.getFilterEngine($scope.viewer());
										if (fe) {
											fe.getBlacklist().includeMeshIds(ids);
										}
										$scope.focusViewer();
										hideBusyIndicator();
									});
								},
								disabled: objectRelatedToolButtonDisabled
							}, {
								id: 'addSpacesToBlacklist',
								type: 'item',
								caption: 'model.viewer.addSpacesToBlacklist',
								fn: function () {
									showBusyIndicator();
									modelMainObjectDataService.getMeshesByPropertyTextValue('cpiComponentType', 'string', 'Space').then(function (ids) {
										var fe = modelViewerHoopsFilterEngineService.getFilterEngine($scope.viewer());
										if (fe) {
											fe.getBlacklist().includeMeshIds(ids);
										}
										$scope.focusViewer();
										hideBusyIndicator();
									});
								},
								disabled: objectRelatedToolButtonDisabled
							}, {
								id: 'isolate',
								type: 'item',
								caption: 'model.viewer.isolate',
								fn: function () {
									var fe = modelViewerHoopsFilterEngineService.getFilterEngine($scope.viewer());
									if (fe) {
										fe.getBlacklist().includeAllExceptMeshIds(modelViewerCompositeModelObjectSelectionService.getSelectedMeshIds());
									}
									$scope.focusViewer();
								},
								disabled: objectRelatedToolButtonDisabled
							}, {
								id: 'clearBlacklist',
								type: 'item',
								caption: 'model.viewer.clearBlacklist',
								fn: function () {
									var fe = modelViewerHoopsFilterEngineService.getFilterEngine($scope.viewer());
									if (fe) {
										fe.getBlacklist().excludeAll();
									}
									$scope.focusViewer();
								},
								disabled: objectRelatedToolButtonDisabled
							},
							{
								id: 'infoTitle',
								type: 'item',
								disabled: true,
								cssClass: 'title',
								caption: 'model.viewer.infoTitle'
							}, {
								id: 'infoModel',
								type: 'item',
								caption: 'model.viewer.infoModel',
								fn: function () {
									modelProjectSelectedModelInfoDialogService.showDialog();
								},
								disabled: objectRelatedToolButtonDisabled
							}]
						}
					}, modelMainProgressReportingService.createProgressReportingButton(), {
							id: 'cfgGroup',
							type: 'sublist',
							caption: 'model.viewer.cfgGroup',
							list: {
								showTitles: false,
								items: [{
									id: 'Cfg',
									caption: 'model.viewer.config',
									type: 'item',
									iconClass: 'tlb-icons ico-container-config',
									fn: configureViewer
								}]
							}
						}, {
							id: 'permissionSummary',
							type: 'sublist',
							caption: 'model.viewer.permissionSummary',
							list: {
								showTitles: false,
								items: [{
									id: 'Cfg',
									caption: 'model.viewer.permissionSummary',
									type: 'item',
									iconClass: 'tlb-icons ico-permission-summary',
									fn: function () {
										basicsCommonPermissionSummaryService.showDialog('model.viewer.3d');
									},
								}]
							}
						}]);
				}
				default:
					return [];
			}
		})());
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools'
		});
		$scope.tools.items = toolItems;
		$scope.tools.update();

		if (statusBarLink) {
			statusBarLink.updateFields([{
				id: 'filter',
				list: {
					showImages: false,
					cssClass: 'dropdown-menu-right',
					items: [{
						id: 'filterTitle',
						type: 'item',
						disabled: true,
						cssClass: 'title',
						caption: 'model.viewer.activeFilter'
					}, filterSelectorMenu.menuItem, staticHlSchemeSelectorMenu.menuItem]
				}
			}]);
		}

		switch (viewerMode) {
			case viewerUtils.viewerModes.selectedModel:
				basicsCommonConfigLocationListService.checkAccessRights(modelSettingsService.getPermissionsForPart('camPos')).then(function (grantedPermissions) {
					var atLeastOnePermitted = false;
					basicsCommonConfigLocationListService.createItems().forEach(function (accessScope) {
						if (grantedPermissions[accessScope.id]) {
							atLeastOnePermitted = true;
						}
					});
					if (atLeastOnePermitted) {
						_.find(camPosMgrItems, { id: 'AddOrientation' }).disabled = sceneToolButtonDisabled;
						$scope.tools.update();
					}
				});
				break;
		}

		var currentLoadRequest = null;

		let annotationOverlayManager = null;
		let measurementOverlayManager = null;

		/**
		 * @ngdoc function
		 * @name modelSelectionChanged
		 * @function
		 * @methodOf modelViewerHoopsController
		 * @description Loads or unloads the model currently selected in the underlying data service.
		 */
		function modelSelectionChanged() {
			if (currentLoadRequest) {
				currentLoadRequest.cancel();
				currentLoadRequest = null;
			}

			setIsReady(false);

			if ($scope.viewer) {
				var viewer = $scope.viewer();

				modelViewerHoopsLinkService.setViewerActive(viewer, false);
				modelViewerHoopsLinkService.markViewerAsDiscarded(viewer);
				try {
					shutdownViewer();
				} catch (ex) {
					$log.error(ex);
				}
			}
			$scope.$evalAsync(function () {
				if (isToolsReady()) {
					switch (viewerMode) {
						case viewerUtils.viewerModes.selectedModel:
							modelViewerHoopsSubModelFilterMenuService.removeMenu(toolItems);
							break;
					}
					$scope.tools.update();

					hideStatusInfo();
				}
			});
			var data = getSelectedModel();
			if (data) {
				if (statusBarLink) {
					statusBarLink.updateFields([{
						id: 'model',
						value: data.info.getNiceName()
					}]);
				}

				$scope.$evalAsync(function () {
					$scope.isSceneReady = false;
					$scope.loadingInfo = '';
				});
				return settingsMgr.load().then(function activeSettingsRetrieved(settings) {
					$scope.viewerSettings = settings;
				}).then(function activeSettingsPrepared() {
					var newLoadRequest = modelViewerHoopsLoadingService.loadModel($scope, data, {
						rendererType: getActiveRendererType(),
						streamingMode: getActiveStreamingMode(),
						showLoadingInfo: function (msg) {
							$scope.$evalAsync(function () {
								$scope.loadingInfo = msg;
								// Add loadingInfo
								// $scope.statusBarFields[0].value=msg;

							});
						},
						shutdownViewer: function () {
							shutdownViewer();
						}
					});
					currentLoadRequest = newLoadRequest;

					if (statusBarLink) {
						statusBarLink.updateFields([{
							id: 'status',
							value: $translate.instant('model.viewer.loading.loading')
						}]);
					}
					newLoadRequest.promise.then(function postProcessModelLoading() {
						$scope.resizeViewer();

						switch (viewerMode) {
							case viewerUtils.viewerModes.selectedModel:
								objectSelectionChanged();
								break;
						}

						var defaultView = _.find(viewerImplUtils.getDefaultViews({
							viewer: function () {
								return $scope.viewer ? $scope.viewer() : null;
							},
							viewerSettings: function () {
								return $scope.viewerSettings;
							}
						}), function (v) {
							return v.id === $scope.viewerSettings.defaultView;
						});
						var viewPromise = (function activateInitialView() {
							if (defaultView) {
								return defaultView.activate(true);
							} else {
								return $scope.viewer().view.fitWorld();
							}
						})();
						return viewPromise.then(function finalizeModelLoading() {
							camOperatorSelector.selectOperator($scope.bimUiSettings.camOperator);
							if (manipOperatorSelector) {
								manipOperatorSelector.selectOperator('pointer');
							}

							switch (viewerMode) {
								case viewerUtils.viewerModes.selectedModel:
									initializeMarkerManager();
									break;
							}

							var operators = $scope.operators();
							Object.keys(operators).forEach(function (opId) {
								var op = operators[opId];
								if (angular.isFunction(op.updateRefPoint)) {
									op.updateRefPoint();
								}
							});

							var cam = $scope.viewer().view.getCamera();
							cam.setNearLimit(0.0001);
							$scope.viewer().view.setCamera(cam);

							$scope.$evalAsync(function () {
								hideStatusInfo();
								$scope.isSceneReady = true;
								switch (viewerMode) {
									case viewerUtils.viewerModes.selectedModel:
										modelViewerHoopsSubModelFilterMenuService.insertMenu($scope.viewer(), toolItems);
										break;
								}
								$scope.tools.update();
							});

							$scope.viewer().setCallbacks({
								timeoutWarning: function () {
									if ($scope.viewerSettings && $scope.viewerSettings.preventTimeout) {
										if ($scope.viewer) {
											$scope.viewer().resetClientTimeout();
										}
									}
								}
							});

							if ($scope.supportsMinimap) {
								$scope.viewer().rib$unlinkMinimap = modelViewerHoopsMinimapService.linkMinimapToViewer($scope.minimapData.minimap(), $scope.viewer(), $scope.bimUiSettings);
							}

							switch (viewerMode) {
								case viewerUtils.viewerModes.selectedModel:
									if (overlayManager) {
										const annoVisStateMgr = modelAnnotationVisibilityStateService.createStateStorage();
										$scope.viewer().rib$annotationTypeVisibility = annoVisStateMgr;

										modelViewerHoopsOverlayService.initOverlay(overlayManager, $scope.viewer());
										const viewerAdapter = new modelAnnotationHoopsOverlayService.HoopsViewerAdapter($scope.viewer());
										annotationOverlayManager = modelAnnotationOverlayService.initialize(viewerAdapter, overlayManager);

										measurementOverlayManager = modelMeasurementOverlayService.initialize(viewerAdapter, overlayManager, {
											currentUnitSettings() {
												const currentViewerSettings = $scope.viewerSettings;
												return {
													uomLengthFk: currentViewerSettings.uomLengthFk,
													uomAreaFk: currentViewerSettings.uomAreaFk,
													uomVolumeFk: currentViewerSettings.uomVolumeFk
												};
											},
											registerUnitSettingsChanged(handler) {
												settingsMgr.registerUomSettingsChanged(handler);
											},
											unregisterUnitSettingsChanged(handler) {
												settingsMgr.unregisterUnitSettingsChanged(handler);
											}
										});
										$scope.viewer().rib$measurementOverlay = measurementOverlayManager;

										const annoVisibilityTools = annoVisStateMgr.createToolItems({
											updateTools() {
												$scope.tools.update();
											}
										});
										$scope.$on('$destroy', function () {
											annoVisibilityTools.destroy();
										});
										annotationTools.list.items = _.flatten(_.concat([addAnnotationButton], annoVisibilityTools.items, annotationOverlayManager.getToolItems()));
										$scope.tools.update();

										modelAnnotationHoopsMarkerDisplayService.initializeForViewer($scope.viewer());
									}
									break;
							}

							if (viewRecord) {
								viewRecord.refresh();
							}

							setIsReady(true);

							applyLiveSwitchableViewerSettings();

							if (insideOutsideMgr) {
								insideOutsideMgr.list.activeValue = 'outside';
								$scope.tools.update();
							}

							var fe = modelViewerHoopsFilterEngineService.getFilterEngine($scope.viewer());
							if (fe) {
								fe.registerFilterUpdated(updateSelectionInfo);
							}
							currentLoadRequest = null;

							if (statusBarLink) {
								statusBarLink.updateFields([{
									id: 'status',
									value: $translate.instant('model.viewer.loading.ready')
								}]);
							}
							$log.info('The model can now be used.');
						});
					}, function (reason) {
						if (newLoadRequest === currentLoadRequest) {
							if (!reason.viewer || (reason.viewer === $scope.viewer())) {
								if (angular.isString(reason.message)) {
									showStatusInfo(reason.message);
								} else {
									showStatusInfo($translate.instant('model.viewer.loadModelFailed'));
								}
								if (statusBarLink) {
									statusBarLink.updateFields([{
										id: 'status',
										value: ''
									}]);
								}
								currentLoadRequest = null;
							}
						}
					});
				});

				// loadModel(data.info.modelName, data.info.modelId);
			} else {
				// loadModel(null, null, null);

				modelViewerHoopsLoadingService.loadModel($scope, null);
				if (statusBarLink) {
					statusBarLink.updateFields([{
						id: 'model',
						value: $translate.instant('model.viewer.noModelSelected')
					}]);
				}
				$scope.$evalAsync(function () {
					if (viewerDataService.getSelectedModelId()) {
						showStatusInfo($translate.instant('model.viewer.noModelData'));
					} else {
						showStatusInfo($translate.instant(viewerDataService.getEmptySelectionTextKey()));
					}
				});

			}
		}

		switch (viewerMode) {
			case viewerUtils.viewerModes.selectedModel:
				viewerDataService.onSelectedModelChanged.register(modelSelectionChanged);
				unbindHandlers.push(function () {
					viewerDataService.onSelectedModelChanged.unregister(modelSelectionChanged);
				});
				break;
			case viewerUtils.viewerModes.scs:
				modelViewerScsFileSelectionService.registerSelectionChanged(modelSelectionChanged);
				unbindHandlers.push(function () {
					modelViewerScsFileSelectionService.unregisterSelectionChanged(modelSelectionChanged);
				});
				break;
		}

		function objectSelectionChanged() {
			updateSelectionInfo();
			viewRecord.setSelection(modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds());
			if (isToolsReady()) {
				$scope.tools.update();
			}
		}

		switch (viewerMode) {
			case viewerUtils.viewerModes.selectedModel:
				modelViewerCompositeModelObjectSelectionService.registerSelectionChanged(objectSelectionChanged);
				unbindHandlers.push(function () {
					modelViewerCompositeModelObjectSelectionService.unregisterSelectionChanged(objectSelectionChanged);
				});
				break;
		}

		function updateDragdropState(info) {
			$scope.$evalAsync(function () {
				if (info.isDragging) {
					if (info.draggedData && info.draggedData.draggingFromViewer) {
						$scope.isDragMode = false;
						$scope.isInvisibleDragMode = true;
						manipOperatorSelector.selectOperator('pointer');
						$scope.tools.update();
					} else {
						$scope.isDragMode = true;
						$scope.isInvisibleDragMode = false;
					}
				} else {
					$scope.isDragMode = false;
					$scope.isInvisibleDragMode = false;
				}
			});
		}

		switch (viewerMode) {
			case viewerUtils.viewerModes.selectedModel:
				platformDragdropService.registerDragStateChanged(updateDragdropState);
				unbindHandlers.push(function () {
					platformDragdropService.unregisterDragStateChanged(updateDragdropState);
				});
				break;
		}

		function updateDropMessage(info) {
			$scope.dropExplanation = info.message;
		}

		switch (viewerMode) {
			case viewerUtils.viewerModes.selectedModel:
				modelViewerDragdropService.registerMessageChanged(updateDropMessage);
				unbindHandlers.push(function () {
					modelViewerDragdropService.unregisterMessageChanged(updateDropMessage);
				});
				break;
		}

		modelSettings = {};

		function updateCamPosSettings() {
			modelSettings.camPos = modelSettingsService.getSettingsPart('camPos');
			updateCustomCameraPositionItems();
		}

		switch (viewerMode) {
			case viewerUtils.viewerModes.selectedModel:
				modelSettingsService.trackSettings(updateCamPosSettings, ['camPos']);
				unbindHandlers.push(function () {
					modelSettingsService.untrackSettings(updateCamPosSettings);
				});
				break;
		}

		function updateDisplaySettings() {
			function overwriteSettings(newSettings) {
				if (_.isBoolean(newSettings.showModel)) {
					modelSettings.displaySettings.showModel = newSettings.showModel;
				}
				if (newSettings.selColor) {
					modelSettings.displaySettings.selColor = newSettings.selColor;
				}
				if (_.isBoolean(newSettings.showBackfaces)) {
					modelSettings.displaySettings.showBackfaces = newSettings.showBackfaces;
				}
			}

			modelSettings.displaySettings = {
				showModel: true,
				selColor: null,
				showBackfaces: true
			};

			var fullSettings = modelSettingsService.getSettingsPart('displaySettings');
			if (fullSettings) {
				_.sortBy(basicsCommonConfigLocationListService.createItems(), 'priority').forEach(function (accessScope) {
					if (fullSettings[accessScope.id]) {
						overwriteSettings(fullSettings[accessScope.id]);
					}
				});
				applyColorSettings();
			}
		}

		modelSettingsService.trackSettings(updateDisplaySettings, ['displaySettings']);
		unbindHandlers.push(function () {
			modelSettingsService.untrackSettings(updateDisplaySettings);
		});

		switch (viewerMode) {
			case viewerUtils.viewerModes.selectedModel:
				objectSidebarSvc.requireSidebar();
				unbindHandlers.push(objectSidebarSvc.unrequireSidebar);
				break;
		}

		function showStatusInfo(infoText) {
			if (isToolsReady()) {
				$scope.showInfoOverlay = true;
				$scope.overlayInfo = infoText;
				$scope.tools.update();
			}
		}

		function hideStatusInfo() {
			if (isToolsReady()) {
				$scope.showInfoOverlay = false;
				$scope.overlayInfo = null;
				$scope.tools.update();
			}
		}

		$scope.isLoading = function () {
			return !$scope.isSceneReady && !$scope.showInfoOverlay;
		};

		/**
		 * @ngdoc function
		 * @name updateSelectionInfo
		 * @function
		 * @methodOf modelViewerHoopsController
		 * @description Updates the displayed information text on the current object selection.
		 */
		function updateSelectionInfo() {
			var newSelInfo = '';
			var newHiddenInfo = null;
			var newFilterInfo = null;

			if (viewerDataService.getSelectedModelId() && $scope.viewer && viewRecord && viewRecord.info.isReady()) {
				var selIds = modelViewerCompositeModelObjectSelectionService.getSelectedMeshIds();

				var treeInfo = modelViewerObjectTreeService.getTree();
				newSelInfo = $translate.instant('model.viewer.selCount', {
					selected: (function () {
						var minimalObjectIds = treeInfo.meshToMinimalObjectIds(selIds, true);
						return minimalObjectIds.totalCount();
					})(),
					selectedMeshes: selIds.totalCount()
				});

				var fe = modelViewerHoopsFilterEngineService.getFilterEngine($scope.viewer());
				if (fe) {
					var activeFilter = fe.getActiveFilter();
					newFilterInfo = activeFilter ? activeFilter.getStateDesc() : '';
				}
			}

			if (statusBarLink) {
				var newSelText = newSelInfo + (newHiddenInfo ? newHiddenInfo : '');
				statusBarLink.updateFields([{
					id: 'selection',
					value: newSelText
				}]);
			}

			$scope.$evalAsync(function () {
				$scope.displayedFilteringInfo = newFilterInfo;
			});
		}

		// TODO: remove/replace?
		/*
		switch (viewerMode) {
			case viewerUtils.viewerModes.selectedModel:
				modelViewerObjectFilterService.registerFilteredObjectsChanged(updateSelectionInfo);
				unbindHandlers.push(function () {
					modelViewerObjectFilterService.unregisterFilteredObjectsChanged(updateSelectionInfo);
				});
				break;
		}
		*/

		modelSelectionChanged();

		/**
		 * @ngdoc function
		 * @name shutdownViewer
		 * @function
		 * @methodOf modelViewerHoopsController
		 * @description Issues a shutdown command to the active viewer, if any.
		 */
		function shutdownViewer() {
			setIsReady(false);

			if ($scope.viewer) {
				const viewer = $scope.viewer();

				const markerRenderer = modelAnnotationHoopsMarkerDisplayService.getMarkerRendererForViewer(viewer, true);
				if (markerRenderer) {
					markerRenderer.dispose();
				}

				var fe = modelViewerHoopsFilterEngineService.getFilterEngine(viewer);
				if (fe) {
					fe.dispose();
				}

				modelViewerHoopsLinkService.markViewerAsDiscarded(viewer);

				if (annotationOverlayManager) {
					annotationOverlayManager.finalize();
					annotationOverlayManager = null;

					annotationTools.list.items = [];
					if ($scope && $scope.tools) {
						$scope.tools.update();
					}
				}

				if (measurementOverlayManager) {
					measurementOverlayManager.finalize();
					measurementOverlayManager = null;
				}

				try {
					modelViewerHoopsLinkService.setViewerActive(viewer, false);

					if ($scope.markerManager) {
						$scope.markerManager().detach();
					}

					viewer.operatorManager.clear();
					viewer.shutdown();
				} catch (e) {
					$log.error(e);
				}

				$scope.viewer = null;
			}
		}

		function initializeMarkerManager() {
			if ($scope.viewer) {
				var viewer = $scope.viewer();

				if ($scope.markerManager) {
					$scope.markerManager().detach();
				}

				var markerMgr = modelViewerHoopsMarkerService.createMarkerManager(viewer, $scope.bimUiSettings.markerSettings);
				$scope.markerManager = function getMarkerManager() {
					return markerMgr;
				};
				viewer.rib$markerManager = markerMgr;
			}
		}

		function showBusyIndicator() {
			$scope.$evalAsync(function () {
				$scope.loadingInfo = '';
				$scope.isBusyIndicatorVisible = true;
			});
		}

		function hideBusyIndicator() {
			$scope.$evalAsync(function () {
				$scope.isBusyIndicatorVisible = false;
			});
		}

		switch (viewerMode) {
			case viewerUtils.viewerModes.selectedModel:
				modelViewerSelectorRegistrationService.register();
				break;
		}

		(function initializeResizableMinimapOverlay() {
			// ResizableOverlayDir Input for resizable and Collapsable MiniMap
			if ($scope.supportsMinimap) {
				$scope.resizableOverlayDir = [];
				$scope.resizableOverlayDir.resizingPoints = [];
				$scope.resizableOverlayDir.resizingPoints.topLeft = true;
				if ($scope.bimUiSettings.miniMapWidth) {
					$scope.resizableOverlayDir.width = $scope.bimUiSettings.miniMapWidth;
					$scope.resizableOverlayDir.height = $scope.bimUiSettings.miniMapHeight;
				} else {
					$scope.resizableOverlayDir.width = 200;
					$scope.resizableOverlayDir.height = 120;

					$scope.bimUiSettings.miniMapWidth = $scope.resizableOverlayDir.width;
					$scope.bimUiSettings.miniMapHeight = $scope.resizableOverlayDir.height;
				}
				if (_.isNil($scope.bimUiSettings.miniMapCollapsed)) {
					$scope.resizableOverlayDir.collapsed = true;
				} else {
					$scope.resizableOverlayDir.collapsed = $scope.bimUiSettings.miniMapCollapsed;
				}
				$scope.resizableOverlayDir.minimumSize = 200;
				$scope.resizableOverlayDir.maximumSize = 1000;

				$scope.resizableOverlayDir.saveSettings = function () {
					$scope.bimUiSettings.miniMapWidth = $scope.resizableOverlayDir.width;
					$scope.bimUiSettings.miniMapHeight = $scope.resizableOverlayDir.height;
					$scope.bimUiSettings.miniMapCollapsed = $scope.resizableOverlayDir.collapsed;
					saveUiSettings();
				};
				$scope.resizableOverlayDir.resize = function () {
					$scope.minimapData.minimap().resize($scope.resizableOverlayDir.width, $scope.resizableOverlayDir.height);
				};
			}
		})();

		$scope.$on('$destroy', function () {
			shutdownViewer();
			for (var i = 0; i < unbindHandlers.length; i++) {
				if (unbindHandlers[i]) {
					unbindHandlers[i]();
				}
			}
			unbindHandlers = [];
		});
	}
})(angular);
/* jshint +W071 */
