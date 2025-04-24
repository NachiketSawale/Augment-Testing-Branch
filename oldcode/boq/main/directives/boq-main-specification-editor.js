/**
 * Created by reimer on 08.12.2016
 */
(function () {

	/* global */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name
	 * @description
	 */
	angular.module('boq.main').directive('boqMainSpecificationEditor', [
		function() {
			var template = '<textarea class="flex-element form-control noresize" ng-model="entity.Content" ng-readonly="readonly"></textarea>';

			return {
				restrict: 'A',
				scope: {
					ngModel: '=',
					ngChange: '&',
					entity: '=',
					addTextComplement: '=', // changes force directive to add a text complement at the current pos
					selectTextComplement: '=',
					readonly: '=',
					options: '='
				},
				template: template,
				link: linker
			};

			function linker(scope) {  // jshint ignore:line
				if (!scope.options.cursorPos) {
					scope.cursorPos = { get: 0 };
				}
			}
		}
	]);
})();
