/*
 * $Id: platform-unit-formatting-service.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformUnitFormattingService
	 * @function
	 * @requires $translate
	 *
	 * @description Contains routines to properly format values with a user-defined unit of measurement.
	 */
	angular.module('platform').factory('platformUnitFormattingService', ['$translate',
		function ($translate) {
			var service = {};

			function shortFormat(value, unitName) {
				return $translate.instant('platform.formattedUnits.' + unitName + '.short', {
					value: value
				});
			}

			service.formatLength = function (metersValue) {
				return shortFormat(metersValue, 'meters');
			};

			service.formatArea = function (squareMetersValue) {
				return shortFormat(squareMetersValue, 'squareMeters');
			};

			service.formatVolume = function (cubicMetersValue) {
				return shortFormat(cubicMetersValue, 'cubicMeters');
			};

			return service;
		}]);
})();