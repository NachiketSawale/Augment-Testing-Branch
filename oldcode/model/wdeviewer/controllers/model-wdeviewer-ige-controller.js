/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals,WDE_CONSTANTS,Module,_ */
/* jshint -W098 */
/* jshint -W071 */
(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).controller('modelWdeViewerIgeController', [
		'$scope', '$translate',
		'$injector',
		'$http',
		'modelViewerFixedModuleConfigurationService',
		'modelWdeViewerFilterMode',
		'modelWdeViewerDataMode',
		'modelWdeViewerIgeService',
		'platformModalService',
		'platformDialogService',
		'modelViewerViewerRegistryService',
		'modelViewerModelSelectionService',
		'modelViewerCompositeModelObjectSelectionService',
		'modelViewerStandardFilterService',
		'modelMainObjectSidebarService',
		'modelWdeViewerSubModelFilterMenuService',
		'modelWdeViewerPrintingService',
		'modelWdeViewerStatusBarService',
		'modelWdeViewerLabelService',
		'modelWdeViewerDragdropService',
		'modelWdeViewerMarkupService',
		'modelProjectModelDataService',
		'modelWdeViewerActionsService',
		'modelWdeViewerObserverService',
		'modelWdeViewerComparisonService',
		'modelWdeViewerFontService',
		'modelWdeViewerSelectionService',
		function ($scope, $translate,
				  $injector,
				  $http,
				  modelViewerFixedModuleConfigurationService,
				  modelWdeViewerFilterMode,
				  modelWdeViewerDataMode,
				  modelWdeViewerIgeService,
				  platformModalService,
				  platformDialogService,
				  viewerRegistry,
				  viewerDataService,
				  modelViewerCompositeModelObjectSelectionService,
				  modelViewerStandardFilterService,
				  objectSidebarSvc,
				  modelWdeViewerSubModelFilterMenuService,
				  modelWdeViewerPrintingService,
				  modelWdeViewerStatusBarService,
				  modelWdeViewerLabelService,
				  modelWdeViewerDragdropService,
				  modelWdeViewerMarkupService,
				  modelProjectModelDataService,
				  modelWdeViewerActionsService,
				  modelWdeViewerObserverService,
				  modelWdeViewerComparisonService,
				  modelWdeViewerFontService,
				  modelWdeViewerSelectionService) {
			var engine = null, engineCtrl = null, isLoaded = false;
			var destroyFns = [];
			var viewUUID = $scope.getContentValue('uuid');
			var viewDisplayName = $scope.getContentValue('title');
			var readonly = $scope.getContentValue('readonly');
			var dimensionServiceName = $scope.getContentValue('dimensionService');
			var annoExtensionServiceName = $scope.getContentValue('annoExtensionService');
			var defaultMode = $scope.getContentValue('defaultMode');
			var viewerId = viewUUID;
			var viewSettings = modelWdeViewerIgeService.getViewSetting(viewerId);
			var dimensionService, editItem, lineItem, pointItem, bothItem, nagativeItem, positiveItem, deleteItem,
				dragItem, layerItem, unwatchValidHeaderIds, measurementItems = [], calibrationItems = [], filterGroup, toolItems = [];
			var labels = modelWdeViewerLabelService.getLabels();
			modelWdeViewerMarkupService.setting = modelWdeViewerMarkupService.model;
			modelWdeViewerMarkupService.isDocumentDefaultMode = (defaultMode === 'document');
			if (annoExtensionServiceName) {
				modelWdeViewerMarkupService.annoExtensionService = $injector.get(annoExtensionServiceName);
				modelWdeViewerMarkupService.annoExtensionService.setMarkupSelect = modelWdeViewerMarkupService.setMarkupSelect;
			}

			if(modelWdeViewerMarkupService.isDocumentDefaultMode) {
				modelWdeViewerSelectionService.enableDocumentMode();
			}
			else {
				modelWdeViewerSelectionService.enableTakeOffMode();
			}

			$scope.viewerOptions = {
				hideSidebar: true,
				viewerId: viewerId,
				readonly: readonly,
				dimensionService: null,
				getEmptyModelInfo: null,
				showCommentView: false,
				onOffCommentView: function () {
					$scope.isAllSelect = modelWdeViewerMarkupService.isAllSelect;
					if ($scope.viewerOptions.showCommentView) {
						$scope.viewerOptions.showCommentView = false;
					} else {
						$scope.viewerOptions.showCommentView = true;
					}
				},
				onIgeCreated: function (igeInstance, igeCtrl) {
					var unwatchers = [];

					engine = igeInstance;
					engineCtrl = igeCtrl;

					if (layerItem) {
						unwatchers.push(modelWdeViewerObserverService.watch(function () {
							return igeInstance.operationMode();
						}, function (newValue) {
							layerItem.value = (newValue === Module.OperationMode.Layer);
							$scope.tools.update();
						}));
					}
					if (editItem) {
						unwatchers.push(modelWdeViewerObserverService.watch(function () {
							return igeCtrl.canEditDimension();
						}, function (newValue) {
							editItem.value = newValue;
							$scope.tools.update();
						}));
					}
					if (lineItem) {
						unwatchers.push(modelWdeViewerObserverService.watch(function () {
							return igeInstance.geometrySnapMode();
						}, function (newValue) {
							lineItem.value = (newValue === Module.GeometrySnapMode.Line);
							$scope.tools.update();
						}));
					}
					if (pointItem) {
						unwatchers.push(modelWdeViewerObserverService.watch(function () {
							return igeInstance.geometrySnapMode();
						}, function (newValue) {
							pointItem.value = (newValue === Module.GeometrySnapMode.Point);
							$scope.tools.update();
						}));
					}
					if (nagativeItem || positiveItem) {
						unwatchers.push(modelWdeViewerObserverService.watch(function () {
							return igeInstance.dimensionResultMode();
						}, function (newValue) {
							if (nagativeItem) {
								nagativeItem.value = (newValue === Module.DimensionResultMode.Negative);
							}
							if (positiveItem) {
								positiveItem.value = (newValue === Module.DimensionResultMode.Positive);
							}
							if (bothItem) {
								bothItem.value = (newValue === Module.DimensionResultMode.Both);
							}
							$scope.tools.update();
						}));
					}
					if (deleteItem) {
						deleteItem.disabled = function () {
							var dims = igeCtrl.selectedDimensionIds;
							return !(dims && dims.length) || !igeCtrl.canEditDimension() || igeCtrl.is3DModeEnabled();
						};
					}
					if (nagativeItem) {
						nagativeItem.disabled = function () {
							return !editItem || !editItem.value || igeCtrl.is3DModeEnabled();
						};
					}
					if (positiveItem) {
						positiveItem.disabled = function () {
							return !editItem || !editItem.value || igeCtrl.is3DModeEnabled();
						};
					}
					if (bothItem) {
						bothItem.disabled = function () {
							return !editItem || !editItem.value || igeCtrl.is3DModeEnabled();
						};
					}
					if (calibrationItems && calibrationItems.length) {
						calibrationItems.forEach(function (item) {
							if (item.id !== 'scaleSetting') {
								item.disabled = function () {
									return modelWdeViewerComparisonService.active || !igeCtrl.canCalibrate;
								};
							}
						});
					}
					unwatchers.push(modelWdeViewerObserverService.watch(function () {
						return igeInstance.actionMode();
					}, function (newValue) {
						measurementItems.forEach(function (item) {
							if (item.id === 'mmlengths') {
								item.value = (newValue === Module.ActionMode.Measure);
							} else if (item.id === 'mmarea') {
								item.value = false;
							}
						});
						$scope.tools.update();
					}));
					unwatchers.push(modelWdeViewerObserverService.watch(function () {
						var viewSettings = modelWdeViewerIgeService.getViewSetting(viewerId);
						return viewSettings.filterMode;
					}, function (filterMode) {
						if (filterMode === modelWdeViewerFilterMode.header) {
							unwatchValidHeaderIds = dimensionService.watchValidHeaderIds($scope, onDimensionsChanged);
						} else if (angular.isFunction(unwatchValidHeaderIds)) {
							unwatchValidHeaderIds();
						}
					}));
					if (!readonly && dimensionServiceName) {
						unwatchers.push(modelWdeViewerObserverService.watch(function () {
							var t = dimensionService.getObjectTemplate();
							return t ? t.id + '-' + t.mode : '';
						}, function (newValue) {
							if (newValue && modelWdeViewerIgeService.isCurrentLayoutCalibrated($scope.modelId)) {
								var t = dimensionService.getObjectTemplate();
								var newMode = t ? t.mode : Module.DimensionMode.None;
								setDimensionCreationMode(newMode);
							} else {
								setDimensionCreationMode(Module.DimensionMode.None);
							}
						}));
					}
					$scope.isLoading = false;

					return function () {
						unwatchers.forEach(function (unwatch) {
							unwatch.call();
						});
					};
				},
				onDimSelectionChange: function () {
					$scope.tools.update();
				}
			};

			calibrationItems = [
				{
					id: 'scaleSetting',
					sort: 100,
					caption: 'model.wdeviewer.scaleSetting',
					iconClass: 'tlb-icons ico-settings',
					type: 'item',
					fn: function () {
						applyToWde(function (wdeCtrl) {
							wdeCtrl.showScaleConfigDialog();
						});
					}
				},
				// {
				//     id: 'calibrate',
				//     sort: 100,
				//     caption: 'model.wdeviewer.calibration.title',
				//     iconClass: 'tlb-icons ico-2dqto-calibrate',
				//     type: 'item',
				//     fn: function () {
				//         applyToWde(function (wdeCtrl) {
				//             // todo-wui: calibrate free mode
				//             var igeInstance = wdeCtrl.getIGEInstance();
				//
				//             if (igeInstance) {
				//                 igeInstance.startCalibration(WDE_CONSTANTS.CALIBRATION.FREE);
				//             }
				//         });
				//     }
				// },
				{
					id: 'calibrateReset',
					sort: 101,
					caption: 'model.wdeviewer.calibration.reset',
					iconClass: 'tlb-icons ico-2dqto-calibratereset',
					type: 'item',
					fn: function () {
						applyToWde(function (wdeCtrl) {
							wdeCtrl.resetCalibration();
						});
					}
				},
				{
					id: 'calibrateX',
					sort: 102,
					caption: 'model.wdeviewer.calibration.x',
					iconClass: 'tlb-icons ico-2dqto-calibratex',
					type: 'item',
					fn: function () {
						applyToWde(function (wdeCtrl) {
							var igeInstance = wdeCtrl.getIGEInstance();

							if (igeInstance) {
								if (wdeCtrl.unitSystem) {
									platformDialogService.showYesNoDialog('model.wdeviewer.calibration.unitSystemDone', 'model.wdeviewer.calibration.reset').then(function (res) {
										if (res.yes) {
											wdeCtrl.resetCalibration('calibrateX').then(function () {
												igeInstance.startActionMode(Module.ActionMode.CalibrateAxisX);
											});
										}
									});
								} else {
									if (modelWdeViewerIgeService.isCurrentLayoutCalibrated($scope.modelId)) {
										wdeCtrl.resetCalibration('calibrateX').then(function () {
											igeInstance.startActionMode(Module.ActionMode.CalibrateAxisX);
										});
									} else {
										igeInstance.startActionMode(Module.ActionMode.CalibrateAxisX);
									}
								}
							}
						});
					}
				},
				{
					id: 'calibratey',
					sort: 103,
					caption: 'model.wdeviewer.calibration.y',
					iconClass: 'tlb-icons ico-2dqto-calibratey',
					type: 'item',
					fn: function () {
						applyToWde(function (wdeCtrl) {
							var igeInstance = wdeCtrl.getIGEInstance();

							if (igeInstance) {
								if (wdeCtrl.unitSystem) {
									platformDialogService.showYesNoDialog('model.wdeviewer.calibration.unitSystemDone', 'model.wdeviewer.calibration.reset').then(function (res) {
										if (res.yes) {
											wdeCtrl.resetCalibration('calibrateY').then(function () {
												igeInstance.startActionMode(Module.ActionMode.CalibrateAxisY);
											});
										}
									});
								} else {
									if (modelWdeViewerIgeService.isCurrentLayoutCalibrated($scope.modelId)) {
										wdeCtrl.resetCalibration('calibrateY').then(function () {
											igeInstance.startActionMode(Module.ActionMode.CalibrateAxisY);
										});
									} else {
										igeInstance.startActionMode(Module.ActionMode.CalibrateAxisY);
									}
								}
							}
						});
					}
				}
			];

			var calibrationGroup = {
				id: 'calibrationGroup',
				caption: 'model.wdeviewer.scale',
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-2dqto-calibrate',
				list: {
					showImages: true,
					cssClass: 'dropdown-menu-right',
					items: calibrationItems
				},
				disabled: function () {
					if (isLoaded && engineCtrl) {
						return engineCtrl.is3DModeEnabled();
					}

					return true;
				}
			};

			var zoomItems = [
				{
					id: 'view-zoom-in',
					sort: 110,
					caption: 'model.viewer.zoomIn',
					iconClass: 'tlb-icons ico-zoom-in',
					type: 'item',
					fn: function () {
						applyToWde(function (wdeCtrl) {
							var igeInstance = wdeCtrl.getIGEInstance();

							if (igeInstance) {
								igeInstance.zoomIn();
							}
						});
					}
				},
				{
					id: 'view-zoom-out',
					sort: 111,
					caption: 'model.viewer.zoomOut',
					iconClass: ' tlb-icons ico-zoom-out',
					type: 'item',
					fn: function () {
						applyToWde(function (wdeCtrl) {
							var igeInstance = wdeCtrl.getIGEInstance();

							if (igeInstance) {
								igeInstance.zoomOut();
							}
						});
					}
				},{
					id: 'zoomLastMarkupp',
					caption: 'model.wdeviewer.zoomLastMarkup',
					iconClass: 'tlb-icons ico-zoom-markup',
					type: 'item',
					fn: function() {
						applyToWde(function(wdeCtrl) {
							let igeInstance = wdeCtrl.getIGEInstance();
							modelWdeViewerMarkupService.zoomToMarkup(igeInstance);
						});
					}
				},{
					id: 'view-zoom-fit',
					sort: 112,
					caption: 'model.viewer.cameraFit',
					iconClass: ' tlb-icons ico-zoom-fit',
					type: 'item',
					fn: function () {
						applyToWde(function (wdeCtrl) {
							var igeInstance = wdeCtrl.getIGEInstance();

							if (igeInstance) {
								igeInstance.resetView();
							}

							_.forEach(modelWdeViewerMarkupService.commentMarkups, function (item) {
								item.isSelect = false;
								item.IsShow = false;
								modelWdeViewerMarkupService.deleteMarkupOnView(igeInstance, item);
							});
							$scope.isAllSelect = false;
							modelWdeViewerMarkupService.showAnnotationChange.fire({value: false, isAll: true});
						});
					}
				}
			];

			var zoomGroup = {
				id: 'zoomGroup',
				caption: 'model.viewer.zoomIn',
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-zoom-in',
				list: {
					showImages: true,
					cssClass: 'dropdown-menu-right',
					items: zoomItems
				}
			};

			function addZoomWidth() {
				let zoomWidth = _.find(zoomGroup.list.items, {id: 'view-zoom-width'});
				if ((modelWdeViewerSelectionService.isDocumentModeEnabled() || modelWdeViewerMarkupService.isDocumentDefaultMode) && !zoomWidth) {
					zoomGroup.list.items.splice(2, 0, {
						id: 'view-zoom-width',
						sort: 111,
						caption: 'model.wdeviewer.zoomWidth',
						iconClass: 'tlb-icons ico-fit-to-width',
						type: 'item',
						fn: function () {
							applyToWde(function (wdeCtrl) {
								var igeInstance = wdeCtrl.getIGEInstance();

								if (igeInstance) {
									igeInstance.setOptionAsBool('ZOOM_TO_WIDTH', true);
									wdeCtrl.refreshView();
								}
							});
						}
					});
				}
			}

			let popup = $injector.get('basicsLookupdataPopupService').getToggleHelper();
			var markerGroup = {
				id: 'markerGroup',
				caption: 'model.wdeviewer.marker.createMarker',
				type: 'item',
				iconClass: 'dropdown-toggle dropdown-caret tlb-icons ico-marker-icon',
				fn: function () {
					applyToWde(function (wdeCtrl) {
						popup.toggle({
							plainMode: true,
							maxHeight: 500,
							hasDefaultWidth: false,
							focusedElement: $(event.currentTarget),
							controller: 'modelWdeviewerToolMarkerController',
							templateUrl: globals.appBaseUrl + 'model.wdeviewer/templates/tools-marker.html',
							resolve: {
								wdeCtrl: [
									function () {
										return wdeCtrl;
									}
								]
							}
						});
					});
				},
				disabled: function () {
					if (isLoaded && engineCtrl) {
						return engineCtrl.is3DModeEnabled();
					}

					return true;
				}
			};

			const annotationSimple = {
				id: 'annotation-simple',
				caption: 'model.wdeviewer.marker.showMarker',
				iconClass: 'control-icons ico-annotation-simple',
				type: 'check',
				value: modelWdeViewerMarkupService.isAllSelect,
				fn: function (id, item) {
					modelWdeViewerMarkupService.showAnnoMarkerByAll(item.value);
					modelWdeViewerMarkupService.showAnnotationChange.fire({value: item.value, isAll: true});
				},
				disabled: function () {
					if (isLoaded && engineCtrl) {
						return engineCtrl.is3DModeEnabled();
					}

					return true;
				}
			};
			const annotationRfi = {
				id: 'annotation-rfi',
				caption: 'model.annotation.rfi',
				iconClass: 'control-icons ico-annotation-rfi',
				type: 'check',
				value: modelWdeViewerMarkupService.isShowRfi,
				fn: function (id, item) {
					modelWdeViewerMarkupService.showAnnoMarkerByInfoRequest(item.value);
					modelWdeViewerMarkupService.showAnnotationChange.fire({value: item.value, isRfi: true});
				},
				disabled: function () {
					if (isLoaded && engineCtrl) {
						return engineCtrl.is3DModeEnabled();
					}

					return true;
				}
			};
			const annotationDefect = {
				id: 'annotation-defect',
				caption: 'model.annotation.defect',
				iconClass: 'control-icons ico-annotation-defect',
				type: 'check',
				value: modelWdeViewerMarkupService.isShowDefect,
				fn: function (id, item) {
					modelWdeViewerMarkupService.showAnnoMarkerByDefect(item.value);
					modelWdeViewerMarkupService.showAnnotationChange.fire({value: item.value, isDefect: true});
				},
				disabled: function () {
					if (isLoaded && engineCtrl) {
						return engineCtrl.is3DModeEnabled();
					}

					return true;
				}
			};
			const annotationCheckList = {
				id: 'annotation-checklist',
				caption: 'model.annotation.hsqeChecklist',
				iconClass: 'control-icons ico-annotation-checklist',
				type: 'check',
				value: modelWdeViewerMarkupService.isShowCheckList,
				fn: function (id, item) {
					modelWdeViewerMarkupService.showAnnoMarkerByCheckList(item.value);
					modelWdeViewerMarkupService.showAnnotationChange.fire({value: item.value, isCheckList: true});
				},
				disabled: function () {
					if (isLoaded && engineCtrl) {
						return engineCtrl.is3DModeEnabled();
					}

					return true;
				}
			};
			const annotationTools = {
				id: 'annotation-group',
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-annotation-group',
				caption: 'model.viewer.modelAnnos',
				list: {
					showTitles: true,
					showImages: true,
					cssClass: 'dropdown-menu-right',
					items: [annotationSimple, annotationRfi, annotationDefect, annotationCheckList]
				},
				disabled: function () {
					if (isLoaded && engineCtrl) {
						return engineCtrl.is3DModeEnabled();
					}

					return true;
				}
			};
			var rotateItems = [
				{

					id: 'rotate-left',
					sort: 120,
					caption: 'model.wdeviewer.rotate.left',
					iconClass: 'tlb-icons ico-txt-rotate-left',
					type: 'item',
					fn: function () {
						applyToWde(function (wdeCtrl) {
							var igeInstance = wdeCtrl.getIGEInstance();

							if (igeInstance) {
								igeInstance.rotateDrawing(-90);
							}
						});
					}
				},
				{

					id: 'rotate-right',
					sort: 121,
					caption: 'model.wdeviewer.rotate.right',
					iconClass: ' tlb-icons ico-txt-rotate-right',
					type: 'item',
					fn: function () {
						applyToWde(function (wdeCtrl) {
							var igeInstance = wdeCtrl.getIGEInstance();

							if (igeInstance) {
								igeInstance.rotateDrawing(90);
							}
						});
					}
				}
			];

			var rotateGroup = {
				id: 'rotateGroup',
				caption: 'model.wdeviewer.rotate.title',
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-txt-rotate-left',
				list: {
					showImages: true,
					cssClass: 'dropdown-menu-right',
					items: rotateItems
				}
			};

			var viewSettingItem = {
				id: 'view-setting',
				sort: 114,
				caption: 'model.wdeviewer.configTitle',
				iconClass: 'tlb-icons ico-container-config',
				type: 'item',
				fn: function () {
					applyToWde(function (wdeCtrl) {
						wdeCtrl.showViewConfigDialog();
					});
				}
			};

			var modelSettingItem = {
				id: 'model-setting',
				sort: 115,
				caption: 'model.wdeviewer.modelConfigTitle',
				iconClass: 'tlb-icons ico-model-config',
				type: 'item',
				fn: function () {
					applyToWde(function (wdeCtrl) {
						wdeCtrl.showModelConfigDialog();
					});
				}
			};

			var settingItems = [viewSettingItem, modelSettingItem];

			var settingGroup = {
				id: 'settingGroup',
				caption: 'model.wdeviewer.configTitle',
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-container-config',
				list: {
					showImages: true,
					cssClass: 'dropdown-menu-right',
					items: settingItems
				}
			};

			measurementItems = [
				{
					id: 'mmlengths',
					sort: 120,
					caption: 'model.wdeviewer.measurement.length',
					iconClass: 'tlb-icons ico-view-m-point',
					type: 'check',
					fn: function (id, item) {
						if (item.value) {
							setMeasurementMode(Module.ActionMode.Measure);
						} else {
							setMeasurementMode(Module.ActionMode.None);
						}
					}
				}
				// {
				//     id: 'mmpolylength',
				//     sort: 120,
				//     caption: 'model.wdeviewer.measurement.multiLength',
				//     iconClass: 'tlb-icons ico-view-m-point-multiple',
				//     type: 'check',
				//     fn: function (id, item) {
				//         if (item.value) {
				//             setMeasurementMode(Module.ActionMode.Measure);
				//         }
				//         else {
				//             setMeasurementMode(Module.ActionMode.None);
				//         }
				//     }
				// },
				// {
				//     id: 'mmarea',
				//     sort: 120,
				//     caption: 'model.wdeviewer.measurement.area',
				//     iconClass: 'tlb-icons ico-view-m-face-distance',
				//     type: 'check',
				//     fn: function (id, item) {
				//         setMeasurementMode(Module.ActionMode.None);
				//         // if (item.value) {
				//         //     setMeasurementMode(Module.ActionMode.Measure);
				//         // }
				//         // else {
				//         //     setMeasurementMode(Module.ActionMode.None);
				//         // }
				//     }
				// }
			];

			var measurementGroup = {
				id: 'measurementGroup',
				caption: 'model.wdeviewer.measurement.length',
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-view-m-point',
				list: {
					showImages: true,
					cssClass: 'dropdown-menu-right',
					items: measurementItems
				},
				disabled: function () {
					if (isLoaded && engineCtrl) {
						return engineCtrl.is3DModeEnabled();
					}

					return true;
				}
			};

			var sidebarFilter = modelViewerStandardFilterService.getFilterById('objectSearchSidebar');

			var filterUser = {
				invalidateAllMeshes: function () {
					filterUser.applyFilter();
				},
				invalidateMeshIds: function (changedMeshIds) {
					filterUser.applyFilter();
				},
				applyFilter: function () {
					var meshStates = sidebarFilter.__pvtFilterState._meshStates;
					var meshIds = viewerDataService.forEachSubModel(function (subModelId) {
						var subMeshIds = [];
						var persistedModelMeshStates = meshStates[subModelId];

						_.forEach(persistedModelMeshStates, function (value, key) {
							if (value === 'i') {
								subMeshIds.push(parseInt(key));
							}
						});

						return subMeshIds;
					});

					if (dimensionService) {
						dimensionService.setFilterByMeshId(meshIds.useGlobalModelIds());
						applyToWde(function (wdeCtrl) {
							wdeCtrl.refreshDimensions();
						});
					}
				}
			};

			function deleteSelectedDimension() {
				applyToWde(function (wdeCtrl) {
					var igeInstance = wdeCtrl.getIGEInstance();
					var dims = wdeCtrl.getSelectedDimension();

					if (dims && dims.length) {
						igeInstance.removeDimensions(dims.map(function (dim) {
							return dim.id;
						}));
					}
				});
			}

			if (!readonly && dimensionServiceName) {
				dimensionService = $injector.get(dimensionServiceName);

				var onMouseDown = function () {
					$scope.startDrag();
				};

				editItem = {
					id: 'edit',
					sort: 120,
					caption: 'model.wdeviewer.dimension.edit',
					iconClass: 'tlb-icons ico-2dqto-edit',
					type: 'check',
					value: false,
					fn: function (id, item) {
						applyToWde(function (wdeCtrl) {
							if (item.value) {
								var t = dimensionService.getObjectTemplate();
								var dimensionGroup = dimensionService.getDefaultDimensionGroup();

								if (_.isNil(t)) {
									item.value = false;
									platformModalService.showMsgBox('model.wdeviewer.objectTemplate.missing', 'model.wdeviewer.objectTemplate.title');
									return;
								}

								if (wdeCtrl.canCalibrate) {
									if (modelWdeViewerIgeService.isCurrentLayoutCalibrated($scope.modelId)) {
										setDimensionCreationMode(t.mode, function (igeInstance) {
											// clear dimension selection
											// igeInstance.selectDimension('');
											updateDefaultDimensionGroup();
										});
									} else {
										item.value = false;
										platformModalService.showMsgBox('model.wdeviewer.calibration.missing', 'model.wdeviewer.calibration.title');
										$scope.tools.update();
									}
								} else {
									setDimensionCreationMode(t.mode, function (igeInstance) {
										// clear dimension selection
										// igeInstance.selectDimension('');
										updateDefaultDimensionGroup();
									});
								}
							} else {

								var igeInstance = wdeCtrl.getIGEInstance();

								if (igeInstance) {
									igeInstance.cancel(); // cancel action mode
									igeInstance.setDimensionMode(Module.DimensionMode.None);
								}
							}
						});
					}
				};
				lineItem = {
					id: 'line',
					sort: 121,
					// caption: 'model.wdeviewer.selectLine',
					// iconClass: 'tlb-icons ico-2dqto-line',
					caption: 'model.wdeviewer.snap',
					iconClass: 'tlb-icons ico-2dqto-snap',
					type: 'check',
					value: true,
					fn: function (id, item) {
						applyToWde(function (wdeCtrl) {
							var igeInstance = wdeCtrl.getIGEInstance();

							if (igeInstance) {
								if (item.value) {
									igeInstance.setGeometrySnapMode(Module.GeometrySnapMode.Line);
									$scope.tools.update();
								} else {
									igeInstance.setGeometrySnapMode(Module.GeometrySnapMode.None);
								}
							}
						});
					}
				};
				pointItem = {
					id: 'point',
					sort: 122,
					caption: 'model.wdeviewer.selectPoint',
					iconClass: 'tlb-icons ico-2dqto-point',
					type: 'check',
					value: false,
					fn: function (id, item) {
						applyToWde(function (wdeCtrl) {
							var igeInstance = wdeCtrl.getIGEInstance();

							if (igeInstance) {
								if (item.value) {
									igeInstance.setGeometrySnapMode(Module.GeometrySnapMode.Point);
									$scope.tools.update();
								} else {
									igeInstance.setGeometrySnapMode(Module.GeometrySnapMode.None);
								}
							}
						});
					}
				};
				bothItem = {
					id: 'both',
					sort: 123,
					caption: 'model.wdeviewer.dimension.both',
					iconClass: 'tlb-icons ico-2dqto-mode-both',
					type: 'check',
					value: false,
					fn: function (id, item) {
						applyToWde(function (wdeCtrl) {
							var igeInstance = wdeCtrl.getIGEInstance();

							if (igeInstance) {
								if (item.value) {
									igeInstance.setDimensionResultMode(Module.DimensionResultMode.Both);
									$scope.tools.update();
								} else {
									igeInstance.setDimensionResultMode(Module.DimensionResultMode.Positive);
								}
							}
						});
					}
				};
				nagativeItem = {
					id: 'negative',
					sort: 123,
					caption: 'model.wdeviewer.dimension.negative',
					iconClass: 'tlb-icons ico-2dqto-negative',
					type: 'check',
					value: false,
					fn: function (id, item) {
						applyToWde(function (wdeCtrl) {
							var igeInstance = wdeCtrl.getIGEInstance();

							if (igeInstance) {
								if (item.value) {
									igeInstance.setDimensionResultMode(Module.DimensionResultMode.Negative);
									$scope.tools.update();
								} else {
									igeInstance.setDimensionResultMode(Module.DimensionResultMode.Both);
								}
							}
						});
					}
				};
				positiveItem = {
					id: 'positive',
					sort: 124,
					caption: 'model.wdeviewer.dimension.positive',
					iconClass: 'tlb-icons ico-2dqto-positive',
					type: 'check',
					value: false,
					fn: function (id, item) {
						applyToWde(function (wdeCtrl) {
							var igeInstance = wdeCtrl.getIGEInstance();

							if (igeInstance) {
								if (item.value) {
									igeInstance.setDimensionResultMode(Module.DimensionResultMode.Positive);
									$scope.tools.update();
								} else {
									igeInstance.setDimensionResultMode(Module.DimensionResultMode.Both);
								}
							}
						});
					}
				};
				deleteItem = {
					id: 'delete',
					sort: 125,
					caption: 'model.wdeviewer.dimension.delete',
					iconClass: 'tlb-icons ico-rec-delete',
					type: 'item',
					fn: deleteSelectedDimension
				};
				dragItem = {
					id: 'drag',
					sort: 127,
					caption: 'model.viewer.operator.drag.name',
					iconClass: 'tlb-icons ico-view-drag',
					type: 'check',
					value: false,
					fn: function (id, item) {
						applyToWde(function (wdeCtrl) {
							if (item.value) {
								wdeCtrl.setSelectionMode();
								wdeCtrl.element.bind('mousedown', onMouseDown);
							} else {
								wdeCtrl.element.unbind('mousedown', onMouseDown);
							}
						});
					}
				};

				var filterOptions = [
					{
						id: 'filter.disabled',
						type: 'radio',
						// disabled: true,
						caption: 'model.wdeviewer.filter.disabled',
						value: modelWdeViewerFilterMode.disabled,
						fn: function () {
							viewSettings.filterMode = modelWdeViewerFilterMode.disabled;
							sidebarFilter.unregisterUser(filterUser);
							applyToWde(function (wdeCtrl) {
								wdeCtrl.refreshDimensions();
							});
						}
					},
					{
						id: 'filter.byHeader',
						type: 'radio',
						// disabled: true,
						caption: 'model.wdeviewer.filter.byHeader',
						value: modelWdeViewerFilterMode.header,
						fn: function () {
							viewSettings.filterMode = modelWdeViewerFilterMode.header;
							sidebarFilter.unregisterUser(filterUser);
							applyToWde(function (wdeCtrl) {
								wdeCtrl.refreshDimensions();
							});
						}
					},
					{
						id: 'filter.sidebar',
						type: 'radio',
						// disabled: true,
						caption: 'model.wdeviewer.filter.sidebar',
						value: modelWdeViewerFilterMode.sidebar,
						fn: function () {
							viewSettings.filterMode = modelWdeViewerFilterMode.sidebar;
							sidebarFilter.registerUser(filterUser);
							applyToWde(function (wdeCtrl) {
								wdeCtrl.refreshDimensions();
							});
						}
					}
				];

				if (dimensionService && dimensionService.disableHeaderFilter) {
					filterOptions.splice(1, 1);
				}

				filterGroup = [
					{
						id: 'filtering',
						caption: 'model.wdeviewer.objectFiltering',
						type: 'dropdown-btn',
						iconClass: 'tlb-icons ico-filtering',
						list: {
							showImages: false,
							cssClass: 'dropdown-menu-right',
							items: [
								{
									id: 'filterGroup',
									type: 'sublist',
									list: {
										cssClass: 'radio-group',
										showTitles: true,
										activeValue: viewSettings.filterMode,
										items: filterOptions
									}
								}
							]
						}
					}
				];

				$scope.viewerOptions.dimensionService = dimensionService;

				dimensionService.onDimensionsChanged.register(onDimensionsChanged);
				dimensionService.onDimensionSelected.register(onDimensionSelected);
				dimensionService.onDimensionDeleting.register(onDimensionDeleting);
				dimensionService.onDimensionsDeleted.register(onDimensionsDeleted);

				destroyFns.push(function () {
					dimensionService.onDimensionsChanged.unregister(onDimensionsChanged);
					dimensionService.onDimensionSelected.unregister(onDimensionSelected);
					dimensionService.onDimensionDeleting.unregister(onDimensionDeleting);
					dimensionService.onDimensionsDeleted.unregister(onDimensionsDeleted);
				});

				if (!dimensionService.readonly) {
					destroyFns.push(modelWdeViewerObserverService.watch(function () {
						var template = dimensionService.getObjectTemplate();
						if (template) {
							return template.positiveColor;
						}
						return null;
					}, function () {
						updateDefaultDimensionGroup();
					}));

					destroyFns.push(modelWdeViewerObserverService.watch(function () {
						var template = dimensionService.getObjectTemplate();
						if (template) {
							return template.negativeColor;
						}
						return null;
					}, function () {
						updateDefaultDimensionGroup();
					}));

					destroyFns.push(modelWdeViewerObserverService.watch(function () {
						var template = dimensionService.getObjectTemplate();
						if (template) {
							return template.positiveTexture;
						}
						return null;
					}, function () {
						updateDefaultDimensionGroup();
					}));

					destroyFns.push(modelWdeViewerObserverService.watch(function () {
						var template = dimensionService.getObjectTemplate();
						if (template) {
							return template.negativeTexture;
						}
						return null;
					}, function () {
						updateDefaultDimensionGroup();
					}));
				}

				// sidebar model object filter
				if (viewSettings.filterMode === modelWdeViewerFilterMode.sidebar) {
					sidebarFilter.registerUser(filterUser);
				}

				objectSidebarSvc.requireSidebar();
				destroyFns.push(objectSidebarSvc.unrequireSidebar);
				// sidebar model object filter
			}

			var refreshItem = {

				id: 'view-refresh',
				sort: 113,
				caption: 'model.viewer.refresh',
				iconClass: ' tlb-icons ico-refresh',
				type: 'item',
				fn: function () {
					applyToWde(function (wdeCtrl) {
						wdeCtrl.refreshView();
					});
				}
			};

			var compareItem = {
				id: 'view-compare',
				sort: 114,
				caption: 'model.wdeviewer.compare.title',
				iconClass: ' tlb-icons ico-compare',
				type: 'item',
				fn: function () {
					applyToWde(function (wdeCtrl) {
						wdeCtrl.showComparisonDialog();
					});
				}
			};

			var printItem = {
				id: 'print',
				sort: 115,
				caption: 'cloud.common.print',
				iconClass: 'tlb-icons ico-print',
				type: 'item',
				fn: function () {
					applyToWde(function (wdeCtrl) {
						var layouts = wdeCtrl.getLayouts();
						var currentLayout = wdeCtrl.getCurrentLayout();
						var igeInstance = wdeCtrl.getIGEInstance();

						if (!igeInstance || _.isNil($scope.modelId)) {
							return;
						}

						wdeCtrl.generateLegendsAsync().then(function (legends) {
							modelWdeViewerPrintingService.publishIge(igeInstance, {
								legends: legends,
								pageInfo: (layouts.indexOf(currentLayout) + 1) + '/' + layouts.length
							});
						});
					});
				}
			};

			layerItem = {
				id: 'layer',
				sort: 110,
				caption: 'model.wdeviewer.layerMode',
				iconClass: 'tlb-icons ico-mode-level',
				type: 'check',
				value: false,
				fn: function (id, item) {
					applyToWde(function (wdeCtrl) {
						var igeInstance = wdeCtrl.getIGEInstance();

						if (igeInstance) {
							if (item.value) {
								igeInstance.setOperationMode(Module.OperationMode.Layer);
							} else {
								igeInstance.setOperationMode(Module.OperationMode.Dimension);
							}
						}
					});
				}
			};

			var fontItem = {
				id: 'view-font',
				sort: 114,
				caption: 'model.wdeviewer.uploadFont',
				iconClass: ' tlb-icons ico-upload',
				type: 'item',
				fn: function () {
					modelWdeViewerFontService.showUploadDialog();
				}
			};

			var restoreItem = {
				id: 'view-restore',
				sort: 116,
				caption: 'model.wdeviewer.viewRestore',
				iconClass: 'tlb-icons ico-set-prj-context',
				type: 'item',
				fn: function () {
					var item = $injector.get('cloudDesktopPinningContextService').getPinningItem('model.main');
					modelWdeViewerSelectionService.selectModel(item ? item.id : null);
				}
			};

			var permissionItem = {
				id: 'view-permission',
				sort: 116,
				caption: 'model.viewer.permissionSummary',
				iconClass: 'tlb-icons ico-permission-summary',
				type: 'item',
				fn: function () {
					$injector.get('basicsCommonPermissionSummaryService').showDialog('model.wdeViewer.2d');
				}
			};

			let pdfDownloadItem = {
				id: 'view-pdf-download',
				sort: 117,
				caption: 'basics.common.upload.button.downloadPdfCaption',
				iconClass: 'tlb-icons ico-download-markers',
				type: 'item',
				fn: function () {
					applyToWde(function (ctrl) {
						let igeInstance = ctrl.getIGEInstance();
						if (!igeInstance || _.isNil($scope.modelId)) {
							return;
						}
						$injector.get('modelWdeViewerAnnotationService').savePdfWithAnnMarker($scope.modelId);
					});
				},
				disabled: canDownloadPdf
			};

			var displayModeItem = {
				id: 'view-display-mode',
				sort: 117,
				caption: 'model.wdeviewer.toggle3D',
				iconClass: 'tlb-icons ico-view-switch-outside',
				type: 'item',
				fn: function () {
					applyToWde(function (ctrl) {
						ctrl.toggleDisplayMode();
					});
				}
			};

			var defaultViewGroup = {
				id: 'defaultViewGroup',
				caption: 'model.viewer.cameraPos',
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-view-cam-pos',
				list: {
					showImages: true,
					cssClass: 'dropdown-menu-right',
					items: [
						{
							id: 'view-top',
							sort: 118,
							caption: 'model.viewer.cameraTop',
							iconClass: 'tlb-icons ico-view-top',
							type: 'item',
							fn: function () {
								applyToWde(function (ctrl) {
									var engine = ctrl.getIGEInstance();
									engine.setDefaultView(Module.DefaultView.Bottom);
								});
							}
						},
						{
							id: 'view-bottom',
							sort: 119,
							caption: 'model.viewer.cameraBottom',
							iconClass: 'tlb-icons ico-view-bottom',
							type: 'item',
							fn: function () {
								applyToWde(function (ctrl) {
									var engine = ctrl.getIGEInstance();
									engine.setDefaultView(Module.DefaultView.Top);
								});
							}
						},
						{
							id: 'view-left',
							sort: 120,
							caption: 'model.viewer.cameraLeft',
							iconClass: 'tlb-icons ico-view-left',
							type: 'item',
							fn: function () {
								applyToWde(function (ctrl) {
									var engine = ctrl.getIGEInstance();
									engine.setDefaultView(Module.DefaultView.Right);
								});
							}
						},
						{
							id: 'view-right',
							sort: 121,
							caption: 'model.viewer.cameraRight',
							iconClass: 'tlb-icons ico-view-right',
							type: 'item',
							fn: function () {
								applyToWde(function (ctrl) {
									var engine = ctrl.getIGEInstance();
									engine.setDefaultView(Module.DefaultView.Left);
								});
							}
						},
						{
							id: 'view-front',
							sort: 122,
							caption: 'model.viewer.cameraFront',
							iconClass: 'tlb-icons ico-view-front',
							type: 'item',
							fn: function () {
								applyToWde(function (ctrl) {
									var engine = ctrl.getIGEInstance();
									engine.setDefaultView(Module.DefaultView.Back);
								});
							}
						},
						{
							id: 'view-back',
							sort: 123,
							caption: 'model.viewer.cameraBack',
							iconClass: 'tlb-icons ico-view-back',
							type: 'item',
							fn: function () {
								applyToWde(function (ctrl) {
									var engine = ctrl.getIGEInstance();
									engine.setDefaultView(Module.DefaultView.Front);
								});
							}
						}
					]
				},
				disabled: function () {
					if (isLoaded && engineCtrl) {
						return !engineCtrl.is3DModeEnabled();
					}

					return true;
				}
			};

			$scope.getEngine = function () {
				return engine;
			};

			// ---status bar---
			var statusBarLink = modelWdeViewerStatusBarService.initializeStatusBar($scope);
			// ---end of status bar---

			// ---drag and drop---
			modelWdeViewerDragdropService.initialize($scope, viewUUID);
			// ---end of drag and drop---

			function buildToolItems() {
				var items = [];

				if (modelWdeViewerSelectionService.isTakeOffEnabled()) {
					items.push(calibrationGroup);
					items.push(measurementGroup);
					items.push(displayModeItem);
					items.push(defaultViewGroup);

					if (!readonly && dimensionServiceName) {
						if (dimensionService.readonly) {
							items = items.concat([nagativeItem, positiveItem, bothItem]);
						} else {
							items = items.concat([editItem, lineItem, nagativeItem, positiveItem, bothItem, deleteItem, dragItem]);
						}
						items = items.concat(filterGroup);
					}
				}
				addZoomWidth();
				items.push(zoomGroup);
				items.push(markerGroup);

				if (viewSettings.groupAnnoCommands && !modelWdeViewerMarkupService.isDocumentDefaultMode) {
					items.push(annotationTools);
				} else {
					items.push(annotationSimple);
					if (!modelWdeViewerMarkupService.isDocumentDefaultMode) {
						items.push(annotationRfi);
						items.push(annotationDefect);
						items.push(annotationCheckList);
					}
				}

				items.push(rotateGroup);
				// toolItems.push(settingGroup);
				items.push(viewSettingItem);

				items.push(refreshItem);
				items.push(printItem);
				// toolItems.push(fontItem);
				items.push(restoreItem);

				if (modelWdeViewerSelectionService.isTakeOffEnabled()) {
					items.push(layerItem);
					items.push(compareItem);
				}

				items.push(pdfDownloadItem);
				items.forEach(function (item) {
					if (item.id === 'subModelMenu' || _.isFunction(item.disabled)) {
						return;
					}

					item.disabled = function () {
						return !isLoaded;
					};
				});
				items.push(permissionItem);

				if(modelWdeViewerMarkupService.annoExtensionService && modelWdeViewerMarkupService.annoExtensionService.buildToolItems){
					modelWdeViewerMarkupService.annoExtensionService.buildToolItems(items);
				}

				return items;
			}

			function canDownloadPdf() {
				const pdf_DocumentType = 1;
				if (!isLoaded) {
					return true;
				}
				if (modelWdeViewerSelectionService.isTakeOffEnabled()) {
					let data = viewerDataService.getSelectedModel();
					if (data && data.info) {
						let modelItem = $injector.get('modelProjectModelDataService').getSelected();
						if (modelItem) {
							return modelItem.DocumentTypeFk !== pdf_DocumentType;
						}
					}
				}
				if (!modelWdeViewerMarkupService.currentPreviewDataService){
					return true;
				}
				let doc = modelWdeViewerMarkupService.currentPreviewDataService.getSelected();
				let extensionName = '';
				if (doc && doc.OriginFileName) {
					extensionName = doc.OriginFileName.substr(doc.OriginFileName.lastIndexOf('.')).replace('*', '').replace('.', '').replace(' ', '').toLowerCase();
				}
				let isDownload = extensionName === 'pdf';
				if (extensionName.length <= 0 && doc && (doc.DocumentTypeFk === pdf_DocumentType || doc.BasDocumentTypeFk === pdf_DocumentType)) {
					isDownload = true;
				}
				return !isDownload;
			}
			function onDimensionsChanged() {
				var viewSettings = modelWdeViewerIgeService.getViewSetting(viewerId);

				if (viewSettings.filterMode === modelWdeViewerFilterMode.header) {
					applyToWde(function (wdeCtrl) {
						wdeCtrl.refreshDimensions();
					});
				}
			}

			function onDimensionSelected(modelId) {
				if ($scope.modelId === modelId) {
					applyToWde(function (wdeCtrl) {
						wdeCtrl.selectLayoutAndDimensions();
						$scope.tools.update();
					});
				}
			}

			function onDimensionDeleting(e, args) {
				applyToWde(function (wdeCtrl) {
					var engine = wdeCtrl.getIGEInstance();
					engine.unloadDimensions([args.id]);
					$scope.tools.update();
				});
			}

			function onDimensionsDeleted(uuids) {
				applyToWde(function (wdeCtrl) {
					var engine = wdeCtrl.getIGEInstance();
					engine.unloadDimensions(uuids);
				});
			}

			function setDimensionCreationMode(mode, callback) {
				applyToWde(function (wdeCtrl) {
					var igeInstance = wdeCtrl.getIGEInstance();

					if (igeInstance) {
						if (angular.isNumber(mode)) {
							mode = [Module.DimensionMode.Count, Module.DimensionMode.Length, Module.DimensionMode.Area][mode - 1];
						}

						igeInstance.cancel(); // cancel action mode
						igeInstance.startActionMode(Module.ActionMode.None);
						igeInstance.setOperationMode(Module.OperationMode.Dimension);
						igeInstance.setDimensionMode(mode);

						if (callback) {
							callback(igeInstance);
						}
					}
				});
			}

			function updateDefaultDimensionGroup() {
				applyToWde(function (wdeCtrl) {
					var dimensionGroup = dimensionService.getDefaultDimensionGroup();

					if (_.isNil(dimensionGroup)) {
						return;
					}

					wdeCtrl.updateDefaultDimensionGroup(dimensionGroup);
				});
			}

			function setMeasurementMode(mode) {
				applyToWde(function (wdeCtrl) {
					var igeInstance = wdeCtrl.getIGEInstance();

					if (igeInstance) {
						if (mode === Module.ActionMode.None) {
							igeInstance.setOperationMode(Module.OperationMode.Dimension);
						} else {
							igeInstance.setOperationMode(Module.OperationMode.Layer);
						}
						igeInstance.startActionMode(mode);
					}
				});
			}

			function applyToWde(func) {
				$scope.$broadcast('wde.apply', func);
			}

			function loadModel() {
				var source = modelViewerFixedModuleConfigurationService.getModelSelectionSource();

				function getModelIdFromModelInfo(data) {
					if (data.info.isComposite) {
						return modelWdeViewerSubModelFilterMenuService.getSubModelId();
					}

					return data.info.modelId;
				}

				var onModelSelectionChange = function () {
					resetStatusBar();
					if (modelWdeViewerMarkupService.isDocumentDefaultMode) {
						return;
					}
					var data = viewerDataService.getSelectedModel();
					var modelId = viewerDataService.getSelectedModelId();
					// when version select
					if (data && data.info) {
						modelId = getModelIdFromModelInfo(data);
					}

					modelWdeViewerSubModelFilterMenuService.removeMenu(toolItems);
					let statusFieldValue = {
						id: 'dimension',
						value: $translate.instant('model.wdeviewer.takeOffMode')
					};
					modelWdeViewerSelectionService.enableTakeOffMode();
					refreshTools();
					statusBarLink.updateFields([statusFieldValue]);

					if (data) {
						$scope.modelId = modelId;
						modelWdeViewerMarkupService.docId = modelId;
						modelWdeViewerSubModelFilterMenuService.insertMenu($scope, toolItems);
					} else {
						$scope.modelId = null;
						modelWdeViewerMarkupService.docId = null;
					}

					if ($scope.tools) {
						$scope.tools.update();
					}
				};

				viewerDataService.onSelectedModelChanged.register(onModelSelectionChange);

				switch (source) {
					case 'modelDataService':
						$scope.viewerOptions.getEmptyModelInfo = function () {
							return labels.noModelListSelected;
						};
						break;
					case 'pinnedModel':
						$scope.viewerOptions.getEmptyModelInfo = function () {
							return labels.noModelPinned;
						};
						break;
					default:
						throw new Error('Unsupported item source: ' + source);
				}

				viewerDataService.setItemSource(source);

				if (modelWdeViewerSelectionService.isTakeOffEnabled()) {
					onModelSelectionChange();
				}
				if (modelWdeViewerMarkupService.isDocumentDefaultMode){
					// no tip when pdfViewer
					$scope.viewerOptions.getEmptyModelInfo = function () {
						return ' ';
					};
				}

				var unwatchDocument = watchDocument();

				return function () {
					unwatchDocument();
					viewerDataService.onSelectedModelChanged.unregister(onModelSelectionChange);
				};
			}

			function watchDocument() {
				if(modelWdeViewerSelectionService.isDocumentModeEnabled()) {
					$scope.modelId = modelWdeViewerSelectionService.getSelectedModelId();
				}

				function onSelectionChanged() {
					isLoaded = false;
					modelWdeViewerMarkupService.CleanComments();
					resetStatusBar();
					$scope.modelId = modelWdeViewerSelectionService.getSelectedModelId();
					refreshTools();
					let statusFieldValue = {
						id: 'dimension',
						value: $translate.instant('model.wdeviewer.documentMode')};
					statusBarLink.updateFields([statusFieldValue]);
					$scope.isLoading = ($scope.modelId !== null);
				}

				modelWdeViewerSelectionService.selectionChanged.register(onSelectionChanged);

				return function () {
					modelWdeViewerSelectionService.selectionChanged.unregister(onSelectionChanged);
				};
			}

			$scope.loadingMessage = $translate.instant('model.wdeviewer.loadingMessage');
			function onModelObjectSelectionChanged() {
				if (dimensionService) {
					var selectedObjectIds = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds();
					dimensionService.select(selectedObjectIds.useGlobalModelIds());
				}
			}

			function resetStatusBar() {
				modelWdeViewerStatusBarService.resetModel(statusBarLink);
				modelWdeViewerStatusBarService.resetLayout(statusBarLink);
				modelWdeViewerStatusBarService.resetLayer(statusBarLink);
				modelWdeViewerStatusBarService.resetVersion(statusBarLink);
			}
			function showModelStatus() {
				applyToWde(function (wdeCtrl) {
					modelWdeViewerStatusBarService.updateModel(statusBarLink, wdeCtrl, {
						modelId: $scope.modelId
					});
				});
			}

			function showVersionStatus() {
				applyToWde(function (wdeCtrl) {
					modelWdeViewerStatusBarService.updateVersion(statusBarLink, wdeCtrl, {
						modelId: $scope.modelId
					});
				});
			}

			function showLayoutStatus() {
				applyToWde(function (wdeCtrl) {
					modelWdeViewerStatusBarService.updateLayout(statusBarLink, wdeCtrl, {
						modelId: $scope.modelId
					});
				});
			}

			function showLayerStatus() {
				applyToWde(function (wdeCtrl) {
					modelWdeViewerStatusBarService.updateLayer(statusBarLink, wdeCtrl);
				});
			}

			function showDimensionStatus() {
				applyToWde(function (wdeCtrl) {
					destroyFns.push(modelWdeViewerObserverService.watch(function () {
						var igeInstance = wdeCtrl.getIGEInstance();

						if (!igeInstance) {
							return 0;
						}

						var dims = wdeCtrl.getSelectedDimension();
						return dims ? dims.length : 0;
					}, function (newValue) {
						statusBarLink.updateFields([{
							id: 'dimension',
							value: newValue + ' ' + labels.selectedDimensions
						}]);
					}));
				});
			}

			function refreshTools() {
				toolItems = buildToolItems();
				$scope.tools.items = toolItems;
				$scope.tools.refresh();
			}

			$scope.setTools({
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: buildToolItems()
			});

			$scope.modelId = null;

			destroyFns.push(loadModel());

			modelViewerCompositeModelObjectSelectionService.registerSelectionChanged(onModelObjectSelectionChanged);
			if (modelWdeViewerMarkupService.annoExtensionService && modelWdeViewerMarkupService.annoExtensionService.registerEvents){
				modelWdeViewerMarkupService.annoExtensionService.registerEvents();
			}

			// todo-wui: 2D viewer actions are not the same with 3D viewer
			var viewerActions = modelWdeViewerActionsService.getActions();
			var viewerInfo = new viewerRegistry.ViewerInfo(viewUUID, viewDisplayName, 'model.wdeviewer.numberedTitle', viewerActions);
			viewerRegistry.registerViewer(viewerInfo, viewerActions);

			modelWdeViewerIgeService.recalibrateDone.register(onRecalibrateDone);

			function onRecalibrateDone(args) {
				if (!readonly) {
					if ($scope.modelId === args.modelId) {
						applyToWde(function (wdeCtrl) {
							wdeCtrl.refreshDimensions();
						});
					}
				}
			}

			$scope.$on('model.wdeviewer.loading', function () {
				isLoaded = false;
				$scope.tools.update();
				resetStatusBar();
				showVersionStatus();
			});

			$scope.$on('model.wdeviewer.loaded', function () {
				isLoaded = true;
				$scope.isLoading = false;
				$scope.tools.update();
				showLayoutStatus();
				showLayerStatus();
				showVersionStatus();
				showModelStatus();
				if (!readonly && dimensionServiceName && modelWdeViewerSelectionService.isTakeOffEnabled()) {
					showDimensionStatus();
				}
				$injector.get('modelWdeViewerAnnotationService').clearActionMarker();
			});

			function spliceToolItem(toolItemId) {
				var idx = _.findIndex($scope.tools.items, function (item) {
					return item.id === toolItemId;
				});
				if (idx > -1) {
					$scope.tools.items.splice(idx, 1);
				}
			}

			function appendToolItem(toolItemId, annoTool, startIdx) {
				var idx = _.findIndex($scope.tools.items, function (item) {
					return item.id === toolItemId;
				});
				if (idx === -1) {
					$scope.tools.items.splice(startIdx + 1, 0, annoTool);
				}
			}

			function updateAnnoToolBar(args) {
				var scaleBtnIdx = _.findIndex($scope.tools.items, function (item) {
					return item.id === 'markerGroup';
				});
				if (args.groupAnnoCommands && !modelWdeViewerMarkupService.isDocumentDefaultMode) {
					appendToolItem('annotation-group', annotationTools, scaleBtnIdx);
					spliceToolItem('annotation-simple');
					spliceToolItem('annotation-rfi');
					spliceToolItem('annotation-defect');
					spliceToolItem('annotation-checklist');
				} else {
					spliceToolItem('annotation-group');
					if (!modelWdeViewerMarkupService.isDocumentDefaultMode) {
						appendToolItem('annotation-checklist', annotationCheckList, scaleBtnIdx);
						appendToolItem('annotation-defect', annotationDefect, scaleBtnIdx);
						appendToolItem('annotation-rfi', annotationRfi, scaleBtnIdx);
					}
					appendToolItem('annotation-simple', annotationSimple, scaleBtnIdx);
				}
				$scope.tools.update();
			}

			modelWdeViewerIgeService.callViewConfig.register(updateAnnoToolBar);

			function showAnnotationChange(args) {
				var isCheck = args.value;
				var groupBtn = _.find($scope.tools.items, {id: 'annotation-group'});
				if (args.isAll) {
					modelWdeViewerMarkupService.isAllSelect = isCheck;
					var annotationBtn = _.find($scope.tools.items, {id: 'annotation-simple'});
					if (annotationBtn) {
						annotationBtn.value = isCheck;
					} else if (groupBtn) {
						annotationBtn = _.find(groupBtn.list.items, {id: 'annotation-simple'});
						if (annotationBtn) {
							annotationBtn.value = isCheck;
						}
					}
				}
				if (args.isRfi || args.isAll) {
					modelWdeViewerMarkupService.isShowRfi = isCheck;
					var rfiBtn = _.find($scope.tools.items, {id: 'annotation-rfi'});
					if (rfiBtn) {
						rfiBtn.value = isCheck;
					} else if (groupBtn) {
						rfiBtn = _.find(groupBtn.list.items, {id: 'annotation-rfi'});
						if (rfiBtn) {
							rfiBtn.value = isCheck;
						}
					}
				}
				if (args.isDefect || args.isAll) {
					modelWdeViewerMarkupService.isShowDefect = isCheck;
					var defectBtn = _.find($scope.tools.items, {id: 'annotation-defect'});
					if (defectBtn) {
						defectBtn.value = isCheck;
					} else if (groupBtn) {
						defectBtn = _.find(groupBtn.list.items, {id: 'annotation-defect'});
						if (defectBtn) {
							defectBtn.value = isCheck;
						}
					}
				}
				if (args.isCheckList || args.isAll) {
					modelWdeViewerMarkupService.isShowCheckList = isCheck;
					var checklistBtn = _.find($scope.tools.items, {id: 'annotation-checklist'});
					if (checklistBtn) {
						checklistBtn.value = isCheck;
					} else if (groupBtn) {
						checklistBtn = _.find(groupBtn.list.items, {id: 'annotation-checklist'});
						if (checklistBtn) {
							checklistBtn.value = isCheck;
						}
					}
				}
				$scope.tools.update();
			}

			modelWdeViewerMarkupService.showAnnotationChange.register(showAnnotationChange);

			$scope.$on('model.wdeviewer.status', function (e, msg) {
				statusBarLink.updateFields([{
					id: 'status',
					value: msg
				}]);
			});

			$scope.$on('$destroy', function () {
				sidebarFilter.unregisterUser(filterUser);
				viewerRegistry.unregisterViewer(viewUUID);
				$scope.isLoading = false;
				modelWdeViewerIgeService.callViewConfig.unregister(updateAnnoToolBar);
				modelWdeViewerMarkupService.showAnnotationChange.unregister(showAnnotationChange);
				modelViewerCompositeModelObjectSelectionService.unregisterSelectionChanged(onModelObjectSelectionChanged);
				if (modelWdeViewerMarkupService.annoExtensionService && modelWdeViewerMarkupService.annoExtensionService.unregisterEvents) {
					modelWdeViewerMarkupService.annoExtensionService.unregisterEvents();
				}
				modelWdeViewerIgeService.recalibrateDone.unregister(onRecalibrateDone);
				modelWdeViewerSelectionService.selected = null; // if the read(preview) document, open another module, PDF viewer automatically displays (no data selected), so null selected
				destroyFns.forEach(function (fn) {
					fn();
				});
				modelWdeViewerMarkupService.annoExtensionService = null;
			});
		}
	]);

})(angular);
