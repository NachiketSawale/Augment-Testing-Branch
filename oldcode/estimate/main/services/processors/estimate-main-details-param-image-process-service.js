/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainDetailsParamImageProcessor
	 * @function
	 *
	 * @description
	 * The processor adds images according to availability of parameter item.
	 */
	angular.module(moduleName).factory('estimateMainDetailsParamImageProcessor', [function () {

		let service = {};

		service.select = function (item) {
			if (item) {
				let image = 'cloud.style/content/images/';
				if(item.SameCodeButNoConlict){
					image += 'control-icons.svg#ico-grid-warning-yellow';
				}else if(item.Version>0){
					image += 'control-icons.svg#ico-tick';
				}else{
					image +='control-red-icons.svg#ico-minus';
				}

				return image;
			}
		};

		return service;

	}]);
})(angular);
