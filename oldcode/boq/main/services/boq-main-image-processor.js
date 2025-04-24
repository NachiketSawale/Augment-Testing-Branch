/**
 * Created by bh on 14.11.2014.
 */
(function () {

	/* global */
	'use strict';
	/**
	 * @ngdoc service
	 * @name boqMainImageProcessor
	 * @function
	 *
	 * @description
	 * The boqMainImageProcessor adds path to images for boqItems depending on there type.
	 */
	angular.module('boq.main').factory('boqMainImageProcessor', ['$log', 'boqMainLineTypes', function($log, boqMainLineTypes) {

		var service = {};

		/* jshint -W074 */ // I don't see a high cyclomatic complexity
		service.processItem = function processItem(boqItem) {
			if (!(boqItem && angular.isDefined(boqItem.BoqLineTypeFk))) {
				return '';
			}

			switch (boqItem.BoqLineTypeFk) {
				case 0: // This is a position
					boqItem.image = 'ico-boq-item';
					break;
				case 1: // The following nine cases represent the nine possible levels of divisions for which we have a single image at the moment
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
				case 8:
				case 9:
					boqItem.image = 'ico-folder-empty';
					break;
				case boqMainLineTypes.crbSubQuantity:
					boqItem.image = 'ico-boq-sub-description';
					break;
				case 103: // This is a root item
					boqItem.image = 'ico-folder-doc';
					break;
				case 105:
					boqItem.image = 'ico-boq-design-description';
					break;
				case 106:
					boqItem.image = 'ico-boq-textelement';
					break;
				case 107:
					boqItem.image = 'ico-boq-note';
					break;
				case 110:
					boqItem.image = 'ico-boq-sub-description';
					break;
				case 200:
				case 201:
				case 202:
				case 203:
					boqItem.image = 'ico-boq-markup-item';
					break;
				default:
					$log.debug('boqMainImageProcessor; processItem -> not handled line type -> no image assigned yet :' + boqItem.BoqLineTypeFk);
					break;
			}
		};

		return service;

	}]);
})();