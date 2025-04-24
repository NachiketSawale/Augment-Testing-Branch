(function (angular) {
	'use strict';

	angular.module('platform').directive('platformDatetimeConverter', converter);

	converter.$inject = ['moment', '_', 'platformDomainService', '$log'];

	function converter(moment, _, platformDomainService, $log) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: false,
			link: function (scope, elem, attrs, ctrl) {
				var utcMode = false;
				var utcModel = false;
				var inGrid = !_.isUndefined(attrs.grid);

				if (attrs.domain && attrs.domain.indexOf('utc') !== -1) {
					utcMode = true;
				}

				if (attrs.utcMode) {
					utcMode = attrs.utcMode === 'true';
				}

				var domainData = {
					dataType: 'date',
					format: 'L'
				};

				if (attrs.domain) {
					domainData = platformDomainService.loadDomain(attrs.domain);
				}

				// remove formatter added by angular :-(
				if (ctrl.$formatters.length) {
					ctrl.$formatters.pop();
				}

				ctrl.$formatters.push(function (modelValue) {
					var result = '';

					if (modelValue) {
						if (_.isString(modelValue)) {
							$log.error('datetime|formatter: provide a moment object instead of string ->',
								attrs.ngModel + ': ' + modelValue);

							modelValue = utcMode ? moment.utc(modelValue) : moment(modelValue);
						}

						if (moment.isMoment(modelValue)) {
							utcModel = modelValue.isUtc();

							if (utcMode && !utcModel) {
								modelValue = modelValue.utc();
							} else if (!utcMode && utcModel) {
								modelValue = modelValue.local();
							}

							result = modelValue.format(domainData.format || 'L');
						}
					}

					if (inGrid && !_.has(scope, 'viewValue')) {
						scope.viewValue = result;
					}

					return result;
				});

				ctrl.$parsers.push(function (viewValue) { // jshint ignore:line
					if (viewValue && _.isString(viewValue)) {
						var value = utcMode ? moment.utc(viewValue, domainData.format) : moment(viewValue, domainData.format);

						if (value.isValid()) {
							var now = utcMode ? moment.utc() : moment();

							// if missing or partly set, set/adjust year (0 - >2015, 1 -> 2001, 12 -> 2012, 123 -> 2123
							if (!value.year()) {
								value.year(now.year());
							} else if (value.year() < 100) {
								value.year(now.year() % 100 * 100 + value.year());
							} else if (value.year() < 1000) {
								value.year(now.year() % 1000 * 1000 + value.year());
							}

							// if missing, set month
							if (viewValue.length < 3 && !value.month()) {
								value.month(now.month());
							}
						} else if (domainData.datatype.indexOf('date') !== -1) {
							// if moment isn't valid, parse as [D|DD][M|MM]|[Y|YY|YYY|YYYY]
							// 5   => 05.04.2014 | 05   => 05.04.2014 | 175   => 17.05.2014 | 0506  => 05.06.2014 | 050615 => 05.06.2015
							// 5.6 => 05.06.2014 | 5.06 => 05.06.2014 | 05.06 => 05.06.2014 | 05.06 => 05.06.2014 | 5.6.8  => 05.06.2008
							var matches = viewValue.match(/^(\d{1,2})(?:(?:\D)(\d{1,2}))?(?:(?:\D)(\d{1,4}))?$/i) || viewValue.match(/^(\d{1,2})(\d{1,2})?(\d{1,4})?$/i);

							if (matches) {
								value = utcMode ? moment.utc() : moment();

								for (var i = matches.length - 1; i >= 0; --i) {
									switch (matches.length) {
										case 2:
											var mod = 10 ^ matches[2].length;

											value.year(((value.year() % mod) * mod) + parseInt(matches[i]));
											break;

										case 1:
											value.month(parseInt(matches[i]));
											break;

										case 0:
											value.day(parseInt(matches[i]));
											break;
									}
								}
							}
						}

						if (value.isValid()) {
							if (viewValue !== value.format(domainData.format)) {
								ctrl.$setViewValue(value.format(domainData.format));
								ctrl.$render();
							}

							if (utcMode !== utcModel) {
								value = utcModel ? moment.utc(value) : value.local();
							}

							return value;
						}
					}

					return null;
				});
			}
		};
	}
})(angular);