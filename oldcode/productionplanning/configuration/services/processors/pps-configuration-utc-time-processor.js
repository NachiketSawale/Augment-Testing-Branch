/**
 * Created by anl on 6/20/2018.
 */

/* global moment */
(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.common';

	angular.module(moduleName).factory('ProductionPlanningCommonUtcTimeProcessor', [function () {

		return function (fields, format) {

			var self = this;
			if (!format) {
				format = function () {
				};
				format.parse = function (string) {
					var time = string;
					if (typeof(string) === 'string') {
						time = '1970-01-01 ' + time;
						time = moment.utc(time,'YYYY-MM-DD HH:mm');

					}else if (typeof(string) === 'object'){
						time = time.year(1970).month(1).date(1);
					}
					return time;
				};
			}

			self.processItem = function processItem(item) {
				if (fields.length > 0) {
					for (var n = 0; n < fields.length; ++n) {
						if (item[fields[n]]) {
							item[fields[n]] = format.parse(item[fields[n]]);
						}
					}
				}
			};

			self.revertProcessItem = function revertProcessItem(item) {
				if (fields.length > 0) {
					for (var n = 0; n < fields.length; ++n) {
						if (item[fields[n]] && !angular.isString(item[fields[n]])) {
							item[fields[n]] = item[fields[n]].format('HH:mm:ss');
						}
					}
				}
			};
		};
	}]);
})(angular);