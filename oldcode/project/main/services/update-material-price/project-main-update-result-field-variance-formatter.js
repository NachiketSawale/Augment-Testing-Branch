/**
 * Created by chi on 7/31/2019.
 */

(function(angular) {
	'use strict';
	var moduleName = 'project.main';
	angular.module(moduleName).factory('projectMainUpdateResultFieldVarianceFormatter', projectMainUpdateResultFieldVarianceFormatter);

	projectMainUpdateResultFieldVarianceFormatter.$inject = ['accounting', 'platformLanguageService', 'platformContextService'];

	function projectMainUpdateResultFieldVarianceFormatter(accounting, platformLanguageService, platformContextService) {
		var culture = platformContextService.culture();
		var cultureInfo = platformLanguageService.getLanguageInfo(culture);
		platformContextService.contextChanged.register(function (type) {
			if (type === 'culture') {
				culture = platformContextService.culture();
				cultureInfo = platformLanguageService.getLanguageInfo(culture);
			}
		});

		return {
			formatter: formatter,
			isEqualToZero: isEqualToZero
		};

		///////////////////////
		function formatter(row, cell, value, columnDef) {
			if (columnDef && columnDef.formatterOptions) {
				var precision = columnDef.formatterOptions.decimalPlaces;
				var dataType = columnDef.formatterOptions.dataType;
				var formattedValue = getFormattedValue(value, precision, dataType);
				if (isFormattedValueEqualToZero(formattedValue, precision, dataType)) {
					return formattedValue;
				}
				else {
					return '<span style="color: #FF0000">' + formattedValue + '</span>';
				}
			}
			return '';
		}

		function getFormattedValue(value, precision, dataType) {
			if (_.isNumber(value)) {
				var decimal = cultureInfo[dataType].decimal;
				return accounting.formatNumber(value, precision, cultureInfo[dataType].thousand, decimal);
			}
			return '';
		}

		function isEqualToZero(value, precision, dataType) {
			var tempValue = getFormattedValue(value, precision, dataType);
			if (tempValue) {
				return tempValue === getBaseValue(precision, dataType);
			}
			return true;
		}

		function isFormattedValueEqualToZero(formattedValue, precision, dataType) {
			if (formattedValue) {
				return formattedValue === getBaseValue(precision, dataType);
			}
			return true;
		}

		function getBaseValue(precision, dataType) {
			var baseValue = '0';
			var decimal = cultureInfo[dataType].decimal;
			for (var i = 0; i < precision; ++i) {
				if (i === 0) {
					baseValue += decimal;
				}
				baseValue += '0';
			}
			return baseValue;
		}
	}
})(angular);