/**
 * Created by xai on 5/7/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';
	angular.module(moduleName).controller('businessPartner2ExternalDetailController', ['$scope', 'platformDetailControllerService', 'businessPartner2ExternalDataService', 'businessPartner2ExternalUIStandardService', 'businessPartner2ExternalValidationService', 'businesspartnerMainTranslationService',
		function ($scope, platformDetailControllerService, businessPartner2ExternalDataService, businessPartner2ExternalUIStandardService, businessPartner2ExternalValidationService, businesspartnerMainTranslationService) {

			platformDetailControllerService.initDetailController($scope, businessPartner2ExternalDataService, businessPartner2ExternalValidationService, businessPartner2ExternalUIStandardService, businesspartnerMainTranslationService);

		}]);
})(angular);