/**
 * Created by jhe on 7/26/2018.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.regionCatalog';

	angular.module(moduleName).controller('basicsRegionTypeDetailController',
		['$scope', 'basicsRegionTypeMainService','platformDetailControllerService', 'basicsRegionTypeUIStandardService', 'platformTranslateService',
			function ($scope, dataService, platformDetailControllerService, formConfig, translateService) {

				platformDetailControllerService.initDetailController($scope, dataService,{}, formConfig, translateService);

			}
		]);

})(angular);