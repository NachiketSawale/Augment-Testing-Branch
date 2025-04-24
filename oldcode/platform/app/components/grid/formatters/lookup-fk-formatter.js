/**
 * Created by reimer on 25.09.2014.
 */

// todo I created this formatter because I don't want to change the lookup-formatter. These 2 formatters should be combined !

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
				'LookupFkFormatter': lookupFkFormatter
			}
		}
	});

	function lookupFkFormatter(row, cell, value, columnDef, dataContext) {
		/** ***Get Descriptor Service By Crrent Module Dom Element*******/
		var injector = angular.element('body').injector();
		var service = injector.get('basicsLookupdataLookupDescriptorService');

		if (!service) {
			return '';
		}

		var options = columnDef.formatterOptions;
		var lookupType = options.lookupType;
		var displayMember = options.displayMember;

		var val = value;

		if (value !== null && isNaN(value) === false) {

			var targetData = service.getData(lookupType);
			if (targetData) {
				var entity = targetData[value];
				if (entity) {
					val = entity[displayMember];
				}
			}
		}

		return val;
	}

})(jQuery);
