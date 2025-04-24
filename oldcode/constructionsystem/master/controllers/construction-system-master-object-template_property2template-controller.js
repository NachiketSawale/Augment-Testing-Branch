/**
 * Created by lvy on 9/7/2018.
 */

(function (angular) {
	'use strict';

	/**
     * @ngdoc controller
     * @name constructionSystemMasterObjectTemplateProperty2TemplateController
     * @require $scope
     * @description controller for construction System Master Object Template Property To Template Controller
     */

	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).controller('constructionSystemMasterObjectTemplateProperty2TemplateController',
		['$scope', 'platformGridControllerService', 'constructionSystemMasterObjectTemplateProperty2TemplateUIStandardService',
			'constructionSystemMasterObjectTemplateProperty2TemplateDataService', 'constructionSystemMasterObjectTemplatePropertyValidationService',
			function ($scope, gridControllerService, gridColumns, dataService, validationService) {

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, {});

			}]);
})(angular);