(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMasterActivityTemplateController',
		['$scope',
			'constructionSystemMasterActivityTemplateService',
			'platformGridControllerService',
			'constructionSystemMasterActivityTemplateUIStandardService',
			'constructionSystemMasterActivityTemplateValidationService',

			function ($scope,
				constructionSystemMasterActivityTemplateService,
				platformGridControllerService,
				constructionSystemMasterActivityTemplateUIStandardService,
				constructionSystemMasterActivityTemplateValidationService) {

				platformGridControllerService.initListController(
					$scope,
					constructionSystemMasterActivityTemplateUIStandardService,
					constructionSystemMasterActivityTemplateService,
					constructionSystemMasterActivityTemplateValidationService,
					{});

				$scope.$on('$destroy', function () {

				});
			}
		]);
})(angular);