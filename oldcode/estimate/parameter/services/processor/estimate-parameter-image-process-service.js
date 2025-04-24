/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name estimateParamImageProcessor
	 * @function
	 *
	 * @description
	 * The estimateParamImageProcessor adds images to parameters
	 */
	angular.module('estimate.parameter').factory('estimateParamImageProcessor', [function () {
		let service = {};
		service.select = function processItem(item) {
			if (item) {
				let image = 'cloud.style/content/images/control-icons.svg#';
				image += 'ico-parameter';
				return image;
			}
		};
		return service;
	}]);
})(angular);
