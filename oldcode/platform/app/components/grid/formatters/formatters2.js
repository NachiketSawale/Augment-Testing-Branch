/***
 * Contains basic rib specific formatters.
 *
 * @module Formatters
 * @namespace Slick
 */

(function ($) {
	'use strict';

	// register namespace
	$.extend(true, window, {
		'Slick': {
			'Formatters': {
				'CheckmarkFormatter': checkmarkFormatter
			}
		}
	});

	function checkmarkFormatter(row, cell, value, columnDef, dataContext) {

		var path = globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-';

		var imageName = 'intermediate.svg';

		if (value === true) {
			imageName = 'checked';
		} else if (value === false) {
			imageName = 'unchecked';
		}

		return '<img src="' + path + imageName + '">';
	}
})(jQuery);
