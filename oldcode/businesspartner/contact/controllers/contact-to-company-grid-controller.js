(function () {
	'use strict';

	angular.module('businesspartner.contact').controller('businessPartnerContact2CompanyListController',
		['$scope', '$timeout', 'businessPartnerContact2CompanyDataService', 'businessPartnerContact2CompanyUIStandardService', 'platformGridControllerService', 'businessPartnerContact2CompanyValidationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, $timeout, businessPartnerContact2CompanyDataService, businessPartnerContact2CompanyUIStandardService, platformGridControllerService, businessPartnerContact2CompanyValidationService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack: function () {
						businessPartnerContact2CompanyDataService.propertyChanged();
					},
					rowChangeCallBack: function () {
						$timeout(function () {
							$scope.$apply();
						}, 0);
					}
				};

				platformGridControllerService.initListController($scope, businessPartnerContact2CompanyUIStandardService, businessPartnerContact2CompanyDataService, businessPartnerContact2CompanyValidationService, myGridConfig);
			}
		]);
})();