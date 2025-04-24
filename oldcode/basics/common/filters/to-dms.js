/**
 * Created by wui on 8/20/2015.
 */

(function (angular) {
	'use strict';

	angular.module('basics.common').filter('basicsCommonToDms', [
		function () {
			function split(number) {
				var result = {integer: 0, decimal: 0},
					parts = number.toString().split('.');

				result.integer = parseInt(parts[0], 10);
				if (parts.length > 1) {
					result.decimal = parseFloat('0.' + parts[1]);
				}
				return result;
			}

			return function (input) {
				if (angular.isNumber(input)) {
					var num = split(input);
					var dd = num.integer;
					var mm = 60 * num.decimal;
					num = split(mm);
					mm = num.integer;
					var ss = 60 * num.decimal;
					ss = Math.round(ss * 10) / 10;
					return dd + '�' + mm + '\'' + ss + '\'';
				} else {
					return '';
				}
			};
		}
	]);

})(angular);