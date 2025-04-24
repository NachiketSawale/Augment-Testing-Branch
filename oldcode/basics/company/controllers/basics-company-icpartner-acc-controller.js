/**
 * Created by jie on 20/03/2023.
 */
(function (angular) {
	'use strict';
	let moduleName='basics.company';
	angular.module(moduleName).controller('basicsCompanyICPartnerAccListController',[
		'$scope','platformGridControllerService','cloudDesktopSidebarService','basicsCompanyICPartnerAccDataService','$rootScope',
		'basicsCompanyICPartnerAccUIStandardService','basicsCompanyICPartnerCardValidationServiceProcessor',
		function ($scope,platformGridControllerService,cloudDesktopSidebarService,basicsCompanyICPartnerAccDataService,$rootScope,
			basicsCompanyICPartnerAccUIStandardService,basicsCompanyICPartnerCardValidationServiceProcessor) {
			var gridConfig = {
				columns: []
			};
			platformGridControllerService.initListController($scope, basicsCompanyICPartnerAccUIStandardService, basicsCompanyICPartnerAccDataService, basicsCompanyICPartnerCardValidationServiceProcessor, gridConfig);
		}
	]);
})(angular);