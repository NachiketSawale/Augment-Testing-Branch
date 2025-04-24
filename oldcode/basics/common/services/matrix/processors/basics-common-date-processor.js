/*
 * $Id: basics-common-date-processor.js 555422 2019-08-19 14:25:52Z balkanci $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	angular.module('basics.common').factory('BasicsCommonDateProcessor', ['_', 'moment', function (_, moment) {

		return function (fields) {

			const self = this;
			self.processItem = function processItem(item) {
				_.forEach(fields, function (field) {
					const literal = _.get(item, field);
					if (literal) {
						_.set(item, field, moment.utc(literal));
					}
				});
			};

			self.revertProcessItem = function revertProcessItem(item) {
				_.forEach(fields, function (field) {
					const literal = _.get(item, field);
					if (literal && moment.isMoment(literal)) {
						_.set(item, field, literal.format('YYYY-MM-DDTHH:mm:ss'));
					}
				});
			};
		};
	}]);
})(angular);