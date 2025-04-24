(function (angular) {
	'use strict';

	angular.module('platform').directive('platformAlert', function () {
		function link(scope) {
			if (angular.isUndefined(scope.error)) {
				scope.error = {};
			}
			if (angular.isUndefined(scope.error.iconCol)) {
				scope.error.iconCol = 0;
			}
			if (angular.isUndefined(scope.error.icon)) {
				scope.error.iconCol = 3;
			}
			if (angular.isUndefined(scope.error.messageCol)) {
				scope.error.messageCol = 0;
			}

			var remove = scope.$watch('error.type', function (value) {
				switch (value) {
					case 0:
						scope.alertclass = 'alert-success';
						break;
					case 1:
						scope.alertclass = 'alert-info';
						break;
					case 2:
						scope.alertclass = 'alert-warning';
						break;
					case 3:
						scope.alertclass = 'alert-danger';
						break;
					default:
						scope.alertclass = 'alert-danger';
						break;
				}
			});

			scope.$on('$destroy', function (/* args */) {
				remove();
			});
		}

		return {
			templateUrl: globals.appBaseUrl + 'app/templates/alert.html',
			restrict: 'AE',
			replace: true,
			scope: {
				error: '='
			},
			link: link
		};
	});
})(angular);