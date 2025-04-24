/**
 * @ngdoc directive
 * @name platform.directive:platformStatusBar
 * @element div
 * @restrict A
 * @priority default value
 * @scope isolate scope
 * @description
 * Status bar in container
 * Show the container status like "1 of 3 records"
 *
 * @example
 <doc:example>
 <doc:source>
 <div data-platform-status-bar data-status="statusInfo()" />
 </doc:source>
 </doc:example>
 */
(function (angular) {
	'use strict';

	angular.module('platform').directive('platformFormStatusBar', platformFormStatusBar);

	platformFormStatusBar.$inject = [];

	function platformFormStatusBar() {
		return {
			restrict: 'A',
			replace: true,
			template: '<div class="platform-form-status-bar"><label ng-bind="status"></label></div>',
			scope: {
				status: '='
			}
		};
	}
})(angular);