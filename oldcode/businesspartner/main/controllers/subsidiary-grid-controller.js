(function () {
	'use strict';

	angular.module('businesspartner.main').controller('businesspartnerMainSubsidiaryListController',
		['$injector', '$scope', 'businesspartnerMainSubsidiaryDataService', 'businessPartnerMainSubsidiaryUIStandardService', 'platformGridControllerService', 'businesspartnerMainSubsidiaryValidationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($injector, $scope, businesspartnerMainSubsidiaryDataService, businessPartnerMainSubsidiaryUIStandardService, platformGridControllerService, businesspartnerMainSubsidiaryValidationService) {

				let myGridConfig = {
					initCalled: false, columns: [], rowChangeCallBack: function () {
					}, cellChangeCallBack: function () {
					}
				};

				let validator = businesspartnerMainSubsidiaryValidationService(businesspartnerMainSubsidiaryDataService);
				platformGridControllerService.initListController($scope, businessPartnerMainSubsidiaryUIStandardService, businesspartnerMainSubsidiaryDataService, validator, myGridConfig);

				let inquiryService = $injector.get('cloudDesktopSidebarInquiryService');
				inquiryService.handleInquiryToolbarButtons($scope, false/* include all button */);

			}
		]);
})();