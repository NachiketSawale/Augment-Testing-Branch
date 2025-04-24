/*
 * $Id: select-converter.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').directive('platformSelectConverter', converter);

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

				ctrl.$formatters.push(function (modelValue) {
					if (!_.isUndefined(modelValue) && modelValue !== null) {
						if (_.isUndefined(options.modelIsObject)) {
							options.modelIsObject = _.isObject(modelValue);
						}

						return _.find(options.items, _.zipObject([options.valueMember], [_.isObject(modelValue) ? modelValue[options.valueMember] : modelValue]));
					}

					return modelValue;
				});

				ctrl.$parsers.push(function (viewValue) {
					if (viewValue) {
						if (!options.modelIsObject) {
							return viewValue[options.valueMember];
						}

						return viewValue;
					}

					return null;
				});
			}
		};
	}
})(angular);