/**
 * Created by lvy on 4/2/2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMasterGlobalParameterController
	 * @require $scope
	 * @description controller for construction System Master Global Parameter Controller
	 */

	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).controller('constructionSystemMasterGlobalParameterController',
		['$scope', 'platformGridControllerService', 'constructionSystemMasterGlobalParameterUIStandardService',
			'constructionSystemMasterGlobalParameterDataService', 'constructionSystemMasterGlobalParameterValidationService','constructionSystemMasterHeaderService',
			function ($scope, gridControllerService, gridColumns, constructionSystemMasterGlobalParameterDataService, validationService, constructionSystemMasterHeaderService) {

				gridControllerService.initListController($scope, gridColumns, constructionSystemMasterGlobalParameterDataService, validationService, {});

				constructionSystemMasterHeaderService.registerRefreshRequested(constructionSystemMasterGlobalParameterDataService.refresh);

				$scope.$on('$destroy',function () {
					constructionSystemMasterHeaderService.unregisterRefreshRequested(constructionSystemMasterGlobalParameterDataService.refresh);
				});
				constructionSystemMasterGlobalParameterDataService.load();
			}]);
})(angular);
