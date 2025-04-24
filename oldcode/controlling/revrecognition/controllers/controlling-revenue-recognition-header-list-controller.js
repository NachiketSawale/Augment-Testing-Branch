/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'controlling.revrecognition';

	/**
     * @ngdoc controller
     * @name controllingRevenueRecognitionHeaderListController
     * @function
     *
     * @description
     * Controller for the list view of Cost Headers (Actuals).
     **/
	angular.module(moduleName).controller('controllingRevenueRecognitionHeaderListController',
		['$scope', '_', 'platformGridControllerService', 'controllingRevenueRecognitionHeaderDataService', 'controllingRevenueRecognitionHeaderConfigurationService','controllingRevenueRecognitionValidationService',
			function ($scope, _, platformGridControllerService, controllingRevenueRecognitionHeaderDataService,controllingRevenueRecognitionHeaderConfigurationService, controllingRevenueRecognitionValidationService) {
				var myGridConfig = {
					initCalled: false,
					columns: []
				};
				platformGridControllerService.initListController($scope, controllingRevenueRecognitionHeaderConfigurationService, controllingRevenueRecognitionHeaderDataService, controllingRevenueRecognitionValidationService, myGridConfig);
			}
		]);
})(angular);
