/**
 * Created by wui on 10/19/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialScopeUtilityService', [
		function () {
			var service = {};

			service.getMaxInt = function (list, property) {
				var result = 0;

				list.forEach(function (item) {
					if (item[property] > result) {
						result = item[property];
					}
				});

				return result;
			};

			return service;
		}
	]);


})(angular);