/*
 * $Id: basics-common-boolean-processor.js 555422 2019-08-19 14:25:52Z balkanci $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	angular.module('basics.common').factory('BasicsCommonBooleanProcessor', ['_', function (_) {

		return function (fields) {

			const self = this;

			function stringToBoolean(string) {
				let result;
				switch (string.toLowerCase().trim()) {
					case 'true':
					case '1':
						result = true;
						break;
					case 'false':
					case '0':
					case null:
						result = false;
						break;
					default:
						result = Boolean(string);
				}
				return result;
			}

			self.processItem = function processItem(item) {
				_.forEach(fields, function (field) {
					const literal = _.get(item, field);
					if (literal && _.isString(literal)) {
						_.set(item, field, stringToBoolean(item[field]));
					}
				});
			};

		};
	}]);
})(angular);