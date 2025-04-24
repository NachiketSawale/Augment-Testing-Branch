(function (angular) {
	'use strict';
	/**
	 * @ngdoc controller
	 * @name constructionSystemMasterGlobalParamGroupDetailController
	 * @require $scope
	 * @description controller for construction System Master Global Param Group detail controller
	 */
	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).controller('constructionSystemMasterGlobalParamGroupDetailController',
		['$scope', 'platformDetailControllerService', 'constructionSystemMasterGlobalParamGroupDataService', 'constructionSystemMasterGlobalParamGroupUiConfigService', 'platformTranslateService','constructionSystemMasterGlobalParamGroupValidationService',
			function ($scope, platformDetailControllerService, dataService, uiStandardService, platformTranslateService, validationService) {

				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiStandardService, {
					getTranslate: function () {
						return platformTranslateService.instant;
					}
				});
			}

		]);
})(angular);