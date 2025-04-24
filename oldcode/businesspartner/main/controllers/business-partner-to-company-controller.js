(function () {
	'use strict';

	angular.module('businesspartner.main').controller('businessPartnerMainBP2CompanyListController',
		['$scope', '$timeout', 'businessPartnerMainBP2CompanyDataService', 'businessPartnerMainBusinessPartner2CompanyUIStandardService', 'platformGridControllerService', 'businessPartnerMainBusinessPartner2CompanyValidationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, $timeout, businessPartnerMainBP2CompanyDataService, businessPartnerMainBusinessPartner2CompanyUIStandardService, platformGridControllerService, businessPartnerMainBusinessPartner2CompanyValidationService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack: function () {
						businessPartnerMainBP2CompanyDataService.propertyChanged();
					},
					rowChangeCallBack: function () {
						// TODO chi: workaround - because the container's button's state is not refreshed
						$timeout(function () {
							$scope.$apply();
							// businessPartnerMainBP2CompanyDataService.gridRefresh();
						}, 0);
					}
				};

				platformGridControllerService.initListController($scope, businessPartnerMainBusinessPartner2CompanyUIStandardService, businessPartnerMainBP2CompanyDataService, businessPartnerMainBusinessPartner2CompanyValidationService, myGridConfig);
			}
		]);
})();