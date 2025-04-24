/**
 * Created by lvy on 6/21/2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainObjectTemplatePropertyDetailController
	 * @require $scope
	 * @description controller for construction System Main Object Template Property Detail Controller
	 */

	var moduleName = 'constructionsystem.main';
	angular.module(moduleName).controller('constructionSystemMainObjectTemplatePropertyDetailController', [
		'$scope',
		'constructionSystemMainObjectTemplatePropertyUIStandardService',
		'constructionSystemMainObjectTemplatePropertyDataService',
		'constructionSystemMainObjectTemplatePropertyValidationService',
		'platformTranslateService',
		'platformDetailControllerService',
		function (
			$scope,
			gridColumns,
			constructionSystemMainObjectTemplatePropertyDataService,
			validationService,
			translateService,
			detailControllerService
		) {
			detailControllerService.initDetailController($scope, constructionSystemMainObjectTemplatePropertyDataService, validationService, gridColumns, translateService);
		}
	]);
})(angular);