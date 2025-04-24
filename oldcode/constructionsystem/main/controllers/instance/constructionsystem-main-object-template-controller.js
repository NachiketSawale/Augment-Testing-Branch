/**
 * Created by lvy on 6/12/2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainObjectTemplateController
	 * @require $scope
	 * @description controller for construction System Main Object Template Controller
	 */

	var moduleName = 'constructionsystem.main';
	angular.module(moduleName).controller('constructionSystemMainObjectTemplateController', [
		'$injector',
		'$scope',
		'platformControllerExtendService',
		'platformGridControllerService',
		'constructionSystemMainObjectTemplateUIStandardService',
		'constructionSystemMainObjectTemplateDataService',
		'constructionSystemMainObjectTemplateValidationService',
		'constructionSystemMainObjectTemplateCostGroupService',
		function ($injector,
			$scope,
			platformControllerExtendService,
			gridControllerService,
			gridColumns,
			constructionSystemMainObjectTemplateDataService,
			validationService,
			constructionSystemMainObjectTemplateCostGroupService) {

			platformControllerExtendService.initListController($scope, gridColumns, constructionSystemMainObjectTemplateDataService, validationService, {
				costGroupService: constructionSystemMainObjectTemplateCostGroupService
			});

		}]);
})(angular);