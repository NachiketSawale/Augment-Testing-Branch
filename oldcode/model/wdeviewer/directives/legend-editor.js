/**
 * Created by wui on 11/5/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).directive('legendEditor', [
		function () {
			return {
				templateUrl: globals.appBaseUrl + 'model.wdeviewer/templates/legend-editor.html',
				restrict: 'A',
				scope: {
					entity: '=',
					config: '='
				},
				controller: ['$scope', 'platformTranslateService', function ($scope, platformTranslateService) {
					var activeSection = 'left';

					function format(item) {
						// return item.title + ': ' + item.value;
						return item.value;
					}

					$scope.select = function (item) {
						if (!$scope.entity[activeSection]) {
							$scope.entity[activeSection] = format(item);
						} else {
							$scope.entity[activeSection] += ' | ' + format(item);
						}
					};

					$scope.focus = function (section) {
						activeSection = section;
					};

					platformTranslateService.translateObject($scope.config);
				}]
			};
		}
	]);

})(angular);