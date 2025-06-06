(function () {
	'use strict';

	if (!String.prototype.includes) {
		String.prototype.includes = function (search, start) { //jshint ignore:line
			if (typeof start !== 'number') {
				start = 0;
			}

			if (start + search.length > this.length) {
				return false;
			} else {
				return this.indexOf(search, start) !== -1;
			}
		};
	}
})();