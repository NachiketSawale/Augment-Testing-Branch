/*
 * $Id: input-select-converter.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').directive('platformInputSelectConverter', converter);

	converter.$inject = ['_'];

	function converter(_) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				var inGrid = !_.isUndefined(attrs.grid);
				var config = inGrid ? scope.config : (attrs.config ? scope.$eval(attrs.config) : null);
				var options = inGrid ? scope.options : (attrs.options ? scope.$eval(attrs.options) : (config ? config.options : null));

				if (!options.displayMember) {
					options.displayMember = 'displayMember';
				}

				if (!options.valueMember) {
					options.valueMember = 'valueMember';
				}

				if (ctrl.$formatters.length) {
					options.controlFormatter = ctrl.$formatters.pop();
				}

				ctrl.$formatters.push(function (modelValue) {
					if (!_.isUndefined(modelValue)) {
						if (_.isUndefined(options.modelIsObject)) {
							options.modelIsObject = _.isObject(modelValue);
						}

						var value = options.modelIsObject ? modelValue[options.valueMember] : modelValue;

						return _.find(options.items, _.zipObject([options.valueMember], [value])) || modelValue;
					}

					return modelValue;
				});

				function createItem(viewValue) {
					var item = {};

					item[options.valueMember] = viewValue;
					item[options.displayMember] = viewValue;

					return item;
				}

				if (ctrl.$parsers.length) {
					options.controlParser = ctrl.$parsers.pop();
				}

				ctrl.$parsers.push(function (viewValue) {
					if (!_.isNull(viewValue) && !_.isUndefined(viewValue)) {
						if (options.modelIsObject) {
							return _.isString(viewValue) ? createItem(options.controlParser ? options.controlParser(viewValue) : viewValue) : viewValue;
						} else {
							return _.isString(viewValue) ? (options.controlParser ? options.controlParser(viewValue) : viewValue) : _.get(viewValue, options.valueMember);
						}
					}

					return null;
				});
			}
		};
	}
})(angular);