(function (angular) {
	'use strict';
	angular.module('businesspartner.main').controller('businessPartnerMainRegionListController',
		['$scope', 'platformGridControllerService', 'businessPartnerMainRegionDataService', 'businessPartnerMainRegionUIStandardService', 'platformGridAPI', 'businessPartnerMainRegionValidationService',
			function ($scope, platformGridControllerService, businessPartnerMainRegionDataService, businessPartnerMainRegionUIStandardService, platformGridAPI, businessPartnerMainRegionValidationService) {

				let myGridConfig = {initCalled: false, columns: []};

				platformGridControllerService.initListController($scope, businessPartnerMainRegionUIStandardService, businessPartnerMainRegionDataService, businessPartnerMainRegionValidationService, myGridConfig);
			}
		]);
})(angular);