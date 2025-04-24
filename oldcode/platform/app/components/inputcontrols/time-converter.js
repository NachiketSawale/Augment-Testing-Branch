(function (angular) {
	'use strict';

	angular.module('platform').directive('platformTimeConverter', converter);

	converter.$inject = ['moment', '_', 'platformDomainService', '$log'];

	function converter(moment, _, platformDomainService, $log) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: false,
			link: function (scope, elem, attrs, ctrl) {
				var utcMode = false;

				if (attrs.domain && attrs.domain.indexOf('utc') !== -1) {
					utcMode = true;
				}

				if (attrs.utcMode) {
					utcMode = attrs.utcMode === 'true';
				}

				var domainData = {
					dataType: 'time',
					format: 'HH:mm'
				};

				if (attrs.domain) {
					domainData = platformDomainService.loadDomain(attrs.domain);
				}

				// remove formatter added by angular :-(
				if (ctrl.$formatters.length) {
					ctrl.$formatters.pop();
				}

				ctrl.$formatters.push(function (modelValue) {
					if (modelValue) {
						if (_.isString(modelValue)) {
							modelValue = utcMode ? moment.utc(modelValue) : moment(modelValue);
						}

						return (utcMode ? modelValue.utc() : modelValue).format(domainData ? domainData.format : 'HH:mm');
					}

					return '';
				});

				// remove parser added by angular :-(
				if (ctrl.$parsers.length) {
					ctrl.$parsers.pop();
				}
				ctrl.$parsers.push(function (viewValue) { // jshint ignore:line
					if (viewValue) {
						if (_.isDate(viewValue)) {
							return utcMode ? moment.utc(viewValue) : moment(viewValue);
						} else if (_.isString(viewValue)) {
							var value = utcMode ? moment.utc(viewValue, domainData.format) : moment(viewValue, domainData.format);

							if (value.isValid()) {
								return value;
							}
						}
					}

					return null;
				});
			}
		};
	}
})(angular);