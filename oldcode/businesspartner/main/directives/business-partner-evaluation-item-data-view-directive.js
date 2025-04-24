(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals, */
	let moduleName = 'businesspartner.main';

	/**
	 * @ngdoc directive
	 * @name businessPartnerEvaluationItemDataViewDirective
	 * @description
	 */
	angular.module(moduleName).directive('businessPartnerEvaluationItemDataViewDirective', [function () {

		return {
			restrict: 'A',

			scope: {
				ngModel: '='
			},
			templateUrl: globals.appBaseUrl + 'businesspartner.main/partials/screen-business-partner-evaluation-item-data-view.html',
			// eslint-disable-next-line no-unused-vars
			link: function (scope, ele, attrs) { // jshint ignore:line
			}
		};

	}]);

})(angular);
