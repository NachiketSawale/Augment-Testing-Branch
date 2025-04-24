(function () {
	'use strict';

	function basicsWorkflowActionEditorSelector($compile, $rootScope) {
		return {
			link: function (scope, element, attr) {
				var newScope = null;



				var renderFn = function () {
					if (newScope) {
						newScope.$destroy();
					}
					element.children().remove();
					if (scope.directive) {
						newScope = scope.$new();
						var generatedTemplate = '<div data-' + scope.directive +
							' data-ng-model="action" class="flex-box flex-column flex-element filler" data-locked="readOnly"></div>';
						element.append($compile(generatedTemplate)(newScope));
					}
				};

				$rootScope.$on('workflow:actionRepaired', renderFn);


				if (attr.basicsWorkflowActionEditorSelector) {
					scope.$watch(function () {
						return scope.action ? scope.action.id : null;
					}, renderFn);
				}
			}
		};
	}

	basicsWorkflowActionEditorSelector.$inject = ['$compile', '$rootScope'];

	angular.module('basics.workflow').directive('basicsWorkflowActionEditorSelector', basicsWorkflowActionEditorSelector);
})();
