(function (angular) {
	'use strict';
	let moduleName = 'basics.common';

	function sidebarNotificationButton($compile, $rootScope) {
		return {
			restrict: 'A',
			link: function (scope, elem) {
				function updateView(isUnseenNotificationAvailable) {
					if(elem.hasClass('notification-alert')){
						elem.removeClass('notification-alert');
					}

					if(isUnseenNotificationAvailable){
						elem.addClass('notification-alert');
					}
				}

				let taskCountChanged = $rootScope.$on('sidebar:unseenNotificationsCountChanged', function (event, isUnseenNotificationAvailable) {
					updateView(isUnseenNotificationAvailable);
				});

				scope.$on('$destroy', function () {
					taskCountChanged();
				});

			}
		};
	}

	angular.module(moduleName).directive('basicsSidebarNotificationButton', ['$compile', '$rootScope', sidebarNotificationButton]);
})(angular);