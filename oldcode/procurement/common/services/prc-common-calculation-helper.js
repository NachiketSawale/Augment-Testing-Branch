/**
 * Created by wui on 11/13/2017.
 */
/* globals math */

(function (angular, math) {
	'use strict';


	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('prcCommonCalculationHelper', ['_',
		function (_) {
			var globalKeep = 2;

			function round(number, digits) {
				if (_.isNaN(number)) {
					return 0;
				}
				var result = math.round(number, digits || globalKeep);
				if (result.isBigNumber) {
					return result.toNumber();
				}
				return result;
			}

			return {
				round: round
			};
		}
	]);

})(angular, math);
