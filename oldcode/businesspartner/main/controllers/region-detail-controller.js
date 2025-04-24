(function (angular) {
	'use strict';
	angular.module('businesspartner.main').controller('businessPartnerMainRegionDetailController',
		['$scope', 'platformDetailControllerService', 'platformTranslateService', 'businessPartnerMainRegionUIStandardService', 'businessPartnerMainRegionDataService','businessPartnerMainRegionValidationService',

			function ($scope, platformDetailControllerService, platformTranslateService, businessPartnerMainRegionUIStandardService, businessPartnerMainRegionDataService,businessPartnerMainRegionValidationService) {

				let translateService = {
					translateFormConfig: function translateFormConfig(formConfig) {
						platformTranslateService.translateFormConfig(formConfig);
					}
				};

				platformDetailControllerService.initDetailController($scope, businessPartnerMainRegionDataService, businessPartnerMainRegionValidationService, businessPartnerMainRegionUIStandardService, translateService);
			}
		]);
})(angular);