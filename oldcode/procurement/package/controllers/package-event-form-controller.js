/**
 * Created by wuj on 8/19/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.package';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementPackageEventFormController',
		['$scope', 'platformDetailControllerService', 'procurementPackageEventService',
			'procurementPackageEventUIStandardService', 'platformTranslateService',
			function ($scope, platformDetailControllerService, procurementPackageEventService,
				uiService, platformTranslateService) {

				var loadRes = procurementPackageEventService.loadControllerInitData();
				platformDetailControllerService.initDetailController($scope, loadRes.dataService, loadRes.validationService, uiService, platformTranslateService);
				if (!loadRes.isPackageModule) {
					delete $scope.formContainerOptions.createBtnConfig;
					delete $scope.formContainerOptions.deleteBtnConfig;
				}
			}]);

})(angular);