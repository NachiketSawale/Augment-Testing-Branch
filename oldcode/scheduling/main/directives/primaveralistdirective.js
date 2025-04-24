/**
 * Created by csalopek on 13.11.2017.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name primaveraListDirective
	 * @description handle EPS/Project structure function for Primavera
	 */
	angular.module('scheduling.main').directive('primaveraListDirective', function () {

		return {
			restrict: 'A',
			scope: true,
			templateUrl: window.location.pathname + '/scheduling.main/templates/primaveralist.html',
			controller: 'schedulingPrimaveraListController'
		};
	});
})(angular);
