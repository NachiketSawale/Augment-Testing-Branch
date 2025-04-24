/**
 * Created by wui on 2/2/2015. There is something wrong in platform CheckmarkFormatter, so use it temporarily.
 */

(function ($) {
	'use strict';

	// register namespace
	$.extend(true, window, {
		'Slick': {
			'Formatters': {
				'CheckmarkFormatter2': checkmarkFormatter
			}
		}
	});

	/* jshint -W098 */ //  parameters is necessary
	function checkmarkFormatter(row, cell, value) {

		var path = globals.appBaseUrl + 'cloud.style/content/images/control-icons.svg#ico-';

		var imageName = 'intermediate';

		if (value === true) {
			imageName = 'checked';
		}
		else if (value === false) {
			imageName = 'unchecked';
		}

		return '<img src="' + path + imageName + '">';
	}
})(jQuery);
