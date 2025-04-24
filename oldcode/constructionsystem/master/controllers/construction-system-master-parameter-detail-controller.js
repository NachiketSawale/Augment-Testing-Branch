/**
 * Created by wuj on 1/16/2015.
 */

(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module('constructionsystem.master').controller('constructionSystemMasterParameterDetailController',
		['$scope', 'constructionSystemMasterParameterUIStandardService', 'constructionSystemMasterParameterDataService', 'platformDetailControllerService',
			'platformTranslateService', 'constructionSystemMasterParameterValidationService',
			function ($scope, formConfiguration, dataService, detailControllerService, translateService, validationService) {
				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);





			}]);
})(angular);
