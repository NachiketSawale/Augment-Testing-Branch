/**
 * Created by lcn on 06.22.2020.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.pes';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementPesTransactionFormController',
		['$scope', 'procurementPesTransactionDataService', 'platformDetailControllerService',
			'procurementPesTransactionValidationService', 'procurementPesTransactionUIStandardService',
			'platformTranslateService',
			function ($scope, dataService, platformDetailControllerService, validationService, formConfig, platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, formConfig, platformTranslateService);

			}
		]);
})(angular);