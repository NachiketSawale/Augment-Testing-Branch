/**
 * Created by chk on 10/13/2016.
 */
(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionsystemMainOutputController', [
		'$scope','platformGridAPI','platformGridControllerService',
		'constructionSystemCommonOutputUiStandardService',
		'constructionSystemMainOutputDataService','constructionSystemCommonToolBarService',
		function ($scope,platformGridAPI,platformGridControllerService,uiStandardService,
			dataService,constructionSystemCommonToolBarService) {

			var gridConfig = {
				initCalled:false,
				columns:[],
				grouping:false
			};

			platformGridControllerService.initListController($scope,uiStandardService(moduleName),dataService,null,gridConfig);

			constructionSystemCommonToolBarService.setToolBarItems($scope,dataService);

			function asyncRefreshGridData(data){
				platformGridAPI.items.data($scope.gridId, data);
			}

			dataService.refreshGridData.register(asyncRefreshGridData);

			$scope.$on('$destroy',function(){
				dataService.refreshGridData.unregister(asyncRefreshGridData);
			});

		}
	]);

})(angular);