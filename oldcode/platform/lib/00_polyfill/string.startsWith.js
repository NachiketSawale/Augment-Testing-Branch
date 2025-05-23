(function () {
	'use strict';

	if (!String.prototype.startsWith) {
		String.prototype.startsWith = function (search, pos) { //jshint ignore:line
			return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
		};
	}
})();