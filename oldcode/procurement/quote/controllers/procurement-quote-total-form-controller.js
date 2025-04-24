(function (angular) {
	'use strict';
	var moduleName = 'procurement.quote';

	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc controller
	 * @name procurementQuoteHeaderFormController
	 * @requires $scope, platformDetailControllerService,platformTranslateService, procurementQuoteHeaderDataService,procurementQuoteHeaderFormConfigurations
	 * @description Controller for the quote header form.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementQuoteTotalFormController',
		['$scope', '$translate', 'platformDetailControllerService', 'procurementQuoteTotalDataService', 'procurementQuoteTotalUIConfigurationService',
			'platformTranslateService', 'procurementQuoteTotalValidationService',
			function ($scope, $translate, myInitService, dataService, configurationsService, translateService, procurementQuoteTotalValidationService) {

				var validator = procurementQuoteTotalValidationService(dataService);
				myInitService.initDetailController($scope, dataService, validator, configurationsService, translateService);

				$scope.formContainerOptions.customButtons = [
					{
						id: 'recalculate',
						caption: $translate.instant('procurement.common.total.dirtyRecalculate'),
						disabled: function () {
							return dataService.recalculateDisable();
						},
						type: 'item',
						iconClass: 'control-icons ico-recalculate',
						fn: function updateCalculation() {
							dataService.updateCalculation();
						}
					},
					{
						id: 'd999',
						sort: 999,
						type: 'divider'
					}
				];
			}
		]);
})(angular);