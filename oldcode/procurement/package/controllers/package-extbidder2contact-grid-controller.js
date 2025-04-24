/**
 * Created by jie on 2024.08.12
 */
(function (angular) {
	'use strict';
	angular.module('procurement.package').controller('packageExtBidder2ContactGridController',
		[
			'$scope',
			'platformGridControllerService',
			'packageExtBidder2ContactDataService',
			'packageExtBidder2ContactUIStandardService',
			'packageExtBidder2ContactValidationService',
			'procurementContextService',
			'procurementPackageDataService',
			'procurementModuleName',
			function (
				$scope,
				gridControllerService,
				extBidder2ContactDataService,
				gridColumns,
				packageExtBidder2ContactValidationService,
				procurementContextService,
				procurementPackageDataService,
				procurementModuleName) {
				var gridConfig = {
					initCalled: false,
					columns: []
				};
				const moduleName = procurementContextService.getModuleName();
				var leadingService = {};
				if(moduleName === procurementModuleName.packageModule){
					leadingService = procurementPackageDataService;
				}else{
					leadingService = procurementContextService.getLeadingService();
				}
				var containerOption = {
					moduleName:moduleName,
					leadingService: leadingService,
					directParentServiceName: null
				};
				var dataService = extBidder2ContactDataService.createExt2ContactService(containerOption);
				var validationOption = {
					moduleName: procurementContextService.getModuleName(),
					service:dataService
				}
				var validationService = packageExtBidder2ContactValidationService.getExtBidder2ContactValidationService(validationOption);
				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);
			}
		]);
})(angular);