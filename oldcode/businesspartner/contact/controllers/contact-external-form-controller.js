(function (angular) {
	'use strict';
	angular.module('businesspartner.contact').controller('businessPartnerContact2ExternalFormController',
		['$scope', 'platformDetailControllerService', 'platformTranslateService', 'businessPartnerContact2ExternalUIStandardService', 'businessPartnerContact2ExternalDataService','businessPartnerContact2ExternalValidationService',

			function ($scope, platformDetailControllerService, platformTranslateService, businessPartnerContact2ExternalUIStandardService, businessPartnerContact2ExternalDataService,businessPartnerContact2ExternalValidationService) {

				let translateService = {
					translateFormConfig: function translateFormConfig(formConfig) {
						platformTranslateService.translateFormConfig(formConfig);
					}
				};

				platformDetailControllerService.initDetailController($scope, businessPartnerContact2ExternalDataService, businessPartnerContact2ExternalValidationService, businessPartnerContact2ExternalUIStandardService, translateService);
			}
		]);
})(angular);