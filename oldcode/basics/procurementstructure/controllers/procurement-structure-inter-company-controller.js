/**
 * Created by jie on 24/03/2023.
 */
(function (angular) {
	'use strict';
	let moduleName = 'basics.procurementstructure';
	angular.module(moduleName).controller('basicsProcurementStructureInterCompanyController',[
		'$scope', 'platformGridControllerService','basicsProcurementInterCompanyDataService','procurementStructureInterCompanyUIStandardService','procurementStructureInterCompanyValidationService',
		'procurementStructureButtonConfigController',
		function ($scope,platformGridControllerService,basicsProcurementInterCompanyDataService,procurementStructureInterCompanyUIStandardService,procurementStructureInterCompanyValidationService,
			procurementStructureButtonConfigController) {
			var gridConfig = {
				columns: []
			};

			platformGridControllerService.initListController($scope, procurementStructureInterCompanyUIStandardService, basicsProcurementInterCompanyDataService, procurementStructureInterCompanyValidationService, gridConfig);
			let tools =  procurementStructureButtonConfigController.initButton($scope, basicsProcurementInterCompanyDataService);
			if (tools.length > 0) {
				$scope.addTools(tools);
			}
	}
	]);
})(angular);