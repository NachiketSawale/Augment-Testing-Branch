/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {

	'use strict';
	/**
	 * @ngdoc self
	 * @name platformStringUtils
	 * @function
	 *
	 * @description
	 * The platformStringUtils provides common functions for strings,
	 * i.e. replacespecial characters by html definitions
	 */

	angular.module('platform').service('platformStringUtilsService', PlatformStringUtils);

	PlatformStringUtils.$inject = ['_'];

	function PlatformStringUtils() {
		// const self = this;

		/**
		 * replaces special characters like &"<>' by their html aquivalent
		 *
		 * @param string
		 * @returns {string} replaced string
		 */
		this.replaceSpecialChars = function replaceSpecialChars(string) {
			if (!string || string.length === 0) {
				return string;
			}
			return string
				.replace(/&/g, '&amp;') // we first replace &, other we replace the & from the html aquivalent
				.replace(/"/g, '&quot;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/'/g, '&#39;');
		};

		/**
		 * @ngdoc function
		 * @name processPlaceholderString
		 * @function
		 * @methodOf platformStringUtilsService
		 * @description Disassembles a string into literal and placeholder parts and sequentially invokes different
		 *              callback functions for each of them. The placeholders need to be enclosed in double square
		 *              brackets. The function guarantees to invoke at least one of the functions at least once.
		 * @param {String} string The string to analyze.
		 * @param {Function} literalFunc A function that will be invoked for each literal section in the string. It
		 *                               will receive the literal text as its only argument.
		 * @param {Function} placeholderFunc A function that will be invoked for each placeholder in the string. It
		 *                                   will receive the placeholder text (without the enclosing double square
		 *                                   brackets) as its only argument.
		 */
		this.processPlaceholderString = function (string, literalFunc, placeholderFunc) {
			const re = /((?:\[?[^[])*)(\[\[[^[\]]*]])?/g;

			let calledFunction = false;

			let matches = re.exec(string);
			while (matches && matches[0]) {
				if (matches[1].length > 0) {
					literalFunc(matches[1]);
					calledFunction = true;
				}
				if (matches[2] && (matches[2].length > 4)) {
					placeholderFunc(matches[2].substring(2, matches[2].length - 2));
					calledFunction = true;
				}
				matches = re.exec(string);
			}

			if (!calledFunction) {
				literalFunc('');
			}
		};
	}
})(angular);
