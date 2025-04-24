/**
 * Created by bh on 05.05.2015.
 */
(function () {
	/* global */
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('boq.wic').controller('boqWicGroupDetailController',
		['$scope', 'platformDetailControllerService', 'boqWicGroupService', 'boqWicGroupValidationService', 'boqWicGroupStandardConfigurationService', 'boqWicTranslationService',
			function ($scope, platformDetailControllerService, boqWicGroupService, boqWicGroupValidationService, boqWicGroupStandardConfigurationService, boqWicTranslationService) {

				platformDetailControllerService.initDetailController($scope, boqWicGroupService, boqWicGroupValidationService, boqWicGroupStandardConfigurationService, boqWicTranslationService);
			}
		]);
})();