/**
 * Created by jhe on 11/16/2018.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.accountingjournals';

	angular.module(moduleName).controller('basicsAccountingJournalsDetailController',
		['$scope', 'basicsAccountingJournalsMainService', 'platformDetailControllerService', 'basicsAccountingJournalsUIStandardService', 'platformTranslateService',
			'basicsAccountingJournalsValidationService',
			function ($scope, dataService, platformDetailControllerService, formConfig, translateService, basicsAccountingJournalsValidationService) {

				platformDetailControllerService.initDetailController($scope, dataService, basicsAccountingJournalsValidationService, formConfig, translateService);

			}
		]);

})(angular);