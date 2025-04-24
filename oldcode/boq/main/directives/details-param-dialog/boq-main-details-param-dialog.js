/**
 * Created by zos on 3/15/2018.
 */

(function () {

	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name boqMainDetailsParamDialog
	 * @requires
	 * @description
	 */
	var moduleName = 'boq.main';
	angular.module(moduleName).directive('boqMainDetailsParamDialog', function () {
		return {
			restrict: 'A',
			templateUrl: globals.appBaseUrl + 'boq.main/templates/details-parameters-dialog/boq-main-details-param-list.html'
		};
	});
})();
