(function (angular) {
	'use strict';
	angular.module('businesspartner.contact').controller('businessPartnerContact2ExternalListController',
		['$scope', 'platformGridControllerService', 'businessPartnerContact2ExternalDataService', 'businessPartnerContact2ExternalUIStandardService', 'platformGridAPI','businessPartnerContact2ExternalValidationService',
			function ($scope, platformGridControllerService, businessPartnerContact2ExternalDataService, businessPartnerContact2ExternalUIStandardService, platformGridAPI,businessPartnerContact2ExternalValidationService) {

				let myGridConfig = {initCalled: false, columns: []};

				platformGridControllerService.initListController($scope, businessPartnerContact2ExternalUIStandardService, businessPartnerContact2ExternalDataService, businessPartnerContact2ExternalValidationService,myGridConfig);
			}
		]);
})(angular);