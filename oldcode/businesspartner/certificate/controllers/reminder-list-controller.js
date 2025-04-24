/**
 * Created by zos on 5/14/2015.
 */
(function (angular) {
	'use strict';

	angular.module('businesspartner.certificate').controller('businesspartnerCertificateReminderListController',
		['$scope', 'platformGridControllerService', 'businesspartnerCertificateReminderDataService', 'businesspartnerCertificateReminderUIStandardService', 'businesspartnerCertificateReminderValidationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformGridControllerService, dataService, uiStandardService, validationService) {

				var myGridConfig = {initCalled: false, columns: []};

				platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, myGridConfig);
			}
		]);
})(angular);