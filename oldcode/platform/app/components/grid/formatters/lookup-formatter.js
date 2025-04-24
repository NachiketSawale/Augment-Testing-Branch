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
				'LookupFormatter': lookupFormatter,
				'SimpleLookupFormatter': simpleLookupFormatter
			}
		}
	});

	// noinspection JSUnusedLocalSymbols
	function lookupFormatter(row, cell, value, columnDef, dataContext) {
		/** ***Get Descriptor Service By Current Module Dom Element*******/
		var $injector = angular.element('body').injector(),
			service = $injector.get('basicsLookupdataLookupDescriptorService'),
			platformObjectHelper = $injector.get('platformObjectHelper'),
			targetData,
			entity,
			result = '';

		if (columnDef.formatterOptions && service) {

			targetData = service.getData(columnDef.formatterOptions.lookupType);
			value = platformObjectHelper.getValue(dataContext, columnDef.field);

			if (targetData) {
				entity = targetData[value];
				if (entity) {
					result = platformObjectHelper.getValue(entity, columnDef.formatterOptions.displayMember);
				}
			}
			// else {
			//	console.log('targetdata is null');
			// }

			if (entity && columnDef.formatterOptions.imageSelector) {
				var imageUrl = '';
				var imageSelector = columnDef.formatterOptions.imageSelector;

				if (angular.isString(imageSelector)) {
					imageSelector = $injector.get(imageSelector);
				}
				if (angular.isObject(imageSelector)) {
					imageUrl = imageSelector.select(entity, dataContext);
				}
				if (imageUrl) {
					result = '<img src="' + imageUrl + '">' + '<span style="padding-left:2px;">' + result + '</span>';
				}
			}
		}

		return result;
	}

	function simpleLookupFormatter(row, cell, value, columnDef, dataContext) { // jshint ignore:line
		var $injector = angular.element('body').injector();
		var service = $injector.get('basicsLookupdataSimpleLookupService');
		var displayMember = '';

		if (columnDef.formatterOptions && service) {
			var data = service.getListSync(columnDef.formatterOptions);

			if (data.items && data.items.length) {
				var lookupData = _.find(data.items, {'itemValue': value});

				if (lookupData) {
					displayMember = lookupData.displayValue;
				}
			}
		}

		return displayMember;
	}

})(jQuery);