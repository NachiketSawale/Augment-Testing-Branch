(function () {
	'use strict';

	if (!String.prototype.endsWith) {
		String.prototype.endsWith = function (searchString, position) { //jshint ignore: line
			var subjectString = this.toString();
			if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
				position = subjectString.length;
			}
			position -= searchString.length;
			var lastIndex = subjectString.indexOf(searchString, position);
			return lastIndex !== -1 && lastIndex === position;
		};
	}
})();
