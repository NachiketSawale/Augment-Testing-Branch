(function() {
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainPriceAdjustmentTotalController', ['_', '$scope', '$timeout', 'platformGridControllerService',
		'estimateMainPriceAdjustmentTotalDataService', 'estMainPriceAdjustmentTotalUIConfigurationService','estimateMainPriceAdjustmentTotalValidationService',
		function (_, $scope, $timeout, platformGridControllerService, estimateMainPriceAdjustmentTotalDataService, estMainPriceAdjustmentTotalUIConfigurationService,estimateMainPriceAdjustmentTotalValidationService) {

			let myGridConfig = {
				initCalled: false,
				columns: [],
				cellChangeCallBack:function cellChangeCallBack() {
				},
			};

			platformGridControllerService.initListController($scope, estMainPriceAdjustmentTotalUIConfigurationService, estimateMainPriceAdjustmentTotalDataService, estimateMainPriceAdjustmentTotalValidationService, myGridConfig);

			function updateTools() {

				_.remove($scope.tools.items, function (e) {
					return e.id === 'createChild' || e.id === 'create' || e.id === 'delete';
				});

				$timeout(function () {
					$scope.tools.update();
				});
			}

			updateTools();

			$scope.$on('$destroy', function () {
			});
		}]);
})();
