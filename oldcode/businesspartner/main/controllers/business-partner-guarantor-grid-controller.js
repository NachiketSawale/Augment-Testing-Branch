/**
 * Created by wed on 8/25/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';
	angular.module(moduleName).controller('businessPartnerGuarantorGridController', ['$scope', 'platformGridControllerService', 'businessPartnerGuarantorDataService', 'businessPartnerGuarantorUIStandardService', 'businessPartnerGuarantorValidationService',
		function ($scope, platformGridControllerService, businessPartnerGuarantorDataService, businessPartnerGuarantorUIStandardService, businessPartnerGuarantorValidationService) {

			platformGridControllerService.initListController($scope, businessPartnerGuarantorUIStandardService, businessPartnerGuarantorDataService, businessPartnerGuarantorValidationService, {initCalled: false, columns: []});

		}]);
})(angular);
