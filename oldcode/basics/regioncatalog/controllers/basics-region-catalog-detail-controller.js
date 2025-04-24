/**
 * Created by jhe on 7/23/2018.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.regionCatalog';

	angular.module(moduleName).controller('basicsRegionCatalogDetailController',
		['$scope', 'basicsRegionCatalogService','platformDetailControllerService', 'basicsRegionCatalogUIStandardService', 'platformTranslateService','basicsRegionCatalogValidationService',
			function ($scope, dataService, platformDetailControllerService, formConfig, translateService, validationService) {

				platformDetailControllerService.initDetailController($scope, dataService,validationService, formConfig, translateService);

			}
		]);

})(angular);