(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).constant('modelWdeViewerComparisonType', {
		overlay: 1,
		geometry: 2,
		object: 3
	});

	angular.module(moduleName).factory('modelWdeViewerComparisonService', [
		'$translate',
		'platformTranslateService',
		'platformModalFormConfigService',
		'basicsLookupdataConfigGenerator',
		'cloudDesktopPinningContextService',
		'modelWdeViewerLabelService',
		'modelWdeViewerComparisonType',
		'modelWdeViewerBaseLayoutLookupService',
		'modelWdeViewerRefLayoutLookupService',
		'modelWdeViewerModelLayoutLookupService',
		function ($translate,
			platformTranslateService,
			platformModalFormConfigService,
			basicsLookupdataConfigGenerator,
			cloudDesktopPinningContextService,
			modelWdeViewerLabelService,
			modelWdeViewerComparisonType,
			modelWdeViewerBaseLayoutLookupService,
			modelWdeViewerRefLayoutLookupService,
			modelWdeViewerModelLayoutLookupService) {
			var service = {
				active: false
			};

			service.on = function () {
				service.active = true;
			};

			service.off = function () {
				service.active = false;
			};

			service.getPinningProjectId = function () {
				var context = cloudDesktopPinningContextService.getContext();

				if (context) {
					for (var i = 0; i < context.length; i++) {
						if (context[i].token === 'project.main') {
							return context[i].id;
						}
					}
				}

				return -1;
			};

			service.createModel = function (baseDrawingId, baseLayoutId, calibrationFactor, refModelId, refDrawingId, refLayoutId) {
				return {
					mode: modelWdeViewerComparisonType.overlay,
					useTolerance: false,
					baseDrawingId: baseDrawingId,
					baseLayoutId: baseLayoutId,
					refDrawingId: refDrawingId,
					refLayoutId: refLayoutId,
					comparisonMode: null,
					baseLayoutInfo: null,
					refLayoutInfo: null,
					refModelId: refModelId,
					calibrationFactor: calibrationFactor
				};
			};

			service.createFormConfig = function () {
				var refModelConfig = basicsLookupdataConfigGenerator.provideDataServiceCompositeLookupConfigForForm({
					moduleQualifier: '4fa5ce08f68a5c410b0aaf64024e11ff',
					dataServiceName: 'modelProjectModelTreeLookupDataService',
					enableCache: true,
					desMember: 'Description',
					filter: function () {
						return {
							projectId: service.getPinningProjectId(),
							exclude: {
								models3D: true
							}
						};
					}
				});

				refModelConfig.gid = 'comparison';
				refModelConfig.label$tr$ = 'model.wdeviewer.comparison.refModelId';
				refModelConfig.model = 'refModelId';
				refModelConfig.sortOrder = 100;
				refModelConfig.options.lookupOptions.selectableCallback = function (dataItem) {
					return angular.isNumber(dataItem.Id);
				};
				refModelConfig.validator = function (entity, value) {
					entity.refDrawingId = '';
					entity.refLayoutId = '';
				};

				var config = {
					fid: 'model.wdeviewer.comparison',
					showGrouping: false,
					groups: [
						{
							gid: 'comparison',
							header$tr$: 'model.wdeviewer.comparison.title',
							isOpen: true,
							sortOrder: 100
						}
					],
					rows: [
						{
							gid: 'comparison',
							label$tr$: 'model.wdeviewer.comparison.mode',
							type: 'select',
							options: {
								items: [
									{value: modelWdeViewerComparisonType.overlay, text: 'Overlay'},
									{value: modelWdeViewerComparisonType.geometry, text: 'Geometry'},
									{value: modelWdeViewerComparisonType.object, text: 'Object'}
								],
								valueMember: 'value',
								displayMember: 'text'
							},
							model: 'mode',
							visible: true,
							sortOrder: 100,
							readonly: false
						},
						{
							gid: 'comparison',
							label$tr$: 'model.wdeviewer.comparison.useTolerance',
							type: 'boolean',
							model: 'useTolerance',
							visible: true,
							sortOrder: 100,
							readonly: false
						},
						// {
						// 	gid: 'comparison',
						// 	label$tr$: 'model.wdeviewer.comparison.baseDrawingId',
						// 	type: 'directive',
						// 	directive: 'model-wde-viewer-drawing-lookup',
						// 	model: 'baseDrawingId',
						// 	visible: true,
						// 	sortOrder: 100,
						// 	readonly: false
						// },
						// {
						// 	gid: 'comparison',
						// 	label$tr$: 'model.wdeviewer.comparison.baseLayoutId',
						// 	type: 'directive',
						// 	directive: 'model-wde-viewer-base-layout-lookup',
						// 	model: 'baseLayoutId',
						// 	visible: true,
						// 	sortOrder: 100,
						// 	readonly: false
						// },
						refModelConfig,
						// {
						// 	gid: 'comparison',
						// 	label$tr$: 'model.wdeviewer.comparison.refDrawingId',
						// 	type: 'directive',
						// 	directive: 'model-wde-viewer-drawing-lookup',
						// 	model: 'refDrawingId',
						// 	visible: true,
						// 	sortOrder: 100,
						// 	readonly: false
						// },
						{
							gid: 'comparison',
							label$tr$: 'model.wdeviewer.comparison.refLayoutId',
							type: 'directive',
							directive: 'model-wde-viewer-model-layout-lookup',
							model: 'refLayoutId',
							visible: true,
							sortOrder: 100,
							readonly: false
						},
						{
							gid: 'comparison',
							label: 'Calibration',
							type: 'quantity',
							model: 'calibrationFactor',
							visible: true,
							sortOrder: 100,
							readonly: false
						}
					]
				};
				return config;
			};

			service.createLayoutInfoJson = function (drawingId, layoutId, calibrationFactor) {
				var calibrationAngle = 0.0;
				var calibrationXFactor = calibrationFactor;
				var calibrationYFactor = calibrationFactor;
				var scaleXFactor = calibrationFactor;
				var scaleYFactor = calibrationFactor;
				var scaleZFactor = calibrationFactor;
				var baseLoaderConfig = {
					calibrationAngle: calibrationAngle,
					calibrationXFactor: calibrationXFactor,
					calibrationYFactor: calibrationYFactor,
					scaleXFactor: scaleXFactor,
					scaleYFactor: scaleYFactor,
					scaleZFactor: scaleZFactor
				};

				var baseLayoutInfo = {filename: drawingId, layoutId: layoutId, loaderConfig: baseLoaderConfig};

				return JSON.stringify(baseLayoutInfo);
			};

			service.defaultSettingsProvider = null;

			service.showDialog = function (baseDrawingId, baseLayoutId, calibrationFactor) {
				if (service.defaultSettingsProvider) {
					return service.defaultSettingsProvider.execute().then(function (defaults) {
						if(defaults.refDrawingId && !defaults.refLayoutId) {
							defaults.refLayoutId = baseLayoutId;
						}
						return service.openDialog(baseDrawingId, baseLayoutId, calibrationFactor, defaults.refModelId, defaults.refDrawingId, defaults.refLayoutId);
					});
				} else {
					return service.openDialog(baseDrawingId, baseLayoutId, calibrationFactor);
				}
			};

			service.openDialog = function (baseDrawingId, baseLayoutId, calibrationFactor, refModelId, refDrawingId, refLayoutId) {
				var dataItem = service.createModel(baseDrawingId, baseLayoutId, calibrationFactor, refModelId, refDrawingId, refLayoutId);
				var configDialogOptions = {
					title: $translate.instant('model.wdeviewer.comparison.title'),
					formConfiguration: service.createFormConfig(dataItem),
					dataItem: dataItem
				};

				modelWdeViewerBaseLayoutLookupService.setContext(dataItem, 'baseDrawingId');
				modelWdeViewerRefLayoutLookupService.setContext(dataItem, 'refDrawingId');
				modelWdeViewerModelLayoutLookupService.setContext(dataItem, 'refModelId', 'refDrawingId');

				platformTranslateService.translateFormConfig(configDialogOptions.formConfiguration);

				return platformModalFormConfigService.showDialog(configDialogOptions).then(function (res) {
					if (res.ok) {
						switch (dataItem.mode) {
							case 1:
								dataItem.comparisonMode = Module.DrawingComparisonMode.Overlay;
								break;
							case 2:
								dataItem.comparisonMode = Module.DrawingComparisonMode.ByGeometry;
								break;
							case 3:
								dataItem.comparisonMode = Module.DrawingComparisonMode.ByObjectId;
								break;
						}

						dataItem.baseLayoutInfo = service.createLayoutInfoJson(dataItem.baseDrawingId, dataItem.baseLayoutId, dataItem.calibrationFactor);
						dataItem.refLayoutInfo = service.createLayoutInfoJson(dataItem.refDrawingId, dataItem.refLayoutId, dataItem.calibrationFactor);
					}
					return res;
				});
			};

			return service;
		}
	]);

})(angular);