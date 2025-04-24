/**
 * Created by janas on 03.07.2018.
 */

(function () {
	'use strict';

	var controllingStructureModule = angular.module('controlling.structure');

	/**
	 * @ngdoc service
	 * @name controllingStructureGeneratorHelperService
	 * @function
	 *
	 * @description
	 * provides helper functions for generation process
	 */
	controllingStructureModule.factory('controllingStructureGeneratorHelperService', ['_',
		function (_) {
			return {
				/**
				 * Calculates the cartesian product, see example
				 * @param arrays
				 * @returns {*}
				 * @example
				 * var result = cartesianProductOf([['A', 'B'], ['1', '2', '3']]);
				 * // result: [['A','1'], ['A','2'], ['A','3'], ['B','1'], ['B','2'], ['B','3']]
				 */
				cartesianProductOf: function cartesianProductOf(arrays) {
					return _.reduce(arrays, function (a, b) {
						return _.flatten(_.map(a, function (x) {
							return _.map(b, function (y) {
								return x.concat([y]);
							});
						}), false);
					}, [[]]);
				}
			};
		}]);
})();
