(function (angular) {

	'use strict';

	/**
	 * provides an angular directive to validate input fields against a json schema
	 * example:
	 * <input name="InputFirstName" ng-model="person.FirstName" rib-validation-method="validateModel(model, value)"
	 * will call the 'validateModel' method in the current controller and pass the 'ng-model' and 'value' as parameter
	 *
	 * thanks to: http://www.benlesh.com/2012/12/angular-js-custom-validation-via.html
	 **/

	angular.module('platform').directive('ribValidationMethod', function () {

		return {
			// restrict to an attribute type.
			restrict: 'A',

			// element must have ng-model attribute.
			require: 'ngModel',

			// refers to the validation method inside the controller
			scope: {
				ribValidationMethod: '&'
			},

			// scope = the isolated scope
			// elemement = the element the directive is on
			// attrs = a dictionary of attributes on the element
			// controller = the controller for ngModel.
			link: function (scope, element, attrs, ngModel) {

				// add a parser that will process each time the value is parsed into the model when the user updates it.
				ngModel.$parsers.unshift(function (value) {

					//// update model - not yet
					//var getter = $parse(attrs.ngModel);
					//var setter = getter.assign;
					//setter(scope.$parent, value);

					// call controller test method
					// var valid = scope.ribValidationMethod({ model: attrs.ngModel, value: value });
					var valid = scope.ribValidationMethod({model: ngModel, value: value});
					// test and set the validity after update.
					ngModel.$setValidity('model', valid);

					// if it's valid, return the value to the model,
					// otherwise return undefined.
					// return valid ? value : undefined;
					return value;   // model will always be updated

				});
			}
		};
	});

})(angular);
