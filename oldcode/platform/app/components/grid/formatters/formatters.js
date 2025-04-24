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
				'NumberFormatter': numberFormatter,
				'DateFormatter': dateFormatter,
				'LocalizedTextFormatter': localizedTextFormatter
			}
		}
	});

	function numberFormatter(row, cell, value, columnDef, dataContext) {

		if (value === undefined || value === null || value === '') {
			return '';
		}
		return value.toUserLocaleNumberString();
	}

	function quantityFormatter(row, cell, value, columnDef, dataContext) {

		if (value === undefined || value === null || value === '') {
			return '';
		}
		return value.toUserLocaleNumberString(2);
	}

	function dateFormatter(row, cell, value, columnDef, dataContext) {

		if (value === undefined || value === null || value === '') {
			return '';
		}
		return value.toUserLocaleDateString();
	}

	var platformObjectHelper = null;

	function localizedTextFormatter(row, cell, value, columnDef, dataContext) {
		if (!platformObjectHelper) {
			var injector = angular.injector(['platform-helper']);

			platformObjectHelper = injector.get('platformObjectHelper');
		}

		return platformObjectHelper.getValue(dataContext, columnDef.field + '.Translated');
	}

})(jQuery);
