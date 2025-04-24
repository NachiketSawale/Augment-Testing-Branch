/**
 * @ngdoc directive
 * @name constructionsystem.common.directive:cosCommonDisableOverlay
 * @element div
 * @restrict A
 * @priority default value
 * @scope isolate scope
 * @description
 * Show a overlay to disable area.
 *
 * @example
 * <div cos-common-disable-overlay data-show="isShow" data-info="showInfo"></div>;
 */
(function () {
	'use strict';
	var moduleName = 'constructionsystem.common';
	angular.module(moduleName).directive('cosCommonDisableOverlay', ['$compile',
		function ($compile) {
			return {
				restrict: 'A',
				scope: {
					show: '=',
					info: '=',
					active: '='
				},

				controller: ['$scope', function ($scope) {
					$scope.onClick = function () {
						$scope.active = true;
					};
				}],

				link: function (scope, elem) {
					var content = '<div ng-if="show" class="wait-overlay {{cssClass}}" ' +
						' style="background-color:white; opacity: 0" >' +
						'<button style="vertical-align: middle;display: none;" data-ng-click="onClick();"  >' +
						'<span ng-if="info" style="color:#0067b1; font-weight: bold;" data-ng-bind="info">' +
						'</span>' +
						'</button>' +
						'</div>';
					elem.replaceWith($compile(content)(scope));
				}
			};
		}]
	);
})();
