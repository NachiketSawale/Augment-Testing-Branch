/* global Module */
/* jshint -W040 */// self
/* jshint -W098 */
(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerIgeSubscriberService',[
		'$log',
		'$rootScope',
		'$timeout',
		'$injector',
		'platformDialogService',
		'modelWdeViewerIgeService',
		'modelWdeViewerWdeConstants',
		'modelWdeViewerMarkupService',
		'modelWdeViewerObserverService',
		'modelWdeViewerComparisonService',
		'$translate',
		function ($log,
			$rootScope,
			$timeout,
			$injector,
			platformDialogService,
			modelWdeViewerIgeService,
			modelWdeViewerWdeConstants,
			modelWdeViewerMarkupService,
			modelWdeViewerObserverService,
			modelWdeViewerComparisonService,
			$translate) {
			return {
				subscribeEngine: function (engine, igeCtrl, scope) {
					igeCtrl.dimensionAffected = null;
					igeCtrl.calibrationInitialized = true;

					function loadOldDimensions(dimensions) {
						var action = function (item) {
							if (!item.Geometry) {
								return;
							}

							var geometry = item.Geometry.replace(/\$/gi, '');
							// var mode = IGEInstance.getDimensionMode();
							// IGEInstance.setDimensionCreationMode(Module.DimensionMode.None);
							engine.loadDimensionFromJSON(geometry);
							// IGEInstance.setDimensionCreationMode(mode);
						};

						if (angular.isArray(dimensions)) {
							dimensions.forEach(action);
						} else {
							action(dimensions);
						}
					}

					function updateDimension(dimension, data) {
						var copy = JSON.parse(dimension.serialize());
						if (!_.isNil(data.name)) {
							copy.name = data.name;
						}
						engine.updateDimensions([JSON.stringify(copy)]);
						return engine.getDimensionById(dimension.id);
					}

					function updateDimensionLabel(dimension, template) {
						var newName;

						if (template && template.name) {
							newName = template.name;
						}

						if (newName !== dimension.name) {
							dimension = updateDimension(dimension, {
								name: newName
							});
						}

						return dimension;
					}

					function createDimensionEntity(dimensionId, updateLabel, dimensionAffected) {
						var dimensionService = igeCtrl.settings.dimensionService;
						var dimension = engine.getDimensionById(dimensionId);

						if (!dimensionService || dimensionService.readonly || igeCtrl.isHideDimension) {
							return false;
						}

						var template = dimensionService.getObjectTemplate();
						var dimensionProps;

						if (dimensionAffected) {
							if (updateLabel) {
								dimension = updateDimensionLabel(dimension, {
									name: dimensionAffected.Data.Name
								});
							}

							dimensionProps = igeCtrl.getDimensionProperty(dimension);
							dimensionProps.Height = dimensionAffected.Data.Height;
							dimensionProps.Multiplier = dimensionAffected.Data.Multiplier;
							dimensionProps.Offset = dimensionAffected.Data.Offset;
						} else if (!_.isNil(template)) {
							if (updateLabel) {
								dimension = updateDimensionLabel(dimension, template);
							}

							dimensionProps = igeCtrl.getDimensionProperty(dimension);
							dimensionProps.Height = template.height;
							dimensionProps.Multiplier = template.multiplier;
							dimensionProps.Offset = template.offset;
						} else {
							platformModalService.showMsgBox('model.wdeviewer.objectTemplate.missing', 'model.wdeviewer.objectTemplate.title');
						}

						var args = {
							uuid: dimension.id,
							name: dimensionProps.Name,
							isNegative: (dimension.resultType === Module.DimensionResultType.Negative),
							geometry: dimensionProps.Geometry
						};

						var dimensionEntity = dimensionService.create(scope.modelId, args);

						if (_.isNil(dimensionEntity)) {
							return false;
						}

						dimensionEntity.Data = dimensionProps;
						dimensionEntity.Layout = scope.currentLayout.id;
						dimensionEntity.Scale = modelWdeViewerIgeService.getScale(scope.modelId).ratio;

						return dimensionEntity;
					}

					// start of event handlers
					function onDrawingOpened() {
						$log.warn('drawing opened:---------');
						modelWdeViewerObserverService.enable();

						var openInfo = igeCtrl.openDrawingInfo;

						// check if current drawing is change
						if (openInfo.drawingId !== scope.drawingId || openInfo.layoutId !== scope.layoutId) {
							setTimeout(function () {
								scope.isLoading = false;
								igeCtrl.loadDrawingLayout(scope.drawingId, scope.layoutId);
							});
							return;
						}

						igeCtrl.initCalibration();
						igeCtrl.initViewSettings();
						$rootScope.safeApply(function () {
							scope.isLoading = false;

							scope.layers = [
								{
									name: 'Layers',
									subItems: []
								}
							];

							var layers = [];
							var viewport = ''; // TODO: Support viewport layers.
							var count = engine.layerCount(viewport);

							for (var i = 0; i < count; ++i) {
								var l = engine.getLayer(viewport, i);
								layers.push(l);
							}

							if (layers.length) {
								scope.layers[0].subItems = layers.map(function (item) {
									return {
										id: item.index,
										name: item.displayName || item.name,
										nodeType: modelWdeViewerWdeConstants.layer,
										checked: true
									};
								});
							}

							scope.$emit('model.wdeviewer.loaded');
							scope.$emit('model.wdeviewer.status', $translate.instant('model.wdeviewer.statusBar.loaded') + ' ' + scope.modelCode);
							scope.$broadcast('update-tree-view');
						});

						if (!igeCtrl.documentMode) { // take off mode
							// set calibration
							var scale = modelWdeViewerIgeService.getScale(scope.modelId);

							if (!modelWdeViewerComparisonService.active && igeCtrl.canCalibrate) {
								igeCtrl.setDrawingUnitSystem(scale.isImperial);

								igeCtrl.calibrationInitialized = false;
								igeCtrl.setCalibration(scale.mode, scale.angle, scale.ratio);
								igeCtrl.calibrationInitialized = true;
							}

							modelWdeViewerIgeService.getDisplayUnit(scope.modelId).then(function (unit) {
								igeCtrl.setDisplayUOM(unit, scale.isImperial, scale.isFeet);
							});

							igeCtrl.setSelectionMode();

							if (!igeCtrl.settings.readonly) {
								igeCtrl.refreshDimensions();
							}
						}

						modelWdeViewerMarkupService.markupLoaded(scope, engine);
					}

					function onPosition(mouse) {
						scope.$apply(function () {
							scope.position.x = mouse.x();
							scope.position.y = mouse.y();
						});
					}

					// start of mode
					function onOperationModeChanged(m) {
						$log.info('operation mode: ' + m.value);
					}

					function onActionModeStart(m) {
						return true;
					}

					function onActionModeStopped(m) {
						$log.info('action mode: ' + m.value);
					}

					function onSnappingEnabledChanged(enable) {
						$log.info('snapping enable: ' + enable);
					}

					function onGeometrySnapModeChanged(m) {
						$log.info('snapping mode: ' + m.value);
					}

					function onAngleSnapModeChanged(m) {
						$log.info('angle snapping mode: ' + m.value);
					}

					function onLayerToggle(name, viewport, isOn) {
						if (scope.layers) {
							angular.forEach(scope.layers, function (layer) {
								if (layer.subItems) {
									var findItem = _.find(layer.subItems, {name: name});
									findItem.checked = false;
								}
							});
						}
					}

					// end of mode

					// start of calibration
					function onCalibrate(axis, length, angle) {
						modelWdeViewerIgeService.showCalibrationDialog(scope.modelId, axis, length, angle).then(function (result) {
							if (result.ok) {
								if (result.isUnitHintChange) {
									engine.resetCalibration();
									igeCtrl.setDrawingUnitSystem(result.isImperial);
								}

								// if (result.isUomChanged) {
								modelWdeViewerIgeService.loadDisplayUnit(result.uomFk).then(function (unit) {
									igeCtrl.setDisplayUOM(unit, result.isImperial, result.isFeet);
								});
								// }

								if (result.isScaleChanged) {
									igeCtrl.setCalibration(axis, angle, result.scale.ratio, result.rdData);
								}
							}
						});
					}

					function onCalibrateDimensions() {
						if (_.isNil(igeCtrl.rdData) || !igeCtrl.calibrationInitialized) {
							return [];
						}

						$log.warn('onCalibrateDimensions');

						return igeCtrl.rdData.dimensions.map(function (dimension) {
							// $log.info(dimension.Geometry);
							return dimension.Geometry;
						});
					}

					// end of calibration

					// start of dimension group
					function onGetDimensionGroup(dimensionGroupId) {
						var dimensionService = igeCtrl.settings.dimensionService;

						$log.info('onGetDimensionGroup: ' + dimensionGroupId);

						if (!dimensionService) {
							return '';
						}

						var part = dimensionService.getModelPart(scope.modelId);
						var dimensionGroups = part.dimensionGroups;

						for (var i = 0; i < dimensionGroups.length; i++) {
							if (dimensionGroups[i].dimensionGroupId === dimensionGroupId) {
								var dimensionGroupJson = JSON.stringify(dimensionGroups[i]);
								$log.info('onGetDimensionGroup: ' + dimensionGroupJson);
								return dimensionGroupJson;
							}
						}

						return '';
					}

					// end of dimension group

					// start of dimension
					function onFocusDimension(id) {

					}

					function onSelectDimensions(dimensionIds, sticky) {
						igeCtrl.selectedDimensionIds = dimensionIds;

						// if(!sticky) {
						// 	return;
						// }

						var dimensionService = igeCtrl.settings.dimensionService;
						if (dimensionService) {
							dimensionService.setSelectedObjects(scope.modelId, dimensionIds);
						}

						if (angular.isFunction(igeCtrl.settings.onDimSelectionChange)) {
							igeCtrl.settings.onDimSelectionChange();
						}
					}

					function onDimensionModeChanged(m) {

					}

					function onDimensionResultModeChanged(m) {

					}

					function onDimensionCreate(dimension, newDimension) {
						var dimensionService = igeCtrl.settings.dimensionService;
						var dimensionId = dimension.id;

						setTimeout(function () {
							var dimensionEntity = createDimensionEntity(dimensionId, true);

							if (dimensionEntity) {
								dimensionService.createDimension(scope.modelId, dimensionEntity);
							}
						});

						return true;
					}

					function onDimensionCanEdit() {
						var dimensionService = igeCtrl.settings.dimensionService;
						return dimensionService && !dimensionService.readonly && igeCtrl.canEditDimension();
					}

					function onDimensionDelete(dimension) {
						$log.info('onDimensionDelete');

						var dimensionService = igeCtrl.settings.dimensionService;

						if (!dimensionService || dimensionService.readonly || igeCtrl.isHideDimension || !igeCtrl.canEditDimension()) {
							return false;
						}

						function restore() {
							// delete failed, load dimension back.
							var dim = dimensionService.getDimensionByUuid(scope.modelId, dimension.id);

							if (engine && dim) {
								loadOldDimensions(dim);
							}
						}

						dimensionService.deleteDimension(scope.modelId, dimension.id).then(function (res) {
							if (!res.Success) {
								restore();
							}
						}, restore);

						return true;
					}

					function onDimensionChange(dimension) {
						var dimensionService = igeCtrl.settings.dimensionService;

						if (!dimensionService || dimensionService.readonly) {
							return false;
						}

						// dimension = updateDimensionLabel(dimension);

						var dimensionEntity = dimensionService.getDimensionByUuid(scope.modelId, dimension.id);

						if (_.isNil(dimensionEntity)) {
							return false;
						}

						var dimensionProps = igeCtrl.getDimensionProperty(dimension);
						dimensionProps.Height = dimensionEntity.Data.Height;
						dimensionProps.Multiplier = dimensionEntity.Data.Multiplier;
						dimensionProps.Offset = dimensionEntity.Data.Offset;

						dimensionEntity.Name = dimension.name;
						dimensionEntity.IsNegative = (dimension.resultType === Module.DimensionResultType.Negative);
						dimensionEntity.Geometry = dimensionProps.Geometry;
						dimensionEntity.Data = dimensionProps;
						dimensionService.updateDimension(scope.modelId, dimensionEntity);

						return true;
					}

					function onDimensionSelectionChange(dimensionId) {
						if (dimensionId) {
							var dimensionService = igeCtrl.settings.dimensionService;
							dimensionService.setSelectedObject(scope.modelId, dimensionId);
						}
						if (angular.isFunction(igeCtrl.settings.onDimSelectionChange)) {
							igeCtrl.settings.onDimSelectionChange();
						}
					}

					function onDimensionBulkDelete(dimensionIds) {
						$log.info('onDimensionBulkDelete');

						var dimensionService = igeCtrl.settings.dimensionService, isHideDimension = igeCtrl.isHideDimension;

						if (!dimensionService || dimensionService.readonly || isHideDimension) {
							return false;
						}

						dimensionService.deleteDimensionsByUuid(scope.modelId, dimensionIds);

						return true;
					}

					function onDimensionBulkChange(dimensions) {
						var rdData = igeCtrl.rdData;

						$log.info('onDimensionBulkChange');

						var dimensionService = igeCtrl.settings.dimensionService;

						if (!dimensionService || dimensionService.readonly) {
							return false;
						}

						var dimensionEntities = dimensions.map(function (dimension) {
							var dimensionEntity, dimensionProps;

							if (_.isNil(rdData)) {
								dimensionEntity = dimensionService.getDimensionByUuid(scope.modelId, dimension.id);
							} else {// recalibrate dimension
								var filters = rdData.dimensions.filter(function (item) {
									return item.Uuid === dimension.id;
								});

								dimensionEntity = filters[0];
							}

							dimensionProps = igeCtrl.getDimensionProperty(dimension);
							dimensionProps.Height = dimensionEntity.Data.Height;
							dimensionProps.Multiplier = dimensionEntity.Data.Multiplier;
							dimensionProps.Offset = dimensionEntity.Data.Offset;

							dimensionEntity.Name = dimension.name;
							dimensionEntity.IsNegative = (dimension.resultType === Module.DimensionResultType.Negative);
							dimensionEntity.Geometry = dimensionProps.Geometry;
							dimensionEntity.Data = dimensionProps;

							// identify dimension affected by cutout
							igeCtrl.dimensionAffected = dimensionEntity;

							return dimensionEntity;
						});

						scope.isLoading = true;

						dimensionService.updateDimensions(scope.modelId, dimensionEntities, {
							rdData: igeCtrl.rdData
						}).then(function () {
							if (!_.isNil(rdData)) {
								modelWdeViewerIgeService.saveModelConfig(scope.modelId, rdData.modelConfig, rdData.layoutConfig, {
									checkScale: true,
									checkUom: true,
									disableRecalibration: true
								}).then(function () {
									igeCtrl.refreshDimensions().then(function () {
										switch (rdData.action) {
											case 'calibrateX':
												engine.startActionMode(Module.ActionMode.CalibrateAxisX);
												break;
											case 'calibrateY':
												engine.startActionMode(Module.ActionMode.CalibrateAxisY);
												break;
										}
									});
									// igeCtrl.refreshView();
								});
							}
						}).finally(function () {
							scope.isLoading = false;
						});

						return true;
					}

					function onDimensionBulkCreate(dims, newDimension) {
						$log.info('onDimensionBulkCreate');

						if (!newDimension) {
							return true;
						}

						var dimensionIds = [];

						for (var i = 0; i < dims.size(); ++i) {
							var dim = dims.get(i);
							dimensionIds.push(dim.id);
						}

						setTimeout(function () {
							var dimensionEntities = [];
							var dimensionService = igeCtrl.settings.dimensionService;

							dimensionIds.forEach(function (dimensionId) {
								var dimensionEntity = createDimensionEntity(dimensionId, true, igeCtrl.dimensionAffected);

								if (dimensionEntity) {
									dimensionEntities.push(dimensionEntity);
								}
							});

							if (dimensionEntities.length > 0) {
								dimensionService.createDimensions(scope.modelId, dimensionEntities);
							}

							igeCtrl.dimensionAffected = null;
						});

						return true;
					}

					function OnDimensionHUDInformation(id) {
						var dim = engine.getDimensionById(id);
						var dimensionService = igeCtrl.settings.dimensionService;

						if (!_.isNil(dimensionService)) {
							var entity = dimensionService.getDimensionByUuid(scope.modelId, id);

							if (!_.isNil(entity)) {
								return 'Name: ' + dim.name +
									// '\nKey: ' + dim.id +
									'\nCount: ' + entity.Data.Count +
									'\nLength: ' + entity.Data.Length +
									'\nWidth: ' + entity.Data.Width +
									'\nHeight: ' + entity.Data.Height +
									'\nOffset: ' + entity.Data.Offset +
									'\nArea: ' + entity.Data.Area +
									'\nVertical Area: ' + entity.Data.WallArea +
									'\nVolume: ' + entity.Data.Volume;
							}
						}

						var hint = 'Name: ' + dim.name +
							// '\nKey: ' + dim.id +
							'\nCount: ' + dim.count +
							'\nLength: ' + dim.length +
							'\nWidth: ' + dim.width +
							'\nHeight: ' + dim.height +
							'\nOffset: ' + dim.baseOffset +
							'\nArea: ' + dim.area +
							'\nVertical Area: ' + dim.vericalArea +
							'\nVolume: ' + dim.volume;

						return hint;
					}

					// end of dimension

					function onPublishDrawingFinished(d) {
						let filename = 'Publish.pdf';
						let annoService = $injector.get('modelWdeViewerAnnotationService');
						if (annoService.saveDrawingFileName) {
							filename = annoService.saveDrawingFileName;
						}
						const data = new Uint8Array(d);
						$log.info('Callback OnPublishFinished: Offering download of ' + filename + ', with ' + data.length + ' bytes...');

						var a = document.createElement('a');
						a.download = filename;
						a.href = URL.createObjectURL(new Blob([data], {type: 'application/pdf'}));
						a.style.display = 'none';

						document.body.appendChild(a);
						a.click();
						setTimeout(function () {
							document.body.removeChild(a);
							URL.revokeObjectURL(a.href);
						}, 2000);
					}

					// start of markup
					function onMarkupCreate(markup) {
						if(modelWdeViewerMarkupService.annoExtensionService && modelWdeViewerMarkupService.annoExtensionService.onMarkupCreate){
							if(modelWdeViewerMarkupService.annoExtensionService.onMarkupCreate(scope.currentLayout.id, markup)){
								return true;
							}
						}
						if (scope.currentLayout) {
							modelWdeViewerMarkupService.saveMarkupInIge(scope.currentLayout.id, markup);
						}
						return true;
					}

					function onMarkupChange(markup) {
						if (scope.currentLayout) {
							modelWdeViewerMarkupService.saveMarkupChange(scope.currentLayout.id, markup);
						}
						return true;
					}

					function onMarkupDeleted(markUpId) {
						const markup = _.find(modelWdeViewerMarkupService.commentMarkups, {MarkerId: markUpId});
						if (markup) {
							modelWdeViewerMarkupService.postDelete(markup);
						}
						return true;
					}

					function onMarkupFocus(id) {
						console.log('Callback OnMarkupFocus: ' + id);
						_.forEach(modelWdeViewerMarkupService.commentMarkups, function (item) {
							item.isFocus = item.MarkerId === id;
						});
						modelWdeViewerMarkupService.commentMarkupsChanged.fire(modelWdeViewerMarkupService.commentMarkups);
					}

					function onMarkupSelectionChanged(markupIds) {
						if (markupIds.length > 0) {
							if (modelWdeViewerMarkupService.annoExtensionService && modelWdeViewerMarkupService.annoExtensionService.onMarkupSelect) {
								let igeMarkupItem = engine.getMarkup(markupIds[0]);
								modelWdeViewerMarkupService.annoExtensionService.onMarkupSelect(igeMarkupItem);
							}
						}
					}

					function onMarkupUpdateRequest(id, text, height, bNewMarkup, markupType, markupStyle) {
						window.console.log('Callback OnMarkupUpdateRequest: ${id}');
						if (bNewMarkup && modelWdeViewerMarkupService.annoExtensionService && modelWdeViewerMarkupService.annoExtensionService.onMarkupUpdateRequest){
							if (modelWdeViewerMarkupService.annoExtensionService.onMarkupUpdateRequest(document)) {
								return text;
							}
						}
						const viewerId = (scope.options && scope.options.viewerId) ? scope.options.viewerId : scope.ctrl.settings.viewerId;
						modelWdeViewerMarkupService.currentSetting = modelWdeViewerIgeService.getViewSetting(viewerId);
						const isTextMarkup = markupStyle.endPointStyle === Module.MarkupPointStyle.NotVisible;
						// Continuous Markup mode
						let annoService = $injector.get('modelWdeViewerAnnotationService');
						if (annoService && annoService.activeMarker && bNewMarkup) {
							//Point, Tick, and Cross will have focus mistakes in continuous mode, so use once to done
							setTimeout(function () {
								if (isTextMarkup){
									$injector.get('modelWdeViewerMarkerEditDialogService').onShowText(id, scope, engine, text);
								} else if (annoService.activeMarker && annoService.activeMarker.markupType === Module.MarkupType.Point) {
									document.addEventListener('mouseup', function () {
										engine.createMarkup(annoService.activeMarker.markupType, annoService.activeMarker.defaultMarkupStyle);
									}, {once: true});
								} else if (annoService.activeMarker) {
									engine.createMarkup(annoService.activeMarker.markupType, annoService.activeMarker.defaultMarkupStyle);
								}
							}, 500);
							return text;
						}
						// go to edit dialog
						var markerParam = {
							id: id,
							color: 0xff0000,
							lineWidth: 1,
							height: height,
							text: text,
							isNewMarkup: bNewMarkup,
							markupType: markupType,
							markupStyle: markupStyle
						};
						$injector.get('modelWdeViewerMarkerEditDialogService').showMarkerEditDialog(markerParam, engine);

						return text;
					}

					var mouseEnter = scope.onMouseEnter;
					scope.onMouseEnter = function (e) {
						scope.mousePosition_clientX = e.clientX;
						scope.mousePosition_clientY = e.clientY;
						mouseEnter(e);
					};

					// hide the markupCreate & markupEdit & markupDelete option in the context menu when return false
					function onMarkupCanEdit(id){
						$log.info(id);
						return true;
					}

					function onCalibrateMarkups() {
						if (!igeCtrl.calibrationInitialized) {
							return [];
						}

						$log.warn('onCalibrateMarkups');

						var markupData = [];
						_.map(modelWdeViewerMarkupService.commentMarkups, function (item) {
							markupData.push(item.originMarker ? item.originMarker : item.Marker);
						});
						return markupData;
					}

					// end of markup

					function onQuestionMessage(question, responseOptions) {
						$log.info('questionMessage: ' + question);
						modelWdeViewerIgeService.showQuestionDialog(engine, question, responseOptions);
						return 0;
					}

					function onProgressInit() {
						$rootScope.safeApply(function () {
							scope.$parent.isLoading = false;
							scope.loadingInfo = $translate.instant('model.wdeviewer.statusBar.loading') + ': 0%';
						});
					}

					function onProgressPosition(pos) {
						$rootScope.safeApply(function () {
							scope.loadingInfo = $translate.instant('model.wdeviewer.statusBar.loading') + ': ' + pos + '%';
						});
					}

					function onProgressEnd() {
						$rootScope.safeApply(function () {
							scope.loadingInfo = $translate.instant('model.wdeviewer.statusBar.loading') + ': 100%';
						});
					}

					function onDrawingStartCancelling() {
						$rootScope.safeApply(function () {
							scope.isCanceling = true;
							scope.loadingInfo = $translate.instant('model.wdeviewer.statusBar.canceling');
						});
					}

					function onDrawingCancelled() {
						$rootScope.safeApply(function () {
							scope.isLoading = false;
							scope.isCanceling = false;
							scope.loadingInfo = '';
							igeCtrl.drawingCancelled.fire();
						});
					}

					engine.setOnDrawingOpened(onDrawingOpened);

					engine.setOnOperationModeChanged(onOperationModeChanged);
					engine.setOnDimensionModeChanged(onDimensionModeChanged);
					engine.setOnDimensionResultModeChanged(onDimensionResultModeChanged);

					engine.setOnDimensionFocusChanged(onFocusDimension);
					engine.setOnDimensionSelectionChanged(function (ids, sticky) {
						setTimeout(function () {
							onSelectDimensions(ids, sticky);
						});
					});

					engine.setOnActionModeStart(onActionModeStart);
					engine.setOnActionModeStopped(onActionModeStopped);
					engine.setOnSnappingEnabledChanged(onSnappingEnabledChanged);
					engine.setOnGeometrySnapModeChanged(onGeometrySnapModeChanged);
					engine.setOnAngleSnapModeChanged(onAngleSnapModeChanged);

					engine.setOnLayerToggle(onLayerToggle);
					engine.setOnCalibrateAxisValue(onCalibrate);
					engine.setOnCalibrateDimensions(onCalibrateDimensions);

					engine.setOnGetDimensionGroup(onGetDimensionGroup);

					engine.setOnDimensionCanEdit(onDimensionCanEdit);
					engine.setOnDimensionChange(onDimensionChange);
					engine.setOnDimensionCreate(onDimensionCreate);
					engine.setOnDimensionDelete(onDimensionDelete);
					engine.setOnDimensionBulkChange(function (dims) {
						const dimensions = [];

						for (var i = 0; i < dims.size(); ++i) {
							var dim = dims.get(i);
							dimensions.push(dim);
						}

						onDimensionBulkChange(dimensions);

						// // workaround for ige defect - EXGE-3284
						// setTimeout(function () {
						// 	onDimensionBulkChange(dimensionIds);
						// });
					});
					engine.setOnDimensionBulkCreate(onDimensionBulkCreate);
					engine.setOnDimensionBulkDelete(onDimensionBulkDelete);
					//engine.setOnDimensionHUDInformation(OnDimensionHUDInformation);

					engine.setOnQuestionMessage(onQuestionMessage);

					engine.setOnPublishDrawingFinished(onPublishDrawingFinished);

					engine.setOnMarkupCreate(onMarkupCreate);
					engine.setOnMarkupDelete(onMarkupDeleted);
					engine.setOnMarkupChange(onMarkupChange);
					// IGEInstance.setOnMarkupCleared(onMarkupCleared);
					// engine.setOnMarkupSelectionChanged(onMarkupSelectionChanged);
					// engine.setOnMarkupHudInformation(onMarkupHudInformation);
					engine.setOnMarkupFocus(onMarkupFocus);
					engine.setOnMarkupSelectionChanged(onMarkupSelectionChanged);
					engine.setOnMarkupUpdateRequest(onMarkupUpdateRequest);
					engine.setOnMarkupCanEdit(onMarkupCanEdit);
					engine.setOnCalibrateMarkups(onCalibrateMarkups);

					// Progress bar API for open drawing/document
					engine.setOnProgressInit(onProgressInit);
					engine.setOnProgressPosition(onProgressPosition);
					engine.setOnProgressEnd(onProgressEnd);

					engine.setOnDrawingStartOpening(onDrawingStartOpening);
					// engine.setOnDrawingOpening(onDrawingOpening);
					engine.setOnDrawingStartCancelling(onDrawingStartCancelling);
					engine.setOnDrawingCancelled(onDrawingCancelled);

					function onDrawingStartOpening() {
						scope.isLoading = true;
					}

					function timeoutCall(action, returnValue) {
						return function () {
							var args = Array.prototype.slice.call(arguments, 0);
							setTimeout(function () {
								action.apply(this, args);
							});
							return returnValue;
						};
					}
				}
			};
		}
	]);

})(angular);