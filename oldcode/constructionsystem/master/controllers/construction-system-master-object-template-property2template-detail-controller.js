/**
 * Created by lvy on 9/14/2018.
 */
(function (angular) {
	'use strict';

	/**
     * @ngdoc controller
     * @name constructionSystemMasterObjectTemplateProperty2TemplateDetailController
     * @require $scope
     * @description controller for construction System Master Object Template Property To Template Detail Controller
     */

	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).controller('constructionSystemMasterObjectTemplateProperty2TemplateDetailController',
		['$scope', 'constructionSystemMasterObjectTemplateProperty2TemplateUIStandardService',
			'constructionSystemMasterObjectTemplateProperty2TemplateDataService', 'constructionSystemMasterObjectTemplatePropertyValidationService','platformTranslateService', 'platformDetailControllerService',
			function ($scope, gridColumns, constructionSystemMainObjectTemplatePropertyDataService, validationService, translateService, detailControllerService) {
				detailControllerService.initDetailController($scope, constructionSystemMainObjectTemplatePropertyDataService, validationService, gridColumns, translateService);

			}]);
})(angular);