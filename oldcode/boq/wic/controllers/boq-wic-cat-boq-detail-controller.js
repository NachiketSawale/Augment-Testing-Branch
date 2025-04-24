/**
 * Created by bh on 07.05.2015.
 */
(function () {
	/* global */
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('boq.wic').controller('boqWicCatBoqDetailController',
		['$scope', 'platformDetailControllerService', 'boqWicCatBoqService', 'boqWicCatBoqProjectValidationService', 'boqWicCatBoqStandardConfigurationService', 'boqWicTranslationService',
			function ($scope, platformDetailControllerService, boqWicCatBoqService, boqWicCatBoqProjectValidationService, boqWicCatBoqStandardConfigurationService, boqWicTranslationService) {

				platformDetailControllerService.initDetailController($scope, boqWicCatBoqService, boqWicCatBoqProjectValidationService, boqWicCatBoqStandardConfigurationService, boqWicTranslationService);
			}
		]);
})();