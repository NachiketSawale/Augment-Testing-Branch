(function () {

	'use strict';

	angular.module('businesspartner.main').controller('businesspartnerMainSupplierDetailController',
		['$scope',
			'platformDetailControllerService',
			'platformTranslateService',
			'businessPartnerMainSupplierUIStandardService',
			'businesspartnerMainSupplierDataService',
			'businesspartnerMainSupplierValidationService',

			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope,
				platformDetailControllerService,
				platformTranslateService,
				businessPartnerMainSupplierUIStandardService,
				businesspartnerMainSupplierDataService,
				businesspartnerMainSupplierValidationService
			) {
				let validator = businesspartnerMainSupplierValidationService(businesspartnerMainSupplierDataService);

				let translateService = {
					translateFormConfig: function translateFormConfig(formConfig) {
						platformTranslateService.translateFormConfig(formConfig);
					}
				};

				platformDetailControllerService.initDetailController(
					$scope,
					businesspartnerMainSupplierDataService,
					validator,
					businessPartnerMainSupplierUIStandardService,
					translateService
				);

				$scope.formOptions.onPropertyChanged = function onPropertyChanged() {
					businesspartnerMainSupplierDataService.markCurrentItemAsModified();
					businesspartnerMainSupplierDataService.propertyChanged();
				};

				businesspartnerMainSupplierDataService.fillReadonlyModels($scope.formOptions.configure);
			}]);
})();