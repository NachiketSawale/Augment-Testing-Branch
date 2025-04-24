/**
 * Created by jie on 15/03/2023.
 */
(function (angular) {
	'use strict';
	let moduleName='basics.company';
	angular.module(moduleName).controller('basicsCompanyICPartnerCardListController',[
		'$scope','platformGridControllerService','cloudDesktopSidebarService','basicsCompanyICPartnerCardDataService','$rootScope',
		'basicsCompanyICPartnerUIStandardService','basicsCompanyICPartnerCardValidationServiceProcessor',
		function ($scope,platformGridControllerService,cloudDesktopSidebarService,basicsCompanyICPartnerCardDataService,$rootScope,
			basicsCompanyICPartnerUIStandardService,basicsCompanyICPartnerCardValidationServiceProcessor) {
			var gridConfig = {
				columns: []
			};
			platformGridControllerService.initListController($scope, basicsCompanyICPartnerUIStandardService, basicsCompanyICPartnerCardDataService, basicsCompanyICPartnerCardValidationServiceProcessor, gridConfig);
		}
	]);
})(angular);