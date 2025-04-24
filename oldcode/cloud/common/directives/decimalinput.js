(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @description Input box that displays and accepts values concerning the users locale settings
	 */
	angular.module('platform').directive('platformDecimalInput', ['$parse', 'platformObjectHelper', function ($parse, platformObjectHelper) {

		var template = '<input type="text" ng-model="tempValue" ng-blur="onBlur()" \
                             ng-class="controlOptions.actAsCellEditor ? \'editor-text\' : \'form-control\'" \
                             data-ng-readonly="controlOptions.readonly || !entity.Id" class="text-right" \
                             rib-validation-method="tempValidationMethod(controlOptions.model, value)" \
                             title="{{entity.errors[controlOptions.model] | platformLocalizedErrormessage}}" \
                             onfocus="this.select()" \
                             ng-change="ngChange()" \
                             style="{{controlOptions.style}}" \
                     />';

		return {

			restrict: 'A',

			replace: false,

			scope: {
				ngModel: '=',
				controlOptions: '=',
				entity: '=',
				ngChange: '&'
			},

			template: template,

			link: linker

		};

		function linker(scope, element/*, attrs, controller*/) {

			var navigationKeys = [13, 27];// ENTER ESC
			var validKeys = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 44, 46, 43, 45];// 0-9 , . , + -

			element.bind('keypress', function (e) {
				// relay navigation keys
				if (navigationKeys.indexOf(e.keyCode) === -1)// not in array
				{
					// ignore invalid keys
					if (validKeys.indexOf(e.keyCode) === -1)// not in array
					{
						e.preventDefault();
						return;
					}
				}
			});

			var fractionDigits = 2; // default
			if (angular.isDefined(scope.controlOptions.options)) {
				if (scope.controlOptions.options) {

					switch (scope.controlOptions.options.subtype) {
						case 'quantity':
							fractionDigits = 3;
							break;
						case 'exchange':
							fractionDigits = 5;
							break;
						case 'factor':
							fractionDigits = 6;
							break;
						default:
							break;
					}
				}
			}

			// initialize tempValue
			scope.tempValue = 0;

			// refresh temp value
			scope.$watch('ngModel', function (newValue/*, oldValue*/) {

				// scope.tempValue = newValue ? newValue.toUserLocaleNumberString(fractionDigits) : '';

				// if (angular.isNumber(n)) {       // NaN is a number for angular ?
				if ($.isNumeric(newValue)) {
					scope.tempValue = newValue.toUserLocaleNumberString(fractionDigits);
				} else {
					scope.tempValue = newValue;
				}
			});

			scope.tempValidationMethod = function (model, value) {
				var n = value.parseUserLocaleNumber(); // try to convert value into a number
				return scope.controlOptions.validationMethod(model, n);
			};

			scope.onBlur = function () {
				// console.log("platformDecimalInput: onBlur");
				updateModel();
			};

			// using directive inside slickgrid doesn't fire onBlur  when leaving with enter or tab?
			element.on('$destroy', function () {
				updateModel();
			});

			function updateModel() {

				if (angular.isDefined(scope.entity) && scope.entity !== null && scope.tempValue) {

					// convert temporary edit field into a number
					var n = scope.tempValue.parseUserLocaleNumber();
					// format temporary edit field
					scope.tempValue = n.toUserLocaleNumberString(fractionDigits);
					// update entity
					platformObjectHelper.setValue(scope.entity, scope.controlOptions.model, n);
				}
			}
		}

	}]);

})(angular);
