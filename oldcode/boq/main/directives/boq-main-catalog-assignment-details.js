/**
 * Created by benny on 12.06.2017.
 */

(function () {

	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name boqMainCatalogAssignDetails..(SlickGrid2)
	 * @description
	 */
	angular.module('boq.main').directive('boqMainCatalogAssignDetails', function () {

		return {
			restrict: 'A',
			scope: {
				ngModel: '='
			},
			templateUrl: globals.appBaseUrl + '/boq.main/templates/boq-main-catalog-assign-details.html',
			link: function (/* scope, ele, attrs */) {
			}
		};

	});

})();
