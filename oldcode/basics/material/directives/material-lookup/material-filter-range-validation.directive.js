(function (angular) {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).directive('materialFilterRangeValidation', function () {
		return {
			require: 'ngModel',
			link: function (scope, element, attrs, ngModelController) {
				const isMinValue = attrs.name === 'min';
				const isMaxValue = attrs.name === 'max';

				if (isMinValue) {
					scope.minNgModelController = ngModelController;
				}

				if (isMaxValue) {
					scope.maxNgModelController = ngModelController;
				}

				function isIdentical(a, b) {
					if (moment.isMoment(a) && moment.isMoment(b)) {
						return a.isSame(b);
					}

					return a === b;
				}

				// Custom validation logic
				ngModelController.$validators.custom = function (modelValue, viewValue) {
					scope.setRangeError(null);

					if (ngModelController.$isEmpty(modelValue)) {
						// Consider empty models to be valid
						return true;
					}

					if (isMinValue) {
						const maxValue = scope.definition.Factors[1];

						scope.minValidity = true;

						if (viewValue > maxValue) {
							scope.minValidity = false;
							scope.setRangeError(attrs.error);
						} else if (isIdentical(viewValue, maxValue)) {
							scope.minValidity = false;
							scope.setRangeError(attrs.identicalError);
						}

						ngModelController.$setValidity('validMin', scope.minValidity);

						if (!scope.maxValidity) {
							scope.maxNgModelController.$validate();
						}

						return true;
					}

					if (isMaxValue) {
						const minValue = scope.definition.Factors[0];

						scope.maxValidity = true;

						if (viewValue < minValue) {
							scope.maxValidity = false;
							scope.setRangeError(attrs.error);
						} else if (isIdentical(viewValue, minValue)) {
							scope.maxValidity = false;
							scope.setRangeError(attrs.identicalError);
						}

						ngModelController.$setValidity('validMax', scope.maxValidity);

						if (!scope.minValidity) {
							scope.minNgModelController.$validate();
						}

						return true;
					}

					return true;
				};

				// Watch for changes and re-validate
				scope.$watch(attrs.ngModel, function () {
					ngModelController.$validate();
				});
			}
		};
	});

})(angular);