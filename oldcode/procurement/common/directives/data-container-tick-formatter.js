/***
 * Contains basic rib specific formatters.
 *
 * @module Formatters
 * @namespace Slick
 */

// eslint-disable-next-line no-redeclare
/* global angular,jQuery */
(function ($) {
	'use strict';

	// register namespace
	$.extend(true, window, {
		'Slick': {
			'Formatters': {
				'IconTickFormatter': iconTickFormatter,
				'TitleFormatter': TitleFormatter
			}
		}
	});

	// noinspection JSUnusedLocalSymbols
	function iconTickFormatter(row, cell, value) {
		var cls = angular.isNumber(value) && value > 0 ? 'ico-tick' : '';
		return '<span style="padding-left:16px;width:100%;height: 100%" class="control-icons ' + cls + '"></span>';
	}

	// noinspection JSUnusedLocalSymbols
	/**
	 * @return {string}
	 */
	function TitleFormatter(row, cell, value, columnDef, dataContext) {
		var style = '<div  data-domain-control data-domain="description" data-model="DescriptionInfo.Translated">' + dataContext.Description + '</div>';
		if (dataContext.Count > 0) {
			style = '<div style="font-weight: bold" data-domain-control data-domain="description" data-ng-model="DescriptionInfo.Translated" >' + dataContext.Description + '</div>';
		}
		return style;
	}

})(jQuery);