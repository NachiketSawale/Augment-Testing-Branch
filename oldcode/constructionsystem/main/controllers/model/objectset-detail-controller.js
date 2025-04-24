(function (angular) {
	'use strict';
	/* global _ */
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainObjectSetDetailController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionsystem main objectset form.
	 */
	angular.module(moduleName).controller('constructionSystemMainObjectSetDetailController', [
		'$scope', 'platformDetailControllerService', 'constructionSystemMainObjectSetService',
		'modelMainObjectSetConfigurationService', 'modelMainTranslationService',
		function ($scope, platformDetailControllerService, dataService, modelMainObjectSetConfigurationService, translateService) {

			var detailConfig = angular.copy(modelMainObjectSetConfigurationService.getStandardConfigForDetailView());

			// set all form row readonly
			_.each(detailConfig.rows, function (row) {
				row.readonly = true;
			});

			var uiConfigService = {
				getStandardConfigForDetailView: function () {
					return detailConfig;
				}
			};

			platformDetailControllerService.initDetailController($scope, dataService, {}, uiConfigService, translateService);
		}
	]);
})(angular);
