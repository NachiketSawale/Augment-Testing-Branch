/**
 * Created by wui on 1/24/2018.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonGridFormatterHelper', ['platformObjectHelper',
		function (platformObjectHelper) {
			function formatterValue(dataContext, field, options, internalField, value) {
				if (dataContext) {
					if (options) {
						if (options.field) {
							field = options.field;
						} else {
							if (options.displayMember) {
								field = field + '.' + options.displayMember;
							}
						}
					}
					if (internalField) {
						field = field + '.' + internalField;
					}
					return platformObjectHelper.getValue(dataContext, field);
				} else {
					return value;
				}
			}

			return {
				formatterValue: formatterValue
			};
		}
	]);

})(angular);