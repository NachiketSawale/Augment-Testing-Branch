(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonPrintCommonService', [
		'_',
		'platformObjectHelper',
		function (_,
			platformObjectHelper) {

			function isObject(o) {
				return Object.prototype.toString.call(o) === '[object Object]';
			}

			function merge2(target, source) {
				target = target || {};
				source = source || {};
				var mergeAll = true;
				var i = 1, options;
				while (i <= 2) {
					options = i === 1 ? target : source;
					if (options) {
						for (var prop in options) {
							// eslint-disable-next-line no-prototype-builtins
							if (options.hasOwnProperty(prop)) {
								var src = target[prop], copy = options[prop];
								if (src === copy) {
									continue;
								}
								if (copy && Object.prototype.toString.call(copy) === '[object Object]') {/* jshint -W073 */
									if (prop in target) {
										target[prop] = merge2(src || (copy.length ? [] : {}), copy, mergeAll);
									} else { /* jshint -W073 */
										if (mergeAll) {
											target[prop] = merge2(src || (copy.length ? [] : {}), copy, mergeAll);
										} else {
											target[prop] = undefined;
										}
									}
								} else if (copy && Object.prototype.toString.call(copy) === '[object Array]') {
									target[prop] = angular.copy(copy);
								} else {
									if (prop in target) { /* jshint -W073 */
										target[prop] = copy;
									} else if (mergeAll) { /* jshint -W073 */
										target[prop] = copy;
									}
								}
							}
						}
					}
					i++;
				}
				return target;
			}

			function flatTree(itemTree, childProp) {
				var itemList = [];
				_.each(itemTree, function (item) {
					itemList.push(item);
					if (item[childProp] && item[childProp].length > 0) {
						itemList.push(...flatTree(platformObjectHelper.getValue(item, childProp), childProp));
					}
				});
				return itemList;
			}

			function propCompletion(target, source) {
				if (angular.isDefined(target) && angular.isDefined(source)) {
					if (isObject(source)) {
						for (var prop in source) {
							// eslint-disable-next-line no-prototype-builtins
							if (source.hasOwnProperty(prop)) {
								// eslint-disable-next-line no-prototype-builtins
								if (!target.hasOwnProperty(prop)) {
									target[prop] = angular.copy(source[prop]);
								} else {/* jshint -W073 */
									if (isObject(target[prop]) && isObject(source[prop])) {
										propCompletion(target[prop], source[prop]);
									}
								}
							}
						}
					}
				}
			}

			return {
				merge2: merge2,
				flatTree: flatTree,
				propCompletion: propCompletion
			};
		}]);
})(angular);
