/**
 * Created by wui on 6/5/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).controller('constructionSystemMainChgOptionListController',
		['$scope', 'platformGridControllerService', 'constructionSystemMainChgOptionDataService', 'constructionSystemMasterChgOptionUIStandardService',
			function ($scope, platformGridControllerService, constructionSystemMainChgOptionDataService, constructionSystemMasterChgOptionUIStandardService) {

				platformGridControllerService.initListController($scope, constructionSystemMasterChgOptionUIStandardService, constructionSystemMainChgOptionDataService, {}, {});
			}
		]);
})(angular);