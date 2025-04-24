/**
 * Created by jhe on 11/21/2018.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.accountingjournals';

	angular.module(moduleName).controller('basicsAccountingJournalsTransactionDetailController',
		['$scope', 'basicsAccountingJournalsTransactionService', 'platformDetailControllerService', 'basicsAccountingJournalsTransactionUIStandardService', 'platformTranslateService',
			'basicsAccountingJournalsTransactionValidationService',
			function ($scope, dataService, platformDetailControllerService, formConfig, translateService, basicsAccountingJournalsTransactionValidationService) {

				platformDetailControllerService.initDetailController($scope, dataService, basicsAccountingJournalsTransactionValidationService, formConfig, translateService);

			}
		]);

})(angular);