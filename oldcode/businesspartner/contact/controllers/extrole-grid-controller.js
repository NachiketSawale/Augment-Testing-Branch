(function (angular) {
	'use strict';
	angular.module('businesspartner.contact').controller('businessPartnerContactExtRoleListController',
		['$scope', 'platformGridControllerService', 'businessPartnerContactExtRoleDataService', 'businessPartnerContactExtRoleUIStandardService', 'platformGridAPI','businessPartnerContactExtRoleValidationService',
			function ($scope, platformGridControllerService, businessPartnerContactExtRoleDataService, businessPartnerContactExtRoleUIStandardService, platformGridAPI,businessPartnerContactExtRoleValidationService) {

				let myGridConfig = {initCalled: false, columns: []};

				platformGridControllerService.initListController($scope, businessPartnerContactExtRoleUIStandardService, businessPartnerContactExtRoleDataService, businessPartnerContactExtRoleValidationService,myGridConfig);
			}
		]);
})(angular);