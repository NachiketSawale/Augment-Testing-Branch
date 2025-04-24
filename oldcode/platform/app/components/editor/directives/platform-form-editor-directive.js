/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name platformEditor.directive:platformFormEditor.directive
	 * @description
	 * A wrapper around the platform-editor directive that can be used as an attribute and is, therefore,
	 * compatible with standard form configs. This is meant only as a temporary solution, to be removed
	 * as soon as the regular platform-editor directive works in forms again.
	 */
	angular.module('platform').directive('platformFormEditor', platformFormEditor);

	platformFormEditor.$inject = [];

	// noinspection OverlyComplexFunctionJS
	function platformFormEditor() {

		return {
			restrict: 'A',
			replace: false,
			template: '<div data-ng-style="{\'height\':containerHeight}"><platform-Editor data-ng-model="model" data-textarea-editable="true" data-textarea-height="100%"></platform-Editor></div>',
			scope: {
				model: '=',
				height: '<'
			},
			link: function (scope) {
				scope.containerHeight = scope.height ? scope.height + 'px' : '200px';
			}
		};
	}
})(angular);
