/**
 * Created by xia on 4/16/2018.
 */
(function (angular) {
	'use strict';

	angular.module('platform').directive('boqMainCompareOnLookup', function () {
		return {
			restrict: 'EA',
			// require: '^ngModel',
			scope: {
				ngModel: '=',
				options: '=',
				onSelectionChanged: '&',
				readonly: '='
			},
			controller: 'boqMainGenerateWicNumberController',
			template:
				'<div data-radiolistctrl data-ng-model="ngModel" data-options="options" on-selection-changed="onRadioGroupOptChanged(value)"></div>',
			link: {
				pre: function (scope) {
					scope.onRadioGroupOptChanged = function (value) {
						scope.onSelectionChanged(value);
					};
				}
			}

		};
	});

})(angular);
