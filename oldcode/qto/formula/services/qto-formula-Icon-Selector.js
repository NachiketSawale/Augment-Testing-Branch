/**
 * Created by lvi on 12/15/2014.
 */

(function () {
	/* global Platform */
	'use strict';
	let iconMap = [
		'qto-iconset-blue-pi001', 'qto-iconset-blue-pi002', 'qto-iconset-blue-pi003',
		'qto-iconset-blue-pi004', 'qto-iconset-blue-pi005', 'qto-iconset-blue-pi006',
		'qto-iconset-blue-pi007', 'qto-iconset-blue-pi008', 'qto-iconset-blue-pi009',
		'qto-iconset-blue001', 'qto-iconset-blue002', 'qto-iconset-blue003',
		'qto-iconset-blue004', 'qto-iconset-blue005', 'qto-iconset-blue006',
		'qto-iconset-blue007', 'qto-iconset-blue008', 'qto-iconset-blue009',
		'qto-iconset-blue010', 'qto-iconset-blue011', 'qto-iconset-blue012'
	];

	angular.merge(Platform.Lookup, {
		'imageSelector': {
			'qtoFormulaIconSelector': {
				select: function (value) {
					if (value >= 0 && value < iconMap.length) {
						return '<img src="qto.formula/content/images/' + iconMap[value] + '.png" alt=" ">';
					}
					else {
						return '<img src="qto.formula/content/images/' + iconMap[0] + '.png" alt=" ">';
					}
				}
			}
		}
	});

})();
