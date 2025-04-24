(function () {
	'use strict';

	function basicsWorkflowMessageBoxActionDirective(_) {
		return {
			restrict: 'A',
			require: 'ngModel',
			compile: function compile() {
				return function postLink(scope, elem, attrs, ngModelCtrl) {

					ngModelCtrl.$render = function () {
						scope.message = _.find(ngModelCtrl.$viewValue.task.input, {key: ngModelCtrl.$viewValue.task.action.input[0]}).value;
					};

				};
			},
			template: '<span data-ng-bind="message"></span>'
		};
	}

	basicsWorkflowMessageBoxActionDirective.$inject = ['_'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowMessageBoxActionDirective', basicsWorkflowMessageBoxActionDirective);

})();
