/**
 * Created by alm on 12/13/2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialReferenceDetailController',
		['$scope', 'basicsMaterialReferenceUIStandardService', 'basicsMaterialReferenceDataService',
			'platformDetailControllerService', 'platformTranslateService', 'basicsMaterialReferenceValidationService',
			function ($scope, UIStandardService, dataService, platformDetailControllerService, platformTranslateService, validationService) {

				//detailControllerService.initDetailController($scope, dataService, validationService(dataService), formConfiguration, translateService);
				// detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);
				platformDetailControllerService.initDetailController($scope,dataService, validationService, UIStandardService, platformTranslateService);

			}]);
})(angular);
