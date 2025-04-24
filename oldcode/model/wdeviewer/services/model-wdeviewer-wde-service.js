/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

// todo-wui: would be deleted while wde is totally removed
if(!window.WDE_CONSTANTS) {
	window.WDE_CONSTANTS = {
		CALIBRATION: {

		}
	};
}
// todo-wui: would be deleted while wde is totally removed

/* global WDE_CONSTANTS */
/* jshint -W098 */
(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).constant('modelWdeViewerWdeConstants', {
		layout: 0,
		layer: 1,
		clientSideRendering: 2,
		serverSideRendering: 3
	});

	angular.module(moduleName).constant('modelWdeViewerFilterMode', {
		disabled: 'disabled',
		header: 'header',
		sidebar: 'sidebar'
	});

	angular.module(moduleName).constant('modelWdeViewerDataMode', {
		model: 'model',
		doc: 'document'
	});

	angular.module(moduleName).constant('modelWdeViewerLabelType', {
		name: WDE_CONSTANTS.DIMENSION_LABEL_NAME,
		nameQuantityUnit: WDE_CONSTANTS.DIMENSION_LABEL_NAME_QUANTITY_AND_UNIT,
		quantityUnit: WDE_CONSTANTS.DIMENSION_LABEL_QUANTITY_AND_UNIT
	});

	angular.module(moduleName).factory('modelWdeViewerWdeService', [
		'$q',
		'$http',
		'$translate',
		'mainViewService',
		'modelWdeViewerLabelType',
		'modelWdeViewerWdeConstants',
		'PlatformMessenger',
		'platformModalService',
		'platformTranslateService',
		'platformModalFormConfigService',
		'modelProjectModelDataService',
		'modelWdeViewerFilterMode',
		'basicsLookupdataLookupDescriptorService',
		'modelWdeViewerLabelService',
		function ($q,
			$http,
			$translate,
			mainViewService,
			modelWdeViewerLabelType,
			modelWdeViewerWdeConstants,
			PlatformMessenger,
			platformModalService,
			platformTranslateService,
			platformModalFormConfigService,
			modelProjectModelDataService,
			modelWdeViewerFilterMode,
			basicsLookupdataLookupDescriptorService,
			modelWdeViewerLabelService) {
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
				isLayoutNameChange: false,
				isIgeViewerEnabled: true
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
				this.calibration = WDE_CONSTANTS.CALIBRATION.NONE;
				this.layoutSettings = [];
				this.layoutNames = [];
				this.isShowMarkup = false;
				this.layoutSort = [];
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
				this.calibration = WDE_CONSTANTS.CALIBRATION.NONE;
				this.custom = false;
			}

			function ModelInfo() {
				this.drawingId = null;
			}

			function ViewSetting() {
				this.renderMode = modelWdeViewerWdeConstants.clientSideRendering;
				this.filterMode = modelWdeViewerFilterMode.disabled;
				this.highlightColor = 33023;
				this.text = true;
				this.hatching = false;
				this.white = false;
				this.monochrome = false;
				this.labelType = modelWdeViewerLabelType.name;
			}

			service.recalibrateDone = new PlatformMessenger();

			service.override = function (target, source) {
				for (var p in target) {
					if(target.hasOwnProperty(p)){
						if(p.startsWith('__')) {
							continue;
						}

						if (target.hasOwnProperty(p) && source.hasOwnProperty(p)) {
							if (angular.isArray(target[p]) && angular.isArray(source[p])) {
								target[p] = source[p];
							}
							else if (angular.isObject(target[p]) && angular.isObject(source[p])) {
								service.override(target[p], source[p]);
							}
							else {
								target[p] = source[p];
							}
						}
					}
				}
			};

			service.repair = function(target, source) {
				for (var p in source) {
					if(source.hasOwnProperty(p)){
						if(p.startsWith('__')) {
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

			service.removeStartWithPage = function removeStartWithPage(editName){
				if (editName.startsWith('Page ')) {
					if(editName.indexOf(':') === 8){
						editName = editName.substr(9);
					}else if(editName.indexOf(':') === -1 && editName.length >= 8 && Number(editName.substr(6,2)) > 0){
						editName = editName.substr(8);
					}
				}
				return editName;
			};

			service.isConverted = function (modelId) {
				return $http.get(globals.webApiBaseUrl + 'model/wdeviewer/info/isconverted?modelId=' + modelId);
			};

			service.loadModel = function (modelId) {
				var deferred = $q.defer();

				service.loadModelConfig(modelId).then(function () {
					var modelPart = service.getModelPart(modelId);

					if (modelPart.info) {
						if(modelPart.info.converted){
							deferred.resolve(modelPart.info);
						}
						else{
							service.isConverted(modelId).then(function (converted) {
								modelPart.info.converted = converted;
								deferred.resolve(modelPart.info);
							});
						}
					}
					else {
						service.isConverted(modelId).then(function (converted) {
							var modelItems = modelProjectModelDataService.getList();
							var model = _.find(modelItems, {Id: modelId});

							if (model) {
								modelPart.info = {
									drawingId: model.Uuid,
									converted: converted
								};
								deferred.resolve(modelPart.info);
							}
							else {
								$http.get(globals.webApiBaseUrl + 'model/project/model/selectioninfo?modelId=' + modelId).then(function (res) {
									modelPart.info = {
										drawingId: res.data.modelUuid,
										converted: converted
									};
									deferred.resolve(modelPart.info);
								});
							}
						});
					}
				});

				return deferred.promise;
			};

			service.getDefaultModelSetting = function () {
				return new ModelSetting();
			};

			service.getDefaultViewSetting = function () {
				return new ViewSetting();
			};

			service.loadModelConfig = function (modelId) {
				var modelPart = service.getModelPart(modelId);

				if(modelPart.config) {
					return $q.when(modelPart.config);
				}

				return $http.get(object2DWebApiBaseUrl + 'loadmodelconfig?modelId=' + modelId).then(function (res) {
					modelPart.config = res.data;
					modelPart.settings = service.getDefaultModelSetting();

					if (res.data.Config) {
						var settings = JSON.parse(res.data.Config);
						service.override(modelPart.settings, settings);
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

			service.saveCurrentOriginMatrix = function (modelId, toOriginMatrix, override) {
				var layoutId = service.getCurrentLayout(modelId),
					modelSettings = service.getModelSetting(modelId);

				if (!modelSettings.toOriginMatrix[layoutId] || override) {
					modelSettings.toOriginMatrix[layoutId] = toOriginMatrix;
					return service.saveModelConfig(modelId, modelSettings, {});
				}
			};

			service.saveModelConfig = function (modelId, modelconfig, layoutConfig, options) {
				var deferred = $q.defer();
				var modelPart = service.getModelPart(modelId);

				if (layoutConfig) {
					var layoutSettings = service.getLayoutSettings(modelId, layoutConfig.lid);
					var oldScale = service.extractScale(layoutSettings);
					var data = {
						oldScale: oldScale.ratio,
						oldUomFk: layoutSettings.uomFk,
						isScaleChanged: false,
						isUomChanged: false,
						custom: layoutConfig.custom
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
						service.startRecalibrate(modelId, data).then(function (success) {
							if (success) {
								save(data.isScaleChanged);
							}
						});

						return deferred.promise;
					}
				}

				save(false);

				function save() {
					service.override(modelPart.settings, modelconfig);

					if (layoutConfig) {
						if (layoutConfig.custom) {
							service.createCustomLayout(modelPart, layoutConfig);
						}
						else {
							service.override(modelPart.settings, layoutConfig);
							service.removeCustomLayout(modelPart, layoutConfig);
						}
					}

					if(modelPart.config){
						modelPart.config.Config = JSON.stringify(modelPart.settings);

						$http.post(object2DWebApiBaseUrl + 'savemodelconfig', modelPart.config).then(function (res) {
							modelPart.config = res.data;
							deferred.resolve(modelPart.config);
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

				if(!modelData.settings){
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
					}
					else {
						viewData.settings = settings;
					}

					if(viewData.settings) {
						service.repair(viewData.settings, defaults);
					}

					service.views[viewId] = viewData;
				}

				if(!viewData.settings){
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
				}
				else {
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
							checkScale: true,
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

			service.showScaleConfigDialog = function (modelId) {
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
					title: $translate.instant('model.wdeviewer.scaleSetting'),
					formConfiguration: [],
					dataItem: dataItem
				};

				configDialogOptions.formConfiguration = service.getScaleSettingsFormConfig({
					modelId: modelId
				});

				platformTranslateService.translateFormConfig(configDialogOptions.formConfiguration);

				return platformModalFormConfigService.showDialog(configDialogOptions).then(function (result) {
					if (result.ok) {
						result.data.calibrated = true;
						service.saveModelConfig(modelId, {}, result.data, {
							checkScale: true,
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
						// {
						//     gid: 'color',
						//     label$tr$: 'model.wdeviewer.hatching',
						//     type: 'boolean',
						//     model: 'hatching',
						//     visible: true,
						//     sortOrder: 100,
						//     readonly: false
						// },
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
						}
					]
				};
				if(service.isPreviewDocument){
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
				if(service.isPreviewDocument){
					config.rows.push(
						{
							gid: 'color',
							label$tr$: 'model.wdeviewer.dimensionLabel.type',
							type: 'select',
							options: {
								items: [
									{value: modelWdeViewerLabelType.name, text: labels.name},
									{value: modelWdeViewerLabelType.nameQuantityUnit, text: labels.nameQuantityUnit},
									{value: modelWdeViewerLabelType.quantityUnit, text: labels.quantityUnit}
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
				return config;
			};

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
						part.settings = result.data;
						// saveViewerSettings
						delete part.settings.__rt$data;
						mainViewService.customData(viewId, 'viewerSettings', part.settings);
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
								}
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
					custom: layoutSettings.custom
				};
				var configDialogOptions = {
					title: '',
					formConfiguration: service.getCalibrationFormConfig(mode),
					dataItem: dataItem
				};

				switch (mode) {
					case WDE_CONSTANTS.CALIBRATION.X: {
						configDialogOptions.title = $translate.instant('model.wdeviewer.calibration.x');
					}
						break;
					case WDE_CONSTANTS.CALIBRATION.Y: {
						configDialogOptions.title = $translate.instant('model.wdeviewer.calibration.y');
					}
						break;
					default: {
						configDialogOptions.title = $translate.instant('model.wdeviewer.calibration.free');
					}
						break;
				}

				platformTranslateService.translateFormConfig(configDialogOptions.formConfiguration);

				return platformModalFormConfigService.showDialog(configDialogOptions).then(function (result) {
					if (result.ok) {
						var modelConfig = {}, layoutConfig = {lid: settings.layout};

						switch (mode) {
							case WDE_CONSTANTS.CALIBRATION.X: {
								layoutConfig.drawingDistanceX = dataItem.measuredDistance;
								layoutConfig.actualDistanceX = dataItem.actualDistance;

								if (dataItem.applyOther) {
									settings.drawingDistanceY = dataItem.measuredDistance;
									settings.actualDistanceY = dataItem.actualDistance;
								}
							}
								break;
							case WDE_CONSTANTS.CALIBRATION.Y: {
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

						service.saveModelConfig(modelId, modelConfig, layoutConfig, {
							checkScale: true,
							checkUom: true
						});

						return {
							ok: true,
							scale: service.extractScale(layoutConfig),
							isScaleChanged: (dataItem.actualDistance !== distance),
							isUomChanged: (layoutSettings.uomFk !== dataItem.uomFk),
							uomFk: dataItem.uomFk
						};
					}

					return {
						ok: false
					};
				});
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

				return {
					x: angular.isNumber(x) && !_.isNaN(x) ? x : 1,
					y: angular.isNumber(y) && !_.isNaN(y) ? y : 1,
					ratio: angular.isNumber(ratio) && !_.isNaN(ratio) ? ratio : 1,
					mode: settings.calibration,
					angle: settings.angle || 0
				};
			};

			service.resetScale = function (modelId) {
				var settings = service.getModelSetting(modelId);
				settings.drawingDistanceX = 1;
				settings.actualDistanceX = 1;
				settings.drawingDistanceY = 1;
				settings.actualDistanceY = 1;
				settings.drawingDistance = 1;
				settings.actualDistance = 1;
				settings.calibrated = false;
			};

			service.is2DModel = function (modelId) {
				if (_.isNil(modelId)) {
					return $q.when(false);
				}

				return $http.get(globals.webApiBaseUrl + 'model/wdeviewer/info/is2d?modelId=' + modelId, {cache: true}).then(function (res) {
					return res.data;
				});
			};

			service.loadSystemOption = function () {
				return $http.get(globals.webApiBaseUrl + 'basics/common/systemoption/isigeenabled', {cache: true}).then(function (res) {
					service.isIgeViewerEnabled = res.data;
				});
			};

			service.getDisplayUnit = function (modelId, layoutId) {
				var settings;

				if (_.isNil(layoutId)) {
					settings = service.getCurrentLayoutSettings(modelId);
				}
				else {
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

			service.startRecalibrate = function (modelId, args) {
				var deferred = $q.defer(),
					context = {
						ModelId: modelId,
						BaseUnitId: args.isUomChanged? args.newUomFk: args.oldUomFk,
						IsFromWde: true
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
					if (res.data.AffectedObjectCount > 0) {
						platformModalService.showDialog({
							templateUrl: globals.appBaseUrl + 'model.wdeviewer/templates/recalibrate-dialog.html',
							controller: 'modelWdeViewerRecalibrateController',
							width: 800,
							height: 600,
							resizeable: true,
							resolve: {
								'context': [function () {
									return {
										forecast: res.data,
										context: context,
										data: data,
										service: service
									};
								}]
							}
						}).then(function (success) {
							deferred.resolve(success);
						});
					}
					else{
						deferred.resolve(true);
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

			return service;
		}
	]);


})(angular);
