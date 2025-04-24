(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 */
	angular.module('platform').directive('platformTextareaInput', [function () {

		//var template = '<textarea ng-model="ngModel" class="form-control" maxlength="{{maxlength}}" rows="{{rows}}" \
		//                data-ng-readonly="controlOptions.readonly || false" \
		//                data-tabstop="{{controlOptions.tabStop}}" data-enterstop="{{controlOptions.enterStop}}" \
		//                rib-validation-method="controlOptions.validationMethod(controlOptions.model, value)" \
		//                title="{{entity.errors[controlOptions.model][0] | platformLocalizedErrormessage}}" \
		//                ng-class="controlOptions.actAsCellEditor ? \'editor-text\' : \'form-control\'" \
		//                style="{{controlOptions.style}}" \
		//                 />';

		var template = '<textarea ng-model="ngModel" maxlength="{{maxlength}}" rows="{{rows}}" \
                      data-ng-readonly="controlOptions.readonly || !entity.Id" \
                      data-tabstop="{{controlOptions.tabStop}}" \
                      data-enterstop="{{controlOptions.enterStop}}" \
                      rib-validation-method="controlOptions.validationMethod(controlOptions.model, value)" \
                      title="{{entity.errors[controlOptions.model] | platformLocalizedErrormessage}}" \
                      ng-class="controlOptions.actAsCellEditor ? \'editor-text\' : \'form-control\'" \
                      ng-change="ngChange()" \
                      onfocus="this.select()" \
                      style="{{controlOptions.style}}" \
                       />';

		return {

			restrict: 'A',

			// require: '?ngModel',

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

					case 'comment':
						scope.maxlength = 255;
						scope.rows = 4;
						break;
					case 'remark':
						scope.maxlength = 2000;
						scope.rows = 6;
						break;
					default:
						scope.rows = 4;
						break;
				}
			}

		}

	}]);

})(angular);

