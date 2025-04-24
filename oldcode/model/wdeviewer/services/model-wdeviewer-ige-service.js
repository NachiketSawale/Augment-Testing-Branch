/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals, Module, _ */
/* jshint -W098 */
(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).constant('modelWdeViewerIgeLabelType', {
		none: 0,
		name: 1,
		quantity: 2,
		nameQuantity: 3
	});

	angular.module(moduleName).constant('modelWdeViewerIgeCutoutProperty', {
		cutoutArea: 'CutoutArea',
		cutoutLength: 'CutoutLength',
		areaExcludingCutouts: 'AreaExcludingCutouts',
		lengthExcludingCutouts : 'LengthExcludingCutouts',
		segmentCountExcludingCutouts: 'SegmentCountExcludingCutouts',
		vertexCountExcludingCutouts: 'VertexCountExcludingCutouts'
	});

	angular.module(moduleName).factory('modelWdeViewerIgeService', [
		'$q',
		'$http',
		'$translate',
		'platformDialogService',
		'mainViewService',
		'modelWdeViewerIgeLabelType',
		'modelWdeViewerWdeConstants',
		'PlatformMessenger',
		'platformModalService',
		'platformTranslateService',
		'platformModalFormConfigService',
		'modelProjectModelDataService',
		'modelWdeViewerFilterMode',
		'basicsLookupdataLookupDescriptorService',
		'modelWdeViewerLabelService', '$injector',
		function ($q,
			$http,
			$translate,
			platformDialogService,
			mainViewService,
			modelWdeViewerIgeLabelType,
			modelWdeViewerWdeConstants,
			PlatformMessenger,
			platformModalService,
			platformTranslateService,
			platformModalFormConfigService,
			modelProjectModelDataService,
			modelWdeViewerFilterMode,
			basicsLookupdataLookupDescriptorService,
			modelWdeViewerLabelService, $injector) {
			var service = {
				models: {},
				views: {},
				getModelPart: function (modelId) {
					if (!service.models[modelId]) {
						service.models[modelId] = new ModelPart();
					}

					return service.models[modelId];
				},
				getViewPart: function (viewId) {
					if (!service.views[viewId]) {
						service.views[viewId] = new ViewPart();
					}

					return service.views[viewId];
				},
				isPreviewDocument: true,
				isLayoutNameChange: false
			};
			var object2DWebApiBaseUrl = globals.webApiBaseUrl + 'model/main/object2d/';

			function ModelPart() {
				this.info = null;
				this.config = null;
				this.settings = null;
				this.dimensions = [];
			}

			function ViewPart() {
				this.settings = null;
			}

			function ModelSetting() {
				this.layout = null;
				this.uomFk = null;
				this.drawingDistanceX = 1.0;
				this.actualDistanceX = 1.0;
				this.drawingDistanceY = 1.0;
				this.actualDistanceY = 1.0;
				this.drawingDistance = 1.0;
				this.actualDistance = 1.0;
				this.calibrated = false;
				this.angle = 0;
				this.calibration = null;
				this.layoutSettings = [];
				this.layoutNames = [];
				this.isShowMarkup = false;
				this.layoutSort = [];
				this.isFeet = false;
				this.isImperial = false;
				// used by ige engine to solve offset issue, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 53970.88915271428, 120161.05249170371, 0, 1]
				this.toOriginMatrix = {};
			}

			function LayoutSetting() {
				this.lid = null; // layout id
				this.name = null;// layout name
				this.uomFk = null;
				this.drawingDistanceX = 1.0;
				this.actualDistanceX = 1.0;
				this.drawingDistanceY = 1.0;
				this.actualDistanceY = 1.0;
				this.drawingDistance = 1.0;
				this.actualDistance = 1.0;
				this.calibrated = false;
				this.angle = 0;
				this.calibration = null;
				this.custom = false;
				this.isFeet = false;
				this.isImperial = false;
			}

			function ModelInfo() {
				this.drawingId = null;
			}

			function ViewSetting() {
				this.renderMode = modelWdeViewerWdeConstants.clientSideRendering;
				this.filterMode = modelWdeViewerFilterMode.disabled;
				this.highlightColor = 33023;
				this.text = true;
				this.white = false;
				this.monochrome = false;
				this.labelType = modelWdeViewerIgeLabelType.name;
				this.message = false;
				this.showLegend = false;
				this.showHatching = false;
				this.markupScale = 1;
				this.lineStyle = false;
				this.lineWeight = false;
				this.groupAnnoCommands = false;
				this.zoomSelectMarkup = true;
				this.noMarkupDialog = false;
				this.defaultMarkupColor = 16711680;// '#FF0000';// default red
				this.fontHeight = 20;// default markup font size
			}

			service.recalibrateDone = new PlatformMessenger();

			function isDelModel(modelId){
				const selectionModelService = $injector.get('modelWdeViewerSelectionService');
				return selectionModelService.deleteModels && selectionModelService.deleteModels.indexOf(modelId) > -1;
			}
			service.override = function (target, source) {
				for (var p in target) {
					if (target.hasOwnProperty(p)) {
						if (p.startsWith('__')) {
							continue;
						}

						if (target.hasOwnProperty(p) && source.hasOwnProperty(p)) {
							if (angular.isArray(target[p]) && angular.isArray(source[p])) {
								target[p] = source[p];
							} else if (angular.isObject(target[p]) && angular.isObject(source[p])) {
								service.override(target[p], source[p]);
							} else {
								target[p] = source[p];
							}
						}
					}
				}
			};

			service.repair = function (target, source) {
				for (var p in source) {
					if (source.hasOwnProperty(p)) {
						if (p.startsWith('__')) {
							continue;
						}

						if (source.hasOwnProperty(p) && !target.hasOwnProperty(p)) {
							target[p] = source[p];
						} else if (angular.isObject(source[p]) && angular.isObject(target[p])) {
							service.repair(target[p], source[p]);
						}
					}
				}
				return target;
			};

			service.isConverted = function (modelId) {
				return $http.get(globals.webApiBaseUrl + 'model/wdeviewer/info/conversioninfo?modelId=' + modelId).then(function (res) {
					return res.data ? res.data : res;
				});
			};

			service.loadModel = function (modelId) {
				var deferred = $q.defer();

				if (isDelModel(modelId)) {
					deferred.resolve({});
					return deferred.promise;
				}
				service.loadModelConfig(modelId).then(function () {
					var modelPart = service.getModelPart(modelId);

					if (modelPart.info) {
						if (modelPart.info.converted) {
							deferred.resolve(modelPart.info);
						} else {
							service.isConverted(modelId).then(function (conversionInfo) {
								modelPart.info.uploaded = conversionInfo.Uploaded;
								modelPart.info.converted = conversionInfo.Converted;
								modelPart.info.isPdf = conversionInfo.IsPdf;
								modelPart.info.message = conversionInfo.Message;
								deferred.resolve(modelPart.info);
							});
						}
					} else {
						service.isConverted(modelId).then(function (conversionInfo) {
							var modelItems = modelProjectModelDataService.getList();
							var model = _.find(modelItems, {Id: modelId});

							if (model) {
								modelPart.info = {
									drawingId: model.Uuid,
									uploaded: conversionInfo.Uploaded,
									converted: conversionInfo.Converted,
									isPdf: conversionInfo.IsPdf,
									code: model.Code
								};
								deferred.resolve(modelPart.info);
							} else {
								let modelUrl = service.getModelInfoUrl('model/project/model/selectioninfo?modelId=');
								$http.get(globals.webApiBaseUrl + modelUrl + modelId).then(function (res) {
									let resData = (res && res.data) ? res.data : res;
									modelPart.info = {
										drawingId: resData.modelUuid ? resData.modelUuid : resData.Uuid,
										uploaded: conversionInfo.Uploaded,
										converted: conversionInfo.Converted,
										isPdf: conversionInfo.IsPdf,
										code: resData.modelCode ? resData.modelCode : resData.Code
									};
									deferred.resolve(modelPart.info);
								});
							}
						});
					}
				});

				return deferred.promise;
			};

			service.getModelInfoUrl = function (modelUrl) {
				if ($injector.get('modelWdeViewerSelectionService').isDocumentModeEnabled()) {
					modelUrl = 'model/wdeviewer/info/previewmodel?modelId=';
				}
				return modelUrl;
			};

			service.getDefaultModelSetting = function () {
				return new ModelSetting();
			};

			service.getDefaultViewSetting = function () {
				return new ViewSetting();
			};

			service.loadModelConfig = function (modelId) {
				var modelPart = service.getModelPart(modelId);

				if (modelPart.config) {
					return $q.when(modelPart.config);
				}

				return $http.get(object2DWebApiBaseUrl + 'loadmodelconfig?modelId=' + modelId).then(function (res) {
					modelPart.config = res.data;
					modelPart.settings = service.getDefaultModelSetting();

					if (res.data.Config) {
						var settings = JSON.parse(res.data.Config);
						service.override(modelPart.settings, settings);
						modelPart.settings.toOriginMatrix = settings.toOriginMatrix;
					}

					return modelPart.config;
				});
			};

			service.getCurrentLayout = function (modelId) {
				var part = service.getModelPart(modelId);
				return part.settings.layout;
			};

			service.saveCurrentLayout = function (modelId, layoutId) {
				if (service.getCurrentLayout(modelId) !== layoutId) {
					service.isLayoutNameChange = false;
					return service.saveModelConfig(modelId, {
						layout: layoutId
					});
				}
			};

			service.getCurrentOriginMatrix = function (modelId) {
				var layoutId = service.getCurrentLayout(modelId),
					modelSettings = service.getModelSetting(modelId);

				if (!modelSettings.toOriginMatrix || !modelSettings.toOriginMatrix[layoutId]) {
					return null;
				}

				return modelSettings.toOriginMatrix[layoutId];
			};

			service.saveModelConfig = function (modelId, modelconfig, layoutConfig, options) {
				var deferred = $q.defer();
				var modelPart = service.getModelPart(modelId);

				if (layoutConfig && !isDelModel(modelPart.config.ModelFk)) {
					var layoutSettings = service.getLayoutSettings(modelId, layoutConfig.lid);
					var oldScale = service.extractScale(layoutSettings);
					var data = {
						oldScale: oldScale.ratio,
						oldUomFk: layoutSettings.uomFk,
						isScaleChanged: false,
						isUomChanged: false,
						custom: layoutConfig.custom,
						isFeet: layoutConfig.isFeet,
						isImperial: layoutConfig.isImperial
					};

					if (options) {
						if (options.checkScale) {
							var newScale = service.extractScale(layoutConfig);

							if (oldScale.ratio !== newScale.ratio) {
								data.isScaleChanged = true;
								data.newScale = newScale.ratio;
							}
						}

						if (options.checkUom) {
							if (layoutSettings.uomFk !== layoutConfig.uomFk) {
								data.isUomChanged = true;
								data.newUomFk = layoutConfig.uomFk;
							}
						}

						if (layoutSettings.custom && !layoutConfig.custom) {
							var modelSettings = service.getModelSetting(modelId);
							var modelScale = service.extractScale(modelSettings);

							if (data.isScaleChanged) {
								// load general config back, nothing changed, only recalibrate current layout
								if (modelScale.ratio === data.newScale) {
									data.custom = true;
								}
							}

							if (data.isUomChanged) {
								// load general config back, uom is changed, recalibrate all general layouts
								if (modelSettings.uomFk !== data.newUomFk) {
									data.custom = false;
								}
							}
						}
					}

					if (data.isScaleChanged || data.isUomChanged) {
						if (!options || !options.disableRecalibration) {
							service.startRecalibrate(modelId, data).then(function (res) {
								if (res.ok) {
									save(data.isScaleChanged);
								}
							});

							return deferred.promise;
						}
					}
				}

				save(false);

				function save() {
					service.override(modelPart.settings, modelconfig);

					if (layoutConfig) {
						if (layoutConfig.custom) {
							service.createCustomLayout(modelPart, layoutConfig);
						} else {
							service.override(modelPart.settings, layoutConfig);
							service.removeCustomLayout(modelPart, layoutConfig);
						}
					}

					if (modelPart.config) {
						modelPart.config.Config = JSON.stringify(modelPart.settings);

						$http.post(object2DWebApiBaseUrl + 'savemodelconfig', modelPart.config).then(function (res) {
							modelPart.config = res.data;
							deferred.resolve(modelPart.config);
						}, function (error) {
							deferred.reject(error);
						});
					}
				}

				return deferred.promise;
			};

			service.createCustomLayout = function (modelPart, layoutConfig) {
				if (!angular.isArray(modelPart.settings.layoutSettings)) {
					modelPart.settings.layoutSettings = [];
				}

				var lSettings = _.find(modelPart.settings.layoutSettings, {lid: layoutConfig.lid, custom: true});

				if (_.isNil(lSettings)) {
					lSettings = new LayoutSetting();
					lSettings.lid = layoutConfig.lid;
					lSettings.name = layoutConfig.layout;
					modelPart.settings.layoutSettings.push(lSettings);
				}

				service.override(lSettings, layoutConfig);

				return lSettings;
			};

			service.removeCustomLayout = function (modelPart, layoutConfig) {
				if (!angular.isArray(modelPart.settings.layoutSettings)) {
					return;
				}

				_.remove(modelPart.settings.layoutSettings, {lid: layoutConfig.lid});
			};

			service.getModelSetting = function (modelId) {
				var modelData = service.models[modelId];
				var defaults = service.getDefaultModelSetting();

				if (!modelData) {
					modelData = new ModelPart();
					service.models[modelId] = modelData;
				}

				if (!modelData.settings) {
					modelData.settings = defaults;
				}

				return modelData.settings;
			};

			service.getLayoutSettings = function (modelId, layoutId) {
				var modelPart = service.getModelPart(modelId);

				if (!angular.isArray(modelPart.settings.layoutSettings)) {
					modelPart.settings.layoutSettings = [];
				}

				var lSettings = _.find(modelPart.settings.layoutSettings, {lid: layoutId, custom: true});

				if (_.isNil(lSettings)) {
					lSettings = new LayoutSetting();
					lSettings.lid = modelPart.settings.layout;
					lSettings.name = modelPart.settings.name;
					service.override(lSettings, modelPart.settings);
				}

				return lSettings;
			};

			service.getCurrentLayoutSettings = function (modelId) {
				var modelPart = service.getModelPart(modelId);
				return modelPart.settings ? service.getLayoutSettings(modelId, modelPart.settings.layout) : {};
			};

			service.getViewSetting = function (viewId) {
				var viewData = service.views[viewId];
				var defaults = service.getDefaultViewSetting();

				if (!viewData) {
					viewData = new ViewPart();

					var settings = mainViewService.customData(viewId, 'viewerSettings');

					if (viewData.settings) {
						service.override(viewData.settings, settings);
					} else {
						viewData.settings = settings;
					}

					if (viewData.settings) {
						service.repair(viewData.settings, defaults);
					}

					service.views[viewId] = viewData;
				}

				if (!viewData.settings) {
					viewData.settings = defaults;
				}

				return viewData.settings;
			};

			service.getModelSettingsFormConfig = function (options) {
				return {
					fid: 'model.wdeviewer.config',
					showGrouping: true,
					groups: [
						{
							gid: 'drawing',
							header$tr$: 'model.wdeviewer.drawingTitle',
							isOpen: true,
							sortOrder: 100
						}
					],
					rows: [
						// {
						//     gid: 'drawing',
						//     label$tr$: 'model.wdeviewer.layout',
						//     type: 'select',
						//     options: {
						//         items: options.layouts,
						//         valueMember: 'value',
						//         displayMember: 'text',
						//         modelIsObject: false
						//     },
						//     model: 'layout',
						//     visible: true,
						//     sortOrder: 100,
						//     readonly: false,
						//     validator: function (entity, value) {
						//         if (entity.layoutSettings && entity.layoutSettings.length) {
						//             var lSettings = _.find(entity.layoutSettings, {lid: value});
						//             if (lSettings) {
						//                 angular.extend(entity, lSettings);
						//             }
						//         }
						//     }
						// },
						{
							gid: 'drawing',
							label$tr$: 'model.wdeviewer.uomBase',
							type: 'directive',
							directive: 'basics-lookupdata-uom-lookup',
							options: {
								filterOptions: {
									fn: function (item) {
										return item.LengthDimension === 1;
									}
								}
							},
							model: 'uomFk',
							visible: true,
							sortOrder: 100,
							readonly: false
						},
						// {
						//     gid: 'drawing',
						//     label$tr$: 'model.wdeviewer.scaleX',
						//     type: 'directive',
						//     directive: 'model-wde-viewer-scale-control',
						//     // model: 'scaleX',
						//     options: {
						//         model1: 'drawingDistanceX',
						//         model2: 'actualDistanceX'
						//     },
						//     visible: true,
						//     sortOrder: 100,
						//     readonly: false
						// },
						// {
						//     gid: 'drawing',
						//     label$tr$: 'model.wdeviewer.scaleY',
						//     type: 'directive',
						//     directive: 'model-wde-viewer-scale-control',
						//     // model: 'scaleY',
						//     options: {
						//         model1: 'drawingDistanceY',
						//         model2: 'actualDistanceY'
						//     },
						//     visible: true,
						//     sortOrder: 100,
						//     readonly: false
						// },
						{
							gid: 'drawing',
							label$tr$: 'model.wdeviewer.scale',
							type: 'directive',
							directive: 'model-wde-viewer-scale-control',
							// model: 'scaleY',
							options: {
								model1: 'drawingDistance',
								model2: 'actualDistance'
							},
							visible: true,
							sortOrder: 100,
							readonly: false
						},
						{
							gid: 'drawing',
							label$tr$: 'model.wdeviewer.calibration.storeScaleInPage',
							type: 'boolean',
							model: 'custom',
							visible: true,
							sortOrder: 100,
							readonly: false,
							validator: function (entity, value) {
								if (!value) {
									var modelSettings = service.getModelSetting(options.modelId);
									entity.uomFk = modelSettings.uomFk;
									entity.drawingDistance = modelSettings.drawingDistance;
									entity.actualDistance = modelSettings.actualDistance;
								}
							}
						}
					]
				};
			};

			service.showModelConfigDialog = function (modelId, options) {
				var layouts = options.layouts;
				var modelSettings = service.getModelSetting(modelId);
				var layoutSettings = service.getCurrentLayoutSettings(modelId);
				var dataItem = {
					lid: modelSettings.layout,
					layout: modelSettings.layout,
					uomFk: layoutSettings.uomFk,
					drawingDistance: layoutSettings.drawingDistance,
					actualDistance: layoutSettings.actualDistance,
					custom: layoutSettings.custom
				};
				var configDialogOptions = {
					title: $translate.instant('model.wdeviewer.modelConfigTitle'),
					formConfiguration: [],
					dataItem: dataItem
				};

				if (!_.isNil(options.layout)) {
					dataItem.layout = options.layout;
				}

				if (angular.isArray(layouts) && layouts.length) {
					layouts = layouts.map(function (item) {
						return {
							value: item.id,
							text: item.name
						};
					});
				} else {
					layouts = [];
				}

				configDialogOptions.formConfiguration = service.getModelSettingsFormConfig({
					layouts: layouts,
					modelId: modelId
				});

				platformTranslateService.translateFormConfig(configDialogOptions.formConfiguration);

				return platformModalFormConfigService.showDialog(configDialogOptions).then(function (result) {
					if (result.ok) {
						result.data.calibrated = true;
						service.saveModelConfig(modelId, {}, result.data, {
							checkScale: false,
							checkUom: true
						});

						var oldScale = service.getLayoutScale(modelId, dataItem.lid);
						var newScale = service.extractScale(result.data);

						return {
							ok: true,
							layout: result.data.layout,
							scale: newScale,
							isScaleChanged: (oldScale.ratio !== newScale.ratio),
							isUomChanged: (layoutSettings.uomFk !== dataItem.uomFk),
							uomFk: dataItem.uomFk
						};
					}

					return {
						ok: false
					};
				});
			};

			service.getScaleSettingsFormConfig = function (options) {
				return {
					fid: 'model.wdeviewer.scale.config',
					showGrouping: true,
					groups: [
						{
							gid: 'drawing',
							header$tr$: 'model.wdeviewer.scale',
							isOpen: true,
							sortOrder: 100
						}
					],
					rows: [
						{
							gid: 'drawing',
							label$tr$: 'model.wdeviewer.uomBase',
							type: 'directive',
							directive: 'basics-lookupdata-uom-lookup',
							options: {
								filterOptions: {
									fn: function (item) {
										return item.LengthDimension === 1;
									}
								},
								displayMember: 'DescriptionInfo.Translated'
							},
							model: 'uomFk',
							visible: true,
							sortOrder: 100,
							readonly: false
						},
						{
							gid: 'drawing',
							label$tr$: 'model.wdeviewer.scale',
							type: 'directive',
							directive: 'model-wde-viewer-scale-control',
							options: {
								model1: 'drawingDistance',
								model2: 'actualDistance'
							},
							visible: true,
							sortOrder: 100,
							readonly: !options.canCalibrate
						},
						{
							gid: 'drawing',
							label$tr$: 'model.wdeviewer.calibration.storeScaleInPage',
							type: 'boolean',
							model: 'custom',
							visible: true,
							sortOrder: 100,
							readonly: !options.canCalibrate,
							validator: function (entity, value) {
								if (!value) {
									var modelSettings = service.getModelSetting(options.modelId);
									entity.uomFk = modelSettings.uomFk;
									entity.drawingDistance = modelSettings.drawingDistance;
									entity.actualDistance = modelSettings.actualDistance;
								}
							}
						}
					]
				};
			};

			service.showScaleConfigDialog = function (modelId, canCalibrate) {
				var modelSettings = service.getModelSetting(modelId);
				var layoutSettings = service.getCurrentLayoutSettings(modelId);
				var dataItem = {
					lid: modelSettings.layout,
					layout: modelSettings.layout,
					uomFk: layoutSettings.uomFk,
					drawingDistance: layoutSettings.drawingDistance,
					actualDistance: layoutSettings.actualDistance,
					custom: layoutSettings.custom,
					isFeet: layoutSettings.isFeet,
					isImperial: layoutSettings.isImperial
				};
				var configDialogOptions = {
					title: $translate.instant('model.wdeviewer.scaleSetting'),
					formConfiguration: [],
					dataItem: dataItem
				};

				configDialogOptions.formConfiguration = service.getScaleSettingsFormConfig({
					modelId: modelId,
					canCalibrate: canCalibrate
				});

				platformTranslateService.translateFormConfig(configDialogOptions.formConfiguration);

				var deferred = $q.defer();

				platformModalFormConfigService.showDialog(configDialogOptions).then(function (result) {
					if (result.ok) {
						result.data.calibrated = true;

						var modelConfig = {};
						var layoutConfig = result.data;
						var oldScale = service.extractScale(layoutSettings);
						var newScale = service.extractScale(result.data);

						var res = {
							ok: true,
							layout: result.data.layout,
							scale: newScale,
							isScaleChanged: (oldScale.ratio !== newScale.ratio),
							isUomChanged: (layoutSettings.uomFk !== dataItem.uomFk),
							isUnitHintChange: (layoutSettings.isImperial !== dataItem.isImperial),
							uomFk: dataItem.uomFk,
							rdData: null,
							isImperial: dataItem.isImperial,
							isFeet: dataItem.isFeet
						};

						var data = {
							oldUomFk: layoutSettings.uomFk,
							newUomFk: dataItem.uomFk,
							oldScale: service.extractScale(layoutSettings).ratio,
							newScale: service.extractScale(layoutConfig).ratio,
							isScaleChanged: res.isScaleChanged,
							isUomChanged: res.isUomChanged,
							custom: dataItem.custom
						};

						if (res.isScaleChanged || res.isUnitHintChange) {
							service.startRecalibrate(modelId, data, true).then(function (r) {
								if (r.ok) {
									if (r.context.forecast.AffectedObjectCount > 0) {
										if (res.isUnitHintChange) {
											platformDialogService.showInfoBox('model.wdeviewer.notAllowChangeSystemUnit');
											res = {
												ok: false
											};
										} else if (res.isScaleChanged) {
											res.rdData = {
												dimensions: r.context.forecast.Dimensions,
												modelConfig: modelConfig,
												layoutConfig: layoutConfig
											};
										} else {
											service.saveModelConfig(modelId, modelConfig, layoutConfig, {
												checkScale: false,
												checkUom: res.isUomChanged
											});
										}
									} else {
										service.saveModelConfig(modelId, modelConfig, layoutConfig, {
											checkScale: false,
											checkUom: res.isUomChanged
										});
									}
									deferred.resolve(res);
								}
							});
						} else {
							service.saveModelConfig(modelId, modelConfig, layoutConfig, {
								checkScale: false,
								checkUom: res.isUomChanged
							});
							deferred.resolve(res);
						}
					}

					return {
						ok: false
					};
				});

				return deferred.promise;
			};

			service.getViewSettingsFormConfig = function () {
				var labels = modelWdeViewerLabelService.getDimensionTypeLabels();

				var config = {
					fid: 'model.wdeviewer.config',
					showGrouping: false,
					groups: [
						// {
						//     gid: 'connection',
						//     header$tr$: 'model.wdeviewer.connectionTitle',
						//     isOpen: true,
						//     sortOrder: 100
						// },
						{
							gid: 'color',
							header$tr$: 'model.wdeviewer.colorTitle',
							isOpen: true,
							sortOrder: 100
						}
					],
					rows: [
						// {
						//     gid: 'connection',
						//     label$tr$: 'model.wdeviewer.renderMode',
						//     type: 'select',
						//     options: {
						//         items: [
						//             {value: modelWdeViewerWdeConstants.clientSideRendering, text: 'Client Side'},
						//             {value: modelWdeViewerWdeConstants.serverSideRendering, text: 'Server Side'}
						//         ],
						//         valueMember: 'value',
						//         displayMember: 'text',
						//         modelIsObject: false
						//     },
						//     model: 'renderMode',
						//     visible: true,
						//     sortOrder: 100,
						//     readonly: false
						// },
						{
							gid: 'color',
							label$tr$: 'model.wdeviewer.text',
							type: 'boolean',
							model: 'text',
							visible: true,
							sortOrder: 100,
							readonly: false
						},
						{
							gid: 'color',
							label$tr$: 'model.wdeviewer.white',
							type: 'boolean',
							model: 'white',
							visible: true,
							sortOrder: 100,
							readonly: false
						},
						{
							gid: 'color',
							label$tr$: 'model.wdeviewer.monochrome',
							type: 'boolean',
							model: 'monochrome',
							visible: true,
							sortOrder: 100,
							readonly: false
						},
						{
							gid: 'color',
							label$tr$: 'model.wdeviewer.message',
							type: 'boolean',
							model: 'message',
							visible: true,
							sortOrder: 100,
							readonly: false
						},
						{
							gid: 'color',
							label$tr$: 'model.wdeviewer.print.showLegend',
							type: 'boolean',
							model: 'showLegend',
							visible: true,
							sortOrder: 100,
							readonly: false
						},
						{
							gid: 'color',
							label$tr$: 'model.wdeviewer.showHatching',
							type: 'boolean',
							model: 'showHatching',
							visible: true,
							sortOrder: 100,
							readonly: false
						},
						{
							gid: 'color',
							label$tr$: 'model.wdeviewer.lineStyle',
							type: 'boolean',
							model: 'lineStyle',
							visible: true,
							sortOrder: 100,
							readonly: false
						},
						{
							gid: 'color',
							label$tr$: 'model.wdeviewer.lineWeight',
							type: 'boolean',
							model: 'lineWeight',
							visible: true,
							sortOrder: 100,
							readonly: false
						}
					]
				};
				if (service.isPreviewDocument) {
					if (!$injector.get('modelWdeViewerMarkupService').isDocumentDefaultMode) {
						config.rows.unshift(
							{
								gid: 'color',
								label$tr$: 'model.administration.groupAnnoCommands',
								type: 'boolean',
								model: 'groupAnnoCommands',
								visible: true,
								sortOrder: 100,
								readonly: false
							}
						);
					}
					config.rows.unshift(
						{
							gid: 'color',
							label$tr$: 'model.wdeviewer.highlightColor',
							type: 'color',
							model: 'highlightColor',
							visible: true,
							sortOrder: 100,
							readonly: false
						}
					);
				}
				if (service.isPreviewDocument) {
					config.rows.push(
						{
							gid: 'color',
							label$tr$: 'model.wdeviewer.dimensionLabel.type',
							type: 'select',
							options: {
								items: [
									{value: modelWdeViewerIgeLabelType.none, text: labels.none},
									{value: modelWdeViewerIgeLabelType.name, text: labels.name},
									{value: modelWdeViewerIgeLabelType.quantity, text: labels.quantityUnit},
									{value: modelWdeViewerIgeLabelType.nameQuantity, text: labels.nameQuantityUnit}
								],
								valueMember: 'value',
								displayMember: 'text',
								modelIsObject: false
							},
							model: 'labelType',
							visible: true,
							sortOrder: 100,
							readonly: false
						}
					);
				}
				config.rows.push(
					{
						gid: 'color',
						label$tr$: 'model.wdeviewer.markup.zoomMarkup',
						type: 'boolean',
						model: 'zoomSelectMarkup',
						visible: true,
						sortOrder: 100,
						readonly: false
					}
				);
				config.rows = config.rows.concat([{
					gid: 'color',
					label$tr$: 'model.wdeviewer.markup.noMarkupDialog',
					type: 'boolean',
					model: 'noMarkupDialog',
					visible: true,
					sortOrder: 100,
					readonly: false
				},{
					gid: 'color',
					label$tr$: 'model.wdeviewer.markup.markupColor',
					type: 'color',
					model: 'defaultMarkupColor',
					visible: true,
					sortOrder: 100,
					readonly: false
				},{
					gid: 'color',
					label$tr$: 'model.wdeviewer.textFontHeight',
					type: 'integer',
					model: 'fontHeight',
					visible: true,
					sortOrder: 100,
					readonly: false
				}]);
				return config;
			};

			service.callViewConfig = new PlatformMessenger();
			service.showViewConfigDialog = function (viewId) {
				var dataItem = service.getDefaultViewSetting();
				service.override(dataItem, service.getViewSetting(viewId));
				var configDialogOptions = {
					title: $translate.instant('model.wdeviewer.configTitle'),
					formConfiguration: service.getViewSettingsFormConfig(),
					dataItem: dataItem
				};

				platformTranslateService.translateFormConfig(configDialogOptions.formConfiguration);

				return platformModalFormConfigService.showDialog(configDialogOptions).then(function (result) {
					if (result.ok) {
						var part = service.getViewPart(viewId);
						result.labelTypeChanged = (part.settings.labelType !== result.data.labelType);
						if(part.settings.groupAnnoCommands !== result.data.groupAnnoCommands){
							service.callViewConfig.fire({
								groupAnnoCommands: result.data.groupAnnoCommands
							});
						}
						part.settings = result.data;
						// saveViewerSettings
						delete part.settings.__rt$data;
						mainViewService.customData(viewId, 'viewerSettings', part.settings);

						// Cancel Continuous Markup creation
						$injector.get('modelWdeViewerMarkupService').igeCtrl.cancel();
						$injector.get('modelWdeViewerAnnotationService').clearActionMarker();
					}

					return result;
				});
			};

			service.getCalibrationFormConfig = function (mode) {
				var config = {
					fid: 'model.wdeviewer.calibration',
					showGrouping: true,
					groups: [
						{
							gid: 'calibration',
							header$tr$: 'model.wdeviewer.calibration.title',
							isOpen: true,
							sortOrder: 100
						}
					],
					rows: [
						{
							gid: 'calibration',
							label$tr$: 'model.wdeviewer.calibration.measuredDistance',
							type: 'factor',
							model: 'measuredDistance',
							visible: true,
							sortOrder: 100,
							readonly: true
						},
						{
							gid: 'calibration',
							label$tr$: 'model.wdeviewer.calibration.actualMeasurement',
							type: 'factor',
							model: 'actualDistance',
							visible: true,
							sortOrder: 100,
							readonly: false
						},
						{
							gid: 'calibration',
							label$tr$: 'model.wdeviewer.uomBase',
							type: 'directive',
							directive: 'basics-lookupdata-uom-lookup',
							options: {
								filterOptions: {
									fn: function (item) {
										return item.LengthDimension === 1;
									}
								},
								events: [
									{
										name: 'onEditValueChanged',
										handler: function (e, args) {
											var result = service.checkImperial(args.selectedItem);
											args.entity.isFeet = result.isFeet;
											args.entity.isImperial = result.isFeet || result.isInch;
										}
									}
								]
							},
							model: 'uomFk',
							visible: true,
							sortOrder: 100,
							readonly: false
						},
						{
							gid: 'calibration',
							label$tr$: 'model.wdeviewer.calibration.storeScaleInPage',
							type: 'boolean',
							model: 'custom',
							visible: true,
							sortOrder: 100,
							readonly: false
						}
					]
				};

				// switch (mode) {
				//     case WDE_CONSTANTS.CALIBRATION.X: {
				//         config.rows.push({
				//             gid: 'calibration',
				//             label$tr$: 'model.wdeviewer.calibration.applyToY',
				//             type: 'boolean',
				//             model: 'applyOther',
				//             visible: true,
				//             sortOrder: 100,
				//             readonly: false
				//         });
				//     }
				//         break;
				//     case WDE_CONSTANTS.CALIBRATION.Y: {
				//         config.rows.push({
				//             gid: 'calibration',
				//             label$tr$: 'model.wdeviewer.calibration.applyToX',
				//             type: 'boolean',
				//             model: 'applyOther',
				//             visible: true,
				//             sortOrder: 100,
				//             readonly: false
				//         });
				//     }
				//         break;
				// }

				return config;
			};

			service.showCalibrationDialog = function (modelId, mode, distance, angle) {
				var settings = service.getModelSetting(modelId);
				var layoutSettings = service.getCurrentLayoutSettings(modelId);
				var scale = service.getScale(modelId);

				var dataItem = {
					lid: settings.layout,
					measuredDistance: distance / scale.ratio,
					actualDistance: distance,
					applyOther: true,
					uomFk: layoutSettings.uomFk,
					custom: layoutSettings.custom,
					isFeet: layoutSettings.isFeet,
					isImperial: layoutSettings.isImperial
				};
				var configDialogOptions = {
					title: '',
					formConfiguration: service.getCalibrationFormConfig(mode),
					dataItem: dataItem
				};

				switch (mode) {
					case Module.ScreenAxis.Horizontal: {
						configDialogOptions.title = $translate.instant('model.wdeviewer.calibration.x');
					}
						break;
					case Module.ScreenAxis.Vertical: {
						configDialogOptions.title = $translate.instant('model.wdeviewer.calibration.y');
					}
						break;
					default: {
						configDialogOptions.title = $translate.instant('model.wdeviewer.calibration.free');
					}
						break;
				}

				platformTranslateService.translateFormConfig(configDialogOptions.formConfiguration);

				var deferred = $q.defer();

				platformModalFormConfigService.showDialog(configDialogOptions).then(function (result) {
					if (result.ok) {
						var modelConfig = {}, layoutConfig = {lid: settings.layout};

						// support fractional imperial format
						if(dataItem.isImperial && dataItem.isFeet) {
							dataItem.actualDistance = dataItem.actualDistance * 12;
						}

						switch (mode) {
							case Module.ScreenAxis.Horizontal: {
								layoutConfig.drawingDistanceX = dataItem.measuredDistance;
								layoutConfig.actualDistanceX = dataItem.actualDistance;

								if (dataItem.applyOther) {
									settings.drawingDistanceY = dataItem.measuredDistance;
									settings.actualDistanceY = dataItem.actualDistance;
								}
							}
								break;
							case Module.ScreenAxis.Vertical: {
								layoutConfig.drawingDistanceY = dataItem.measuredDistance;
								layoutConfig.actualDistanceY = dataItem.actualDistance;

								if (dataItem.applyOther) {
									layoutConfig.drawingDistanceX = dataItem.measuredDistance;
									layoutConfig.actualDistanceX = dataItem.actualDistance;
								}
							}
								break;
						}

						layoutConfig.calibrated = true;
						layoutConfig.calibration = mode;
						layoutConfig.angle = angle;
						layoutConfig.drawingDistance = dataItem.measuredDistance;
						layoutConfig.actualDistance = dataItem.actualDistance;
						layoutConfig.uomFk = dataItem.uomFk;
						layoutConfig.custom = dataItem.custom;
						layoutConfig.isImperial = dataItem.isImperial;
						layoutConfig.isFeet = dataItem.isFeet;

						var res = {
							ok: true,
							scale: service.extractScale(layoutConfig),
							isScaleChanged: (dataItem.actualDistance !== distance),
							isUomChanged: (layoutSettings.uomFk !== dataItem.uomFk),
							isUnitHintChange: (layoutSettings.isImperial !== dataItem.isImperial),
							uomFk: dataItem.uomFk,
							rdData: null, // recalibrate dimension data
							isImperial: dataItem.isImperial,
							isFeet: dataItem.isFeet
						};

						var data = {
							oldUomFk: layoutSettings.uomFk,
							newUomFk: dataItem.uomFk,
							oldScale: service.extractScale(layoutSettings).ratio,
							newScale: service.extractScale(layoutConfig).ratio,
							isScaleChanged: res.isScaleChanged,
							isUomChanged: res.isUomChanged,
							custom: dataItem.custom,
							isImperial: dataItem.isImperial,
							isFeet: dataItem.isFeet
						};

						if (res.isScaleChanged || res.isUnitHintChange) {
							service.startRecalibrate(modelId, data, true).then(function (r) {
								if (r.ok) {
									if (r.context.forecast.AffectedObjectCount > 0) {
										if (res.isUnitHintChange) {
											platformDialogService.showInfoBox('model.wdeviewer.notAllowChangeSystemUnit');
											res = {
												ok: false
											};
										} else if (res.isScaleChanged || (res.isImperial && res.isUomChanged)) {
											res.rdData = {
												dimensions: r.context.forecast.Dimensions,
												modelConfig: modelConfig,
												layoutConfig: layoutConfig
											};
										} else {
											service.saveModelConfig(modelId, modelConfig, layoutConfig, {
												checkScale: false,
												checkUom: res.isUomChanged
											});
										}
									} else {
										service.saveModelConfig(modelId, modelConfig, layoutConfig, {
											checkScale: false,
											checkUom: res.isUomChanged
										});
									}
									deferred.resolve(res);
								}
							});
						} else {
							service.saveModelConfig(modelId, modelConfig, layoutConfig, {
								checkScale: false,
								checkUom: res.isUomChanged
							});
							deferred.resolve(res);
						}
					}

					return {
						ok: false
					};
				});

				return deferred.promise;
			};

			service.getScale = function (modelId) {
				var settings = service.getCurrentLayoutSettings(modelId);
				return service.extractScale(settings);
			};

			service.getLayoutScale = function (modelId, layoutId) {
				var settings = service.getLayoutSettings(modelId, layoutId);
				return service.extractScale(settings);
			};

			service.extractScale = function (settings) {
				var x = settings.actualDistanceX / settings.drawingDistanceX;
				var y = settings.actualDistanceY / settings.drawingDistanceY;
				var ratio = settings.actualDistance / settings.drawingDistance;

				var data = {
					x: angular.isNumber(x) && !_.isNaN(x) ? x : 1,
					y: angular.isNumber(y) && !_.isNaN(y) ? y : 1,
					ratio: angular.isNumber(ratio) && !_.isNaN(ratio) ? ratio : 1,
					mode: settings.calibration,
					angle: settings.angle || 0,
					isImperial: settings.isImperial,
					isFeet: settings.isFeet
				};

				// if (settings.isFeet) {
				// 	data.ratio = data.ratio / 12;
				// }

				return data;
			};

			service.resetScale = function (modelId) {
				var deferred = $q.defer();
				var defaults = new LayoutSetting();
				var layoutConfig = service.getCurrentLayoutSettings(modelId);

				defaults.lid = layoutConfig.lid;
				defaults.name = layoutConfig.layout;
				defaults.custom = true;
				defaults.uomFk = layoutConfig.uomFk;

				var oldScale = service.extractScale(layoutConfig);
				var newScale = service.extractScale(defaults);

				var res = {
					ok: true
				};

				var data = {
					oldUomFk: layoutConfig.uomFk,
					newUomFk: layoutConfig.uomFk,
					oldScale: oldScale.ratio,
					newScale: newScale.ratio,
					isScaleChanged: oldScale.ratio !== newScale.ratio,
					isUomChanged: false,
					custom: true
				};

				if (data.isScaleChanged) {
					service.startRecalibrate(modelId, data, true).then(function (r) {
						if (r.ok) {
							if (r.context.forecast.AffectedObjectCount > 0) {
								res.rdData = {
									dimensions: r.context.forecast.Dimensions,
									modelConfig: {},
									layoutConfig: defaults
								};

								deferred.resolve(res);
							} else {
								service.saveModelConfig(modelId, {}, defaults, {
									checkScale: true,
									checkUom: false
								}).then(function () {
									deferred.resolve(res);
								});
							}
						}
					});
				} else {
					service.saveModelConfig(modelId, {}, defaults, {
						checkScale: true,
						checkUom: false
					}).then(function () {
						deferred.resolve(res);
					});
				}

				return deferred.promise;
			};

			service.resetScale2 = function (modelId) {
				var deferred = $q.defer();
				var dataItem = {
					custom: true
				};
				var configDialogOptions = {
					title: $translate.instant('model.wdeviewer.calibration.reset'),
					formConfiguration: [],
					dataItem: dataItem
				};

				configDialogOptions.formConfiguration = {
					fid: 'model.wdeviewer.scale.config',
					showGrouping: false,
					groups: [
						{
							gid: 'drawing',
							header$tr$: 'model.wdeviewer.scale',
							isOpen: true,
							sortOrder: 100
						}
					],
					rows: [
						{
							gid: 'drawing',
							label$tr$: 'model.wdeviewer.calibration.storeScaleInPage',
							type: 'boolean',
							model: 'custom',
							visible: true,
							sortOrder: 100,
							readonly: true
						}
					]
				};

				platformTranslateService.translateFormConfig(configDialogOptions.formConfiguration);

				platformModalFormConfigService.showDialog(configDialogOptions).then(function (res) {
					if (res.ok) {
						var defaults = new LayoutSetting();
						var layoutConfig = service.getCurrentLayoutSettings(modelId);

						defaults.lid = layoutConfig.lid;
						defaults.name = layoutConfig.layout;
						defaults.custom = dataItem.custom;
						defaults.uomFk = layoutConfig.uomFk;

						var oldScale = service.extractScale(layoutConfig);
						var newScale = service.extractScale(defaults);

						var res = {
							ok: true
						};

						var data = {
							oldUomFk: layoutConfig.uomFk,
							newUomFk: layoutConfig.uomFk,
							oldScale: oldScale.ratio,
							newScale: newScale.ratio,
							isScaleChanged: oldScale.ratio !== newScale.ratio,
							isUomChanged: false,
							custom: dataItem.custom
						};

						if (data.isScaleChanged) {
							service.startRecalibrate(modelId, data, true).then(function (r) {
								if (r.ok) {
									if (r.context.forecast.AffectedObjectCount > 0) {
										res.rdData = {
											dimensions: r.context.forecast.Dimensions,
											modelConfig: {},
											layoutConfig: defaults
										};

										deferred.resolve(res);
									} else {
										service.saveModelConfig(modelId, {}, defaults, {
											checkScale: true,
											checkUom: false
										}).then(function () {
											deferred.resolve(res);
										});
									}
								}
							});
						} else {
							service.saveModelConfig(modelId, {}, defaults, {
								checkScale: true,
								checkUom: false
							}).then(function () {
								deferred.resolve(res);
							});
						}
					}
				});

				return deferred.promise;
			};

			service.is2DModel = function (modelId) {
				if (_.isNil(modelId)) {
					return $q.when(false);
				}

				return $http.get(globals.webApiBaseUrl + 'model/wdeviewer/info/is2d?modelId=' + modelId, {cache: true}).then(function (res) {
					return res.data;
				});
			};

			service.getDisplayUnit = function (modelId, layoutId) {
				var settings;

				if (_.isNil(layoutId)) {
					settings = service.getCurrentLayoutSettings(modelId);
				} else {
					settings = service.getLayoutSettings(modelId, layoutId);
				}

				if (_.isNil(settings.uomFk)) {
					return $q.when('');
				}

				return service.loadDisplayUnit(settings.uomFk);
			};

			service.loadDisplayUnit = function (uomFk) {
				return basicsLookupdataLookupDescriptorService.loadItemByKey('uom', uomFk).then(function (uomItem) {
					return uomItem.Unit;
				});
			};

			service.isCurrentLayoutCalibrated = function (modelId) {
				var settings = service.getCurrentLayoutSettings(modelId);
				return settings.calibrated;
			};

			service.isLayoutCalibrated = function (modelId, layoutId) {
				var settings = service.getLayoutSettings(modelId, layoutId);
				return settings.calibrated;
			};

			service.getCustomLayouts = function (modelId) {
				var modelSettings = service.getModelSetting(modelId);
				return modelSettings.layoutSettings.filter(function (item) {
					return item.custom;
				}).map(function (item) {
					return item.lid;
				});
			};

			service.startRecalibrate = function (modelId, args, clientSide) {
				var deferred = $q.defer(),
					context = {
						ModelId: modelId,
						BaseUnitId: args.isUomChanged ? args.newUomFk : args.oldUomFk,
						IsFromWde: false
					},
					data = {
						OldScale: args.oldScale,
						NewScale: args.newScale,
						OldUomFk: args.oldUomFk,
						NewUomFk: args.newUomFk,
						IsScaleChanged: args.isScaleChanged,
						IsUomChanged: args.isUomChanged,
						IsCustomLayout: args.custom,
						Layout: service.getCurrentLayout(modelId),
						CustomLayouts: service.getCustomLayouts(modelId)
					};

				$http.post(object2DWebApiBaseUrl + 'beforerecalibrate', {
					Context: context,
					Data: data
				}).then(function (res) {
					var rdContext = {
						forecast: res.data,
						context: context,
						data: data,
						service: service,
						clientSide: clientSide
					};

					if (res.data.AffectedObjectCount > 0) {
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'model.wdeviewer/templates/recalibrate-dialog.html',
							controller: 'modelWdeViewerRecalibrateController',
							width: 800,
							height: 600,
							resizeable: true,
							resolve: {
								'context': [function () {
									return rdContext;
								}]
							}
						}).then(function (res) {
							deferred.resolve(res);
						});
					} else {
						deferred.resolve({
							ok: true,
							context: rdContext
						});
					}
				});

				return deferred.promise;
			};

			service.recalibrate = function (context, data) {
				return $http.post(object2DWebApiBaseUrl + 'recalibrate', {
					Context: context,
					Data: data
				}).then(function () {
					service.recalibrateDone.fire({
						modelId: context.ModelId
					});
				});
			};

			service.showQuestionDialog = function (engine, question, responseOptions) {
				var eResponseCode = {
					rcNone: 0,
					rcOK: 0x01,
					rcCancel: 0x02,
					rcYes: 0x04,
					rcNo: 0x08
				};

				// this definitions is sorted by value descending ..
				const buttonDefinitions = [
					{
						label: 'Yes',
						value: eResponseCode.rcYes,
						enumValue: Module.ResponseCode.Yes
					},
					{
						label: 'No',
						value: eResponseCode.rcNo,
						enumValue: Module.ResponseCode.No,
					},
					{
						label: 'OK',
						value: eResponseCode.rcOK,
						enumValue: Module.ResponseCode.OK,
					},
					{
						label: 'Cancel',
						value: eResponseCode.rcCancel,
						enumValue: Module.ResponseCode.Cancel,
					}
				];

				if (responseOptions === 0) {
					return;
				}

				let availableButtons = [];
				let defIndex = 0;
				let remain = responseOptions;
				// 0 is rcNone ...
				while (remain > 0 && defIndex < buttonDefinitions.length) {
					const defValue = buttonDefinitions[defIndex].value;
					if (remain >= defValue) {
						remain -= defValue;
						availableButtons.push(buttonDefinitions[defIndex]);
					}

					defIndex++;
				}

				var dialogOptions = {
					headerTextKey: 'model.wdeviewer.question.title',
					bodyText: question,
					buttons: _.sortBy(availableButtons.map(function (def) {
						return {
							caption: def.label,
							fn: function (e, info) {
								info.$close(def.enumValue);
							}
						};
					}), 'value'),
					resizeable: true,
					iconClass: 'ico-question',
					showOkButton: false
				};

				return platformDialogService.showDialog(dialogOptions).then(function (responseCode) {
					if (responseCode !== undefined) {
						engine.setResponseCode(responseCode);
					}
				});
			};

			service.checkImperial = function (uom) {
				var isInch = _.toLower(uom.Unit) === 'in' || _.toLower(uom.DescriptionInfo.Description) === 'in' || _.toLower(uom.Unit) === 'inch' || _.toLower(uom.DescriptionInfo.Description) === 'inch';
				var isFeet = _.toLower(uom.Unit) === 'ft' || _.toLower(uom.DescriptionInfo.Description) === 'ft' || _.toLower(uom.Unit) === 'feet' || _.toLower(uom.DescriptionInfo.Description) === 'feet';

				return {
					isInch: isInch,
					isFeet: isFeet
				};
			};

			service.getIgeVersion = function () {
				return $http.get(globals.webApiBaseUrl + 'model/wdeviewer/info/igeversion', {
					cache: true
				}).then(res => {
					return res.data;
				});
			};

			return service;
		}
	]);


})(angular);
