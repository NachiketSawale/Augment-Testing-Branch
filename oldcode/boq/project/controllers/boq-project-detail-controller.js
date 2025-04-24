/**
 * Created by bh on 13.03.2015.
 */
(function () {
	/* global */
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('boq.project').controller('boqProjectDetailController',
		['$scope', 'platformDetailControllerService', 'boqProjectService', 'projectMainBoqValidationService', 'boqProjectStandardConfigurationService', 'boqMainTranslationService',
			function ($scope, platformDetailControllerService, boqProjectService, projectMainBoqValidationService, boqProjectStandardConfigurationService, boqMainTranslationService) {

				platformDetailControllerService.initDetailController($scope, boqProjectService, projectMainBoqValidationService, boqProjectStandardConfigurationService, boqMainTranslationService);
			}
		]);
})();