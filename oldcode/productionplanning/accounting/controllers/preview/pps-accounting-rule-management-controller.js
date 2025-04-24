/**
 * Created by lav on 7/22/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).controller('productionplanningAccountingRuleManagementController',
		[
			'$scope',
			'ppsDrawingPreviewDialogService',
			'platformGridAPI',
			function ($scope,
					  ppsDrawingPreviewDialogService,
						platformGridAPI) {
				$scope.gridIds = [];

				$scope.$on('$destroy', function () {
					$scope.gridIds.forEach(gId => platformGridAPI.grids.commitEdit(gId));
					$scope.ruleSetService.update().then(function () {
						if ($scope.ruleSetService.needRefresh) {
							$scope.ruleSetService.needRefresh = false;
							ppsDrawingPreviewDialogService.onRefresh();
						}
					});
				});
			}
		]);
})(angular);