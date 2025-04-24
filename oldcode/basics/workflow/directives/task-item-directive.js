(function (angular) {
	'use strict';

	function taskItemDirective($compile, $templateCache) {
		return {
			restrict: 'A',
			link: function (scope, elem) {
				elem.append(angular.element($compile(angular.element($templateCache.get('basics.workflow/taskItem.html')))(scope)));
			}
		};
	}

	angular.module('basics.workflow').directive('basicsWorkflowTaskItemDirective', ['$compile', '$templateCache', taskItemDirective]);

})(angular);
