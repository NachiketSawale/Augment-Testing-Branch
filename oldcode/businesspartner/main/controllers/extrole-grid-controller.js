(function (angular) {
	'use strict';
	angular.module('businesspartner.main').controller('businessPartnerMainExtRoleListController',
		['$scope', 'platformGridControllerService', 'businessPartnerMainExtRoleDataService', 'businessPartnerMainExtRoleUIStandardService', 'platformGridAPI','businessPartnerMainExtRoleValidationService',
			function ($scope, platformGridControllerService, businessPartnerMainExtRoleDataService, businessPartnerMainExtRoleUIStandardService, platformGridAPI,businessPartnerMainExtRoleValidationService) {

				let myGridConfig = {initCalled: false, columns: []};

				platformGridControllerService.initListController($scope, businessPartnerMainExtRoleUIStandardService, businessPartnerMainExtRoleDataService, businessPartnerMainExtRoleValidationService,myGridConfig);
			}
		]);
})(angular);