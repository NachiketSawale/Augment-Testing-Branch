/*
 * $Id: basics-common-decimal-processor.js 555422 2019-08-19 14:25:52Z balkanci $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	angular.module('basics.common').factory('BasicsCommonDecimalProcessor', ['_', function (_) {

		return function (fields) {

			const self = this;

			function stringToDecimal(string) {
				return parseFloat(string);
			}

			self.processItem = function processItem(item) {
				_.forEach(fields, function (field) {
					const literal = _.get(item, field);
					if (literal && _.isString(literal)) {
						_.set(item, field, stringToDecimal(_.get(item, field)));
					}
				});
			};
		};
	}]);
})(angular);