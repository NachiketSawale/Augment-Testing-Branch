/**
 * Created by chi on 5/26/2016.
 */
/* global _ */
(function(angular) {
	'use strict';

	angular.module('constructionsystem.master').controller('constructionSystemMasterParameter2TemplateGridController', constructionSystemMasterParameter2TemplateGridController);
	constructionSystemMasterParameter2TemplateGridController.$inject = [
		'$scope',
		'platformGridControllerService',
		'constructionSystemMasterParameter2TemplateUIStandardService',
		'constructionSystemMasterParameter2TemplateDataService',
		'constructionSystemMasterParameter2TemplateValidationService'
	];
	function constructionSystemMasterParameter2TemplateGridController(
		$scope,
		platformGridControllerService,
		constructionSystemMasterParameter2TemplateUIStandardService,
		constructionSystemMasterParameter2TemplateDataService,
		constructionSystemMasterParameter2TemplateValidationService) {
		platformGridControllerService.initListController($scope, constructionSystemMasterParameter2TemplateUIStandardService, constructionSystemMasterParameter2TemplateDataService, constructionSystemMasterParameter2TemplateValidationService, {});

		var removeItems = ['create'];
		$scope.tools.items = _.filter($scope.tools.items, function (item) {
			return item && removeItems.indexOf(item.id) === -1;
		});
	}
})(angular);