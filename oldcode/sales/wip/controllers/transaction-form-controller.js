/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'sales.wip';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesWipTransactionFormController',
		['$scope', 'salesWipTransactionDataService', 'platformDetailControllerService',
			'salesWipTransactionValidationService', 'salesWipTransactionUIStandardService',
			'platformTranslateService',
			function ($scope, dataService, platformDetailControllerService, validationService, formConfig, platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, formConfig, platformTranslateService);

			}
		]);
})(angular);