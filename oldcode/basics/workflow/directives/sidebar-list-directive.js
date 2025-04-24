(function (angular) {
	'use strict';

	function basicsWorkflowSidebarListDirective() {
		return {
			restrict: 'A',
			scope: {
				listFns: '=',
				itemTemplate: '@',
				itemDetailTemplate: '@',
				headerTemplate: '@',
				groupProperties: '=',
				filterProperties: '='
			},
			templateUrl: 'basics.workflow/sidebarList.html',
			link: function (scope) {
				scope.clickFn = function () {
					console.log('click ctrl');
				};
			},
			controller: function () {

			}
		};

	}

	angular.module('basics.workflow')
		.directive('basicsWorkflowSidebarListDirective', basicsWorkflowSidebarListDirective);

})(angular);
