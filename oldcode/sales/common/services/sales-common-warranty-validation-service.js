/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';
	/* global moment */

	var moduleName = 'sales.common';
	angular.module(moduleName).factory('salesCommonWarrantyValidationService', [
		function (
		) {
			var service = {};

			service.validateHandoverDate = function validateHandoverDate(entity, value) {
				changeDate(entity, value, entity.DurationMonths);
				return true;
			};
			service.validateDurationMonths = function validateDurationMonths(entity, value) {
				changeDate(entity, entity.HandoverDate, value);
				return true;
			};

			function changeDate(entity, valueDate, num) {
				var newDate = new Date(valueDate);
				var valueMonth = newDate.getMonth();
				var month = valueMonth + 1 + parseInt(num);
				var day = newDate.getDate();
				var bigMonths = [0, 1, 3, 5, 7, 8, 10, 12];
				var year = newDate.getFullYear() + parseInt(month / 12);
				var isLeapYear = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
				if (month % 12 === 2 && day > 28) {
					if (isLeapYear) {
						day = 29;
					} else {
						day = 28;
					}
				} else if (valueMonth === 1 && ((isLeapYear && day === 29) || (!isLeapYear && day === 28))) {
					if (bigMonths.indexOf(month % 12) === -1) {
						day = 30;
					} else {
						day = 31;
					}
				} else if (bigMonths.indexOf(valueMonth + 1) > -1 && day > 28 && bigMonths.indexOf(month % 12) === -1) {
					day = 30;
				} else if (bigMonths.indexOf((valueMonth + 1) % 12) === -1 && day === 30 && bigMonths.indexOf(month % 12) > -1) {
					day = 31;
				}
				entity.WarrantyEnddate = moment().set({'year': newDate.getFullYear(), 'month': month - 1, 'date': day});
			}

			return service;
		}
	]);
})(angular);
