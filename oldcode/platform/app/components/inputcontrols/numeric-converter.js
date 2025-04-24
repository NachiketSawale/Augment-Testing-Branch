(function (angular) {
	'use strict';

	angular.module('platform').directive('platformNumericConverter', converter);

	converter.$inject = ['platformDomainService', 'platformLanguageService', 'accounting', '_'];

	function converter(platformDomainService, platformLanguageService, accounting, _) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				const inGrid = (attrs.grid || attrs.cssclass) ? true : false;
				const config = (inGrid ? scope.config : (attrs.config ? scope.$eval(attrs.config) : null)) || {};
				let options = (inGrid ? scope.options : (attrs.options ? scope.$eval(attrs.options) : (config ? config.options : null))) || {};
				let domain = {};

				if (attrs.domain) {
					domain = platformDomainService.loadDomain(attrs.domain);
				}

				if (attrs.format) {
					options = attrs.format;
				} else {
					const lang = platformLanguageService.getLanguageInfo();

					options = {
						thousand: attrs.domain !== 'integer' ? lang.numeric.thousand : '',
						decimal: lang.numeric.decimal,
						precision: options.decimalPlaces || domain.precision || 0
					};

					if(_.isFunction(options.precision)) {
						options.precision = options.precision(config, inGrid ? config.field : config.model);

						if(_.isNil(options.precision)) {
							options.precision = domain.precision || 0;
						}
					}
				}

				// remove angular's default formatter
				ctrl.$formatters.pop();

				ctrl.$formatters.push(function (modelValue) {
					return !_.isNull(modelValue) && !_.isUndefined(modelValue) ? accounting.formatNumber(modelValue, options.precision, options.thousand, options.decimal) : '';
				});

				ctrl.$parsers.push(function (viewValue) {
					if (!_.isNil(viewValue) && _.isString(viewValue)) {
						if (viewValue === '' && (config && config.editorOptions && config.editorOptions.allownull)) {
							return null;
						}
						viewValue = viewValue.replace(/\s/g, '');
						if (viewValue.search(/[,\.]/g) !== -1) {
							if (options.precision) {
								const split = viewValue.replace(/,/g, options.decimal).replace(/\./g, options.decimal).split(options.decimal);
								const last = split.pop();

								viewValue = split.length ? split.join('').concat(options.decimal, last) : last;
							} else {
								viewValue = viewValue.replace(/[,\.]/g, '');
							}
						}

						var result = accounting.unformat(viewValue, options.decimal);

						if (attrs.domain !== 'inputselect' && !inGrid) {
							ctrl.$setViewValue(ctrl.$formatters[0](result));
							ctrl.$render();
						}

						return result;
					}

					return viewValue;
				});
			}
		};
	}
})(angular);