/**
 * Created by wui on 12/1/2020.
 */

/* global WDE, WDE_CONSTANTS, Module */
/* jshint -W040 */// self
/* jshint -W098 */
(function (angular, globals, global) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).directive('modelWdeViewerIgeViewer', [
		'$timeout', '$injector',
		'$log',
		'$q',
		'$translate',
		'$rootScope',
		'$compile',
		'PlatformMessenger',
		'platformModalService',
		'modelWdeViewerWdeConstants',
		'modelWdeViewerDataMode',
		'modelWdeViewerIgeService',
		'basicsCommonDrawingUtilitiesService',
		'modelWdeViewerLabelService',
		'modelWdeViewerIgeSubscriberService',
		'modelWdeViewerIgeLoaderService',
		'modelWdeViewerAnnotationService',
		'modelWdeViewerComparisonService',
		'modelWdeViewerObserverService',
		'modelWdeViewerIgeLayoutService',
		'modelWdeViewerSelectionService',
		'modelWdeViewerIgeCutoutProperty',
		function ($timeout, $injector,
			$log,
			$q,
			$translate,
			$rootScope,
			$compile,
			PlatformMessenger,
			platformModalService,
			modelWdeViewerWdeConstants,
			modelWdeViewerDataMode,
			modelWdeViewerIgeService,
			basicsCommonDrawingUtilitiesService,
			modelWdeViewerLabelService,
			modelWdeViewerIgeSubscriberService,
			modelWdeViewerIgeLoaderService,
			modelWdeViewerAnnotationService,
			modelWdeViewerComparisonService,
			modelWdeViewerObserverService,
			modelWdeViewerIgeLayoutService,
			modelWdeViewerSelectionService, modelWdeViewerIgeCutoutProperty) {

			var serverBaseUrl = globals.webApiBaseUrl + 'model/igeviewer';

			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'model.wdeviewer/templates/ige-viewer.html',
				require: 'ngModel',
				scope: {
					options: '='
				},
				controllerAs: 'ctrl',
				controller: ['$scope', '$element', '$http', controller],
				link: link
			};

			function controller($scope, $element, $http) {
				var self = this;
				var IGEInstance = null, canvasElement = null, canvasScope = null, igeCounter = 0, onIgeDeleting;
				var drawingSelector = '#canvas';
				modelWdeViewerAnnotationService.clearPreviewWorkState();

				function getDrawingElement(selector) {
					var drawing = $element.find(selector);
					return drawing[0];
				}

				function getCurrentLayout() {
					return $scope.currentLayout;
				}

				function setCurrentLayout(layoutId) {
					modelWdeViewerIgeLayoutService.selectLayoutById(layoutId);
				}

				function loadDrawingLayout(drawingId, layoutId) {
					if ($scope.isLoading) {
						// Ige doesn't support open more than 1 drawing at the same time
						// openDrawing API should wait for previous call finished
						return;
					}

					if (!canloadDrawing()){
						return;
					}

					if (!IGEInstance) {
						IGEInstance = createIGEInstance();
						global.igeEngine = IGEInstance;
						if (angular.isFunction(self.settings.onIgeCreated)) {
							onIgeDeleting = self.settings.onIgeCreated(IGEInstance, self, igeCounter);
						}
						setLayoutToSelect(layoutId);
					} else {
						closeLayout();
					}

					if (!_.isNil(layoutId)) {
						$log.warn('open drawing: drawingId=' + drawingId + ', layoutId=' + layoutId);
						self.openDrawingInfo = {
							drawingId: drawingId,
							layoutId: layoutId
						};
						if (modelWdeViewerSelectionService.isDocumentModeEnabled()) {
							modelWdeViewerIgeLayoutService.clearCurrentPageId();
							self.documentMode = true;
							IGEInstance.openDocument(drawingId, layoutId, '');
						} else if ($scope.modelId){
							self.documentMode = false;
							IGEInstance.openDrawing(drawingId, layoutId, '');
						}
					}

					modelWdeViewerComparisonService.off();
					$scope.$emit('model.wdeviewer.status', $translate.instant('model.wdeviewer.statusBar.loading') + ' ' + $scope.modelCode);
				}

				function setLayoutToSelect(layoutId) {
					var layouts = self.getLayouts();
					self.settings.currentViewLayout = $scope.currentLayout;
					self.settings.lastViewLayout = $scope.currentLayout;
					self.settings.viewLayouts = layouts;
				}

				function createIGEInstance() {
					var centrePane = getDrawingElement(drawingSelector);

					Module.createContext(centrePane, true, true, {
						majorVersion: 2, // WebGL version
						minorVersion: 0,
						antialias: false,
						alpha: false,
						stencil: true
					});

					Module.canvas = centrePane;

					IGEInstance = new Module.IGE();
					IGEInstance.startEngine(serverBaseUrl, drawingSelector);
					modelWdeViewerIgeSubscriberService.subscribeEngine(IGEInstance, self, $scope);

					igeCounter++;

					return IGEInstance;
				}

				function resize() {
					var canvas = document.querySelector(drawingSelector);

					if (!_.isNil(canvas)) {
						canvas.width = canvas.clientWidth;
						canvas.height = canvas.clientHeight;
					}
				}

				function setLayerVisibility(index, value) {
					var viewport = ''; // TODO: Support viewport layers.
					IGEInstance.updateLayer(viewport, index, value, true);
				}

				function showModelConfigDialog() {
					var layouts = self.getLayouts();

					modelWdeViewerIgeService.showModelConfigDialog($scope.modelId, {
						layouts: layouts,
						layout: $scope.currentLayout ? $scope.currentLayout.id : null
					}).then(function (result) {
						if (result.ok) {
							if ($scope.currentLayout.id !== result.layout) {
								setCurrentLayout(result.layout);
							}

							if (result.isScaleChanged && IGEInstance) {
								self.setCalibration(result.scale.mode, result.scale.angle, result.scale.ratio);
							}

							if (result.isUomChanged) {
								modelWdeViewerIgeService.loadDisplayUnit(result.uomFk).then(function (unit) {
									self.setDisplayUOM(unit);
								});
							}
						}

						return result;
					});
				}

				function showScaleConfigDialog() {
					modelWdeViewerIgeService.showScaleConfigDialog($scope.modelId, self.canCalibrate).then(function (result) {
						if (result.ok) {
							if (result.isUnitHintChange && IGEInstance) {
								IGEInstance.resetCalibration();
								setDrawingUnitSystem(result.isImperial);
							}

							if (result.uomFk && IGEInstance) {
								modelWdeViewerIgeService.loadDisplayUnit(result.uomFk).then(function (unit) {
									self.setDisplayUOM(unit, result.isImperial, result.isFeet);
								});
							}

							if (result.isScaleChanged && IGEInstance) {
								self.setCalibration(result.scale.mode, result.scale.angle, result.scale.ratio, result.rdData);
							}
						}

						return result;
					});
				}

				function setDrawingUnitSystem(isImperial) {
					if (isImperial) {
						self.unitSystem = IGEInstance.setDrawingUnitSystem(Module.DrawingUnitHint.Imperial);
						IGEInstance.setOptionAsBool('FRACTIONAL_IMPERIAL_FORMAT', true);
						$log.info('setDrawingUnitSystem to Imperial: ' + self.unitSystem);
					} else {
						self.unitSystem = IGEInstance.setDrawingUnitSystem(Module.DrawingUnitHint.Metric);
						IGEInstance.setOptionAsBool('FRACTIONAL_IMPERIAL_FORMAT', false);
						$log.info('setDrawingUnitSystem to Metric: ' + self.unitSystem);
					}
				}

				function initViewSettings() {
					var viewerId = self.settings.viewerId;
					if (!viewerId) {
						return;
					}
					var viewSettings = modelWdeViewerIgeService.getViewSetting(viewerId);
					applyViewSettings(viewSettings);
				}

				function applyViewSettings(settings) {
					if (!IGEInstance) {
						return;
					}

					IGEInstance.setDrawingDisplayEnabled(Module.DrawingDisplaySetting.WhiteBackground, settings.white);
					IGEInstance.setDrawingDisplayEnabled(Module.DrawingDisplaySetting.UseMonochrome, settings.monochrome);
					IGEInstance.setDrawingDisplayEnabled(Module.DrawingDisplaySetting.ShowText, settings.text);
					IGEInstance.setDrawingDisplayEnabled(Module.DrawingDisplaySetting.ShowHatching, settings.showHatching);
					IGEInstance.setDrawingDisplayEnabled(Module.DrawingDisplaySetting.UseLineStyle, settings.lineStyle);
					IGEInstance.setDrawingDisplayEnabled(Module.DrawingDisplaySetting.UseLineWeight, settings.lineWeight);
					IGEInstance.setOptionAsInteger('DIMENSION_LABELS', settings.labelType);

					if (settings.message) {
						IGEInstance.setSelectMessageMode(Module.SelectMessageMode.Show);
					} else {
						IGEInstance.setSelectMessageMode(Module.SelectMessageMode.Off);
					}

					$scope.showLegend = settings.showLegend;
				}

				function showViewConfigDialog() {
					var viewerId = self.settings.viewerId;
					modelWdeViewerIgeService.showViewConfigDialog(viewerId).then(function (result) {
						if (result.ok) {
							applyViewSettings(result.data);
						}

						return result;
					});
				}

				function showViewCompareDialog(wdeCtrl, option) {
					$injector.get('modelWdeViewerCompareService').showViewCompareDialog(wdeCtrl, option, WDE, WDE_CONSTANTS, IGEInstance);
				}

				var loadDimensionsCount = 0;
				var loadDimensionGroupsCount = 0;

				function loadDimensions() {
					if (!self.settings.dimensionService) {
						return $q.when(false);
					}

					loadDimensionsCount++;

					var success = (function (currentCount) {
						return function (res) {
							if (currentCount !== loadDimensionsCount) {
								return;
							}

							var toOriginMatrix = modelWdeViewerIgeService.getCurrentOriginMatrix($scope.modelId);
							var scale = modelWdeViewerIgeService.getScale($scope.modelId);
							var groups = self.settings.dimensionService.getDimensionGroups($scope.modelId);

							function findGroupId(dimensionId) {
								for (var i = 0; i < groups.length; i++) {
									if (angular.isArray(groups[i].DimensionIds) && groups[i].DimensionIds.some(function (item) {
										return item === dimensionId;
									})) {
										return groups[i].dimensionGroupId;
									}
								}

								return groups[0].dimensionGroupId;
							}

							res.forEach(function (item) {
								if (!!item.Layout && (!$scope.currentLayout || ($scope.currentLayout.id !== item.Layout))) {
									return;
								}

								if (item.Geometry) {
									var geometry = item.Geometry;
									var dimension = JSON.parse(geometry);

									if (dimension.dimensionBlob && dimension.dimensionGroupId) {
										IGEInstance.loadDimension(JSON.stringify(dimension));
									} else {
										if (!toOriginMatrix) {
											$log.info('toOriginMatrix is empty');
										} else {
											if (self.calibrated) {
												IGEInstance.loadWDEDimension(findGroupId(dimension.dimensionId), 1000, toOriginMatrix, geometry); // old none prefix
												// IGEInstance.loadWDEDimension(findGroupId(dimension.dimensionId), 1, toOriginMatrix, geometry); // milli prefix
											} else {
												IGEInstance.loadWDEDimension(findGroupId(dimension.dimensionId), 1000 / scale.ratio, toOriginMatrix, geometry);
												// IGEInstance.loadWDEDimension(findGroupId(dimension.dimensionId), 1 / scale.ratio, toOriginMatrix, geometry);
											}
										}
									}
								}
							});
							selectDimensions();
						};
					})(loadDimensionsCount);

					return self.settings.dimensionService.loadDimensions($scope.modelId, $scope.currentLayout.id, self.settings).then(success);
				}

				function loadDimensionGroups() {
					if (!self.settings.dimensionService) {
						return $q.when(false);
					}

					loadDimensionGroupsCount++;

					var success = (function (currentCount) {
						return function (data) {
							if (currentCount !== loadDimensionGroupsCount) {
								return;
							}

							self.dimensionGroups = data;

							var dimensionGroupStrings = data.map(function (item) {
								return JSON.stringify(item);
							});

							IGEInstance.loadDimensionGroups(dimensionGroupStrings);
						};
					})(loadDimensionGroupsCount);

					return self.settings.dimensionService.loadDimensionGroups($scope.modelId).then(success);
				}

				function loadOldDimensions(dimensions) {
					var action = function (item) {
						if (!item.Geometry) {
							return;
						}

						var geometry = item.Geometry.replace(/\$/gi, '');
						var mode = IGEInstance.getDimensionMode();
						IGEInstance.setDimensionCreationMode(WDE_CONSTANTS.DIMENSION_MODE.NONE);
						IGEInstance.loadDimensionFromJSON(geometry);
						IGEInstance.setDimensionCreationMode(mode);
					};

					if (angular.isArray(dimensions)) {
						dimensions.forEach(action);
					} else {
						action(dimensions);
					}
				}

				function selectDimensions() {
					if (!self.settings.dimensionService || !IGEInstance) {
						return;
					}

					var selectedDimensions = self.settings.dimensionService.determineSelectedDimensions($scope.modelId);

					if (selectedDimensions.length) {
						self.setSelectionMode();

						var uuid = selectedDimensions[0].Uuid;

						if (self.settings.dimensionService.determineZoomToDimension($scope.modelId)) {
							IGEInstance.zoomToDimensions([uuid]);
						}

						IGEInstance.selectDimensions(selectedDimensions.map(function (dimension) {
							return dimension.Uuid;
						}), true);
					} else {
						IGEInstance.selectDimensions([], true);
					}
				}

				function selectLayoutAndDimensions() {
					if (!self.settings.dimensionService || !IGEInstance) {
						return;
					}

					self.settings.dimensionService.determineSelectedLayout($scope.modelId).then(function (layout) {
						if (!layout || ($scope.currentLayout && $scope.currentLayout.id === layout)) {
							selectDimensions();
						} else {
							setCurrentLayout(layout);
						}
					});
				}

				function resetCalibration(action) {
					return modelWdeViewerIgeService.resetScale($scope.modelId).then(function (res) {
						if (!IGEInstance) {
							return;
						}

						try {
							$log.info('start reset calibration');
							self.rdData = res.rdData;
							if (self.rdData) {
								self.rdData.action = action;
							}
							self.unitSystem = false;
							IGEInstance.resetCalibration();
							if (self.unitSystem) {
								self.setDisplayUOM('inch', false, false);
							} else {
								self.setDisplayUOM('mm', false, false);
							}
						} finally {
							self.rdData = null;
							$log.info('finish reset calibration');
						}
					});
				}

				// #140484, not show pin model to pdfViewer container when not selected
				function canloadDrawing() {
					if (!modelWdeViewerSelectionService.isDocumentModeEnabled()) {
						return true;
					}
					let isDocumentDefaultMode = $injector.get('modelWdeViewerMarkupService').isDocumentDefaultMode;
					let modelId = modelWdeViewerSelectionService.getSelectedModelId();
					return (isDocumentDefaultMode && modelId) || modelId;
				}
				function renderModel(modelId) {
					closeDrawing();

					if (_.isNil(modelId)) {
						if (angular.isFunction(self.settings.getEmptyModelInfo)) {
							showInfo(self.settings.getEmptyModelInfo());
						}
						return;
					}
					if (!canloadDrawing()) {
						return;
					}

					modelWdeViewerIgeService.loadModel(modelId).then(function (res) {
						$scope.$parent.isLoading = false;
						$scope.modelCode = res.code;

						if (!res.uploaded) {
							showInfo($translate.instant('model.viewer.loadedModelNotImported'));
						}

						if (res.converted || res.isPdf) {
							loadDrawing(res.drawingId);
						} else {
							showInfo($translate.instant('model.viewer.loadedModelNotImported'));
						}
					});
				}

				function renderDocument(drawingId) {
					closeDocument();
					loadDrawing(drawingId);
				}

				function closeLayout() {
					$scope.layers = [];
					self.selectedDimensionIds = [];
					self.displayMode = '2d';
					modelWdeViewerObserverService.disable();

					if (IGEInstance) {
						if (self.documentMode === true) {
							IGEInstance.closeDocument();
						} else {
							IGEInstance.closeDrawing();
						}
					}
				}

				function closeDrawing() {
					$scope.drawingId = null;
					$scope.currentLayout = null;
					$scope.modelCode = '';
					$scope.modelInfo = '';
					closeLayout();
				}

				function closePage() {
					$scope.layers = [];
					self.selectedDimensionIds = [];
					modelWdeViewerObserverService.disable();

					if (IGEInstance) {
						IGEInstance.closeDocument();
					}
				}

				function closeDocument() {
					$scope.drawingId = null;
					$scope.currentLayout = null;
					$scope.modelCode = '';
					$scope.modelInfo = '';
					closePage();
				}

				function loadDrawing(drawingId) {
					$scope.$emit('model.wdeviewer.loading');
					$scope.$emit('model.wdeviewer.status', $translate.instant('model.wdeviewer.statusBar.loading'));
					modelWdeViewerAnnotationService.setPreviewWorkState($scope.modelId, true);

					$scope.drawingId = drawingId;

					if (angular.isString(drawingId)) {
						(function (uuid){
							modelWdeViewerIgeLayoutService.retrieveViews($scope.modelId, drawingId).then(function (layouts) {
								self.views = modelWdeViewerIgeLayoutService.views;

								// #140886 - fix mix issue if switching model too fast under low network
								// drawing is changed, returns for previous response
								if($scope.drawingId !== uuid) {
									return;
								}

								if (layouts) {
									$scope.layouts = layouts;

									var modelSettings = modelWdeViewerIgeService.getModelSetting($scope.modelId);

									if (modelSettings.layout) {
										modelWdeViewerIgeLayoutService.selectLayoutById(modelSettings.layout);
									}

									if (_.isNil(modelWdeViewerIgeLayoutService.getCurrentLayout())) {
										modelWdeViewerIgeLayoutService.goToFirst();
									}
								} else {
									showInfo($translate.instant('model.viewer.noModelData'));
								}
							}, function (){
								showInfo($translate.instant('model.viewer.noModelData'));
							});
						})(drawingId);
					} else {
						showInfo($translate.instant('model.viewer.loadedModelNotImported'));
					}
				}

				function refreshDimensions() {
					if (!IGEInstance || !self.settings.dimensionService) {
						return $q.when(false);
					}

					var deferred = $q.defer();

					IGEInstance.clearDimensionGroups();
					IGEInstance.unloadAllDimensions();

					loadDimensionGroups().then(loadDimensions).then(function () {
						self.refreshLegend();
						deferred.resolve(true);
					});
					// loadDimensions();

					return deferred.promise;
				}

				var delayLoadDimensionsId = null;

				function delayLoadDimensions() {
					if (!_.isNil(delayLoadDimensionsId)) {
						$timeout.cancel(delayLoadDimensionsId);
					}

					delayLoadDimensionsId = $timeout(function () {
						delayLoadDimensionsId = null;
						loadDimensions();
					}, 500);
				}

				function executeContextOption(option) {
					if (!IGEInstance) {
						return;
					}

					var items = IGEInstance.getContextMenu().getCurrentItems();

					if (items[option]) {
						IGEInstance.getContextMenu().setMenuActive(true);
						IGEInstance.getContextMenu().processOption(option);
						IGEInstance.getContextMenu().setMenuActive(false);
					}
				}

				function getDimensionProperty(dimension) {
					const id = dimension.id;
					const geometry = dimension.serialize();

					const data = {
						Id: id,
						Name: dimension.name,
						Geometry: geometry,

						Count: dimension.count,
						Length: dimension.length,
						Area: dimension.area,
						Volume: dimension.volume,
						Width: dimension.width,
						Height: dimension.height,
						WallArea: dimension.vericalArea,
						// Multiplier: multiplier,
						Offset: dimension.baseOffset,
						VertexCount: dimension.vertexCount,
						SegmentCount: dimension.segmentCount,
						CutoutArea: getCutoutProperty(geometry, modelWdeViewerIgeCutoutProperty.cutoutArea),
						CutoutLength: getCutoutProperty(geometry, modelWdeViewerIgeCutoutProperty.cutoutLength),
						AreaExcludingCutouts: getCutoutProperty(geometry, modelWdeViewerIgeCutoutProperty.areaExcludingCutouts),
						LengthExcludingCutouts: getCutoutProperty(geometry, modelWdeViewerIgeCutoutProperty.lengthExcludingCutouts),
						SegmentCountExcludingCutouts: getCutoutProperty(geometry, modelWdeViewerIgeCutoutProperty.segmentCountExcludingCutouts),
						VertexCountExcludingCutouts: getCutoutProperty(geometry, modelWdeViewerIgeCutoutProperty.vertexCountExcludingCutouts)
					};

					return data;
				}

				function getCutoutProperty(dimJson, property) {
					const value = IGEInstance.getDimensionPropertyFromObject(dimJson, property);

					if (value) {
						return Number.parseFloat(value);
					}

					return 0;
				}

				function setModelAndRefresh(modelId) {
					$scope.modelId = modelId;
					renderModel(modelId);
				}

				function refreshView() {
					renderModel($scope.modelId);
				}

				function showInfo(info) {
					$scope.modelInfo = info;
					if (info) {
						modelWdeViewerAnnotationService.setPreviewWorkState($scope.modelId, false);
					}
				}

				function clearDimensionsOnView() {
					if (!IGEInstance) {
						return;
					}

					var dimensionService = self.settings.dimensionService;

					if (!dimensionService || dimensionService.readonly) {
						return;
					}

					var uuids = self.getSelectedDimension();

					if (!uuids.length) {
						return;
					}

					platformModalService.showYesNoDialog('model.wdeviewer.clearDimensions.body', 'model.wdeviewer.clearDimensions.title').then(function (res) {
						if (res.yes) {
							dimensionService.deleteDimensionsByUuid($scope.modelId, uuids);
						}
					});
				}

				function getSelectedObjectIds() {
					var dimensionService = self.settings.dimensionService;

					if (!IGEInstance || !dimensionService || dimensionService.readonly) {
						return [];
					}

					var uuids = self.getSelectedDimension().map(function (item) {
						return item.$did$;
					});
					return dimensionService.mapObjectIds($scope.modelId, uuids);
				}

				function setSelectionMode() {
					var dimensionService = self.settings.dimensionService;

					if (!IGEInstance || !dimensionService) {
						return;
					}

					// only dimension mode allow to select dimensions.
					if (IGEInstance.operationMode() !== Module.OperationMode.Dimension) {
						IGEInstance.setOperationMode(Module.OperationMode.Dimension);
					}
					if (IGEInstance.dimensionMode() !== Module.DimensionMode.None) {
						IGEInstance.setDimensionMode(Module.DimensionMode.None);
					}
				}

				function showComparisonDialog() {
					var scale = modelWdeViewerIgeService.getScale($scope.modelId);

					if (!$scope.drawingId || !$scope.layoutId) {
						return;
					}

					modelWdeViewerComparisonService.showDialog($scope.drawingId, $scope.layoutId, scale.ratio).then(function (res) {
						if (res.ok) {
							var data = res.data;
							modelWdeViewerComparisonService.on();
							closeLayout();
							IGEInstance.compareDrawings(data.comparisonMode, data.baseLayoutInfo, data.refLayoutInfo, data.useTolerance);
						}
					});
				}

				function delay(action, timeout) {
					cancel(action);

					action.$timeoutId = $timeout(function () {
						action.$timeoutId = null;
						action.call();
					}, timeout);

					return function () {
						cancel(action);
					};
				}

				function cancel(action) {
					if (action.$timeoutId) {
						$timeout.cancel(action.$timeoutId);
						action.$timeoutId = null;
					}
				}

				function cancelOpenDrawing() {
					var deferred = $q.defer();

					if (!IGEInstance) {
						deferred.resolve();
					} else {
						if ($scope.isLoading) {
							$scope.isCanceling = true;
							IGEInstance.cancelOpenDrawing();
						}

						if ($scope.isCanceling) {
							var unregister = self.drawingCancelled.register(function () {
								unregister();
								deferred.resolve();
							});
						}
						else {
							deferred.resolve();
						}
					}

					return deferred.promise;
				}

				function getDimensionCount() {
					let engine = IGEInstance;
					return !engine ? 0 : engine.dimensionCount();
				}

				function getDimensionsOnView() {
					let engine = IGEInstance;
					let dims = [], i = 0;
					let count = getDimensionCount();

					while (i < count) {
						dims.push(JSON.parse(engine.getDimension(i).serialize()));
						i++;
					}

					return dims;
				}

				function generateLegendsAsync() {
					return modelWdeViewerIgeService.getDisplayUnit($scope.modelId).then(function (uom) {
						return createLegends(uom);
					});
				}

				function createLegends(uom) {
					const legends = [];

					if (!$scope.modelId || !self.settings.dimensionService) {
						return legends;
					}

					const positiveItems = [];
					const negativeItems = [];

					let group = _.groupBy(getDimensionsOnView(), 'dimensionGroupId'),
						dimensionGroups = self.dimensionGroups;

					_.forEach(group, function (value, key) {
						let dimensionGroup = _.find(dimensionGroups, {
							dimensionGroupId: key
						});

						// in case new cos instance
						if (!dimensionGroup) {
							return;
						}

						let positiveItem = {
								color: dimensionGroup.positiveConfig.colour,
								colorInt: dimensionGroup.positiveConfig.colourInt,
								name: dimensionGroup.name,
								value: 0,
								uom: uom
							},
							negativeItem = {
								color: dimensionGroup.negativeConfig.colour,
								colorInt: dimensionGroup.negativeConfig.colourInt,
								name: dimensionGroup.name,
								value: 0,
								uom: uom
							},
							isArea = false;

						_.forEach(value, function (dim) {
							let target = positiveItem;

							if (dim.area < 0) {
								target = negativeItem;
							}

							switch (dim.dimensionType) {
								case 'Count':
									target.value += dim.count;
									break;
								case 'Length':
									target.value += dim.length;
									break;
								case 'Area':
									target.value += dim.area;
									isArea = true;
									break;
							}
						});

						if (isArea && uom) {
							positiveItem.uom += '2';
							negativeItem.uom += '2';
						}
						if (positiveItem.value > 0) {
							positiveItems.push(positiveItem);
						}
						if (negativeItem.value < 0) {
							negativeItems.push(negativeItem);
						}
					});

					if (positiveItems.length > 0) {
						groupByNameUomColor(positiveItems).forEach(legend => {
							legends.push(legend);
						});
					}
					if (negativeItems.length > 0) {
						groupByNameUomColor(negativeItems).forEach(legend => {
							legends.push(legend);
						});
					}

					return legends;
				}

				function groupByNameUomColor(legends) {
					const groups = _.groupBy(legends, i => i.name + '-' + i.uom + '-' + i.color);

					return _.map(groups, (items) => {
						items[0].value = _.sumBy(items, 'value');
						return items[0];
					});
				}

				self.displayMode = '2d';
				self.documentMode = false;
				self.canCalibrate = false;
				self.calibrated = false;
				//  * Sets the unit system to use for the drawing.
				//  * This setting is for PDF drawings that allow the base units to be metric or imperial.
				//  * The drawing will default to metric and recalibrate the geometry if the setting is changed.
				//  * This should ideally match the UOM setting but should not be changed if the drawing has
				//  * dimensions on it or has been calibrated.
				self.unitSystem = false;
				self.ige = true;
				self.rdData = null; // recalibrate dimension data
				self.views = {};
				self.settings = null;
				self.element = $element;
				self.openDrawingInfo = null;
				self.selectedDimensionIds = [];
				self.getIGEInstance = function () {
					return IGEInstance;
				};
				self.getViewpoint = function () {
					return null;
				};
				self.render = function () {
					// if (IGEInstance) {
					//     IGEInstance.render();
					// }
				};
				self.getDrawingElement = getDrawingElement;
				self.getCurrentLayout = getCurrentLayout;
				self.setCurrentLayout = setCurrentLayout;
				self.loadDrawingLayout = loadDrawingLayout;
				self.resize = resize;
				self.setLayerVisibility = setLayerVisibility;
				self.showModelConfigDialog = showModelConfigDialog;
				self.showScaleConfigDialog = showScaleConfigDialog;
				self.showViewConfigDialog = showViewConfigDialog;
				self.showViewCompareDialog = showViewCompareDialog;
				self.initCalibration = function () {
					self.canCalibrate = false;

					if (IGEInstance) {
						self.canCalibrate = IGEInstance.getCalibrationMethod() !== Module.CalibrationMethod.None;
					}
				};
				self.resetCalibration = resetCalibration;
				self.setCalibration = function (axis, angle, factor, rdData) {
					if(!self.canCalibrate) {
						platformModalService.showMsgBox('model.wdeviewer.calibration.title', 'model.wdeviewer.calibration.none', 'info');
						return;
					}

					try {
						$log.info('start calibration');
						self.rdData = rdData;

						// if (axis === Module.ScreenAxis.Horizontal) {
						//     IGEInstance.calibrateDrawing(angle, factor, 1);
						// } else if (axis === Module.ScreenAxis.Vertical) {
						//     IGEInstance.calibrateDrawing(angle, 1, factor);
						// }

						self.calibrated = IGEInstance.calibrateDrawing(angle, factor, factor);
					} finally {
						self.rdData = null;
						$log.info('finish calibration');
					}
				};
				self.renderModel = renderModel;
				self.renderDocument = renderDocument;
				self.loadDimensions = loadDimensions;
				self.selectDimensions = selectDimensions;
				self.selectLayoutAndDimensions = selectLayoutAndDimensions;
				self.refreshDimensions = refreshDimensions;
				self.executeContextOption = executeContextOption;
				self.getDimensionProperty = getDimensionProperty;
				self.refreshView = refreshView;
				self.showInfo = showInfo;
				self.setModelAndRefresh = setModelAndRefresh;
				self.isHideDimension = false;
				self.hideDimension = function (uuid) {
					if (!IGEInstance) {
						return;
					}

					try {
						$log.info('hide dimension: start');
						self.isHideDimension = true;
						IGEInstance.removeDimensions([uuid]);
					} catch (e) {
						console.error(e);
					} finally {
						self.isHideDimension = false;
						$log.info('hide dimension: end');
					}
				};
				self.hideDimensions = function (uuids) {
					uuids.forEach(function (uuid) {
						self.hideDimension(uuid);
					});
				};
				self.getLayouts = function () {
					var result = self.views;
					if (result && result.layouts && result.layouts.length) {
						return getDistinctData(result.layouts);
					}
				};
				self.setSelectionMode = setSelectionMode;
				self.canEditDimension = function () {
					if (!IGEInstance) {
						return false;
					}

					return (IGEInstance.operationMode() === Module.OperationMode.Dimension) && (IGEInstance.dimensionMode() !== Module.DimensionMode.None);
				};
				self.canSelectDimension = function () {
					if (!IGEInstance) {
						return false;
					}

					return IGEInstance.operationMode() === Module.OperationMode.Dimension;
				};
				self.initViewSettings = initViewSettings;
				self.showComparisonDialog = showComparisonDialog;
				self.delay = delay;
				self.cancel = cancel;
				self.drawingCancelled = new PlatformMessenger();
				self.cancelOpenDrawing = cancelOpenDrawing;
				self.toggleDisplayMode = function () {
					var engine = IGEInstance;

					if (!engine) {
						return;
					}

					if (self.displayMode === '2d') {
						self.displayMode = '3d';
						engine.setDisplayMode(Module.DisplayMode.dm3DShadedWireFrame);
					} else {
						self.displayMode = '2d';
						engine.setDisplayMode(Module.DisplayMode.dm2DWireFrame);
					}
				};
				self.is3DModeEnabled = function () {
					return self.displayMode === '3d';
				};
				self.generateLegendsAsync = generateLegendsAsync;

				function getDistinctData(data) {
					var result = [];
					_.forEach(data, function (item) {
						if (!_.find(result, {id: item.id})) {
							result.push(_.find(data, {id: item.id}));
						}
					});
					return result;
				}

				self.getLayers = function () {
					if ($scope.layers && $scope.layers.length) {
						return $scope.layers[0].subItems;
					}
					return [];
				};
				self.clearDimensionsOnView = clearDimensionsOnView;
				self.getSelectedObjectIds = getSelectedObjectIds;
				self.getSelectedDimension = function () {
					// if (_.isNil(IGEInstance)) {
					// 	return [];
					// }

					// var dimensionIds = IGEInstance.selectedDimensionIds();
					//
					// if (!_.isArray(dimensionIds)) {
					// 	return [];
					// }

					return self.selectedDimensionIds.map(function (id) {
						return IGEInstance.getDimensionById(id);
					});
				};
				self.setDrawingUnitSystem = setDrawingUnitSystem;
				self.setDisplayUOM = function (unit, isImperial, isFeet) {
					self.unit = unit;
					if (IGEInstance && unit) {
						if (isImperial) {
							if (isFeet) {
								IGEInstance.setDisplayUOM(
									{
										type: Module.UOMType.LengthUnit,
										prefix: Module.UOMPrefix.None,
										uom: Module.UOM.Feet
									}, unit,
									{
										type: Module.UOMType.AreaUnit,
										prefix: Module.UOMPrefix.None,
										uom: Module.UOM.SquareFeet
									}, unit + '2',
									{
										type: Module.UOMType.VolumeUnit,
										prefix: Module.UOMPrefix.None,
										uom: Module.UOM.CubicFeet
									}, unit + '3'
								);
							} else {
								IGEInstance.setDisplayUOM(
									{
										type: Module.UOMType.LengthUnit,
										prefix: Module.UOMPrefix.None,
										uom: Module.UOM.Inches
									}, unit,
									{
										type: Module.UOMType.AreaUnit,
										prefix: Module.UOMPrefix.None,
										uom: Module.UOM.SquareInches
									}, unit + '2',
									{
										type: Module.UOMType.VolumeUnit,
										prefix: Module.UOMPrefix.None,
										uom: Module.UOM.CubicInches
									}, unit + '3'
								);
							}
							IGEInstance.setDrawingUOM(
								{
									type: Module.UOMType.LengthUnit,
									prefix: Module.UOMPrefix.None,
									uom: Module.UOM.Inches
								},
								{
									type: Module.UOMType.AreaUnit,
									prefix: Module.UOMPrefix.None,
									uom: Module.UOM.SquareInches
								},
								{
									type: Module.UOMType.VolumeUnit,
									prefix: Module.UOMPrefix.None,
									uom: Module.UOM.CubicInches
								}
							);
						} else {
							IGEInstance.setDisplayUOM(
								{
									type: Module.UOMType.LengthUnit,
									prefix: Module.UOMPrefix.Milli,
									uom: Module.UOM.Metre
								}, unit,
								{
									type: Module.UOMType.AreaUnit,
									prefix: Module.UOMPrefix.Milli,
									uom: Module.UOM.SquareMetre
								}, unit + '2',
								{
									type: Module.UOMType.VolumeUnit,
									prefix: Module.UOMPrefix.Milli,
									uom: Module.UOM.CubicMetre
								}, unit + '3'
							);
							IGEInstance.setDrawingUOM(
								{
									type: Module.UOMType.LengthUnit,
									prefix: Module.UOMPrefix.Milli,
									uom: Module.UOM.Metre
								},
								{
									type: Module.UOMType.AreaUnit,
									prefix: Module.UOMPrefix.Milli,
									uom: Module.UOM.SquareMetre
								},
								{
									type: Module.UOMType.VolumeUnit,
									prefix: Module.UOMPrefix.Milli,
									uom: Module.UOM.CubicMetre
								}
							);
						}
					}
				};
				self.getDrawingId = function () {
					return $scope.drawingId;
				};
				self.destroy = function () {
					if (angular.isFunction(onIgeDeleting)) {
						onIgeDeleting.call();
						onIgeDeleting = null;
					}

					if (IGEInstance) {
						IGEInstance.delete();
						IGEInstance = null;
						global.igeEngine = undefined;
					}

					if (canvasScope) {
						canvasScope.$destroy();
						canvasScope = null;
					}

					if (canvasElement) {
						canvasElement.remove();
						canvasElement = null;
					}
				};

				/**
				 * Holds the current loaded dimension group JSON objects.
				 * @type {*[]}
				 */
				self.dimensionGroups = [];
				self.onLegendChanged = new PlatformMessenger();
				/**
				 * Update default dimension group settings for creating dimension
				 * @param dimensionGroup
				 */
				self.updateDefaultDimensionGroup = function (dimensionGroup) {
					const json = JSON.stringify(dimensionGroup);
					IGEInstance.setDefaultDimensionGroup(json);
					IGEInstance.updateDimensionGroups([json]);

					// updating dimension group JSON objects.
					self.dimensionGroups = self.dimensionGroups.filter(e => e.dimensionGroupId !== dimensionGroup.dimensionGroupId);
					self.dimensionGroups.push(dimensionGroup);
					self.refreshLegend();
				}
				self.refreshLegend = function () {
					if ($scope.showLegend) {
						self.onLegendChanged.fire();
					}
				}
			}

			function link(scope, element, attrs, ngModelCtrl) {
				var splitter;

				scope.version = '';
				scope.showLegend = false;
				scope.isLoading = false;
				scope.isCanceling = false;
				scope.loadingInfo = '';
				scope.modelCode = '';
				scope.modelId = null;
				scope.drawingId = null;
				scope.layoutId = null;
				scope.layouts = [];
				scope.currentLayout = null;
				scope.layers = [];
				scope.position = {x: 0.0000, y: 0.0000};
				scope.treeOptions = {
					textProp: 'name',
					itemTemplate: function (dataItem) {
						if (dataItem.nodeType === modelWdeViewerWdeConstants.layer) {
							dataItem.toggleLayer = toggleLayer;

							return '<lable><input type="checkbox" data-ng-model="viewItem.model.checked" data-ng-change="viewItem.model.toggleLayer(viewItem.model)" />{{ viewItem.model.name }}</lable>';
						}

						function toggleLayer(layer) {
							scope.ctrl.setLayerVisibility(layer.name, layer.checked);
						}

						return '';
					}
				};
				scope.ctrl.settings = scope.$parent.$eval(attrs.options) || {};

				modelWdeViewerIgeService.getIgeVersion().then(v => {
					scope.version = v;
				});

				scope.ctrl.toggleSidebar = function (sidebarIndex, isToggle) {
					var pane = splitter.element.children('.k-pane')[sidebarIndex];
					if (isToggle) {
						splitter.toggle(pane, $(pane).width() <= 0);
					} else {
						splitter.expand(pane, $(pane).width() <= 0);
					}
				};

				scope.onKeyDown = function (e) {
					scope.$emit('model.wdeviewer.keydown', e);
					let keyCodes = $injector.get('keyCodes');
					if (e.keyCode === keyCodes.ENTER) {
						modelWdeViewerAnnotationService.isCreateMultipleMarkers = false;
						modelWdeViewerAnnotationService.isCreateMultipleMarkersChanged.fire({value: false});
					}
					if (e.keyCode === keyCodes.ESCAPE) {
						$injector.get('modelWdeViewerAnnotationService').clearActionMarker();
					}
				};

				scope.onMouseEnter = function (e) {
					e.currentTarget.focus({preventScroll: true});
				};

				scope.onMouseLeave = function (e) {
					e.currentTarget.blur();
				};

				if (!scope.ctrl.settings.hideSidebar) {
					// Splitter element equal to 0 in dialog at the beginning!!!
					var splitterElement = element.find('#wde-splitter');
					var unwatchSize = scope.$watch(function () {
						return splitterElement.width() && splitterElement.height();
					}, function (newValue) {
						if (newValue) {
							unwatchSize();
							var panes = [];
							panes.push({collapsible: true, size: '30%', scrollable: false, collapsed: true});
							if (scope.ctrl.settings.showCommentSidebar) {
								panes.push({collapsible: true, size: '18%', scrollable: false, collapsed: true});
							}
							panes.push({collapsible: true});
							splitter = splitterElement.kendoSplitter({
								panes: panes,
								orientation: 'horizontal',
								resize: function () {
									scope.ctrl.resize();
								}
							}).data('kendoSplitter');
							render();
						}
					});
				}

				scope.$watch(function () {
					return element.width();
				}, delayResize);

				scope.$watch(function () {
					return element.height();
				}, delayResize);

				// resize as soon as container element size is changed
				function resize() {
					scope.ctrl.resize();
				}

				function delayResize() {
					scope.ctrl.delay(resize, 100);
				}

				function once(fn) {
					if (fn.__executed) {
						return;
					}

					fn.call();
					fn.__executed = true;
				}

				function loadDrawingLayout() {
					if (!scope.drawingId) {
						return;
					}

					var newValue = modelWdeViewerIgeLayoutService.getCurrentLayout();

					scope.currentLayout = newValue;

					if (newValue) {
						$log.info('current layout:' + scope.drawingId + ',' + newValue.id);
						scope.layoutId = newValue.id;
						scope.ctrl.loadDrawingLayout(scope.drawingId, newValue.id);
						scope.ctrl.resize();
					} else {
						scope.layoutId = null;
					}
				}

				function currentLayoutChanged() {
					var layout = modelWdeViewerIgeLayoutService.getCurrentLayout();

					if(layout && !modelWdeViewerIgeLayoutService.isLayoutConverted(layout.id)) {
						scope.ctrl.showInfo($translate.instant('model.wdeviewer.noLayoutData'));
						return;
					}

					scope.ctrl.showInfo(null);

					if (modelWdeViewerSelectionService.isDocumentModeEnabled()) {
						if (layout && layout.id === modelWdeViewerIgeLayoutService.getCurrentPageId()) {
							scope.currentLayout = layout;

							if (layout) {
								scope.layoutId = layout.id;
							} else {
								scope.layoutId = null;
							}

							scope.ctrl.openDrawingInfo = {
								drawingId: scope.drawingId,
								layoutId: scope.layoutId
							};
							return;
						}
					}

					if (scope.isLoading) {
						scope.ctrl.cancelOpenDrawing().then(function () {
							scope.ctrl.delay(loadDrawingLayout, 800);
						});

					} else {
						scope.ctrl.delay(loadDrawingLayout, 800);
					}
				}

				function onCurrentLayoutConversionChanged() {
					var layout = modelWdeViewerIgeLayoutService.getCurrentLayout();

					if (layout.convertResultCode === 0) {// converted
						scope.ctrl.showInfo(null);
						loadDrawingLayout();
					}
				}

				function onIgeLoaded() {
					$log.info('ige.js is loaded');
					modelWdeViewerIgeLayoutService.currentLayoutChanged.register(currentLayoutChanged);
					modelWdeViewerIgeLayoutService.currentLayoutConversionChanged.register(onCurrentLayoutConversionChanged);
				}

				function render() {
					if (!splitter && !scope.ctrl.settings.hideSidebar) {
						return;
					}

					modelWdeViewerIgeLoaderService.loadEngine().then(function () {
						once(onIgeLoaded);

						if (scope.ctrl.settings.dataMode === modelWdeViewerDataMode.doc) {
							scope.ctrl.renderDocument(scope.modelId);
						} else {
							scope.ctrl.renderModel(scope.modelId);
						}
					});
				}

				// model -> view
				ngModelCtrl.$render = function () {
					scope.modelId = ngModelCtrl.$viewValue;
					render();
				};

				Object.defineProperty(scope, 'contextMenuItems', {
					get: function () {
						var deferred = $q.defer();
						var igeInstance = scope.ctrl.getIGEInstance();

						if (!igeInstance) {
							return deferred.promise;
						}

						var labels = modelWdeViewerLabelService.getLabels();
						var menuData = igeInstance.getContextMenuData();

						if (_.isString(menuData)) {
							resolveMenu(menuData);
						} else {
							menuData.then(function (menuJson) {
								resolveMenu(menuJson);
							});
						}

						function getCallback(key) {
							return function () {
								igeInstance.processContextMenuOption(key);
							};
						}

						function updateDimension(entity, nameModified, propModified) {
							var dimension = igeInstance.getDimensionById(entity.Uuid);
							var copy = JSON.parse(dimension.serialize());

							if (nameModified) {
								copy.name = entity.Name;
							}

							if (propModified) {
								copy.width = entity.Data.Width;
								copy.height = entity.Data.Height;
								copy.vericalArea = entity.Data.WallArea;
								copy.baseOffset = entity.Data.Offset;
							}

							igeInstance.updateDimensions([JSON.stringify(copy)]);

							dimension = igeInstance.getDimensionById(dimension.id);

							entity.Geometry = dimension.serialize();
						}

						function mapContextMenu(items) {
							return items.filter(function (item) {
								return !item.seperator;
							}).map(function (item, index) {
								if (item.submenu) {
									return {
										name: item.text,
										subGroup: true,
										groups: [
											{
												items: mapContextMenu(item.submenu)
											}
										]
									};
								}

								return {
									name: item.text,
									execute: getCallback(item.id.toString()),
									sort: index
								};
							});
						}

						function resolveMenu(menuJson) {
							var items = JSON.parse(menuJson);
							var dimensionOptions = [];
							var dimensionService = scope.ctrl.settings.dimensionService;

							if (dimensionService && !dimensionService.readonly && scope.ctrl.canEditDimension()) {
								var dims = scope.ctrl.getSelectedDimension();

								if (dims.length) {
									dimensionOptions.push({
										name: labels.editDimension,
										execute: function () {
											// dimension object will be invalid in async call
											dims = scope.ctrl.getSelectedDimension();

											if (dims.length === 1) {
												dimensionService.showPropertyDialog(scope.modelId, dims[0]).then(function (result) {
													if (result.ok && result.dirty) {
														updateDimension(result.data, result.nameModified, result.propModified);

														dimensionService.updateDimension(scope.modelId, result.data, {
															propModified: result.propModified,
															nameModified: result.nameModified
														});
													}
												});
											} else {
												dimensionService.showDimensionsDialog(scope.modelId, dims).then(function (result) {
													if (result.ok && result.dirty) {
														result.data.forEach(function (entity) {
															updateDimension(entity, result.nameModified, result.propModified);
														});

														dimensionService.updateDimensions(scope.modelId, result.data, {
															propModified: result.propModified,
															nameModified: result.nameModified
														});
													}
												});
											}
										},
										sort: 0
									});
								}
							}

							if(scope.ctrl.is3DModeEnabled()) {
								items = items.filter(item => item.text !== 'Markup');
							}

							deferred.resolve([
								{
									items: dimensionOptions
								},
								{
									items: mapContextMenu(items)
								}
							]);
						}

						return deferred.promise;
					}
				});

				scope.onContextMenuDestroy = function () {
					var igeInstance = scope.ctrl.getIGEInstance();

					if (igeInstance) {
						igeInstance.processContextMenuOption('0');
					}
				};

				scope.$on('wde.apply', function (event, apply) {
					apply(scope.ctrl);
				});

				var offStateChangeSuccess = $rootScope.$on('$stateChangeSuccess', scope.ctrl.destroy);

				scope.$on('$destroy', function () {
					ngModelCtrl.$render = angular.noop;
					scope.ctrl.cancel(resize);
					scope.ctrl.cancel(loadDrawingLayout);
					scope.ctrl.destroy();
					offStateChangeSuccess();
					modelWdeViewerAnnotationService.setPreviewWorkState(scope.modelId, false);
					modelWdeViewerIgeLayoutService.currentLayoutChanged.unregister(currentLayoutChanged);
					modelWdeViewerIgeLayoutService.currentLayoutConversionChanged.unregister(onCurrentLayoutConversionChanged);
					modelWdeViewerIgeLayoutService.clearLayoutConversionStateTimeout();
				});
			}
		}
	]);

})(angular, globals, window);
