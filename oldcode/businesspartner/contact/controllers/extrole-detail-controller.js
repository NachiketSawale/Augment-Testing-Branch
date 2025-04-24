(function (angular) {
	'use strict';
	angular.module('businesspartner.contact').controller('businessPartnerContactExtRoleDetailController',
		['$scope', 'platformDetailControllerService', 'platformTranslateService', 'businessPartnerContactExtRoleUIStandardService', 'businessPartnerContactExtRoleDataService','businessPartnerContactExtRoleValidationService',

			function ($scope, platformDetailControllerService, platformTranslateService, businessPartnerContactExtRoleUIStandardService, businessPartnerContactExtRoleDataService,businessPartnerContactExtRoleValidationService) {

				let translateService = {
					translateFormConfig: function translateFormConfig(formConfig) {
						platformTranslateService.translateFormConfig(formConfig);
					}
				};

				platformDetailControllerService.initDetailController($scope, businessPartnerContactExtRoleDataService, businessPartnerContactExtRoleValidationService, businessPartnerContactExtRoleUIStandardService, translateService);
			}
		]);
})(angular);