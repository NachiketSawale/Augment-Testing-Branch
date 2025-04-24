(function (angular) {
	'use strict';

	angular.module('businesspartner.main').controller('businesspartnerMainCustomerFormController',
		['$scope', 'platformDetailControllerService', 'platformTranslateService', 'businessPartnerMainCustomerUIStandardService', 'businesspartnerMainCustomerDataService', 'businesspartnerMainCustomerValidationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformDetailControllerService, platformTranslateService, businessPartnerMainCustomerUIStandardService, businesspartnerMainCustomerDataService, businesspartnerMainCustomerValidationService) {
				let validator = businesspartnerMainCustomerValidationService(businesspartnerMainCustomerDataService);

				let translateService = {
					translateFormConfig: function translateFormConfig(formConfig) {
						platformTranslateService.translateFormConfig(formConfig);
					}
				};

				platformDetailControllerService.initDetailController(
					$scope,
					businesspartnerMainCustomerDataService,
					validator,
					businessPartnerMainCustomerUIStandardService,
					translateService
				);

				$scope.formOptions.onPropertyChanged = function onPropertyChanged() {
					businesspartnerMainCustomerDataService.markCurrentItemAsModified();
					businesspartnerMainCustomerDataService.propertyChanged();
				};

				businesspartnerMainCustomerDataService.fillReadonlyModels($scope.formOptions.configure);
			}]);

})(angular);