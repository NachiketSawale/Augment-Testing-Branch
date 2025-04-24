(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platformNumberShorteningService
	 * @function
	 *
	 * @description
	 * platformNumberShorteningService is the data service for shortening number by representing big numbers through shortened numbers and si- trading- or userdefined prefixes.
	 * By defining in language.json it is possible to configure a language dependent and/or user defined prefixes for number shortening.
	 * (path: 'platform.numberShortening.[prefixSystem]Prefix_[numeralSystem]_[amountInThePowerOfNumeralSystem]' : '[prefixString]' for si- and trading-prefixes or
	 *        '[location].[prefixSystem]Prefix_[numeralSystem]_[amountInThePowerOfNumeralSystem]' : '[prefixString]' ) for userdefined prefixes,
	 *        amountInThePowerOfNumeralSystem: min = -24, max = 24 (only the definition is bordered, shortening of bigger or smaller numbers is possible)
	 *        prefixSystem: 'si', 'trading' or '[userDefinedPrefixes]' and
	 *        numeralSystem : numeralSystem where the prefixes, to be used, are defined in
	 *        prefixString : prefix string (e.g. use 'k' or 'kilo' for 1000 respectivily amountInThePowerOfNumeralSystem=3 and numeralSystem=10 (10^3=1000), use '_' as empty string. use '' for no prefix defined at the amountInThePowerOfNumeralSystem)
	 * To get the shortened number out of a value, use getShortNumber(value, prefixSystem, numeralSystem, location) for
	 * location (optional): Has to be declared if using a user defined prefixSystem. Put here location path where user data is defined in.
	 * e.g. platformNumberShorteningService.getShortNumber(1100,'si',10) --> {prefix : 'k', number : 1.1, getString : ...} for regular si prefixes or
	 *      platformNumberShorteningService.getShortNumber(1024,'si',1024) --> {prefix : 'Ki', number : 1, getString : ...} for si prefixes based on binary numbers.
	 * This gives back an object like {prefix: [prefixString], number : [shortenedValue], getString : function that gives back the whole prefixed number as string}
	 * e.g. getString() --> '1.1 k' for no rounding or getString(0) --> '1 k' for rounding to the first digit.
	 */

	angular.module('platform').factory('platformNumberShorteningService', platformNumberShorteningService);

	platformNumberShorteningService.$inject = ['_', '$translate'];

	function platformNumberShorteningService(_, $translate) {
		var getCharacteristicAndMantissa = function characteristicAndMantissa(value, numeralSystem) {
			if (numeralSystem !== undefined) {
				return value.toString(numeralSystem).split('.');
			} else {
				return value.toString().split('.');
			}

		};

		var getMostSignificantFigurePostition = function getMostSignificantFigurePostition(value, numeralSystem) {
			var characteristicAndMantissa = getCharacteristicAndMantissa(value, numeralSystem);
			if (parseFloat(characteristicAndMantissa[0]) !== 0) {
				return characteristicAndMantissa[0].length;
			} else {
				var zeroChain = true;
				var lengthOfZeroChain = null;
				_.forEach(characteristicAndMantissa[1], function (figure, index) {
					if (zeroChain && figure === '0') {
						lengthOfZeroChain = index + 1;
					} else {
						zeroChain = false;
					}
				});
				return -1 * (lengthOfZeroChain + 1);
			}
		};

		var getPrefixes = function getPrefixes(prefixSystem, prefixNumberSystem, location) {
			var result = [];
			var preTranslateAccessString = '';
			if (prefixSystem === 'si' || prefixSystem === 'trading') {
				preTranslateAccessString = 'platform.numberShortening';
			} else if (location !== undefined) {
				preTranslateAccessString = location;
			} else {
				return null;
			}
			preTranslateAccessString += '.' + prefixSystem + 'Prefix_' + prefixNumberSystem.toString() + '_';
			for (var i = -24; i <= 24; i++) {
				var translateAccesString = preTranslateAccessString + i;
				var prefix = $translate.instant(translateAccesString);
				if (translateAccesString !== prefix && prefix !== '_' && prefix !== '') {
					result.push({prefix: prefix, numeralSystem: prefixNumberSystem, amountInPower: i});
				} else if (prefix === '_') {
					result.push({prefix: '', numeralSystem: prefixNumberSystem, amountInPower: i});
				}
			}
			return result;
		};

		var service = {
			getShortNumber: function (value, prefixSystem, prefixNumberSystem, location) {
				var tempPrefixes = getPrefixes(prefixSystem, prefixNumberSystem, location);
				var prefixer = _.minBy(tempPrefixes, function (pref) {
					var valueMostS = pref.amountInPower;
					var prefMostS = 0;
					var absValue = Math.abs(value);
					if (absValue !== 0) {
						prefMostS = Math.log(absValue) / Math.log(pref.numeralSystem);	// is faster than getMostSignificantFigurePostition
					}
					return Math.abs(Math.ceil(valueMostS - prefMostS));
				});
				return {
					prefix: prefixer.prefix,
					number: value / Math.pow(prefixer.numeralSystem, prefixer.amountInPower),
					getString: function (rounddigit) {
						var tempFac = Math.pow(10, rounddigit);
						var prefix = this.prefix;
						if (rounddigit !== undefined) {
							return (Math.round(this.number * tempFac) / tempFac).toString() + prefix;
						} else {
							return this.number.toString() + prefix;
						}
					}
				};
			}
		};
		return service;
	}
})();