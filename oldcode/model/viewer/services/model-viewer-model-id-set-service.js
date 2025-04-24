/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerModelIdSetService
	 * @function
	 *
	 * @description Provides utilities for handling sets of (sub-)model-specific IDs.
	 */
	angular.module('model.viewer').factory('modelViewerModelIdSetService', ['_', 'modelViewerObjectIdMapService',
		'modelViewerModelSelectionService',
		function (_, modelViewerObjectIdMapService, modelViewerModelSelectionService) {
			var service = {};

			/**
			 * @ngdoc function
			 * @name ObjectIdSet
			 * @function
			 * @methodOf modelViewerModelIdSetService
			 * @description Instantiates a new object ID set.
			 * @param {Object} data Optionally, an object whose properties match sub-model IDs. Arrays and object ID
			 *                      maps found in the object will be copied into the new instance.
			 */
			function MultiModelIdSet(data) {
				if (data) {
					var that = this;
					Object.keys(data).forEach(function (subModelId) {
						subModelId = parseInt(subModelId);
						var modelData = data[subModelId];
						if (_.isArray(modelData)) {
							that[subModelId] = modelData.slice(0);
						} else if (_.isObject(modelData)) {
							that[subModelId] = modelData.clone();
						}
					});
				}
			}

			var ObjectIdSet = MultiModelIdSet;

			service.ObjectIdSet = ObjectIdSet;
			service.MultiModelIdSet = MultiModelIdSet;

			/**
			 * @ngdoc function
			 * @name normalizeToArrays
			 * @function
			 * @methodOf modelViewerModelIdSetService
			 * @description Converts all contained objects into arrays.
			 * @returns {ObjectIdSet} A new object ID set with copies of the contents converted into arrays.
			 */
			ObjectIdSet.prototype.normalizeToArrays = function () {
				var result = new ObjectIdSet();
				var that = this;
				modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
					var modelData = that[subModelId];
					if (_.isArray(modelData)) {
						result[subModelId] = modelData.slice(0);
					} else if (_.isObject(modelData)) {
						result[subModelId] = modelData.toTruthyArray();
					} else {
						result[subModelId] = [];
					}
				});
				return result;
			};

			/**
			 * @ngdoc function
			 * @name normalizeToMaps
			 * @function
			 * @methodOf modelViewerModelIdSetService
			 * @description Converts all contained objects into object ID maps.
			 * @param {any} defaultValue The value assumed for any entries found in arrays.
			 * @param {Function|any} filter An optional filter to restrict the values to take over.
			 * @returns {ObjectIdSet} A new object ID set with copies of the contents converted into object ID maps.
			 */
			ObjectIdSet.prototype.normalizeToMaps = function (defaultValue, filter) {
				var defValue = angular.isDefined(defaultValue) ? defaultValue : true;

				var filterFunc = modelViewerObjectIdMapService.generateFilterFunc(filter);

				var result = new ObjectIdSet();
				var that = this;
				modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
					var modelData = that[subModelId];
					if (_.isArray(modelData)) {
						if (filterFunc(defValue)) {
							result[subModelId] = new modelViewerObjectIdMapService.ObjectIdMap(modelData, defValue);
						} else {
							result[subModelId] = new modelViewerObjectIdMapService.ObjectIdMap();
						}
					} else if (_.isObject(modelData)) {
						result[subModelId] = modelData.clone(filter);
					} else {
						result[subModelId] = new modelViewerObjectIdMapService.ObjectIdMap();
					}
				});
				return result;
			};

			function joinIds(ids) {
				var result = '';
				var prevId = null;
				var rangeStarted = false;
				for (var i = 0; i < ids.length; i++) {
					var id = parseInt(ids[i]);
					if (prevId !== id) {
						if (prevId === id - 1) {
							if (!rangeStarted) {
								result += '_';
								rangeStarted = true;
							}
						} else {
							if (rangeStarted) {
								rangeStarted = false;
								result += prevId.toString(16);
							}
							result += ':' + id.toString(16);
						}
						prevId = id;
					}
				}
				if (rangeStarted) {
					result += prevId.toString(16);
				}
				return result;
			}

			/**
			 * @ngdoc function
			 * @name toCompressedString
			 * @function
			 * @methodOf modelViewerModelIdSetService
			 * @description Creates a compressed string representation of the object ID set suitable for network
			 *              transfer.
			 * @returns {String} The representation.
			 */
			ObjectIdSet.prototype.toCompressedString = function () {
				var result = '';
				var that = this;
				Object.keys(this).forEach(function (subModelId) {
					subModelId = parseInt(subModelId);
					var modelData = that[subModelId];
					if (_.isArray(modelData) && (modelData.length >= 1)) {
						if (result !== '') {
							result += ';';
						}

						result += parseInt(subModelId).toString(16) + joinIds(_.uniq(_.orderBy(modelData)));
					} else if (_.isObject(modelData) && angular.isFunction(modelData.count) && (modelData.count() >= 1)) {
						if (result !== '') {
							result += ';';
						}

						result += parseInt(subModelId).toString(16) + joinIds(_.uniq(_.orderBy(_.map(_.filter(Object.keys(modelData), function (id) {
							return !!(modelData[parseInt(id)]);
						}), function (id) {
							return parseInt(id);
						}))));
					}
				});
				return result;
			};

			function textToNumIds(textIds) {
				return _.flatten(_.map(textIds, function (id) {
					var idx = id.indexOf('_');
					if (idx >= 0) {
						var from = parseInt(id.substring(0, idx), 16);
						var to = parseInt(id.substring(idx + 1, id.length), 16);
						if (from < to) {
							return _.range(from, to + 1);
						} else if (from > to) {
							return _.range(to, from + 1);
						} else {
							return from;
						}
					} else {
						return parseInt(id, 16);
					}
				}));
			}

			/**
			 * @ngdoc function
			 * @name createFromCompressedStringWithArrays
			 * @function
			 * @methodOf modelViewerModelIdSetService
			 * @description Creates an object ID set with arrays that is based upon a compressed string
			 *              representation.
			 * @returns {ObjectIdSet} The resulting set.
			 */
			service.createFromCompressedStringWithArrays = function (data) {
				var result = new ObjectIdSet();

				if (_.isString(data)) {
					var byModel = data.split(';');
					byModel.forEach(function (modelText) {
						var textIds = modelText.split(':');
						if (textIds.length >= 2) {
							var numIds = textToNumIds(textIds);
							result[numIds[0]] = _.uniq(_.tail(numIds));
						}
					});
				}

				return result;
			};

			/**
			 * @ngdoc function
			 * @name createFromCompressedStringWithMaps
			 * @function
			 * @methodOf modelViewerModelIdSetService
			 * @description Creates an object ID set with object ID maps that is based upon a compressed string
			 *              representation.
			 * @param {any} value Optionally, a value to assign to the IDs. If this is not specified, `true` will be
			 *                    used.
			 * @returns {ObjectIdSet} The resulting set.
			 */
			service.createFromCompressedStringWithMaps = function (data, value) {
				var idValue = angular.isDefined(value) ? value : true;

				var result = new ObjectIdSet();

				if (_.isString(data)) {
					var byModel = data.split(';');
					byModel.forEach(function (modelText) {
						var textIds = modelText.split(':');
						if (textIds.length >= 2) {
							var numIds = textToNumIds(textIds);

							var idMap = new modelViewerObjectIdMapService.ObjectIdMap();
							_.tail(numIds).forEach(function (id) {
								idMap[id] = idValue;
							});

							result[numIds[0]] = idMap;
						}
					});
				}

				return result;
			};

			/**
			 * @ngdoc function
			 * @name useSubModelIds
			 * @function
			 * @methodOf modelViewerModelIdSetService
			 * @description Creates a copy of the instance that uses the sub-model IDs (internal to the model) for its
			 *              property names rather than the global model IDs of the sub-models.
			 * @returns {ObjectIdSet} The resulting instance.
			 */
			ObjectIdSet.prototype.useSubModelIds = function () {
				var result = new ObjectIdSet();

				var that = this;
				var modelInfo = modelViewerModelSelectionService.getSelectedModel();
				modelInfo.subModels.forEach(function (sm) {
					var modelData = that[sm.info.modelId];
					if (modelData) {
						result[sm.subModelId] = _.cloneDeep(modelData);
					}
				});

				return result;
			};

			/**
			 * @ngdoc function
			 * @name useGlobalModelIds
			 * @function
			 * @methodOf modelViewerModelIdSetService
			 * @description Creates a copy of the instance that uses the global model IDs of the sub-models for its
			 *              property names rather than the sub-model IDs (internal to the model).
			 * @returns {ObjectIdSet} The resulting instance.
			 */
			ObjectIdSet.prototype.useGlobalModelIds = function () {
				var result = new ObjectIdSet();

				var that = this;
				var modelInfo = modelViewerModelSelectionService.getSelectedModel();
				modelInfo.subModels.forEach(function (sm) {
					var modelData = that[sm.subModelId];
					if (modelData) {
						result[sm.info.modelId] = _.cloneDeep(modelData);
					}
				});

				return result;
			};

			/**
			 * @ngdoc function
			 * @name totalCount
			 * @function
			 * @methodOf modelViewerModelIdSetService
			 * @description Counts all model-specific IDs contained in the object ID set.
			 * @param {Function|any} filter If a function is supplied, it is expected to be a predicate that returns a
			 *                              truthy value for values of IDs in object ID maps to include in the count.
			 *                              Otherwise, all object IDs whose value equals `filter` are counted.
			 *                              Objects of sub-models listed in arrays cannot be excluded from filtering
			 *                              with this function.
			 * @returns {Number} The total number of IDs found for any sub-model in the set.
			 */
			ObjectIdSet.prototype.totalCount = function (filter) {
				var result = 0;
				var that = this;
				modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
					var modelData = that[subModelId];
					if (_.isArray(modelData)) {
						result += modelData.length;
					} else if (_.isObject(modelData)) {
						result += modelData.count(filter);
					}
				});
				return result;
			};

			/**
			 * @ngdoc function
			 * @name totalCountTruthy
			 * @function
			 * @methodOf modelViewerModelIdSetService
			 * @description Counts all model-specific IDs with a truthy value contained in the object ID set.
			 * @returns {Number} The total number of IDs found for any sub-model in the set.
			 */
			ObjectIdSet.prototype.totalCountTruthy = function () {
				return this.totalCount(function (v) {
					return !!v;
				});
			};

			/**
			 * @ngdoc function
			 * @name isEmpty
			 * @function
			 * @methodOf modelViewerModelIdSetService
			 * @description Checks whether the object ID set contains any model-specific IDs.
			 * @returns {Boolean} A value that indicates whether the set is empty.
			 */
			ObjectIdSet.prototype.isEmpty = function () {
				var that = this;
				return _.every(Object.keys(this), function (subModelId) {
					var modelData = that[parseInt(subModelId)];
					if (_.isArray(modelData)) {
						return modelData.length <= 0;
					} else if (_.isObject(modelData)) {
						return modelData.count() <= 0;
					} else {
						return true;
					}
				});
			};

			/**
			 * @ngdoc function
			 * @name assign
			 * @function
			 * @methodOf modelViewerModelIdSetService
			 * @description Merges another object ID set into the current instance. Note that any items in the current
			 *              instances will be converted to maps in the course of the process.
			 * @param {ObjectIdSet} other The other object ID set.
			 * @param {any} defaultValue The value assumed for any entries found in arrays.
			 */
			ObjectIdSet.prototype.assign = function (other, defaultValue) {
				var otherWithMaps = other.normalizeToMaps(defaultValue);
				var thisWithMaps = this.normalizeToMaps(defaultValue);

				var that = this;
				Object.keys(thisWithMaps).forEach(function (subModelId) {
					subModelId = parseInt(subModelId);

					var modelOther = otherWithMaps[subModelId];
					if (modelOther) {
						thisWithMaps[subModelId].assign(modelOther);
					}
					that[subModelId] = thisWithMaps[subModelId];
				});
				Object.keys(otherWithMaps).forEach(function (subModelId) {
					subModelId = parseInt(subModelId);

					if (!that[subModelId]) {
						that[subModelId] = otherWithMaps[subModelId];
					}
				});
				return thisWithMaps;
			};

			/**
			 * @ngdoc function
			 * @name countByValue
			 * @function
			 * @methodOf modelViewerModelIdSetService
			 * @description Counts the occurrence of values.
			 * @param {any} defaultValue
			 */
			ObjectIdSet.prototype.countByValue = function (defaultValue) {
				var result = {};

				function incValue(value, by) {
					if (_.isNumber(result[value])) {
						result[value] += by;
					} else {
						result[value] = by;
					}
				}

				var that = this;
				Object.keys(this).forEach(function (subModelId) {
					subModelId = parseInt(subModelId);
					var modelThis = that[subModelId];
					if (_.isArray(modelThis)) {
						if (!_.isNil(defaultValue)) {
							incValue(defaultValue, modelThis.length);
						}
					} else if (_.isObject(modelThis)) {
						Object.keys(modelThis).forEach(function (id) {
							var v = modelThis[id];
							if (!_.isNil(v)) {
								incValue(v, 1);
							}
						});
					}
				});

				return result;
			};

			ObjectIdSet.prototype.clean = function () {
				var that = this;
				Object.keys(that).forEach(function (subModelId) {
					subModelId = parseInt(subModelId);
					var modelData = that[subModelId];
					if (!_.isArray(modelData) && _.isObject(modelData)) {
						modelData.clean();
					}
				});
			};

			return service;
		}]);
})(angular);
