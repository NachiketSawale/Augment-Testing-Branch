/**
 * Created by chi on 5/26/2016.
 */
(function(angular) {
	'use strict';

	angular.module('constructionsystem.master').controller('constructionSystemMasterTemplateDetailController', constructionSystemMasterTemplateDetailController);
	constructionSystemMasterTemplateDetailController.$inject = [
		'$scope',
		'platformDetailControllerService',
		'constructionSystemMasterTemplateDataService',
		'constructionSystemMasterParameter2TemplateDataService', // don't remove for it should be initialized when the controller initializes
		'constructionSystemMasterTemplateUIStandardService',
		'constructionSystemMasterTemplateValidationService'
	];
	/* jshint -W072 */
	// noinspection JSUnusedLocalSymbols
	function constructionSystemMasterTemplateDetailController(
		$scope,
		platformDetailControllerService,
		constructionSystemMasterTemplateDataService,
		constructionSystemMasterParameter2TemplateDataService,
		constructionSystemMasterTemplateUIStandardService,
		constructionSystemMasterTemplateValidationService
	) {
		platformDetailControllerService.initDetailController($scope, constructionSystemMasterTemplateDataService, constructionSystemMasterTemplateValidationService(constructionSystemMasterTemplateDataService), constructionSystemMasterTemplateUIStandardService, {});
	}
})(angular);