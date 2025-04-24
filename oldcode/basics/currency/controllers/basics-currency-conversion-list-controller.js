/**
 * Created by joshi on 18.11.2014.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.currency';

	/**
	 * @ngdoc controller
	 * @name basicsCurrencyConversionListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of Currency Conversion entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('basicsCurrencyConversionListController',
		['$scope', '$translate', 'platformGridControllerService', 'basicsCurrencyConversionService', 'basicsCurrencyConversionConfigurationService', 'basicsCurrencyConversionValidationService',
			function ($scope, $translate, platformGridControllerService, basicsCurrencyConversionService, basicsCurrencyConversionConfigurationService, basicsCurrencyConversionValidationService ) {

				var myGridConfig = { initCalled: false, columns: [], isFlatList: true};
				platformGridControllerService.initListController($scope, basicsCurrencyConversionConfigurationService, basicsCurrencyConversionService, basicsCurrencyConversionValidationService, myGridConfig);
			}
		]);
})(angular);

