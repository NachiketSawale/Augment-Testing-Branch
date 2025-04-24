/**
 * Created by baf on 2022/10/27
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name projectMainPhaseSelectionGridDirective
	 * @requires angular
	 * @description
	 */
	angular.module('project.main').directive('projectMainPhaseSelectionGridDirective', ProjectMainPhaseSelectionGridDirective);

	function ProjectMainPhaseSelectionGridDirective() {
		return {
			restrict: 'A',
			scope: { ngModel: '=' },
			templateUrl: globals.appBaseUrl + 'app/components/modaldialog/modal-form-sub-grid-template.html',
			controller: 'projectMainPhaseSelectionGridController'
		};
	}
})(angular);
