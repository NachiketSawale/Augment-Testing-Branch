/*
 * $Id: platform-collection-utilities-service.js 612419 2020-11-13 11:24:13Z alisch $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformCollectionUtilitiesService
	 * @function
	 * @requires _
	 *
	 * @description Provides utility routines to handle collections.
	 */
	angular.module('platform').factory('platformCollectionUtilitiesService', ['_',
		function (_) {
			var service = {};

			service.canMoveItems = function (info) {
				var actualIndexesToMove = _.uniq(info.indexesToMove || []);

				if (actualIndexesToMove.length > info.totalCount) {
					throw new Error('Indexes to move exceed bounds.');
				}

				if (actualIndexesToMove.length <= 0) {
					return false;
				}

				actualIndexesToMove.sort();
				var hasGaps = (function () {
					for (var i = 1; i < actualIndexesToMove.length; i++) {
						if (actualIndexesToMove[i] - actualIndexesToMove[i - 1] > 1) {
							return true;
						}
					}
					return false;
				})();

				if (info.delta < 0) {
					return hasGaps || (actualIndexesToMove[0] > 0);
				} else if (info.delta > 0) {
					return hasGaps || (actualIndexesToMove[actualIndexesToMove.length - 1] < info.totalCount - 1);
				} else {
					return false;
				}
			};

			service.moveItems = function (info) {
				if ((info.delta === 0) || (info.indexesToMove.length <= 0)) {
					return;
				}

				var actualIndexesToMove = _.uniq(info.indexesToMove);
				actualIndexesToMove.sort();

				var lastIdx;
				if (info.delta < 0) {
					lastIdx = -1;
					actualIndexesToMove.forEach(function (idx) {
						var newIdx = _.max([idx + info.delta, lastIdx + 1]);
						lastIdx = newIdx;
						if (idx !== newIdx) {
							info.moveItemFunc(idx, newIdx);
						}
					});
				} else {
					lastIdx = info.totalCount;
					_.reverse(actualIndexesToMove).forEach(function (idx) {
						var newIdx = _.min([idx + info.delta, lastIdx - 1]);
						lastIdx = newIdx;
						if (idx !== newIdx) {
							info.moveItemFunc(idx, newIdx);
						}
					});
				}
			};

			service.canMoveItemsToBeginning = function (info) {
				var modifiedInfo = _.clone(info);
				modifiedInfo.delta = -1;
				return service.canMoveItems(modifiedInfo);
			};

			service.moveItemsToBeginning = function (info) {
				if (info.indexesToMove.length <= 0) {
					return;
				}

				var actualIndexesToMove = _.uniq(info.indexesToMove);
				actualIndexesToMove.sort();

				actualIndexesToMove.forEach(function (idxToMove, indexIndex) {
					if (idxToMove !== indexIndex) {
						info.moveItemFunc(idxToMove, indexIndex);
					}
				});
			};

			service.canMoveItemsToEnd = function (info) {
				var modifiedInfo = _.clone(info);
				modifiedInfo.delta = 1;
				return service.canMoveItems(modifiedInfo);
			};

			service.moveItemsToEnd = function (info) {
				if (info.indexesToMove.length <= 0) {
					return;
				}

				var actualIndexesToMove = _.uniq(info.indexesToMove);
				actualIndexesToMove.sort();

				_.reverse(actualIndexesToMove).forEach(function (idxToMove, indexIndex) {
					var newIndex = info.totalCount - 1 - indexIndex;
					if (idxToMove !== newIndex) {
						info.moveItemFunc(idxToMove, newIndex);
					}
				});
			};

			/**
			 * @ngdoc function
			 * @name appendItems
			 * @function
			 * @methodOf platformCollectionUtilitiesService
			 * @description Appends items at the end of an array in-place while working around the stack size limitation
			 *              that prevents push.apply to be called directly with too many new items at a time.
			 * @param {Array} array The array to expand.
			 * @param {Array} newItems The items to be added.
			 */
			service.appendItems = function (array, newItems) {
				var newItemChunks = _.chunk(newItems, 1000);
				newItemChunks.forEach(function (chunk) {
					array.push.apply(array, chunk);
				});
			};

			/**
			 * @ngdoc function
			 * @name getValueArray
			 * @function
			 * @methodOf cloudDesktopModuleService
			 * @description Returns an array of ids. The clou is that you are very flexible about what you pass on as id. It can be a single id string, but you can also pass an object or arrays of IDs or objects.
			 * @param { object,number,string, array } value The id of the external module
			 * @param { string } valueProp The name of the property for the value. Default is 'id'. This is only used, if an object is passed.
			 * @return { array } An array of ids
			 */
			service.getValueArray = function getValueArray(value, valueProp = 'id') {
				var values = _.isUndefined(value) ? [] : _.isArray(value) ? value : [value];
				values = _.map(values, function (item) {
					if (_.isObject(item)) {
						return item[valueProp];
					} else {
						return item;
					}
				});

				return values;
			};

			return service;
		}]);
})();
