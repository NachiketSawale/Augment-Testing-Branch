(function (angular) {
	'use strict';

	angular.module('businesspartner.main').controller('businesspartnerMainBusinessPartner2CompanyFormController',
		['$scope', 'platformDetailControllerService', 'platformTranslateService', 'businessPartnerMainBusinessPartner2CompanyUIStandardService', 'businessPartnerMainBP2CompanyDataService', 'businessPartnerMainBusinessPartner2CompanyValidationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformDetailControllerService, platformTranslateService, businessPartnerMainBusinessPartner2CompanyUIStandardService, businessPartnerMainBP2CompanyDataService, businessPartnerMainBusinessPartner2CompanyValidationService) {

				let translateService = {
					translateFormConfig: function translateFormConfig(formConfig) {
						platformTranslateService.translateFormConfig(formConfig);
					}
				};

				platformDetailControllerService.initDetailController(
					$scope,
					businessPartnerMainBP2CompanyDataService,
					businessPartnerMainBusinessPartner2CompanyValidationService,
					businessPartnerMainBusinessPartner2CompanyUIStandardService,
					translateService
				);

				$scope.formOptions.onPropertyChanged = function onPropertyChanged() {
					businessPartnerMainBP2CompanyDataService.markCurrentItemAsModified();
					businessPartnerMainBP2CompanyDataService.propertyChanged();
				};
			}]);

})(angular);