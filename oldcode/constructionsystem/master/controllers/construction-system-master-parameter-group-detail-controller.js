/**
 * Created by chk on 12/16/2015.
 */
/* jshint -W072 */
(function (angular) {
	'use strict';
	angular.module('constructionsystem.master').controller('constructionSystemMasterParameterGroupDetailController',
		['$scope', 'platformDetailControllerService', 'constructionSystemMasterParameterGroupDataService',
			'constructionSystemMasterParameterGroupValidationService', 'constructionSystemMasterParameterGroupUIStandardService',
			function ($scope, platformDetailControllerService, ParameterGroupDataService,
				ParameterGroupValidationService, ParameterGroupUIStandardService) {

				platformDetailControllerService.initDetailController($scope, ParameterGroupDataService, ParameterGroupValidationService, ParameterGroupUIStandardService, {});
			}]);
})(angular);