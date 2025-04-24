/**
 * Created by lvy on 6/1/2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMasterObjectTemplatePropertyController
	 * @require $scope
	 * @description controller for construction System Master Object Template Property Controller
	 */

	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).controller('constructionSystemMasterObjectTemplatePropertyController',
		['$scope', 'platformGridControllerService', 'constructionSystemMasterObjectTemplatePropertyUIStandardService',
			'constructionSystemMasterObjectTemplatePropertyDataService', 'constructionSystemMasterObjectTemplatePropertyValidationService',
			function ($scope, gridControllerService, gridColumns, constructionSystemMasterGlobalParameterDataService, validationService) {

				gridControllerService.initListController($scope, gridColumns, constructionSystemMasterGlobalParameterDataService, validationService, {});

			}]);
})(angular);