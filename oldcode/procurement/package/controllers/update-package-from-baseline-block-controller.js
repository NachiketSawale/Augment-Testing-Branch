(function (angular) {
	'use strict';

	var moduleName = 'procurement.package';
	/**
	 * @ngdoc controller
	 * @name procurementPackageGridController
	 * @require $scope, platformGridControllerBase, $filter,  procurementPackageDataService, procurementPackageUIStandardService, slickGridEditors, lookupDataService, reqHeaderElementValidationService,
	 *          modelViewerStandardFilterService
	 * @description controller for requisition header
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('updatePackageFromBaselineBlockController',
		['$sce', '$scope', 'procurementPackageDataService',
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