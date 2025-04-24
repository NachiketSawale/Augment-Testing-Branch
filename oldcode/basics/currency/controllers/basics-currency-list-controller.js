/**
 * Created by joshi on 18.11.2014.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.currency';

	/**
	 * @ngdoc controller
	 * @name basicsCurrencyListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of Currency entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCurrencyListController',
		['$scope', 'platformGridControllerService', 'basicsCurrencyMainService', 'basicsCurrencyStandardConfigurationService', 'basicsCurrencyValidationService', 'basicsCurrencyCommonService',
			function ($scope, platformGridControllerService, basicsCurrencyMainService, basicsCurrencyStandardConfigurationService, basicsCurrencyValidationService, basicsCurrencyCommonService) {

				var myGridConfig = { initCalled: false, columns: [], sortOptions: {initialSortColumn: {field: 'Currency', id: 'currency' }, isAsc: true},
					cellChangeCallBack: function cellChangeCallBack(arg) {
						basicsCurrencyCommonService.onSelectionChanged(arg);
						basicsCurrencyMainService.gridRefresh();
					}
				};

				platformGridControllerService.initListController($scope, basicsCurrencyStandardConfigurationService, basicsCurrencyMainService, basicsCurrencyValidationService, myGridConfig);
			}
		]);
})(angular);
