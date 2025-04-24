/**
 * Created by lvy on 6/21/2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMasterObjectTemplatePropertyDetailController
	 * @require $scope
	 * @description controller for construction System Master Object Template Property Detail Controller
	 */

	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).controller('constructionSystemMasterObjectTemplatePropertyDetailController',
		['$scope', 'constructionSystemMasterObjectTemplatePropertyUIStandardService',
			'constructionSystemMasterObjectTemplatePropertyDataService', 'constructionSystemMasterObjectTemplatePropertyValidationService','platformTranslateService', 'platformDetailControllerService',
			function ($scope, gridColumns, constructionSystemMainObjectTemplatePropertyDataService, validationService, translateService, detailControllerService) {
				detailControllerService.initDetailController($scope, constructionSystemMainObjectTemplatePropertyDataService, validationService, gridColumns, translateService);

			}]);
})(angular);