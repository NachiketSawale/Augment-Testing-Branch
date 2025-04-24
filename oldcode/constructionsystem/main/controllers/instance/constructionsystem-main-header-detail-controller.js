(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainHeaderDetailController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionSystem main master form.
	 */
	angular.module(moduleName).controller('constructionSystemMainHeaderDetailController', [
		'$scope', 'platformDetailControllerService', 'constructionSystemMasterHeaderUIStandardService',
		'constructionSystemMainHeaderService', 'constructionsystemMasterTranslationService',
		function ($scope, platformDetailControllerService, constructionSystemMasterHeaderUIStandardService, dataService, translateService) {

			var detailConfig = angular.copy(constructionSystemMasterHeaderUIStandardService.getStandardConfigForDetailView());

			// set all form row readonly
			_.each(detailConfig.rows, function (row) {
				row.readonly = true;

				// add navigator
				if (row.rid === 'code') {
					row.navigator = {
						moduleName: 'constructionsystem.master'
					};
				}
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
