/**
 * Created by wui on 6/5/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).controller('constructionSystemMasterChgOptionGridController',
		['$scope', 'platformGridControllerService', 'constructionSystemMasterChgOptionDataService', 'constructionSystemMasterChgOptionUIStandardService',
			function ($scope, platformGridControllerService, constructionSystemMasterChgOptionDataService, constructionSystemMasterChgOptionUIStandardService) {

				platformGridControllerService.initListController($scope, constructionSystemMasterChgOptionUIStandardService, constructionSystemMasterChgOptionDataService, {}, {});
			}
		]);
})(angular);