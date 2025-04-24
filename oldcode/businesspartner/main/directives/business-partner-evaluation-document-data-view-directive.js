/**
 * Created by ada on 2017/8/18.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'businesspartner.main';

	/**
	 * @ngdoc directive
	 * @name businessPartnerEvaluationDocumentDataViewDirective
	 * @description
	 */
	angular.module(moduleName).directive('businessPartnerEvaluationDocumentDataViewDirective', [function () {

		return {
			restrict: 'A',

			scope: {
				ngModel: '='
			},
			templateUrl: globals.appBaseUrl + 'businesspartner.main/partials/screen-business-partner-evaluation-document-data-view.html',
			// eslint-disable-next-line no-unused-vars
			link: function (scope, ele, attrs) { // jshint ignore:line
			}
		};

	}]);

})(angular);

