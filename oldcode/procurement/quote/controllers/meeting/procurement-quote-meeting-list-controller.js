/**
 * Created by yanga on 10/08/2022.
 */

(function (angular) {
	'use strict';
	let moduleName = 'procurement.quote';

	angular.module(moduleName).controller('procurementQuoteMeetingListController',
		['_', '$scope', 'platformGridControllerService', 'basicsMeetingUIStandardService', 'procurementQuoteMeetingService', 'basicsMeetingValidationService',
			function (_, $scope, platformGridControllerService, columnsService, dataService, validationService) {

				platformGridControllerService.initListController($scope, columnsService, dataService, validationService(dataService), {});

				$scope.tools.items = _.filter($scope.tools.items,function (d) {
					return  d.id !=='t14';
				});

				$scope.setTools = function (tools) {
					$scope.tools.items = _.filter(tools.items,function (d) {
						return  d.id !=='t14';
					});

					tools.update = function () {
						tools.version += 1;
					};
					$scope.tools.update();
				};

				$scope.tools.update();

				// un-register on destroy
				$scope.$on('$destroy', function () {
				});
			}
		]);
})(angular);
