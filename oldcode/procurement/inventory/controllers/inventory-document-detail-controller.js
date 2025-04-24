/**
 * Created by pel on 7/10/2019.
 */

(function (angular) {
	'use strict';
	var moduleName='procurement.inventory';
	angular.module(moduleName).controller('inventoryDocumentDetailController',
		['$scope', 'platformDetailControllerService','inventoryDocumentDataService','inventoryDocumentValidationService','inventoryDocumentUIStandardService','platformTranslateService',
			function ($scope, platformDetailControllerService,dataService,validationService,formConfiguration,translateService) {
				platformDetailControllerService.initDetailController($scope, dataService,validationService,formConfiguration,translateService);
			}
		]
	);
})(angular);
