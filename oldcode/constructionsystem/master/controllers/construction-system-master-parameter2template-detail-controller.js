/**
 * Created by chi on 5/26/2016.
 */
(function(angular) {
	'use strict';

	angular.module('constructionsystem.master').controller('constructionSystemMasterParameter2TemplateDetailController', constructionSystemMasterParameter2TemplateDetailController);
	constructionSystemMasterParameter2TemplateDetailController.$inject = [
		'$scope',
		'platformDetailControllerService',
		'constructionSystemMasterParameter2TemplateDataService',
		'constructionSystemMasterParameter2TemplateUIStandardService',
		'constructionSystemMasterParameter2TemplateValidationService',
		'platformTranslateService'
	];
	function constructionSystemMasterParameter2TemplateDetailController(
		$scope,
		platformDetailControllerService,
		constructionSystemMasterParameter2TemplateDataService,
		constructionSystemMasterParameter2TemplateUIStandardService,
		constructionSystemMasterParameter2TemplateValidationService,
		platformTranslateService
	) {
		platformDetailControllerService.initDetailController($scope, constructionSystemMasterParameter2TemplateDataService, constructionSystemMasterParameter2TemplateValidationService, constructionSystemMasterParameter2TemplateUIStandardService, platformTranslateService);
	}
})(angular);