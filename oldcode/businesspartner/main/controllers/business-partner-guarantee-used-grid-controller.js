

(function (angular) {
	'use strict';

	let moduleName = 'businesspartner.main';
	angular.module(moduleName).controller('businessPartnerGuaranteeUsedGridController', ['$scope', 'platformGridControllerService', 'businessPartnerGuaranteeUsedDataService', 'businessPartnerGuaranteeUsedUIStandardService',
		function ($scope, platformGridControllerService, businessPartnerGuaranteeUsedDataService, businessPartnerGuaranteeUsedUIStandardService) {

			platformGridControllerService.initListController($scope, businessPartnerGuaranteeUsedUIStandardService, businessPartnerGuaranteeUsedDataService, {}, {initCalled: false, columns: []});

		}]);
})(angular);