/**
 * platform Factory
 * @namespace factories
 */
(function () {
	'use strict';
	/**
	 * @ngdoc factories
	 * @name platformtpl
	 */
	angular.module('platform')
		.factory('platformTpl', function () {
			return {
				/**
				 * @name parse
				 * @description          Parse string with <%placeholder%>
				 * @param  {string} tpl  String to parse
				 * @param  {object} data Data object {placeholder: value}
				 * @return {string}      The parsed string
				 *
				 */
				parse: function (tpl, data) {
					var re = /<%(.+?)%>/g;
					var match;
					while ((match = re.exec(tpl)) !== null) {
						tpl = tpl.replace(match[0], data[match[1]]);
						re.lastIndex = 0;
					}
					return tpl;
				}
			};
		});
})();
