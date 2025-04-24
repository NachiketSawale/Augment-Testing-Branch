/**
 * Created by wui on 6/20/2018.
 */

/* global WDE_CONSTANTS */
/* jshint -W098 */
(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerIgeDimensionServiceFactory', [
		'$q',
		'$http',
		'PlatformMessenger',
		'platformModalService',
		'platformModuleStateService',
		'modelWdeViewerFilterMode',
		'modelWdeViewerIgeService',
		'platformTranslateService',
		'platformModalFormConfigService',
		'modelViewerModelIdSetService',
		'modelViewerModelSelectionService',
		'modelViewerCompositeModelObjectSelectionService',
		'modelWdeViewerLabelService',
		'basicsCommonDrawingUtilitiesService',
		function ($q,
			$http,
			PlatformMessenger,
			platformModalService,
			platformModuleStateService,
			modelWdeViewerFilterMode,
			modelWdeViewerIgeService,
			platformTranslateService,
			platformModalFormConfigService,
			modelViewerModelIdSetService,
			modelViewerModelSelectionService,
			modelViewerCompositeModelObjectSelectionService,
			modelWdeViewerLabelService,
			basicsCommonDrawingUtilitiesService) {

			function ModelPart() {
				this.dimensionGroups = [];
				this.dimensions = [];
				this.selectedDimensions = [];
				this.selectedObjectIds = [];
				this.filterMeshIds = [];
				this.disableSelectionCount = 0;
				this.zoomToDimensionCount = 0;
				this.copyData = null;
			}

			function CopyData(layout, dimensions) {
				this.layout = layout;
				this.dimensions = dimensions;
			}

			function Dimension(modelId, uuid, name, isNegative, geometry) {
				this.ModelFk = modelId;
				this.ModelObjectFk = -1;
				this.Uuid = uuid;
				this.Name = name;
				this.IsNegative = isNegative;
				this.Geometry = geometry;
				this.Layout = '';
				this.Setting = new DimensionSetting();
				this.Data = new DimensionData();
			}

			function DimensionData() {
				this.Count = 0;
				this.Length = 0;
				this.Area = 0;
				this.Volume = 0;
				this.Width = 0;
				this.Height = 0;
				this.WallArea = 0;
				this.Multiplier = 0;
				this.Offset = 0;
				this.Formulas = [];
			}

			function DimensionSetting() {
				this.PositiveColor = null;
				this.PositiveTexture = null;
				this.NegativeColor = null;
				this.NegativeTexture = null;
			}

			function create(options) {
				var service = {
					models: {},
					getModelPart: function (modelId) {
						if (!service.models[modelId]) {
							service.models[modelId] = new ModelPart();
						}

						return service.models[modelId];
					},
					readonly: options.readonly,
					disableHeaderFilter: options.disableHeaderFilter
				};
				var object2DWebApiBaseUrl = globals.webApiBaseUrl + 'model/main/object2d/';

				service.onDimensionsChanged = new PlatformMessenger();
				service.onDimensionSelected = new PlatformMessenger();
				service.onDimensionDeleting = new PlatformMessenger();
				service.onDimensionUpdated = new PlatformMessenger();
				service.onDimensionsDeleted = new PlatformMessenger();
				service.onDimensionsUpdated = new PlatformMessenger();

				service.getObjectTemplate = function () {
					return options.getObjectTemplate && options.getObjectTemplate();
				};

				service.getHeaderId = function () {
					var header = options.headerService.getSelected();
					return !_.isNil(header) ? options.mapHeaderId(header) : null;
				};

				service.getHeaderIds = function () {
					var headers = options.headerService.getSelectedEntities();
					return headers.map(function (header) {
						return options.mapHeaderId(header);
					});
				};

				service.validHeaderIds = [];

				service.getValidHeaderIds = function () {
					var headers = options.headerService.getList();

					if (angular.isFunction(options.isValidHeader)) {
						headers = headers.filter(options.isValidHeader);
					}

					return headers.map(function (header) {
						return options.mapHeaderId(header);
					});
				};

				service.getSimpleValidHeaderIds = function () {
					var validHeaderIds = service.getValidHeaderIds().map(function (item) {
						return item.Id;
					});

					return _.orderBy(validHeaderIds);
				};

				service.watchValidHeaderIds = function (scope, onchange) {
					var temp = 0;

					service.validHeaderIds = service.getSimpleValidHeaderIds();

					return scope.$watch(function () {
						var isChanged = true,
							validHeaderIds = service.getSimpleValidHeaderIds();

						if (service.validHeaderIds.length === validHeaderIds.length) {
							isChanged = service.validHeaderIds.some(function (item, index) {
								return item !== validHeaderIds[index];
							});
						}

						if (isChanged) {
							temp++;
						}

						return temp;
					}, function () {
						service.validHeaderIds = service.getSimpleValidHeaderIds();
						onchange();
					});
				};

				service.getFilterMode = function (viewId) {
					var viewSettings = modelWdeViewerIgeService.getViewSetting(viewId);
					return viewSettings.filterMode;
				};

				service.getContext = function (modelId, layoutId) {
					var settings = modelWdeViewerIgeService.getCurrentLayoutSettings(modelId);
					var context = {
						UsageContract: options.objectUsageContract,
						TemplateContract: options.objectTemplateContract,
						IsHeaderModelObject: options.isHeaderModelObject,
						HeaderId: null,
						HeaderIds: [],
						ValidHeaderIds: [],
						ModelId: modelId,
						FilterByHeader: false,
						BaseUnitId: settings.uomFk,
						Layout: layoutId,
						IsFromWde: false
					};

					if (!service.disableHeaderFilter) {
						context.HeaderId = service.getHeaderId();
						context.HeaderIds = service.getHeaderIds();
						context.ValidHeaderIds = service.getValidHeaderIds();
					}

					return context;
				};

				service.getElementModification = function (assignedObjectService) {
					var modState = platformModuleStateService.state(assignedObjectService.getModule());
					return assignedObjectService.assertPath(modState.modifications, false);
				};

				service.loadDimensions = function (modelId, layoutId, viewOptions) {
					var context = service.getContext(modelId, layoutId);
					var filterMode = service.getFilterMode(viewOptions.viewerId);

					if (filterMode === modelWdeViewerFilterMode.header) {
						context.FilterByHeader = true;

						if (!_.isNil(options.assignedObjectService)) {
							var modification = service.getElementModification(options.assignedObjectService);

							if (modification.EntitiesCount > 0) {
								context.Modification = {
									Exclude: [],
									Include: []
								};

								if (angular.isArray(modification.Instance2ObjectToDelete)) {
									context.Modification.Exclude = modification.Instance2ObjectToDelete.map(options.mapObjectId);
								}

								if (angular.isArray(modification.Instance2ObjectToSave)) {
									context.Modification.Include = modification.Instance2ObjectToSave.map(options.mapObjectId);
								}
							}
						}
					} else {
						context.FilterByHeader = false;
					}

					return $http.post(object2DWebApiBaseUrl + 'list', context).then(function (res) {
						var data = res.data;
						var part = service.getModelPart(modelId);

						part.dimensions = data;

						if (filterMode === modelWdeViewerFilterMode.sidebar) {
							if (part.filterMeshIds.length) {
								data = data.filter(function (item) {
									return part.filterMeshIds.some(function (meshId) {
										return item.ModelObjectFk === meshId;
									});
								});
							}
						}

						// if(options.filterByHeader) {
						//     data = options.filterByHeader(data);
						// }

						return data;
					});
				};

				service.create = function (modelId, args) {
					var part = service.getModelPart(modelId);
					var dimensions = part.dimensions.filter(function (item) {
						return item.Uuid === args.uuid;
					});

					if (dimensions.length) {
						return dimensions[0];
					}

					return new Dimension(modelId, args.uuid, args.name, args.isNegative, args.geometry);
				};

				service.createDimension = function (modelId, dimension) {
					var context = service.getContext(modelId);
					var part = service.getModelPart(modelId);
					var deferred = $q.defer();

					// part.dimensions.push(dimension);

					options.headerService.update().then(function () {
						$http.post(object2DWebApiBaseUrl + 'createtoheader', {
							Context: context,
							Item: dimension
						}).then(function (res) {
							part.dimensions.push(res.data);
							if (angular.isFunction(options.onDimensionCreated)) {
								options.onDimensionCreated(res);
							}
							deferred.resolve(res);
						}, function (error) {
							deferred.reject(error);
						});
					}, function (error) {
						deferred.reject(error);
					});

					return deferred.promise;
				};

				service.createDimensions = function (modelId, dimensions) {
					var context = service.getContext(modelId);
					var part = service.getModelPart(modelId);
					var deferred = $q.defer();

					// part.dimensions.push(dimension);

					options.headerService.update().then(function () {
						$http.post(object2DWebApiBaseUrl + 'createdimensions', {
							Context: context,
							Items: dimensions
						}).then(function (res) {
							res.data.forEach(function (item) {
								part.dimensions.push(item);
							});
							if (angular.isFunction(options.onDimensionsCreated)) {
								options.onDimensionsCreated(res);
							}
							deferred.resolve(res);
						}, function (error) {
							deferred.reject(error);
						});
					}, function (error) {
						deferred.reject(error);
					});

					return deferred.promise;
				};

				service.updateDimension = function (modelId, dimension, updateOptions) {
					var context = service.getContext(modelId);

					updateOptions = updateOptions || {};

					var onlyText = updateOptions.nameModified && !updateOptions.propModified;
					var onlyProperty = !updateOptions.nameModified && updateOptions.propModified;

					return $http.post(object2DWebApiBaseUrl + 'updatetoheader', {
						Context: context,
						Item: dimension,
						OnlyText: onlyText
					}).then(function (res) {
						if (angular.isFunction(options.onDimensionUpdate)) {
							options.onDimensionUpdate(modelId, res.data, onlyProperty);
						}

						service.onDimensionUpdated.fire(res.data);

						return res.data;
					});
				};

				service.updateDimensions = function (modelId, dimensions, updateOptions) {
					var context = service.getContext(modelId);

					updateOptions = updateOptions || {};

					var rdData = updateOptions.rdData;

					if (!_.isNil(rdData)) {
						context.BaseUnitId = rdData.layoutConfig.uomFk;
					}

					var onlyText = updateOptions.nameModified && !updateOptions.propModified;
					var onlyProperty = !updateOptions.nameModified && updateOptions.propModified;

					return $http.post(object2DWebApiBaseUrl + 'updatedimensions', {
						Context: context,
						Items: dimensions,
						OnlyText: onlyText
					}).then(function (res) {
						if (angular.isFunction(options.onDimensionsUpdate)) {
							options.onDimensionsUpdate(modelId, res.data, onlyProperty);
						}

						service.onDimensionsUpdated.fire(res.data);

						return res.data;
					});
				};

				service.showDeleteDimensionConfirmDialog = function () {
					return platformModalService.showYesNoDialog('model.wdeviewer.deleteLineItemObject', 'model.wdeviewer.deleteObjectFailedTitle');
				};

				service.deleteDimension = function (modelId, uuid, flow) {
					var defer = $q.defer(),
						context = service.getContext(modelId),
						part = service.getModelPart(modelId);

					if (!uuid.startsWith('{')) {
						uuid = ('{' + uuid + '}');
					}

					function success() {
						part.dimensions = part.dimensions.filter(function (item) {
							return item.Uuid !== uuid;
						});

						if (angular.isFunction(options.onDimensionDelete)) {
							options.onDimensionDelete(modelId);
						}
					}

					function fail(error) {
						defer.reject(error);
					}

					function post(context, uuid, flow) {
						context.DeleteFlow = flow;
						return $http.post(object2DWebApiBaseUrl + 'deletetoheaderbyuuid', {
							Context: context,
							Uuids: [uuid]
						});
					}

					post(context, uuid, flow).then(function (res) {
						if (res.data.Success) {
							success();
						} else if (res.data.IsObjectReferencedByLineItem) {
							service.showDeleteDimensionConfirmDialog().then(function (decision) {
								if (decision.yes) {
									res.data.IsAutoDeleteLineItemObject = true;
									post(context, uuid, res.data).then(function (res2) {
										if (res2.data.Success) {
											success(res2.data);
										} else {
											fail();
										}
									}, fail);
								} else {
									fail();
								}
							}, fail);
						} else {
							fail();
						}

						return res.data;
					});

					return defer.promise;
				};

				service.deleteDimensionsById = function (modelId, modelObjectIds, flow) {
					var defer = $q.defer(),
						context = service.getContext(modelId);

					function success(res) {
						service.onDimensionsDeleted.fire();

						if (angular.isFunction(options.onDimensionDelete)) {
							options.onDimensionDelete(modelId);
						}

						defer.resolve(res);
					}

					function fail(error) {
						defer.reject(error);
					}

					function post(context, modelObjectIds, flow) {
						context.DeleteFlow = flow;
						return $http.post(object2DWebApiBaseUrl + 'deletetoheaderbyid', {
							Context: context,
							ModelObjectIds: modelObjectIds
						});
					}

					post(context, modelObjectIds, flow).then(function (res) {
						if (res.data.Success) {
							success(res.data);
						} else if (res.data.IsObjectReferencedByLineItem) {
							service.showDeleteDimensionConfirmDialog().then(function (decision) {
								if (decision.yes) {
									res.data.IsAutoDeleteLineItemObject = true;
									post(context, modelObjectIds, res.data).then(function (res2) {
										if (res2.data.Success) {
											success(res2.data);
										} else {
											fail();
										}
									}, fail);
								} else {
									fail();
								}
							}, fail);
						} else {
							fail();
						}
					}, fail);

					return defer.promise;
				};

				service.deleteDimensionsByUuid = function (modelId, uuids, flow) {
					var defer = $q.defer(),
						context = service.getContext(modelId);

					uuids = uuids.map(function (uuid) {
						return uuid.startsWith('{') ? uuid : ('{' + uuid + '}');
					});

					function success(res) {
						service.onDimensionsDeleted.fire(uuids);

						if (angular.isFunction(options.onDimensionDelete)) {
							options.onDimensionDelete(modelId);
						}

						defer.resolve(res);
					}

					function fail(error) {
						defer.reject(error);
					}

					function post(context, uuids, flow) {
						context.DeleteFlow = flow;
						return $http.post(object2DWebApiBaseUrl + 'deletetoheaderbyuuid', {
							Context: context,
							Uuids: uuids
						});
					}

					post(context, uuids, flow).then(function (res) {
						if (res.data.Success) {
							success(res.data);
						} else if (res.data.IsObjectReferencedByLineItem) {
							service.showDeleteDimensionConfirmDialog().then(function (decision) {
								if (decision.yes) {
									res.data.IsAutoDeleteLineItemObject = true;
									post(context, uuids, res.data).then(function (res2) {
										if (res2.data.Success) {
											success(res2.data);
										} else {
											fail();
										}
									}, fail);
								} else {
									fail();
								}
							}, fail);
						} else {
							fail();
						}
					}, fail);

					return defer.promise;
				};

				service.disableSelection = function (modelId) {
					var modelData = service.getModelPart(modelId);
					modelData.disableSelectionCount++;
				};

				service.enableSelection = function (modelId) {
					var modelData = service.getModelPart(modelId);
					modelData.disableSelectionCount--;
				};

				service.isSelectionDisabled = function (modelId) {
					var modelData = service.getModelPart(modelId);
					return modelData.disableSelectionCount > 0;
				};

				service.clearSelection = function (modelId) {
					var modelData = service.getModelPart(modelId);
					modelData.selectedObjectIds = [];
				};

				service.disableZoomToDimension = function (modelId) {
					var modelData = service.getModelPart(modelId);
					modelData.zoomToDimensionCount--;
				};

				service.enableZoomToDimension = function (modelId) {
					var modelData = service.getModelPart(modelId);
					modelData.zoomToDimensionCount++;
				};

				service.determineZoomToDimension = function (modelId) {
					var modelData = service.getModelPart(modelId);

					if (modelData.zoomToDimensionCount > 0) {
						modelData.zoomToDimensionCount = 0;
						return true;
					}

					return false;
				};

				service.select = function (dimensions) {
					angular.forEach(dimensions, function (ids, key) {
						var modelId = parseInt(key);
						var modelData = service.getModelPart(modelId);

						if (service.isSelectionDisabled(modelId)) {
							return;
						}

						modelData.selectedObjectIds = ids;
						service.determineSelectedDimensions(modelId);
						service.enableZoomToDimension(modelId);
						service.onDimensionSelected.fire(modelId);
					});
				};

				service.determineSelectedLayout = function (modelId) {
					var defer = $q.defer(),
						modelData = service.getModelPart(modelId);

					if (modelData.selectedDimensions.length) {
						defer.resolve(modelData.selectedDimensions[0].Layout);
					} else if (modelData.selectedObjectIds.length) {
						$http.get(object2DWebApiBaseUrl + 'layout?modelId=' + modelId + '&objectId=' + modelData.selectedObjectIds[0]).then(function (res) {
							defer.resolve(res.data);
						});
					} else {
						defer.resolve(null);
					}

					return defer.promise;
				};

				service.determineSelectedDimensions = function (modelId) {
					var modelData = service.getModelPart(modelId),
						ids = modelData.selectedObjectIds;

					modelData.selectedDimensions = modelData.dimensions.filter(function (item) {
						return item.ModelFk === modelId && ids.some(function (id) {
							return item.ModelObjectFk === id;
						});
					});

					return modelData.selectedDimensions;
				};

				service.getDimensions = function (modelId) {
					return service.getModelPart(modelId).dimensions;
				};

				service.getDimensionByUuid = function (modelId, uuid) {
					var dimensions = service.getDimensions(modelId).filter(function (item) {
						return item.Uuid === uuid;
					});

					return dimensions.length > 0 ? dimensions[0] : null;
				};

				service.getDimensionById = function (modelId, id) {
					var dimensions = service.getDimensions(modelId).filter(function (item) {
						return item.ModelObjectFk === id;
					});

					return dimensions.length > 0 ? dimensions[0] : null;
				};

				service.init = function (options) {
					// options.headerService.registerSelectionChanged(function () {
					//     service.onDimensionsChanged.fire();
					// });
					// options.headerService.registerSelectedEntitiesChanged(function () {
					//     service.onDimensionsChanged.fire();
					// });

					if (!_.isNil(options.assignedObjectService)) {
						options.assignedObjectService.registerEntityDeleted(function () {
							service.onDimensionsChanged.fire();
						});

						// options.assignedObjectService.registerListLoaded(function () {
						//     service.onDimensionsChanged.fire();
						// });
					}

					if (angular.isFunction(options.onRecalibrateDone)) {
						modelWdeViewerIgeService.recalibrateDone.register(function (args) {
							options.onRecalibrateDone(args);
						});
					}
				};

				service.getPropertyFormConfig = function (labels) {
					return {
						fid: 'model.wdeviewer.config',
						showGrouping: false,
						groups: [
							{
								gid: 'basics',
								header$tr$: 'model.wdeviewer.dimension.basicsGroup',
								isOpen: true,
								sortOrder: 100
							}
						],
						rows: [
							{
								gid: 'basics',
								label: labels.name,
								type: 'description',
								model: 'Name',
								visible: true,
								sortOrder: 100,
								validator: function (entity) {
									entity.dirty = true;
									entity.nameModified = true;
								}
							},
							{
								gid: 'basics',
								label: labels.count,
								type: 'decimal',
								model: 'Count',
								visible: true,
								readonly: true,
								sortOrder: 100
							},
							{
								gid: 'basics',
								label: labels.length,
								type: 'decimal',
								model: 'Length',
								visible: true,
								readonly: true,
								sortOrder: 100
							},
							{
								gid: 'basics',
								label: labels.area,
								type: 'decimal',
								model: 'Area',
								visible: true,
								readonly: true,
								sortOrder: 100
							},
							// {
							// 	gid: 'basics',
							// 	label: labels.volume,
							// 	type: 'decimal',
							// 	model: 'Volume',
							// 	visible: true,
							// 	readonly: true,
							// 	sortOrder: 100,
							// 	validator: function (entity) {
							// 		entity.dirty = true;
							// 		entity.propModified = true;
							// 	}
							// },
							// {
							// 	gid: 'basics',
							// 	label: labels.width,
							// 	type: 'decimal',
							// 	model: 'Width',
							// 	visible: true,
							// 	// readonly: true,
							// 	sortOrder: 100,
							// 	validator: function (entity) {
							// 		entity.dirty = true;
							// 		entity.propModified = true;
							// 	}
							// },
							{
								gid: 'basics',
								label: labels.height,
								type: 'decimal',
								model: 'Height',
								visible: true,
								// readonly: true,
								sortOrder: 100,
								validator: function (entity) {
									entity.dirty = true;
									entity.propModified = true;
								}
							},
							// {
							// 	gid: 'basics',
							// 	label: labels.wallArea,
							// 	type: 'decimal',
							// 	model: 'WallArea',
							// 	visible: true,
							// 	// readonly: true,
							// 	sortOrder: 100,
							// 	validator: function (entity) {
							// 		entity.dirty = true;
							// 		entity.propModified = true;
							// 	}
							// },
							{
								gid: 'basics',
								label: labels.offset,
								type: 'decimal',
								model: 'Offset',
								visible: true,
								// readonly: true,
								sortOrder: 100,
								validator: function (entity) {
									entity.dirty = true;
									entity.propModified = true;
								}
							},
							{
								gid: 'basics',
								label: labels.multiplier,
								type: 'decimal',
								model: 'Multiplier',
								visible: true,
								// readonly: true,
								sortOrder: 100,
								// regex: '^[1-9]\\d*$',
								// regexTemplate: '^[1-9]\\d*$',
								validator: function (entity) {
									entity.dirty = true;
									entity.propModified = true;
								}
							},
							{
								gid: 'basics',
								label: labels.segmentCount,
								type: 'decimal',
								model: 'SegmentCount',
								visible: true,
								readonly: true,
								sortOrder: 100
							},
							{
								gid: 'basics',
								label: labels.vertexCount,
								type: 'decimal',
								model: 'VertexCount',
								visible: true,
								readonly: true,
								sortOrder: 100
							},
							{
								gid: 'basics',
								label: labels.cutoutArea,
								type: 'decimal',
								model: 'CutoutArea',
								visible: true,
								readonly: true,
								sortOrder: 100
							},
							{
								gid: 'basics',
								label: labels.cutoutLength,
								type: 'decimal',
								model: 'CutoutLength',
								visible: true,
								readonly: true,
								sortOrder: 100
							},
							{
								gid: 'basics',
								label: labels.areaExcludingCutouts,
								type: 'decimal',
								model: 'AreaExcludingCutouts',
								visible: true,
								readonly: true,
								sortOrder: 100
							},
							{
								gid: 'basics',
								label: labels.lengthExcludingCutouts,
								type: 'decimal',
								model: 'LengthExcludingCutouts',
								visible: true,
								readonly: true,
								sortOrder: 100
							},
							{
								gid: 'basics',
								label: labels.segmentCountExcludingCutouts,
								type: 'decimal',
								model: 'SegmentCountExcludingCutouts',
								visible: true,
								readonly: true,
								sortOrder: 100
							},
							{
								gid: 'basics',
								label: labels.vertexCountExcludingCutouts,
								type: 'decimal',
								model: 'VertexCountExcludingCutouts',
								visible: true,
								readonly: true,
								sortOrder: 100
							}
						]
					};
				};

				service.showPropertyDialog = function (modelId, dimension) {
					var labels = modelWdeViewerLabelService.getPropertyFormLabels();
					var entity = service.getDimensionByUuid(modelId, dimension.id);
					var dataItem = angular.copy(entity.Data);
					var configDialogOptions = {
						title: labels.title,
						formConfiguration: [],
						dataItem: dataItem
					};

					dataItem.Name = entity.Name;
					configDialogOptions.formConfiguration = service.getPropertyFormConfig(labels);

					platformTranslateService.translateFormConfig(configDialogOptions.formConfiguration);

					return platformModalFormConfigService.showDialog(configDialogOptions).then(function (result) {
						if (result.ok) {
							if (result.data.propModified) {
								modelWdeViewerIgeService.override(entity.Data, result.data);
							}

							if (result.data.nameModified) {
								entity.Name = result.data.Name;
							}

							return {
								ok: true,
								data: entity,
								dirty: result.data.propModified || result.data.nameModified,
								propModified: result.data.propModified,
								nameModified: result.data.nameModified
							};
						}

						return {
							ok: false
						};
					});
				};

				service.showDimensionsDialog = function (modelId, dimensions) {
					var entities = dimensions.map(function (dimension) {
						return service.getDimensionByUuid(modelId, dimension.id);
					});
					var dataItem = {
						Name: '',
						Width: 0,
						Height: 0,
						WallArea: 0,
						Offset: 0,
						Multiplier: 0,

						// readonly properties
						Count: 0,
						Length: 0,
						Area: 0,
						Volume: 0
					};
					var keys = ['Width', 'Height', 'WallArea', 'Offset', 'Multiplier'];

					function setValue(target, source, property) {
						target[property] = source[property];
					}

					function checkValue(target, source, property) {
						if (target[property] && target[property] !== source[property]) {
							target[property] = 0;
						}
					}

					function updateValue(target, source, property) {
						if (source[property]) {
							target[property] = source[property];
						}
					}

					entities.forEach(function (entity, index) {
						if (index === 0) {
							dataItem.Name = entity.Name;
							keys.forEach(function (key) {
								setValue(dataItem, entity.Data, key);
							});
						} else {
							if (dataItem.Name && dataItem.Name !== entity.Name) {
								dataItem.Name = '';
							}
							keys.forEach(function (key) {
								checkValue(dataItem, entity.Data, key);
							});
						}

						dataItem.Count += entity.Data.Count;
						dataItem.Length += entity.Data.Length;
						dataItem.Area += entity.Data.Area;
						dataItem.Volume += entity.Data.Volume;

						dataItem.SegmentCount += entity.Data.SegmentCount;
						dataItem.VertexCount += entity.Data.VertexCount;
						dataItem.CutoutArea += entity.Data.CutoutArea;
						dataItem.CutoutLength += entity.Data.CutoutLength;
						dataItem.AreaExcludingCutouts += entity.Data.AreaExcludingCutouts;
						dataItem.LengthExcludingCutouts += entity.Data.LengthExcludingCutouts;
						dataItem.SegmentCountExcludingCutouts += entity.Data.SegmentCountExcludingCutouts;
						dataItem.VertexCountExcludingCutouts += entity.Data.VertexCountExcludingCutouts;
					});

					var labels = modelWdeViewerLabelService.getPropertyFormLabels(dimensions.length);
					var configDialogOptions = {
						title: labels.title,
						formConfiguration: [],
						dataItem: dataItem
					};

					configDialogOptions.formConfiguration = service.getPropertyFormConfig(labels);

					platformTranslateService.translateFormConfig(configDialogOptions.formConfiguration);

					return platformModalFormConfigService.showDialog(configDialogOptions).then(function (result) {
						if (result.ok) {
							entities.forEach(function (entity) {
								if (result.data.propModified) {
									keys.forEach(function (key) {
										updateValue(entity.Data, result.data, key);
									});
								}

								if (result.data.nameModified) {
									entity.Name = result.data.Name;
								}
							});

							return {
								ok: true,
								data: entities,
								dirty: result.data.propModified || result.data.nameModified,
								propModified: result.data.propModified,
								nameModified: result.data.nameModified
							};
						}

						return {
							ok: false
						};
					});
				};

				service.setSelectedObject = function (modelId, uuid) {
					var part = service.getModelPart(modelId);
					var dimension = _.find(part.dimensions, {Uuid: uuid});

					if (!dimension) {
						return;
					}

					var selectedObjectIds = new modelViewerModelIdSetService.ObjectIdSet();

					modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						selectedObjectIds[subModelId] = [];
					});

					selectedObjectIds = selectedObjectIds.useGlobalModelIds();

					if (selectedObjectIds.hasOwnProperty(dimension.ModelFk)) {
						var hlpArr = selectedObjectIds[dimension.ModelFk];
						hlpArr.push(dimension.ModelObjectFk);
						selectedObjectIds[dimension.ModelFk] = hlpArr;
					} else {
						var arr = [];
						arr.push(dimension.ModelObjectFk);
						selectedObjectIds[dimension.ModelFk] = arr;
					}

					if (!selectedObjectIds.isEmpty()) {
						var oldSelectedObjectIds = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds();
						var newSelectedObjectIds = selectedObjectIds.useSubModelIds();

						if (!_.isEqual(oldSelectedObjectIds, newSelectedObjectIds)) {
							service.disableZoomToDimension(modelId);
							service.disableSelection(modelId);
							modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds(newSelectedObjectIds);
							service.enableSelection(modelId);
						}
					}
				};

				service.setSelectedObjects = function (modelId, uuids) {
					var part = service.getModelPart(modelId);
					var selectedObjectIds = new modelViewerModelIdSetService.ObjectIdSet();

					modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						selectedObjectIds[subModelId] = [];
					});

					selectedObjectIds = selectedObjectIds.useGlobalModelIds();

					uuids.forEach(function (uuid) {
						var dimension = _.find(part.dimensions, {Uuid: uuid});

						if (!dimension) {
							return;
						}

						if (selectedObjectIds.hasOwnProperty(dimension.ModelFk)) {
							var hlpArr = selectedObjectIds[dimension.ModelFk];
							hlpArr.push(dimension.ModelObjectFk);
							selectedObjectIds[dimension.ModelFk] = hlpArr;
						} else {
							var arr = [];
							arr.push(dimension.ModelObjectFk);
							selectedObjectIds[dimension.ModelFk] = arr;
						}
					});

					var oldSelectedObjectIds = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds();
					var newSelectedObjectIds = selectedObjectIds.useSubModelIds();

					if (!_.isEqual(oldSelectedObjectIds, newSelectedObjectIds)) {
						service.disableZoomToDimension(modelId);
						service.disableSelection(modelId);
						modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds(newSelectedObjectIds);
						service.enableSelection(modelId);
					}
				};

				service.mapObjectIds = function (modelId, uuids) {
					var objectIds = [];

					service.getModelPart(modelId).dimensions.forEach(function (dimension) {
						function equal(uuid) {
							return uuid === dimension.Uuid;
						}

						if (uuids.some(equal)) {
							objectIds.push(dimension.ModelObjectFk);
						}
					});

					return objectIds;
				};

				service.setFilterByMeshId = function (meshIds) {
					angular.forEach(meshIds, function (ids, key) {
						var modelId = parseInt(key);
						var modelData = service.getModelPart(modelId);
						modelData.filterMeshIds = ids;
					});
				};

				service.getDefaultColor = function () {
					return {
						// green
						positive: 32768,
						// red
						negative: 16711680
					};
				};

				service.getDefaultTexture = function () {
					return {
						positive: WDE_CONSTANTS.DIMENSION_PATTERN_CHECKER_BOARD,
						negative: WDE_CONSTANTS.DIMENSION_PATTERN_SQUARE_DOTS
					};
				};

				service.copy = function (modelId, layoutId, dimensions) {
					var modelData = service.getModelPart(modelId);
					modelData.copyData = new CopyData(layoutId, dimensions);
				};

				service.canPaste = function (modelId, layoutId, position) {
					var modelData = service.getModelPart(modelId);

					return !(_.isNil(modelData.copyData) || !modelData.copyData.dimensions.length);
				};

				service.paste = function (modelId, layoutId, position, pasteOptions) {
					if (!service.canPaste(modelId, layoutId, position)) {
						return $q.when([]);
					}

					var modelData = service.getModelPart(modelId);
					var sourceScale = modelWdeViewerIgeService.getLayoutScale(modelId, modelData.copyData.layout).ratio;
					var targetScale = modelWdeViewerIgeService.getLayoutScale(modelId, layoutId).ratio;
					var sourceUomFk = modelWdeViewerIgeService.getLayoutSettings(modelId, modelData.copyData.layout).uomFk;
					var targetUomFk = modelWdeViewerIgeService.getLayoutSettings(modelId, layoutId).uomFk;

					return $http.post(object2DWebApiBaseUrl + 'copy', {
						Context: service.getContext(modelId, layoutId),
						Data: {
							SourceLayout: modelData.copyData.layout,
							SourceScale: sourceScale,
							SourceUomFk: sourceUomFk,
							TargetLayout: layoutId,
							TargetScale: targetScale,
							TargetUomFk: targetUomFk,
							Position: position,
							AssignToOriginalHeader: pasteOptions && pasteOptions.assignToOriginalHeader,
							ObjectUuids: modelData.copyData.dimensions.map(function (dimension) {
								return dimension.$did$;
							})
						}
					}).then(function (res) {
						if (res.data.length && angular.isFunction(options.onDimensionPaste)) {
							options.onDimensionPaste(modelId, res.data, pasteOptions);
						}
						return res.data;
					});
				};

				service.getTextEditFormConfig = function () {
					return {
						fid: 'model.wdeviewer.config',
						showGrouping: false,
						groups: [
							{
								gid: 'basics',
								header$tr$: 'model.wdeviewer.dimension.basicsGroup',
								isOpen: true,
								sortOrder: 100
							}
						],
						rows: [
							{
								gid: 'basics',
								label$tr$: 'model.wdeviewer.dimension.description',
								type: 'description',
								model: 'Name',
								visible: true,
								sortOrder: 100
							}
						]
					};
				};

				service.showTextEditDialog = function (modelId, dimension) {
					var labels = modelWdeViewerLabelService.getPropertyFormLabels();
					var entity = service.getDimensionByUuid(modelId, dimension.$did$);
					var configDialogOptions = {
						title: labels.editDimensionText,
						formConfiguration: [],
						dataItem: {
							Name: entity.Name
						}
					};

					configDialogOptions.formConfiguration = service.getTextEditFormConfig();

					platformTranslateService.translateFormConfig(configDialogOptions.formConfiguration);

					return platformModalFormConfigService.showDialog(configDialogOptions).then(function (result) {
						if (result.ok) {
							entity.Name = result.data.Name;

							return {
								ok: true,
								data: entity
							};
						}

						return {
							ok: false
						};
					});
				};

				service.updateDimensionText = function (modelId, dimension) {
					var context = service.getContext(modelId);

					return $http.post(object2DWebApiBaseUrl + 'updatetoheader', {
						Context: context,
						Item: dimension,
						OnlyText: true
					}).then(function (res) {
						if (angular.isFunction(options.onDimensionUpdate)) {
							options.onDimensionUpdate(modelId, dimension);
						}
						return res.data;
					});
				};

				service.getDefaultDimensionGroup = function () {
					var template = service.getObjectTemplate();

					if (_.isNil(template)) {
						return null;
					}

					var dimensionGroup = {
						dimensionGroupId: template.id.toString(),
						dimensionPreview: 'Colour',
						dimensionType: 'Count',
						displayValue: 'Value 1',
						folder: 'Folder 1',
						name: template.name,
						negativeConfig: {
							colour: template.negativeColor,
							fillStyle: template.negativeTexture,
							pointStyle: 0,
						},
						positiveConfig: {
							colour: template.positiveColor,
							fillStyle: template.positiveTexture,
							pointStyle: 0,
						},
						version: 1
					};

					return service.convertDimensionGroup(dimensionGroup);
				};

				service.convertDimensionGroup = function (dimensionGroup) {
					var str = dimensionGroup.dimensionGroupId;

					while (str.length < 12) {
						str = '0' + str;
					}

					dimensionGroup.dimensionGroupId = '{00000000-0000-0000-0000-' + str + '}';
					dimensionGroup.negativeConfig.colourInt = dimensionGroup.negativeConfig.colour;
					dimensionGroup.positiveConfig.colourInt = dimensionGroup.positiveConfig.colour;
					dimensionGroup.negativeConfig.colour = convertColor(dimensionGroup.negativeConfig.colour);
					dimensionGroup.positiveConfig.colour = convertColor(dimensionGroup.positiveConfig.colour);

					function convertColor(intValue) {
						var rgb = intValue.toString(16);

						while (rgb.length < 6) {
							rgb = '0' + rgb;
						}

						return '#' + rgb;
					}

					return dimensionGroup;
				};

				service.loadDimensionGroups = function (modelId) {
					return $http.get(globals.webApiBaseUrl + 'constructionsystem/main/dimgroup/list?modelId=' + modelId).then(function (res) {
						var part = service.getModelPart(modelId);
						part.dimensionGroups = res.data.map(function (item) {
							return service.convertDimensionGroup(item);
						});
						return part.dimensionGroups;
					});
				};

				service.getDimensionGroups = function (modelId) {
					var modelData = service.getModelPart(modelId);
					return modelData.dimensionGroups;
				};

				service.init(options);

				return service;
			}

			return {
				create: create,
				ModelPart: ModelPart,
				Dimension: Dimension
			};
		}
	]);

})(angular);