/***
 * Contains basic rib specific formatters.
 * 
 * @module Formatters
 * @namespace Slick
 */

(function ($) {
	'use strict';

	// register namespace
	$.extend(true, window, { // jshint ignore:line
		'Slick': {
			'Formatters': {
				'LookupImageFormatter': lookupImageFormatter
			}
		}
	});

	function lookupImageFormatter(row, cell, value, columnDef, dataContext) {
		var imageUrl = '';
		var options = columnDef.formatterOptions;
		var dataServiceName = columnDef.dataServiceName || 'basicsLookupdataLookupDescriptorService';

		/*****Get Descriptor Service By Current Module Dom Element*******/
		var service = angular.element('body').injector().get(dataServiceName),
			targetData,
			entity,
			result = '';

		if (columnDef.formatterOptions && service) {

			if (columnDef.formatterOptions.displayText) {
				result = columnDef.formatterOptions.displayText(value, dataContext, service);
			} else {
				targetData = service.getData(columnDef.formatterOptions.lookupType);

				if (targetData) {
					entity = targetData[value];
					if (entity) {
						result = entity[columnDef.formatterOptions.displayMember];
					}
				}
			}

			imageUrl = options.imageSelector.select(entity, dataContext);

			return '<img src="' + imageUrl + '">' + '<span style="padding-left:2px;">' + result + '</span>';
		}

	}

})(jQuery);