/**
 * Created by zos on 12/25/2014.
 */
(function (angular) {
	'use strict';

	angular.module('businesspartner.main').controller('businesspartnerMainContactFormController',
		['$scope', 'platformDetailControllerService', 'platformTranslateService', 'businessPartnerMainContactUIStandardService', 'businesspartnerMainContactDataService', 'businessPartnerMainContactValidationService', 'businessPartnerMainVcardExtension', 'businesspartnerMainContactPhotoDataService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, platformDetailControllerService, platformTranslateService, businessPartnerMainContactUIStandardService, businesspartnerMainContactDataService, businessPartnerMainContactValidationService, businessPartnerMainVcardExtension, photoService) {
				var translateService = {
					translateFormConfig: function translateFormConfig(formConfig) {
						platformTranslateService.translateFormConfig(formConfig);
					}
				};

				platformDetailControllerService.initDetailController($scope, businesspartnerMainContactDataService, businessPartnerMainContactValidationService(businesspartnerMainContactDataService),
					businessPartnerMainContactUIStandardService, translateService);

				businessPartnerMainVcardExtension.addVcardSupport($scope, businesspartnerMainContactDataService, photoService);

			}]);
})(angular);