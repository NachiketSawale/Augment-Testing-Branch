(function (angular) {
	'use strict';

	var moduleName = 'procurement.contract';

	angular.module(moduleName).controller('updateContractFromBaselineBlockController',
		['$sce', '$scope', 'procurementContractHeaderDataService',
			function ($sce, $scope, dataService) {

				$scope.trustAsHtml = function(html){
					// fix < and > display.
					html = html.replace(/</g,'&lt;').replace(/>/g,'&gt;');
					return $sce.trustAsHtml(html);
				};

				function closeDialog(result) {
					var customResult = result || {};
					customResult.ok = true;
					$scope.$close(customResult);
				}

				dataService.closeBlockDialog.register(closeDialog);

				$scope.$on('$destroy', function () {
					dataService.closeBlockDialog.unregister(closeDialog);
				});
			}
		]);
})(angular);