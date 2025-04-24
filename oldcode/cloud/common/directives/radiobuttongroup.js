(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module('platform').directive('platformRadioButtonGroup', [function () {

		var template = '<div data-ng-repeat="radiobutton in controlOptions.options.radiobuttons"> \
                        <input type="radio" data-ng-disabled="!entity.Id" data-ng-model="entity[controlOptions.model]" value="{{radiobutton.value}}" ng-change="optionChanged()" />{{radiobutton.label}} \
                      </div>';

		return {
			restrict: 'A',
			replace: false,
			scope: {
				ngModel: '=',
				controlOptions: '=',
				entity: '='
			},
			template: template,
			link: linker
		};

		function linker(scope/*, element, attrs*/) {
			scope.optionChanged = function () {
				// console.log(scope.ngModel);
			};
		}
	}]);
})(angular);
