/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const module = angular.module('model.map');

	/**
	 * @ngdoc service
	 * @name modelMapLevelDataService
	 * @function
	 *
	 * @description
	 * modelMapLevelDataService is the data service for model map level related functionality.
	 */
	module.factory('modelMapLevelDataService', modelMapLevelDataService);

	modelMapLevelDataService.$inject = ['$http', '$q', 'platformDataServiceFactory',
		'modelMapAreaDataService', '_', 'basicsCommonDrawingUtilitiesService', 'math',
		'PlatformMessenger', '$'];

	function modelMapLevelDataService($http, $q, platformDataServiceFactory,
		modelMapAreaDataService, _, basicsCommonDrawingUtilitiesService, math,
		PlatformMessenger, $) {

		const onItemCreated = new PlatformMessenger();

		const exceptServiceOption = {
			flatLeafItem: {
				module: module,
				serviceName: 'modelMapLevelDataService',
				entityNameTranslationID: 'model.map.description',
				httpCreate: {
					route: globals.webApiBaseUrl + 'model/map/level/'
				},
				httpRead: {
					route: globals.webApiBaseUrl + 'model/map/level/',
					endRead: 'list',
					usePostForRead: false,
					initReadData: function (readData) {
						const selectedModelAreaMap = modelMapAreaDataService.getSelected();
						readData.filter = '?modelId=' + selectedModelAreaMap.ModelFk + '&mapAreaId=' + selectedModelAreaMap.Id;
					}

				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							const selectedModelMapArea = modelMapAreaDataService.getSelected();
							if (selectedModelMapArea) {
								creationData.PKey1 = selectedModelMapArea.ModelFk;
								creationData.PKey2 = selectedModelMapArea.Id;
							}
						},
						handleCreateSucceeded: function (newData) {
							onItemCreated.fire(newData);
							return newData;
						}
					}

				},
				actions: {
					create: 'flat',
					delete: true,
					canCreateCallBackFunc: () => Boolean(modelMapAreaDataService.getSelected())
				},
				entityRole: {
					leaf: {
						itemName: 'ModelMapLevels',
						moduleName: 'cloud.desktop.moduleDisplayNameModelMap',
						mainItemName: 'ModelMapLevel',
						useIdentification: true,
						parentService: modelMapAreaDataService
					}
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createNewComplete(exceptServiceOption);

		let alignmentMarkerGraphic = null;
		serviceContainer.service.loadAlignmentMarkerGraphic = function () {
			if (alignmentMarkerGraphic) {
				return $q.resolve(alignmentMarkerGraphic);
			}

			return $http.get(globals.appBaseUrl + 'model.map/content/images/alignment-marker.svg').then(function (response) {
				alignmentMarkerGraphic = $.parseXML(response.data);
				return alignmentMarkerGraphic;
			});
		};

		serviceContainer.service.registerItemCreated = function (handler) {
			onItemCreated.register(handler);
		};

		serviceContainer.service.unregisterItemCreated = function (handler) {
			onItemCreated.unregister(handler);
		};

		function LevelPlane(name) {
			this.name = name;
		}

		LevelPlane.prototype.getDependentPlanes = function () {
			return [];
		};

		const planeColors = {
			boundsDisabled: new basicsCommonDrawingUtilitiesService.RgbColor(0xBF, 0x41, 0x41),
			bounds: new basicsCommonDrawingUtilitiesService.RgbColor(0xFF, 0, 0),
			middleDisabled: new basicsCommonDrawingUtilitiesService.RgbColor(0x41, 0x41, 0xBF),
			middle: new basicsCommonDrawingUtilitiesService.RgbColor(0, 0, 0xFF)
		};

		serviceContainer.service.getLevelPlanes = function (bBox) {
			function getEffectivePlaneZ(level) {
				const that = this; // jshint ignore:line
				let zValue = that.getValue(level);
				if (!_.isNumber(zValue) || _.isNaN(zValue)) {
					zValue = that.getFallbackValue(bBox);
				}
				return zValue;
			}

			const levelPlanes = [_.assign(new LevelPlane('zMax'), {
				getValue: function (level) {
					return level.ZMax;
				},
				getFallbackValue: function () {
					return bBox.max.z;
				},
				setValue: function (level, value) {
					level.ZMax = value;
				},
				getColor: function (selected) {
					return selected ? planeColors.bounds : planeColors.boundsDisabled;
				}
			}), _.assign(new LevelPlane('zMin'), {
				name: 'zMin',
				getValue: function (level) {
					return level.ZMin;
				},
				getFallbackValue: function () {
					return bBox.min.z;
				},
				setValue: function (level, value) {
					level.ZMin = value;
				},
				getColor: function (selected) {
					return selected ? planeColors.bounds : planeColors.boundsDisabled;
				}
			}), _.assign(new LevelPlane('zLevel'), {
				name: 'zLevel',
				getValue: function (level) {
					return level.ZLevel;
				},
				getFallbackValue: function (level) {
					const vals = levelPlanes.getZValues(level, ['zMin', 'zMax']);
					return (vals.zMin + vals.zMax) / 2;
				},
				setValue: function (level, value) {
					level.ZLevel = value;
				},
				getDependentPlanes: function () {
					return ['zLevelBoundary'];
				},
				getColor: function (selected) {
					return selected ? planeColors.middle : planeColors.middleDisabled;
				}
			}), _.assign(new LevelPlane('zLevelBoundary'), {
				name: 'zLevelBoundary',
				getValue: function (level) {
					return level.ZLevel - level.ViewingDistance;
				},
				getFallbackValue: function (level) {
					const vals = levelPlanes.getZValues(level, ['zMin', 'zMax']);
					return vals.zMin + (vals.zMax - vals.zMin) * 0.25;
				},
				setValue: function (level, value) {
					level.ViewingDistance = levelPlanes.byName.zLevel.getEffectivePlaneZ(level) - value;
				},
				getColor: function (selected) {
					return selected ? planeColors.middle : planeColors.middleDisabled;
				}
			})];
			levelPlanes.forEach(function (plane) {
				plane.getEffectivePlaneZ = getEffectivePlaneZ;
			});
			levelPlanes.byName = (function () {
				const result = {};
				levelPlanes.forEach(function (item) {
					result[item.name] = item;
				});
				return result;
			})();
			levelPlanes.getZValues = function (level, valueNames) {
				const result = {};
				if (_.isArray(valueNames)) {
					valueNames.forEach(function (name) {
						result[name] = levelPlanes.byName[name].getEffectivePlaneZ(level);
					});
				} else {
					levelPlanes.forEach(function (plane) {
						result[plane.name] = plane.getEffectivePlaneZ(level);
					});
				}
				return result;
			};
			return levelPlanes;
		};

		serviceContainer.service.getGraphicsDescriptor = function (level) {
			if (_.isObject(level) && level.Id) {
				if (level.GraphicsFormat && _.isNumber(level.FileArchiveDocFk)) {
					return $http.get(globals.webApiBaseUrl + 'basics/common/document/preview', {
						params: {
							fileArchiveDocId: level.FileArchiveDocFk
						}
					}).then(function (response) {
						if (_.isString(response.data)) {
							return {
								type: level.GraphicsFormat,
								url: response.data
							};
						}
						return null;
					});
				}
			}
			return $q.resolve(null);
		};

		function getAlignmentPointProp(index) {
			return 'AlignmentPoint' + index;
		}

		serviceContainer.service.getAlignmentPoint = function (level, index) {
			const str = level[getAlignmentPointProp(index)];
			if (_.isString(str)) {
				const coords = str.split(' ');
				if (coords.length === 2) {
					const result = {
						x: parseInt(coords[0]),
						y: parseInt(coords[1])
					};
					if (_.isNumber(result.x) && !_.isNaN(result.x) && _.isNumber(result.y) && !_.isNaN(result.y)) {
						return {
							x: result.x / 1000,
							y: result.y / 1000
						};
					}
				}
			}
			return null;
		};

		serviceContainer.service.setAlignmentPoint = function (level, index, point, clandestinely) {
			level[getAlignmentPointProp(index)] = Math.round(point.x * 1000) + ' ' + Math.round(point.y * 1000);
			if (!clandestinely) {
				serviceContainer.service.markItemAsModified(level);
			}
		};

		serviceContainer.service.formatLevelTransformation = function (level) {
			return 'TRANSFORM = +(' + level.TranslationX + '|' + level.TranslationY + ') ' + level.OrientationAngle + '° ' + level.Scale + 'x';
		};

		serviceContainer.service.isZInLevel = function (level, z) {
			if (_.isNumber(level.ZMin) && (level.ZMin > z)) {
				return false;
			}

			return !(_.isNumber(level.ZMax) && (level.ZMax < z));
		};

		function Vector2(x, y) {
			this.x = x;
			this.y = y;
		}

		Vector2.prototype.getLength = function () {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		};

		Vector2.prototype.subtract = function (v) {
			return new Vector2(this.x - v.x, this.y - v.y);
		};

		function MapAlignmentMaster() {
		}

		serviceContainer.service.MapAlignmentMaster = MapAlignmentMaster;

		MapAlignmentMaster.prototype.setModelPoint1 = function (x, y) {
			this._modelPoint1 = new Vector2(x, y);
		};

		MapAlignmentMaster.prototype.setModelPoint2 = function (x, y) {
			this._modelPoint2 = new Vector2(x, y);
		};

		MapAlignmentMaster.prototype.setMapPoint1 = function (x, y) {
			this._mapPoint1 = new Vector2(x, y);
		};

		MapAlignmentMaster.prototype.setMapPoint2 = function (x, y) {
			this._mapPoint2 = new Vector2(x, y);
		};

		MapAlignmentMaster.prototype.updateTransformation = function (level) {
			if (!this._modelPoint1 || !this._modelPoint2 || !this._mapPoint1 || !this._mapPoint2) {
				throw new Error('Reference points have not been set yet.');
			}

			const mapPoint1 = _.clone(this._mapPoint1);
			const mapPoint2 = _.clone(this._mapPoint2);
			mapPoint1.x = -mapPoint1.x;
			mapPoint2.x = -mapPoint2.x;

			const vModel = this._modelPoint2.subtract(this._modelPoint1);
			const vMap = mapPoint2.subtract(mapPoint1);

			let vModelLength = vModel.getLength();
			let vMapLength = vMap.getLength();

			if (Math.abs(vModelLength) < 0.000001) {
				vModel.x += 1;
				vModelLength = vModel.getLength();
			}
			if (Math.abs(vMapLength) < 0.000001) {
				vMap.x += 1;
				vMapLength = vMap.getLength();
			}

			level.OrientationAngle = (Math.atan2(vModel.y, vModel.x) - Math.atan2(vMap.y, vMap.x)) * 180 / Math.PI;
			level.Scale = vMapLength / vModelLength;

			const translation = mapPoint1.subtract(this._modelPoint1);
			level.TranslationX = translation.x;
			level.TranslationY = translation.y;
		};

		MapAlignmentMaster.prototype.transformModelToMap = function (level, x, y) {
			const matrix = getMapTransformationMatrixFromLevel(level);
			const result = math.multiply(matrix, [x, y, 1]);
			return new Vector2(-math.subset(result, math.index(0)), math.subset(result, math.index(1)));
		};

		MapAlignmentMaster.prototype.deriveMapPointsFromModelPoints = function (level) {
			if (!this._modelPoint1 || !this._modelPoint2) {
				throw new Error('Model reference points have not been set yet.');
			}

			this._mapPoint1 = this.transformModelToMap(level, this._modelPoint1.x, this._modelPoint1.y);
			this._mapPoint2 = this.transformModelToMap(level, this._modelPoint2.x, this._modelPoint2.y);
		};

		function multiplyMatrices() {
			let result = arguments[0];
			for (let i = 1; i < arguments.length; i++) {
				result = math.multiply(result, arguments[i]);
			}
			return result;
		}

		function getMapTransformationMatrixFromLevel(level) {
			const radAngle = level.OrientationAngle / 180 * Math.PI;

			const t = math.matrix([[1, 0, level.TranslationX], [0, 1, level.TranslationY], [0, 0, 1]]);
			const r = math.matrix([[Math.cos(radAngle), Math.sin(radAngle), 0], [-Math.sin(radAngle), Math.cos(radAngle), 0], [0, 0, 1]]);
			const s = math.matrix([[level.Scale, 0, 0], [0, level.Scale, 0], [0, 0, 1]]);

			const alignmentPoint1 = serviceContainer.service.getAlignmentPoint(level, 1);
			const movePt1ToOrigin = math.matrix([[1, 0, -alignmentPoint1.x], [0, 1, -alignmentPoint1.y], [0, 0, 1]]);
			const movePt1AwayFromOrigin = math.matrix([[1, 0, alignmentPoint1.x], [0, 1, alignmentPoint1.y], [0, 0, 1]]);

			return multiplyMatrices(t, movePt1AwayFromOrigin, r, s, movePt1ToOrigin);
		}

		return serviceContainer.service;
	}
})(angular);
