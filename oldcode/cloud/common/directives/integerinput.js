(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module('platform').directive('platformIntegerInput', ['$parse', 'platformObjectHelper', function ($parse, platformObjectHelper) {

		var template = ['<input type="text" ng-model="ngModel" ng-blur="onBlur()" class="text-right" ',
			'data-tabstop="{{controlOptions.tabStop}}" data-enterstop="{{controlOptions.enterStop}}" ',
			'rib-validation-method="tempValidationMethod(controlOptions.model, value)" ',
			'data-ng-readonly="controlOptions.readonly || !entity.Id" ',
			'title="{{entity.errors[controlOptions.model] | platformLocalizedErrormessage}}" ',
			'style="{{controlOptions.style}}" onfocus="this.select()" ',
			'ng-class="controlOptions.actAsCellEditor ? \'editor-text\' : \'form-control\'"  ',
			'ng-change="ngChange()" ',
			'/>'].join('');

		return {
			restrict: 'A',
			scope: {
				ngModel: '=',
				controlOptions: '=',
				entity: '=',
				ngChange: '&'
			},
			template: template,
			link: linker
		};

		function linker(scope, element) {

			var navigationKeys = [13, 27];	// ENTER ESC
			var validKeys = [43, 45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];	// + -  0-9

			element.bind('keypress', function (e) {
				// console.log(e.keyCode);
				// relay navigation keys
				if (navigationKeys.indexOf(e.keyCode) === -1)	// not in array
				{
					// ignore invalid keys
					if (validKeys.indexOf(e.keyCode) === -1)	// not in array
					{
						e.preventDefault();
						return;
					}
				}
			});

			scope.tempValidationMethod = function (model, value) {

				// try convert the value into a number
				var n = value.parseUserLocaleNumber();
				return scope.controlOptions.validationMethod(model, n);
			};

			scope.onBlur = function () {
				// return a number
				if (scope.ngModel) {
					var n = scope.ngModel.parseUserLocaleNumber();
					// controller.$setViewValue(n);
					platformObjectHelper.setValue(scope.entity, scope.controlOptions.model, n);
				}
			};
		}
	}]);
})(angular);
