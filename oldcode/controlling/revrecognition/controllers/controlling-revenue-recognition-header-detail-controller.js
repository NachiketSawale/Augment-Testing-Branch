/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'controlling.revrecognition';
	/**
     * @ngdoc controller
     * @name controllingRevenuerecognitionHeaderDetailController
     * @function
     *
     * @description
     * Controller for the detail view of cost header information (ACTUALS).
     **/
	angular.module(moduleName).controller('controllingRevenueRecognitionHeaderDetailController',
		['$scope', 'platformDetailControllerService', 'controllingRevenueRecognitionHeaderDataService', 'controllingRevenueRecognitionHeaderConfigurationService','controllingRevenueRecognitionValidationService', 'controllingRevenueRecognitionTranslationService',
			function ($scope, platformDetailControllerService, controllingRevenueRecognitionHeaderDataService, controllingRevenueRecognitionHeaderConfigurationService, controllingRevenueRecognitionValidationService,controllingRevenueRecognitionTranslationService) {
				platformDetailControllerService.initDetailController($scope, controllingRevenueRecognitionHeaderDataService, controllingRevenueRecognitionValidationService, controllingRevenueRecognitionHeaderConfigurationService, controllingRevenueRecognitionTranslationService);
			}
		]);
})(angular);
