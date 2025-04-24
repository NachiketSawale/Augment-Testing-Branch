/**
 * Created by jie on 2024.08.12
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.package';

	angular.module(moduleName).controller('packageExtBidder2ContactFormController',
		['$scope', 'platformDetailControllerService', 'packageExtBidder2ContactDataService',
			'packageExtBidder2ContactUIStandardService', 'platformTranslateService','packageExtBidder2ContactValidationService','procurementContextService',
			function ($scope, platformDetailControllerService, packageExtBidder2ContactDataService,
				uiService, platformTranslateService,packageExtBidder2ContactValidationService,procurementContextService) {
				var option = {
					moduleName: procurementContextService.getModuleName(),
					leadingService: procurementContextService.getLeadingService(),
					directParentServiceName: null
				};
				var dataService = packageExtBidder2ContactDataService.createExt2ContactService(option);
				var validationOption = {
					moduleName: procurementContextService.getModuleName(),
					service:dataService
				}
				var validationService = packageExtBidder2ContactValidationService.getExtBidder2ContactValidationService(validationOption);
				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);

			}]);

})(angular);