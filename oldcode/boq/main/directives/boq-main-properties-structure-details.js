/**
 * Created by joshi on 08.07.2014.
 */

(function () {

	/* global */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name boqMainBoqStructureDetails..(SlickGrid2)
	 * @requires
	 * @description
	 */
	angular.module('boq.main').directive('boqMainBoqStructureDetails', function () {

		return {
			restrict: 'A',

			scope: {
				ngModel: '='
			},
			templateUrl: window.location.pathname + '/boq.main/templates/boq-properties-structure-details.html',
			link: function (/* scope, ele, attrs */) {
			}
		};

	});

})();
