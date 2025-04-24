/**
 * Created bu liz on 8/4/2018
 */
(function (angular) {
	'use strict';
	var moduleName = 'cloud.desktop';
	angular.module(moduleName).directive('cloudDesktopChatBotFormatDate', ['$filter', function ($filter) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem, attr, ngModelCtrl) {
				ngModelCtrl.$formatters.push(function (modelValue) {
					if (modelValue) {
						return new Date(modelValue);
					}
				});

				ngModelCtrl.$parsers.push(function (value) {
					if (value) {
						return $filter('date')(value, 'yyyy-MM-dd');
					}
				});
			}
		};
	}]);
	angular.module(moduleName).directive('cloudDesktopChatBotFormatTime', ['$filter', function ($filter) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem, attr, ngModelCtrl) {
				ngModelCtrl.$formatters.push(function (modelValue) {
					if (modelValue) {
						return new Date('1970-01-01 ' + modelValue);
					}
				});
				ngModelCtrl.$parsers.push(function (value) {
					if (value) {
						return $filter('date')(value, 'HH:mm');
					}
				});
			}
		};
	}]);
})(angular);