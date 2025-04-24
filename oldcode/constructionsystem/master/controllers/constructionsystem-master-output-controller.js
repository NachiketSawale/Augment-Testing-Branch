/**
 * Created by wui on 12/22/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionsystemMasterOutputController', [
		'$scope','platformGridControllerService',
		'constructionSystemCommonOutputUiStandardService',
		'constructionSystemMasterOutputDataService','constructionSystemCommonToolBarService',
		function ($scope,platformGridControllerService,uiStandardService,
			dataService,constructionSystemCommonToolBarService) {

			var gridConfig = {
				initCalled:false,
				columns:[],
				grouping:false
			};

			platformGridControllerService.initListController($scope,uiStandardService(moduleName),dataService,null,gridConfig);

			constructionSystemCommonToolBarService.setToolBarItems($scope,dataService);


		}
	]);

})(angular);