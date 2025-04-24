/**
 * Created by chi on 5/26/2016.
 */
(function(angular) {
	'use strict';

	angular.module('constructionsystem.master').controller('constructionSystemMasterTemplateGridController', constructionSystemMasterTemplateGridController);
	constructionSystemMasterTemplateGridController.$inject = [
		'$scope',
		'platformGridControllerService',
		'constructionSystemMasterTemplateDataService',
		'constructionSystemMasterParameter2TemplateDataService', // don't remove for it should be initialized when the controller initializes
		'constructionSystemMasterTemplateUIStandardService',
		'constructionSystemMasterTemplateValidationService'
	];
	/* jshint -W072 */
	// noinspection JSUnusedLocalSymbols
	function constructionSystemMasterTemplateGridController(
		$scope,
		platformGridControllerService,
		constructionSystemMasterTemplateDataService,
		constructionSystemMasterParameter2TemplateDataService,
		constructionSystemMasterTemplateUIStandardService,
		constructionSystemMasterTemplateValidationService) {
		platformGridControllerService.initListController($scope, constructionSystemMasterTemplateUIStandardService, constructionSystemMasterTemplateDataService, constructionSystemMasterTemplateValidationService(constructionSystemMasterTemplateDataService), {});
	}
})(angular);