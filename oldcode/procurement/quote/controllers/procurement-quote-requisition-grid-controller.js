(function (angular) {
	'use strict';
	var moduleName = 'procurement.quote';

	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc controller
	 * @name procurementQuoteRequisitionGridController
	 * @requires $scope, platformGridControllerService, procurementQuoteRequisitionDataService,procurementQuoteRequisitionGridColumns
	 * @description Controller for the requisition grid container.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementQuoteRequisitionGridController',
		['$scope', 'platformGridControllerService', 'procurementQuoteRequisitionDataService', 'procurementQuoteRequisitionUIConfigurationService',
			function ($scope, myInitService, dataService, configurationsService) {

				myInitService.initListController($scope, configurationsService, dataService, {}, {});
			}
		]);
})(angular);