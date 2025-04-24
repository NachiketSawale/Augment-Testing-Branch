(function (angular) {
	'use strict';
	var moduleName = 'procurement.quote';

	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc controller
	 * @name procurementQuoteHeaderFormController
	 * @requires $scope, platformDetailControllerService, procurementQuoteRequisitionConfigurations,procurementQuoteRequisitionConfigurations
	 * @description Controller for the quote header form.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementQuoteRequisitionFormController',
		['$scope', 'platformDetailControllerService', 'procurementQuoteRequisitionDataService', 'procurementQuoteRequisitionUIConfigurationService',
			'platformTranslateService',
			function ($scope, myInitService, dataService, configurationsService, translateService) {

				myInitService.initDetailController($scope, dataService, null, configurationsService, translateService);

				delete $scope.formContainerOptions.onAddItem;
				delete $scope.formContainerOptions.onDeleteItem;
			}
		]);
})(angular);