/**
 * Created by xai on 5/7/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';
	angular.module(moduleName).controller('businessPartner2ExternalGridController', ['$scope', 'platformGridControllerService', 'businessPartner2ExternalDataService', 'businessPartner2ExternalUIStandardService', 'businessPartner2ExternalValidationService',
		function ($scope, platformGridControllerService, businessPartner2ExternalDataService, businessPartner2ExternalUIStandardService, businessPartner2ExternalValidationService) {

			platformGridControllerService.initListController($scope, businessPartner2ExternalUIStandardService, businessPartner2ExternalDataService, businessPartner2ExternalValidationService, {initCalled: false, columns: []});

		}]);
})(angular);