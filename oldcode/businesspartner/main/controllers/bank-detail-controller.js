(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name businesspartner.main.controller: businesspartnerMainBankDetailController
	 * @requires $scope, platformDetailControllerService
	 * @description
	 * #
	 * Controller for bank detail container.
	 */
	angular.module('businesspartner.main').controller('businesspartnerMainBankDetailController',
		['$scope', 'platformDetailControllerService', 'platformTranslateService', 'businessPartnerMainBankUIStandardService', 'businesspartnerMainBankDataService', 'businesspartnerMainBankValidationService',
			/* jshint -W072 */
			function ($scope, platformDetailControllerService, platformTranslateService, businessPartnerMainBankUIStandardService, businesspartnerMainBankDataService, businesspartnerMainBankValidationService) {
				let translateService = {
					translateFormConfig: function translateFormConfig(formConfig) {
						platformTranslateService.translateFormConfig(formConfig);
					}
				};

				let validator = businesspartnerMainBankValidationService(businesspartnerMainBankDataService);

				platformDetailControllerService.initDetailController($scope, businesspartnerMainBankDataService, validator, businessPartnerMainBankUIStandardService, translateService);
			}
		]);
})(angular);