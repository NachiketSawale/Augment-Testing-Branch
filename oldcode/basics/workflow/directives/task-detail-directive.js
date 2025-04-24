(function (angular) {
	'use strict';

	function taskDetailDirective($compile, _) {
		return {
			replace: true,
			require: 'ngModel',
			link: function (scope, ele, attrs, ngModelCtrl) {
				var newScope = null;

				ngModelCtrl.$render = function () {
					scope.task = ngModelCtrl.$viewValue;
					if (scope.task) {
						scope.response = {
							task: scope.task,
							Context: scope.task.Context,
							Result: false
						};
					}
				};

				createDom(ngModelCtrl.$viewValue);

				scope.$watch(function () {
					return scope.task;
				}, createDom);

				scope.$watch(function () {
					return scope.response;
				}, function (newVal, oldVal) {
					if (newVal && newVal !== oldVal) {
						scope.task.Context = newVal.Context;
						scope.task.Result = newVal.Result;
						ngModelCtrl.$setViewValue(scope.task);
					}
				}, true);

				function createDom(newVal) {
					if (newVal) {
						var action = newVal.Action;

						if (action) {
							for (var i = 0; i < angular.element(ele).children().length; i++) {
								angular.element(ele).children()[i].remove();
							}
							if (newScope) {
								newScope.$destroy();
							}
							if (action.directive) {
								newScope = scope.$new();
								ele.append($compile('<div ' + _.kebabCase(action.directive) + ' class="flex-element workflow-task-detail" data-ng-model="response"></div>')(newScope));
							}
						}
					}

				}

			}
		};
	}

	angular.module('basics.workflow')
		.directive('basicsWorkflowTaskDetailDirective', ['$compile', '_', taskDetailDirective]);
})(angular);
