/**
 * Created by joshi on 18.11.2014.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.currency';
	/**
	 * @ngdoc controller
	 * @name basicsCurrencyRateListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of Currency Rate entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('basicsCurrencyRateListController',
		['$scope', 'platformGridControllerService', 'basicsCurrencyRateService', 'basicsCurrencyValidationService', 'basicsCurrencyRateConfigurationService',
			function ($scope, platformGridControllerService, basicsCurrencyRateService, basicsCurrencyValidationService, basicsCurrencyRateConfigurationService) {

				var myGridConfig = { initCalled: false, columns: [] };
				platformGridControllerService.initListController($scope, basicsCurrencyRateConfigurationService, basicsCurrencyRateService, basicsCurrencyValidationService, myGridConfig);
			}
		]);
})(angular);
