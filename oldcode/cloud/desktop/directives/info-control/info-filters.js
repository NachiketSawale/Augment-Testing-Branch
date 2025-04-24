/**
 * Created by wui on 5/19/2015.
 */

(function (angular) {
	'use strict';

	angular.module('cloud.desktop').filter('infoDate', ['moment', function (moment) {

		return function (input) {
			return input ? moment.utc(input).format('L') : '';
		};

	}]);

	angular.module('cloud.desktop').filter('infoTime', ['moment', function (moment) {

		return function (input) {
			return moment.isMoment(input) ? input.format('HH:mm:ss') : '';
		};

	}]);

	angular.module('cloud.desktop').filter('infoDateTime', ['moment', function (moment) {

		return function (input) {
			return moment.isMoment(input) ? input.format('L - HH:mm:ss') : '';
		};

	}]);

	// input-value cast in  money-object
	angular.module('cloud.desktop').filter('infoMoney', ['platformDomainService', 'platformLanguageService', 'accounting', '_',
		function (platformDomainService, platformLanguageService, accounting, _) {

			return function (input) {

				var domain = platformDomainService.loadDomain('money');
				var lang = platformLanguageService.getLanguageInfo();
				var options = {
					'thousand': lang.numeric.thousand,
					'decimal': lang.numeric.decimal,
					'precision': domain.precision || 0
				};

				var _condition = !_.isNull(input) && !_.isUndefined(input);
				var inputAsNumber = _condition ? accounting.formatNumber(input, options.precision, options.thousand, options.decimal) : '';

				return inputAsNumber;
			};
		}]);

	angular.module('cloud.desktop').filter('infoUrl', function () {
		return function (input) {
			if (/http(s)?:\/\//.test(input)) {
				return input ? '<a target="_blank" href="' + input.replace(/\s/g, '') + '">' + input + '</a>' : '';
			} else {
				return input ? '<a target="_blank" href="http://' + input.replace(/\s/g, '') + '">' + input + '</a>' : '';
			}
		};
	});

	angular.module('cloud.desktop').filter('infoEmail', function () {
		return function (input) {
			return input ? '<a href="mailto:' + input + '">' + input + '</a>' : '';
		};
	});

	angular.module('cloud.desktop').filter('infoPhone', function () {
		return function (input) {
			return input ? '<a href="tel:' + input + '">' + input + '</a>' : '';
		};
	});

	angular.module('cloud.desktop').filter('infoTranslate', ['$translate', function ($translate) {

		var sidebarInfo = {
			email: {
				info: 'Email',
				info$tr$: 'cloud.common.sidebarInfoDescription.email'
			},
			phone: {
				info: 'Mobile',
				info$tr$: 'cloud.common.sidebarInfoDescription.mobile'
			},
			fax: {
				info: 'Fax',
				info$tr$: 'cloud.common.sidebarInfoDescription.fax'
			},
			web: {
				info: 'Web',
				info$tr$: 'cloud.common.sidebarInfoDescription.web'
			},
			map: {
				info: 'Map',
				info$tr$: 'cloud.common.sidebarInfoDescription.map'
			},
			osm: {
				info: 'Map',
				info$tr$: 'cloud.common.sidebarInfoDescription.map'
			}
		};

		return function (input) {
			var result = '';

			if (angular.isString(input)) {
				result = input;
			} else if (angular.isObject(input)) {
				if (!input.info && !input.info$tr$ && input.id) {
					angular.extend(input, sidebarInfo[input.id]);
				}
				result = $translate.instant(input.info$tr$) || input.info;
			}

			return result;
		};

	}]);

	angular.module('cloud.desktop').filter('infoQuantity', [
		function () {
			function output(input) {
				input = Math.round(1000 * Math.abs(input)).toString().split('.')[0];
				return input.substr(0, input.length - 3) + '.' + input.substr(input.length - 3);
			}

			return function (input) {
				if (!angular.isNumber(input)) {
					return input;
				} else if (input > 0) {
					return output(input);
				} else if (input < 0) {
					return '-' + output(input);
				} else {
					return '0.000';
				}
			};
		}
	]);

	angular.module('cloud.desktop').filter('infoDefault', [
		function () {
			return function (input) {
				return angular.isString(input) ? input : input ? input.toString() : '';
			};
		}
	]);

	angular.module('cloud.desktop').filter('imgTransfer', ['basicsCommonUtilities', function (basicsCommonUtilities) {

		return function (input) {
			if (input && !/svg$/.test(input)) { // src content exists and it is not a url link.
				input = basicsCommonUtilities.toImage(input);
			}
			return input;
		};

	}]);

})(angular);