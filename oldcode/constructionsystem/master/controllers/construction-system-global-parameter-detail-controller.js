/**
 * Created by lvy on 5/3/2018.
 */
(function (angular) {
	'use strict';
	var modulename = 'constructionsystem.master';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modulename).controller('constructionSystemMasterGlobalParameterDetailController',
		['$scope', 'constructionSystemMasterGlobalParameterUIStandardService', 'constructionSystemMasterGlobalParameterDataService', 'platformDetailControllerService',
			'platformTranslateService', 'constructionSystemMasterGlobalParameterValidationService',
			function ($scope, formConfiguration, dataService, detailControllerService, translateService, validationService) {
				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);
			}]);
})(angular);