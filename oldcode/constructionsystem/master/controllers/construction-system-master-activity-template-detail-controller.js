(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMasterActivityTemplateDetailController',
		['$scope',
			'platformDetailControllerService',
			'constructionSystemMasterActivityTemplateService',
			'constructionSystemMasterActivityTemplateValidationService',
			'constructionSystemMasterActivityTemplateUIStandardService',
			'platformTranslateService',

			function ($scope,
				platformDetailControllerService,
				constructionSystemMasterActivityTemplateService,
				constructionSystemMasterActivityTemplateValidationService,
				constructionSystemMasterActivityTemplateUIStandardService,
				platformTranslateService) {

				platformDetailControllerService.initDetailController(
					$scope,
					constructionSystemMasterActivityTemplateService,
					constructionSystemMasterActivityTemplateValidationService,
					constructionSystemMasterActivityTemplateUIStandardService,
					platformTranslateService);
			}]);
})(angular);