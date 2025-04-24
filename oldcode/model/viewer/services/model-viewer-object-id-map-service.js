/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerObjectIdMapService
	 * @function
	 *
	 * @description This service provides the `ObjectIdMap` class. that represents a mapping between model object mesh
	 *              IDs and arbitrary values.
	 */
	angular.module('model.viewer').factory('modelViewerObjectIdMapService', ['_',
		function (_) {
			var service = {};

			function generateFilterFunc(filter) {
				if (_.isUndefined(filter)) {
					var result = function filterOff() {
						return true;
					};
					result.acceptsEverything = true;
					return result;
				}
				if (_.isFunction(filter)) {
					return function filterByFunction(v) {
						return filter(v);
					};
				}
				return function filterByValue(v) {
					return v === filter;
				};
			}

			service.generateFilterFunc = generateFilterFunc;

			/**
			 * @ngdoc function
			 * @name ObjectIdMap
			 * @function
			 * @methodOf ObjectIdMap
			 * @description A type for mapping object mesh IDs to values.
			 * @param {Number|Array<Number>} meshIdInitializer Optionally, a value for initializing the map. If a single
			 *                                                 number is supplied, it is assumed to be the maximum
			 *                                                 object ID, and `defaultValue` will be added for all
			 *                                                 object IDs from 1 to this number. If an array is passed
			 *                                                 to this parameter, `defaultValue` will be set for each of
			 *                                                 the IDs in the array.
			 * @param {any} defaultValue The value to set for the initialized properties.
			 */
			function ObjectIdMap(meshIdInitializer, defaultValue) {
				var that = this;

				function addId(id) {
					that[id] = defaultValue;
				}

				if (_.isFinite(meshIdInitializer)) {
					_.range(1, meshIdInitializer + 1).forEach(addId);
				} else if (_.isArray(meshIdInitializer)) {
					meshIdInitializer.forEach(addId);
				}
			}

			service.ObjectIdMap = ObjectIdMap;

			/**
			 * @ngdoc function
			 * @name addFromArray
			 * @function
			 * @methodOf ObjectIdMap
			 * @description Sets a given value for all object IDs found in an array.
			 * @param {Array<Number>} ids The array of object IDs.
			 * @param {any} value The value to assign.
			 * @param {any} otherValue Optionally, a value that all other IDs will be set to.
			 * @returns {ObjectIdMap} The current instance.
			 */
			ObjectIdMap.prototype.addFromArray = function (ids, value, otherValue) {
				var setId = {};
				var that = this;
				ids.forEach(function (id) {
					that[id] = value;
					setId[id] = true;
				});
				if (!_.isUndefined(otherValue)) {
					Object.keys(this).forEach(function (key) {
						if (!setId[key]) {
							that[key] = otherValue;
						}
					});
				}
				return this;
			};

			/**
			 * @ngdoc function
			 * @name toArray
			 * @function
			 * @methodOf ObjectIdMap
			 * @description Stores all object IDs whose value matches a given filter in an array.
			 * @param {Function|any} filter If a function is supplied, it is expected to be a predicate that returns a
			 *                              truthy value for any IDs to include in the resulting array. Otherwise, all
			 *                              object IDs whose value equals `filter` are added.
			 * @returns {Array<Number>} The resulting array of object IDs.
			 */
			ObjectIdMap.prototype.toArray = function (filter) {
				var that = this;
				var result = [];

				var filterFunc = generateFilterFunc(filter);

				var processingFunc = function (key) {
					if (filterFunc(that[key])) {
						result.push(key);
					}
				};
				_.map(Object.keys(this), function (id) {
					return parseInt(id);
				}).forEach(processingFunc);
				return result;
			};

			/**
			 * @ngdoc function
			 * @name toTruthyArray
			 * @function
			 * @methodOf ObjectIdMap
			 * @description Stores all object IDs with a truthy value in an array.
			 * @returns {Array<Number>} The resulting array of object IDs.
			 */
			ObjectIdMap.prototype.toTruthyArray = function () {
				return this.toArray(function (v) {
					return !!v;
				});
			};

			/**
			 * @ngdoc function
			 * @name count
			 * @function
			 * @methodOf ObjectIdMap
			 * @description Counts the object IDs whose value matches a given filter in an array.
			 * @param {Function|any} filter If a function is supplied, it is expected to be a predicate that returns a
			 *                              truthy value for values of IDs to include in the count. Otherwise,
			 *                              all object IDs whose value equals `filter` are counted.
			 * @returns {Number} The resulting number of objects.
			 */
			ObjectIdMap.prototype.count = function (filter) {
				var that = this;
				var result = 0;

				var filterFunc = generateFilterFunc(filter);

				var processingFunc = function (key) {
					if (filterFunc(that[key])) {
						result++;
					}
				};
				Object.keys(this).forEach(processingFunc);
				return result;
			};

			/**
			 * @ngdoc function
			 * @name countTruthy
			 * @function
			 * @methodOf ObjectIdMap
			 * @description Counts the object IDs with a truthy value in an array.
			 * @returns {Number} The resulting number of objects.
			 */
			ObjectIdMap.prototype.countTruthy = function () {
				return this.count(function (v) {
					return !!v;
				});
			};

			/**
			 * @ngdoc function
			 * @name countByValue
			 * @function
			 * @methodOf ObjectIdMap
			 * @description Counts the object IDs for each value that occurs in the map.
			 * @returns {Object} An object with the number of occurrences of each value with the value used as a
			 *                   property name.
			 */
			ObjectIdMap.prototype.countByValue = function () {
				var that = this;
				var result = {};
				Object.keys(this).forEach(function (key) {
					var value = that[key];
					if (angular.isDefined(result[value])) {
						result[value]++;
					} else {
						result[value] = 1;
					}
				});
				return result;
			};

			/**
			 * @ngdoc function
			 * @name mapIds
			 * @function
			 * @methodOf ObjectIdMap
			 * @description Creates a copy of the object with mapped object IDs.
			 * @param {Function|Object} mapping Either a function that maps an ID from the original map to an ID for the
			 *                                  new map, or an object whose properties match the IDs in the current map,
			 *                                  in such a way that property values can be used as keys in the new map.
			 * @returns {ObjectIdMap} The new object ID map.
			 */
			ObjectIdMap.prototype.mapIds = function (mapping) {
				var that = this;
				var result = new ObjectIdMap();
				var processingFunc;
				if (_.isFunction(mapping)) {
					processingFunc = function (key) {
						result[mapping(key)] = that[key];
					};
				} else {
					processingFunc = function (key) {
						result[mapping[key]] = that[key];
					};
				}
				Object.keys(this).forEach(processingFunc);
				return result;
			};

			/**
			 * @ngdoc function
			 * @name mapValues
			 * @function
			 * @methodOf ObjectIdMap
			 * @description Creates a copy of the object with mapped object values.
			 * @param {Function|Object} mapping Either a function that maps a value from the original map to a value for
			 *                                  the new map, or an object whose properties match the values in the
			 *                                  current map, in such a way that property values can be used as values in
			 *                                  the new map.
			 * @returns {ObjectIdMap} The new object ID map.
			 */
			ObjectIdMap.prototype.mapValues = function (mapping) {
				var that = this;
				var result = new ObjectIdMap();
				var doMap;
				if (_.isFunction(mapping)) {
					doMap = function (key) {
						return mapping(that[key]);
					};
				} else {
					doMap = function (key) {
						return mapping[that[key]];
					};
				}
				Object.keys(this).forEach(function (key) {
					var mappedVal = doMap(key);
					if (!_.isNull(mappedVal) && !_.isUndefined(mappedVal)) {
						result[key] = mappedVal;
					}
				});
				return result;
			};

			/**
			 * @ngdoc function
			 * @name mapValues
			 * @function
			 * @methodOf ObjectIdMap
			 * @description Creates a copy of the object with mapped object IDs and values. This method acts like a
			 *              combination of {@ObjectIdMap.prototype.mapIds} and {@ObjectIdMap.prototype.mapValues}.
			 *              However, it is more performant than calling the two methods individually.
			 * @param {Function|Object} idMapping The ID mapping. The argument works the same way as the argument to
			 *                                    {@ObjectIdMap.prototype.mapIds}.
			 * @param {Function|Object} valueMapping The value mapping. The argument works the same way as the argument
			 *                                       to {@ObjectIdMap.prototype.mapValues}.
			 * @returns {ObjectIdMap} The new object ID map.
			 */
			ObjectIdMap.prototype.map = function (idMapping, valueMapping) {
				var that = this;
				var result = new ObjectIdMap();

				var doMapValue;
				if (_.isFunction(valueMapping)) {
					doMapValue = function (key) {
						return valueMapping(that[key]);
					};
				} else {
					doMapValue = function (key) {
						return valueMapping[that[key]];
					};
				}

				var processingFunc;
				if (_.isFunction(idMapping)) {
					processingFunc = function (key) {
						var mappedVal = doMapValue(key);
						if (!_.isNull(mappedVal) && !_.isUndefined(mappedVal)) {
							result[idMapping(key)] = mappedVal;
						}
					};
				} else {
					processingFunc = function (key) {
						var mappedVal = doMapValue(key);
						if (!_.isNull(mappedVal) && !_.isUndefined(mappedVal)) {
							result[idMapping[key]] = mappedVal;
						}
					};
				}

				Object.keys(this).forEach(processingFunc);
				return result;
			};

			/**
			 * @ngdoc function
			 * @name clone
			 * @function
			 * @methodOf ObjectIdMap
			 * @description Creates a shallow copy of the object ID map.
			 * @param {Function|any} filter An optional filter to restrict the cloning operation.
			 * @returns {ObjectIdMap} The new object ID map.
			 */
			ObjectIdMap.prototype.clone = function (filter) {
				var that = this;

				var filterFunc = generateFilterFunc(filter);

				var result = new ObjectIdMap();
				Object.keys(this).forEach(function (key) {
					if (filterFunc(that[key])) {
						result[key] = that[key];
					}
				});
				return result;
			};

			/**
			 * @ngdoc function
			 * @name diff
			 * @function
			 * @methodOf ObjectIdMap
			 * @description Creates an `ObjectIdMap` that represents a diff between the current object compared to a
			 *              (presumed older) other `ObjectIdMap`. For each different property, the resulting map will
			 *              contain an object that can have an `oldValue` property, a `newValue` property, or both.
			 * @param {ObjectIdMap} base The older version of the map.
			 * @param {Function} idFilter An optional function that indicates whether to consider an ID for inclusion
			 *                            in the diff. Ids for which the function returns a falsy value will be ignored.
			 * @param {Function} equalityFunc An optional function that compares two items as a basis for the diff.
			 *                                If nothing is specified, the regular `===` operator will be used.
			 * @returns {ObjectIdMap} The resulting map.
			 */
			ObjectIdMap.prototype.diff = function (base, idFilter, equalityFunc) {
				var that = this;
				var result = new ObjectIdMap();

				var isDifferent = _.isFunction(equalityFunc) ? function (oldValue, newValue) {
					return !equalityFunc(oldValue, newValue);
				} : function (oldValue, newValue) {
					return oldValue !== newValue;
				};

				var doIdFilter = _.isFunction(idFilter) ? idFilter : function () {
					return true;
				};

				Object.keys(this).forEach(function (key) {
					if (doIdFilter(key)) {
						if (Object.prototype.hasOwnProperty(base, key)) {
							if (isDifferent(base[key], that[key])) {
								result[key] = {
									id: key,
									oldValue: base[key],
									newValue: that[key]
								};
							}
						} else {
							result[key] = {
								id: key,
								newValue: that[key]
							};
						}
					}
				});
				Object.keys(base).forEach(function (key) {
					if (doIdFilter(key)) {
						if (!Object.prototype.hasOwnProperty(that, key)) {
							result[key] = {
								id: key,
								oldValue: base[key]
							};
						}
					}
				});

				return result;
			};

			/**
			 * @ngdoc function
			 * @name resetlessChanges
			 * @function
			 * @methodOf ObjectIdMap
			 * @description Creates an `ObjectIdMap` that contains only the changed values, and only if no value was
			 *              removed compared to a base version.
			 * @param {ObjectIdMap} base The older version of the map.
			 * @returns {ObjectIdMap} The resulting map, or `null` if at least one value from `base` was removed.
			 */
			ObjectIdMap.prototype.resetlessChanges = function (base) {
				var diff = this.diff(base);
				if (diff.count(function (val) {
					return !_.isUndefined(val.oldValue) && !_.isNull(val.oldValue) &&
						(_.isUndefined(val.newValue) || _.isNull(val.newValue));
				}) <= 0) {
					return diff.mapValues(function (val) {
						return val.newValue;
					});
				} else {
					return null;
				}
			};


			/**
			 * @ngdoc function
			 * @name assign
			 * @function
			 * @methodOf ObjectIdMap
			 * @description Assigns any values found in another map to this map.
			 * @param {ObjectIdMap} map The other map.
			 * @param {Function} idFilter An optional function that indicates whether to consider an ID for inclusion
			 *                            in the diff. Ids for which the function returns a falsy value will be ignored.
			 */
			ObjectIdMap.prototype.assign = function (map, idFilter) {
				var that = this;
				Object.keys(map).forEach(function (id) {
					if (!angular.isFunction(idFilter) || idFilter(id)) {
						that[id] = map[id];
					}
				});
			};

			/**
			 * @ngdoc function
			 * @name merge
			 * @function
			 * @methodOf ObjectIdMap
			 * @description Merges the values from another map into the current one, using a merging function where both
			 *              maps have a value for a given key.
			 * @param {ObjectIdMap} map The other map.
			 * @param {Function} mergeFunc A function that receives two values, followed by their common key, and is
			 *                             expected to return a merged value.
			 * @param {Function} idFilter An optional function that indicates whether to consider an ID for inclusion
			 *                            in the diff. Ids for which the function returns a falsy value will be ignored.
			 */
			ObjectIdMap.prototype.merge = function (map, mergeFunc, idFilter) {
				var that = this;
				Object.keys(map).forEach(function (id) {
					if (!angular.isFunction(idFilter) || idFilter(id)) {
						if (angular.isDefined(that[id])) {
							that[id] = mergeFunc(that[id], map[id], id);
						} else {
							that[id] = map[id];
						}
					}
				});
			};

			/**
			 * @ngdoc function
			 * @name chunk
			 * @function
			 * @methodOf ObjectIdMap
			 * @description Creates partial copies of the map, each of which contains at most `maxSize` keys.
			 * @param {Number} maxSize The maximum number of keys in each partial map.
			 * @returns {Array<ObjectIdMap>} An array of partial copies of the map.
			 */
			ObjectIdMap.prototype.chunk = function (maxSize) {
				var that = this;
				var result = [];
				var idChunks = _.chunk(Object.keys(this), maxSize);
				idChunks.forEach(function (idChunk) {
					var chunk = new ObjectIdMap();
					idChunk.forEach(function (id) {
						chunk[id] = that[id];
					});
					result.push(chunk);
				});
				return result;
			};

			/**
			 * @ngdoc function
			 * @name equals
			 * @function
			 * @methodOf ObjectIdMap
			 * @description Checks whether the instance equals another instance.
			 * @param {ObjectIdMap} other The other instance.
			 * @returns {Boolean} A value that indicates whether the current instance is equal to the other instance.
			 */
			ObjectIdMap.prototype.equals = function (other) {
				var that = this;
				return Object.keys(this).every(function (key) {
					return that[key] === other[key];
				}) && Object.keys(other).every(function (key) {
					return that[key] === other[key];
				});
			};

			/**
			 * @ngdoc function
			 * @name clean
			 * @function
			 * @methodOf ObjectIdMap
			 * @description Removes items with falsy values from the map.
			 */
			ObjectIdMap.prototype.clean = function () {
				var that = this;
				Object.keys(that).forEach(function (id) {
					id = parseInt(id);
					if (!(that[id])) {
						delete that[id];
					}
				});
			};

			return service;
		}]);
})(angular);
