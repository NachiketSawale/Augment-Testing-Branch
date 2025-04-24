(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module('platform').directive('platformLocalizedTextInput', [function () {

		//var template = '<input type="text" ng-model="ngModel.Translated" ng-class="controlOptions.actAsCellEditor ? \'editor-text\' : \'form-control\'" maxlength="{{maxlength}}"  \
		//                data-ng-readonly="controlOptions.readonly || !entity.Id" data-tabstop="{{controlOptions.tabStop}}" data-enterstop="{{controlOptions.enterStop}}" \
		//                rib-validation-method="controlOptions.validationMethod(controlOptions.model, value)" \
		//                title="{{entity.errors[controlOptions.model] | platformLocalizedErrormessage}}" \
		//                ng-change="onChange()" style="{{controlOptions.style}}" onfocus="this.select()" \
		//                 />';

		var template = '<input type="text" ng-model="ngModel.Translated" ng-class="controlOptions.actAsCellEditor ? \'editor-text\' : \'form-control\'" maxlength="{{maxlength}}"  \
                      data-ng-readonly="controlOptions.readonly || !entity.Id" data-tabstop="{{controlOptions.tabStop}}" data-enterstop="{{controlOptions.enterStop}}" \
                      rib-validation-method="tempValidationMethod(controlOptions.model, value)" \
                      title="{{entity.errors[controlOptions.model] | platformLocalizedErrormessage}}" \
                      ng-change="onChange()" style="{{controlOptions.style}}" onfocus="this.select()" \
                       />';

		// todo "actAsCellEditor" should be automatically detected

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
			if (angular.isObject(scope.ngModel) === false) {
				//throw new Error("ngModel must be an object with at least the following properties: Description, Modified");
			}

			// todo: remove attribute from template instead setting it to 1024
			scope.maxlength = 1024;

			scope.tempValidationMethod = function (model, value) {
				if (scope.controlOptions.validationMethod) {
					return scope.controlOptions.validationMethod(model + '.Translated', value);
				}
			};

			scope.onChange = function () {
				// if there a new input
				if (scope.ngModel.DescriptionTr === null && scope.ngModel.VersionTr === 0) {
					scope.ngModel.Description = scope.ngModel.Translated;
				}
				scope.ngModel.Modified = true;
			};
		}
	}]);
})(angular);
