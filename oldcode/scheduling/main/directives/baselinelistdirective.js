/**
 * Created by leo on 17.08.2015.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name boqMainSpecificStructure
	 * @description handle edit structure function on Button click event
	 */
	angular.module('boq.main').directive('baselineListDirective', function () {

		return {
			restrict: 'A',
			scope: true,
			templateUrl: window.location.pathname + '/scheduling.main/templates/baselinelist.html',
			controller: 'schedulingLookupBaselineListController'
		};
	});
})(angular);
