/**
 * Created by Ivy on 06.24.2020.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementContractTransactionFormController',
		['$scope', 'procurementContractTransactionDataService', 'platformDetailControllerService', 'procurementContractTransactionUIStandardService',
			'platformTranslateService',
			function ($scope, dataService, platformDetailControllerService, formConfig, platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, null, formConfig, platformTranslateService);

			}
		]);
})(angular);