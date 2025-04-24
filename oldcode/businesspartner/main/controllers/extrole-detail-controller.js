(function (angular) {
	'use strict';
	angular.module('businesspartner.main').controller('businessPartnerMainExtRoleDetailController',
		['$scope', 'platformDetailControllerService', 'platformTranslateService', 'businessPartnerMainExtRoleUIStandardService', 'businessPartnerMainExtRoleDataService','businessPartnerMainExtRoleValidationService',

			function ($scope, platformDetailControllerService, platformTranslateService, businessPartnerMainExtRoleUIStandardService, businessPartnerMainExtRoleDataService,businessPartnerMainExtRoleValidationService) {

				let translateService = {
					translateFormConfig: function translateFormConfig(formConfig) {
						platformTranslateService.translateFormConfig(formConfig);
					}
				};

				platformDetailControllerService.initDetailController($scope, businessPartnerMainExtRoleDataService, businessPartnerMainExtRoleValidationService, businessPartnerMainExtRoleUIStandardService, translateService);
			}
		]);
})(angular);