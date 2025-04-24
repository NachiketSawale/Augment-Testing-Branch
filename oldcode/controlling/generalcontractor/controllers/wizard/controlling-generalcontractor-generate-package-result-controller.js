
/* global globals */
(function(angular){
	'use strict';

	let moduleName = 'controlling.generalcontractor';
	angular.module(moduleName).controller('controllingGeneralcontractorGeneratePackageResultController',['$scope',
		'$http','$injector','$q','$translate','platformGridAPI','$timeout','controllingGeneralContractorCreatePackagesWizardDialogService','platformModuleNavigationService',
		function ($scope,$http,$injector,$q,$translate,platformGridAPI,$timeout,controllingGeneralContractorCreatePackagesWizardDialogService,platformModuleNavigationService) {


			let packageIds = [];
			$scope.title = $translate.instant('estimate.main.createMaterialPackageWizard.goToPackage');
			$scope.path = globals.appBaseUrl;

			$scope.onOk = function () {
				$injector.get ('controllingGeneralContractorPackagesDataService').load ();
				$injector.get ('controllingGeneralcontractorCostControlDataService').refresh ();
				$scope.$close(false);
			};

			$scope.navigate = function () {
				$scope.$close(false);
				platformModuleNavigationService.navigate({
					moduleName: 'procurement.package'
				}, packageIds, 'PrcPackageFk');
			};

			function  init(){
				let packageResult = controllingGeneralContractorCreatePackagesWizardDialogService.getGeneratePackage();
				if(packageResult) {
					packageIds.push(packageResult.Id);
					$scope.message = $translate.instant('controlling.generalcontractor.CreatePackageWizardResult',{'packageCode': packageResult.Code});
				}
			}
			init();
		}]);

})(angular);
