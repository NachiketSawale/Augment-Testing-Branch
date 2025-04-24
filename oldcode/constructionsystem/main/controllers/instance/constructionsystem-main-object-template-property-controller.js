/**
 * Created by lvy on 6/12/2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainObjectTemplatePropertyController
	 * @require $scope
	 * @description controller for construction System Main Object Template Property Controller
	 */

	var moduleName = 'constructionsystem.main';
	angular.module(moduleName).controller('constructionSystemMainObjectTemplatePropertyController',
		['$scope', 'platformGridControllerService', 'constructionSystemMainObjectTemplatePropertyUIStandardService',
			'constructionSystemMainObjectTemplatePropertyDataService', 'constructionSystemMainObjectTemplatePropertyValidationService',
			function ($scope, gridControllerService, gridColumns, constructionSystemMainObjectTemplatePropertyDataService, validationService) {

				gridControllerService.initListController($scope, gridColumns, constructionSystemMainObjectTemplatePropertyDataService, validationService, {});

			}]);
})(angular);