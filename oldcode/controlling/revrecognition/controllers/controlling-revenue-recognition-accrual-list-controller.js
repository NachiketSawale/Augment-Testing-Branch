/**
 * Created by alm on 9/29/2021.
 */

(function (angular) {
	'use strict';

	var moduleName = 'controlling.revrecognition';

	angular.module(moduleName).controller('controllingRevenueRecognitionAccrualListController',
		['$scope', '_', 'platformGridAPI', 'platformGridControllerService', 'controllingRevenueRecognitionAccrualService', 'controllingRevenueRecognitionAccrualUIStandardService',
			function ($scope, _, platformGridAPI, platformGridControllerService, dataService, uiService) {

				var myGridConfig = {
					initCalled: false,
					columns: []
				};

				platformGridControllerService.initListController($scope, uiService, dataService, {}, myGridConfig);


				$scope.$on('$destroy', function () {

				});
			}
		]);
})(angular);
