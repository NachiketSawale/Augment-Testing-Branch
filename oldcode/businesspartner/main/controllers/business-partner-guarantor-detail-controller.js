/**
 * Created by wed on 8/25/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';
	angular.module(moduleName).controller('businessPartnerGuarantorFormController', ['$scope', 'platformDetailControllerService', 'businessPartnerGuarantorDataService', 'businessPartnerGuarantorUIStandardService', 'businessPartnerGuarantorValidationService', 'businesspartnerMainTranslationService',
		function ($scope, platformDetailControllerService, businessPartnerGuarantorDataService, businessPartnerGuarantorUIStandardService, businessPartnerGuarantorValidationService, businesspartnerMainTranslationService) {

			platformDetailControllerService.initDetailController($scope, businessPartnerGuarantorDataService, businessPartnerGuarantorValidationService, businessPartnerGuarantorUIStandardService, businesspartnerMainTranslationService);

		}]);
})(angular);