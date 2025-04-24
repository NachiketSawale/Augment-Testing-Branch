/**
 * Created by wui on 2/25/2020.
 */

(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).controller('modelWdeViewerRecalibrateController', ['$scope', 'context',
		function ($scope, context) {
			$scope.isLoading = false;
			$scope.forecast = context.forecast;

			if (context.clientSide) {
				$scope.apply = function () {
					$scope.$close({
						ok: true,
						context: context
					});
				};
			} else {
				$scope.apply = function () {
					$scope.isLoading = true;
					$scope.loadingInfo = 'Recalibrating';
					context.service.recalibrate(context.context, context.data).then(function () {
						$scope.$close({
							ok: true
						});
					}).finally(function () {
						$scope.isLoading = false;
					});
				};
			}
		}
	]);

})(angular);