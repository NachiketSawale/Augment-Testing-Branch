/* eslint-disable no-unused-vars */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'businesspartner.main';

	/**
	 * @ngdoc directive
	 * @name businessPartnerEvaluationGroupDataViewDirective
	 * @description
	 */
	angular.module(moduleName).directive('businessPartnerEvaluationGroupDataViewDirective', function () {

		return {
			restrict: 'A',

			scope: {
				ngModel: '='
			},
			templateUrl: globals.appBaseUrl + 'businesspartner.main/partials/screen-business-partner-evaluation-group-data-view.html',
			link: function (scope, ele, attrs) { // jshint ignore:line
			}
		};

	});

})(angular);
