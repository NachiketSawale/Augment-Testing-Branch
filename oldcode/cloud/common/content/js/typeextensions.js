(function () {
	/* global moment, $ */
	'use strict';

	/**
	 * provides prototype extension for native javascript types
	*/

	/*
	 * Caution:
	 * usersettings.js has been removed from app/common folder,
	 * to avoid an error that userSettings is not defined, put the definition here
	 * also this type extension doesn't support multi languages, then part of its functions have been migrated to service "typeExtensionsService"
	 */
	var userSettings = {
		locale: 'en-EN',
		decimalSeparator: '.',
		thousandSeparator: ',',
		dateFormat: 'YYYY-MM-DD',// valid formats see  http://momentjs.com/docs/#/manipulating/min/
		dateFormatAngular: 'yyyy-MM-dd'// valid formats see https://docs.angularjs.org/api/ng/filter/date
	};

	// -- String extensions  --

	/*
	 * converts a string to number - considers local settings of the current user
	 * @returns float or NaN
	 */

	// todo: function does NOT work proper ! Should be replaced !

	String.prototype.parseUserLocaleNumber = function () {

		var str = this;

		if ($.isNumeric(str)) {
			return parseFloat(str);
		}

		// see https://gist.github.com/GerHobbelt/2037124
		//var decimal_point = (1.1).toLocaleString(userLocale).substr(1, 1);
		//var K_separator = (5000).toLocaleString(userLocale).substr(1, 1);
		//if (K_separator === '0') {
		//K_separator = (decimal_point === '.' ? ',' : '.');
		//}

		var decimal_point = userSettings.decimalSeparator;
		var K_separator = userSettings.thousandSeparator;
		if (K_separator === '')
			K_separator = (decimal_point === '.' ? ',' : '.');

		switch (typeof (str)) {

			case 'float':
			case 'integer':
				return str;

			default:
				str = '' + str; // force str to be string type
				str = str.match(/[0-9.,eE-]+/);
				if (str) {
					str = str[0];
				}
				else {
					return Number.NaN; // VERY illegal number format
				}

				var kp = str.indexOf(',');
				var dp = str.indexOf('.');
				var kpl = str.lastIndexOf(',');
				var dpl = str.lastIndexOf('.');
				// can we be 'locale agnostic'? We can if both markers are in the input:
				if (kp > 0 && dp > 0) {
					if (kp < dp) {
						// e.g.: 1,000.00
						if (kpl > dpl || dpl > dp) {
							return Number.NaN; // VERY illegal number format
						}
						str = str.replace(/,/g, '');
					} else {
						// e.g.: 1.000,00
						if (kpl < dpl || kpl > kp) {
							return Number.NaN; // VERY illegal number format
						}
						str = str.replace(/\./g, '').replace(',', '.');
					}
				} else {
					// only one of 'em in there: must we use the detected 'current' locale
					// or can we 'heuristically determine' what's right here?
					// We can do the latter if we have either:
					// - only up to 2 digits following the only separator
					// - more than 3 digits following the only separator
					// - one separator only and the number starts with it, e.g. '.45'
					//
					// When we have only 3 digits following the last and only sep, we assume the separator
					// to be a 'thousands marker'.
					// We COULD fall back to the current locale, but than the ambiguous items receive
					// different treatment on a possibly incorrect locale setting (e.g. my machines are all
					// US/metric configured while I live in the Netherlands, but I /despise/ Dutch MS Excel,
					// for example. Riding the 'locale aware' ticket would definitely screw up my [ambiguous]
					// numbers. I believe it's better to be consistently wrong than semi-randomly correct.
					//
					// examples: 1.000 : 5,00 : 2,999.95 : 2,998 : 7.50 : 0,1791634 : 0.1791634 : .45 : ,32
					if (dp >= 0 && kp < 0) {
						// .45, ....
						if (dp !== 0 && (dpl > dp || str.substr(dp + 1).match(/^[0-9]{3}\b/))) {
							str = str.replace(/\./g, '');
						}
					} else if (kp >= 0 && dp < 0) {
						// ,32; ....
						if (kp !== 0 && (kpl > kp || str.substr(kp + 1).match(/^[0-9]{3}\b/))) {
							str = str.replace(/,/g, '');
						}
						else {
							str = str.replace(',', '.');
						}
					} else if (kp < 0 && dp < 0) {
						// integer value
					} else {
						// VERY illegal format, such as '.456,678'
						return Number.NaN;
					}
				}
				// now str has parseFloat() compliant format with US decimal point
				// only (iff it has a decimal fraction at all).
				return parseFloat(str);
		}
	};

	/*
	* formats a string - considers local settings of the current user
	* @returns formatted string or input
	*/
	String.prototype.toUserLocaleNumberString = function () {

		// try to convert the string into a float
		var s = this.parseUserLocaleNumber();
		// if (isNaN(s)) {
		if (typeof (s) === 'number') {
			return s.toUserLocaleNumberString();
		}
		else {
			return this;
		}
	};

	/*
	 * converts a string to date - considers local settings of the current user
	 * @returns date or null
	 */
	String.prototype.parseUserLocaleDate = function () {

		// utc strings can directly be converted
		var d = moment(this);
		if (d.isValid()) {
			return new Date(d);
		}

		// try to convert the string into a date type
		var s = moment(this, userSettings.dateFormat);
		if (moment(s).isValid()) {
			return new Date(s);
		}
		else {
			return null;
		}
	};

	/*
	* formats a string - considers local settings of the current user
	* @returns formatted string or input
	*/
	String.prototype.toUserLocaleDateString = function () {

		var s = this.parseUserLocaleDate();
		if (s !== null) {
			return s.toUserLocaleDateString();
		}
		else {
			return this;
		}
	};

	// -- Number extensions --

	/*
	 * dummy method
	 * @returns float or NaN
	 */
	Number.prototype.parseUserLocaleNumber = function () {
		return this;
	};

	/*
	* formats a number - considers local settings of the current user
	* @returns formatted string
	* @params  number of fraction digits
	*/
	Number.prototype.toUserLocaleNumberString = function (fractionDigits) {
		var fdigits = fractionDigits || 2;
		var s = formatNumber(this, fdigits, userSettings.decimalSeparator, userSettings.thousandSeparator);
		return s;
	};

	/*
   decimal_sep: character used as decimal separator, it defaults to '.' when omitted
   thousands_sep: char used as thousands separator, it defaults to ',' when omitted
   http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
   */
	var formatNumber = function (n, decimals, decimal_sep, thousands_sep) {
		// var n = this,
		var c = isNaN(decimals) ? 2 : Math.abs(decimals), //if decimal is zero we must take it, it means user does not want to show any decimal
		d = decimal_sep || '.', //if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)

		/*
		according to [http://stackoverflow.com/questions/411352/how-best-to-determine-if-an-argument-is-not-sent-to-the-javascript-function]
		the fastest way to check for not defined parameter is to use typeof value === 'undefined'
		rather than doing value === undefined.
		*/
		t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep, //if you don't want to use a thousands separator you can pass empty string as thousands_sep value

		sign = (n < 0) ? '-' : '',

		//extracting the absolute value of the integer part of the number and converting to string
		i = parseInt(n = Math.abs(n).toFixed(c)) + '',

		j = ((j = i.length) > 3) ? j % 3 : 0;
		return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
	};


	// -- Date extensions --

	/*
	* formats a date - considers local settings of the current user
	* @returns formatted string
	*/
	Date.prototype.toUserLocaleDateString = function () {
		var s = moment(this).format('L');
		return s;
	};
})();
