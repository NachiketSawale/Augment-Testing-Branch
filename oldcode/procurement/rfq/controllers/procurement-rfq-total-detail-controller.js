(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';

	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc controller
	 * @name procurement.rfq.controller:procurementRfqTotalDetailController
	 * @requires $scope, platformDetailControllerService
	 * @description
	 * #
	 * Controller for rfq total form container.
	 */
	/* jshint -W072 */
	angular.module(moduleName).controller('procurementRfqTotalDetailController',
		['$scope', 'platformDetailControllerService', 'procurementRfqTotalService', 'procurementRfqTotalUIStandardService', 'platformTranslateService', 'procurementRfqTotalValidationService',

			function ($scope, platformDetailControllerService, dataService, columnsService, translateService, procurementRfqTotalValidationService) {

				var validator = procurementRfqTotalValidationService(dataService);
				platformDetailControllerService.initDetailController($scope, dataService, validator, columnsService, translateService);
			}
		]);
})(angular);