(function () {
	'use strict';

	angular.module('procurement.orderproposals').controller('procurementOrderProposalsDetailController',
		['$scope', 'procurementOrderProposalsDataService', 'platformDetailControllerService', 'procurementOrderProposalsUIStandardService', 'platformTranslateService', 'procurementOrderProposalsValidationService',
			function procurementOrderProposalsDetailController($scope, dataService, platformDetailControllerService, formConfig, translateService, validationService) {

				platformDetailControllerService.initDetailController($scope, dataService, validationService, formConfig, translateService);
			}]);
})(angular);
