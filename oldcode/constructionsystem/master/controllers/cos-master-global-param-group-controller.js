(function (angular) {
	'use strict';
	/**
	 * @ngdoc controller
	 * @name constructionSystemMasterGlobalParamGroupController
	 * @require $scope
	 * @description controller for construction System Master Global Param Group grid controller
	 */
	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).controller('constructionSystemMasterGlobalParamGroupController',
		['$scope', 'platformGridControllerService', 'constructionSystemMasterGlobalParamGroupDataService', 'constructionSystemMasterGlobalParamGroupUiConfigService', 'constructionSystemMasterHeaderService','constructionSystemMasterGlobalParamGroupValidationService',
			function ($scope, gridControllerService, dataService, uiStandardService, constructionSystemMasterHeaderService, validationService) {

				var gridConfig = {
					initCalled: false,
					columns: [], parentProp: 'CosGlobalParamGroupFk',
					childProp: 'CosGlobalParamGroupChildren'
				};

				gridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

				constructionSystemMasterHeaderService.registerRefreshRequested(dataService.refresh);
				$scope.$on('$destroy',function () {
					constructionSystemMasterHeaderService.unregisterRefreshRequested(dataService.refresh);
				});
			}

		]);
})(angular);