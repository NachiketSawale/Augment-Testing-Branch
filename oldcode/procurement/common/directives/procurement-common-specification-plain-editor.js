/**
 * Created by chi on 09.06.2023
 */
(function () {

	/* global */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name
	 * @description
	 */
	angular.module('procurement.common').directive('procurementCommonSpecificationPlainEditor', [
		function() {
			var template = '<textarea class="flex-element form-control noresize" ng-model="entity.Content" ng-readonly="readonly"></textarea>';

			return {
				restrict: 'A',
				scope: {
					ngModel: '=',
					entity: '=',
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
