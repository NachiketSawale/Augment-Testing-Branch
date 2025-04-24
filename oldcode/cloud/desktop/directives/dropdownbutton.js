(function (angular, globals) {
	'use strict';

	angular.module('cloud.desktop').directive('cloudDesktopDropdownButton', [function () {
		return {
			restrict: 'A',
			scope: {
				dropdownButton: '='
			},
			templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/dropdownbutton.html',
			link: function (scope) {

				scope.status = {
					isopen: false
				};

				// used in sidebar-searchform
				if (scope.dropdownButton.hasOwnProperty('disabled')) {
					scope.disabled = scope.dropdownButton.disabled;
				}

				scope.toggled = function (open) {// jshint ignore:line
				};

				scope.toggleDropdown = function ($event) {
					$event.preventDefault();
					$event.stopPropagation();
					scope.status.isopen = !scope.status.isopen;
				};
			}
		};
	}]);
})(angular, globals);

