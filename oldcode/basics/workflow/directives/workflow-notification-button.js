/*globals angular */
(function (angular) {
	'use strict';
	var moduleName = 'basics.workflow';

	function workflowNotificationButton($compile, $rootScope) {
		var taskNotificationIcon = 'ico-task-notification';
		var taskDefaultIcon = 'ico-task';

		return {
			restrict: 'A',
			link: function (scope, elem) {
				function updateView(taskAvailable) {
					var svgImage = taskAvailable ? taskNotificationIcon : taskDefaultIcon;
					var content = '<svg data-cloud-desktop-svg-image data-sprite="sidebar-icons" data-image="' + svgImage + '"></svg>';

					elem.children('svg').replaceWith($compile(content)(scope));
				}

				// event is fired in workflow instance service
				var taskCountChanged = $rootScope.$on('workflow:taskCountChanged', function (event, taskCount) {
					updateView(taskCount !== 0);
				});

				scope.$on('$destroy', function () {
					taskCountChanged();
				});
			}
		};
	}

	angular.module(moduleName)
		.directive('basicsWorkflowNotificationButton', ['$compile', '$rootScope', workflowNotificationButton]);
})(angular);
