(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module('platform').directive('platformTextInput', [function () {

//      var template = '<input type="text" ng-model="ngModel" class="form-control" maxlength="{{maxlength}}"  \
//                      data-ng-readonly="controlOptions.readonly || false" data-tabstop="{{controlOptions.tabStop}}" data-enterstop="{{controlOptions.enterStop}}" \
//                      rib-validation-method="controlOptions.validationMethod(controlOptions.model, value)" \
//                      title="{{entity.errors[controlOptions.model][0] | platformLocalizedErrormessage}}" \
//                       />';

		var template = '<input type="text" ng-model="ngModel" ng-class="controlOptions.actAsCellEditor ? \'editor-text\' : \'form-control\'" maxlength="{{maxlength}}"  \
                      data-ng-readonly="controlOptions.readonly || !entity.Id" data-tabstop="{{controlOptions.tabStop}}" data-enterstop="{{controlOptions.enterStop}}" \
                      rib-validation-method="controlOptions.validationMethod(controlOptions.model, value)" \
                      title="{{entity.errors[controlOptions.model] | platformLocalizedErrormessage}}" \
                      style="{{controlOptions.style}}" onfocus="this.select()" \
                      ng-change="ngChange()" \
                       />';

		// todo "actAsCellEditor" should be automatically detected

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

		function linker(scope/*, element, attrs, controller*/) {

			// todo: remove attribute from template instead setting it to 1024
			scope.maxlength = 1024;

			if (scope.controlOptions.options) {
				switch (scope.controlOptions.options.subtype) {

					case 'code':
						scope.maxlength = 16;
						break;
					case 'description':
						scope.maxlength = 42;
						break;
					default:
						break;
				}
			}
		}

	}]);

})(angular);
