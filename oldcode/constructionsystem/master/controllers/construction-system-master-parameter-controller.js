(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMasterParameterController
	 * @require $scope
	 * @description controller for construction System Master Parameter Controller
	 */
	angular.module('constructionsystem.master').controller('constructionSystemMasterParameterController',
		['$scope', 'platformGridControllerService', 'constructionSystemMasterParameterUIStandardService',
			'constructionSystemMasterParameterDataService', 'constructionSystemMasterParameterValidationService',
			function ($scope, gridControllerService, gridColumns,
				constructionSystemMasterParameterDataService, validationService) {
				gridControllerService.initListController($scope, gridColumns, constructionSystemMasterParameterDataService, validationService, {});
			}]);
})(angular);