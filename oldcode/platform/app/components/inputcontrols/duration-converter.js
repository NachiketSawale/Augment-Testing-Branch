(function (angular) {
	'use strict';

	angular.module('platform').directive('platformDurationConverter', converter);

	converter.$inject = ['moment', '_', 'platformDomainService', 'math'];

	function converter(moment, _, platformDomainService, math) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: false,
			link: function (scope, elem, attrs, ctrl) {
				let domainData = {
					format: 'milliseconds'
				};

				if (attrs.domain) {
					domainData = platformDomainService.loadDomain(attrs.domain);
				}

				// remove formatter added by angular :-(
				if (ctrl.$formatters.length) {
					ctrl.$formatters.pop();
				}

				ctrl.$formatters.push(function (modelValue) {
					if (!_.isUndefined(modelValue) && !_.isNull(modelValue)) {
						if (_.isInteger(modelValue)) {
							modelValue = moment.duration(modelValue, domainData.format);
						} else if (moment.isMoment(modelValue)) {
							modelValue = moment.duration(modelValue.format('HH:mm'), domainData.format);
						}
						let result = '';
						if (scope.config && scope.config.options && scope.config.options.format) {
							result += moment.utc(modelValue.asMilliseconds()).format(scope.config.options.format);
						} else {
							result += math.floor(modelValue.asDays()) + ' ';
							result += moment.utc(modelValue.asMilliseconds()).format('HH:mm:ss');
						}
						return result;
					} else {
						return null;
					}
				});

				// remove parser added by angular :-(
				if (ctrl.$parsers.length) {
					ctrl.$parsers.pop();
				}
				ctrl.$parsers.push(function (viewValue) { // jshint ignore:line
					if (viewValue) {
						if (moment.isDuration(viewValue)) {
							// unprocessed durations need to be turned to an int
							viewValue = math.floor(viewValue.asSeconds());
							return viewValue;
						} else if (_.isString(viewValue)) {
							let value;
							if (viewValue.search(/\s/g) !== -1) {
								viewValue = viewValue.replace(/\s/g, '.0');
							} else if (viewValue.search(/:/g) === -1) {
								viewValue += '.0';
							}
							const separators = viewValue.search(/:/g) !== -1 ? viewValue.match(/:/g).length : 0;
							for (let i = 2; i > separators; i--) {
								viewValue += ':';
							}
							viewValue = viewValue.replace(/:/g, ':0');

							value = moment.duration(viewValue);

							if (moment.isDuration(value)) {
								// unprocessed durations need to be turned to an int
								if (scope.config.options && scope.config.options.returnValue === 'moment') {
									value = moment(math.floor(value.asSeconds())*1000).utc();
								} else {
									value = math.floor(value.asSeconds());
								}

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